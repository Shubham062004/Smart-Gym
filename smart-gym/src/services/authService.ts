import axiosClient from '../api/axiosClient';
import { AuthResponse } from '../types/apiTypes';

export const authService = {
  login: async (data: any): Promise<AuthResponse> => {
    const response = await axiosClient.post('/auth/login', data);
    return response.data;
  },
  register: async (data: any): Promise<AuthResponse> => {
    const response = await axiosClient.post('/auth/register', data);
    return response.data;
  },
  logout: async (): Promise<void> => {
    await axiosClient.post('/auth/logout');
  },
};
