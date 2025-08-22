import { KeyPair } from '../generators/key.generator';

export interface VaultProvider {
    /**
     * Save a key pair securely
     * @param service - The service identifier for the key pair
     * @param keyPair - The key pair to save
     */
    saveKeyPair(service: string, keyPair: KeyPair): Promise<void>;

    /**
     * Retrieve the stored key pair
     * @param service - The service identifier for the key pair
     * @returns The stored key pair or null if none exists
     */
    getKeyPair(service: string): Promise<KeyPair | null>;

    /**
     * Check if a key pair exists
     * @param service - The service identifier for the key pair
     * @returns True if a key pair is stored
     */
    hasKeyPair(service: string): Promise<boolean>;

    /**
     * Delete the stored key pair
     * @param service - The service identifier for the key pair
     */
    deleteKeyPair(service: string): Promise<void>;
}
