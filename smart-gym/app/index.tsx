import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import OnboardingScreen1 from './onboarding1';
import OnboardingScreen2 from './onboarding2';
import OnboardingScreen3 from './onboarding3';

export default function OnboardingFlow() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentScreen < 2) {
      setCurrentScreen(currentScreen + 1);
    }
  };

  const handleSkip = () => {
    router.push('/(tabs)');
  };

  const handleGetStarted = () => {
    router.push('/login' as any);
  };

  const screens = [
    <OnboardingScreen1
      key="screen1"
      onNext={handleNext}
      onSkip={handleSkip}
    />,
    <OnboardingScreen2
      key="screen2"
      onNext={handleNext}
    />,
    <OnboardingScreen3
      key="screen3"
      onGetStarted={handleGetStarted}
    />,
  ];

  return screens[currentScreen];
}
