import { create } from 'zustand';
import { User, UserSettings } from '../types/apiTypes';

interface UserState {
  profile: User | null;
  preferences: UserSettings;
  setProfile: (profile: User) => void;
  updatePreferences: (settings: Partial<UserSettings>) => void;
}

const defaultSettings: UserSettings = {
  darkMode: true,
  notifications: true,
  voiceFeedback: true,
  units: 'metric',
};

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  preferences: defaultSettings,
  setProfile: (profile) => set({ profile }),
  updatePreferences: (newSettings) =>
    set((state) => ({ preferences: { ...state.preferences, ...newSettings } })),
}));
