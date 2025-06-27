import { CallTracker } from '../../../test/call-tracker';
import { PeerProvider, PeerFound } from '../peer.provider';

export class FakePeerProvider implements PeerProvider{
    private _peerScaaned: PeerFound[] = [];
    private _callback: ((peer: PeerFound) => void) | null = null;
    private _scanCallTracker = new CallTracker();
    private _stopScanCallTracker = new CallTracker();
    private _scanStoppedCallback: (() => void) | null = null;
    private _scanStartedCallback: (() => void) | null = null;
    schedulePeerFound(peer: PeerFound){
        this._peerScaaned.push(peer);
    }
    async scan(): Promise<void> {
        this._scanStartedCallback?.();
        this._peerScaaned.forEach(peer => this._callback?.(peer));
        this._scanCallTracker.recordCall();
        return Promise.resolve().then(()=>{
            if (this._scanStoppedCallback) {
                this._scanStoppedCallback();
            }
        });
    }
    stopScan(): Promise<void> {
        this._stopScanCallTracker.recordCall();
        this._scanStoppedCallback?.();
        return Promise.resolve();
    }
    scanWasCalled(): boolean {
        return this._scanCallTracker.methodWasCalled();
    }
    stopScanWasCalled(): boolean {
        return this._stopScanCallTracker.methodWasCalled();
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
