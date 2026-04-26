"use client";

import type { ThemeProviderProps as NextThemesProviderProps } from "next-themes";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import React, { type JSX, useEffect, useState } from "react";

import type { StyleType } from "../utils/style-type";

export const THEME_COOKIE_NAME = "theme";

/** Mirrors the resolved theme to a non-expiring cookie so SSR can read it.
 *  Cookie is the single source of truth; localStorage is kept in sync. */
function ThemeCookieSync(): null {
  const { resolvedTheme, setTheme } = useTheme();
  useEffect(() => {
    // Sanitize legacy "system" value in localStorage
    const stored = localStorage.getItem("theme");
    if (stored !== null && stored !== "light" && stored !== "dark") {
      setTheme("dark");
      return;
    }
    if (!resolvedTheme) {
      return;
    }
    // Keep cookie and localStorage in sync — cookie wins on SSR, localStorage is just next-themes' internal state
    document.cookie = `${THEME_COOKIE_NAME}=${resolvedTheme};path=/;max-age=2147483647;SameSite=Lax`;
    localStorage.setItem("theme", resolvedTheme);
  }, [resolvedTheme, setTheme]);
  return null;
}

export type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: "light" | "dark" | "system";
  storageKey?: string;
} & StyleType;

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "theme",
  attribute = "class",
  ...props
}: ThemeProviderProps &
  Omit<NextThemesProviderProps, keyof ThemeProviderProps>): JSX.Element {
  return (
    <NextThemesProvider
      defaultTheme={defaultTheme}
      enableSystem={false}
      disableTransitionOnChange={true}
      storageKey={storageKey}
      attribute={attribute}
      {...props}
    >
      <ThemeCookieSync />
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
