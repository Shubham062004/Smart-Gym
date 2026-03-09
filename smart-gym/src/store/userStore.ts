import { create } from 'zustand';
import { User, UserPreferences } from '../types/apiTypes';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';

const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return await SecureStore.getItemAsync(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await SecureStore.deleteItemAsync(name);
  },
};

interface UserState {
  profile: User | null;
  preferences: UserPreferences;
  setProfile: (profile: User) => void;
  updateProfile: (data: Partial<User>) => void;
  updatePreferences: (data: Partial<UserPreferences>) => void;
}

const defaultPreferences: UserPreferences = {
  darkMode: false,
  notifications: true,
  voiceFeedback: true,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      preferences: defaultPreferences,
      setProfile: (profile) => set({ profile }),
      updateProfile: (data) => set((state) => ({ 
        profile: state.profile ? { ...state.profile, ...data } : null 
      })),
      updatePreferences: (data) => set((state) => ({
        preferences: { ...state.preferences, ...data }
      })),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
