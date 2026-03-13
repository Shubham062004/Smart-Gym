import axiosClient from '../api/axiosClient';
import { User, UserSettings } from '../types/apiTypes';

export const userService = {
  getProfile: async (): Promise<User> => {
    const response = await axiosClient.get('/user/profile');
    return response.data;
  },

  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await axiosClient.put('/user/profile', userData);
    return response.data;
  },

  updateSettings: async (settings: Partial<UserSettings>): Promise<UserSettings> => {
    const response = await axiosClient.patch('/user/settings', settings);
    return response.data;
  },

  deleteAccount: async (): Promise<void> => {
    await axiosClient.delete('/user');
  }
};
