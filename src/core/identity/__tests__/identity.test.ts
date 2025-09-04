import { IdentityFixture } from './identity.fixture';

describe('FEATURE: User creates an identity', () => {
  test('should create identity with key pair', async () => {
    const fixture = new IdentityFixture()
      .withGeneratedIdentityId('id-123')
      .withGeneratedKeyPair('publicKey-123', 'privateKey-123');

    await fixture.createIdentity('JohnDoe');

    fixture
      .expectKeyPairStored({ publicKey: 'publicKey-123', privateKey: 'privateKey-123' })
      .expectIdentityCreated('id-123', 'JohnDoe', 'publicKey-123');
  });

  test('should handle error when key generation fails', async () => {
    const fixture = new IdentityFixture()
      .withGeneratedIdentityId('id-123')
      .withKeyPairGenerationError('Failed to generate key pair');

    await fixture.createIdentity('JohnDoe');

    fixture
      .expectErrorState('Failed to generate key pair')
      .expectLoadingState(false)
      .expectNoIdentityCreated();
  });
});
