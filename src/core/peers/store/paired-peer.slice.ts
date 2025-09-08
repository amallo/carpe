import { createSlice, createEntityAdapter, EntityState, PayloadAction, createAction } from '@reduxjs/toolkit';
import { pairPeer } from '../usecases/pair-peer.usecase';
import { disconnectPairedPeer } from '../usecases/disconnect-paired-peer.usecase';

/**
 * Event when a peer has been disconnected and needs reconnection
 */
export const hasBeenDisconnected = createAction<string>('peers/hasBeenDisconnected');

export type PairedPeerStatus = 'pending' | 'connected' | 'disconnected'

type PairedPeerState = EntityState<PairedPeerEntity, string> & {
    error: string | null;
}

export type PairedPeerEntity = {
    id: string;
    status: PairedPeerStatus;
    connectionAttempts: number;
    lastConnectionTime?: string; // ISO string of last connection attempt
}

export const pairedPeerAdapter = createEntityAdapter<PairedPeerEntity>();

export const getPairedPeerInitialState = (): PairedPeerState => ({
    ...pairedPeerAdapter.getInitialState(),
    error: null,
});



const pairedPeerSlice = createSlice({
    name: 'pairedPeer',
    initialState: getPairedPeerInitialState(),
    reducers: {
        peerWasConnected: (state, action: PayloadAction<{ peerId: string; timestamp?: string }>) => {
            const peer = state.entities[action.payload.peerId];
            if (peer) {
                peer.status = 'connected';
                peer.lastConnectionTime = action.payload.timestamp || new Date().toISOString();
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(pairPeer.pending, (state, action) => {
            state.error = null;
            const currentTime = (action.meta as any).timestamp || new Date().toISOString();
            const existingPeer = state.entities[action.meta.arg.peerId];
            if (existingPeer) {
                // Increment connection attempts for existing peer
                pairedPeerAdapter.updateOne(state, {
                    id: action.meta.arg.peerId,
                    changes: {
                        status: 'pending',
                        connectionAttempts: existingPeer.connectionAttempts + 1,
                        lastConnectionTime: currentTime,
                    },
                });
            } else {
                // Add new peer with initial connection attempt
                pairedPeerAdapter.addOne(state, {
                    id: action.meta.arg.peerId,
                    status: 'pending',
                    connectionAttempts: 1,
                    lastConnectionTime: currentTime,
                });
            }
        });
        /*builder.addCase(pairPeer.fulfilled, (state, action) => {
            pairedPeerAdapter.updateOne(state, {
                id: action.meta.arg.peerId,
                changes: {
                    status: 'connected',
                },
            });
        });*/
        builder.addCase(pairPeer.rejected, (state, action) => {
            state.error = action.error.message || 'Connection failed';
            // Keep the peer in the list but mark it as disconnected
            // Connection attempts are already incremented in pending state
            pairedPeerAdapter.updateOne(state, {
                id: action.meta.arg.peerId,
                changes: {
                    status: 'disconnected',
                },
            });
        });
        builder.addCase(disconnectPairedPeer.fulfilled, (state, action) => {
            state.error = null;
            // Update the paired peer status to disconnected
            pairedPeerAdapter.updateOne(state, {
                id: action.meta.arg.peerId,
                changes: {
                    status: 'disconnected',
                },
            });
        });
    },
});

export const selectActivePairedPeers = (state: { pairedPeer: PairedPeerState })=>pairedPeerAdapter.getSelectors().selectAll(state.pairedPeer);

export const selectPairedPeerError = (state: { pairedPeer: PairedPeerState })=>state.pairedPeer.error;

export const selectPairedPeerById = (state: { pairedPeer: PairedPeerState }, id: string) =>
    pairedPeerAdapter.getSelectors().selectById(state.pairedPeer, id);

export const selectConnectedPairedPeers = (state: { pairedPeer: PairedPeerState }) =>
    pairedPeerAdapter.getSelectors().selectAll(state.pairedPeer).filter(peer => peer.status === 'connected');

export const selectDisconnectedPairedPeers = (state: { pairedPeer: PairedPeerState }) =>
    pairedPeerAdapter.getSelectors().selectAll(state.pairedPeer).filter(peer => peer.status === 'disconnected');

export default pairedPeerSlice.reducer;

export const { peerWasConnected } = pairedPeerSlice.actions;
