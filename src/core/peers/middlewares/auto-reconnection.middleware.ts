import { scanHit } from '../store/peers.slice';
import { selectPairedPeerById } from '../store/paired-peer.slice';
import { startAppListening } from '../../../app/store/middlewares/listener.middleware';
import { ReconnectionContext } from '../strategies/reconnection.strategy';
import { hasBeenDisconnected } from '../store/paired-peer.slice';
import { pairPeer } from '../usecases/pair-peer.usecase';
import { Dependencies } from '../../dependencies';

export const listeningAutoReconnection = (dependencies: Dependencies) => {
  // Listen for scan hits to evaluate reconnection strategy
  startAppListening({
    actionCreator: scanHit,
    effect: async (action, { dispatch, getState }) => {
      const state = getState();
      const scannedPeerId = action.payload.id;
      const pairedPeer = selectPairedPeerById(state, scannedPeerId);

      if (pairedPeer) {
        // Create reconnection context
        const context: ReconnectionContext = {
          connectionAttempts: 0, // Could be tracked in state
          timeSinceLastConnection: 0, // Could be calculated from last connection time
        };

        // Get reconnection strategy from dependencies
        const strategy = dependencies.reconnectionStrategy;

        // Check if reconnection should be attempted
        if (strategy.shouldReconnect(pairedPeer, context)) {
          // Dispatch hasBeenDisconnected event
          dispatch(hasBeenDisconnected(scannedPeerId));
        }
      }
    },
  });

  // Listen for hasBeenDisconnected to actually perform the reconnection
  startAppListening({
    actionCreator: hasBeenDisconnected,
    effect: async (action, { dispatch }) => {
      const peerId = action.payload;
      dependencies.logger.info('auto-reconnection', `Attempting reconnection to peer: ${peerId}`);
      // Perform the actual reconnection
      await dispatch(pairPeer({ peerId }));
    },
  });
};
