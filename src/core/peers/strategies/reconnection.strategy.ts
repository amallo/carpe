import { PairedPeerEntity } from '../store/paired-peer.slice';

/**
 * Context for reconnection decisions
 */
export interface ReconnectionContext {
  batteryLevel?: number;
  networkQuality?: 'excellent' | 'good' | 'poor' | 'unavailable';
  timeSinceLastConnection?: number;
  connectionAttempts?: number;
}

/**
 * Strategy interface for peer reconnection
 */
export interface ReconnectionStrategy {
  /**
   * Determines if reconnection should be attempted
   */
  shouldReconnect(peer: PairedPeerEntity, context: ReconnectionContext): boolean;
}
