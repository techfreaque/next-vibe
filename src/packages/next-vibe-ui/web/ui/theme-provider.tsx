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
  ...props
}: ThemeProviderProps & Omit<NextThemesProviderProps, keyof ThemeProviderProps>): JSX.Element {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem={true}
      disableTransitionOnChange={true} // Disable transitions to prevent flashing
      storageKey={storageKey}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
