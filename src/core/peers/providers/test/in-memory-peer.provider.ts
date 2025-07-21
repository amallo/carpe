import { PeerFound, PeerProvider, PeerError } from '../peer.provider';

const PEERS: PeerFound[] = [{
    id: 'lora_001',
    name: 'LoRa Émetteur Pro v2.1',
    rssi: -60,
    deviceType: 'lora_transceiver',
    firmware: '2.1.0',
    batteryLevel: 90,
    isSecured: true,
    lastSeen: new Date(),
    signalStrength: 85,
}, {
    id: 'lora_002',
    name: 'LoRa Gateway Mesh',
    rssi: -70,
    deviceType: 'lora_gateway',
    firmware: '1.5.2',
    batteryLevel: 75,
    isSecured: false,
    lastSeen: new Date(),
    signalStrength: 65,
}, {
    id: 'lora_003',
    name: 'Peer 3',
    rssi: -80,
    deviceType: 'lora_node',
    firmware: '1.0.0',
    batteryLevel: 60,
    isSecured: false,
    lastSeen: new Date(),
    signalStrength: 45,
}];
export class InMemoryPeerProvider implements PeerProvider{
    private _peerScanned: PeerFound[] = [];
    private _callback: ((peer: PeerFound) => void) | null = null;
    private _scanStoppedCallback: (() => void) | null = null;
    private _scanStartedCallback: (() => void) | null = null;
    scan(): Promise<void> {
        this._peerScanned = PEERS;
        this._scanStartedCallback?.();
        this._peerScanned.forEach(peer => this._callback?.(peer));
        return Promise.resolve();
    }
    stopScan(): Promise<void> {
        this._scanStoppedCallback?.();
        return Promise.resolve();
    }
    async pairing(peerId: string): Promise<void> {
        // Vérifier si le peer existe dans la liste
        const peer = PEERS.find(p => p.id === peerId);
        if (!peer) {
            throw new Error(PeerError.PEER_NOT_FOUND);
        }

        // Simuler une connexion réussie
        return Promise.resolve();
    }
    onPeerFound(callback: (peer: PeerFound) => void): void {
        this._callback = callback;
    }
    onScanStopped(callback: () => void): void {
        this._scanStoppedCallback = callback;
    }
    onScanStarted(callback: () => void): void {
        this._scanStartedCallback = callback;
    }
}
