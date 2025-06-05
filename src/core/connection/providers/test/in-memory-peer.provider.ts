import { PeerFound, PeerProvider } from '../peer.provider';

const PEERS: PeerFound[] = [{
    id: '1',
    name: 'Peer 1',
}, {
    id: '2',
    name: 'Peer 2',
}, {
    id: '3',
    name: 'Peer 3',
}];
export class InMemoryPeerProvider implements PeerProvider{
    private _peerScanned: PeerFound[] = [];
    private _callback: ((peer: PeerFound) => void) | null = null;
    private _scanStoppedCallback: (() => void) | null = null;
    private _scanStartedCallback: (() => void) | null = null;
    constructor(private _timeout: number){}
    scan(): Promise<void> {
        this._peerScanned = PEERS;
        this._scanStartedCallback?.();
        setTimeout(() => {
            this._peerScanned.forEach(peer => this._callback?.(peer));
            this._peerScanned = [];
        }, this._timeout);
        return Promise.resolve();
    }
    stopScan(): Promise<void> {
        this._scanStoppedCallback?.();
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
