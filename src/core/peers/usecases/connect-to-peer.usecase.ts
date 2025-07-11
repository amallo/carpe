import { createAsyncThunk } from '@reduxjs/toolkit';
import { Dependencies } from '../../dependencies';
import { setMultiplePermissionForFeature } from '../../permission/store/permission.slice';
import { checkPermission } from '../../permission/services/check-permission.service';
import { PeerError } from '../providers/peer.provider';

export const connectToPeer = createAsyncThunk<
    void,
    { peerId: string },
    { extra: Dependencies }
>(
    'peer/connect',
    async ({ peerId }, { dispatch, extra }) => {
        /**
         * Check permissions for connecting to peers
         */
        const permissionCheck = await checkPermission('connect-peers', extra);

        dispatch(setMultiplePermissionForFeature({
            permission: permissionCheck.permissions,
            feature: 'connect-peers',
        }));

        if (!permissionCheck.hasPermission) {
            throw new Error(PeerError.PERMISSION_DENIED);
        }

        const { peerProvider } = extra;
        await peerProvider.connectToPeer(peerId);
    }
); 