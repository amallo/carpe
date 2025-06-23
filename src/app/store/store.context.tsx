// Créer un context React pour injecter le store et les dependencies

import { InMemoryPeerProvider } from '../../core/connection/providers/test/in-memory-peer.provider';
import { Dependencies } from '../../core/dependencies';
import { useMemo } from 'react';
import { createStore } from './store';
import { Provider } from 'react-redux';
import { NativePermissionProvider, requiredAndroidPermissionByFeature, requiredIOSPermissionByFeature } from '../../core/permission/providers/native/native-permission.provider';
import { Platform } from 'react-native';

const isIOS = Platform.OS === 'ios';

const createDependencies = (): Dependencies => {
    return {
        peerProvider: new InMemoryPeerProvider(1000),
        permissionProvider: new NativePermissionProvider(isIOS ? requiredIOSPermissionByFeature : requiredAndroidPermissionByFeature),
    };
};

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
    const store = useMemo(() => {
        return createStore(createDependencies());
    }, []);
    return <Provider store={store}>{children}</Provider>;
};
