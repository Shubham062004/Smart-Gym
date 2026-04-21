export function analyzeShoulderPress(keypoints, state) {
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
    return { reps: state.reps, feedback: "Keep upper body in frame", stage: state.stage };
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
  // Y coordinate is inverted (0 is top of image, larger is down)
  const wristAboveShoulder = wrist.y < shoulder.y; 

  let newStage = state.stage;
  let newReps = state.reps;
  let feedback = state.feedback || "Get in position";

  // Down: elbows near shoulders (elbow angle < 90)
  // Up: arms fully extended overhead (wrist > shoulder and elbow angle > 150)
  
  if (elbowAngle > 150 && wristAboveShoulder) {
    if (newStage === "down") {
      newReps += 1;
      feedback = "Good Press!";
    }
    newStage = "up";
  } else if (elbowAngle < 90) {
    if (newStage === "up") {
      feedback = "Good Form";
    }
    newStage = "down";
  } else {
    if (newStage === "down") {
      feedback = "Push higher";
    } else {
      feedback = "Lower elbows to shoulders";
    }
  }

  return {
    reps: newReps,
    feedback: feedback,
    stage: newStage,
    metrics: [
      { name: "Elbow Angle", value: Math.round(elbowAngle), unit: "°", color: "#f97316", fillPct: elbowAngle / 180, status: "" }
    ],
    formAccuracy: 100
  };
}
