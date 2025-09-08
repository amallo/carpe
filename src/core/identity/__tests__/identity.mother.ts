import { Identity as IdentityEntity } from '../entities/identity.entity';

/**
 * Mother Object for creating test identities
 * Provides predefined identity instances for testing
 */
export class Identity {
  /**
   * Returns the default test identity for "me" (the current user)
   */
  static me(): IdentityEntity {
    return {
      id: 'audie-id',
      nickname: 'audie',
      publicKey: 'public-key',
    };
  }

  /**
   * Returns a test identity with custom values
   */
  static with(id: string, nickname: string, publicKey: string): IdentityEntity {
    return {
      id,
      nickname,
      publicKey,
    };
  }

  /**
   * Returns a test identity for a specific user
   */
  static alice(): IdentityEntity {
    return {
      id: 'alice-id',
      nickname: 'alice',
      publicKey: 'alice-public-key',
    };
  }

  /**
   * Returns a test identity for another user
   */
  static bob(): IdentityEntity {
    return {
      id: 'bob-id',
      nickname: 'bob',
      publicKey: 'bob-public-key',
    };
  }

  /**
   * Returns a test identity with a long nickname
   */
  static withLongNickname(): IdentityEntity {
    return {
      id: 'long-nickname-id',
      nickname: 'very-long-nickname-for-testing-purposes',
      publicKey: 'long-nickname-public-key',
    };
  }

  /**
   * Returns a test identity with special characters
   */
  static withSpecialChars(): IdentityEntity {
    return {
      id: 'special-chars-id',
      nickname: 'user@domain.com',
      publicKey: 'special-chars-public-key',
    };
  }
}
