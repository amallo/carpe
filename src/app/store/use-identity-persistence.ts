import { useAppSelector } from './hooks';
import { selectIsIdentityRehydrated, selectIdentityPersistVersion } from './persistence.selectors';
import { IdentityPersistenceUtils } from './identity-persistence.utils';

/**
 * Hook for managing identity persistence state and utilities
 */
export const useIdentityPersistence = () => {
  const isRehydrated = useAppSelector(selectIsIdentityRehydrated);
  const persistVersion = useAppSelector(selectIdentityPersistVersion);

  return {
    // State
    isRehydrated,
    persistVersion,
    
    // Utilities
    clearPersistedData: IdentityPersistenceUtils.clearPersistedData,
    hasPersistedData: IdentityPersistenceUtils.hasPersistedData,
    getRawPersistedData: IdentityPersistenceUtils.getRawPersistedData,
    debugPersistedState: IdentityPersistenceUtils.debugPersistedState,
  };
};
