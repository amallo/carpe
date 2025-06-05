import { createModel } from '@rematch/core';
import { RootModel } from '../../../store/create-store';
import { EntityState, createEntityAdapter, getInitialEntityState } from '../../store/entity.state';
import { Dependencies } from '../../dependencies';

type PeerState = EntityState<PeerEntity>

export type PeerEntity = {
    id: string;
    name: string;
}



// Créer l'adapter pour les entités Peer
export const peerAdapter = createEntityAdapter<PeerEntity>();

export const createPeerModel = ({ peerProvider}: Dependencies, initialState: PeerState = getInitialEntityState<PeerEntity>() as PeerState)=>{
    const model = createModel<RootModel>()({
        state: initialState,
        reducers: {
            add: (state, payload: PeerEntity) => {
              return peerAdapter.addOne(state, {
                  id: payload.id,
                  name: payload.name,
              });
            },
          },
        effects: () => ({
            async scan() {
              peerProvider.onPeerScanned((peer)=>{
                this.add({id: peer.id, name: 'carpe-001'});
              });
              return peerProvider.scan();
            },
        }),
    });
    return model;
};
