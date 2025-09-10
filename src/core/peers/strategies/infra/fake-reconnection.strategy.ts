import { ReconnectionStrategy, ReconnectionContext } from '../reconnection.strategy';
import { PairedPeerEntity } from '../../store/paired-peer.slice';

export class FakeReconnectionStrategy implements ReconnectionStrategy {
  private shouldReconnectValue: boolean = true;

  shouldReconnect(peer: PairedPeerEntity, context: ReconnectionContext): boolean {
    return this.shouldReconnectValue;
  }

  // Test helper methods
  willReconnect(shouldReconnect: boolean): void {
    this.shouldReconnectValue = shouldReconnect;
  }
}
