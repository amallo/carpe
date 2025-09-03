import { Platform } from 'react-native';
import { Logger } from '../../core/logger/providers/logger.interface';
import { PermissionProvider } from '../../core/permission/providers/permission.provider';
import { KeyVaultProvider } from '../../core/identity/providers/key-vault.provider';
import { IdentityIdGenerator } from '../../core/identity/generators/identity-id.generator';
import { KeyGenerator } from '../../core/identity/generators/key.generator';
import { AsyncStorageProvider } from '../../core/storage/providers/async-storage.provider';

// Production providers
import { BLEPeerProvider } from '../../core/peers/providers/BLE-peer.provider';
import { NativePermissionProvider } from '../../core/permission/providers/native/native-permission.provider';
import { SimpleIOSKeychainKeyVaultProvider } from '../../core/identity/providers/simple-ios-keychain-vault.provider';
import { BasicIdentityGenerator } from '../../core/identity/generators/basic-identity-id.generator';
import { SecureIdentityGenerator } from '../../core/identity/generators/secure-identity-id.generator';
import { BasicKeyGenerator } from '../../core/identity/generators/fake/basic-key.generator';
import { RNAsyncStorageProvider } from '../../core/storage/providers/rn-async-storage.provider';

// Test providers
import { InMemoryPeerProvider } from '../../core/peers/providers/test/in-memory-peer.provider';
import { GrantedPermissionProvider } from '../../core/permission/providers/test/granted-permission.provider';
import { InMemoryVaultProvider } from '../../core/identity/providers/test/in-memory-vault.provider';
import { InMemoryAsyncStorageProvider } from '../../core/storage/providers/test/in-memory-async-storage.provider';
import { FakeMessageProvider } from '../../core/message/providers/infra/fake-message.provider';
import { FakeMessageIdGenerator } from '../../core/message/providers/infra/fake-message-id.generator';

/**
 * Factory for creating providers based on environment
 * Centralizes provider creation logic and logging
 */
export class ProviderFactory {
  /**
   * Create peer provider based on environment
   */
  static createPeerProvider(shouldUseMock: boolean, logger: Logger) {
    if (shouldUseMock) {
      logger.info('ProviderFactory', 'Creating InMemoryPeerProvider for development');
      return new InMemoryPeerProvider({ logger });
    }

    logger.info('ProviderFactory', 'Creating BLEPeerProvider for production');
    return new BLEPeerProvider({ logger });
  }

  /**
   * Create vault provider based on environment
   */
  static createVaultProvider(shouldUseMock: boolean, logger: Logger): KeyVaultProvider {
    if (shouldUseMock) {
      logger.info('ProviderFactory', 'Creating InMemoryVaultProvider for development');
      return new InMemoryVaultProvider();
    }

    logger.info('ProviderFactory', 'Creating SimpleIOSKeychainVaultProvider for production');
    return new SimpleIOSKeychainKeyVaultProvider();
  }

  /**
   * Create permission provider based on environment
   */
  static createPermissionProvider(shouldUseMock: boolean, logger: Logger): PermissionProvider {
    if (shouldUseMock) {
      logger.info('ProviderFactory', 'Creating GrantedPermissionProvider for development');
      return new GrantedPermissionProvider();
    }

    logger.info('ProviderFactory', 'Creating NativePermissionProvider for production');
    return NativePermissionProvider.create(Platform.OS, logger);
  }

  /**
   * Create identity ID generator
   * Uses secure UUID v4 generator for production, basic for development/tests
   */
  static createIdentityIdGenerator(shouldUseMock: boolean, logger: Logger): IdentityIdGenerator {
    if (shouldUseMock) {
      logger.info('ProviderFactory', 'Creating BasicIdentityGenerator for development');
      return new BasicIdentityGenerator();
    }
    logger.info('ProviderFactory', 'Creating SecureIdentityGenerator for production');
    return new SecureIdentityGenerator();
  }

  /**
   * Create key generator
   * Uses production implementation for production, basic for development/tests
   */
  static createKeyGenerator(shouldUseMock: boolean, logger: Logger): KeyGenerator {
    if (shouldUseMock) {
      logger.info('ProviderFactory', 'Creating BasicKeyGenerator for development');
      return new BasicKeyGenerator();
    }
    logger.info('ProviderFactory', 'Creating BasicKeyGenerator for production (no secure version available yet)');
    return new BasicKeyGenerator();
  }

  /**
   * Create storage provider based on environment
   */
  static createStorageProvider(shouldUseMock: boolean, logger: Logger): AsyncStorageProvider {
    if (shouldUseMock) {
      logger.info('ProviderFactory', 'Creating InMemoryAsyncStorageProvider for development');
      return new InMemoryAsyncStorageProvider();
    }

    logger.info('ProviderFactory', 'Creating RNAsyncStorageProvider for production');
    return new RNAsyncStorageProvider();
  }
  /**
   * Create message provider based on environment
   */
  static createMessageProvider(shouldUseMock: boolean, logger: Logger) {
    if (shouldUseMock) {
      logger.info('ProviderFactory', 'Creating FakeMessageProvider for development');
      return new FakeMessageProvider();
    }
    logger.info('ProviderFactory', 'Creating MessageProvider for production');
    throw new Error('Not ready');
  }
  /**
   * Create message id generator based on environment
   */
  static createMessageIdGenerator(shouldUseMock: boolean, logger: Logger): MessageIdGenerator {
    if (shouldUseMock) {
      logger.info('ProviderFactory', 'Creating FakeMessageIdGenerator for development');
      return new FakeMessageIdGenerator();
    }
    logger.info('ProviderFactory', 'Creating MessageIdGenerator for production');
    throw new Error('Not ready');
  }


  /**
   * Create all dependencies at once
   * Convenience method for creating all providers
   */
  static createAllDependencies(shouldUseMock: boolean, logger: Logger)  {
    logger.info('ProviderFactory', `Creating all dependencies (mock: ${shouldUseMock})`);

    const dependencies = {
      logger,
      peerProvider: this.createPeerProvider(shouldUseMock, logger),
      vaultProvider: this.createVaultProvider(shouldUseMock, logger),
      permissionProvider: this.createPermissionProvider(shouldUseMock, logger),
      identityIdGenerator: this.createIdentityIdGenerator(shouldUseMock, logger),
      keyGenerator: this.createKeyGenerator(shouldUseMock, logger),
      storageProvider: this.createStorageProvider(shouldUseMock, logger),
      messageProvider: this.createMessageProvider(shouldUseMock, logger),
      messageIdGenerator: this.createMessageIdGenerator(shouldUseMock, logger),
    };

    logger.info('ProviderFactory', 'All dependencies created successfully');
    return dependencies;
  }
}
