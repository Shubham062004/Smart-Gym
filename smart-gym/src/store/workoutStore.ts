import { create } from 'zustand';
import { WorkoutPlan } from '../types/apiTypes';

interface WorkoutState {
  currentWorkout: WorkoutPlan | null;
  workoutHistory: WorkoutPlan[];
  setWorkoutHistory: (history: WorkoutPlan[]) => void;
  startWorkout: (workout: WorkoutPlan) => void;
  completeWorkout: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  currentWorkout: null,
  workoutHistory: [],
  setWorkoutHistory: (history) => set({ workoutHistory: history }),
  startWorkout: (workout) => set({ currentWorkout: workout }),
  completeWorkout: () => set((state) => ({ 
    currentWorkout: null,
    // Alternatively, fetch latest history from remote API in real app
  })),
}));
