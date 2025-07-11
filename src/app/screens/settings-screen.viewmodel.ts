import { useAppSelector } from '../store/hooks';
import { selectFirstConnectedDevice, selectError } from '../../core/peers/store/peers.slice';
import { DeviceStatusService } from '../../core/peers/services/device-status.service';

export interface LoRaDevice {
  id: string;
  name: string;
  status: 'connected' | 'connecting' | 'disconnected' | 'error';
  batteryLevel: number;
  signalStrength: number;
  lastSeen: string;
  publicKey: string;
  firmware: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
}

export const useSettingsScreenViewModel = () => {
  // Consommation du state via des selectors spécialisés
  const connectedDevice = useAppSelector(selectFirstConnectedDevice);
  const error = useAppSelector(selectError);

  // Mapping via le service de logique métier
  const loraDevice: LoRaDevice = DeviceStatusService.mapPeerToDeviceInfo(connectedDevice);

  return {
    // Données du state via selectors
    loraDevice,
    error,

    // États calculés
    isConnected: loraDevice.status === 'connected',
    hasDevice: connectedDevice !== null,
    isConnecting: loraDevice.status === 'connecting',
    isDisconnected: loraDevice.status === 'disconnected',

  };
};
