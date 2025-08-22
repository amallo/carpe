import { VaultProvider } from '../vault.provider';
import { KeyPair } from '../../generators/key.generator';
import { CallTracker } from '../../../test/call-tracker';

export class FakeVaultProvider implements VaultProvider {
    private _storedKeyPair: KeyPair | null = null;
    private _saveKeyPairCallTracker = new CallTracker();
    private _getKeyPairCallTracker = new CallTracker();
    private _hasKeyPairCallTracker = new CallTracker();
    private _deleteKeyPairCallTracker = new CallTracker();



    /**
     * Save a key pair (in-memory for testing)
     * @param keyPair - The key pair to save
     */
    async saveKeyPair(keyPair: KeyPair): Promise<void> {
        this._saveKeyPairCallTracker.recordCall(keyPair);
        this._storedKeyPair = keyPair;
    }

    /**
     * Retrieve the stored key pair
     * @returns The stored key pair or null if none exists
     */
    async getKeyPair(): Promise<KeyPair | null> {
        this._getKeyPairCallTracker.recordCall();
        return this._storedKeyPair;
    }

    /**
     * Check if a key pair exists
     * @returns True if a key pair is stored
     */
    async hasKeyPair(): Promise<boolean> {
        this._hasKeyPairCallTracker.recordCall();
        return this._storedKeyPair !== null;
    }

    /**
     * Delete the stored key pair
     */
    async deleteKeyPair(): Promise<void> {
        this._deleteKeyPairCallTracker.recordCall();
        this._storedKeyPair = null;
    }

    // Test helper methods
    saveKeyPairWasCalledWith(keyPair: KeyPair): boolean {
        return this._saveKeyPairCallTracker.wasCalledWith(keyPair);
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
    setStoredKeyPair(keyPair: KeyPair | null): void {
        this._storedKeyPair = keyPair;
    }
}
