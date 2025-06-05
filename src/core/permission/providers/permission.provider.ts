/**
 * PermissionRequest is a type that represents the request for a permission.
 */
export type PermissionRequest = 'scan-peers'

/**
 * PermissionStatus is a type that represents the status of a permission.
 */
export type PermissionStatus = 'granted' | 'denied' | 'not-requested';

export type RequestedPermissionStatus = Record<PermissionRequest, PermissionStatus>;


/**
 * PermissionProvider is a class that provides a way to request permissions from the user.
 */
export interface PermissionProvider {
    requestPermission(permission: [PermissionRequest]): Promise<RequestedPermissionStatus>;
}
