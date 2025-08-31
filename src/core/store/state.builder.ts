// Construct the state with an initial state
// following builder pattern
import { getPeerInitialState, PeerEntity } from '../peers/store/peers.slice';
import { peerAdapter } from '../peers/store/peers.slice';
import { Feature, permissionAdapter, PermissionEntity } from '../permission/store/permission.slice';
import { RootState } from '../../app/store/store';
import { getPermissionInitialState } from '../permission/store/permission.slice';
import { getPairedPeerInitialState, pairedPeerAdapter } from '../peers/store/paired-peer.slice';
import { initialState as logInitialState } from '../logger/store/log.slice';
import { getConnectivityInitialState } from '../connectivity/store/connectivity.slice';
import { getAppInitialState } from '../app/store/app.slice';
import { Identity } from '../identity/entities/identity.entity';


export class StateBuilder {
    private _state: RootState;

    constructor(initialState: RootState) {
        this._state = initialState;
    }

    // should return a new state
    withAvailablePeerPeer(peer: PeerEntity) {
        this._state.peer = {...this._state.peer, ...peerAdapter.addOne(this._state.peer, peer)};
        return this;
    }
    withPermissionByFeature(feature: Feature, permission: PermissionEntity) {
        this._state.permission = {...this._state.permission, ...permissionAdapter.addOne(this._state.permission, permission)};
        this._state.permission[feature] = [
            ...this._state.permission[feature],
            permission.id,
        ];
        return this;
    }
    withScanningPeer(isScanning: boolean) {
        this._state.peer.scanLoading = isScanning;
        return this;
    }
    withPairingError(error: string | null) {
        this._state.pairedPeer.error = error;
        return this;
    }
    withConnectedPeer(peerId: string){
        this._state.pairedPeer = pairedPeerAdapter.addOne(this._state.pairedPeer, {
            id: peerId,
            status: 'connected',
        });
        return this;
    }
    withExistingPairedPeer(peerId: string, status: 'pending' | 'connected' | 'disconnected' = 'disconnected'){
        this._state.pairedPeer = pairedPeerAdapter.addOne(this._state.pairedPeer, {
            id: peerId,
            status: status,
        });
        return this;
    }
    withCurrentIdentity(identity: Identity) {
        this._state.identity = {
            ...this._state.identity,
            current: identity,
        };
        return this;
    }

    build() {
        return this._state;
    }
}

export const createStateBuilder = (initialState: RootState = {
    peer: getPeerInitialState(),
    permission: getPermissionInitialState(),
    pairedPeer: getPairedPeerInitialState(),
    log: logInitialState,
    connectivity: getConnectivityInitialState(),
    app: getAppInitialState(),
    identity: {
        current: null,
        isLoading: false,
        error: null,
    },
}) => {
    return new StateBuilder(initialState);
};
