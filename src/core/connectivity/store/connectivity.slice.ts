import { createSlice } from '@reduxjs/toolkit';

export type ConnectivityState = {
  scanRequested: boolean;
  lastScanRequestTime: number | null;
};

export const getConnectivityInitialState = (): ConnectivityState => ({
  scanRequested: false,
  lastScanRequestTime: null,
});

const connectivitySlice = createSlice({
  name: 'connectivity',
  initialState: getConnectivityInitialState(),
  reducers: {
    scanRequested: (state) => {
      state.scanRequested = true;
      state.lastScanRequestTime = Date.now();
    },
    scanCompleted: (state) => {
      state.scanRequested = false;
    },
  },
});

export const { scanRequested, scanCompleted } = connectivitySlice.actions;

// Selectors
export const selectScanRequested = (state: { connectivity: ConnectivityState }) => 
  state.connectivity.scanRequested;

export const selectLastScanRequestTime = (state: { connectivity: ConnectivityState }) => 
  state.connectivity.lastScanRequestTime;

export default connectivitySlice.reducer;
