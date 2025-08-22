import { VaultProvider } from './vault.provider';
import { KeyPair } from '../generators/key.generator';

export class InMemoryVaultProvider implements VaultProvider {
    private storedKeyPair: KeyPair | null = null;

    private async simulateLatency(): Promise<void> {
        const delay = 200 + Math.random() * 200; // 200-400ms
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    async saveKeyPair(keyPair: KeyPair): Promise<void> {
        await this.simulateLatency();
        this.storedKeyPair = keyPair;
    }

    async getKeyPair(): Promise<KeyPair | null> {
        await this.simulateLatency();
        return this.storedKeyPair;
    }

    async hasKeyPair(): Promise<boolean> {
        await this.simulateLatency();
        return this.storedKeyPair !== null;
    }

    async deleteKeyPair(): Promise<void> {
        await this.simulateLatency();
        this.storedKeyPair = null;
    }
}
