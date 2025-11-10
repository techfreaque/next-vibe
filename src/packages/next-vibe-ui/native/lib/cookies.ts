/**
 * React Native implementation of client-side storage using AsyncStorage
 * Provides same async interface as web version for platform consistency
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Get a cookie value by name (uses AsyncStorage for native)
 * @param name - The cookie name
 * @returns Promise resolving to the value or null if not found
 */
export async function getCookie(name: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(name);
  } catch {
    return null;
  }
}

/**
 * Set a cookie (uses AsyncStorage for native)
 * @param name - The cookie name
 * @param value - The value to set
 */
export async function setCookie(name: string, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(name, value);
  } catch {
    // Silent error handling
  }
}

/**
 * Delete a cookie (uses AsyncStorage for native)
 * @param name - The cookie name to remove
 */
export async function deleteCookie(name: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(name);
  } catch {
    // Silent error handling
  }
}

/**
 * Get all cookies as an object (uses AsyncStorage for native)
 * @returns Promise resolving to an object with names and values
 */
export async function getAllCookies(): Promise<Record<string, string>> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cookies: Record<string, string> = {};

    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        cookies[key] = value;
      }
    }

    return cookies;
  } catch {
    return {};
  }
}
