import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AppState = {
  isInForeground: boolean;
  lastForegroundTime: string | null;
};

export const getAppInitialState = (): AppState => ({
  isInForeground: true,
  lastForegroundTime: null,
});

const appSlice = createSlice({
  name: 'app',
  initialState: getAppInitialState(),
  reducers: {
    appBecameForeground: (state, action: PayloadAction<string>) => {
      state.isInForeground = true;
      state.lastForegroundTime = action.payload;
    },
    appBecameBackground: (state) => {
      state.isInForeground = false;
    },
  },
});

export const { appBecameForeground, appBecameBackground } = appSlice.actions;
// Selectors
export const selectIsInForeground = (state: { app: AppState }) => state.app.isInForeground;
export const selectLastForegroundTime = (state: { app: AppState }) => state.app.lastForegroundTime;

export default appSlice.reducer;
