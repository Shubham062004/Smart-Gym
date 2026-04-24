import React from 'react';
import { useRouter } from 'expo-router';
import OnboardingScreen1 from './onboarding1';

/**
 * index.tsx — App entry point for unauthenticated users.
 *
 * Auth routing is handled entirely by useProtectedRoute() in _layout.tsx:
 *   - Authenticated → redirected to /(tabs) before this screen renders
 *   - Not authenticated on (tabs) → redirected to /login
 *
 * This screen simply renders Onboarding 1, whose single button goes to /login.
 */
export default function Index() {
  const router = useRouter();

  const goToLogin = () => router.push('/login' as any);

  return (
    <OnboardingScreen1
      onNext={goToLogin}
      onSkip={goToLogin}
    />
  );
}
