import { PermissionProvider, FeatureRequest, FeaturedPermissionResult, PermissionStatus } from '../permission.provider';

export class GrantedPermissionProvider implements PermissionProvider{
    requestFeaturedPermission(_: FeatureRequest): Promise<FeaturedPermissionResult> {
        return Promise.resolve({
                'scan-bluetooth': 'granted',
        });
    }
    requestSinglePermission(_: string): Promise<PermissionStatus> {
        return Promise.resolve('granted');
    }
}
