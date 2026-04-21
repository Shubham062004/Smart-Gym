export function analyzeBandSquat(keypoints, state) {
  if (!keypoints || keypoints.length === 0) {
    return { reps: state.reps, feedback: "No human detected", stage: state.stage };
  }

  const getPoint = (name) => keypoints.find((kp) => kp.name === name);

  const leftHip = getPoint("left_hip");
  const leftKnee = getPoint("left_knee");
  const leftAnkle = getPoint("left_ankle");
  const rightHip = getPoint("right_hip");
  const rightKnee = getPoint("right_knee");
  const rightAnkle = getPoint("right_ankle");

  if (!leftHip || !rightHip) {
    return { reps: state.reps, feedback: "Keep lower body in frame", stage: state.stage };
  }

  const leftScore = (leftHip.score + leftKnee.score + leftAnkle.score) / 3;
  const rightScore = (rightHip.score + rightKnee.score + rightAnkle.score) / 3;

  const isLeft = leftScore > rightScore;
  const hip = isLeft ? leftHip : rightHip;
  const knee = isLeft ? leftKnee : rightKnee;
  const ankle = isLeft ? leftAnkle : rightAnkle;

  if (hip.score < 0.3 || knee.score < 0.3 || ankle.score < 0.3) {
    return { reps: state.reps, feedback: "Keep legs visible", stage: state.stage };
  }

  const calculateAngle = (p1, p2, p3) => {
    const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);
    if (angle > 180.0) {
      angle = 360.0 - angle;
    }
    return angle;
  };

  const kneeAngle = calculateAngle(hip, knee, ankle);

  let newStage = state.stage;
  let newReps = state.reps;
  let feedback = state.feedback || "Get in position";

  // Down: hip below knee (knee angle < 90)
  // Up: standing straight (knee angle > 160)
  
  if (kneeAngle < 90) {
    if (newStage === "up") {
      feedback = "Good Form";
    }
    newStage = "down";
  } else if (kneeAngle > 160) {
    if (newStage === "down") {
      newReps += 1;
      feedback = "Good Squat!";
    }
    newStage = "up";
  } else {
    if (newStage === "down") {
      feedback = "Go lower";
    } else {
      feedback = "Keep back straight";
    }
  }

  return {
    reps: newReps,
    feedback: feedback,
    stage: newStage,
    metrics: [
      { name: "Knee Angle", value: Math.round(kneeAngle), unit: "°", color: "#ec4899", fillPct: kneeAngle / 180, status: "" }
    ],
    formAccuracy: 100
  };
}
