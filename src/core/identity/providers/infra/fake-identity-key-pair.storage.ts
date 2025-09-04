import { IdentityKeyPairStorage } from '../vault.storage';
import { IdentityKeyPair } from '../../generators/identity-key-pair.generator';
import { CallTracker } from '../../../test/call-tracker';

export class FakeIdentityKeyPairVaultStorage implements IdentityKeyPairStorage {
    private _storedKeyPairs: Map<string, IdentityKeyPair> = new Map();
    private _storeKeyPairCallTracker = new CallTracker();
    private _retrieveKeyPairCallTracker = new CallTracker();

    /**
     * Save a key pair (in-memory for testing)
     * @param service - The service identifier for the key pair
     * @param keyPair - The key pair to save
     */
    async store(service: string, keyPair: IdentityKeyPair): Promise<void> {
        this._storeKeyPairCallTracker.recordCall({ service, keyPair });
        this._storedKeyPairs.set(service, keyPair);
    }

    /**
     * Retrieve the stored key pair
     * @param service - The service identifier for the key pair
     * @returns The stored key pair or null if none exists
     */
    async retrieve(service: string): Promise<IdentityKeyPair | null> {
        this._retrieveKeyPairCallTracker.recordCall(service);
        return this._storedKeyPairs.get(service) || null;
    }

    storeWasCalledWith(service: string, keyPair: IdentityKeyPair): boolean {
        return this._storeKeyPairCallTracker.wasCalledWith({ service, keyPair });
    }

}
