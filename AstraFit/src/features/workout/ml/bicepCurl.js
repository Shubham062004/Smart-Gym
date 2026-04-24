export function analyzeBicepCurl(keypoints, state) {
  if (!keypoints || keypoints.length === 0) {
    return { reps: state.reps, feedback: "No human detected", stage: state.stage };
  }

  const getPoint = (name) => keypoints.find((kp) => kp.name === name);

  const leftShoulder = getPoint("left_shoulder");
  const leftElbow = getPoint("left_elbow");
  const leftWrist = getPoint("left_wrist");
  const rightShoulder = getPoint("right_shoulder");
  const rightElbow = getPoint("right_elbow");
  const rightWrist = getPoint("right_wrist");

  if (!leftShoulder || !rightShoulder) {
    return { reps: state.reps, feedback: "Keep full body in frame", stage: state.stage };
  }

  const leftScore = (leftShoulder.score + leftElbow.score + leftWrist.score) / 3;
  const rightScore = (rightShoulder.score + rightElbow.score + rightWrist.score) / 3;

  const isLeft = leftScore > rightScore;
  const shoulder = isLeft ? leftShoulder : rightShoulder;
  const elbow = isLeft ? leftElbow : rightElbow;
  const wrist = isLeft ? leftWrist : rightWrist;

  if (shoulder.score < 0.3 || elbow.score < 0.3 || wrist.score < 0.3) {
    return { reps: state.reps, feedback: "Keep arms visible", stage: state.stage };
  }

  const calculateAngle = (p1, p2, p3) => {
    const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);
    if (angle > 180.0) {
      angle = 360.0 - angle;
    }
    return angle;
  };

  const elbowAngle = calculateAngle(shoulder, elbow, wrist);

  let newStage = state.stage;
  let newReps = state.reps;
  let feedback = state.feedback || "Get in position";

  if (elbowAngle > 150) {
    if (newStage === "up") {
      feedback = "Good Form!";
    }
    newStage = "down";
  } else if (elbowAngle < 60) {
    if (newStage === "down") {
      newReps += 1;
      feedback = "Good Curl!";
    }
    newStage = "up";
  } else {
    if (newStage === "down") {
      feedback = "Curl higher";
    } else {
      feedback = "Lower slowly";
    }
  }

  return {
    reps: newReps,
    feedback: feedback,
    stage: newStage,
    metrics: [
      { name: "Elbow Angle", value: Math.round(elbowAngle), unit: "°", color: "#0df20d", fillPct: elbowAngle / 180, status: "" }
    ],
    formAccuracy: 100
  };
}
