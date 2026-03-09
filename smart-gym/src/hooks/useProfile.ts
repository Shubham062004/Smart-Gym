import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { useUserStore } from '../store/userStore';

export const useProfile = () => {
  const queryClient = useQueryClient();
  const { setProfile, updateProfile: updateStoreProfile, updatePreferences } = useUserStore();

  const getProfileQuery = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      const data = await userService.getProfile();
      setProfile(data);
      return data;
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: (data) => {
      updateStoreProfile(data);
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: any) => {
      await userService.updateSettings(data);
      return data;
    },
    onSuccess: (data) => {
      updatePreferences(data);
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: userService.deleteAccount,
  });

  return {
    profile: getProfileQuery.data,
    isLoading: getProfileQuery.isLoading,
    error: getProfileQuery.error,

    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,

    updateSettings: updateSettingsMutation.mutateAsync,
    isUpdatingSettings: updateSettingsMutation.isPending,

    deleteAccount: deleteAccountMutation.mutateAsync,
    isDeletingAccount: deleteAccountMutation.isPending,
  };
};
