"use client";

import type { ThemeProviderProps as NextThemesProviderProps } from "next-themes";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import React, { type JSX } from "react";

// Cross-platform interface - essential props only
export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: "light" | "dark" | "system";
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  attribute = "class",
  ...props
}: ThemeProviderProps &
  Omit<NextThemesProviderProps, keyof ThemeProviderProps>): JSX.Element {
  return (
    <NextThemesProvider
      defaultTheme={defaultTheme}
      enableSystem={true}
      disableTransitionOnChange={true} // Disable transitions to prevent flashing
      storageKey={storageKey}
      attribute={attribute}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
