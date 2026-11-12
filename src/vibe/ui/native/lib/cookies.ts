/**
 * React Native implementation of client-side storage using AsyncStorage
 * Provides same async interface as web version for platform consistency
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

import { reportStorageFailure } from "../../../logger/storage-failure";
import type { EndpointLogger } from "../../../logger/types";

/**
 * Get a cookie value by name (uses AsyncStorage for native)
 * @param name - The cookie name
 * @returns Promise resolving to the value or null if not found
 */
export async function getCookie(
  name: string,
  logger: EndpointLogger,
): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(name);
  } catch (error) {
    reportStorageFailure(logger, {
      platform: "native",
      area: "asyncStorage",
      operation: "get",
      key: name,
      error: error instanceof Error ? error : String(error),
    });
    return null;
  }
}

/**
 * Set a cookie (uses AsyncStorage for native)
 * @param name - The cookie name
 * @param value - The value to set
 */
export async function setCookie(
  name: string,
  value: string,
  logger: EndpointLogger,
): Promise<void> {
  try {
    await AsyncStorage.setItem(name, value);
  } catch (error) {
    reportStorageFailure(logger, {
      platform: "native",
      area: "asyncStorage",
      operation: "set",
      key: name,
      error: error instanceof Error ? error : String(error),
      valueLength: value.length,
    });
  }
}

/**
 * Delete a cookie (uses AsyncStorage for native)
 * @param name - The cookie name to remove
 */
export async function deleteCookie(
  name: string,
  logger: EndpointLogger,
): Promise<void> {
  try {
    await AsyncStorage.removeItem(name);
  } catch (error) {
    reportStorageFailure(logger, {
      platform: "native",
      area: "asyncStorage",
      operation: "remove",
      key: name,
      error: error instanceof Error ? error : String(error),
    });
  }
}

/**
 * Get all cookies as an object (uses AsyncStorage for native)
 * @returns Promise resolving to an object with names and values
 */
export async function getAllCookies(
  logger: EndpointLogger,
): Promise<Record<string, string>> {
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
  } catch (error) {
    reportStorageFailure(logger, {
      platform: "native",
      area: "asyncStorage",
      operation: "list",
      key: null,
      error: error instanceof Error ? error : String(error),
    });
    return {};
  }
}

// ─── Sync raw cookie access (Native: no-op, no document.cookie) ───────────────

export function getRawCookieString(): string {
  return ""; // no document.cookie on native
}

export function setRawCookieString(value: string): void {
  void value;
}
