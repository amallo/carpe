import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAppDispatch } from '../store/hooks';
import { appForeground, appBackground } from '../../core/app/store/app.slice';

export const useAppState = () => {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // Update app state
        dispatch(appForeground());
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        dispatch(appBackground());
      }
    };
    
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [dispatch]);
};
