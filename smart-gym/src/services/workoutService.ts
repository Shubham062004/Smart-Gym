import axiosClient from '../api/axiosClient';
import { Workout, Exercise } from '../types/apiTypes';

export const workoutService = {
  getTodayWorkout: async (): Promise<Workout> => {
    const response = await axiosClient.get('/workout/today');
    return response.data;
  },

  startWorkout: async (workoutId: string): Promise<void> => {
    await axiosClient.post('/workout/start', { workoutId });
  },

  completeWorkout: async (workoutData: Partial<Workout>): Promise<Workout> => {
    const response = await axiosClient.post('/workout/complete', workoutData);
    return response.data;
  },

  getWorkoutHistory: async (): Promise<Workout[]> => {
    const response = await axiosClient.get('/workout/history');
    return response.data;
  },

  searchExercises: async (query: string): Promise<Exercise[]> => {
    const response = await axiosClient.get(`/exercises?search=${query}`);
    return response.data;
  }
};
