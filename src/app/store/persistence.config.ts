import { RNAsyncStorageProvider } from '../../core/storage/providers/rn-async-storage.provider';
import { createIdentityPersistConfig, STORAGE_KEYS } from './persistence.factory';

/**
 * Production storage provider
 * Uses React Native AsyncStorage for persistent storage
 */
const productionStorageProvider = new RNAsyncStorageProvider();

/**
 * Production persistence configuration for the identity slice
 * Only persists the current identity, not loading states or errors
 */
export const identityPersistConfig = createIdentityPersistConfig(productionStorageProvider);

/**
 * Re-export storage keys for convenience
 */
export { STORAGE_KEYS };
