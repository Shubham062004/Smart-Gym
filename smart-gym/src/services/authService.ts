import axiosClient from '../api/axiosClient';
import { AuthResponse } from '../types/apiTypes';

export const authService = {
  login: async (credentials: any): Promise<AuthResponse> => {
    const response = await axiosClient.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: any): Promise<AuthResponse> => {
    const response = await axiosClient.post('/auth/register', userData);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axiosClient.post('/auth/logout');
  },

  verifyOtp: async (data: { email: string; otp: string }): Promise<AuthResponse> => {
    const response = await axiosClient.post('/auth/verify-otp', data);
    return response.data;
  },

  googleAuth: async (idToken: string): Promise<AuthResponse> => {
    const response = await axiosClient.post('/auth/google', { idToken });
    return response.data;
  }
};
