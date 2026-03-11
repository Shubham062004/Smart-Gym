import express from 'express';
import { register, login, forgotPassword, verifyOtp, resetPassword, googleAuth } from '../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.post('/google', googleAuth);

export default router;
