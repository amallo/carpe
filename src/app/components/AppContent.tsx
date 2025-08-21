import React from 'react';
import { useUser } from '../providers/UserProvider';
import { LoadingScreen } from './LoadingScreen';
import { MainApp } from './MainApp';
import OnboardingScreen from '../screens/OnboardingScreen';

export const AppContent: React.FC = () => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <OnboardingScreen />;
  }

  return <MainApp />;
};
