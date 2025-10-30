/**
 * Platform Helpers for React Native
 *
 * Provides utilities for creating platform-specific implementations
 * and handling differences between Next.js and React Native
 */

import { Platform } from "react-native";

/**
 * Check if running on native platform (iOS/Android)
 */
export const isNative = Platform.OS === "ios" || Platform.OS === "android";

/**
 * Check if running on web platform
 */
export const isWeb = Platform.OS === "web";

/**
 * Platform-specific value selector
 * @example
 * const fontSize = platformSelect({ native: 16, web: 14 })
 */
export function platformSelect<T>(values: { native: T; web: T }): T {
  return isNative ? values.native : values.web;
}

/**
 * Stub for Next.js metadata - not used in React Native
 * Use this to satisfy TypeScript when sharing page components
 */
export const generateMetadata = undefined;

/**
 * Helper to conditionally import Next.js specific modules
 * Returns undefined on native platforms
 */
export async function importNextModule<T>(
  importFn: () => Promise<T>,
): Promise<T | undefined> {
  if (isWeb) {
    return await importFn();
  }
  return undefined;
}

/**
 * Mock Next.js Link component for React Native
 * Falls back to TouchableOpacity with navigation
 */
export { Link } from "expo-router";

/**
 * Type guard for checking if code is running in React Native
 */
export function assertNative(): asserts this is typeof isNative {
  if (!isNative) {
    // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Platform guard assertion requires throwing for incorrect platform
    throw new Error("This code should only run on native platforms");
  }
}

/**
 * Type guard for checking if code is running on web
 */
export function assertWeb(): asserts this is typeof isWeb {
  if (!isWeb) {
    // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- Platform guard assertion requires throwing for incorrect platform
    throw new Error("This code should only run on web platform");
  }
}

/**
 * Create a page wrapper for React Native
 * This is a simple identity function for compatibility
 */
export function createPageWrapper<T>(component: T): T {
  return component;
}
