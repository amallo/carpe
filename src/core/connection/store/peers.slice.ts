import { createSlice, PayloadAction, createSelector, createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { scanPeers } from './scan-peers.usecase';

type PeerState = EntityState<PeerEntity, string> & { scanLoading: boolean }

export type PeerEntity = {
    id: string;
    name: string;
}

export const peerAdapter = createEntityAdapter<PeerEntity>();

export const getPeerInitialState = (): PeerState => ({
    ...peerAdapter.getInitialState(),
    scanLoading: false,
});



const peerSlice = createSlice({
    name: 'peer',
    initialState: getPeerInitialState(),
    reducers: {
        scanHit: (state, action: PayloadAction<PeerEntity>) => {
            const newState = peerAdapter.addOne(state, {
                id: action.payload.id,
                name: action.payload.name,
            });
            return newState;
        },
        setScanLoading: (state, action: PayloadAction<boolean>) => {
            state.scanLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(scanPeers.pending, (state) => {
            state.scanLoading = true;
        });
        builder.addCase(scanPeers.fulfilled, (state) => {
            state.scanLoading = false;
        });
        builder.addCase(scanPeers.rejected, (state) => {
            state.scanLoading = false;
        });
    },
});

export const { scanHit, setScanLoading } = peerSlice.actions;

// Base selectors
const selectPeerState = (state: { peer: PeerState }) => state.peer;
const selectPeerIds = createSelector([selectPeerState], (peerState) => peerState.ids);
const selectPeerById = createSelector([selectPeerState], (peerState) => peerState.entities);

// Memoized selectors
export const selectScanLoading = createSelector([selectPeerState], (peerState) => peerState.scanLoading);
export const selectAllPeers = createSelector(
    [selectPeerIds, selectPeerById],
    (ids, byId) => ids.map((id) => byId[id])
);

export default peerSlice.reducer;
