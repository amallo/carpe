// Créer un context React pour injecter le store et les dependencies

import { InMemoryPeerProvider } from '../../core/connection/providers/test/in-memory-peer.provider';
import { Dependencies } from '../../core/dependencies';
import { createContext, useContext, useMemo } from 'react';
import { createStore, Store } from './create-store';
import { GrantedPermissionProvider } from '../../core/permission/providers/test/granted-permission.provider';

const createDependencies = () : Dependencies=>{
  return {
    peerProvider: new InMemoryPeerProvider(1000),
    permissionProvider: new GrantedPermissionProvider(),
   };
};


const StoreContext = createContext<Store | null>(null);

export const StoreProvider = ({ children }: { children: React.ReactNode })=>{
    const store = useMemo(()=>{
        return createStore(createDependencies());
    }, []);
    return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

export const useStore = ()=>{
    const store = useContext(StoreContext);
    if (!store) {
        throw new Error('Dependencies not found');
    }
    console.log("store", store);
    return store;
};
