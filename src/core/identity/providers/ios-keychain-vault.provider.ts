import { VaultProvider } from './vault.provider';
import { KeyPair } from '../generators/key.generator';

/**
 * iOS Keychain implementation of VaultProvider
 * Uses iOS Keychain Services for secure storage of cryptographic keys
 */
export class iOSKeychainVaultProvider implements VaultProvider {
    private readonly keychainService: string;
    private readonly keychainAccount: string;

    constructor(keychainService: string = 'com.carpeapp.identity', keychainAccount: string = 'default') {
        this.keychainService = keychainService;
        this.keychainAccount = keychainAccount;
    }

    /**
     * Save a key pair securely in iOS Keychain
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

            // Try to save with basic configuration first
            try {
                await Keychain.setInternetCredentials(
                    `${this.keychainService}.${service}`,
                    this.keychainAccount,
                    keyDataString,
                    {
                        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
                    }
                );
                return;
            } catch (basicError) {
                // If basic save fails, try with even simpler configuration
                await Keychain.setInternetCredentials(
                    `${this.keychainService}.${service}`,
                    this.keychainAccount,
                    keyDataString
                );
            }
        } catch (error) {
            console.error('Keychain save error details:', error);
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
            const credentials = await Keychain.getInternetCredentials(
                `${this.keychainService}.${service}`
            );

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
            if (error instanceof Error && error.message.includes('not found')) {
                return null;
            }
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
            await Keychain.resetInternetCredentials(
                `${this.keychainService}.${service}`
            );
        } catch (error) {
            // Ignore errors if the key doesn't exist
            if (error instanceof Error && error.message.includes('not found')) {
                return;
            }
            throw new Error(`Failed to delete key pair from iOS Keychain: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Clear all stored key pairs for this service
     * Useful for logout or reset scenarios
     */
    async clearAllKeyPairs(): Promise<void> {
        try {
            const Keychain = require('react-native-keychain');
            // Get all stored credentials
            const credentials = await Keychain.getAllInternetCredentials();
            
            // Filter and delete credentials for this service
            for (const credential of credentials) {
                if (credential.service.startsWith(this.keychainService)) {
                    await Keychain.resetInternetCredentials(credential.service);
                }
            }
        } catch (error) {
            throw new Error(`Failed to clear all key pairs from iOS Keychain: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Check if the device supports biometric authentication
     * @returns True if biometric authentication is available
     */
    async isBiometricAvailable(): Promise<boolean> {
        try {
            const Keychain = require('react-native-keychain');const biometryType = await Keychain.getSupportedBiometryType();
            return biometryType !== null;
        } catch (error) {
            return false;
        }
    }

    /**
     * Get the supported biometric type
     * @returns The biometric type or null if not supported
     */
    async getBiometricType(): Promise<string | null> {
        try {
            const Keychain = require('react-native-keychain');return await Keychain.getSupportedBiometryType();
        } catch (error) {
            return null;
        }
    }
}
