import { v4 as uuidv4 } from 'uuid';
import { IdentityIdGenerator, IdentityGenerationParam } from '../identity-id.generator';

/**
 * Cryptographically secure identity ID generator for production use
 * 
 * Uses UUID v4 to ensure:
 * - Global uniqueness across devices and users
 * - Cryptographic security (122 bits of entropy)
 * - Non-predictability (impossible to guess next ID)
 * - Standard compliance (RFC 4122)
 */
export class UUIDIdentitIdGenerator implements IdentityIdGenerator {
  /**
   * Generate a cryptographically secure, globally unique identity ID
   * 
   * @param _param Parameters for identity generation (not used in secure implementation)
   * @returns A globally unique, secure identity ID with 'identity_' prefix
   * 
   * @example
   * const id = generator.generate({ nickname: "alice" });
   * // Returns: "identity_f47ac10b-58cc-4372-a567-0e02b2c3d479"
   */
  generate(_param: IdentityGenerationParam): string {
    const uuid = uuidv4();
    return `identity_${uuid}`;
  }
}
