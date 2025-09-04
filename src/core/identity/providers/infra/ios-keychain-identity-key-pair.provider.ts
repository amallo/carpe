import { IdentityKeyPair } from '../../generators/identity-key-pair.generator';
import { IOSKeychainStorage } from './ios-keychain.storage';
import { IdentityKeyPairProvider } from '../identity-key-pair.provider';

/**
 * iOS Keychain implementation for storing Identity Key Pairs
 * Uses IOSKeychainStorage by composition for actual keychain operations
 */
export class IOSKeychainIdentityKeyProvider implements IdentityKeyPairProvider {
    private readonly keychainStorage: IOSKeychainStorage<IdentityKeyPair>;

    constructor(keychainStorage: IOSKeychainStorage<IdentityKeyPair>, private readonly keyName: string) {
        this.keychainStorage = keychainStorage;
    }



    /**
     * Save a key pair securely in iOS Keychain
     * @param service - The service identifier for the key pair
     * @param keyPair - The key pair to save
     */
    async store(keyPair: IdentityKeyPair): Promise<void> {
        await this.keychainStorage.store(this.keyName, keyPair);
    }

    /**
     * Retrieve the stored key pair from iOS Keychain
     * @param service - The service identifier for the key pair
     * @returns The stored key pair or null if none exists
     */
    retrieve(): Promise<IdentityKeyPair | null> {
        return this.keychainStorage.retrieve(this.keyName);
    }
}
