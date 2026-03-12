import { useQuery } from '@tanstack/react-query';
import { getDashboardSummary, getQuickWorkouts } from '../services/dashboardService';

export const useDashboard = () => {
    const summaryQuery = useQuery({
        queryKey: ['dashboardSummary'],
        queryFn: getDashboardSummary,
    });

    const quickWorkoutsQuery = useQuery({
        queryKey: ['quickWorkouts'],
        queryFn: getQuickWorkouts,
    });

    return {
        summary: summaryQuery.data?.data,
        isLoadingSummary: summaryQuery.isLoading,
        quickWorkouts: quickWorkoutsQuery.data?.data || [],
        isLoadingQuickRecords: quickWorkoutsQuery.isLoading,
        refetchSummary: summaryQuery.refetch,
    };
};
