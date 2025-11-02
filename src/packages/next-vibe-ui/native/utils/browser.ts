/**
 * Platform-agnostic browser utilities (Native implementation)
 */

import { Linking } from "react-native";

/**
 * Get current URL
 * On native, there's no traditional URL - return empty or app-specific identifier
 */
export function getCurrentUrl(): string {
  return "app://native";
}

/**
 * Get referrer URL
 * Not applicable on native
 */
export function getReferrer(): string {
  return "";
}

/**
 * Get user agent
 * React Native doesn't have traditional user agent
 */
export function getUserAgent(): string {
  return "React Native";
}

/**
 * Open URL (for mailto, tel, external links, etc.)
 * Uses React Native Linking API
 */
export function openUrl(url: string): void {
  Linking.openURL(url).catch(() => {
    // Silently handle URL opening failures
  });
}
