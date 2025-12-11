/**
 * Secure Storage Utilities
 * Safe localStorage wrapper with error handling and type safety
 */

import { STORAGE_KEYS } from '../config/constants';

/**
 * User data structure for type safety
 */
export interface StoredUser {
  username: string;
  email: string;
}

/**
 * Safely retrieves an item from localStorage
 * Handles JSON parsing errors and missing keys
 * 
 * @param key - Storage key to retrieve
 * @returns Parsed value or null if not found/invalid
 * 
 * @example
 * getStorageItem('authToken') // Returns: 'jwt-token-string' or null
 */
export const getStorageItem = <T = string>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    // Try to parse as JSON, if it fails return as string
    try {
      return JSON.parse(item) as T;
    } catch {
      return item as T;
    }
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return null;
  }
};

/**
 * Safely stores an item in localStorage
 * Automatically stringifies objects and handles errors
 * 
 * @param key - Storage key
 * @param value - Value to store (string, object, etc.)
 * @returns True if successful, false if storage failed
 * 
 * @example
 * setStorageItem('authToken', 'jwt-token-string')
 * setStorageItem('userData', { username: 'john', email: 'john@example.com' })
 */
export const setStorageItem = <T>(key: string, value: T): boolean => {
  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, stringValue);
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
    return false;
  }
};

/**
 * Clears all application-related data from localStorage
 * Only removes known app keys to avoid affecting other apps
 * 
 * @example
 * clearAppStorage() // Removes authToken and userData
 */
export const clearAppStorage = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing app storage:', error);
  }
};

/**
 * Retrieves stored authentication token
 * 
 * @returns Auth token string or null if not found
 * 
 * @example
 * const token = getAuthToken() // Returns: 'jwt-token' or null
 */
export const getAuthToken = (): string | null => {
  return getStorageItem<string>(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Stores authentication token securely
 * 
 * @param token - JWT or session token
 * @returns True if successful
 * 
 * @example
 * setAuthToken('jwt-token-string')
 */
export const setAuthToken = (token: string): boolean => {
  return setStorageItem(STORAGE_KEYS.AUTH_TOKEN, token);
};

/**
 * Retrieves stored user data with type safety
 * 
 * @returns User object or null if not found
 * 
 * @example
 * const user = getUserData() // Returns: { username: 'john', email: 'john@example.com' }
 */
export const getUserData = (): StoredUser | null => {
  return getStorageItem<StoredUser>(STORAGE_KEYS.USER_DATA);
};

/**
 * Stores user data securely
 * 
 * @param user - User object to store
 * @returns True if successful
 * 
 * @example
 * setUserData({ username: 'john', email: 'john@example.com' })
 */
export const setUserData = (user: StoredUser): boolean => {
  return setStorageItem(STORAGE_KEYS.USER_DATA, user);
};
