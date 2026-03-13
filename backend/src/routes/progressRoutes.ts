import express from 'express';
import { getWeeklyProgress, getCaloriesBurned } from '../controllers/progressController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/weekly', protect as any, getWeeklyProgress as any);
router.get('/calories', protect as any, getCaloriesBurned as any);

export default router;
