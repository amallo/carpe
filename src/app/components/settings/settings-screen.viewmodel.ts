import { useAppSelector } from '../../store/hooks';
import { LogEntry } from '../../../core/logger/store/log.slice';
import { createSelector } from '@reduxjs/toolkit';

export interface LogEntryViewModel {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
}

export const selectLogEntries = (state: any) => state.log.logs as LogEntry[];

export const selectLogEntryViewModels = createSelector(
  [selectLogEntries],
  (logs): LogEntryViewModel[] =>
    logs
      .slice()
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(log => ({
        id: log.id,
        timestamp: new Date(log.date).toLocaleTimeString('fr-FR'),
        level: log.severity as 'info' | 'warning' | 'error',
        message: `[${log.domaine}] ${log.message}`,
      }))
);

export const useSettingsViewModel = () : {logs: LogEntryViewModel[]} => {
  const logs = useAppSelector(selectLogEntryViewModels);

  return {
    logs,
  };
};
