import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import * as workoutService from '../services/workoutService';

export const getAllWorkouts = async (req: AuthRequest, res: Response) => {
    try {
        const workouts = await workoutService.getAllWorkouts();
        res.status(200).json({ success: true, data: workouts });
    } catch (error: any) {
        console.error('Error fetching all workouts:', error);
        res.status(500).json({ success: false, message: 'Server error fetching workouts' });
    }
};

export const getTodayPlan = async (req: AuthRequest, res: Response) => {
    try {
        const plan = await workoutService.getTodayPlan();
        if(!plan || plan.length === 0) {
            return res.status(404).json({ success: false, message: 'No workout available today.' });
        }
        res.status(200).json({ success: true, data: plan });
    } catch (error: any) {
        console.error('Error fetching today plan:', error);
        res.status(500).json({ success: false, message: 'Server error fetching plan' });
    }
};

export const startWorkout = async (req: AuthRequest, res: Response) => {
    try {
        // we can pass a dummy workout ID if it doesn't come in body just to simulate start
        const workoutId = req.body.workoutId || "dummy-id";
        const result = await workoutService.startWorkout(req.user.id, workoutId);
        res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        console.error('Error starting workout:', error);
        res.status(500).json({ success: false, message: 'Server error starting workout' });
    }
};

export const completeWorkout = async (req: AuthRequest, res: Response) => {
    try {
        const { duration, reps, calories } = req.body;
        const workoutId = req.body.workoutId || "dummy-id";
        
        const result = await workoutService.completeWorkout(req.user.id, workoutId, { duration, reps, calories });
        
        res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        console.error('Error completing workout:', error);
        res.status(500).json({ success: false, message: 'Server error completing workout' });
    }
};

export const saveWorkoutSession = async (req: AuthRequest, res: Response) => {
    try {
        const { exerciseName, totalReps, duration, caloriesBurned, formAccuracy } = req.body;
        const result = await workoutService.saveMLSession(req.user.id, {
            exerciseName,
            totalReps,
            duration,
            caloriesBurned,
            formAccuracy
        });
        res.status(201).json({ success: true, message: 'Workout session saved successfully.', data: result });
    } catch (error: any) {
        console.error('Error saving workout session:', error);
        res.status(500).json({ success: false, message: 'Server error saving workout session' });
    }
};
