import { createTestStore, Store } from '../../../app/store/store';
import { createStateBuilder } from '../../store/state.builder';
import { FakeIdentityIdGenerator } from '../generators/infra/fake-identity-id.generator';
import { FakeIdentityKeyPairGenerator } from '../generators/infra/fake-identity-key-pair.generator';
import { FakeIdentityKeyPairVaultStorage } from '../providers/infra/fake-identity-key-pair.storage';
import { createIdentity } from '../usecases/create-identity.usecase';

/**
 * @jest-environment node
 */
export class IdentityFixture {
  private identityIdGenerator: FakeIdentityIdGenerator;
  private keyGenerator: FakeIdentityKeyPairGenerator;
  private vaultProvider: FakeIdentityKeyPairVaultStorage;
  private store: Store;

  constructor(dependencies: {
    identityIdGenerator?: FakeIdentityIdGenerator;
    keyGenerator?: FakeIdentityKeyPairGenerator;
    vaultProvider?: FakeIdentityKeyPairVaultStorage;
  } = {}) {
    this.identityIdGenerator = dependencies.identityIdGenerator || new FakeIdentityIdGenerator();
    this.keyGenerator = dependencies.keyGenerator || new FakeIdentityKeyPairGenerator();
    this.vaultProvider = dependencies.vaultProvider || new FakeIdentityKeyPairVaultStorage();
    
    this.store = createTestStore({
      identityIdGenerator: this.identityIdGenerator,
      keyGenerator: this.keyGenerator,
      vaultProvider: this.vaultProvider,
    });
  }

  withGeneratedIdentityId(id: string): this {
    this.identityIdGenerator.scheduleIdGenerated(id);
    return this;
  }

  withGeneratedKeyPair(publicKey: string, privateKey: string): this {
    this.keyGenerator.scheduleKeyPairGenerated({ publicKey, privateKey });
    return this;
  }

  withKeyPairGenerationError(errorMessage: string): this {
    this.keyGenerator.scheduleError(errorMessage);
    return this;
  }

  async createIdentity(nickname: string): Promise<this> {
    await this.store.dispatch(createIdentity({ nickname }));
    return this;
  }

  expectKeyPairSaved(publicKey: string, privateKey: string): this {
    expect(this.vaultProvider.storeWasCalledWith('identity', { publicKey, privateKey })).toBe(true);
    return this;
  }

  expectIdentityCreated(id: string, nickname: string, publicKey: string): this {
    const expectedState = createStateBuilder().withCurrentIdentity({
      id, nickname, publicKey,
    }).build();
    expect(this.store.getState()).toEqual(expectedState);
    return this;
  }

  expectErrorState(errorMessage: string): this {
    const currentState = this.store.getState();
    expect(currentState.identity.error).toBe(errorMessage);
    return this;
  }

  expectLoadingState(isLoading: boolean): this {
    const currentState = this.store.getState();
    expect(currentState.identity.isLoading).toBe(isLoading);
    return this;
  }

  expectNoIdentityCreated(): this {
    const currentState = this.store.getState();
    expect(currentState.identity.current).toBeNull();
    return this;
  }

  getStore(): Store {
    return this.store;
  }

  getVaultProvider(): FakeIdentityKeyPairVaultStorage {
    return this.vaultProvider;
  }

  getIdentityIdGenerator(): FakeIdentityIdGenerator {
    return this.identityIdGenerator;
  }

  getKeyGenerator(): FakeIdentityKeyPairGenerator {
    return this.keyGenerator;
  }
}
