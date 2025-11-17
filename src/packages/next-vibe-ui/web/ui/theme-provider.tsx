"use client";

import type { ThemeProviderProps as NextThemesProviderProps } from "next-themes";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import React, { type JSX, useEffect, useState } from "react";
import type { StyleType } from "../utils/style-type";

export type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: "light" | "dark" | "system";
  storageKey?: string;
} & StyleType;

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
      disableTransitionOnChange={true}
      storageKey={storageKey}
      attribute={attribute}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

export interface UseThemeToggleReturn {
  onToggleTheme: () => void;
  theme: "light" | "dark";
  isMounted: boolean;
}

export function useThemeToggle(): UseThemeToggleReturn {
  const { setTheme, resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? "dark" : "light";
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  function onToggleTheme(): void {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return {
    onToggleTheme,
    theme,
    isMounted,
  };
}
