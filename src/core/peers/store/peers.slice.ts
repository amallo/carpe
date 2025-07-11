import { createSlice, PayloadAction, createSelector, createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { scanPeers } from '../usecases/scan-peers.usecase';
import { connectToPeer } from '../usecases/connect-to-peer.usecase';

type PeerState = EntityState<PeerEntity, string> & { 
    scanLoading: boolean;
    error: string | null;
    connectionIds: Array<string>
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
    error: null,
    connectionIds: []
});



const peerSlice = createSlice({
    name: 'peer',
    initialState: getPeerInitialState(),
    reducers: {
        scanHit: (state, action: PayloadAction<PeerEntity>) => {
            const newState = peerAdapter.addOne(state, action.payload);
            return newState;
        },
        setScanLoading: (state, action: PayloadAction<boolean>) => {
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
        builder.addCase(connectToPeer.pending, (state) => {
            state.error = null;
        });
        builder.addCase(connectToPeer.fulfilled, (state, action) => {
            state.error = null;
            state.connectionIds.push(action.meta.arg.peerId);
        });
        builder.addCase(connectToPeer.rejected, (state, action) => {
            state.error = action.error.message || 'Connection failed';
        });
    },
});

export const { scanHit, setScanLoading, setError } = peerSlice.actions;

// Base selectors
const selectPeerState = (state: { peer: PeerState }) => state.peer;
const selectPeerIds = createSelector([selectPeerState], (peerState) => peerState.ids);
const selectPeerById = createSelector([selectPeerState], (peerState) => peerState.entities);

// Memoized selectors
export const selectScanLoading = createSelector([selectPeerState], (peerState) => peerState.scanLoading);
export const selectError = createSelector([selectPeerState], (peerState) => peerState.error);
export const selectAllPeers = createSelector(
    [selectPeerIds, selectPeerById],
    (ids, byId) => ids.map((id) => byId[id])
);
export const selectPeerByIdSelector = createSelector(
    [selectPeerState, (_, peerId: string) => peerId],
    (peerState, peerId) => peerState.entities[peerId]
);

// Selectors spécialisés pour les settings
export const selectConnectedDevices = createSelector(
  [selectAllPeers, (state: { peer: PeerState }) => state.peer.connectionIds],
  (peers, connectionIds) =>
    peers.filter((peer) => connectionIds.includes(peer.id))
);

export const selectFirstConnectedDevice = createSelector(
    [selectConnectedDevices],
    (connectedDevices) => connectedDevices[0] || null
);

export const selectDevicesByType = createSelector(
    [selectAllPeers, (_, deviceType: string) => deviceType],
    (peers, deviceType) => peers.filter(peer => peer.deviceType === deviceType)
);

export default peerSlice.reducer;
