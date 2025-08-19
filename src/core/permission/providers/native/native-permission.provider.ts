import { Platform } from 'react-native';
import { PermissionProvider, FeatureRequest, FeaturedPermissionResult, PermissionStatus } from '../permission.provider';
import {Permission, PERMISSIONS, PermissionStatus as RNPermissionStatus, requestMultiple, request, checkMultiple, check, openSettings} from 'react-native-permissions';
import { Logger } from '../../../logger/providers/logger.interface';

type NativePermissionByFeature = Record<FeatureRequest, Permission[]>;

export const requiredIOSPermissionByFeature: NativePermissionByFeature = {
    'scan-peers': [PERMISSIONS.IOS.BLUETOOTH, PERMISSIONS.IOS.LOCATION_WHEN_IN_USE],
    'connect-peers': [PERMISSIONS.IOS.BLUETOOTH],
};

export const requiredAndroidPermissionByFeature: NativePermissionByFeature = {
    'scan-peers': [PERMISSIONS.ANDROID.BLUETOOTH_SCAN, PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION, PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION],
    'connect-peers': [PERMISSIONS.ANDROID.BLUETOOTH_CONNECT],
};

export class NativePermissionProvider implements PermissionProvider{
    constructor(
        private readonly nativePermissionByFeature: NativePermissionByFeature,
        private readonly logger?: Logger
    ) {}
    
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
    
    // Méthode privée pour vérifier l'état des permissions sans les redemander
    private async checkFeaturedPermissionStatus(feature: FeatureRequest): Promise<FeaturedPermissionResult> {
        this.logger?.debug('PERMISSION', `Vérification de l'état des permissions pour ${feature}`);
        return checkMultiple(this.featureToPermissions(feature)).then((r)=>{
            const result = Object.keys(r).reduce((acc, p)=>{
                acc[p] = this.fromRNPermissionStatus(r[p as Permission]);
                return acc;
            }, {} as FeaturedPermissionResult);
            this.logger?.debug('PERMISSION', `État actuel des permissions pour ${feature}`, result);
            return result;
        });
    }
    
    async requestFeaturedPermission(feature: FeatureRequest): Promise<FeaturedPermissionResult> {
        this.logger?.info('PERMISSION', `Demande de permissions pour ${feature}`);
        
        // D'abord vérifier l'état actuel des permissions
        const currentStatus = await this.checkFeaturedPermissionStatus(feature);
        
        // Si toutes les permissions sont déjà accordées, les retourner directement
        const allGranted = Object.values(currentStatus).every(status => status === 'granted');
        if (allGranted) {
            this.logger?.info('PERMISSION', `Toutes les permissions pour ${feature} sont déjà accordées, retour direct`);
            return currentStatus;
        }
        
        this.logger?.info('PERMISSION', `Certaines permissions pour ${feature} ne sont pas accordées, demande en cours...`);
        // Sinon, demander les permissions
        return requestMultiple(this.featureToPermissions(feature)).then((r)=>{
            const result = Object.keys(r).reduce((acc, p)=>{
                acc[p] = this.fromRNPermissionStatus(r[p as Permission]);
                return acc;
            }, {} as FeaturedPermissionResult);
            this.logger?.info('PERMISSION', `Résultat de la demande de permissions pour ${feature}`, result);
            return result;
        });
    }
    async requestSinglePermission(permissionId: Permission): Promise<PermissionStatus> {
        this.logger?.info('PERMISSION', `Demande de permission individuelle: ${permissionId}`);
        
        // D'abord vérifier l'état actuel de la permission
        const currentStatus = await check(permissionId);
        const currentPermissionStatus = this.fromRNPermissionStatus(currentStatus);
        this.logger?.debug('PERMISSION', `État actuel de ${permissionId}: ${currentPermissionStatus} (RN: ${currentStatus})`);
        
        // Si la permission est déjà accordée, la retourner directement
        if (currentPermissionStatus === 'granted') {
            this.logger?.info('PERMISSION', `Permission ${permissionId} déjà accordée, retour direct`);
            return currentPermissionStatus;
        }
        
        // Si la permission est bloquée, ouvrir les paramètres
        if (currentStatus === 'blocked') {
            this.logger?.warn('PERMISSION', `Permission ${permissionId} est bloquée, ouverture des paramètres`);
            await openSettings();
            // Après ouverture des paramètres, vérifier à nouveau l'état
            const newStatus = await check(permissionId);
            const newPermissionStatus = this.fromRNPermissionStatus(newStatus);
            this.logger?.info('PERMISSION', `Nouvel état après ouverture des paramètres pour ${permissionId}: ${newPermissionStatus} (RN: ${newStatus})`);
            return newPermissionStatus;
        }
        
        // Pour les autres cas, demander la permission
        this.logger?.info('PERMISSION', `Permission ${permissionId} non accordée, demande en cours...`);
        
        return request(permissionId).then((r)=>{
            const result = this.fromRNPermissionStatus(r);
            this.logger?.info('PERMISSION', `Résultat de la demande pour ${permissionId}: ${result} (RN: ${r})`);
            return result;
        }).catch((error) => {
            this.logger?.error('PERMISSION', `Erreur lors de la demande de permission ${permissionId}:`, error);
            return currentPermissionStatus;
        });
    }

    static create(os: typeof Platform.OS, logger?: Logger){
        const isIOS = os === 'ios';
        logger?.info('PERMISSION', `Création du provider pour ${os}`);
        return new NativePermissionProvider(isIOS ? requiredIOSPermissionByFeature : requiredAndroidPermissionByFeature, logger);
    }
}
