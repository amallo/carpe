
import { IdentityKeyPair } from '../../generators/identity-key-pair.generator';
import { CallTracker } from '../../../test/call-tracker';
import { IdentityKeyPairProvider } from '../identity-key-pair.provider';

export class FakeIdentityKeyPairProvider implements IdentityKeyPairProvider {
    private _storedKeyPairs: Map<string, IdentityKeyPair> = new Map();
    private _storeKeyPairCallTracker = new CallTracker();
    private _retrieveKeyPairCallTracker = new CallTracker();

    constructor(private readonly keyName: string) {
    }

    /**
     * Save a key pair (in-memory for testing)
     * @param service - The service identifier for the key pair
     * @param keyPair - The key pair to save
     */
    async store(keyPair: IdentityKeyPair): Promise<void> {
        this._storeKeyPairCallTracker.recordCall(keyPair);
        this._storedKeyPairs.set(this.keyName, keyPair);
    }

    /**
     * Retrieve the stored key pair
     * @param service - The service identifier for the key pair
     * @returns The stored key pair or null if none exists
     */
    async retrieve(): Promise<IdentityKeyPair | null> {
        this._retrieveKeyPairCallTracker.recordCall();
        return this._storedKeyPairs.get(this.keyName) || null;
    }

    storeWasCalledWith(keyPair: IdentityKeyPair): boolean {
        return this._storeKeyPairCallTracker.wasCalledWith(keyPair);
    }

}
