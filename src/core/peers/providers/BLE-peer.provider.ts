import { PeerFound, PeerProvider, PeerError } from './peer.provider';
import BleManager, { BleScanMode } from 'react-native-ble-manager';
import { Logger } from '../../logger/providers/logger.interface';
import { BLEBonding } from './ble/BLE-bonding';
import { BLEConnection } from './ble/BLE-connection';
import { BLEScanner } from './ble/BLE-scanner';
import { BLEErrorHandler } from './ble/BLE-error-handler';

export class BLEPeerProvider implements PeerProvider{
    private logger?: Logger;
    private bleBonding: BLEBonding;
    private bleConnection: BLEConnection;
    private bleScanner: BLEScanner;
    private bleErrorHandler: BLEErrorHandler;

    constructor(params?: { logger?: Logger }) {
        this.logger = params?.logger;
        this.bleBonding = new BLEBonding(this.logger);
        this.bleConnection = new BLEConnection(this.logger);
        this.bleScanner = new BLEScanner(this.logger);
        this.bleErrorHandler = new BLEErrorHandler(this.logger);
    }


    onPeerFound(callback: (peer: PeerFound) => void): void {
        this.bleScanner.onPeerFound(callback);
    }

    onScanStarted(callback: () => void): void {
        this.bleScanner.onScanStarted(callback);
    }

    start(): Promise<void> {
        this.logger?.debug('BLE', 'start() called');
        return BleManager.start();
    }

    async scan(): Promise<void> {
        try {
            await this.bleScanner.startScan();
        } catch (error: any) {
            throw this.bleErrorHandler.mapError(error);
        }
    }

    async stopScan(): Promise<void> {
        try {
            await this.bleScanner.stopScan();
        } catch (error: any) {
            throw this.bleErrorHandler.mapError(error);
        }
    }
    async connect(peerId: string): Promise<void> {
        this.logger?.debug('BLE', `connect() called with peerId=${peerId}`);

        try {
            // 1. Check if already connected
            if (await this.bleConnection.isConnected(peerId)) {
                this.logger?.info('BLE', `Device ${peerId} already connected`);
                return;
            }

            // 2. Smart bonding logic
            const isBonded = await this.bleBonding.isBonded(peerId);
            this.logger?.info('BLE', `connect(${peerId}): bonded=${isBonded}`);

            if (isBonded) {
                // Device is bonded → direct connection (faster)
                this.logger?.info('BLE', `Device ${peerId} already bonded, connecting directly`);
                await this.bleConnection.connect(peerId);
            } else {
                // Device not bonded → create bond first (secure)
                this.logger?.info('BLE', `Device ${peerId} not bonded, creating bond first`);
                await this.bleBonding.createBond(peerId);

                // Ensure connection after bonding
                await this.bleConnection.ensureConnectedAfterBond(peerId);
            }

            // 3. Final verification
            await this.bleConnection.verifyConnection(peerId);
            this.logger?.info('BLE', `connect() success for peerId=${peerId}`);

        } catch (error: any) {
            throw this.bleErrorHandler.createDetailedError('connect', peerId, error);
        }
    }
    async disconnect(peerId: string): Promise<void> {
        this.logger?.debug('BLE', `disconnect() called with peerId=${peerId}`);
        try {
            await this.bleConnection.disconnect(peerId);
        } catch (error: any) {
            throw this.bleErrorHandler.createDetailedError('disconnect', peerId, error);
        }
    }
    onScanStopped(callback: () => void): void {
        this.bleScanner.onScanStopped(callback);
    }
    destroy(): void {
        this.logger?.debug('BLE', 'Destroying BLEPeerProvider');
        this.bleScanner.destroy();
    }
}
