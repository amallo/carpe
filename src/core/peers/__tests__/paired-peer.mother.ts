import { PairedPeerEntity } from '../store/paired-peer.slice';

export class PairedPeerMother {
  static connected(peerId: string, connectionAttempts: number = 1, lastConnectionTime?: string): PairedPeerEntity {
    return {
      id: peerId,
      status: 'connected',
      connectionAttempts,
      lastConnectionTime: lastConnectionTime || new Date().toISOString(),
    };
  }

  static disconnected(peerId: string, connectionAttempts: number = 0, lastConnectionTime?: string): PairedPeerEntity {
    return {
      id: peerId,
      status: 'disconnected',
      connectionAttempts,
      lastConnectionTime: lastConnectionTime || new Date().toISOString(),
    };
  }

  static pending(peerId: string, connectionAttempts: number = 1, lastConnectionTime?: string): PairedPeerEntity {
    return {
      id: peerId,
      status: 'pending',
      connectionAttempts,
      lastConnectionTime: lastConnectionTime || new Date().toISOString(),
    };
  }
}
