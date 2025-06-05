import { createModel } from '@rematch/core';
import { RootModel } from '../../../store/create-store';
import { EntityState, createEntityAdapter, getInitialEntityState } from '../../store/entity.state';

type PeerState = EntityState<PeerEntity>

type PeerEntity = {
    id: string;
    name: string;
}



// Créer l'adapter pour les entités Peer
const peerAdapter = createEntityAdapter<PeerEntity>();

export const createPeerModel = ()=>{
    const model = createModel<RootModel>()({
        state: getInitialEntityState<PeerEntity>() as PeerState,
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
              this.add({id: 'dev0', name: 'carpe-001'});
              return Promise.resolve();
            },
        }),
    });
    return model;
};
