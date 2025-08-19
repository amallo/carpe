import { PeerFound, PeerProvider, PeerError } from '../peer.provider';
import { Logger } from '../../../logger/providers/logger.interface';

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
    private logger: Logger | null = null;
    private _peerScanned: PeerFound[] = [];
    private _callback: ((peer: PeerFound) => void) | null = null;
    private _scanStoppedCallback: (() => void) | null = null;
    private _scanStartedCallback: (() => void) | null = null;
    private _pairedPeerIds: Set<string> = new Set();
    
    constructor(params?: { logger?: Logger }) {
        if (params?.logger) {
            this.logger = params.logger;
        }
    }

    // Méthodes pour compatibilité avec BLEPeerProvider
    start(): Promise<void> {
        
        this.logger?.debug('INMEMORY', 'start() called');
        if (this.logger) {
            this.logger.debug('INMEMORY', '[DEV] InMemoryPeerProvider started');
        } else {
            console.log('🔧 [DEV] InMemoryPeerProvider started');
        }
        return Promise.resolve();
    }
    
    destroy(): void {
        this.logger?.debug('INMEMORY', 'destroy() called');
        if (this.logger) {
            this.logger.debug('INMEMORY', '[DEV] InMemoryPeerProvider destroyed');
        } else {
            console.log('🔧 [DEV] InMemoryPeerProvider destroyed');
        }
        // Cleanup si nécessaire
    }
    
    scan(): Promise<void> {
        console.log("this.logger", this.logger);
        this.logger?.debug('INMEMORY', 'scan() called');
        this._peerScanned = PEERS;
        this.logger?.debug('INMEMORY', `Found ${PEERS.length} peers`);
        this._scanStartedCallback?.();
        this._peerScanned.forEach(peer => this._callback?.(peer));
        return Promise.resolve();
    }
    stopScan(): Promise<void> {
        this.logger?.debug('INMEMORY', 'stopScan() called');
        this._scanStoppedCallback?.();
        return Promise.resolve();
    }
    async pairing(peerId: string): Promise<void> {
        this.logger?.debug('INMEMORY', `pairing() called with peerId=${peerId}`);
        // Vérifier si le peer existe dans la liste
        const peer = PEERS.find(p => p.id === peerId);
        if (!peer) {
            this.logger?.debug('INMEMORY', `pairing() failed: peer ${peerId} not found`);
            throw new Error(PeerError.PEER_NOT_FOUND);
        }
        if (this._pairedPeerIds.has(peerId)) {
            this.logger?.debug('INMEMORY', `pairing() failed: peer ${peerId} already connected`);
            throw new Error(PeerError.PEER_ALREADY_CONNECTED);
        }
        this._pairedPeerIds.add(peerId);
        this.logger?.debug('INMEMORY', `pairing() success: peer ${peerId} connected`);
        return Promise.resolve();
    }
    async unpair(peerId: string): Promise<void> {
        this.logger?.debug('INMEMORY', `unpair() called with peerId=${peerId}`);
        if (!this._pairedPeerIds.has(peerId)) {
            this.logger?.debug('INMEMORY', `unpair() failed: peer ${peerId} not found`);
            throw new Error(PeerError.PEER_NOT_FOUND);
        }
        this._pairedPeerIds.delete(peerId);
        this.logger?.debug('INMEMORY', `unpair() success: peer ${peerId} disconnected`);
        return Promise.resolve();
    }
    onPeerFound(callback: (peer: PeerFound) => void): void {
        this.logger?.debug('INMEMORY', 'onPeerFound() callback registered');
        this._callback = callback;
    }
    onScanStopped(callback: () => void): void {
        this.logger?.debug('INMEMORY', 'onScanStopped() callback registered');
        this._scanStoppedCallback = callback;
    }
    onScanStarted(callback: () => void): void {
        this.logger?.debug('INMEMORY', 'onScanStarted() callback registered');
        this._scanStartedCallback = callback;
    }
}
