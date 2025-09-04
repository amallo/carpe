import { Storage } from '../storage';
/**
 * Generic iOS Keychain storage implementation
 * Provides secure storage using react-native-keychain with generic password approach
 */
export class IOSKeychainStorage<T> implements Storage<T> {
    private readonly keychainService: string;

    constructor(keychainService: string) {
        this.keychainService = keychainService;
    }

    getServiceName(): string {
        return this.keychainService;
    }

    /**
     * Store data securely in iOS Keychain using generic password
     * @param key - The service identifier for the data
     * @param data - The data to store (will be JSON stringified)
     */
    async store(key: string, data: T): Promise<void> {
        try {
            const Keychain = require('react-native-keychain');

            // Create data structure with timestamp
            const dataWithMetadata = {
                data,
                timestamp: new Date().toISOString(),
            };

            // Convert to JSON string
            const dataString = JSON.stringify(dataWithMetadata);

            // Use simple generic password storage
            await Keychain.setGenericPassword(
                key, // username = service identifier
                dataString, // password = our data
                {
                    service: `${this.keychainService}.${key}`,
                    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
                }
            );
        } catch (error) {
            console.error('iOS Keychain store error:', error);
            throw new Error(`Failed to store data in iOS Keychain: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Retrieve data from iOS Keychain
     * @param key - The service identifier for the data
     * @returns The stored data or null if none exists
     */
    async retrieve(key: string): Promise<T | null> {
        try {
            const Keychain = require('react-native-keychain');

            const credentials = await Keychain.getGenericPassword({
                service: `${this.keychainService}.${key}`,
            });

            if (!credentials || !credentials.password) {
                return null;
            }

            // Parse the stored JSON data
            const storedData = JSON.parse(credentials.password);

            return storedData.data;
        } catch (error) {
            // If the key doesn't exist or there's an authentication error, return null
            if (error instanceof Error && (
                error.message.includes('not found') ||
                error.message.includes('No credentials stored')
            )) {
                return null;
            }
            console.error('iOS Keychain retrieve error:', error);
            throw new Error(`Failed to retrieve data from iOS Keychain: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
