/**
 * ThemeProvider Component for React Native
 * Uses NativeWind's color scheme management
 */
import type { ReactNode } from "react";
import React from "react";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: "light" | "dark" | "system";
  storageKey?: string;
}

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
  // No need for additional context or state management
  return <>{children}</>;
}
