import axiosClient from '../api/axiosClient';
import { User, UserPreferences } from '../types/apiTypes';

export const userService = {
  getProfile: async (): Promise<User> => {
    const response = await axiosClient.get('/user/profile');
    return response.data;
  },
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await axiosClient.patch('/user/profile', data);
    return response.data;
  },
  updateSettings: async (data: Partial<UserPreferences>): Promise<void> => {
    await axiosClient.patch('/user/settings', data);
  },
  deleteAccount: async (): Promise<void> => {
    await axiosClient.delete('/user');
  },
};
