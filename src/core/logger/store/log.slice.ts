import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LogSeverity } from '../providers/logger.interface';

export interface LogEntry {
  id: string;
  date: string; // ISO string
  domaine: string;
  severity: LogSeverity;
  message: string;
  payload?: any;
}

interface LogState {
  logs: LogEntry[];
}

const initialState: LogState = {
  logs: [],
};

const logSlice = createSlice({
  name: 'log',
  initialState,
  reducers: {
    addLog: (state, action: PayloadAction<LogEntry>) => {
      state.logs.push(action.payload);
    },
    clearLogs: (state) => {
      state.logs = [];
    },
  },
});

export const { addLog, clearLogs } = logSlice.actions;
export default logSlice.reducer;
export { initialState }; 