import { KeyGenerator, KeyPair } from './key.generator';

export class BasicKeyGenerator implements KeyGenerator {
    private counter = 0;

    private async simulateLatency(): Promise<void> {
        const delay = 200 + Math.random() * 200; // 200-400ms
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    async generate(): Promise<KeyPair> {
        await this.simulateLatency();
        this.counter++;
        return {
            publicKey: `public-key-${this.counter}`,
            privateKey: `private-key-${this.counter}`,
        };
    }
}
