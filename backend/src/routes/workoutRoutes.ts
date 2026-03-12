import express from 'express';
import { getAllWorkouts, getTodayPlan, startWorkout, completeWorkout } from '../controllers/workoutController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect as any, getAllWorkouts as any);
router.get('/today', protect as any, getTodayPlan as any);
router.post('/start', protect as any, startWorkout as any);
router.post('/complete', protect as any, completeWorkout as any);

export default router;
