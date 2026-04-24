import { analyzePushup } from './pushup';
import { analyzeBicepCurl } from './bicepCurl';
import { analyzeShoulderPress } from './shoulderPress';
import { analyzeBentOverRow } from './bentOverRow';
import { analyzeLateralRaise } from './lateralRaise';
import { analyzeBandSquat } from './bandSquat';
import { analyzePosture } from '../../../ml/postureAnalyzer';

export function analyzeExercise(exerciseType, keypoints, state) {
  // Normalize the exercise type key for matching
  const typeKey = (exerciseType || '').toLowerCase().replace(/[^a-z]/g, '');

  // Route logic to specific exercise analysis
  switch (typeKey) {
    case 'pushups':
    case 'pushup':
      return analyzePushup(keypoints, state);
    
    case 'bicepcurl':
    case 'bicepcurls':
      return analyzeBicepCurl(keypoints, state);
      
    case 'shoulderpress':
      return analyzeShoulderPress(keypoints, state);
      
    case 'bentoverrow':
    case 'bentoverrows':
      return analyzeBentOverRow(keypoints, state);
      
    case 'lateralraise':
    case 'lateralraises':
      return analyzeLateralRaise(keypoints, state);
      
    case 'bandsquat':
    case 'bandsquats':
      return analyzeBandSquat(keypoints, state);

    case 'squats':
    case 'squat': {
      const { score, metrics, feedback } = analyzePosture(keypoints, exerciseType);
      let newReps = state.reps;
      
      // Keep track of prevScore in the stage state for squats
      const prevScore = state.prevScore || 100;
      if (prevScore < 55 && score >= 80) {
         newReps += 1;
      }

      return {
        reps: newReps,
        feedback: feedback,
        stage: state.stage,
        prevScore: score, // Store for next frame
        metrics: metrics,
        formAccuracy: score
      };
    }

    default:
      // Fallback or generic logic
      return { 
        reps: state.reps, 
        feedback: "Exercise not supported yet", 
        stage: state.stage,
        metrics: [],
        formAccuracy: 0
      };
  }
}
