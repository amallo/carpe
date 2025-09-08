import { ReconnectionStrategy, ReconnectionContext } from './reconnection.strategy';
import { PairedPeerEntity } from '../store/paired-peer.slice';
import { DateProvider } from '../../common/date/providers/date.provider';

export class DelayedReconnectionStrategy implements ReconnectionStrategy {
  private readonly maxAttempts: number = 5;
  private readonly delayMs: number = 2000;

  constructor(private readonly dateProvider: DateProvider) {}

  shouldReconnect(peer: PairedPeerEntity, context: ReconnectionContext): boolean {
    // Only attempt reconnection if peer is disconnected
    if (peer.status !== 'disconnected') {
      return false;
    }

    // Check if we haven't exceeded the maximum number of attempts
    const connectionAttempts = context.connectionAttempts || 0;
    if (connectionAttempts >= this.maxAttempts) {
      return false;
    }

    // Calculate time since last connection attempt from peer data
    const currentTime = new Date(this.dateProvider.now());
    const lastConnectionTime = peer.lastConnectionTime ? new Date(peer.lastConnectionTime) : new Date(0);
    const timeSinceLastConnection = currentTime.getTime() - lastConnectionTime.getTime();

    if (timeSinceLastConnection < this.delayMs) {
      return false;
    }

    return true;
  }

  getDelayMs(): number {
    return this.delayMs;
  }

  getMaxAttempts(): number {
    return this.maxAttempts;
  }
}
