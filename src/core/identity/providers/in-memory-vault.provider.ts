import { VaultProvider } from './vault.provider';
import { KeyPair } from '../generators/key.generator';

export class InMemoryVaultProvider implements VaultProvider {
    private storedKeyPairs: Map<string, KeyPair> = new Map();

    private async simulateLatency(): Promise<void> {
        const delay = 200 + Math.random() * 200; // 200-400ms
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    async saveKeyPair(service: string, keyPair: KeyPair): Promise<void> {
        await this.simulateLatency();
        this.storedKeyPairs.set(service, keyPair);
    }

    async getKeyPair(service: string): Promise<KeyPair | null> {
        await this.simulateLatency();
        return this.storedKeyPairs.get(service) || null;
    }

    async hasKeyPair(service: string): Promise<boolean> {
        await this.simulateLatency();
        return this.storedKeyPairs.has(service);
    }

    async deleteKeyPair(service: string): Promise<void> {
        await this.simulateLatency();
        this.storedKeyPairs.delete(service);
    }
}
