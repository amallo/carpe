import { MiddlewareAPI, Dispatch, AnyAction } from '@reduxjs/toolkit';
import { Dependencies } from '../../dependencies';
import { scanHit } from '../store/peers.slice';
import { scanRequested } from '../../connectivity/store/connectivity.slice';
import { selectPairedPeerById } from '../store/paired-peer.slice';
import { pairPeer } from '../usecases/pair-peer.usecase';
import { scanPeers } from '../usecases/scan-peers.usecase';

export const createAutoReconnectionMiddleware = (dependencies: Dependencies) => {
  return (store: MiddlewareAPI) => (next: Dispatch) => (action: AnyAction) => {
    const result = next(action);
    
    // Auto-reconnection on scan hit
    if (scanHit.match(action)) {
      const state = store.getState();
      const scannedPeerId = action.payload.id;
      const pairedPeer = selectPairedPeerById(state, scannedPeerId);
      
      // If it's a disconnected paired peer, attempt reconnection
      if (pairedPeer && pairedPeer.status === 'disconnected') {
        dependencies.logger.info(`Auto-reconnecting to paired peer: ${scannedPeerId}`);
        store.dispatch(pairPeer({ peerId: scannedPeerId }));
      }
    }
    
    // Auto-scan on connectivity scan request
    if (scanRequested.match(action)) {
      dependencies.logger.info(`Connectivity scan requested: starting scan for paired peers`);
      store.dispatch(scanPeers({})); // Empty object as scanPeers expects { timeout?: number }
    }
    
    return result;
  };
};
