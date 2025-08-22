import { KeyGenerator, KeyPair } from './key.generator';

export class BasicKeyGenerator implements KeyGenerator {
    private counter = 0;

    async generate(): Promise<KeyPair> {
        this.counter++;
        return {
            publicKey: `public-key-${this.counter}`,
            privateKey: `private-key-${this.counter}`,
        };
    }
}
