import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { useUserStore } from '../store/userStore';
import { useAuthStore } from '../store/authStore';

export const useProfile = () => {
  const queryClient = useQueryClient();
  const setProfile = useUserStore((state) => state.setProfile);
  const setUserAuth = useAuthStore((state) => state.setUser);
  const updateStorePreferences = useUserStore((state) => state.updatePreferences);

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const profile = await userService.getProfile();
      setProfile(profile);
      setUserAuth(profile);
      return profile;
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: (updatedProfile) => {
      setProfile(updatedProfile);
      setUserAuth(updatedProfile);
      queryClient.setQueryData(['profile'], updatedProfile);
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: userService.updateSettings,
    onSuccess: (updatedSettings) => {
      updateStorePreferences(updatedSettings);
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: userService.deleteAccount,
    onSuccess: () => {
      // additional cleanup could happen here
    },
  });

  return {
    profile: profileQuery.data,
    isLoadingProfile: profileQuery.isLoading,
    updateProfile: updateProfileMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending,
    updateSettings: updateSettingsMutation.mutate,
    deleteAccount: deleteAccountMutation.mutate,
  };
};
