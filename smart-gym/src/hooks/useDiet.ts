import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dietService } from '../services/dietService';

export const useDiet = () => {
    const queryClient = useQueryClient();

    const dietQuery = useQuery({
        queryKey: ['dietPlan'],
        queryFn: dietService.getDietPlan,
    });

    const generateMutation = useMutation({
        mutationFn: dietService.generateDietPlan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dietPlan'] });
        },
    });

    const updatePrefsMutation = useMutation({
        mutationFn: dietService.updatePreferences,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dietPlan'] });
        },
    });

    return {
        diet: dietQuery.data,
        isLoading: dietQuery.isLoading,
        generatePlan: generateMutation.mutate,
        isGenerating: generateMutation.isPending,
        updatePreferences: updatePrefsMutation.mutate,
        isUpdating: updatePrefsMutation.isPending,
    };
};
