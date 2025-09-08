import { ReconnectionStrategy } from './reconnection.strategy';
import { ImmediateReconnectionStrategy } from './immediate-reconnection.strategy';

/**
 * Factory for creating reconnection strategies
 */
export class ReconnectionStrategyFactory {
  /**
   * Creates a reconnection strategy based on the peer type and context
   */
  static createStrategy(): ReconnectionStrategy {
    // For now, we only have the immediate strategy
    // In the future, we can add logic to select different strategies
    // based on peer type, context, or configuration

    return new ImmediateReconnectionStrategy();
  }

  /**
   * Gets the default reconnection strategy
   */
  static getDefaultStrategy(): ReconnectionStrategy {
    return new ImmediateReconnectionStrategy();
  }
}
