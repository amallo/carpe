import { IdentityKeyPair } from '../generators/identity-key-pair.generator';



interface VaultStorage<T> {
    store(service: string, keyPair: T): Promise<void>;
    retrieve(service: string): Promise<T | null>;
}

export interface IdentityKeyPairStorage  extends VaultStorage<IdentityKeyPair> {}
