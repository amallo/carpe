import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { EntityState, createEntityAdapter, getInitialEntityState } from '../../store/entity.state';
import { Dependencies } from '../../dependencies';
import { setPermission } from '../../permission/store/permission.slice';

type PeerState = EntityState<PeerEntity> & { scanLoading: boolean }

export type PeerEntity = {
    id: string;
    name: string;
}

export const peerAdapter = createEntityAdapter<PeerEntity>();

const getInitialState = (): PeerState => ({
    ...getInitialEntityState<PeerEntity>(),
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
        const permission = await permissionProvider.requestPermission(['scan-peers']);
        console.log('permission', permission);
        dispatch(setPermission(permission));

        if (permission['scan-peers'] !== 'granted') {
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
            dispatch(setScanLoading(false));
        });

        peerProvider.onScanStarted(() => {
            dispatch(setScanLoading(true));
        });

        /**
         * Start scanning for peers
         */
        setTimeout(() => {
            peerProvider.stopScan();
        }, timeout);

        return peerProvider.scan();
    }
);

const peerSlice = createSlice({
    name: 'peer',
    initialState: getInitialState(),
    reducers: {
        scanHit: (state, action: PayloadAction<PeerEntity>) => {
            const entities = peerAdapter.addOne(state, {
                id: action.payload.id,
                name: action.payload.name,
            });
            return { ...state, ...entities };
        },
        setScanLoading: (state, action: PayloadAction<boolean>) => {
            state.scanLoading = action.payload;
        },
    },
});

export const { scanHit, setScanLoading } = peerSlice.actions;

// Selectors
export const selectScanLoading = (state: { peer: PeerState }) => state.peer.scanLoading;
export const selectAllPeers = (state: { peer: PeerState }) =>
    state.peer.ids.map((id) => state.peer.byId[id]);

export default peerSlice.reducer;
