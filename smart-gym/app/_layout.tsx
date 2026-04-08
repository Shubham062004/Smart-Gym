import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { storage } from '../src/utils/storage';
import { useAuthStore } from '../src/store/authStore';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function useProtectedRoute(user: any) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inTabsGroup = segments[0] === '(tabs)';
    
    // Check if user is on authentication pages
    const isAuthPage = ['login', 'signup', 'verify-otp', 'onboarding1', 'onboarding2', 'onboarding3', 'index'].includes(segments[0] || '');

    if (!user && inTabsGroup) {
      // If not authenticated and trying to access tabs, redirect to login
      router.replace('/login' as any);
    } else if (user && isAuthPage) {
      // If authenticated and on auth pages, redirect to tabs
      router.replace('/(tabs)');
    }
  }, [user, segments]);
}

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Platform } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const loaded = true; // Temporary bypass for missing fonts

  const { isAuthenticated, isLoading, loadStoredAuth } = useAuthStore();
  
  useEffect(() => {
    loadStoredAuth();
  }, []);

  useProtectedRoute(isAuthenticated);

  useEffect(() => {
    if (loaded && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isLoading]);

  if (!loaded || isLoading) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <View className="flex-1 pt-10 bg-gray-50 dark:bg-slate-900">
            <StackScreen />
          </View>
          <StatusBar style="auto" />
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

function StackScreen() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding1" />
      <Stack.Screen name="onboarding2" />
      <Stack.Screen name="onboarding3" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="verify-otp" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: true, title: 'Settings' }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
}
