/**
 * React Native implementation of useIsMobile hook
 *
 * On React Native, we consider all devices as "mobile" since
 * React Native is primarily for mobile platforms (iOS/Android).
 * For tablets, we could check dimensions, but for simplicity
 * we return true for all React Native platforms.
 */
import { Platform } from "react-native";

/**
 * Hook to detect if the current device is mobile
 * @returns Always true on React Native (iOS/Android), false on web
 */
export function useIsMobile(): boolean {
  // On React Native, we're always on a mobile device
  // (iOS or Android). On web, we'd need to check window size,
  // but that's handled by the web version of this hook.
  return Platform.OS === "ios" || Platform.OS === "android";
}
