import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PermissionRequest, PermissionStatus, RequestedPermissionStatus } from '../providers/permission.provider';

type PermissionState = {
    [key in PermissionRequest]: PermissionStatus;
}

const getInitialState = (): PermissionState => {
    return {
        'scan-peers': 'not-requested',
    };
};

const permissionSlice = createSlice({
    name: 'permission',
    initialState: getInitialState(),
    reducers: {
        setPermission: (state, action: PayloadAction<RequestedPermissionStatus>) => {
            return {
                ...state,
                ...action.payload,
            };
        },
    },
});

export const { setPermission } = permissionSlice.actions;

// Selectors
export const selectIsScanPeersGranted = (state: { permission: PermissionState }) =>
    state.permission['scan-peers'] === 'granted';

export default permissionSlice.reducer;
