import { createModel } from '@rematch/core';
import { RootModel, RootState } from '../../../app/store/create-store';
import { EntityState, createEntityAdapter, getInitialEntityState } from '../../store/entity.state';
import { Dependencies } from '../../dependencies';

type PeerState = EntityState<PeerEntity> & {scanLoading: boolean}

export type PeerEntity = {
    id: string;
    name: string;
}



export const peerAdapter = createEntityAdapter<PeerEntity>();

export const createPeerModel = ({ peerProvider, permissionProvider}: Dependencies, initialState: PeerState = {...getInitialEntityState<PeerEntity>(), scanLoading: false})=>{
    const model = createModel<RootModel>()({
        state: initialState as PeerState,
        selectors: (slice) => ({
            selectScanLoading(){
              return slice((state)=> state.scanLoading);
            },
            selectAll(){
              return slice((state)=> state.ids.map((id)=> state.byId[id]));
            },
        }),
        reducers: {
            scanHit: (state, payload: PeerEntity) => {
              const entities = peerAdapter.addOne(state, {
                  id: payload.id,
                  name: payload.name,
              });
              return {...state, ...entities};
            },
            scanLoading: (state, payload: boolean) => {
              return {...state, scanLoading: payload};
            },
          },
        effects: (dispatch) => ({
            async scan({timeout}: {timeout?: number}) {
              /**
               * Request permission to scan for peers
               */
              const permission = await permissionProvider.requestPermission(['scan-peers']);
              console.log("permission", permission);
              dispatch.permission.setPermission(permission);
              if (permission['scan-peers'] !== 'granted') {
                return;
              }
              /**
               * Register callbacks to the peer provider
               */
              peerProvider.onPeerFound((peer)=>{
                console.log("peerFound", peer);
                this.scanHit({id: peer.id, name: peer.name});
              });
              peerProvider.onScanStopped(()=>{
                this.scanLoading(false);
              });
              peerProvider.onScanStarted(()=>{
                this.scanLoading(true);
              });
              /**
               * Start scanning for peers
               */
              setTimeout(()=>{
                peerProvider.stopScan();
              }, timeout);
              return peerProvider.scan();
            },
        }),
    });
    return model;
};
