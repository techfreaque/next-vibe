/**
 * ThemeProvider Component for React Native
 * Uses NativeWind's color scheme management
 */
import React from "react";

// Import ALL types from web - ZERO definitions here
import type { ThemeProviderProps } from "@/packages/next-vibe-ui/web/ui/theme-provider";

/**
 * ThemeProvider for React Native
 *
 * NativeWind handles theme management automatically through its useColorScheme hook.
 * This component is a simple wrapper that just renders children.
 * The actual theme switching is handled by NativeWind's built-in functionality.
 */
export function ThemeProvider({
  children,
}: ThemeProviderProps): React.JSX.Element {
  // NativeWind handles theme management automatically
  // No need to implement theme switching logic here
  return <>{children}</>;
}
