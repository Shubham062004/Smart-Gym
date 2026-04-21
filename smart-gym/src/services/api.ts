import axios from 'axios';
import { storage } from '../utils/storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Production backend (Render)
const BASE_URL = 'https://smart-gym-backend-x1w0.onrender.com/api';
// const BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await storage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Clear token on 401
      await storage.removeItem('userToken');
      // Potential redirect logic here if needed, but usually handled by AuthStore
    }

    // Global error message extraction
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    error.friendlyMessage = message;

    return Promise.reject(error);
  }
);

export default api;
