import { createEntityAdapter, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit';


export type Feature = 'scan-peers' | 'connect-peers';
type PermissionState = EntityState<PermissionEntity, string> & Record<Feature, string[]>;

export type PermissionStatus = 'granted' | 'denied' | 'not-requested';
export const permissionAdapter = createEntityAdapter<PermissionEntity>();

export type PermissionEntity = {
    id: string;
    status: PermissionStatus;
}

export const getPermissionInitialState = (): PermissionState => {
    return {
        ...permissionAdapter.getInitialState(), 
        'scan-peers': [],
        'connect-peers': []
    };
};

const permissionSlice = createSlice({
    name: 'permission',
    initialState: getPermissionInitialState(),
    reducers: {
        setMultiplePermissionForFeature: (state, action: PayloadAction<{feature: Feature, permission: PermissionEntity[]}>) => {
            action.payload.permission.forEach((p)=>{
                state[action.payload.feature] = state[action.payload.feature].filter((pId)=>p.id !== pId);
                state[action.payload.feature].push(p.id);
            })
            return permissionAdapter.addMany(state, action.payload.permission);
        },
        setPermission: (state, action: PayloadAction<PermissionEntity>) => {
            state['scan-peers'] = state['scan-peers'].filter((pId)=>pId !== action.payload.id);
            state['scan-peers'].push(action.payload.id);
            return permissionAdapter.addOne(state, action.payload);
        },
    },
});

export const { setMultiplePermissionForFeature, setPermission } = permissionSlice.actions;


export const selectMissingPermissionForFeature = (state: { permission: PermissionState }, feature: Feature) =>
    state.permission[feature].filter((p)=>state.permission.entities[p].status !== 'granted').map((p)=>state.permission.entities[p]);

export default permissionSlice.reducer;
