// Créer un context React pour injecter le store et les dependencies

import { useEffect, useMemo } from 'react';
import { createStore } from './store';
import { Provider } from 'react-redux';
import { NativePermissionProvider, requiredAndroidPermissionByFeature, requiredIOSPermissionByFeature } from '../../core/permission/providers/native/native-permission.provider';
import { Platform } from 'react-native';
import { BLEPeerProvider } from '../../core/peers/providers/BLE-peer.provider';
import { GrantedPermissionProvider } from '../../core/permission/providers/test/granted-permission.provider';
import { InMemoryPeerProvider } from '../../core/peers/providers/test/in-memory-peer.provider';
import { useMockProviders, debugLog, prodLog } from '../config/environment';

const isIOS = Platform.OS === 'ios';

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
    const shouldUseMockProviders = useMockProviders();
    
    const peerProvider = useMemo(() => {
        if (shouldUseMockProviders) {
            debugLog('Using InMemoryPeerProvider for development');
            return new InMemoryPeerProvider();
        } else {
            prodLog('Using BLEPeerProvider for production');
            return new BLEPeerProvider();
        }
    }, [shouldUseMockProviders]);

    const store = useMemo(() => {
        const permissionProvider = shouldUseMockProviders 
            ? new GrantedPermissionProvider()
            : new NativePermissionProvider(isIOS ? requiredIOSPermissionByFeature : requiredAndroidPermissionByFeature);
        
        return createStore({peerProvider, permissionProvider});
    }, [peerProvider, shouldUseMockProviders]);

    // Gestion du cycle de vie du peerProvider en production
    useEffect(() => {
        if (!shouldUseMockProviders && peerProvider) {
            prodLog('Starting BLE peer provider');
            peerProvider.start();
            return () => {
                prodLog('Destroying BLE peer provider');
                peerProvider.destroy();
            };
        }
    }, [peerProvider, shouldUseMockProviders]);

    return <Provider store={store}>{children}</Provider>;
};
