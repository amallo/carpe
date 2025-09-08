// Construct the state with an initial state
// following builder pattern
import { getPeerInitialState, PeerEntity } from '../peers/store/peers.slice';
import { peerAdapter } from '../peers/store/peers.slice';
import { Feature, permissionAdapter, PermissionEntity } from '../permission/store/permission.slice';
import { RootState } from '../../app/store/store';
import { getPermissionInitialState } from '../permission/store/permission.slice';
import { getPairedPeerInitialState, pairedPeerAdapter } from '../peers/store/paired-peer.slice';
import { initialState as logInitialState } from '../logger/store/log.slice';
import { getAppInitialState } from '../app/store/app.slice';
import { Identity } from '../identity/entities/identity.entity';
import { getMessageInitialState, messageAdapter, MessageEntity } from '../message/store/message.slice';
import { getIdentityInitialState } from '../identity/store/identity.slice';


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
            connectionAttempts: 1,
            lastConnectionTime: new Date().toISOString(),
        });
        return this;
    }
    withExistingPairedPeer(peer: { id: string; status: 'pending' | 'connected' | 'disconnected'; connectionAttempts: number; lastConnectionTime?: string }){
        this._state.pairedPeer = pairedPeerAdapter.addOne(this._state.pairedPeer, {
            id: peer.id,
            status: peer.status,
            connectionAttempts: peer.connectionAttempts,
            lastConnectionTime: peer.lastConnectionTime || new Date().toISOString(),
        });
        return this;
    }
    withBroadcastedMessage(message: MessageEntity) {
        this._state.message = {
            ...this._state.message, 
            ...messageAdapter.addOne(this._state.message, message),
            broadcasted: [...this._state.message.broadcasted, message.id]
        };
        return this;
    }
    withNoSubmittedMessages() {
        this._state.message = {...this._state.message,  submitted: [], submittedById: {}};
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
    app: getAppInitialState(),
    message: getMessageInitialState(),
    identity: getIdentityInitialState(),
}) => {
    return new StateBuilder(initialState);
};
