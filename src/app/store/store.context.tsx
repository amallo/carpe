// Créer un context React pour injecter le store et les dependencies

import { InMemoryPeerProvider } from '../../core/connection/providers/test/in-memory-peer.provider';
import { Dependencies } from '../../core/dependencies';
import { useMemo } from 'react';
import { createStore } from './store';
import { GrantedPermissionProvider } from '../../core/permission/providers/test/granted-permission.provider';
import { Provider } from 'react-redux';

const createDependencies = (): Dependencies => {
    return {
        peerProvider: new InMemoryPeerProvider(1000),
        permissionProvider: new GrantedPermissionProvider(),
    };
};

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
    const store = useMemo(() => {
        return createStore(createDependencies());
    }, []);
    return <Provider store={store}>{children}</Provider>;
};
