import { KeyVaultProvider } from '../key-vault.provider';
import { IdentityKeyPair } from '../../generators/identity-key-pair.generator';
import { CallTracker } from '../../../test/call-tracker';

export class FakeKeyVaultProvider implements KeyVaultProvider {
    private _storedKeyPairs: Map<string, IdentityKeyPair> = new Map();
    private _saveKeyPairCallTracker = new CallTracker();
    private _getKeyPairCallTracker = new CallTracker();
    private _hasKeyPairCallTracker = new CallTracker();
    private _deleteKeyPairCallTracker = new CallTracker();

    /**
     * Save a key pair (in-memory for testing)
     * @param service - The service identifier for the key pair
     * @param keyPair - The key pair to save
     */
    async store(service: string, keyPair: IdentityKeyPair): Promise<void> {
        this._saveKeyPairCallTracker.recordCall({ service, keyPair });
        this._storedKeyPairs.set(service, keyPair);
    }

    /**
     * Retrieve the stored key pair
     * @param service - The service identifier for the key pair
     * @returns The stored key pair or null if none exists
     */
    async retrieve(service: string): Promise<IdentityKeyPair | null> {
        this._getKeyPairCallTracker.recordCall(service);
        return this._storedKeyPairs.get(service) || null;
    }

}
