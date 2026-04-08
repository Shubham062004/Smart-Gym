import WorkoutSession from '../models/WorkoutSession';
import UserStats from '../models/UserStats';
import Workout from '../models/Workout';
import mongoose from 'mongoose';

export const getDashboardSummary = async (userId: string) => {
    let stats = await UserStats.findOne({ userId });
    
    if (!stats) {
        stats = await UserStats.create({
            userId,
            totalReps: 0,
            workoutDuration: 0,
            caloriesBurned: 0,
            weeklyProgress: 0.0,
        });
    }

    // Calculate weekly activity [M, T, W, T, F, S, S]
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const weeklySessions = await WorkoutSession.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId), completedAt: { $gte: sevenDaysAgo } } },
        { $group: {
            _id: { $dayOfWeek: "$completedAt" }, // 1 (Sun) to 7 (Sat)
            count: { $sum: 1 }
        }}
    ]);

    const weeklyActivity = [0, 0, 0, 0, 0, 0, 0]; // Sun to Sat order by default in mongo dayOfWeek? 
    // Actually $dayOfWeek is 1-7 (Sun-Sat).
    // Let's map to [M, T, W, T, F, S, S] which is [2, 3, 4, 5, 6, 7, 1]
    const dayMap = [2, 3, 4, 5, 6, 7, 1];
    weeklySessions.forEach(session => {
        const index = dayMap.indexOf(session._id);
        if (index !== -1) weeklyActivity[index] = session.count;
    });

    return {
        totalReps: stats.totalReps,
        durationMinutes: stats.workoutDuration,
        caloriesBurned: stats.caloriesBurned,
        weeklyActivity: weeklyActivity,
        streak: weeklySessions.length > 0 ? weeklySessions.length : 0 // Basic streak calculation based on recent days
    };
};

export const getQuickWorkouts = async () => {
    // Return a list of default quick exercises
    const quickWorkouts = await Workout.find({ difficulty: 'Beginner' }).limit(3);
    
    if (quickWorkouts.length === 0) {
        // Fallback or seed for quick workouts
        return [
            { id: '1', name: 'Pushups', difficulty: 'Beginner', duration: 5, image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=500&h=500&fit=crop' },
            { id: '2', name: 'Squats', difficulty: 'Beginner', duration: 8, image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&h=500&fit=crop' },
            { id: '3', name: 'Crunches', difficulty: 'Beginner', duration: 5, image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&h=500&fit=crop' },
        ];
    }
    
    return quickWorkouts;
};
