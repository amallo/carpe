import { RootState } from './store';

/**
 * Selectors for redux-persist state
 * These are app-layer selectors that handle persistence concerns
 */

export const selectIsIdentityRehydrated = (state: RootState) => {
  return (state.identity as any)._persist?.rehydrated ?? false;
};

export const selectIdentityPersistVersion = (state: RootState) => {
  return (state.identity as any)._persist?.version ?? 'unknown';
};

export const selectIdentityPersistState = (state: RootState) => {
  return (state.identity as any)._persist ?? null;
};
