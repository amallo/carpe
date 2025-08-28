import { useEffect } from 'react';
import { PeerProvider } from '../../core/peers/providers/peer.provider';
import { Logger } from '../../core/logger/providers/logger.interface';
import { prodLog } from '../config/environment';

/**
 * Hook for managing provider lifecycle
 * Handles initialization and cleanup of providers
 */
export const useProviderLifecycle = (
  peerProvider: PeerProvider,
  shouldUseMock: boolean,
  logger: Logger,
  dispatch: any
) => {
  useEffect(() => {
    // Initialize logger with store dispatch
    if (dispatch) {
      logger.init(dispatch);
    }

    // Start BLE peer provider in production
    if (!shouldUseMock && peerProvider) {
      prodLog('Starting BLE peer provider');
      peerProvider.start();
      
      return () => {
        prodLog('Destroying BLE peer provider');
        peerProvider.destroy();
      };
    }
  }, [peerProvider, shouldUseMock, logger, dispatch]);
};
