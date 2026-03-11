import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { useUserStore } from '../store/userStore';

export const useProfile = () => {
  const queryClient = useQueryClient();
  const setProfile = useUserStore((state) => state.setProfile);
  const updateStorePreferences = useUserStore((state) => state.updatePreferences);

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const profile = await userService.getProfile();
      setProfile(profile);
      return profile;
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: (updatedProfile) => {
      setProfile(updatedProfile);
      queryClient.setQueryData(['profile'], updatedProfile);
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: userService.updateSettings,
    onSuccess: (updatedSettings) => {
      updateStorePreferences(updatedSettings);
    },
  });

  return {
    profile: profileQuery.data,
    isLoadingProfile: profileQuery.isLoading,
    updateProfile: updateProfileMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending,
    updateSettings: updateSettingsMutation.mutate,
  };
};
