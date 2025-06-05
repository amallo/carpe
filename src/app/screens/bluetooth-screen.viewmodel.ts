import { useStore } from '../store/store.context';

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
  const store = useStore();
  const isScanning = store.select.peer.selectScanLoading(store.getState());
  const peers = store.select.peer.selectAll(store.getState());
  const isScanPeersGranted = store.select.permission.selectIsScanPeersGranted(store.getState());
  console.log("isScanPeersGranted", isScanPeersGranted);
  const peersVM : PeerViewModel[] = peers.map((peer)=>({
    id: peer.id,
    name: peer.name,
    macAddress: 'AA:BB:CC:DD:EE:04',
    signalStrength:  85,
    batteryLevel:  90,
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
      console.log("startScan");
      return store.dispatch.peer.scan({timeout: 10000});
    },
    isScanPeersGranted,
  };
};
