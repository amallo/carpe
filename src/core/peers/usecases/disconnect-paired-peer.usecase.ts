import { createAsyncThunk } from '@reduxjs/toolkit';
import { Dependencies } from '../../dependencies';

/**
 * Disconnect a paired peer (update status to disconnected)
 */
export const disconnectPairedPeer = createAsyncThunk<
  void,
  { peerId: string },
  { extra: Dependencies }
>(
  'pairedPeer/disconnect',
  async ({ peerId }, { extra }) => {
    extra.logger?.info('DISCONNECT', `Disconnecting paired peer peerId=${peerId}`);
    await extra.peerProvider.disconnect(peerId);
  }
);
