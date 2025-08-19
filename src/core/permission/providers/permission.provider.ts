/**
 * PermissionRequest is a type that represents the request for a permission.
 */
export type FeatureRequest = 'scan-peers' | 'connect-peers'

/**
 * PermissionStatus is a type that represents the status of a permission.
 */
export type PermissionStatus = 'granted' | 'denied' | 'not-requested';

type PermissionId = string;
export type FeaturedPermissionResult = Record<PermissionId, PermissionStatus>;


/**
 * PermissionProvider is a class that provides a way to request permissions from the user.
 */
export interface PermissionProvider {
    requestFeaturedPermission(feature: FeatureRequest): Promise<FeaturedPermissionResult>;
    requestSinglePermission(permissionId: PermissionId): Promise<PermissionStatus>;
}
