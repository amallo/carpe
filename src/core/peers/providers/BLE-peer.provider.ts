import { PeerFound, PeerProvider, PeerError } from './peer.provider';
import BleManager, { BleScanMode } from 'react-native-ble-manager';
import { Logger } from '../../logger/providers/logger.interface';

export class BLEPeerProvider implements PeerProvider{
    private logger?: Logger;
    private scanStartedCallback: (() => void) | null = null;
    private scanStoppedCallback: (() => void) | null = null;
    private peerFoundCallback: ((peer: PeerFound) => void) | null = null;
    private isScanning: boolean = false;

    constructor(params?: { logger?: Logger }) {
        if (params?.logger) {
            this.logger = params.logger;
        }
    }

    // Parser les données LoRa depuis manufacturerData
    private parseLoRaManufacturerData(_manufacturerData?: string): {
        isSecured: boolean;
        deviceType: 'lora_transceiver' | 'lora_gateway' | 'lora_node';
        firmware: string;
        batteryLevel: number;
    } {
        // Pour l'instant, retourner des valeurs par défaut sans sécurité
        return {
            isSecured: false, // Pas de sécurité pour commencer
            deviceType: 'lora_transceiver',
            firmware: '1.0.0',
            batteryLevel: 85,
        };
    }
    private onStopListener = BleManager.onStopScan(() => {
        this.isScanning = false;
        if (this.scanStoppedCallback) {
            this.scanStoppedCallback();
        }
    });
    private onDidDiscoverPeri = BleManager.onDiscoverPeripheral((p: any) => {
        if (this.peerFoundCallback) {
            // Parser les données LoRa depuis manufacturerData
            const loraData = this.parseLoRaManufacturerData(p.manufacturerData);

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
                // Données LoRa spécifiques
                isSecured: loraData.isSecured,
                deviceType: loraData.deviceType,
                firmware: loraData.firmware,
                batteryLevel: loraData.batteryLevel,
            });
        }
    });
    onScanStarted(callback: () => void): void {
        this.logger?.debug('BLE', 'onScanStarted() callback registered');
        this.scanStartedCallback = callback;
    }
    onPeerFound(callback: (peer: PeerFound) => void): void {
        this.logger?.debug('BLE', 'onPeerFound() callback registered');
        this.peerFoundCallback = callback;
    }
    start(): Promise<void> {
        this.logger?.debug('BLE', 'start() called');
        return BleManager.start();
    }
    async scan(): Promise<void> {
        this.logger?.debug('BLE', 'scan() called');
        

        this.isScanning = true;
        this.logger?.debug('BLE', 'scan() started');
        return BleManager.scan(['6E400001-B5A3-F393-E0A9-E50E24DCCA9E'], 20, undefined, {scanMode: BleScanMode.Opportunistic}).then(()=>{
            if (this.scanStartedCallback) {
                this.logger?.debug('BLE', 'scanStartedCallback called');
                this.scanStartedCallback();
            }
        }).catch((error) => {
            this.isScanning = false;
            this.logger?.debug('BLE', `scan() error: ${error.message}`);
            // Gérer les erreurs BLE spécifiques
            if (error.message?.includes('bluetooth')) {
                throw new Error(PeerError.BLUETOOTH_DISABLED);
            }
            if (error.message?.includes('permission')) {
                throw new Error(PeerError.PERMISSION_DENIED);
            }
            throw error;
        });
    }
    async stopScan(): Promise<void> {
        this.logger?.debug('BLE', 'stopScan() called');
        this.isScanning = false;
        return BleManager.stopScan();
    }
    async pairing(peerId: string): Promise<void> {
        this.logger?.debug('BLE', `pairing() called with peerId=${peerId}`);
        try {

            const hasAlreadyPaired = await BleManager.isPeripheralConnected(peerId);
            if (hasAlreadyPaired) {
                this.logger?.info('BLE', `pairing() failed: already connected to ${peerId}`);
                return;
            }
            // Tenter la connexion BLE
            await BleManager.connect(peerId);
            this.logger?.debug('BLE', `pairing() success for peerId=${peerId}`);

            // Vérifier si la connexion a réussi
            const isPaired = await BleManager.isPeripheralConnected(peerId);
            this.logger?.debug('BLE', `isPeripheralConnected(${peerId}) = ${isPaired}`);
            if (!isPaired) {
                this.logger?.debug('BLE', `pairing() failed: not connected to ${peerId}`);
                throw new Error(PeerError.CONNECTION_FAILED);
            }

        } catch (error: any) {
            this.logger?.debug('BLE', `pairing() error: ${error.message}`);
            // Gérer les erreurs BLE spécifiques selon l'interface
            if (error.message?.includes('not found') || error.message?.includes('not found')) {
                throw new Error(PeerError.PEER_NOT_FOUND);
            }
            if (error.message?.includes('timeout')) {
                throw new Error(PeerError.CONNECTION_TIMEOUT);
            }
            if (error.message?.includes('already connected')) {
                throw new Error(PeerError.PEER_ALREADY_CONNECTED);
            }
            if (error.message?.includes('not connectable')) {
                throw new Error(PeerError.PEER_NOT_CONNECTABLE);
            }
            if (error.message?.includes('authentication')) {
                throw new Error(PeerError.AUTHENTICATION_FAILED);
            }
            if (error.message?.includes('security') || error.message?.includes('PIN')) {
                throw new Error(PeerError.SECURITY_REQUIRED);
            }
            if (error.message?.includes('bluetooth')) {
                throw new Error(PeerError.BLUETOOTH_DISABLED);
            }
            if (error.message?.includes('permission')) {
                throw new Error(PeerError.PERMISSION_DENIED);
            }

            // Erreur générique si aucune correspondance
            throw new Error(PeerError.CONNECTION_FAILED);
        }
    }
    async unpair(peerId: string): Promise<void> {
        this.logger?.debug('BLE', `unpair() called with peerId=${peerId}`);
        const isPeripheralConnected= await BleManager.isPeripheralConnected(peerId);
        if (isPeripheralConnected){
            throw new Error(PeerError.PEER_NOT_FOUND);
        }
        await BleManager.disconnect(peerId);
    }
    onScanStopped(callback: () => void): void {
        this.logger?.debug('BLE', 'onScanStopped() callback registered');
        this.scanStoppedCallback = callback;
    }
    destroy(): void {
        this.onStopListener.remove();
        this.onDidDiscoverPeri.remove();
    }
}
