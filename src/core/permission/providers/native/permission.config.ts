import { PERMISSIONS } from 'react-native-permissions';

export interface PermissionConfig {
  icon: string;
  message: string;
}

export type PermissionConfigMap = Record<string, PermissionConfig>;

export const permissionConfig: PermissionConfigMap = {
  // iOS Permissions
  [PERMISSIONS.IOS.BLUETOOTH]: {
    icon: 'bluetooth',
    message: 'Pour connecter votre émetteur LoRa, cette application a besoin de l\'accès au Bluetooth'
  },
  [PERMISSIONS.IOS.LOCATION_WHEN_IN_USE]: {
    icon: 'location',
    message: 'Pour connecter votre émetteur LoRa, cette application a besoin de l\'accès au GPS'
  },
  
  // Android Permissions
  [PERMISSIONS.ANDROID.BLUETOOTH_SCAN]: {
    icon: 'bluetooth',
    message: 'Pour connecter votre émetteur LoRa, cette application a besoin de l\'accès au Bluetooth'
  },
  [PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION]: {
    icon: 'location',
    message: 'Pour détecter les appareils Bluetooth à proximité, cette application a besoin de l\'accès à la localisation'
  },
  [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]: {
    icon: 'location',
    message: 'Pour détecter les appareils Bluetooth à proximité, cette application a besoin de l\'accès à la localisation précise'
  }
}; 