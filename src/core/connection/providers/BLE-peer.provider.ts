import { PeerFound, PeerProvider } from './peer.provider';
import BleManager, { BleScanMode } from 'react-native-ble-manager';

export class BLEPeerProvider implements PeerProvider{
    private scanStartedCallback: (() => void) | null = null;
    private scanStoppedCallback: (() => void) | null = null;
    private peerFoundCallback: ((peer: PeerFound) => void) | null = null;
    private onStopListener = BleManager.onStopScan(() => {
        if (this.scanStoppedCallback) {
            this.scanStoppedCallback();
        }
    });
    private onDidDiscoverPeri = BleManager.onDiscoverPeripheral((p) => {
        if (this.peerFoundCallback) {
            this.peerFoundCallback({
                id: p.id, 
                name: p.name ?? p.localName ?? 'Inconnu',
                rssi: p.rssi,
                advertising: p.advertising,
                manufacturerData: p.manufacturerData,
                serviceUUIDs: p.serviceUUIDs,
                txPowerLevel: p.txPowerLevel,
                isConnectable: p.isConnectable,
                localName: p.localName,
                txPower: p.txPower,
                overflowServiceUUIDs: p.overflowServiceUUIDs,
                solicitedServiceUUIDs: p.solicitedServiceUUIDs,
                serviceData: p.serviceData,
                lastSeen: new Date(),
            });
        }
    });
    onScanStarted(callback: () => void): void {
        this.scanStartedCallback = callback;
    }
    onPeerFound(callback: (peer: PeerFound) => void): void {
        this.peerFoundCallback = callback;
    }
    start(): Promise<void> {
        return BleManager.start();
    }
    async scan(): Promise<void> {
        return BleManager.scan(['6E400001-B5A3-F393-E0A9-E50E24DCCA9E'], 20, undefined, {scanMode: BleScanMode.Opportunistic}).then(()=>{
            if (this.scanStartedCallback) {
                this.scanStartedCallback();
            }
        });
    }
    async stopScan(): Promise<void> {
        return BleManager.stopScan();
    }
    onScanStopped(callback: () => void): void {
        this.scanStoppedCallback = callback;
    }
    destroy(): void {
        this.onStopListener.remove();
        this.onDidDiscoverPeri.remove();
    }
}
