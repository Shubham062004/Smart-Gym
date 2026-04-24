/**
 * postureAnalyzer.js
 * Computes joint angles from MoveNet keypoints and scores posture
 * for common gym exercises (squats, pushups, deadlifts, lunges, bicep curls).
 *
 * All coordinates are normalised [0,1].
 */

// ─── Geometry Helpers ────────────────────────────────────────────────────────

/**
 * Compute the angle (degrees) at the vertex formed by three points.
 * A → B → C  (B is the vertex / joint)
 */
export const computeAngle = (A, B, C) => {
  const radians =
    Math.atan2(C.y - B.y, C.x - B.x) - Math.atan2(A.y - B.y, A.x - B.x);
  let angle = Math.abs((radians * 180) / Math.PI);
  if (angle > 180) angle = 360 - angle;
  return angle;
};

/** Extract a keypoint by name; returns null if not confident enough. */
const kp = (keypoints, name, minScore = 0.3) => {
  const k = keypoints.find((k) => k.name === name);
  return k && k.score >= minScore ? k : null;
};

// ─── Per-Exercise Analyzers ───────────────────────────────────────────────────

/**
 * SQUATS – checks knee angle, hip flexion, back alignment
 */
const analyzeSquat = (keypoints) => {
  const metrics = [];
  let totalScore = 100;

  // Left knee angle
  const lHip = kp(keypoints, 'left_hip');
  const lKnee = kp(keypoints, 'left_knee');
  const lAnkle = kp(keypoints, 'left_ankle');

  // Right knee angle
  const rHip = kp(keypoints, 'right_hip');
  const rKnee = kp(keypoints, 'right_knee');
  const rAnkle = kp(keypoints, 'right_ankle');

  // Back alignment (shoulder → hip → knee)
  const lShoulder = kp(keypoints, 'left_shoulder');
  const rShoulder = kp(keypoints, 'right_shoulder');

  if (lHip && lKnee && lAnkle) {
    const kneeAngle = computeAngle(lHip, lKnee, lAnkle);
    const depthGood = kneeAngle <= 100; // ≤100° = parallel or below
    const penalty = depthGood ? 0 : Math.min(30, (kneeAngle - 100) * 0.5);
    totalScore -= penalty;
    metrics.push({
      name: 'KNEE DEPTH',
      value: Math.round(kneeAngle),
      unit: '°',
      status: depthGood ? 'GOOD' : 'TOO HIGH',
      color: depthGood ? '#0df20d' : '#f97316',
      fillPct: Math.max(0, Math.min(1, (180 - kneeAngle) / 90)),
    });
  }

  if (lShoulder && lHip && lKnee) {
    const backAngle = computeAngle(lShoulder, lHip, lKnee);
    const straight = backAngle >= 150;
    const penalty = straight ? 0 : Math.min(20, (150 - backAngle) * 0.4);
    totalScore -= penalty;
    metrics.push({
      name: 'BACK ALIGNMENT',
      value: Math.round(backAngle),
      unit: '°',
      status: straight ? 'STRAIGHT' : 'ROUNDING',
      color: straight ? '#0df20d' : '#ef4444',
      fillPct: Math.max(0, Math.min(1, backAngle / 180)),
    });
  }

  if (lHip && rHip && lShoulder && rShoulder) {
    const hipWidth = Math.abs(lHip.x - rHip.x);
    const shoulderWidth = Math.abs(lShoulder.x - rShoulder.x);
    const ratio = hipWidth / (shoulderWidth || 1);
    const good = ratio >= 0.8;
    totalScore -= good ? 0 : 10;
    metrics.push({
      name: 'STANCE WIDTH',
      value: Math.round(ratio * 100),
      unit: '%',
      status: good ? 'OPTIMAL' : 'TOO NARROW',
      color: good ? '#0df20d' : '#f97316',
      fillPct: Math.max(0, Math.min(1, ratio)),
    });
  }

  return { metrics, score: Math.max(0, Math.round(totalScore)) };
};

/**
 * PUSHUPS – checks elbow angle, body plank line
 */
const analyzePushup = (keypoints) => {
  const metrics = [];
  let totalScore = 100;

  const lShoulder = kp(keypoints, 'left_shoulder');
  const lElbow = kp(keypoints, 'left_elbow');
  const lWrist = kp(keypoints, 'left_wrist');
  const lHip = kp(keypoints, 'left_hip');
  const lAnkle = kp(keypoints, 'left_ankle');

  if (lShoulder && lElbow && lWrist) {
    const elbowAngle = computeAngle(lShoulder, lElbow, lWrist);
    const good = elbowAngle <= 100;
    totalScore -= good ? 0 : Math.min(25, (elbowAngle - 100) * 0.5);
    metrics.push({
      name: 'ELBOW DEPTH',
      value: Math.round(elbowAngle),
      unit: '°',
      status: elbowAngle > 160 ? 'LOCKOUT' : good ? 'DEEP' : 'PARTIAL',
      color: good ? '#0df20d' : '#f97316',
      fillPct: Math.max(0, Math.min(1, (180 - elbowAngle) / 90)),
    });
  }

  if (lShoulder && lHip && lAnkle) {
    const plankAngle = computeAngle(lShoulder, lHip, lAnkle);
    const straight = plankAngle >= 160;
    totalScore -= straight ? 0 : Math.min(30, (160 - plankAngle) * 0.6);
    metrics.push({
      name: 'PLANK LINE',
      value: Math.round(plankAngle),
      unit: '°',
      status: straight ? 'STRAIGHT' : plankAngle < 140 ? 'SAGGING' : 'SLIGHT BREAK',
      color: straight ? '#0df20d' : '#ef4444',
      fillPct: Math.max(0, Math.min(1, plankAngle / 180)),
    });
  }

  return { metrics, score: Math.max(0, Math.round(totalScore)) };
};

/**
 * BICEP CURL – checks elbow angle, shoulder stability
 */
const analyzeBicepCurl = (keypoints) => {
  const metrics = [];
  let totalScore = 100;

  const lShoulder = kp(keypoints, 'left_shoulder');
  const lElbow = kp(keypoints, 'left_elbow');
  const lWrist = kp(keypoints, 'left_wrist');
  const rShoulder = kp(keypoints, 'right_shoulder');
  const rElbow = kp(keypoints, 'right_elbow');
  const rWrist = kp(keypoints, 'right_wrist');

  const side = lElbow && lShoulder && lWrist ? 'left' : 'right';
  const sh = side === 'left' ? lShoulder : rShoulder;
  const el = side === 'left' ? lElbow : rElbow;
  const wr = side === 'left' ? lWrist : rWrist;

  if (sh && el && wr) {
    const curAngle = computeAngle(sh, el, wr);
    metrics.push({
      name: 'CURL ANGLE',
      value: Math.round(curAngle),
      unit: '°',
      status: curAngle < 50 ? 'TOP' : curAngle > 150 ? 'BOTTOM' : 'MOVING',
      color: '#0df20d',
      fillPct: Math.max(0, Math.min(1, 1 - curAngle / 180)),
    });

    // Penalise shoulder swing: elbow should stay close to body
    if (sh) {
      const elbowDrift = Math.abs(el.x - sh.x);
      const drifting = elbowDrift > 0.08;
      totalScore -= drifting ? 20 : 0;
      metrics.push({
        name: 'ELBOW STABILITY',
        value: Math.round(elbowDrift * 100),
        unit: '%',
        status: drifting ? 'SWINGING' : 'LOCKED',
        color: drifting ? '#ef4444' : '#0df20d',
        fillPct: Math.max(0, 1 - elbowDrift * 10),
      });
    }
  }

  return { metrics, score: Math.max(0, Math.round(totalScore)) };
};

/**
 * DEADLIFT – hip hinge angle, back straightness
 */
const analyzeDeadlift = (keypoints) => {
  const metrics = [];
  let totalScore = 100;

  const lShoulder = kp(keypoints, 'left_shoulder');
  const lHip = kp(keypoints, 'left_hip');
  const lKnee = kp(keypoints, 'left_knee');
  const lAnkle = kp(keypoints, 'left_ankle');

  if (lShoulder && lHip && lKnee) {
    const hipHinge = computeAngle(lShoulder, lHip, lKnee);
    const good = hipHinge >= 45 && hipHinge <= 100;
    totalScore -= good ? 0 : 20;
    metrics.push({
      name: 'HIP HINGE',
      value: Math.round(hipHinge),
      unit: '°',
      status: good ? 'OPTIMAL' : hipHinge < 45 ? 'TOO UPRIGHT' : 'TOO BENT',
      color: good ? '#0df20d' : '#f97316',
      fillPct: Math.max(0, Math.min(1, hipHinge / 90)),
    });
  }

  if (lShoulder && lHip && lAnkle) {
    const backAngle = computeAngle(lShoulder, lHip, lAnkle);
    const straight = backAngle >= 140;
    totalScore -= straight ? 0 : Math.min(30, (140 - backAngle) * 0.6);
    metrics.push({
      name: 'BACK STRAIGHT',
      value: Math.round(backAngle),
      unit: '°',
      status: straight ? 'NEUTRAL' : 'ROUNDING',
      color: straight ? '#0df20d' : '#ef4444',
      fillPct: Math.max(0, Math.min(1, backAngle / 180)),
    });
  }

  return { metrics, score: Math.max(0, Math.round(totalScore)) };
};

/**
 * LUNGES – knee tracking, trunk upright
 */
const analyzeLunge = (keypoints) => {
  const metrics = [];
  let totalScore = 100;

  const lHip = kp(keypoints, 'left_hip');
  const lKnee = kp(keypoints, 'left_knee');
  const lAnkle = kp(keypoints, 'left_ankle');
  const lShoulder = kp(keypoints, 'left_shoulder');

  if (lHip && lKnee && lAnkle) {
    const kneeAngle = computeAngle(lHip, lKnee, lAnkle);
    const good = kneeAngle <= 100;
    totalScore -= good ? 0 : Math.min(25, (kneeAngle - 100) * 0.5);
    metrics.push({
      name: 'FRONT KNEE',
      value: Math.round(kneeAngle),
      unit: '°',
      status: good ? 'DEEP' : 'SHALLOW',
      color: good ? '#0df20d' : '#f97316',
      fillPct: Math.max(0, Math.min(1, (180 - kneeAngle) / 90)),
    });
  }

  if (lShoulder && lHip && lKnee) {
    const trunkAngle = computeAngle(lShoulder, lHip, lKnee);
    const upright = trunkAngle >= 150;
    totalScore -= upright ? 0 : 20;
    metrics.push({
      name: 'TRUNK UPRIGHT',
      value: Math.round(trunkAngle),
      unit: '°',
      status: upright ? 'STRAIGHT' : 'LEANING',
      color: upright ? '#0df20d' : '#f97316',
      fillPct: Math.max(0, Math.min(1, trunkAngle / 180)),
    });
  }

  return { metrics, score: Math.max(0, Math.round(totalScore)) };
};

// ─── Exercise ID → Analyzer Map ───────────────────────────────────────────────

const ANALYZERS = {
  squats: analyzeSquat,
  pushups: analyzePushup,
  bicep_curl: analyzeBicepCurl,
  deadlift: analyzeDeadlift,
  lunges: analyzeLunge,
};

/**
 * Main entry point.
 * @param {Array}  keypoints   – normalised keypoints from detectPose()
 * @param {string} exerciseId  – e.g. 'squats' | 'pushups' | …
 * @returns {{ score: number, metrics: Array, feedback: string }}
 */
export const analyzePosture = (keypoints, exerciseId = 'squats') => {
  if (!keypoints || keypoints.length === 0) {
    return { score: 0, metrics: [], feedback: 'No pose detected' };
  }

  const analyze = ANALYZERS[exerciseId] || analyzeSquat;
  const { score, metrics } = analyze(keypoints);

  const feedback =
    score >= 90
      ? '✅ Excellent form!'
      : score >= 75
      ? '⚠️ Good – minor adjustments needed'
      : score >= 55
      ? '🔶 Check your posture'
      : '❌ Poor form – reduce weight';

  return { score, metrics, feedback };
};

// ─── Skeleton Connection Map ──────────────────────────────────────────────────
// Pairs of keypoint names that form bones to draw on the overlay

export const SKELETON_CONNECTIONS = [
  // Face
  ['left_eye', 'right_eye'],
  ['left_eye', 'nose'],
  ['right_eye', 'nose'],
  // Upper body
  ['left_shoulder', 'right_shoulder'],
  ['left_shoulder', 'left_elbow'],
  ['left_elbow', 'left_wrist'],
  ['right_shoulder', 'right_elbow'],
  ['right_elbow', 'right_wrist'],
  // Torso
  ['left_shoulder', 'left_hip'],
  ['right_shoulder', 'right_hip'],
  ['left_hip', 'right_hip'],
  // Lower body
  ['left_hip', 'left_knee'],
  ['left_knee', 'left_ankle'],
  ['right_hip', 'right_knee'],
  ['right_knee', 'right_ankle'],
];
