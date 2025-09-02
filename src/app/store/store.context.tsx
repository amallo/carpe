// Créer un context React pour injecter le store et les dependencies

import React, { createContext, useMemo } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { useMockProviders } from '../config/environment';
import { useProviderLifecycle } from './use-provider-lifecycle';
import { Logger } from '../../core/logger/providers/logger.interface';
import { createPersistor } from './store';

// Context for accessing dependencies
interface StoreContextType {
  logger: Logger;
  // Add other dependencies as needed
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const shouldUseMockProviders = useMockProviders();

  // Manage provider lifecycle
  const { store, logger } = useProviderLifecycle(
    shouldUseMockProviders,
  );

  // Create persistor for redux-persist
  const persistor = useMemo(() =>
    createPersistor(store),
    [store]
  );

  // Context value with dependencies
  const contextValue = useMemo(() => ({
    logger,
    // Add other dependencies as needed
  }), [logger]);

  return (
    <StoreContext.Provider value={contextValue}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      </Provider>
    </StoreContext.Provider>
  );
};

// Export the context for use in hooks
export { StoreContext };
