import { IdentityKeyPairStorage } from '../vault.storage';
import { IdentityKeyPair } from '../../generators/identity-key-pair.generator';
import { IOSKeychainStorage } from './ios-keychain.storage';

/**
 * iOS Keychain implementation for storing Identity Key Pairs
 * Uses IOSKeychainStorage by composition for actual keychain operations
 */
export class IOSKeychainIdentityKeyPairStorage implements IdentityKeyPairStorage {
    private readonly keychainStorage: IOSKeychainStorage;

    constructor(keychainStorage: IOSKeychainStorage) {
        this.keychainStorage = keychainStorage;
    }



    /**
     * Save a key pair securely in iOS Keychain
     * @param service - The service identifier for the key pair
     * @param keyPair - The key pair to save
     */
    async store(service: string, keyPair: IdentityKeyPair): Promise<void> {
        await this.keychainStorage.store(service, keyPair);
    }

    /**
     * Retrieve the stored key pair from iOS Keychain
     * @param service - The service identifier for the key pair
     * @returns The stored key pair or null if none exists
     */
    async retrieve(service: string): Promise<IdentityKeyPair | null> {
        return await this.keychainStorage.retrieve<IdentityKeyPair>(service);
    }
}
