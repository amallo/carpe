import { IdentityKeyPair } from '../generators/identity-key-pair.generator';



interface VaultProvider<T> {
    store(service: string, keyPair: T): Promise<void>;
    retrieve(service: string): Promise<T | null>;
}

export interface KeyVaultProvider  extends VaultProvider<IdentityKeyPair> {}
