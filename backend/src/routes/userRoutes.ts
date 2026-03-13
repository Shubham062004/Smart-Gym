import express from 'express';
import { getProfile, updateProfile, getUserStats } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/profile', protect as any, getProfile as any);
router.put('/profile', protect as any, updateProfile as any);
router.get('/stats', protect as any, getUserStats as any);

export default router;
