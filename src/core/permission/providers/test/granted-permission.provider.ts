import { PermissionProvider, PermissionRequest, RequestedPermissionStatus } from '../permission.provider';

export class GrantedPermissionProvider implements PermissionProvider{
    requestPermission(permission: PermissionRequest[]): Promise<RequestedPermissionStatus> {
        return Promise.resolve({
            ...permission.reduce((acc, curr) => {
                acc[curr] = 'granted';
                return acc;
            }, {} as RequestedPermissionStatus),
        });
    }
}
