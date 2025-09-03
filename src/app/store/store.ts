import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, PersistConfig } from 'redux-persist';
import { Dependencies } from '../../core/dependencies';
import { FakePeerProvider } from '../../core/peers/providers/test/fake-peer.provider';
import peerReducer from '../../core/peers/store/peers.slice';
import messageReducer from '../../core/message/store/message.slice';
import pairedPeerReducer, { peerWasConnected } from '../../core/peers/store/paired-peer.slice';
import permissionReducer from '../../core/permission/store/permission.slice';
import connectivityReducer from '../../core/connectivity/store/connectivity.slice';
import appReducer from '../../core/app/store/app.slice';
import { GrantedPermissionProvider } from '../../core/permission/providers/test/granted-permission.provider';
import logReducer from '../../core/logger/store/log.slice';
import { ConsoleLogger } from '../../core/logger/providers/console-logger.provider';
import { FakeIdentityIdGenerator } from '../../core/identity/generators/infra/fake-identity-id.generator';
import { FakeIdentityKeyPairGenerator } from '../../core/identity/generators/infra/fake-identity-key-pair.generator';
import { FakeKeyVaultProvider } from '../../core/identity/providers/infra/fake-key-vault.provider';
import { InMemoryAsyncStorageProvider } from '../../core/storage/providers/test/in-memory-async-storage.provider';
import identityReducer from '../../core/identity/store/identity.slice';
import { createIdentityPersistConfig } from './persistence.factory';
import { createAutoReconnectionMiddleware } from '../../core/peers/middlewares/auto-reconnection.middleware';
import { FakeMessageProvider } from '../../core/message/providers/infra/fake-message.provider';
import { createSendNextMessageMiddleware } from '../../core/message/store/send-next-message.middleware';

export const createStore = (
    dependencies: Dependencies,
    customPersistConfig?: PersistConfig<any>,
    initialState?: object
) => {
    // Use custom persist config or create one with the injected storage provider
    const persistConfig = customPersistConfig || createIdentityPersistConfig(dependencies.storageProvider);
    // Create persisted identity reducer
    const persistedIdentityReducer = persistReducer(persistConfig, identityReducer);

    // Listen to peer connected events
    dependencies.peerProvider.onPeerConnected((peerId) => {
        store.dispatch(peerWasConnected(peerId));
    });

    const store = configureStore({
        reducer: {
            peer: peerReducer,
            permission: permissionReducer,
            pairedPeer: pairedPeerReducer,
            log: logReducer,
            connectivity: connectivityReducer,
            app: appReducer,
            message: messageReducer,
            identity: persistedIdentityReducer,
        },
        preloadedState: initialState,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                thunk: {
                    extraArgument: dependencies,
                },
                serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                },
            })
            .concat(createAutoReconnectionMiddleware(dependencies))
            .concat(createSendNextMessageMiddleware(dependencies)),
        devTools: true,
    });

    return store;
};


export const createTestStore = (dependencies: Partial<Dependencies>, initialState?: object) => {
    const deps: Dependencies = {
        peerProvider: new FakePeerProvider(),
        permissionProvider: new GrantedPermissionProvider(),
        logger: new ConsoleLogger(),
        identityIdGenerator: new FakeIdentityIdGenerator(),
        keyGenerator: new FakeIdentityKeyPairGenerator(),
        vaultProvider: new FakeKeyVaultProvider(),
        storageProvider: new InMemoryAsyncStorageProvider(), // In-memory storage for tests
        messageProvider: new FakeMessageProvider(),
        ...dependencies,
    };
    // Create test store - persistence config will be created automatically using InMemoryAsyncStorageProvider
    const store = createStore(deps, undefined, initialState);
    return store;
};

export type Store = ReturnType<typeof createStore>;
export type RootState = ReturnType<Store['getState']>;
export type AppDispatch = Store['dispatch'];

/**
 * Create persistor for the store
 * Must be called after createStore
 */
export const createPersistor = (store: Store) => {
    return persistStore(store);
};
