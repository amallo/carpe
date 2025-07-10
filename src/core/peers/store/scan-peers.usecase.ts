import { createAsyncThunk } from '@reduxjs/toolkit';
import { Dependencies } from '../../dependencies';
import { PermissionEntity, setMultiplePermissionForFeature } from '../../permission/store/permission.slice';
import { scanHit, setScanLoading, PeerEntity } from './peers.slice';
import { PeerFound } from '../providers/peer.provider';

// Mapping function to convert PeerFound to PeerEntity
const mapPeerFoundToPeerEntity = (peerFound: PeerFound): PeerEntity => {
    return {
        id: peerFound.id,
        name: peerFound.name,
        // Propriétés BLE standard
        rssi: peerFound.rssi,
        advertising: peerFound.advertising,
        manufacturerData: peerFound.manufacturerData,
        serviceUUIDs: peerFound.serviceUUIDs,
        txPowerLevel: peerFound.txPowerLevel,
        isConnectable: peerFound.isConnectable,
        localName: peerFound.localName,
        txPower: peerFound.txPower,
        overflowServiceUUIDs: peerFound.overflowServiceUUIDs,
        solicitedServiceUUIDs: peerFound.solicitedServiceUUIDs,
        serviceData: peerFound.serviceData,
        // Propriétés spécifiques LoRa
        deviceType: peerFound.deviceType,
        firmware: peerFound.firmware,
        batteryLevel: peerFound.batteryLevel,
        isSecured: peerFound.isSecured,
        lastSeen: peerFound.lastSeen ? peerFound.lastSeen.toISOString() : undefined,
        // Propriétés calculées
        distance: peerFound.distance,
        signalStrength: peerFound.signalStrength,
    };
};

// Async thunk for scanning peers
export const scanPeers = createAsyncThunk<
    void,
    { timeout?: number },
    { extra: Dependencies }
>(
    'peer/scan',
    async ({ timeout: _timeout }, { dispatch, extra: { peerProvider, permissionProvider } }) => {
        /**
         * Request permission to scan for peers
         */
        const permissionResult = await permissionProvider.requestFeaturedPermission('scan-peers');
        const permission: PermissionEntity[] = Object.keys(permissionResult).reduce((acc, p) => {
            return [...acc, { id: p, status: permissionResult[p] }];
        }, [] as PermissionEntity[]);
        
        dispatch(setMultiplePermissionForFeature({ permission, feature: 'scan-peers' }));

        if (permission.some((p) => p.status !== 'granted')) {
            console.log('permission not granted');
            return;
        }

        /**
         * Register callbacks to the peer provider
         */
        peerProvider.onPeerFound((peer) => {
            console.log('peerFound', peer);
            const peerEntity = mapPeerFoundToPeerEntity(peer);
            dispatch(scanHit(peerEntity));
        });

        peerProvider.onScanStopped(() => {
            console.log('scanStopped');
            dispatch(setScanLoading(false));
        });

        peerProvider.onScanStarted(() => {
            console.log('scanStarted');
            dispatch(setScanLoading(true));
        });

        /**
         * Start scanning
         */
        await peerProvider.scan();
    }
); 