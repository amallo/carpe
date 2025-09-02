import { Dispatch, Store, UnknownAction } from '@reduxjs/toolkit';
import { Dependencies } from '../../dependencies';
import { scanHit } from '../store/peers.slice';
import { scanRequested } from '../../connectivity/store/connectivity.slice';
import { selectPairedPeerById } from '../store/paired-peer.slice';
import { pairPeer } from '../usecases/pair-peer.usecase';
import { scanPeers } from '../usecases/scan-peers.usecase';
import type { RootState } from '../../../app/store/store';

export const createAutoReconnectionMiddleware = (dependencies: Dependencies) => {
  return (store: any) => (next: any) => (action: any) => {
    const result = next(action);

    // Auto-reconnection on scan hit
    if (scanHit.match(action)) {
      const state: RootState = store.getState();
      const scannedPeerId = action.payload.id;
      const pairedPeer = selectPairedPeerById(state, scannedPeerId);

      // If it's a disconnected paired peer, attempt reconnection
      if (pairedPeer && pairedPeer.status === 'disconnected') {
        dependencies.logger.info('auto-reconnection', `Auto-reconnecting to paired peer: ${scannedPeerId}`);
        store.dispatch(pairPeer({ peerId: scannedPeerId }));
      }
    }

    // Auto-scan on connectivity scan request
    if (scanRequested.match(action)) {
      dependencies.logger.info('auto-reconnection', 'Connectivity scan requested: starting scan for paired peers');
      store.dispatch(scanPeers({ timeout: 30000 })); // Empty object as scanPeers expects { timeout?: number }
    }

    return result;
  };
};
