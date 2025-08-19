import { configureStore } from '@reduxjs/toolkit';
import { Dependencies } from '../../core/dependencies';
import { FakePeerProvider } from '../../core/peers/providers/test/fake-peer.provider';
import peerReducer from '../../core/peers/store/peers.slice';
import pairingReducer from '../../core/peers/store/pairing.slice';
import permissionReducer from '../../core/permission/store/permission.slice';
import { GrantedPermissionProvider } from '../../core/permission/providers/test/granted-permission.provider';
import logReducer from '../../core/logger/store/log.slice';
import { ConsoleLogger } from '../../core/logger/providers/console-logger.provider';

export const createStore = (dependencies: Dependencies, initialState?: object) => {
    const store = configureStore({
        reducer: {
            peer: peerReducer,
            permission: permissionReducer,
            pairing: pairingReducer,
            log: logReducer,
        },
        preloadedState: initialState,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                thunk: {
                    extraArgument: dependencies,
                },
            }),
        devTools: true,
    });

    return store;
};

export const createTestStore = (dependencies: Partial<Dependencies>, initialState?: object) => {
    const deps: Dependencies = {
        peerProvider: new FakePeerProvider(),
        permissionProvider: new GrantedPermissionProvider(),
        logger: new ConsoleLogger(),
        ...dependencies,
    };
    const store = createStore(deps, initialState);
    return store;
};

export type Store = ReturnType<typeof createStore>;
export type RootState = ReturnType<Store['getState']>;
export type AppDispatch = Store['dispatch'];
