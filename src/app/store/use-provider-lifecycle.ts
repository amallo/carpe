import { useEffect, useMemo } from 'react';
import { ReduxLogger } from '../../core/logger/providers/redux-logger.provider';
import { ProviderFactory } from './provider.factory';
import {  createStore } from './store';

/**
 * Hook for managing provider lifecycle
 * Handles initialization and cleanup of providers
 */
export const useProviderLifecycle = (
  shouldUseMockProviders: boolean,
) => {
  const logger = useMemo(() => new ReduxLogger(), []);

  // Create all dependencies using the factory
  const dependencies = useMemo(() =>
    ProviderFactory.createAllDependencies(shouldUseMockProviders, logger),
    [shouldUseMockProviders, logger]
  );

  // Create store with dependencies
  const store = useMemo(() =>
    createStore(dependencies),
    [dependencies]
  );


  useEffect(() => {
    // Initialize logger with store dispatch
    if (store.dispatch) {
      logger.init(store.dispatch);
    }

    // Start BLE peer provider in production
    if (!shouldUseMockProviders && dependencies.peerProvider) {
      logger.info('STORE', 'Starting BLE peer provider');
      dependencies.peerProvider.start();
      return () => {
        logger.info('STORE', 'Destroying BLE peer provider');
        dependencies.peerProvider.destroy();
      };
    }
  }, [dependencies.peerProvider, shouldUseMockProviders, dependencies.logger, store.dispatch, logger]);

  return { store, logger };
};
