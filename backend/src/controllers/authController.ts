import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { findUserByEmail, createUser, saveOtp, verifyUserOtp, resetUserPassword } from '../services/authService';
import { generateOtp, sendOtpEmail } from '../services/otpService';
import { generateToken } from '../utils/jwt';
import { validatePassword } from '../utils/passwordValidator';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, age, height, weight, goal } = req.body;

        if (!name || !email || !password) {
             res.status(400).json({ message: 'Name, email, and password are required' });
             return;
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            res.status(400).json({ message: passwordValidation.error });
            return;
        }

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const user = await createUser({
            name,
            email,
            password,
            age,
            height,
            weight,
            goal
        });

        const token = generateToken(user._id.toString(), user.email);

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                age: user.age,
                height: user.height,
                weight: user.weight,
                fitness_goal: user.fitness_goal,
            },
            token
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }

        const user = await findUserByEmail(email);
        if (!user) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password as string);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }

        const token = generateToken(user._id.toString(), user.email);

        res.status(200).json({
            message: 'Logged in successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        
        if (!email) {
            res.status(400).json({ message: 'Email is required' });
            return;
        }

        const user = await findUserByEmail(email);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const otp = generateOtp();
        await saveOtp(email, otp, 10);
        await sendOtpEmail(email, otp);

        res.status(200).json({ message: 'OTP sent to your email.' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            res.status(400).json({ message: 'Email and OTP are required' });
            return;
        }

        const isValid = await verifyUserOtp(email, otp);
        if (!isValid) {
            res.status(400).json({ message: 'Invalid or expired OTP' });
            return;
        }

        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, newPassword, otp } = req.body;

        if (!email || !newPassword || !otp) {
            res.status(400).json({ message: 'Email, OTP, and new password are required' });
            return;
        }

        const isValid = await verifyUserOtp(email, otp);
        if (!isValid) {
            res.status(400).json({ message: 'Invalid or expired OTP' });
            return;
        }

        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.isValid) {
            res.status(400).json({ message: passwordValidation.error });
            return;
        }

        await resetUserPassword(email, newPassword);

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req: Request, res: Response): Promise<void> => {
    try {
        const { idToken } = req.body;
        
        if (!idToken) {
            res.status(400).json({ message: 'Google ID token is required' });
            return;
        }

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            res.status(400).json({ message: 'Invalid Google token' });
            return;
        }

        const { email, name } = payload;
        let user = await findUserByEmail(email);

        if (!user) {
            // Create user if they don't exist
            // Generate a random password for Google-auth users
            user = await createUser({
                name: name || 'Google User',
                email,
                password: Math.random().toString(36).slice(-8) + 'A1!',
            });
        }

        const token = generateToken(user._id.toString(), user.email);

        res.status(200).json({
            message: 'Logged in successfully with Google',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            token
        });

    } catch (error) {
        console.error('Google auth error:', error);
        res.status(401).json({ message: 'Invalid Google token or server error' });
    }
};

