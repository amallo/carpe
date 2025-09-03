export interface IdentityKeyPair {
    publicKey: string;
    privateKey: string;
}

export interface IdentityKeyPairGenerator {
    /**
     * Generate a public/private key pair
     * @returns A key pair with public and private keys
     */
    generate(): Promise<IdentityKeyPair>;
}
