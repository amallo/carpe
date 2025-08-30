import { AsyncStorageProvider } from '../async-storage.provider';

/**
 * In-memory AsyncStorage implementation for testing
 * Stores data in memory, data is lost when the instance is destroyed
 */
export class InMemoryAsyncStorageProvider implements AsyncStorageProvider {
  private storage = new Map<string, string>();

  async getItem(key: string): Promise<string | null> {
    return this.storage.get(key) || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.storage.delete(key);
  }

  async clear(): Promise<void> {
    this.storage.clear();
  }

  async getAllKeys(): Promise<string[]> {
    return Array.from(this.storage.keys());
  }

  // Additional testing utilities
  
  /**
   * Get the current size of the storage (number of items)
   * Useful for testing purposes
   */
  getStorageSize(): number {
    return this.storage.size;
  }

  /**
   * Get a snapshot of all stored data
   * Useful for debugging and testing
   */
  getStorageSnapshot(): Record<string, string> {
    return Object.fromEntries(this.storage);
  }

  /**
   * Check if a key exists in storage
   * Useful for testing purposes
   */
  hasKey(key: string): boolean {
    return this.storage.has(key);
  }

  /**
   * Reset the storage to empty state
   * Useful for test cleanup
   */
  reset(): void {
    this.storage.clear();
  }
}
