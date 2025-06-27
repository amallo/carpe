import { PermissionProvider, FeatureRequest, FeaturedPermissionResult, PermissionStatus } from '../permission.provider';
import {Permission, PERMISSIONS, PermissionStatus as RNPermissionStatus, requestMultiple, request} from 'react-native-permissions';

type NativePermissionByFeature = Record<FeatureRequest, Permission[]>;

export const requiredIOSPermissionByFeature: NativePermissionByFeature = {
    'scan-peers': [PERMISSIONS.IOS.BLUETOOTH],
} as const;

export const requiredAndroidPermissionByFeature: NativePermissionByFeature = {
    'scan-peers': [PERMISSIONS.ANDROID.BLUETOOTH_SCAN, PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION, PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION],
} as const;

export class NativePermissionProvider implements PermissionProvider{
    constructor(private readonly nativePermissionByFeature: NativePermissionByFeature) {}
    featureToPermissions(permission: FeatureRequest): Permission[] {
        if (this.nativePermissionByFeature[permission]) {
            return this.nativePermissionByFeature[permission];
        }
        return [];
    }
    fromRNPermissionStatus(status: RNPermissionStatus): PermissionStatus {
        switch(status){
            case 'granted':
                return 'granted';
            case 'denied':
                return 'denied';
            case 'blocked':
                return 'denied';
            case 'unavailable':
                return 'denied';
            default:
                return 'not-requested';
        }
    }
    async requestFeaturedPermission(feature: FeatureRequest): Promise<FeaturedPermissionResult> {
        return requestMultiple(this.featureToPermissions(feature)).then((r)=>{
            return Object.keys(r).reduce((acc, p)=>{
                acc[p] = this.fromRNPermissionStatus(r[p as Permission]);
                return acc;
            }, {} as FeaturedPermissionResult);
        });
    }
    async requestSinglePermission(permissionId: Permission): Promise<PermissionStatus> {
        return request(permissionId).then((r)=>{
            return this.fromRNPermissionStatus(r);
        });
    }
}
