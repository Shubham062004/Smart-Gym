export function analyzeLateralRaise(keypoints, state) {
  if (!keypoints || keypoints.length === 0) {
    return { reps: state.reps, feedback: "No human detected", stage: state.stage };
  }

  const getPoint = (name) => keypoints.find((kp) => kp.name === name);

  const leftShoulder = getPoint("left_shoulder");
  const leftElbow = getPoint("left_elbow");
  const leftHip = getPoint("left_hip");
  const rightShoulder = getPoint("right_shoulder");
  const rightElbow = getPoint("right_elbow");
  const rightHip = getPoint("right_hip");

  if (!leftShoulder || !rightShoulder) {
    return { reps: state.reps, feedback: "Keep upper body in frame", stage: state.stage };
  }

  const leftScore = (leftShoulder.score + leftElbow.score + leftHip.score) / 3;
  const rightScore = (rightShoulder.score + rightElbow.score + rightHip.score) / 3;

  const isLeft = leftScore > rightScore;
  const shoulder = isLeft ? leftShoulder : rightShoulder;
  const elbow = isLeft ? leftElbow : rightElbow;
  const hip = isLeft ? leftHip : rightHip;

  if (shoulder.score < 0.3 || elbow.score < 0.3 || hip.score < 0.3) {
    return { reps: state.reps, feedback: "Keep arms and hips visible", stage: state.stage };
  }

  const calculateAngle = (p1, p2, p3) => {
    const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);
    if (angle > 180.0) {
      angle = 360.0 - angle;
    }
    return angle;
  };

  const shoulderAngle = calculateAngle(hip, shoulder, elbow);

  let newStage = state.stage;
  let newReps = state.reps;
  let feedback = state.feedback || "Get in position";

  // Down: arms near body (hip-shoulder-elbow angle < 30)
  // Up: arms parallel to ground (hip-shoulder-elbow angle > 80)
  
  if (shoulderAngle < 30) {
    if (newStage === "up") {
      feedback = "Good Form";
    }
    newStage = "down";
  } else if (shoulderAngle > 80) {
    if (newStage === "down") {
      newReps += 1;
      feedback = "Good Raise!";
    }
    newStage = "up";
  } else {
    if (newStage === "down") {
      feedback = "Raise higher";
    } else {
      feedback = "Lower slowly";
    }
  }

  return {
    reps: newReps,
    feedback: feedback,
    stage: newStage,
    metrics: [
      { name: "Shoulder Angle", value: Math.round(shoulderAngle), unit: "°", color: "#8b5cf6", fillPct: shoulderAngle / 180, status: "" }
    ],
    formAccuracy: 100
  };
}
