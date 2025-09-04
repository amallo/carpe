/**
 * Generic iOS Keychain storage implementation
 * Provides secure storage using react-native-keychain with generic password approach
 */
export class IOSKeychainStorage {
    private readonly keychainService: string;

    constructor(keychainService: string = 'com.carpeapp.default') {
        this.keychainService = keychainService;
    }

    /**
     * Store data securely in iOS Keychain using generic password
     * @param service - The service identifier for the data
     * @param data - The data to store (will be JSON stringified)
     */
    async store<T>(service: string, data: T): Promise<void> {
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
                service, // username = service identifier
                dataString, // password = our data
                {
                    service: `${this.keychainService}.${service}`,
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
     * @param service - The service identifier for the data
     * @returns The stored data or null if none exists
     */
    async retrieve<T>(service: string): Promise<T | null> {
        try {
            const Keychain = require('react-native-keychain');

            const credentials = await Keychain.getGenericPassword({
                service: `${this.keychainService}.${service}`,
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

    /**
     * Remove data from iOS Keychain
     * @param service - The service identifier for the data
     */
    async remove(service: string): Promise<void> {
        try {
            const Keychain = require('react-native-keychain');

            await Keychain.resetGenericPassword({
                service: `${this.keychainService}.${service}`,
            });
        } catch (error) {
            // Ignore error if item doesn't exist
            if (error instanceof Error && error.message.includes('not found')) {
                return;
            }
            console.error('iOS Keychain remove error:', error);
            throw new Error(`Failed to remove data from iOS Keychain: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
