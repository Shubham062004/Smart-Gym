import axiosClient from '../api/axiosClient';

export const dietService = {
  getDietPlan: async () => {
    const response = await axiosClient.get('/diet-plan');
    return response.data;
  },
  generateDietPlan: async () => {
    const response = await axiosClient.post('/diet/generate');
    return response.data;
  },
  updatePreferences: async (preferences: any) => {
    const response = await axiosClient.put('/diet/preferences', preferences);
    return response.data;
  }
};
