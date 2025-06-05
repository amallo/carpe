// Construct the state with an initial state
// following builder pattern
import { PeerEntity } from '../connection/store/peers.model';
import { peerAdapter } from '../connection/store/peers.model';
import { RootState } from '../../store/create-store';


export class StateBuilder {
    private _state: RootState;

    constructor(initialState: RootState) {
        this._state = initialState;
    }

    // should return a new state
    withPeer(peer: PeerEntity) {
        this._state.peer = peerAdapter.addOne(this._state.peer, peer);
        return this;
    }

    build() {
        return this._state;
    }
}

export const createStateBuilder = (initialState: RootState = {
    peer: peerAdapter.getInitialState(),
}) => {
    return new StateBuilder(initialState);
};
