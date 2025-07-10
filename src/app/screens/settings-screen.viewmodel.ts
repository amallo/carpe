import { useAppSelector } from '../store/hooks';
import { selectAllPeers } from '../../core/peers/store/peers.slice';

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
  const peers = useAppSelector(selectAllPeers);
  
  // Trouver l'appareil connecté (pour l'instant, on prend le premier)
  const connectedDevice = peers.find(peer => peer.deviceType === 'lora_transceiver');
  
  const loraDevice: LoRaDevice = connectedDevice ? {
    id: connectedDevice.id,
    name: connectedDevice.name,
    status: 'connected', // Pour l'instant, on considère qu'il est connecté
    batteryLevel: connectedDevice.batteryLevel || 0,
    signalStrength: connectedDevice.signalStrength || 50,
    lastSeen: connectedDevice.lastSeen ? 
      `Il y a ${Math.floor((new Date().getTime() - new Date(connectedDevice.lastSeen).getTime()) / 1000)} sec` : 
      'Jamais vu',
    publicKey: `pk_${connectedDevice.id}`, // Générer une clé basée sur l'ID
    firmware: connectedDevice.firmware || 'Inconnu',
  } : {
    id: 'no_device',
    name: 'Aucun appareil connecté',
    status: 'disconnected',
    batteryLevel: 0,
    signalStrength: 0,
    lastSeen: 'Jamais connecté',
    publicKey: '',
    firmware: 'Inconnu',
  };

  return {
    loraDevice,
    isConnected: loraDevice.status === 'connected',
    hasDevice: connectedDevice !== undefined,
  };
}; 