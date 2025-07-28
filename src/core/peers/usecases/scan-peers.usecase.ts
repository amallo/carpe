import { createAsyncThunk } from '@reduxjs/toolkit';
import { Dependencies } from '../../dependencies';
import { setMultiplePermissionForFeature } from '../../permission/store/permission.slice';
import { scanHit, setPeerScanning, PeerEntity } from '../store/peers.slice';
import { PeerFound } from '../providers/peer.provider';
import { checkPermission } from '../../permission/services/check-permission.service';

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
        async ({ timeout: _timeout }, { dispatch, extra }) => {
        extra.logger.info('SCAN', 'Début du scan de peers');
        /**
         * Check permissions for scanning peers
         */
        const permissionCheck = await checkPermission('scan-peers', extra);

        dispatch(setMultiplePermissionForFeature({
            permission: permissionCheck.permissions,
            feature: 'scan-peers',
        }));

        if (!permissionCheck.hasPermission) {
            console.error('permission not granted');
            return;
        }

        const { peerProvider } = extra;

        /**
         * Register callbacks to the peer provider
         */
        peerProvider.onPeerFound((peer) => {
            const peerEntity = mapPeerFoundToPeerEntity(peer);
            dispatch(scanHit(peerEntity));
        });

        peerProvider.onScanStopped(() => {
            dispatch(setPeerScanning(false));
        });

        peerProvider.onScanStarted(() => {
            dispatch(setPeerScanning(true));
        });

        /**
         * Start scanning
         */
        await peerProvider.scan();
    }
);
