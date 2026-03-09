import axiosClient from '../api/axiosClient';

export const workoutService = {
  getToday: async () => {
    const response = await axiosClient.get('/workout/today');
    return response.data;
  },
  start: async (workoutId: string) => {
    const response = await axiosClient.post('/workout/start', { workoutId });
    return response.data;
  },
  complete: async (workoutData: any) => {
    const response = await axiosClient.post('/workout/complete', workoutData);
    return response.data;
  },
  getHistory: async () => {
    const response = await axiosClient.get('/workout/history');
    return response.data;
  },
  searchExercises: async (query: string) => {
    const response = await axiosClient.get(`/exercises?search=${query}`);
    return response.data;
  }
};
