import { configureStore } from '@reduxjs/toolkit';
import { Dependencies } from '../../core/dependencies';
import { FakePeerProvider } from '../../core/connection/providers/test/fake-peer.provider';
import { GrantedPermissionProvider } from '../../core/permission/providers/test/granted-permission.provider';
import peerReducer from '../../core/connection/store/peers.slice';
import permissionReducer from '../../core/permission/store/permission.slice';

export const createStore = (dependencies: Dependencies) => {
    const store = configureStore({
        reducer: {
            peer: peerReducer,
            permission: permissionReducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                thunk: {
                    extraArgument: dependencies,
                },
            }),
    });

    return store;
};

export const createTestStore = (dependencies: Partial<Dependencies>) => {
    const store = createStore({
        peerProvider: new FakePeerProvider(),
        permissionProvider: new GrantedPermissionProvider(),
        ...dependencies,
    });
    return store;
};

export type Store = ReturnType<typeof createStore>;
export type RootState = ReturnType<Store['getState']>;
export type AppDispatch = Store['dispatch'];
