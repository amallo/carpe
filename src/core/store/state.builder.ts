// Construct the state with an initial state
// following builder pattern
import { PeerEntity } from '../connection/store/peers.model';
import { peerAdapter } from '../connection/store/peers.model';
import { RootState } from '../../app/store/create-store';
import { RequestedPermissionStatus } from '../permission/providers/permission.provider';


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
    withPermission(permission: RequestedPermissionStatus) {
        this._state.permission = {
            ...this._state.permission,
            ...permission,
        };
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
    peer: {...peerAdapter.getInitialState(), scanLoading: false},
    permission: {
        'scan-peers': 'not-requested',
    },
}) => {
    return new StateBuilder(initialState);
};
