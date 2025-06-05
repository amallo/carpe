import { init, Models, RematchDispatch, RematchRootState } from '@rematch/core';
import { createPeerModel } from '../../core/connection/store/peers.model';
import { Dependencies } from '../../core/dependencies';
import { FakePermissionProvider } from '../../core/permission/providers/test/fake-permission.provider';
import { FakePeerProvider } from '../../core/connection/providers/test/fake-peer.provider';
import { createPermissionModel } from '../../core/permission/store/permission.model';

export interface RootModel extends Models<RootModel> {
    peer: ReturnType<typeof createPeerModel>;
    permission: ReturnType<typeof createPermissionModel>;
}

export const createStore = (dependencies: Dependencies)=>{
    const peerModel = createPeerModel(dependencies);
    const permissionModel = createPermissionModel();
    const models: RootModel = {  peer: peerModel, permission: permissionModel };

    const store = init({
        models,
    });
    return store;
};

export const createTestStore = (dependencies: Partial<Dependencies>)=>{
    const store = createStore({
        peerProvider: new FakePeerProvider(),
        permissionProvider: new FakePermissionProvider(),
        ...dependencies,
    });
    return store;
};

export type Store = ReturnType<typeof createStore>
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel>
