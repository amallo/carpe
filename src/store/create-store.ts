import { init, Models, RematchDispatch, RematchRootState } from '@rematch/core';
import { createPeerModel } from '../core/connection/store/peers.model';
import { Dependencies } from '../core/dependencies';

export interface RootModel extends Models<RootModel> {
    peer: ReturnType<typeof createPeerModel>;
}

export const createStore = (dependencies: Dependencies)=>{
    const peerModel = createPeerModel(dependencies);
    const models: RootModel = {  peer: peerModel };

    const store = init({
        models,
    });
    return store;
};

export type Store = ReturnType<typeof createStore>
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel>
