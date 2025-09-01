import BleManager from 'react-native-ble-manager';
import { Logger } from '../../../logger/providers/logger.interface';
import { PeerError } from '../peer.provider';

/**
 * Handles BLE connection operations (connect/disconnect)
 */
export class BLEConnection {
  constructor(private logger?: Logger) {}

  /**
   * Check if a device is currently connected
   */
  async isConnected(peerId: string): Promise<boolean> {
    this.logger?.debug('BLE-CONNECTION', `Checking connection status for ${peerId}`);
    const isConnected = await BleManager.isPeripheralConnected(peerId);
    this.logger?.debug('BLE-CONNECTION', `Device ${peerId} connected: ${isConnected}`);
    return isConnected;
  }

  /**
   * Connect to a device
   */
  async connect(peerId: string): Promise<void> {
    this.logger?.info('BLE-CONNECTION', `Connecting to ${peerId}`);
    await BleManager.connect(peerId);
    this.logger?.info('BLE-CONNECTION', `Connected successfully to ${peerId}`);
  }

  /**
   * Disconnect from a device
   */
  async disconnect(peerId: string): Promise<void> {
    this.logger?.info('BLE-CONNECTION', `Disconnecting from ${peerId}`);
    await BleManager.disconnect(peerId);
    this.logger?.info('BLE-CONNECTION', `Disconnected successfully from ${peerId}`);
  }

  /**
   * Verify that a connection is established, throw error if not
   */
  async verifyConnection(peerId: string): Promise<void> {
    const isConnected = await this.isConnected(peerId);
    if (!isConnected) {
      this.logger?.error('BLE-CONNECTION', `Verification failed: ${peerId} is not connected`);
      throw new Error(PeerError.CONNECTION_FAILED);
    }
    this.logger?.debug('BLE-CONNECTION', `Connection verified for ${peerId}`);
  }

  /**
   * Ensure a device is connected after a bonding operation
   */
  async ensureConnectedAfterBond(peerId: string): Promise<void> {
    const isConnectedAfterBond = await this.isConnected(peerId);
    if (!isConnectedAfterBond) {
      this.logger?.debug('BLE-CONNECTION', `Bond created but not connected, connecting manually to ${peerId}`);
      await this.connect(peerId);
    } else {
      this.logger?.debug('BLE-CONNECTION', `Device ${peerId} already connected after bonding`);
    }
  }
}
