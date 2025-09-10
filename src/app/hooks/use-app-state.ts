import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAppDispatch, useDateProvider } from '../store/hooks';
import { appBecameForeground, appBecameBackground } from '../../core/app/store/app.slice';

export const useAppState = () => {
  const dispatch = useAppDispatch();
  const dateProvider = useDateProvider();

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // Update app state
        dispatch(appBecameForeground(dateProvider.now()));
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        dispatch(appBecameBackground());
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [dateProvider, dispatch]);
};
