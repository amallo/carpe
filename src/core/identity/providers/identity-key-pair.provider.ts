import { IdentityKeyPair } from '../generators/identity-key-pair.generator';

export interface IdentityKeyPairProvider {
    retrieve(): Promise<IdentityKeyPair | null>;
    store(identityKeyPair: IdentityKeyPair): Promise<void>;
}
