import { createTestStore, Store } from '../../../app/store/store';
import { createStateBuilder } from '../../store/state.builder';
import { FakeIdentityIdGenerator } from '../generators/fake/fake-identity-id.generator';
import { FakeKeyGenerator } from '../generators/fake/fake-key.generator';
import { FakeVaultProvider } from '../providers/test/fake-vault.provider';
import { createIdentity } from '../usecases/create-identity.usecase';

/**
 * @jest-environment node
 */
export class IdentityFixture {
  private identityIdGenerator: FakeIdentityIdGenerator;
  private keyGenerator: FakeKeyGenerator;
  private vaultProvider: FakeVaultProvider;
  private store: Store;

  constructor(dependencies: {
    identityIdGenerator?: FakeIdentityIdGenerator;
    keyGenerator?: FakeKeyGenerator;
    vaultProvider?: FakeVaultProvider;
  } = {}) {
    this.identityIdGenerator = dependencies.identityIdGenerator || new FakeIdentityIdGenerator();
    this.keyGenerator = dependencies.keyGenerator || new FakeKeyGenerator();
    this.vaultProvider = dependencies.vaultProvider || new FakeVaultProvider();
    
    this.store = createTestStore({
      identityIdGenerator: this.identityIdGenerator,
      keyGenerator: this.keyGenerator,
      vaultProvider: this.vaultProvider,
    });
  }

  withIdentityId(id: string): this {
    this.identityIdGenerator.scheduleIdGenerated(id);
    return this;
  }

  withKeyPair(publicKey: string, privateKey: string): this {
    this.keyGenerator.scheduleKeyPairGenerated({ publicKey, privateKey });
    return this;
  }

  withKeyGenerationError(errorMessage: string): this {
    this.keyGenerator.scheduleError(errorMessage);
    return this;
  }

  async createIdentity(nickname: string): Promise<this> {
    await this.store.dispatch(createIdentity({ nickname }));
    return this;
  }

  expectKeyPairSaved(): this {
    expect(this.vaultProvider.saveKeyPairWasCalled()).toBe(true);
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

  getVaultProvider(): FakeVaultProvider {
    return this.vaultProvider;
  }

  getIdentityIdGenerator(): FakeIdentityIdGenerator {
    return this.identityIdGenerator;
  }

  getKeyGenerator(): FakeKeyGenerator {
    return this.keyGenerator;
  }
}
