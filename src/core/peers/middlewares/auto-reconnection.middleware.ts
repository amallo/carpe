import { scanHit } from '../store/peers.slice';
import { selectPairedPeerById } from '../store/paired-peer.slice';
import { pairPeer } from '../usecases/pair-peer.usecase';
import { startAppListening } from '../../../app/store/middlewares/listener.middleware';

export const listeningAutoReconnection = (dependencies: { logger: any }) => {
  startAppListening({
    actionCreator: scanHit,
    effect: (action, { dispatch, getState }) => {
      const state = getState();
      const scannedPeerId = action.payload.id;
      const pairedPeer = selectPairedPeerById(state, scannedPeerId);

      // If it's a disconnected paired peer, attempt reconnection
      if (pairedPeer && pairedPeer.status === 'disconnected') {
        dependencies.logger.info('auto-reconnection', `Auto-reconnecting to paired peer: ${scannedPeerId}`);
        dispatch(pairPeer({ peerId: scannedPeerId }));
      }
    },
  });
};
