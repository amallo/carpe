import { VaultProvider } from '../vault.provider';
import { KeyPair } from '../../generators/key.generator';

/**
 * In-memory implementation of VaultProvider for testing purposes
 * Stores key pairs in memory (NOT for production use)
 */
export class InMemoryVaultProvider implements VaultProvider {
    private keyPairs: Map<string, KeyPair> = new Map();

    /**
     * Save a key pair in memory
     * @param service - The service identifier for the key pair
     * @param keyPair - The key pair to save
     */
    async saveKeyPair(service: string, keyPair: KeyPair): Promise<void> {
        this.keyPairs.set(service, { ...keyPair });
    }

    /**
     * Retrieve the stored key pair from memory
     * @param service - The service identifier for the key pair
     * @returns The stored key pair or null if none exists
     */
    async getKeyPair(service: string): Promise<KeyPair | null> {
        const keyPair = this.keyPairs.get(service);
        return keyPair ? { ...keyPair } : null;
    }

    /**
     * Check if a key pair exists in memory
     * @param service - The service identifier for the key pair
     * @returns True if a key pair is stored
     */
    async hasKeyPair(service: string): Promise<boolean> {
        return this.keyPairs.has(service);
    }

    /**
     * Delete the stored key pair from memory
     * @param service - The service identifier for the key pair
     */
    async deleteKeyPair(service: string): Promise<void> {
        this.keyPairs.delete(service);
    }

    /**
     * Clear all stored key pairs
     * Useful for test cleanup
     */
    clearAll(): void {
        this.keyPairs.clear();
    }

    /**
     * Get the number of stored key pairs
     * Useful for testing
     */
    getKeyPairCount(): number {
        return this.keyPairs.size;
    }

    /**
     * Get all stored service names
     * Useful for testing
     */
    getStoredServices(): string[] {
        return Array.from(this.keyPairs.keys());
    }
}
