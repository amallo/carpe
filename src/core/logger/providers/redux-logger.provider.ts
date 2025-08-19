import { Logger, LogSeverity } from './logger.interface';
import { Dispatch } from 'redux';
import { addLog } from '../store/log.slice';

export class ReduxLogger implements Logger {
  private dispatch: Dispatch | null = null;


  init(dispatch: Dispatch) {
    this.dispatch = dispatch;
  }

  private log(severity: LogSeverity, domaine: string, message: string, payload?: any) {
    if (!this.dispatch) {
      console.warn('ReduxLogger not initialized. Did you forget to call init(dispatch)?');
      return;
    }
    if (this.dispatch) {
      console.log('dispatching log', {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        domaine,
        severity,
        message,
        payload,
      });
      this.dispatch(addLog({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        domaine,
        severity,
        message,
        payload,
      }));
    }
  }

  debug(domaine: string, message: string, payload?: any): void {
    this.log('debug', domaine, message, payload);
  }
  info(domaine: string, message: string, payload?: any): void {
    this.log('info', domaine, message, payload);
  }
  warn(domaine: string, message: string, payload?: any): void {
    this.log('warn', domaine, message, payload);
  }
  error(domaine: string, message: string, payload?: any): void {
    this.log('error', domaine, message, payload);
  }
} 