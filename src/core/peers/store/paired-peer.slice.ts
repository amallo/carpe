import { createSlice, createEntityAdapter, EntityState, PayloadAction } from '@reduxjs/toolkit';
import { pairPeer } from '../usecases/pair-peer.usecase';
import { disconnectPairedPeer } from '../usecases/disconnect-paired-peer.usecase';

export type PairedPeerStatus = 'pending' | 'connected' | 'disconnected'

type PairedPeerState = EntityState<PairedPeerEntity, string> & {
    error: string | null;
}

export type PairedPeerEntity = {
    id: string;
    status: PairedPeerStatus;
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
        peerWasConnected: (state, action: PayloadAction<string>) => {
            state.entities[action.payload].status = 'connected';
        },
    },
    extraReducers: (builder) => {
        builder.addCase(pairPeer.pending, (state, action) => {
            state.error = null;
            pairedPeerAdapter.addOne(state, {
                id: action.meta.arg.peerId,
                status: 'pending',
            });
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
            // This allows paired peers to persist even when connection fails
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