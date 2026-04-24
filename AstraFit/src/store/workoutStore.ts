import { create } from 'zustand';
import { Workout } from '../types/apiTypes';

interface WorkoutState {
  currentWorkout: Workout | null;
  workoutHistory: Workout[];
  setCurrentWorkout: (workout: Workout | null) => void;
  setWorkoutHistory: (history: Workout[]) => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  currentWorkout: null,
  workoutHistory: [],
  setCurrentWorkout: (workout) => set({ currentWorkout: workout }),
  setWorkoutHistory: (history) => set({ workoutHistory: history }),
}));
