import AsyncStorage from '@react-native-async-storage/async-storage';
import { PersistConfig } from 'redux-persist';

/**
 * Configuration for persisting the identity slice
 * Only persists the current identity, not loading states or errors
 */
export const identityPersistConfig: PersistConfig<any> = {
  key: 'identity',
  storage: AsyncStorage,
  whitelist: ['current'], // Only persist the current identity
  blacklist: ['isLoading', 'error'], // Don't persist temporary states
  version: 1,
  migrate: (state) => {
    // Migration logic for future schema changes
    return Promise.resolve(state);
  },
};

/**
 * Storage keys used by the app
 */
export const STORAGE_KEYS = {
  REDUX_PERSIST: 'persist:identity',
  APP_STATE: 'carpe:app-state',
} as const;
