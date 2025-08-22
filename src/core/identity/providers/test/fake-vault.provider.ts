import { VaultProvider } from '../vault.provider';
import { KeyPair } from '../../generators/key.generator';
import { CallTracker } from '../../../test/call-tracker';

export class FakeVaultProvider implements VaultProvider {
    private _storedKeyPairs: Map<string, KeyPair> = new Map();
    private _saveKeyPairCallTracker = new CallTracker();
    private _getKeyPairCallTracker = new CallTracker();
    private _hasKeyPairCallTracker = new CallTracker();
    private _deleteKeyPairCallTracker = new CallTracker();

    /**
     * Save a key pair (in-memory for testing)
     * @param service - The service identifier for the key pair
     * @param keyPair - The key pair to save
     */
    async saveKeyPair(service: string, keyPair: KeyPair): Promise<void> {
        this._saveKeyPairCallTracker.recordCall({ service, keyPair });
        this._storedKeyPairs.set(service, keyPair);
    }

    /**
     * Retrieve the stored key pair
     * @param service - The service identifier for the key pair
     * @returns The stored key pair or null if none exists
     */
    async getKeyPair(service: string): Promise<KeyPair | null> {
        this._getKeyPairCallTracker.recordCall(service);
        return this._storedKeyPairs.get(service) || null;
    }

    /**
     * Check if a key pair exists
     * @param service - The service identifier for the key pair
     * @returns True if a key pair is stored
     */
    async hasKeyPair(service: string): Promise<boolean> {
        this._hasKeyPairCallTracker.recordCall(service);
        return this._storedKeyPairs.has(service);
    }

    /**
     * Delete the stored key pair
     * @param service - The service identifier for the key pair
     */
    async deleteKeyPair(service: string): Promise<void> {
        this._deleteKeyPairCallTracker.recordCall(service);
        this._storedKeyPairs.delete(service);
    }

    // Test helper methods
    saveKeyPairWasCalledWith(service: string, keyPair: KeyPair): boolean {
        return this._saveKeyPairCallTracker.wasCalledWith({ service, keyPair });
    }

    saveKeyPairWasCalled(): boolean {
        return this._saveKeyPairCallTracker.methodWasCalled();
    }

    getKeyPairWasCalled(): boolean {
        return this._getKeyPairCallTracker.methodWasCalled();
    }

    hasKeyPairWasCalled(): boolean {
        return this._hasKeyPairCallTracker.methodWasCalled();
    }

    deleteKeyPairWasCalled(): boolean {
        return this._deleteKeyPairCallTracker.methodWasCalled();
    }

    // Helper to set up test state
    setStoredKeyPair(service: string, keyPair: KeyPair | null): void {
        if (keyPair) {
            this._storedKeyPairs.set(service, keyPair);
        } else {
            this._storedKeyPairs.delete(service);
        }
    }
}
