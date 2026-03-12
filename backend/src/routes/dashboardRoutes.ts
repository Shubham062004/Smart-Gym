import express from 'express';
import { getDashboardSummary, getQuickWorkouts } from '../controllers/dashboardController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/summary', protect as any, getDashboardSummary as any);
router.get('/quick-workouts', protect as any, getQuickWorkouts as any);

export default router;
