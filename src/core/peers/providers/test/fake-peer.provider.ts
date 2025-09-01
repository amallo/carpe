import { CallTracker } from '../../../test/call-tracker';
import { PeerProvider, PeerFound, PeerError } from '../peer.provider';

export class FakePeerProvider implements PeerProvider{
    private _peerScaaned: PeerFound[] = [];
    private _callback: ((peer: PeerFound) => void) | null = null;
    private _scanCallTracker = new CallTracker();
    private _stopScanCallTracker = new CallTracker();
    private _connectToPeerCallTracker = new CallTracker();
    private _scanStoppedCallback: (() => void) | null = null;
    private _scanStartedCallback: (() => void) | null = null;
    private _unpairCallTracker = new CallTracker();
    schedulePeerFound(peer: PeerFound){
        this._peerScaaned.push(peer);
    }
    async scan(): Promise<void> {
        this._scanStartedCallback?.();
        this._peerScaaned.forEach(peer => this._callback?.(peer));
        this._scanCallTracker.recordCall();
        return Promise.resolve().then(()=>this.stopScan());
    }
    stopScan(): Promise<void> {
        this._stopScanCallTracker.recordCall();
        this._scanStoppedCallback?.();
        return Promise.resolve();
    }
    async connect(peerId: string): Promise<void> {
        this._connectToPeerCallTracker.recordCall();
        
        // Simuler les erreurs possibles selon l'interface
        if (peerId === 'non-existent-peer') {
            throw new Error(PeerError.PEER_NOT_FOUND);
        }
        
        if (peerId === 'timeout-peer' || peerId === 'timeout-peer-id') {
            throw new Error(PeerError.CONNECTION_TIMEOUT);
        }
        
        if (peerId === 'already-connected-peer') {
            throw new Error(PeerError.PEER_ALREADY_CONNECTED);
        }
        
        if (peerId === 'not-connectable-peer') {
            throw new Error(PeerError.PEER_NOT_CONNECTABLE);
        }
        
        if (peerId === 'secured-peer') {
            throw new Error(PeerError.SECURITY_REQUIRED);
        }
        
        return Promise.resolve();
    }
    disconnect(peerId: string): Promise<void> {
        this._unpairCallTracker.recordCall(peerId);
        return Promise.resolve();
    }
    disconnectWasCalledWithPeerId(peerId: string): boolean {
        return this._unpairCallTracker.wasCalledWith(peerId);
    }
    disconnectWasCalled(): boolean {
        return this._unpairCallTracker.methodWasCalled();
    }
    disconnectWasNotCalled(): boolean {
        return !this._unpairCallTracker.methodWasCalled();
    }
    scanWasCalled(): boolean {
        return this._scanCallTracker.methodWasCalled();
    }
    stopScanWasCalled(): boolean {
        return this._stopScanCallTracker.methodWasCalled();
    }
    connectToPeerWasCalled(): boolean {
        return this._connectToPeerCallTracker.methodWasCalled();
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
