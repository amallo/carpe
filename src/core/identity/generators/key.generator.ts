export interface KeyPair {
    publicKey: string;
    privateKey: string;
}

export interface KeyGenerator {
    /**
     * Generate a public/private key pair
     * @returns A key pair with public and private keys
     */
    generate(): Promise<KeyPair>;
}
