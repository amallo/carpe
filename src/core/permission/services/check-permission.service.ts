import { AppDispatch } from '../../../app/store/store';
import { Dependencies } from '../../dependencies';
import { PeerError } from '../../peers/providers/peer.provider';
import { Feature, PermissionEntity, setMultiplePermissionForFeature } from '../store/permission.slice';


export const checkPermissionService = async (
    feature: Feature,
    dependencies: Dependencies,
    dispatch: AppDispatch
) => {
    const { permissionProvider } = dependencies;

    // Le provider vérifie maintenant automatiquement l'état des permissions avant de les redemander
    const permissionResult = await permissionProvider.requestFeaturedPermission(feature as any);
    const permissions: PermissionEntity[] = Object.keys(permissionResult).reduce((acc, p) => {
        return [...acc, { id: p, status: permissionResult[p] }];
    }, [] as PermissionEntity[]);
    
    dispatch(setMultiplePermissionForFeature({
        permission: permissions,
        feature: feature,
    }));

    // Check if all permissions are granted
    const hasPermission = permissions.every((p) => p.status === 'granted');

    if (!hasPermission) {
        throw new Error(PeerError.PERMISSION_DENIED);
    }
};
