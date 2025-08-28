// Créer un context React pour injecter le store et les dependencies

import { useMemo } from 'react';
import { createStore } from './store';
import { Provider } from 'react-redux';
import { useMockProviders } from '../config/environment';
import { ReduxLogger } from '../../core/logger/providers/redux-logger.provider';
import { ProviderFactory } from './provider.factory';
import { useProviderLifecycle } from './use-provider-lifecycle';


export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const shouldUseMockProviders = useMockProviders();
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

  // Manage provider lifecycle
  useProviderLifecycle(
    dependencies.peerProvider,
    shouldUseMockProviders,
    logger,
    store.dispatch
  );

  return <Provider store={store}>{children}</Provider>;
};
