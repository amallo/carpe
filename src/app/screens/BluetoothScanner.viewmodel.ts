import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectScanLoading, selectAllPeers, selectPeerScanningError } from '../../core/peers/store/peers.slice';
import { selectActivePairedPeers } from '../../core/peers/store/paired-peer.slice';
import { scanPeers } from '../../core/peers/usecases/scan-peers.usecase';
import { pairPeer } from '../../core/peers/usecases/pair-peer.usecase';
import { PermissionStatus, selectMissingPermissionForFeature } from '../../core/permission/store/permission.slice';
import { requestPermission } from '../../core/permission/usecases/request-permission.usecase';
import { permissionConfig } from '../../core/permission/providers/native/permission.config';
import errorMessageMap from '../config/errorMessages';

export type PeerViewModel = {
  id: string;
  name: string;
  macAddress: string;
  signalStrength: number;
  batteryLevel: number;
  firmware: string;
  distance: string;
  lastSeen: string;
  isSecured: boolean;
  deviceType: 'lora_transceiver' | 'lora_gateway' | 'lora_node';
  // Propriétés supplémentaires pour l'affichage
  rssi?: number;
  isConnectable?: boolean;
  // Propriété pour indiquer si le device est connecté
  isConnected: boolean;
  connectionStatus: 'pending' | 'connected' | 'disconnected' | null;
};

export type PermissionViewModel = {
  permissionId: string;
  permissionStatus: PermissionStatus;
  message: string;
  icon: string;
  request: () => void;
}

export const useBluetoothScannerViewModel = () => {
  const dispatch = useAppDispatch();

  // Consommation du state via des selectors uniquement
  const isScanning = useAppSelector(selectScanLoading);
  const peers = useAppSelector(selectAllPeers);
  const error = useAppSelector(selectPeerScanningError);
  const activePairings = useAppSelector(selectActivePairedPeers);
  // Remonter un message utilisateur friendly si possible
  const errorFriendly = error ? (errorMessageMap[error] || 'Une erreur inattendue est survenue. Veuillez réessayer.') : null;
  const missingPermission = useAppSelector((state) => selectMissingPermissionForFeature(state, 'scan-peers'));

  const peersVM: PeerViewModel[] = peers.map((peer) => {
    // Calculer la distance basée sur le RSSI si disponible
    const calculateDistance = (rssi?: number): string => {
      if (!rssi) {return 'Distance inconnue';}
      // Formule approximative basée sur le RSSI
      const distance = Math.pow(10, (rssi - (-50)) / 20);
      if (distance < 1) {return '< 1m';}
      if (distance < 10) {return `${Math.round(distance)}m`;}
      return `${Math.round(distance)}m`;
    };

    // Calculer la force du signal basée sur le RSSI
    const calculateSignalStrength = (rssi?: number): number => {
      if (!rssi) {return 50;} // Valeur par défaut
      // Convertir RSSI (-100 à -30) en pourcentage (0 à 100)
      return Math.max(0, Math.min(100, ((rssi + 100) / 70) * 100));
    };

    // Formater la dernière fois vue
    const formatLastSeen = (lastSeen?: string): string => {
      if (!lastSeen) {return 'Jamais vu';}
      const lastSeenDate = new Date(lastSeen);
      const now = new Date();
      const diffMs = now.getTime() - lastSeenDate.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);

      if (diffSec < 60) {return 'À l\'instant';}
      if (diffMin < 60) {return `Il y a ${diffMin} min`;}
      const diffHour = Math.floor(diffMin / 60);
      if (diffHour < 24) {return `Il y a ${diffHour}h`;}
      return `Il y a ${Math.floor(diffHour / 24)}j`;
    };

    // Vérifier si le device est connecté
    const pairing = activePairings.find(p => p.id === peer.id);
    const isConnected = pairing?.status === 'connected';
    const connectionStatus = pairing?.status || null;

    return {
      id: peer.id,
      name: peer.name,
      macAddress: peer.id, // Utiliser l'ID comme adresse MAC pour l'instant
      signalStrength: calculateSignalStrength(peer.rssi),
      batteryLevel: peer.batteryLevel || 0,
      firmware: peer.firmware || 'Inconnu',
      distance: calculateDistance(peer.rssi),
      lastSeen: formatLastSeen(peer.lastSeen),
      isSecured: peer.isSecured || false,
      deviceType: peer.deviceType || 'lora_transceiver',
      rssi: peer.rssi,
      isConnectable: peer.isConnectable,
      isConnected,
      connectionStatus,
    };
  });

  return {
    // Données du state via selectors
    isScanning,
    peers: peersVM,
    error: errorFriendly,

    // Actions via dispatch de thunks
    startScan: () => {
      return dispatch(scanPeers({ timeout: 30000 }));
    },
    pair: (peerId: string) => {
      return dispatch(pairPeer({ peerId }));
    },

    // Permissions via selectors
    missingPermission: missingPermission.map((p) => ({
      permissionId: p.id,
      permissionStatus: p.status,
      message: permissionConfig[p.id]?.message || 'Permission requise',
      icon: permissionConfig[p.id]?.icon || 'help',
      request: () => dispatch(requestPermission({permissionId: p.id})),
    })),
  };
};
