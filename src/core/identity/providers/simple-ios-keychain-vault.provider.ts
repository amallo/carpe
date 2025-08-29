import { VaultProvider } from './vault.provider';
import { KeyPair } from '../generators/key.generator';

/**
 * Simple iOS Keychain implementation of VaultProvider
 * Uses basic setGenericPassword instead of setInternetCredentials for better compatibility
 */
export class SimpleIOSKeychainVaultProvider implements VaultProvider {
    private readonly keychainService: string;

    constructor(keychainService: string = 'com.carpeapp.identity') {
        this.keychainService = keychainService;
    }

    /**
     * Save a key pair securely in iOS Keychain using generic password
     * @param service - The service identifier for the key pair
     * @param keyPair - The key pair to save
     */
    async saveKeyPair(service: string, keyPair: KeyPair): Promise<void> {
        try {
            const Keychain = require('react-native-keychain');
            
            // Create a combined data structure for both keys
            const keyData = {
                publicKey: keyPair.publicKey,
                privateKey: keyPair.privateKey,
                timestamp: new Date().toISOString(),
            };

            // Convert to JSON string
            const keyDataString = JSON.stringify(keyData);

            // Use simple generic password storage
            await Keychain.setGenericPassword(
                service, // username = service identifier
                keyDataString, // password = our key data
                {
                    service: `${this.keychainService}.${service}`,
                    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
                }
            );
        } catch (error) {
            console.error('Simple Keychain save error details:', error);
            throw new Error(`Failed to save key pair to iOS Keychain: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Retrieve the stored key pair from iOS Keychain
     * @param service - The service identifier for the key pair
     * @returns The stored key pair or null if none exists
     */
    async getKeyPair(service: string): Promise<KeyPair | null> {
        try {
            const Keychain = require('react-native-keychain');
            
            const credentials = await Keychain.getGenericPassword({
                service: `${this.keychainService}.${service}`,
            });

            if (!credentials || !credentials.password) {
                return null;
            }

            // Parse the stored JSON data
            const keyData = JSON.parse(credentials.password);
            
            return {
                publicKey: keyData.publicKey,
                privateKey: keyData.privateKey,
            };
        } catch (error) {
            // If the key doesn't exist or there's an authentication error, return null
            if (error instanceof Error && (
                error.message.includes('not found') || 
                error.message.includes('No credentials stored')
            )) {
                return null;
            }
            console.error('Simple Keychain get error details:', error);
            throw new Error(`Failed to retrieve key pair from iOS Keychain: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Check if a key pair exists in iOS Keychain
     * @param service - The service identifier for the key pair
     * @returns True if a key pair is stored
     */
    async hasKeyPair(service: string): Promise<boolean> {
        try {
            const keyPair = await this.getKeyPair(service);
            return keyPair !== null;
        } catch (error) {
            return false;
        }
    }

    /**
     * Delete the stored key pair from iOS Keychain
     * @param service - The service identifier for the key pair
     */
    async deleteKeyPair(service: string): Promise<void> {
        try {
            const Keychain = require('react-native-keychain');
            
            await Keychain.resetGenericPassword({
                service: `${this.keychainService}.${service}`,
            });
        } catch (error) {
            // Ignore errors if the key doesn't exist
            if (error instanceof Error && (
                error.message.includes('not found') ||
                error.message.includes('No credentials stored')
            )) {
                return;
            }
            console.error('Simple Keychain delete error details:', error);
            throw new Error(`Failed to delete key pair from iOS Keychain: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
