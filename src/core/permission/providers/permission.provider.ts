export type PermissionRequest = 'scan-peers'

export type PermissionStatus = 'granted' | 'denied' | 'not-requested';

export type RequestedPermissionStatus = Record<PermissionRequest, PermissionStatus>;


export interface PermissionProvider {
    requestPermission(permission: [PermissionRequest]): Promise<RequestedPermissionStatus>;
}
