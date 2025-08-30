import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './persistence.config';

/**
 * Utility functions for identity persistence debugging and testing
 * App-layer utilities that handle AsyncStorage and redux-persist specifics
 */
export class IdentityPersistenceUtils {
  /**
   * Get the raw persisted identity data from AsyncStorage
   */
  static async getRawPersistedData(): Promise<any> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.REDUX_PERSIST);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading persisted identity data:', error);
      return null;
    }
  }

  /**
   * Clear persisted identity data (useful for testing or logout)
   */
  static async clearPersistedData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.REDUX_PERSIST);
      console.log('Persisted identity data cleared');
    } catch (error) {
      console.error('Error clearing persisted identity data:', error);
    }
  }

  /**
   * Check if there is persisted identity data
   */
  static async hasPersistedData(): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.REDUX_PERSIST);
      return data !== null;
    } catch (error) {
      console.error('Error checking persisted identity data:', error);
      return false;
    }
  }

  /**
   * Get all AsyncStorage keys (for debugging)
   */
  static async getAllStorageKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting storage keys:', error);
      return [];
    }
  }

  /**
   * Debug function to log current persisted state
   */
  static async debugPersistedState(): Promise<void> {
    console.log('=== Identity Persistence Debug ===');
    
    const hasData = await this.hasPersistedData();
    console.log('Has persisted data:', hasData);
    
    if (hasData) {
      const rawData = await this.getRawPersistedData();
      console.log('Raw persisted data:', rawData);
    }
    
    const allKeys = await this.getAllStorageKeys();
    console.log('All storage keys:', allKeys.filter(key => key.includes('persist')));
    
    console.log('================================');
  }
}
