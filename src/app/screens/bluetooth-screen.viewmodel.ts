import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectScanLoading, selectAllPeers, scanPeers } from '../../core/connection/store/peers.slice';
import { PermissionStatus, selectMissingPermissionForFeature } from '../../core/permission/store/permission.slice';
import { requestPermission } from '../../core/permission/store/request-permission';

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

export type PermissionViewModel = {
  permissionId: string;
  permissionStatus: PermissionStatus;
  request: () => void;
}

export const useBluetoothScreenViewModel = () => {
  const dispatch = useAppDispatch();
  const isScanning = useAppSelector(selectScanLoading);
  const peers = useAppSelector(selectAllPeers);
  const missingPermission = useAppSelector((state)=>selectMissingPermissionForFeature(state, 'scan-peers'));
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

  return {
    isScanning,
    peers: peersVM,
    startScan: () => {
      console.log('startScan');
      return dispatch(scanPeers({ timeout: 30000 }));
    },
    missingPermission: missingPermission.map((p)=>({
      permissionId: p.id,
      permissionStatus: p.status,
      request: () => dispatch(requestPermission({permissionId: p.id})),
    })),
  };
};
