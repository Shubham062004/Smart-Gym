import axiosClient from '../api/axiosClient';

export const aiService = {
  generateWorkout: async (preferences: any) => {
    const response = await axiosClient.post('/ai/generate-workout', preferences);
    return response.data;
  },
  generateDiet: async (preferences: any) => {
    const response = await axiosClient.post('/ai/generate-diet', preferences);
    return response.data;
  },
  chat: async (message: string) => {
    const response = await axiosClient.post('/ai/chat', { message });
    return response.data;
  }
};
