import { ReconnectionStrategy, ReconnectionContext } from '../reconnection.strategy';
import { PairedPeerEntity } from '../../store/paired-peer.slice';
import { Logger } from '../../../logger/providers/logger.interface';

/**
 * Immediate reconnection strategy
 * Always attempts reconnection for disconnected peers
 */
export class ImmediateReconnectionStrategy implements ReconnectionStrategy {
  constructor(private readonly logger: Logger) {}
  shouldReconnect(peer: PairedPeerEntity, _: ReconnectionContext, ): boolean {
    // Always attempt reconnection for disconnected peers
    this.logger.info('immediate-reconnection', `Attempting reconnection to peer: ${peer.id}`);
    return peer.status === 'disconnected';
  }
}