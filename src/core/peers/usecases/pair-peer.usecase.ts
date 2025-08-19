import { createAsyncThunk } from '@reduxjs/toolkit';
import { Dependencies } from '../../dependencies';
import { checkPermissionService } from '../../permission/services/check-permission.service';
import { AppDispatch } from '../../../app/store/store';

export const pairPeer = createAsyncThunk<
    void,
    { peerId: string },
    { extra: Dependencies, dispatch: AppDispatch }
>(
    'peer/connect',
    async ({ peerId }, { dispatch, extra }) => {
        extra.logger?.info('PAIR', `Tentative de pair avec peerId=${peerId}`);
        /**
         * Check permissions for connecting to peers
         */
        await checkPermissionService('connect-peers', extra, dispatch);

        const { peerProvider } = extra;
        await peerProvider.pairing(peerId);
    }
); 