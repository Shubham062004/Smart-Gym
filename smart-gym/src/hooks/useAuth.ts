import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'expo-router';

export const useAuth = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const logoutStore = useAuthStore((state) => state.logout);
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      router.replace('/(tabs)');
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      router.replace('/(tabs)');
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: authService.verifyOtp,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      router.replace('/(tabs)');
    },
  });

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      await logoutStore();
      router.replace('/login' as any);
    }
  };

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    verifyOtp: verifyOtpMutation.mutate,
    isVerifying: verifyOtpMutation.isPending,
    logout,
  };
};
