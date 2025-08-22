import { KeyPair } from '../generators/key.generator';

export interface VaultProvider {
    /**
     * Save a key pair securely
     * @param keyPair - The key pair to save
     */
    saveKeyPair(keyPair: KeyPair): Promise<void>;

    /**
     * Retrieve the stored key pair
     * @returns The stored key pair or null if none exists
     */
    getKeyPair(): Promise<KeyPair | null>;

    /**
     * Check if a key pair exists
     * @returns True if a key pair is stored
     */
    hasKeyPair(): Promise<boolean>;

    /**
     * Delete the stored key pair
     */
    deleteKeyPair(): Promise<void>;
}
