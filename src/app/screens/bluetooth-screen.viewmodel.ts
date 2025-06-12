import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectScanLoading, selectAllPeers, scanPeers } from '../../core/connection/store/peers.slice';
import { selectIsScanPeersGranted } from '../../core/permission/store/permission.slice';

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
};

export const useBluetoothScreenViewModel = () => {
  const dispatch = useAppDispatch();
  const isScanning = useAppSelector(selectScanLoading);
  const peers = useAppSelector(selectAllPeers);
  const isScanPeersGranted = useAppSelector(selectIsScanPeersGranted);

  console.log('isScanPeersGranted', isScanPeersGranted);

  const peersVM: PeerViewModel[] = peers.map((peer) => ({
    id: peer.id,
    name: peer.name,
    macAddress: 'AA:BB:CC:DD:EE:04',
    signalStrength: 85,
    batteryLevel: 90,
    firmware: '1.0.0',
    distance: '10m',
    lastSeen: 'Il y a 10s',
    isSecured: false,
    deviceType: 'lora_transceiver',
  }));

  console.log(peersVM);

  return {
    isScanning,
    peers: peersVM,
    startScan: () => {
      console.log('startScan');
      return dispatch(scanPeers({ timeout: 10000 }));
    },
    isScanPeersGranted,
  };
};
