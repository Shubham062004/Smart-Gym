import axiosClient from '../api/axiosClient';
import { Workout, DietPlan } from '../types/apiTypes';

export const aiService = {
  generateWorkout: async (goals: string): Promise<any> => {
    const response = await axiosClient.post('/ai/chat', { message: `Generate a workout for: ${goals}` });
    return response.data;
  },

  generateDiet: async (userData: any): Promise<any> => {
    const response = await axiosClient.post('/ai/diet/generate', userData);
    return response.data;
  },

  chat: async (message: string): Promise<any> => {
    const response = await axiosClient.post('/ai/chat', { message });
    return response.data;
  }
};
