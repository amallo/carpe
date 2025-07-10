// Construct the state with an initial state
// following builder pattern
import { getPeerInitialState, PeerEntity } from '../peers/store/peers.slice';
import { peerAdapter } from '../peers/store/peers.slice';
import { Feature, permissionAdapter, PermissionEntity } from '../permission/store/permission.slice';
import { RootState } from '../../app/store/store';
import { getPermissionInitialState } from '../permission/store/permission.slice';


export class StateBuilder {
    private _state: RootState;

    constructor(initialState: RootState) {
        this._state = initialState;
    }

    // should return a new state
    withPeer(peer: PeerEntity) {
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
    withScanLoading(loading: boolean) {
        this._state.peer.scanLoading = loading;
        return this;
    }

    build() {
        return this._state;
    }
}

export const createStateBuilder = (initialState: RootState = {
    peer: getPeerInitialState(),
    permission: getPermissionInitialState(),
}) => {
    return new StateBuilder(initialState);
};
