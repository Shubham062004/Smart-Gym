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

    // Fetch workout name for exerciseName
    let exerciseName = "Unknown Workout";
    try {
        if (mongoose.Types.ObjectId.isValid(workoutId)) {
            const workout = await Workout.findById(workoutId);
            if (workout) exerciseName = workout.name;
        }
    } catch (e) {}

    // Create session
    try {
        await WorkoutSession.create({
            userId,
            exerciseName,
            totalReps: reps || 0,
            duration,
            caloriesBurned: calories,
            formAccuracy: 100, // Default for manual completion
        });
    } catch(err) {
        console.error("Error creating session:", err);
    }

    // Update Dashboard Statistics
    let stats = await UserStats.findOne({ userId });
    
    if (!stats) {
        stats = await UserStats.create({
            userId,
            totalReps: reps || 0,
            workoutDuration: duration || 0,
            caloriesBurned: calories || 0,
            weeklyProgress: 0.1, 
        });
    } else {
        stats.totalReps += (reps || 0);
        stats.workoutDuration += (duration || 0);
        stats.caloriesBurned += (calories || 0);
        stats.weeklyProgress = Math.min(stats.weeklyProgress + 0.1, 1.0);
        await stats.save();
    }

    return { message: "Workout completed", stats };
};

export const saveMLSession = async (
    userId: string,
    sessionData: { exerciseName: string; totalReps: number; duration: number; caloriesBurned: number; formAccuracy: number }
) => {
    const { exerciseName, totalReps, duration, caloriesBurned, formAccuracy } = sessionData;

    const session = await WorkoutSession.create({
        userId,
        exerciseName,
        totalReps,
        duration,
        caloriesBurned,
        formAccuracy,
    });

    // Update Dashboard Statistics
    let stats = await UserStats.findOne({ userId });
    
    if (!stats) {
        stats = await UserStats.create({
            userId,
            totalReps,
            workoutDuration: duration,
            caloriesBurned,
            weeklyProgress: 0.05,
        });
    } else {
        stats.totalReps += totalReps;
        stats.workoutDuration += Math.round(duration / 60); // assuming duration is in seconds for ML, but minutes for stats
        stats.caloriesBurned += caloriesBurned;
        stats.weeklyProgress = Math.min(stats.weeklyProgress + 0.05, 1.0);
        await stats.save();
    }

    return session;
};
