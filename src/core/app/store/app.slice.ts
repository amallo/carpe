import { createSlice } from '@reduxjs/toolkit';

export type AppState = {
  isInForeground: boolean;
  lastForegroundTime: number | null;
};

export const getAppInitialState = (): AppState => ({
  isInForeground: true,
  lastForegroundTime: null,
});

const appSlice = createSlice({
  name: 'app',
  initialState: getAppInitialState(),
  reducers: {
    appForeground: (state) => {
      state.isInForeground = true;
      state.lastForegroundTime = Date.now();
    },
    appBackground: (state) => {
      state.isInForeground = false;
    },
  },
});

export const { appForeground, appBackground } = appSlice.actions;

// Selectors
export const selectIsInForeground = (state: { app: AppState }) => state.app.isInForeground;
export const selectLastForegroundTime = (state: { app: AppState }) => state.app.lastForegroundTime;

export default appSlice.reducer;
