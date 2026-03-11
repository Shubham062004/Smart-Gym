import axiosClient from '../api/axiosClient';
import { Workout, DietPlan } from '../types/apiTypes';

export const aiService = {
  generateWorkout: async (goals: string): Promise<Workout> => {
    const response = await axiosClient.post('/ai/generate-workout', { goals });
    return response.data;
  },

  generateDiet: async (preferences: any): Promise<DietPlan> => {
    const response = await axiosClient.post('/ai/generate-diet', preferences);
    return response.data;
  },

  chat: async (message: string): Promise<{ response: string }> => {
    const response = await axiosClient.post('/ai/chat', { message });
    return response.data;
  }
};
