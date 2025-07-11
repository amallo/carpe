import { PeerEntity } from '../store/peers.slice';

export type DeviceStatus = 'connected' | 'connecting' | 'disconnected' | 'error';

export interface DeviceInfo {
  id: string;
  name: string;
  status: DeviceStatus;
  batteryLevel: number;
  signalStrength: number;
  lastSeen: string;
  publicKey: string;
  firmware: string;
}

export class DeviceStatusService {
  static getDeviceStatus(peer: PeerEntity | null): DeviceStatus {
    if (!peer) {return 'disconnected';}

    // Logique pour déterminer le statut basée sur les propriétés du peer
    if (peer.lastSeen) {
      const lastSeenDate = new Date(peer.lastSeen);
      const now = new Date();
      const diffMs = now.getTime() - lastSeenDate.getTime();
      const diffMinutes = diffMs / (1000 * 60);

      if (diffMinutes < 5) {return 'connected';}
      if (diffMinutes < 30) {return 'connecting';}
      return 'disconnected';
    }

    return 'disconnected';
  }

  static formatLastSeen(lastSeen?: string): string {
    if (!lastSeen) {return 'Jamais connecté';}

    const lastSeenDate = new Date(lastSeen);
    const now = new Date();
    const diffMs = now.getTime() - lastSeenDate.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {return `Il y a ${diffSeconds} sec`;}
    if (diffMinutes < 60) {return `Il y a ${diffMinutes} min`;}
    if (diffHours < 24) {return `Il y a ${diffHours}h`;}
    return `Il y a ${diffDays}j`;
  }

  static generatePublicKey(peerId: string): string {
    return `pk_${peerId}`;
  }

  static mapPeerToDeviceInfo(peer: PeerEntity | null): DeviceInfo {
    if (!peer) {
      return {
        id: 'no_device',
        name: 'Aucun appareil connecté',
        status: 'disconnected',
        batteryLevel: 0,
        signalStrength: 0,
        lastSeen: 'Jamais connecté',
        publicKey: '',
        firmware: 'Inconnu',
      };
    }

    return {
      id: peer.id,
      name: peer.name,
      status: this.getDeviceStatus(peer),
      batteryLevel: peer.batteryLevel || 0,
      signalStrength: peer.signalStrength || 50,
      lastSeen: this.formatLastSeen(peer.lastSeen),
      publicKey: this.generatePublicKey(peer.id),
      firmware: peer.firmware || 'Inconnu',
    };
  }
}
