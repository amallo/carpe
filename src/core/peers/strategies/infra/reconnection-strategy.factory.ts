import { ReconnectionStrategy } from '../reconnection.strategy';
import { DateProvider } from '../../../common/date/providers/date.provider';
import { DelayedReconnectionStrategy } from './delayed-reconnection.strategy';
import { ImmediateReconnectionStrategy } from './immediate-reconnection.strategy';
import { Logger } from '../../../logger/providers/logger.interface';

export class ReconnectionStrategyFactory {
  static createStrategy(environment: 'test' | 'production' = 'production', dateProvider: DateProvider, logger: Logger): ReconnectionStrategy {
    if (environment === 'test') {
      return new ImmediateReconnectionStrategy(logger);
    }

    return new DelayedReconnectionStrategy(dateProvider, logger);
  }

  static getDefaultStrategy(dateProvider: DateProvider, logger: Logger): ReconnectionStrategy {
    return new DelayedReconnectionStrategy(dateProvider, logger);
  }
}
