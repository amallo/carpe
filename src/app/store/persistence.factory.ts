import { PersistConfig } from 'redux-persist';
import { AsyncStorageProvider } from '../../core/storage/providers/async-storage.provider';

/**
 * Factory function to create identity persistence configuration
 * @param storageProvider The storage provider to use for persistence
 * @returns Configured PersistConfig for identity slice
 */
export const createIdentityPersistConfig = (
  storageProvider: AsyncStorageProvider
): PersistConfig<any> => ({
  key: 'identity',
  storage: storageProvider,
  whitelist: ['current'], // Only persist the current identity
  blacklist: ['isLoading', 'error'], // Don't persist temporary states
  version: 1,
  migrate: (state) => {
    // Migration logic for future schema changes
    // This function is called when the persisted state version differs from the current version
    return Promise.resolve(state);
  },
});

/**
 * Storage keys used by the app
 * Centralized to avoid key collisions and improve maintainability
 */
export const STORAGE_KEYS = {
  REDUX_PERSIST: 'persist:identity',
  APP_STATE: 'carpe:app-state',
} as const;

/**
 * Type helper for storage keys
 */
export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
