/**
 * Interface for async storage providers
 * Defines the contract for storing key-value pairs asynchronously
 */
export interface AsyncStorageProvider {
  /**
   * Get an item from storage
   * @param key The key to retrieve
   * @returns Promise resolving to the stored value or null if not found
   */
  getItem(key: string): Promise<string | null>;

  /**
   * Set an item in storage
   * @param key The key to store
   * @param value The value to store
   * @returns Promise resolving when the item is stored
   */
  setItem(key: string, value: string): Promise<void>;

  /**
   * Remove an item from storage
   * @param key The key to remove
   * @returns Promise resolving when the item is removed
   */
  removeItem(key: string): Promise<void>;

  /**
   * Clear all items from storage
   * @returns Promise resolving when storage is cleared
   */
  clear(): Promise<void>;

  /**
   * Get all keys from storage (optional)
   * @returns Promise resolving to an array of all keys
   */
  getAllKeys?(): Promise<string[]>;
}
