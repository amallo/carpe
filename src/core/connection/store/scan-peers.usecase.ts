import { createAsyncThunk } from '@reduxjs/toolkit';
import { Dependencies } from '../../dependencies';
import { PermissionEntity, setMultiplePermissionForFeature } from '../../permission/store/permission.slice';
import { scanHit, setScanLoading } from './peers.slice';

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
            dispatch(scanHit({ id: peer.id, name: peer.name }));
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