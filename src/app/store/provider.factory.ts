import { Platform } from 'react-native';
import { Logger } from '../../core/logger/providers/logger.interface';
import { PermissionProvider } from '../../core/permission/providers/permission.provider';
import { IdentityIdGenerator } from '../../core/identity/generators/identity-id.generator';
import { IdentityKeyPair, IdentityKeyPairGenerator } from '../../core/identity/generators/identity-key-pair.generator';
import { AsyncStorageProvider } from '../../core/storage/providers/async-storage.provider';

// Production providers
import { BLEPeerProvider } from '../../core/peers/providers/BLE-peer.provider';
import { NativePermissionProvider } from '../../core/permission/providers/native/native-permission.provider';
import { IOSKeychainIdentityKeyProvider } from '../../core/identity/providers/infra/ios-keychain-identity-key-pair.provider';
import { IOSKeychainStorage } from '../../core/identity/providers/infra/ios-keychain.storage';
import { BasicIdentityIdGenerator } from '../../core/identity/generators/infra/basic-identity-id.generator';
import { UUIDIdentitIdGenerator } from '../../core/identity/generators/infra/uuid-identity-id.generator';
import { BasicIdentityKeyPairGenerator } from '../../core/identity/generators/infra/basic-identity-key-pair.generator';
import { RNAsyncStorageProvider } from '../../core/storage/providers/rn-async-storage.provider';

// Test providers
import { InMemoryPeerProvider } from '../../core/peers/providers/test/in-memory-peer.provider';
import { GrantedPermissionProvider } from '../../core/permission/providers/test/granted-permission.provider';
import { InMemoryIdentityKeyPairStorage } from '../../core/identity/providers/infra/in-memory-identity-key-pair.provider';
import { InMemoryAsyncStorageProvider } from '../../core/storage/providers/test/in-memory-async-storage.provider';
import { InMemoryMessageProvider } from '../../core/message/providers/infra/in-memory-message.provider';
import { MessageIdGenerator } from '../../core/message/providers/message-id.generator';
import { IdentityKeyPairProvider } from '../../core/identity/providers/identity-key-pair.provider';
import { DateProvider } from '../../core/common/date/providers/date.provider';
import { FakeDateProvider } from '../../core/common/date/providers/infra/fake-date.provider';
import { RealDateProvider } from '../../core/common/date/providers/infra/real-date.providers';
import { SimpleMessageIdGenerator } from '../../core/message/providers/infra/simple-message-id-generator';
import { NanoIdMessageIdGenerator } from '../../core/message/providers/infra/nanoid-message-id.generator';

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
  static createIdentityKeyPairProvider(shouldUseMock: boolean, logger: Logger): IdentityKeyPairProvider {
    if (shouldUseMock) {
      logger.info('ProviderFactory', 'Creating InMemoryVaultProvider for development');
      return new InMemoryIdentityKeyPairStorage('identity');
    }

    logger.info('ProviderFactory', 'Creating IOSKeychainIdentityKeyPairStorage for production');
    const keychainStorage = new IOSKeychainStorage<IdentityKeyPair>('com.carpeapp.identity');
    return new IOSKeychainIdentityKeyProvider(keychainStorage, 'identity');
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
      return new BasicIdentityIdGenerator();
    }
    logger.info('ProviderFactory', 'Creating SecureIdentityGenerator for production');
    return new UUIDIdentitIdGenerator();
  }

  /**
   * Create key generator
   * Uses production implementation for production, basic for development/tests
   */
  static createKeyGenerator(shouldUseMock: boolean, logger: Logger): IdentityKeyPairGenerator {
    if (shouldUseMock) {
      logger.info('ProviderFactory', 'Creating BasicKeyGenerator for development');
      return new BasicIdentityKeyPairGenerator();
    }
    logger.info('ProviderFactory', 'Creating BasicKeyGenerator for production (no secure version available yet)');
    return new BasicIdentityKeyPairGenerator();
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
      logger.info('ProviderFactory', 'Creating InMemoryMessageProvider for development');
      return new InMemoryMessageProvider(logger);
    }
    logger.info('ProviderFactory', 'Creating MessageProvider for production');
    return new InMemoryMessageProvider(logger);
  }
  /**
   * Create message id generator based on environment
   */
  static createMessageIdGenerator(shouldUseMock: boolean, logger: Logger): MessageIdGenerator {
    if (shouldUseMock) {
      logger.info('ProviderFactory', 'Creating SimpleMessageIdGenerator for development');
      return new SimpleMessageIdGenerator();
    }
    logger.info('ProviderFactory', 'Creating NanoIdMessageIdGenerator for production');
    return new NanoIdMessageIdGenerator();
  }
  /**
   * Create date provider based on environment
   */
  static createDateProvider(shouldUseMock: boolean, logger: Logger): DateProvider {
    if (shouldUseMock) {
      logger.info('ProviderFactory', 'Creating FakeDateProvider for development');
      return new FakeDateProvider();
    }
    logger.info('ProviderFactory', 'Creating DateProvider for production');
    return new RealDateProvider();
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
      vaultProvider: this.createIdentityKeyPairProvider(shouldUseMock, logger),
      permissionProvider: this.createPermissionProvider(shouldUseMock, logger),
      identityIdGenerator: this.createIdentityIdGenerator(shouldUseMock, logger),
      keyGenerator: this.createKeyGenerator(shouldUseMock, logger),
      storageProvider: this.createStorageProvider(shouldUseMock, logger),
      messageProvider: this.createMessageProvider(shouldUseMock, logger),
      messageIdGenerator: this.createMessageIdGenerator(shouldUseMock, logger),
      dateProvider: this.createDateProvider(shouldUseMock, logger),
    };

    logger.info('ProviderFactory', 'All dependencies created successfully');
    return dependencies;
  }
}
