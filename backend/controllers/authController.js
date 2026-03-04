const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const Joi = require('joi');

// Joi Schemas for Validation
const signupSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required()
});

// @desc    Register a new user
// @route   POST /auth/signup
// @access  Public
const signup = async (req, res, next) => {
    try {
        const { error } = signupSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { name, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password
        });

        if (user) {
            res.status(201).json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                },
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Auth user & get token
// @route   POST /auth/login
// @access  Public
const login = async (req, res, next) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                },
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get user profile
// @route   GET /auth/profile
// @access  Private
const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Forgot Password Request
// @route   POST /auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
    try {
        const { error } = forgotPasswordSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { email } = req.body;
        
        // For now, always return success to not leak registered emails,
        // or actually verify if needed. The instruction asks to just validate and return success.
        
        res.status(200).json({ message: 'Password reset link sent to your email.' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    signup,
    login,
    getProfile,
    forgotPassword
};
