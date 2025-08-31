import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { appForeground, appBackground } from '../../core/app/store/app.slice';
import { scanRequested } from '../../core/connectivity/store/connectivity.slice';
import { selectDisconnectedPairedPeers } from '../../core/peers/store/paired-peer.slice';

export const useAppState = () => {
  const dispatch = useAppDispatch();
  const disconnectedPeers = useAppSelector(selectDisconnectedPairedPeers);
  
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // Update app state
        dispatch(appForeground());
        
        // Business logic: scan for paired devices if any are disconnected
        if (disconnectedPeers.length > 0) {
          dispatch(scanRequested());
        }
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        dispatch(appBackground());
      }
    };
    
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [dispatch, disconnectedPeers.length]);
};
