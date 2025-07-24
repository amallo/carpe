import { createSlice, createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { connectToPeer } from '../usecases/pairing.usecase';

export type PairingStatus = 'pending' | 'connected' | 'disconnected'

type PairingState = EntityState<PairingEntity, string> & {
    error: string | null;
}

export type PairingEntity = {
    id: string;
    status: PairingStatus;
}

export const pairingAdapter = createEntityAdapter<PairingEntity>();

export const getPairingInitialState = (): PairingState => ({
    ...pairingAdapter.getInitialState(),
    error: null,
});



const pairingSlice = createSlice({
    name: 'pairing',
    initialState: getPairingInitialState(),
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(connectToPeer.pending, (state, action) => {
            state.error = null;
            pairingAdapter.addOne(state, {
                id: action.meta.arg.peerId,
                status: 'pending',
            });
        });
        builder.addCase(connectToPeer.fulfilled, (state, action) => {
            pairingAdapter.updateOne(state, {
                id: action.meta.arg.peerId,
                changes: {
                    status: 'connected'
                }
            });
        });
        builder.addCase(connectToPeer.rejected, (state, action) => {
            state.error = action.error.message || 'Connection failed';
            pairingAdapter.removeOne(state, action.meta.arg.peerId);
        });
    },
});

export const selectActivePairing = (state: { pairing: PairingState })=>pairingAdapter.getSelectors().selectAll(state.pairing);

export const selectPairingError = (state: { pairing: PairingState })=>state.pairing.error;

export default pairingSlice.reducer;
