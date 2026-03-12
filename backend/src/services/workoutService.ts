import mongoose from 'mongoose';
import Workout from '../models/Workout';
import WorkoutSession from '../models/WorkoutSession';
import UserStats from '../models/UserStats';

export const getAllWorkouts = async () => {
    return await Workout.find({});
};

export const getTodayPlan = async () => {
    // Return a mocked today's plan based on the user's prompt
    const plan = await Workout.find({}).limit(4);
    if (plan.length === 0) {
        return [
            { id: '1', name: 'Pushups', difficulty: 'Beginner', duration: 5, image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=500&h=500&fit=crop', isLocked: false },
            { id: '2', name: 'Squats', difficulty: 'Intermediate', duration: 8, image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&h=500&fit=crop', isLocked: false },
            { id: '3', name: 'Planks', difficulty: 'Beginner', duration: 3, image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&h=500&fit=crop', isLocked: false },
            { id: '4', name: 'Lunges', difficulty: 'Intermediate', duration: 10, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=500&fit=crop', isLocked: true },
        ];
    }
    return plan;
};

export const startWorkout = async (userId: string, workoutId: string) => {
    // Just a basic method to log the start or create an initial session
    // This could also just throw an error if workout doesn't exist
    // Returning dummy success if workoutId is basically a placeholder
    return { message: "Workout started successfully", workoutId };
};

export const completeWorkout = async (
    userId: string,
    workoutId: string,
    sessionData: { duration: number; reps: number; calories: number }
) => {
    const { duration, reps, calories } = sessionData;

    // Create session (we handle strings by converting them to ObjectIds if valid, or ignore if they are mock IDs)
    try {
        if (mongoose.Types.ObjectId.isValid(workoutId)) {
             await WorkoutSession.create({
                userId,
                workoutId,
                duration,
                caloriesBurned: calories,
                reps,
            });
        }
    } catch(err) {
        console.error("Error creating session, might be a mock workout id:", err);
    }

    // Update Dashboard Statistics
    let stats = await UserStats.findOne({ userId });
    
    if (!stats) {
        stats = await UserStats.create({
            userId,
            totalReps: reps || 0,
            workoutDuration: duration || 0,
            caloriesBurned: calories || 0,
            weeklyProgress: 0.1, // bump by 10%
        });
    } else {
        stats.totalReps += (reps || 0);
        stats.workoutDuration += (duration || 0);
        stats.caloriesBurned += (calories || 0);
        
        // Simple mock algorithm to update progress
        stats.weeklyProgress = Math.min(stats.weeklyProgress + 0.1, 1.0);
        await stats.save();
    }

    return { message: "Workout completed", stats };
};
