import { createSlice, PayloadAction, createSelector, createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { scanPeers } from '../usecases/scan-peers.usecase';
import { unpairPeer } from '../usecases/unpair-peer.usecase';


type PeerState = EntityState<PeerEntity, string> & { 
    scanLoading: boolean;
    error: string | null;
}

export type PeerEntity = {
    id: string;
    name: string;
    // Propriétés BLE standard
    rssi?: number;                    // Signal strength indicator
    advertising?: any;                 // Advertising data
    manufacturerData?: string;         // Manufacturer specific data
    serviceUUIDs?: string[];          // Array of service UUIDs
    txPowerLevel?: number;            // Transmission power level
    isConnectable?: boolean;          // Whether the device is connectable
    localName?: string;               // Local name of the device
    txPower?: number;                 // Transmission power
    overflowServiceUUIDs?: string[];  // Overflow service UUIDs
    solicitedServiceUUIDs?: string[]; // Solicited service UUIDs
    serviceData?: Record<string, string>; // Service data
    // Propriétés spécifiques LoRa
    deviceType?: 'lora_transceiver' | 'lora_gateway' | 'lora_node';
    firmware?: string;                // Firmware version
    batteryLevel?: number;            // Battery level (0-100)
    isSecured?: boolean;              // Whether the device requires PIN
    lastSeen?: string;                // Last time the device was seen (ISO string)
    // Propriétés calculées
    distance?: number;                // Calculated distance in meters
    signalStrength?: number;          // Calculated signal strength (0-100)
}

export const peerAdapter = createEntityAdapter<PeerEntity>();

export const getPeerInitialState = (): PeerState => ({
    ...peerAdapter.getInitialState(),
    scanLoading: false,
    error: null
});



const peerSlice = createSlice({
    name: 'peer',
    initialState: getPeerInitialState(),
    reducers: {
        scanHit: (state, action: PayloadAction<PeerEntity>) => {
            const newState = peerAdapter.addOne(state, action.payload);
            return newState;
        },
        setPeerScanning: (state, action: PayloadAction<boolean>) => {
            state.scanLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
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
        builder.addCase(unpairPeer.fulfilled, (state, action) => {
            // Supprime uniquement le peer correspondant à l'id fourni
            const peerId = action.meta.arg;
            if (state.ids.includes(peerId)) {
                state.ids = state.ids.filter(id => id !== peerId);
                delete state.entities[peerId];
            }
        });
    },
});

export const { scanHit, setPeerScanning, setError } = peerSlice.actions;

// Base selectors
const selectPeerState = (state: { peer: PeerState }) => state.peer;
const selectPeerIds = createSelector([selectPeerState], (peerState) => peerState.ids);
export const selectPeerById = createSelector([selectPeerState], (peerState) => peerState.entities);

// Memoized selectors
export const selectScanLoading = createSelector([selectPeerState], (peerState) => peerState.scanLoading);
export const selectPeerScanningError = createSelector([selectPeerState], (peerState) => peerState.error);
export const selectAllPeers = createSelector(
    [selectPeerIds, selectPeerById],
    (ids, byId) => ids.map((id) => byId[id])
);


export default peerSlice.reducer;
