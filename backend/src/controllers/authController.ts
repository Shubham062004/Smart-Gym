import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import generateToken from '../utils/generateToken';
import Joi from 'joi';
import sendEmail from '../utils/sendEmail';
import { AuthRequest } from '../middleware/authMiddleware';

// Joi Schemas for Validation
const signupSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
        .min(8)
        .pattern(/[a-z]/)
        .pattern(/[A-Z]/)
        .pattern(/[0-9]/)
        .pattern(/^(?!.*(\d)\1).*$/)
        .required(),
    age: Joi.number().optional(),
    height: Joi.number().optional(),
    weight: Joi.number().optional(),
    goal: Joi.string().optional()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(4).required(),
    newPassword: Joi.string()
        .min(8)
        .pattern(/[a-z]/)
        .pattern(/[A-Z]/)
        .pattern(/[0-9]/)
        .pattern(/^(?!.*(\d)\1).*$/)
        .required()
});

const verifyOtpSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(4).required()
});

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { error } = signupSchema.validate(req.body);
        if (error) {
            res.status(400).json({ message: error.details[0].message });
            return;
        }

        const { name, email, password, age, height, weight, goal } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const user = await User.create({
            name,
            email,
            password,
            age: age ? parseInt(age) : undefined,
            height: height ? parseFloat(height) : undefined,
            weight: weight ? parseFloat(weight) : undefined,
            fitness_goal: goal,
        });

        res.status(201).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                age: user.age,
                height: user.height,
                weight: user.weight,
                fitness_goal: user.fitness_goal,
            },
            token: generateToken(user._id.toString()),
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) {
             res.status(400).json({ message: error.details[0].message });
             return;
        }

        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
                token: generateToken(user._id.toString()),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        next(error);
    }
};

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const user = await User.findById(req.user._id).select('-password');

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        next(error);
    }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { error } = forgotPasswordSchema.validate(req.body);
        if (error) {
            res.status(400).json({ message: error.details[0].message });
            return;
        }

        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        
        user.otp_code = otp;
        user.otp_expires_at = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await user.save({ validateBeforeSave: false });

        const message = `Your password reset OTP is ${otp}. This code will expire in 10 minutes.`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'OnlyFitness Password Reset',
                message
            });
            res.status(200).json({ message: 'OTP sent to your email.' }); 
        } catch (err) {
            console.error(err);
            user.otp_code = undefined;
            user.otp_expires_at = undefined;
            await user.save({ validateBeforeSave: false });
            res.status(500).json({ message: 'Email could not be sent' });
        }
    } catch (error) {
        next(error);
    }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { error } = verifyOtpSchema.validate(req.body);
        if (error) {
            res.status(400).json({ message: error.details[0].message });
            return;
        }

        const { email, otp } = req.body;
        const user = await User.findOne({ 
            email,
            otp_code: otp,
            otp_expires_at: { $gt: Date.now() }
        });

        if (!user) {
            res.status(400).json({ message: 'Invalid or expired OTP' });
            return;
        }

        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { error } = resetPasswordSchema.validate(req.body);
        if (error) {
            res.status(400).json({ message: error.details[0].message });
            return;
        }

        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({
            email,
            otp_code: otp,
            otp_expires_at: { $gt: Date.now() }
        });

        if (!user) {
            res.status(400).json({ message: 'Invalid or expired OTP' });
            return;
        }

        user.password = newPassword;
        user.otp_code = undefined;
        user.otp_expires_at = undefined;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        next(error);
    }
};
