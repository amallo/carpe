import { Platform } from 'react-native';
import { Logger } from '../../core/logger/providers/logger.interface';
import { PeerProvider } from '../../core/peers/providers/peer.provider';
import { PermissionProvider } from '../../core/permission/providers/permission.provider';
import { VaultProvider } from '../../core/identity/providers/vault.provider';
import { IdentityIdGenerator } from '../../core/identity/generators/identity-id.generator';
import { KeyGenerator } from '../../core/identity/generators/key.generator';
import { AsyncStorageProvider } from '../../core/storage/providers/async-storage.provider';

// Production providers
import { BLEPeerProvider } from '../../core/peers/providers/BLE-peer.provider';
import { NativePermissionProvider } from '../../core/permission/providers/native/native-permission.provider';
import { SimpleIOSKeychainVaultProvider } from '../../core/identity/providers/simple-ios-keychain-vault.provider';
import { BasicIdentityGenerator } from '../../core/identity/generators/basic-identity-id.generator';
import { BasicKeyGenerator } from '../../core/identity/generators/basic-key.generator';
import { RNAsyncStorageProvider } from '../../core/storage/providers/rn-async-storage.provider';

// Test providers
import { InMemoryPeerProvider } from '../../core/peers/providers/test/in-memory-peer.provider';
import { GrantedPermissionProvider } from '../../core/permission/providers/test/granted-permission.provider';
import { InMemoryVaultProvider } from '../../core/identity/providers/test/in-memory-vault.provider';
import { InMemoryAsyncStorageProvider } from '../../core/storage/providers/test/in-memory-async-storage.provider';

// Logging utilities
import { debugLog, prodLog } from '../config/environment';

/**
 * Factory for creating providers based on environment
 * Centralizes provider creation logic and logging
 */
export class ProviderFactory {
  /**
   * Create peer provider based on environment
   */
  static createPeerProvider(shouldUseMock: boolean, logger: Logger): PeerProvider {
    if (shouldUseMock) {
      debugLog('Using InMemoryPeerProvider for development');
      return new InMemoryPeerProvider({ logger });
    }
    
    prodLog('Using BLEPeerProvider for production');
    return new BLEPeerProvider({ logger });
  }

  /**
   * Create vault provider based on environment
   */
  static createVaultProvider(shouldUseMock: boolean): VaultProvider {
    if (shouldUseMock) {
      debugLog('Using InMemoryVaultProvider for development');
      return new InMemoryVaultProvider();
    }
    
    prodLog('Using SimpleIOSKeychainVaultProvider for production');
    return new SimpleIOSKeychainVaultProvider();
  }

  /**
   * Create permission provider based on environment
   */
  static createPermissionProvider(shouldUseMock: boolean, logger: Logger): PermissionProvider {
    if (shouldUseMock) {
      debugLog('Using GrantedPermissionProvider for development');
      return new GrantedPermissionProvider();
    }
    
    prodLog('Using NativePermissionProvider for production');
    return NativePermissionProvider.create(Platform.OS, logger);
  }

  /**
   * Create identity ID generator
   * Always uses production implementation as it's stateless
   */
  static createIdentityIdGenerator(): IdentityIdGenerator {
    return new BasicIdentityGenerator();
  }

  /**
   * Create key generator
   * Always uses production implementation as it's stateless
   */
  static createKeyGenerator(): KeyGenerator {
    return new BasicKeyGenerator();
  }

  /**
   * Create storage provider based on environment
   */
  static createStorageProvider(shouldUseMock: boolean): AsyncStorageProvider {
    if (shouldUseMock) {
      debugLog('Using InMemoryAsyncStorageProvider for development');
      return new InMemoryAsyncStorageProvider();
    }
    
    prodLog('Using RNAsyncStorageProvider for production');
    return new RNAsyncStorageProvider();
  }

  /**
   * Create all dependencies at once
   * Convenience method for creating all providers
   */
  static createAllDependencies(shouldUseMock: boolean, logger: Logger) {
    return {
      logger,
      peerProvider: this.createPeerProvider(shouldUseMock, logger),
      vaultProvider: this.createVaultProvider(shouldUseMock),
      permissionProvider: this.createPermissionProvider(shouldUseMock, logger),
      identityIdGenerator: this.createIdentityIdGenerator(),
      keyGenerator: this.createKeyGenerator(),
      storageProvider: this.createStorageProvider(shouldUseMock),
    };
  }
}
