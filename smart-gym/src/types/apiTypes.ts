export interface User {
  id: string;
  email: string;
  name: string;
  age?: number;
  height?: number;
  weight?: number;
  fitnessGoals?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  exercises: Exercise[];
  date: string;
  completed: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
}

export interface UserPreferences {
  darkMode: boolean;
  notifications: boolean;
  voiceFeedback: boolean;
}
