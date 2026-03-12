import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import * as dashboardService from '../services/dashboardService';

// @desc    Get dashboard summary for user
// @route   GET /api/dashboard/summary
// @access  Private
export const getDashboardSummary = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const summary = await dashboardService.getDashboardSummary(userId);
        res.status(200).json({ success: true, data: summary });
    } catch (error: any) {
        console.error('Error fetching dashboard summary:', error);
        res.status(500).json({ success: false, message: 'Server error fetching dashboard summary' });
    }
};

// @desc    Get quick workouts
// @route   GET /api/dashboard/quick-workouts
// @access  Private
export const getQuickWorkouts = async (req: AuthRequest, res: Response) => {
    try {
        const workouts = await dashboardService.getQuickWorkouts();
        res.status(200).json({ success: true, data: workouts });
    } catch (error: any) {
        console.error('Error fetching quick workouts:', error);
        res.status(500).json({ success: false, message: 'Server error fetching quick workouts' });
    }
};
