import { create } from 'zustand';
import { storage } from '../utils/storage';
import { User } from '../types/apiTypes';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => Promise<void>;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  setAuth: async (user, token) => {
    await storage.setItem('userToken', token);
    set({ user, token, isAuthenticated: true, isLoading: false });
  },
  setUser: (user) => set({ user }),
  logout: async () => {
    await storage.removeItem('userToken');
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },
  loadStoredAuth: async () => {
    set({ isLoading: true });
    try {
      const token = await storage.getItem('userToken');
      if (token) {
        // We need auth headers for this request, axiosClient interceptor handles it
        const { default: axiosClient } = await import('../api/axiosClient');
        const response = await axiosClient.get('/auth/me');
        set({ user: response.data.user, token, isAuthenticated: true });
      }
    } catch (e) {
      console.error("Failed to load stored auth", e);
      await storage.removeItem('userToken');
    } finally {
      set({ isLoading: false });
    }
  },
}));
