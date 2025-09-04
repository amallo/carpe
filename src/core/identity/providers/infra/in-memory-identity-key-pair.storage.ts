import { IdentityKeyPairStorage } from '../vault.storage';
import { IdentityKeyPair } from '../../generators/identity-key-pair.generator';

/**
 * In-memory implementation of VaultProvider for testing purposes
 * Stores key pairs in memory (NOT for production use)
 */
export class InMemoryIdentityKeyPairStorage implements IdentityKeyPairStorage {
    private keyPairs: Map<string, IdentityKeyPair> = new Map();

    /**
     * Save a key pair in memory
     * @param service - The service identifier for the key pair
     * @param keyPair - The key pair to save
     */
    async store(service: string, keyPair: IdentityKeyPair): Promise<void> {
        this.keyPairs.set(service, { ...keyPair });
    }

    /**
     * Retrieve the stored key pair from memory
     * @param service - The service identifier for the key pair
     * @returns The stored key pair or null if none exists
     */
    async retrieve(service: string): Promise<IdentityKeyPair | null> {
        const keyPair = this.keyPairs.get(service);
        return keyPair ? { ...keyPair } : null;
    }
}
