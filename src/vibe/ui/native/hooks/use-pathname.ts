import { usePathname as useExpoPathname } from "expo-router";

/**
 * Platform-agnostic usePathname hook for React Native
 * Uses Expo Router usePathname
 */
export function usePathname(): string {
  return useExpoPathname();
}
