import { IdentityKeyPair } from '../../generators/identity-key-pair.generator';
import { IdentityKeyPairProvider } from '../identity-key-pair.provider';

/**
 * In-memory implementation of VaultProvider for testing purposes
 * Stores key pairs in memory (NOT for production use)
 */
export class InMemoryIdentityKeyPairStorage implements IdentityKeyPairProvider {
    private keyPairs: Map<string, IdentityKeyPair> = new Map();

    constructor(private readonly keyName: string) {
    }

    /**
     * Save a key pair in memory
     * @param keyPair - The keyPair identifier for the key pair
     * @param keyPair - The key pair to save
     */
    async store(keyPair: IdentityKeyPair): Promise<void> {
        this.keyPairs.set(this.keyName, { ...keyPair });
    }

    /**
     * Retrieve the stored key pair from memory
     * @returns The stored key pair or null if none exists
     */
    async retrieve(): Promise<IdentityKeyPair | null> {
        const keyPair = this.keyPairs.get(this.keyName);
        return keyPair ? { ...keyPair } : null;
    }
}
