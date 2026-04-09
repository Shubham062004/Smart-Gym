import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthStore } from '../src/store/authStore';
import OnboardingScreen1 from './onboarding1';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Already logged in → skip onboarding, go straight to dashboard
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading]);

  // Still loading auth state — show spinner
  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0df20d" />
      </View>
    );
  }

  // Not logged in → show onboarding 1, "Get Started" button goes to login
  if (!isAuthenticated) {
    return (
      <OnboardingScreen1
        onNext={() => router.push('/login' as any)}
        onSkip={() => router.push('/login' as any)}
      />
    );
  }

  return null;
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: '#0a0f0a',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
