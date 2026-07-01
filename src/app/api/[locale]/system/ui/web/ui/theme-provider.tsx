"use client";

import type { ThemeProviderProps as NextThemesProviderProps } from "next-themes";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { setCookie } from "next-vibe/ui/web/lib/cookies";
import { storage } from "next-vibe/ui/web/lib/storage";
import type { StyleType } from "next-vibe/ui/web/utils/style-type";
import React, { type JSX, useEffect, useState } from "react";

export const THEME_COOKIE_NAME = "theme_v2";

/** Mirrors the resolved theme to a non-expiring cookie so SSR can read it.
 *  Cookie is the single source of truth; localStorage is kept in sync. */
function ThemeCookieSync(): null {
  const { resolvedTheme, setTheme } = useTheme();
  useEffect(() => {
    // Sanitize legacy "system" value in localStorage
    void storage.getItem("theme_v2").then((stored) => {
      if (stored !== null && stored !== "light" && stored !== "dark") {
        setTheme("dark");
      }
      return undefined;
    });
    if (!resolvedTheme) {
      return;
    }
    // Keep cookie and localStorage in sync - cookie wins on SSR, localStorage is just next-themes' internal state
    void setCookie(THEME_COOKIE_NAME, resolvedTheme);
    void storage.setItem("theme_v2", resolvedTheme);
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
  storageKey = "theme_v2",
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
