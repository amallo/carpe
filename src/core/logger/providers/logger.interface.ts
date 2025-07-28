export type LogSeverity = 'debug' | 'info' | 'warn' | 'error';

export interface Logger {
  debug(domaine: string, message: string, payload?: any): void;
  info(domaine: string, message: string, payload?: any): void;
  warn(domaine: string, message: string, payload?: any): void;
  error(domaine: string, message: string, payload?: any): void;
} 