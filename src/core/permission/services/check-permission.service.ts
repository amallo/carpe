import { Dependencies } from '../../dependencies';
import { PermissionEntity } from '../store/permission.slice';

export interface CheckPermissionResult {
    hasPermission: boolean;
    permissions: PermissionEntity[];
}

export const checkPermission = async (
    feature: string,
    dependencies: Dependencies
): Promise<CheckPermissionResult> => {
    const { permissionProvider } = dependencies;

    // Request permissions for the feature
    const permissionResult = await permissionProvider.requestFeaturedPermission(feature as any);
    const permissions: PermissionEntity[] = Object.keys(permissionResult).reduce((acc, p) => {
        return [...acc, { id: p, status: permissionResult[p] }];
    }, [] as PermissionEntity[]);

    // Check if all permissions are granted
    const hasPermission = permissions.every((p) => p.status === 'granted');

    return {
        hasPermission,
        permissions,
    };
};
