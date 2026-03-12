import UserStats from '../models/UserStats';
import Workout from '../models/Workout';

export const getDashboardSummary = async (userId: string) => {
    let stats = await UserStats.findOne({ userId });
    
    if (!stats) {
        // Create initial stats if none exist
        stats = await UserStats.create({
            userId,
            totalReps: 0,
            workoutDuration: 0,
            caloriesBurned: 0,
            weeklyProgress: 0.0,
        });
    }

    return {
        totalReps: stats.totalReps,
        workoutDuration: stats.workoutDuration,
        caloriesBurned: stats.caloriesBurned,
        weeklyProgress: stats.weeklyProgress,
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
