import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workoutService } from '../services/workoutService';
import { useWorkoutStore } from '../store/workoutStore';
import { WorkoutPlan } from '../types/apiTypes';

export const useWorkout = () => {
  const queryClient = useQueryClient();
  const { startWorkout: startStoreWorkout, completeWorkout: completeStoreWorkout } = useWorkoutStore();

  const getTodayQuery = useQuery({
    queryKey: ['workout', 'today'],
    queryFn: workoutService.getToday,
  });

  const getHistoryQuery = useQuery({
    queryKey: ['workout', 'history'],
    queryFn: workoutService.getHistory,
  });

  const startMutation = useMutation({
    mutationFn: workoutService.start,
    onSuccess: (data) => {
      startStoreWorkout(data);
    },
  });

  const completeMutation = useMutation({
    mutationFn: workoutService.complete,
    onSuccess: () => {
      completeStoreWorkout();
      queryClient.invalidateQueries({ queryKey: ['workout', 'history'] });
    },
  });

  const searchExercises = (query: string) => {
    return useQuery({
      queryKey: ['exercises', 'search', query],
      queryFn: () => workoutService.searchExercises(query),
      enabled: !!query,
    });
  };

  return {
    todayWorkout: getTodayQuery.data,
    isLoadingToday: getTodayQuery.isLoading,
    todayError: getTodayQuery.error,

    history: getHistoryQuery.data,
    isLoadingHistory: getHistoryQuery.isLoading,
    historyError: getHistoryQuery.error,

    startWorkout: startMutation.mutateAsync,
    isStarting: startMutation.isPending,

    completeWorkout: completeMutation.mutateAsync,
    isCompleting: completeMutation.isPending,
    
    searchExercises,
  };
};
