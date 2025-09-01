import BleManager, { BleScanMode } from 'react-native-ble-manager';
import { Logger } from '../../../logger/providers/logger.interface';
import { PeerFound, PeerError } from '../peer.provider';

/**
 * Handles BLE scanning operations
 */
export class BLEScanner {
  private isScanning = false;
  private onStopListener: any;
  private onDiscoverListener: any;
  private scanStartedCallback: (() => void) | null = null;
  private scanStoppedCallback: (() => void) | null = null;
  private peerFoundCallback: ((peer: PeerFound) => void) | null = null;

  constructor(private logger?: Logger) {
    this.setupListeners();
  }

  /**
   * Start BLE scanning
   */
  async startScan(): Promise<void> {
    this.logger?.debug('BLE-SCANNER', 'Starting scan');
    this.isScanning = true;
    
    try {
      await BleManager.scan(['6E400001-B5A3-F393-E0A9-E50E24DCCA9E'], 20, undefined, {
        scanMode: BleScanMode.Opportunistic
      });
      
      this.logger?.debug('BLE-SCANNER', 'Scan started successfully');
      this.scanStartedCallback?.();
      
    } catch (error: any) {
      this.isScanning = false;
      this.logger?.error('BLE-SCANNER', `Scan error: ${error.message}`);
      
      // Handle BLE-specific scan errors
      if (error.message?.includes('bluetooth')) {
        throw new Error(PeerError.BLUETOOTH_DISABLED);
      }
      if (error.message?.includes('permission')) {
        throw new Error(PeerError.PERMISSION_DENIED);
      }
      if (error.message?.includes('scan')) {
        throw new Error(PeerError.SCAN_IN_PROGRESS);
      }
      throw error;
    }
  }

  /**
   * Stop BLE scanning
   */
  async stopScan(): Promise<void> {
    this.logger?.debug('BLE-SCANNER', 'Stopping scan');
    this.isScanning = false;
    await BleManager.stopScan();
  }

  /**
   * Get current scanning status
   */
  getScanningStatus(): boolean {
    return this.isScanning;
  }

  /**
   * Setup scan event listeners
   */
  private setupListeners(): void {
    // Stop scan listener
    this.onStopListener = BleManager.onStopScan(() => {
      this.logger?.debug('BLE-SCANNER', 'Scan stopped event received');
      this.isScanning = false;
      this.scanStoppedCallback?.();
    });

    // Peer discovery listener
    this.onDiscoverListener = BleManager.onDiscoverPeripheral((peripheral: any) => {
      this.logger?.debug('BLE-SCANNER', `Peripheral discovered: ${peripheral.id}`);
      
      if (this.peerFoundCallback) {
        // Parse LoRa data from manufacturerData
        const loraData = this.parseLoRaManufacturerData(peripheral.manufacturerData);

        const peerFound: PeerFound = {
          id: peripheral.id,
          name: peripheral.name ?? peripheral.localName ?? 'Unknown',
          rssi: peripheral.rssi,
          advertising: peripheral.advertising,
          manufacturerData: peripheral.manufacturerData,
          serviceUUIDs: peripheral.serviceUUIDs,
          txPowerLevel: peripheral.txPowerLevel,
          isConnectable: peripheral.isConnectable,
          localName: peripheral.localName,
          txPower: peripheral.txPower,
          overflowServiceUUIDs: peripheral.overflowServiceUUIDs,
          solicitedServiceUUIDs: peripheral.solicitedServiceUUIDs,
          serviceData: peripheral.serviceData,
          // LoRa specific data
          isSecured: loraData.isSecured,
          deviceType: loraData.deviceType,
          firmware: loraData.firmware,
          batteryLevel: loraData.batteryLevel,
        };

        this.peerFoundCallback(peerFound);
      }
    });
  }

  /**
   * Parse LoRa manufacturer data
   */
  private parseLoRaManufacturerData(manufacturerData?: string): {
    isSecured: boolean;
    deviceType: 'lora_transceiver' | 'lora_gateway' | 'lora_node';
    firmware: string;
    batteryLevel: number;
  } {
    // For now, return default values without security
    return {
      isSecured: false,
      deviceType: 'lora_transceiver',
      firmware: '1.0.0',
      batteryLevel: 85,
    };
  }

  /**
   * Register callback for scan started event
   */
  onScanStarted(callback: () => void): void {
    this.logger?.debug('BLE-SCANNER', 'Scan started callback registered');
    this.scanStartedCallback = callback;
  }

  /**
   * Register callback for scan stopped event
   */
  onScanStopped(callback: () => void): void {
    this.logger?.debug('BLE-SCANNER', 'Scan stopped callback registered');
    this.scanStoppedCallback = callback;
  }

  /**
   * Register callback for peer found event
   */
  onPeerFound(callback: (peer: PeerFound) => void): void {
    this.logger?.debug('BLE-SCANNER', 'Peer found callback registered');
    this.peerFoundCallback = callback;
  }

  /**
   * Cleanup listeners
   */
  destroy(): void {
    this.logger?.debug('BLE-SCANNER', 'Destroying scanner and cleaning up listeners');
    // Note: react-native-ble-manager doesn't provide explicit cleanup methods
    // The listeners are automatically cleaned up when the app is destroyed
  }
}
