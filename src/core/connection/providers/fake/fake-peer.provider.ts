import { PeerProvider, PeerScanned } from '../peer.provider';

export class FakePeerProvider implements PeerProvider{
    private _peerScaaned: PeerScanned[] = [];
    private _callback: ((peer: PeerScanned) => void) | null = null;
    schedulePeerScanned(peer: PeerScanned){
        this._peerScaaned.push(peer);
    }
    scan(): Promise<void> {
        this._peerScaaned.forEach(peer => this._callback?.(peer));
        return Promise.resolve();
    }
    onPeerScanned(callback: (peer: PeerScanned) => void): void {
        this._callback = callback;
    }
}
