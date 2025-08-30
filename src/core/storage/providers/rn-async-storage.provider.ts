import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStorageProvider } from './async-storage.provider';

/**
 * React Native AsyncStorage implementation
 * Uses @react-native-async-storage/async-storage for persistent storage
 */
export class RNAsyncStorageProvider implements AsyncStorageProvider {
  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Failed to get item with key "${key}":`, error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Failed to set item with key "${key}":`, error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove item with key "${key}":`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Failed to clear AsyncStorage:', error);
      throw error;
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Failed to get all keys from AsyncStorage:', error);
      return [];
    }
  }
}
