import { useContext } from 'react';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { StoreContext } from './store.context';
import { Logger } from '../../core/logger/providers/logger.interface';
import { DateProvider } from '../../core/common/date/providers/date.provider';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useLogger = (): Logger => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useLogger must be used within a StoreProvider');
  }
  if (!context.logger) {
    throw new Error('Logger not available in store context');
  }
  return context.logger;
};

export const useDateProvider = (): DateProvider => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useDateProvider must be used within a StoreProvider');
  }
  return context.dateProvider;
};