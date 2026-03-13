import axiosClient from '../api/axiosClient';
import { Workout, Exercise } from '../types/apiTypes';

export const workoutService = {
  getAllWorkouts: async () => {
    const response = await axiosClient.get('/workouts');
    return response.data.data;
  },

  getTodayWorkout: async () => {
    const response = await axiosClient.get('/workouts/today');
    return response.data.data;
  },

  startWorkout: async (workoutId: string) => {
    const response = await axiosClient.post('/workouts/start', { workoutId });
    return response.data.data;
  },

  completeWorkout: async (workoutData: any) => {
    const response = await axiosClient.post('/workouts/complete', workoutData);
    return response.data.data;
  },

  getWorkoutHistory: async (): Promise<any[]> => {
    const response = await axiosClient.get('/workout-history');
    return response.data; // This one doesn't have data wrapper in server.ts dummy endpoint
  },

  searchExercises: async (query: string): Promise<any[]> => {
    const response = await axiosClient.get(`/workouts?search=${query}`);
    return response.data.data;
  }
};
