import { IdentityKeyPairGenerator, IdentityKeyPair } from '../identity-key-pair.generator';

export class FakeIdentityKeyPairGenerator implements IdentityKeyPairGenerator {
    private _keyPairs: IdentityKeyPair[] = [];
    private _errors: string[] = [];

    /**
     * Schedule the next key pair to be generated
     * @param keyPair - The key pair to be returned on next generate() call
     */
    scheduleKeyPairGenerated(keyPair: IdentityKeyPair) {
        this._keyPairs.push(keyPair);
    }

    /**
     * Schedule the next error to be thrown
     * @param errorMessage - The error message to be thrown on next generate() call
     */
    scheduleError(errorMessage: string) {
        this._errors.push(errorMessage);
    }

    /**
     * Generate the next scheduled key pair or throw error if none scheduled
     * @returns The next scheduled key pair
     */
    async generate(): Promise<IdentityKeyPair> {
        // Check if there's a scheduled error first
        const scheduledError = this._errors.shift();
        if (scheduledError) {
            throw new Error(scheduledError);
        }

        const keyPair = this._keyPairs.shift();
        if (!keyPair) {
            throw new Error('No key pair scheduled');
        }
        return keyPair;
    }
}
