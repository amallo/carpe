import { ReconnectionStrategy, ReconnectionContext } from '../reconnection.strategy';
import { PairedPeerEntity } from '../../store/paired-peer.slice';

/**
 * Immediate reconnection strategy
 * Always attempts reconnection for disconnected peers
 */
export class ImmediateReconnectionStrategy implements ReconnectionStrategy {

  shouldReconnect(peer: PairedPeerEntity, _: ReconnectionContext): boolean {
    // Always attempt reconnection for disconnected peers
    return peer.status === 'disconnected';
  }
}