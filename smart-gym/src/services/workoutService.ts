import axiosClient from '../api/axiosClient';
import { Workout, Exercise } from '../types/apiTypes';

export const workoutService = {
  getAllWorkouts: async () => {
    const response = await axiosClient.get('/workouts');
    return response.data;
  },

  getTodayWorkout: async () => {
    const response = await axiosClient.get('/workouts/today');
    return response.data;
  },

  startWorkout: async (workoutId: string) => {
    const response = await axiosClient.post('/workouts/start', { workoutId });
    return response.data;
  },

  completeWorkout: async (workoutData: any) => {
    const response = await axiosClient.post('/workouts/complete', workoutData);
    return response.data;
  },

  getWorkoutHistory: async (): Promise<any[]> => {
    const response = await axiosClient.get('/workouts/history');
    return response.data;
  },

  searchExercises: async (query: string): Promise<any[]> => {
    const response = await axiosClient.get(`/exercises?search=${query}`);
    return response.data;
  }
};
