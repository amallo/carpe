import { PermissionProvider, FeatureRequest, FeaturedPermissionResult, PermissionStatus } from '../permission.provider';




export class FakePermissionProvider implements PermissionProvider{
    private _currentPermissionsByFeature: Record<FeatureRequest, FeaturedPermissionResult> = {
        'scan-peers': {
            'scan-bluetooth': 'not-requested',
        },
    };
    requestFeaturedPermission(feature: FeatureRequest): Promise<FeaturedPermissionResult> {
        const result = this._currentPermissionsByFeature[feature];
        return Promise.resolve(result);
    }
    schedulePermissionGranted({forFeature, permission}: {forFeature: FeatureRequest, permission: string}): void {
        this._currentPermissionsByFeature[forFeature][permission] = 'granted';
    }
    schedulePermissionDenied({forFeature, permission}: {forFeature: FeatureRequest, permission: string}): void {
        this._currentPermissionsByFeature[forFeature] = {
            ...this._currentPermissionsByFeature[forFeature],
            [permission]: 'denied',
        };
    }
    requestSinglePermission(permissionId: string): Promise<PermissionStatus> {
        return Promise.resolve(this._currentPermissionsByFeature['scan-peers'][permissionId]);
    }
}
