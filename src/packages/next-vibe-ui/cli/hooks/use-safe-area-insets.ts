/**
 * CLI: No safe area insets in terminal. Returns 0 for all sides.
 */
export interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export function useSafeAreaInsets(): SafeAreaInsets {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };
}
