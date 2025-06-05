import { createModel } from '@rematch/core';
import { RootModel } from '../../../app/store/create-store';
import { PermissionRequest, PermissionStatus, RequestedPermissionStatus } from '../providers/permission.provider';

type PermissionState = {
    [key in PermissionRequest]: PermissionStatus;
}

const getInitialState = (): PermissionState=>{
    return {
        'scan-peers': 'not-requested',
    };
}

export const createPermissionModel = (initialState: PermissionState = getInitialState())=>{
    return createModel<RootModel>()({
        state: {
            ...initialState,
        } as PermissionState,
        reducers: {
            setPermission: (state, payload: RequestedPermissionStatus) => {
                return {
                    ...state,
                    ...payload
                };
            },
        },
    });
};