import { PermissionProvider, FeatureRequest, FeaturedPermissionResult, PermissionStatus } from '../permission.provider';

export class FakePermissionProvider implements PermissionProvider{
    private _currentPermissionsByFeature: Record<FeatureRequest, FeaturedPermissionResult> = {
        'scan-peers': {
            'scan-bluetooth': 'not-requested',
        },
        'connect-peers': {
            'connect-bluetooth': 'granted', // Par défaut accordé
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
        // Chercher dans tous les features
        for (const feature of Object.keys(this._currentPermissionsByFeature)) {
            if (this._currentPermissionsByFeature[feature as FeatureRequest][permissionId]) {
                return Promise.resolve(this._currentPermissionsByFeature[feature as FeatureRequest][permissionId]);
            }
        }
        return Promise.resolve('not-requested');
    }
}
