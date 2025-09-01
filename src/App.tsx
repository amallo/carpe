import 'react-native-get-random-values'; // Must be first import for crypto.getRandomValues polyfill
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StoreProvider } from './app/store/store.context';
import { AppContent } from './app/components/AppContent';

export default function App() {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <NavigationContainer>
          <StoreProvider>
              <AppContent />
          </StoreProvider>
        </NavigationContainer>
        <Toaster />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
