import { createAsyncThunk } from '@reduxjs/toolkit';
import { Dependencies } from '../../dependencies';

/**
 * Unpair a peer by id (remove from store and provider)
 */
export const unpairPeer = createAsyncThunk<
  string, // retourne l'id du peer désappairé
  string,
  { extra: Dependencies }
>(
  'peer/unpair',
  async (peerId, { extra }) => {
    await extra.peerProvider.unpair(peerId);
    return peerId;
  }
); 