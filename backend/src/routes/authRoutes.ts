import express from 'express';
import { register, login, forgotPassword, verifyOtp, resetPassword, googleAuth, getMe } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.post('/google', googleAuth);
router.get('/me', protect as any, getMe as any);

export default router;
