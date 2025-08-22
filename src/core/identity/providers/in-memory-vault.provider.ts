import { VaultProvider } from './vault.provider';
import { KeyPair } from '../generators/key.generator';

export class InMemoryVaultProvider implements VaultProvider {
    private storedKeyPair: KeyPair | null = null;

    async saveKeyPair(keyPair: KeyPair): Promise<void> {
        this.storedKeyPair = keyPair;
    }

    async getKeyPair(): Promise<KeyPair | null> {
        return this.storedKeyPair;
    }

    async hasKeyPair(): Promise<boolean> {
        return this.storedKeyPair !== null;
    }

    async deleteKeyPair(): Promise<void> {
        this.storedKeyPair = null;
    }
}
