import { createListenerMiddleware, addListener } from '@reduxjs/toolkit'
import type { AppDispatch, RootState } from '../store';
import { Dependencies } from '../../../core/dependencies';


export const listenerMiddleware = createListenerMiddleware();

export const startAppListening = listenerMiddleware.startListening.withTypes<
  RootState,
  AppDispatch,
  Dependencies
>();

export const addAppListener = addListener.withTypes<RootState, AppDispatch>()