import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { User } from '../types/apiTypes';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setAuth: async (user, token) => {
    await SecureStore.setItemAsync('userToken', token);
    set({ user, token, isAuthenticated: true });
  },
  logout: async () => {
    await SecureStore.deleteItemAsync('userToken');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
