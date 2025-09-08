import { ReconnectionStrategy } from './reconnection.strategy';
import { ImmediateReconnectionStrategy } from './immediate-reconnection.strategy';
import { DelayedReconnectionStrategy } from './delayed-reconnection.strategy';
import { DateProvider } from '../../common/date/providers/date.provider';

export class ReconnectionStrategyFactory {
  static createStrategy(environment: 'test' | 'production' = 'production', dateProvider: DateProvider): ReconnectionStrategy {
    if (environment === 'test') {
      return new ImmediateReconnectionStrategy();
    }
    
    return new DelayedReconnectionStrategy(dateProvider);
  }

  static getDefaultStrategy(dateProvider: DateProvider): ReconnectionStrategy {
    return new DelayedReconnectionStrategy(dateProvider);
  }
}
