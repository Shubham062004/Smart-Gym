import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workoutService } from '../services/workoutService';
import { useWorkoutStore } from '../store/workoutStore';

export const useWorkout = (searchQuery?: string) => {
  const queryClient = useQueryClient();
  const setWorkoutHistory = useWorkoutStore((state) => state.setWorkoutHistory);

  const workoutHistoryQuery = useQuery({
    queryKey: ['workoutHistory'],
    queryFn: async () => {
      const history = await workoutService.getWorkoutHistory();
      setWorkoutHistory(history);
      return history;
    },
  });

  const todayWorkoutQuery = useQuery({
    queryKey: ['todayWorkout'],
    queryFn: workoutService.getTodayWorkout,
  });

  const searchExercisesQuery = useQuery({
    queryKey: ['exercises', searchQuery],
    queryFn: () => workoutService.searchExercises(searchQuery!),
    enabled: !!searchQuery && searchQuery.length > 2,
  });

  const startWorkoutMutation = useMutation({
    mutationFn: workoutService.startWorkout,
  });

  const completeWorkoutMutation = useMutation({
    mutationFn: workoutService.completeWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workoutHistory'] });
    },
  });

  return {
    workoutHistory: workoutHistoryQuery.data || [],
    isLoadingHistory: workoutHistoryQuery.isLoading,
    todayWorkout: todayWorkoutQuery.data,
    isLoadingToday: todayWorkoutQuery.isLoading,
    searchResults: searchExercisesQuery.data || [],
    isSearching: searchExercisesQuery.isLoading,
    startWorkout: startWorkoutMutation.mutate,
    completeWorkout: completeWorkoutMutation.mutate,
    isCompleting: completeWorkoutMutation.isPending,
  };
};
