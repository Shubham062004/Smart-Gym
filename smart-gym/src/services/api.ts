import axios from 'axios';
import { storage } from '../utils/storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// ── API Base URL ──────────────────────────────────────────────────────────────
// In development: auto-detect local machine IP via Expo so the phone can reach
//   the backend running on the same WiFi (works on both Android & iOS).
// In production: use the deployed Render URL.
const RENDER_URL = 'https://smart-gym-emwi.onrender.com/api';

const getLocalUrl = () => {
  const debuggerHost = Constants.expoConfig?.hostUri;
  let ip = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  if (debuggerHost) ip = debuggerHost.split(':')[0];
  return `http://${ip}:5000/api/`;
};

const BASE_URL = __DEV__ ? getLocalUrl() : RENDER_URL;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
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
