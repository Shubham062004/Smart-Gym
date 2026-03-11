export interface User {
  id: string;
  email: string;
  fullName?: string;
  age?: number;
  height?: number;
  weight?: number;
  fitnessLevel?: 'beginner' | 'intermediate' | 'advanced';
  proMemberStatus?: boolean;
  streakCount?: number;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Workout {
  id: string;
  userId: string;
  name: string;
  duration: number;
  calories: number;
  accuracy: number;
  reps: number;
  completedAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  targetMuscles: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  aiTracked: boolean;
  imageUrl?: string;
}

export interface DietPlan {
  id: string;
  userId: string;
  date: string;
  totalCalories: number;
  protein: number;
  carbs: number;
  fats: number;
  meals: Meal[];
}

export interface Meal {
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface UserSettings {
  darkMode: boolean;
  notifications: boolean;
  voiceFeedback: boolean;
  units: 'metric' | 'imperial';
}
