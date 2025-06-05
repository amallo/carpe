import { PermissionProvider, PermissionRequest, RequestedPermissionStatus } from '../permission.provider';




export class FakePermissionProvider implements PermissionProvider{
    private _currentPermissions: RequestedPermissionStatus = {
            'scan-peers': 'not-requested',
    };
    requestPermission(permission: [PermissionRequest]): Promise<RequestedPermissionStatus> {
        const result : RequestedPermissionStatus = permission.reduce((acc, p )=>{
            return {
                ...acc,
                [p]: this._currentPermissions[p],
            };
        }, this._currentPermissions);
        return Promise.resolve(result);
    }
    schedulePermissionGranted(permission: PermissionRequest): void {
        this._currentPermissions[permission] = 'granted';
    }
    schedulePermissionDenied(permission: PermissionRequest): void {
        this._currentPermissions[permission] = 'denied';
    }
}
