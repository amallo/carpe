import { configureStore } from '@reduxjs/toolkit';
import { Dependencies } from '../../core/dependencies';
import { FakePeerProvider } from '../../core/peers/providers/test/fake-peer.provider';
import peerReducer from '../../core/peers/store/peers.slice';
import pairingReducer from '../../core/peers/store/pairing.slice';
import permissionReducer from '../../core/permission/store/permission.slice';
import { GrantedPermissionProvider } from '../../core/permission/providers/test/granted-permission.provider';
import logReducer from '../../core/logger/store/log.slice';
import { ConsoleLogger } from '../../core/logger/providers/console-logger.provider';
import { BasicIdentityGenerator } from '../../core/identity/generators/basic-identity-id.generator';
import { BasicKeyGenerator } from '../../core/identity/generators/basic-key.generator';
import { InMemoryVaultProvider } from '../../core/identity/providers/in-memory-vault.provider';
import { FakeIdentityIdGenerator } from '../../core/identity/generators/fake/fake-identity-id.generator';
import { FakeKeyGenerator } from '../../core/identity/generators/fake/fake-key.generator';
import { FakeVaultProvider } from '../../core/identity/providers/test/fake-vault.provider';
import identityReducer from '../../core/identity/store/identity.slice';

export const createStore = (dependencies: Dependencies, initialState?: object) => {
    const store = configureStore({
        reducer: {
            peer: peerReducer,
            permission: permissionReducer,
            pairing: pairingReducer,
            log: logReducer,
            identity: identityReducer,
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

export const createProductionStore = (dependencies: Partial<Dependencies>, initialState?: object) => {
    const deps: Dependencies = {
        peerProvider: new FakePeerProvider(), // TODO: Replace with real implementation
        permissionProvider: new GrantedPermissionProvider(), // TODO: Replace with real implementation
        logger: new ConsoleLogger(),
        identityIdGenerator: new BasicIdentityGenerator(),
        keyGenerator: new BasicKeyGenerator(),
        vaultProvider: new InMemoryVaultProvider(),
        ...dependencies,
    };
    const store = createStore(deps, initialState);
    return store;
};

export const createTestStore = (dependencies: Partial<Dependencies>, initialState?: object) => {
    const deps: Dependencies = {
        peerProvider: new FakePeerProvider(),
        permissionProvider: new GrantedPermissionProvider(),
        logger: new ConsoleLogger(),
        identityIdGenerator: new FakeIdentityIdGenerator(),
        keyGenerator: new FakeKeyGenerator(),
        vaultProvider: new FakeVaultProvider(),
        ...dependencies,
    };
    const store = createStore(deps, initialState);
    return store;
};

export type Store = ReturnType<typeof createStore>;
export type RootState = ReturnType<Store['getState']>;
export type AppDispatch = Store['dispatch'];
