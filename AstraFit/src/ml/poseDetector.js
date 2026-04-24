/**
 * poseDetector.js
 * Loads MoveNet Lightning DIRECTLY from TFHub as a graph model.
 * No @tensorflow-models/pose-detection needed — eliminates all transitive deps.
 *
 * MoveNet Lightning:
 *   Input:  [1, 192, 192, 3]  int32  (RGB image)
 *   Output: [1, 1, 17, 3]            [y_norm, x_norm, confidence] per keypoint
 *
 * Keypoint order (MoveNet standard):
 *   0:nose 1:l_eye 2:r_eye 3:l_ear 4:r_ear
 *   5:l_shoulder 6:r_shoulder 7:l_elbow 8:r_elbow 9:l_wrist 10:r_wrist
 *   11:l_hip 12:r_hip 13:l_knee 14:r_knee 15:l_ankle 16:r_ankle
 */

import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

const MOVENET_URL =
  'https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4/model.json';

const MODEL_INPUT_SIZE = 192;

const KP_NAMES = [
  'nose', 'left_eye', 'right_eye', 'left_ear', 'right_ear',
  'left_shoulder', 'right_shoulder',
  'left_elbow', 'right_elbow',
  'left_wrist', 'right_wrist',
  'left_hip', 'right_hip',
  'left_knee', 'right_knee',
  'left_ankle', 'right_ankle',
];

let detector = null;
let tf = null;
let isLoading = false;
let loadError = null;

/** Load TFjs + CPU backend + MoveNet graph model (one-time, cached). */
export const loadPoseDetector = async () => {
  if (detector) return detector;
  if (isLoading) {
    await new Promise((resolve) => {
      const t = setInterval(() => { if (!isLoading) { clearInterval(t); resolve(); } }, 300);
    });
    return detector;
  }

  isLoading = true;
  try {
    tf = require('@tensorflow/tfjs');
    require('@tensorflow/tfjs-backend-cpu');
    await tf.setBackend('cpu');
    await tf.ready();
    console.log('[PoseDetector] TF ready, backend:', tf.getBackend());

    detector = await tf.loadGraphModel(MOVENET_URL);
    console.log('[PoseDetector] MoveNet Lightning loaded ✓');

    // Warm up the model with a dummy tensor
    const dummy = tf.zeros([1, MODEL_INPUT_SIZE, MODEL_INPUT_SIZE, 3], 'int32');
    const warmup = await detector.predict(dummy);
    dummy.dispose();
    warmup.dispose();
    console.log('[PoseDetector] Warmup complete ✓');

    loadError = null;
    return detector;
  } catch (err) {
    loadError = err;
    console.error('[PoseDetector] Load failed:', err.message);
    throw err;
  } finally {
    isLoading = false;
  }
};

/**
 * Capture a camera frame, decode it, run MoveNet, return keypoints.
 * @param {React.RefObject} cameraRef
 * @returns {Array|null} keypoints [{name, x, y, score}] normalised [0,1]
 */
export const detectPoseFromCamera = async (cameraRef) => {
  if (!cameraRef?.current) return null;
  if (!detector) await loadPoseDetector();

  let photo;
  try {
    photo = await cameraRef.current.takePictureAsync({
      quality: 0.2,
      base64: false,
      skipProcessing: true,
      exif: false,
    });
  } catch {
    return null;
  }

  if (!photo?.uri) return null;

  try {
    // ── Resize to 192×192 using expo-image-manipulator ──────────────────
    const resized = await ImageManipulator.manipulateAsync(
      photo.uri,
      [{ resize: { width: MODEL_INPUT_SIZE, height: MODEL_INPUT_SIZE } }],
      { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );

    if (!resized.base64) return null;

    // ── Decode JPEG base64 → raw pixel bytes ─────────────────────────────
    const jpegJs = require('jpeg-js');
    const raw = atob(resized.base64);
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
    const decoded = jpegJs.decode(bytes, { useTArray: true });

    // ── Build RGB tensor [1, 192, 192, 3] int32 ──────────────────────────
    const rgbData = new Int32Array(MODEL_INPUT_SIZE * MODEL_INPUT_SIZE * 3);
    let dst = 0;
    for (let i = 0; i < decoded.data.length; i += 4) {
      rgbData[dst++] = decoded.data[i];     // R
      rgbData[dst++] = decoded.data[i + 1]; // G
      rgbData[dst++] = decoded.data[i + 2]; // B
      // skip A
    }

    // ── Run inference ────────────────────────────────────────────────────
    const inputTensor = tf.tensor(rgbData, [1, MODEL_INPUT_SIZE, MODEL_INPUT_SIZE, 3], 'int32');
    const output = detector.predict(inputTensor);
    inputTensor.dispose();

    // Output shape: [1, 1, 17, 3]
    const keypointsData = await output.data();
    output.dispose();

    // ── Parse keypoints ──────────────────────────────────────────────────
    const keypoints = [];
    for (let i = 0; i < 17; i++) {
      const base = i * 3;
      keypoints.push({
        name: KP_NAMES[i],
        y: keypointsData[base],       // already normalised [0,1] by MoveNet
        x: keypointsData[base + 1],
        score: keypointsData[base + 2],
      });
    }

    return keypoints;
  } catch (err) {
    console.warn('[PoseDetector] Frame inference error:', err.message);
    return null;
  }
};

export const getLoadError = () => loadError;
export const isDetectorReady = () => detector !== null;
