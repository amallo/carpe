import BleManager from 'react-native-ble-manager';
import { Logger } from '../../../logger/providers/logger.interface';

/**
 * Handles BLE bonding operations (pairing and secure connections)
 */
export class BLEBonding {
  constructor(private logger?: Logger) {}

  /**
   * Check if a device is bonded (paired)
   */
  async isBonded(peerId: string): Promise<boolean> {
    this.logger?.debug('BLE-BONDING', `Checking if ${peerId} is bonded`);
    const boundedPeripherals = await BleManager.getBondedPeripherals();
    const isBonded = boundedPeripherals.some(p => p.id === peerId);
    this.logger?.debug('BLE-BONDING', `Device ${peerId} bonded: ${isBonded}`);
    return isBonded;
  }

  /**
   * Create a bond (pair) with a device
   */
  async createBond(peerId: string): Promise<void> {
    this.logger?.info('BLE-BONDING', `Creating bond for ${peerId}`);
    await BleManager.createBond(peerId);
    this.logger?.info('BLE-BONDING', `Bond created successfully for ${peerId}`);
  }

  /**
   * Remove a bond (unpair) from a device
   */
  async removeBond(peerId: string): Promise<void> {
    this.logger?.info('BLE-BONDING', `Removing bond for ${peerId}`);
    await BleManager.removeBond(peerId);
    this.logger?.info('BLE-BONDING', `Bond removed successfully for ${peerId}`);
  }

  /**
   * Get all bonded device IDs
   */
  async getBondedDevices(): Promise<string[]> {
    this.logger?.debug('BLE-BONDING', 'Getting all bonded devices');
    const bonded = await BleManager.getBondedPeripherals();
    const deviceIds = bonded.map(p => p.id);
    this.logger?.debug('BLE-BONDING', `Found ${deviceIds.length} bonded devices`);
    return deviceIds;
  }

  /**
   * Get detailed information about all bonded devices
   */
  async getBondedDevicesInfo(): Promise<Array<{id: string, name?: string}>> {
    this.logger?.debug('BLE-BONDING', 'Getting bonded devices info');
    const bonded = await BleManager.getBondedPeripherals();
    return bonded.map(p => ({ id: p.id, name: p.name }));
  }
}
