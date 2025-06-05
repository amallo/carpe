import { init, Models, RematchDispatch, RematchRootState } from '@rematch/core';
import { createPeerModel } from '../../core/connection/store/peers.model';
import { Dependencies } from '../../core/dependencies';
import { FakePeerProvider } from '../../core/connection/providers/test/fake-peer.provider';
import { createPermissionModel } from '../../core/permission/store/permission.model';
import selectPlugin from '@rematch/select';
import { GrantedPermissionProvider } from '../../core/permission/providers/test/granted-permission.provider';

export interface RootModel extends Models<RootModel> {
    peer: ReturnType<typeof createPeerModel>;
    permission: ReturnType<typeof createPermissionModel>;
}

export const createStore = (dependencies: Dependencies)=>{
    const peerModel = createPeerModel(dependencies);
    const permissionModel = createPermissionModel();
    const models: RootModel = {  peer: peerModel, permission: permissionModel };

    const store = init<RootModel>({
        models,
        plugins: [selectPlugin()],
    });
    return store;
};

export const createTestStore = (dependencies: Partial<Dependencies>)=>{
    const store = createStore({
        peerProvider: new FakePeerProvider(),
        permissionProvider: new GrantedPermissionProvider(),
        ...dependencies,
    });
    return store;
};

export type Store = ReturnType<typeof createStore>
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel>
