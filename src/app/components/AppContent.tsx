import React from 'react';
import { useAppSelector } from '../store/hooks';
import {  selectIsIdentityLoading, selectHasIdentity } from '../../core/identity/store/identity.slice';
import { LoadingScreen } from './LoadingScreen';
import { MainApp } from './MainApp';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';

export const AppContent: React.FC = () => {
  // const currentIdentity = useAppSelector(selectCurrentIdentity);
  const isLoading = useAppSelector(selectIsIdentityLoading);
  const hasIdentity = useAppSelector(selectHasIdentity);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!hasIdentity) {
    return <OnboardingScreen />;
  }

  return <MainApp />;
};
