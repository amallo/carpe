import { Logger } from './logger.interface';

export class ConsoleLogger implements Logger {
  info(domaine: string, message: string, payload?: any) {
    console.log(`[${domaine}] ${message}`, payload);
  }
  debug(domaine: string, message: string, payload?: any) {
    console.log(`[${domaine}] ${message}`, payload);
  }
  warn(domaine: string, message: string, payload?: any) {
    console.log(`[${domaine}] ${message}`, payload);
  }
  error(domaine: string, message: string, payload?: any) {
    console.log(`[${domaine}] ${message}`, payload);
  }
}