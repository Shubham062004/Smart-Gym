import { create } from 'zustand';
import { storage } from '../utils/storage';
import { User } from '../types/apiTypes';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setAuth: async (user, token) => {
    await storage.setItem('userToken', token);
    set({ user, token, isAuthenticated: true });
  },
  logout: async () => {
    await storage.removeItem('userToken');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
