/**
 * Platform-agnostic useSafeAreaInsets hook for web
 * On web, safe area insets are typically 0 (no notches or home indicators)
 */
export interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export function useSafeAreaInsets(): SafeAreaInsets {
  // On web, we don't have safe area insets like mobile devices
  // Return 0 for all sides
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };
}
