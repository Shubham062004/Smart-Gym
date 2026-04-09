/**
 * PoseDetectionView.jsx
 *
 * A HIDDEN WebView that runs TFjs + MoveNet inference in the browser JS engine
 * (WebGL GPU). It does NOT access the camera itself.
 *
 * Frame processing flow:
 *   React Native CameraView → takePictureAsync (base64)
 *     → injectJavaScript("window.processFrame('<base64>')")
 *       → WebView: decode JPEG → run MoveNet → postMessage(keypoints)
 *         → onKeypoints callback in React Native
 *
 * This way CameraView handles camera (works in Expo Go) and TFjs handles ML
 * (works with WebGL in the browser context, no Metro bundling issues).
 */

import React, { useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const ML_HTML = `<!DOCTYPE html>
<html><head>
  <meta charset="utf-8">
  <style>html,body{margin:0;padding:0;background:#000;width:100%;height:100%;}</style>
</head><body>
<canvas id="c" style="display:none"></canvas>
<script>
(function(){
  'use strict';

  var KP_NAMES = [
    'nose','left_eye','right_eye','left_ear','right_ear',
    'left_shoulder','right_shoulder',
    'left_elbow','right_elbow',
    'left_wrist','right_wrist',
    'left_hip','right_hip',
    'left_knee','right_knee',
    'left_ankle','right_ankle'
  ];

  function post(obj){
    var msg = JSON.stringify(obj);
    if(window.ReactNativeWebView){ window.ReactNativeWebView.postMessage(msg); }
  }

  function loadScript(src){
    return new Promise(function(res,rej){
      var s=document.createElement('script');
      s.src=src; s.onload=res; s.onerror=rej;
      document.head.appendChild(s);
    });
  }

  var detector = null;
  var processing = false;

  /* Called by React Native via injectJavaScript */
  window.processFrame = function(b64jpeg){
    if(!detector || processing) return;
    processing = true;

    var img = new Image();
    img.onload = async function(){
      try{
        var result = await detector.estimatePoses(img);
        var pose   = result && result[0];
        if(pose && pose.keypoints){
          var W = img.naturalWidth || 192;
          var H = img.naturalHeight || 192;
          var kps = pose.keypoints.map(function(kp,i){
            return {
              name:  KP_NAMES[i] || kp.name,
              x:     kp.x / W,
              y:     kp.y / H,
              score: kp.score
            };
          });
          var detected = kps.filter(function(k){ return k.score > 0.3; }).length > 8;
          post({ type:'keypoints', keypoints:kps, detected:detected });
        } else {
          post({ type:'keypoints', keypoints:[], detected:false });
        }
      } catch(e){
        post({ type:'keypoints', keypoints:[], detected:false });
      } finally {
        processing = false;
      }
    };
    img.onerror = function(){ processing = false; };
    img.src = 'data:image/jpeg;base64,' + b64jpeg;
  };

  async function init(){
    try{
      post({ type:'status', message:'Loading TFjs...' });
      await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js');
      post({ type:'status', message:'Loading MoveNet...' });
      await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection@2.1.3/dist/pose-detection.js');

      detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
          enableSmoothing: true,
          minPoseScore: 0.2
        }
      );

      /* Warm up with blank image */
      var dummy = new Image(192,192);
      var canvas = document.createElement('canvas');
      canvas.width = canvas.height = 192;
      dummy.src = canvas.toDataURL();
      dummy.onload = async function(){
        try{ await detector.estimatePoses(dummy); }catch(_){}
        post({ type:'ready', message:'MoveNet ready' });
      };
    } catch(e){
      post({ type:'error', message: e.message || 'Init failed' });
    }
  }

  init();
})();
</script>
</body></html>`;

const PoseDetectionView = forwardRef(function PoseDetectionView(
  { onKeypoints, onModelReady, onError, onStatus },
  ref
) {
  const webviewRef = useRef(null);

  /* Expose processFrame() to parent via ref */
  useImperativeHandle(ref, () => ({
    processFrame: (base64jpeg) => {
      if (!webviewRef.current || !base64jpeg) return;
      /* Strip any data-URI prefix if present */
      const b64 = base64jpeg.replace(/^data:image\/\w+;base64,/, '');
      const js = `window.processFrame && window.processFrame(${JSON.stringify(b64)}); void(0);`;
      webviewRef.current.injectJavaScript(js);
    },
  }), []);

  const handleMessage = useCallback((event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'keypoints' && onKeypoints) {
        onKeypoints(data.keypoints, data.detected);
      } else if (data.type === 'ready' && onModelReady) {
        onModelReady();
      } else if (data.type === 'error' && onError) {
        onError(data.message);
      } else if (data.type === 'status' && onStatus) {
        onStatus(data.message);
      }
    } catch (_) {}
  }, [onKeypoints, onModelReady, onError, onStatus]);

  return (
    <WebView
      ref={webviewRef}
      source={{ html: ML_HTML }}
      style={styles.hidden}
      javaScriptEnabled={true}
      originWhitelist={['*']}
      mixedContentMode="always"
      domStorageEnabled={true}
      cacheEnabled={true}
      onMessage={handleMessage}
    />
  );
});

const styles = StyleSheet.create({
  /* Hidden — 1×1 off-screen, still renders its JS */
  hidden: { width: 1, height: 1, position: 'absolute', opacity: 0, top: -10, left: -10 },
});

export default PoseDetectionView;
