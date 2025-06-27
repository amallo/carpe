import { createSlice, createAsyncThunk, PayloadAction, createSelector, createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { Dependencies } from '../../dependencies';
import { PermissionEntity, setMultiplePermissionForFeature } from '../../permission/store/permission.slice';

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

// Async thunk for scanning peers
export const scanPeers = createAsyncThunk<
    void,
    { timeout?: number },
    { extra: Dependencies }
>(
    'peer/scan',
    async ({ timeout }, { dispatch, extra: { peerProvider, permissionProvider } }) => {
        /**
         * Request permission to scan for peers
         */
        const permissionResult = await permissionProvider.requestFeaturedPermission('scan-peers');
        const permission : PermissionEntity[] = Object.keys(permissionResult).reduce((acc, p) => {
            return [...acc, {id: p, status: permissionResult[p]}];
        }, [] as PermissionEntity[]);
        dispatch(setMultiplePermissionForFeature( {permission, feature: 'scan-peers'}));

       if (permission.some((p)=>p.status !== 'granted')) {
        console.log('permission not granted');
        return;
       }

        /**
         * Register callbacks to the peer provider
         */
        peerProvider.onPeerFound((peer) => {
            console.log('peerFound', peer);
            dispatch(scanHit({ id: peer.id, name: peer.name }));
        });

        peerProvider.onScanStopped(() => {
            console.log('scanStopped');
            dispatch(setScanLoading(false));
        });

        peerProvider.onScanStarted(() => {
            console.log('scanStarted');
            dispatch(setScanLoading(true));
        });


        return peerProvider.scan();
    }
);

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
