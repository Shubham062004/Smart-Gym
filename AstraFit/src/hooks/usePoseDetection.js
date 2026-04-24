/**
 * usePoseDetection.js
 * React hook — loads MoveNet and runs inference on camera frames every ~250ms.
 * Returns live keypoints, posture score, per-joint metrics, and feedback text.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { loadPoseDetector, detectPoseFromCamera, getLoadError } from '../ml/poseDetector';
import { analyzePosture } from '../ml/postureAnalyzer';

const INFERENCE_INTERVAL_MS = 250; // ~4 FPS analysis (CPU backend)

export const usePoseDetection = ({
  cameraRef,
  exerciseId = 'squats',
  active = false,
}) => {
  const [keypoints, setKeypoints] = useState([]);
  const [score, setScore] = useState(0);
  const [metrics, setMetrics] = useState([]);
  const [feedback, setFeedback] = useState('Position yourself in frame');
  const [modelReady, setModelReady] = useState(false);
  const [modelError, setModelError] = useState(null);

  const intervalRef = useRef(null);
  const isRunning = useRef(false);

  // ── Load model once on mount ──────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      try {
        setFeedback('Loading AI model…');
        await loadPoseDetector();
        if (!cancelled) {
          setModelReady(true);
          setFeedback('Step into frame and press ▶');
        }
      } catch (err) {
        if (!cancelled) {
          const msg = err.message || 'Model failed to load';
          setModelError(msg);
          setFeedback('AI offline – check internet');
        }
      }
    };
    init();
    return () => { cancelled = true; };
  }, []);

  // ── Per-frame inference ───────────────────────────────────────────────────
  const runInference = useCallback(async () => {
    if (isRunning.current) return;
    if (!modelReady) return;

    isRunning.current = true;
    try {
      const kps = await detectPoseFromCamera(cameraRef);

      if (kps && kps.length >= 10) {
        setKeypoints(kps);
        const { score: s, metrics: m, feedback: f } = analyzePosture(kps, exerciseId);
        setScore(s);
        setMetrics(m);
        setFeedback(f);
      } else {
        setKeypoints([]);
        setScore(0);
        setMetrics([]);
        setFeedback('No person detected – step back');
      }
    } catch (err) {
      console.warn('[usePoseDetection] Inference error:', err.message);
    } finally {
      isRunning.current = false;
    }
  }, [cameraRef, modelReady, exerciseId]);

  // ── Start/stop loop based on `active` ─────────────────────────────────────
  useEffect(() => {
    if (active && modelReady) {
      intervalRef.current = setInterval(runInference, INFERENCE_INTERVAL_MS);
    } else {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => clearInterval(intervalRef.current);
  }, [active, modelReady, runInference]);

  return { keypoints, score, metrics, feedback, modelReady, modelError };
};
