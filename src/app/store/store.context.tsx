// Créer un context React pour injecter le store et les dependencies

import { useEffect, useMemo } from 'react';
import { createStore } from './store';
import { Provider } from 'react-redux';
import { NativePermissionProvider, requiredAndroidPermissionByFeature, requiredIOSPermissionByFeature } from '../../core/permission/providers/native/native-permission.provider';
import { Platform } from 'react-native';
import { BLEPeerProvider } from '../../core/connection/providers/BLE-peer.provider';

const isIOS = Platform.OS === 'ios';


export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
    const peerProvider = useMemo(() => {
        return new BLEPeerProvider();
    }, []);
    const store = useMemo(() => {
        const permissionProvider =  new NativePermissionProvider(isIOS ? requiredIOSPermissionByFeature : requiredAndroidPermissionByFeature);
        return createStore({peerProvider, permissionProvider});
    }, [peerProvider]);
    useEffect(()=>{
        peerProvider.start();
        return () => {
            peerProvider.destroy();
        }
    }, [peerProvider]);
    return <Provider store={store}>{children}</Provider>;
};
