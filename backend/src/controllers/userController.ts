import { Request, Response } from 'express';
import User from '../models/User';
import UserStats from '../models/UserStats';

export const getProfile = async (req: any, res: Response) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateProfile = async (req: any, res: Response) => {
    try {
        const { name, age, height, weight, fitness_goal } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, age, height, weight, fitness_goal },
            { new: true }
        ).select('-password');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUserStats = async (req: any, res: Response) => {
    try {
        const stats = await UserStats.findOne({ userId: req.user.id });
        if (!stats) return res.status(200).json({ totalReps: 0, workoutDuration: 0, caloriesBurned: 0, weeklyProgress: 0 });
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
