"use client";

import type { ThemeProviderProps as NextThemesProviderProps } from "next-themes";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import React, { type JSX, useEffect, useSyncExternalStore } from "react";

import { useLogger } from "../hooks/use-logger";
import { setCookie } from "../lib/cookies";
import { storage } from "../lib/storage";
import type { StyleType } from "../utils/style-type";

export const THEME_COOKIE_NAME = "theme_v2";

/** Theme choice: an explicit mode, or "system" to follow the OS setting. */
export type ThemePreference = "light" | "dark" | "system";

function isThemePreference(
  value: string | null | undefined,
): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

/** Mirrors the theme CHOICE (light/dark/system) to a non-expiring cookie so
 *  SSR can read it. next-themes owns localStorage; the head script resolves
 *  "system" via prefers-color-scheme before first paint. */
function ThemeCookieSync(): null {
  const { theme, setTheme } = useTheme();
  const logger = useLogger();
  useEffect(() => {
    // Sanitize unknown legacy values in localStorage
    void storage.getItem(THEME_COOKIE_NAME, logger).then((stored) => {
      if (stored !== null && !isThemePreference(stored)) {
        setTheme("dark");
      }
      return undefined;
    });
    if (!isThemePreference(theme)) {
      return;
    }
    void setCookie(THEME_COOKIE_NAME, theme, logger);
  }, [theme, setTheme, logger]);
  return null;
}

export type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: ThemePreference;
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
      enableSystem={true}
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
  /** Resolved theme actually shown (system already mapped to light/dark). */
  theme: "light" | "dark";
  /** The stored choice, including "system". */
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  isMounted: boolean;
}

const noopSubscribe = (): (() => void) => () => undefined;

// false during SSR + hydration, true on the client afterwards
function useIsMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export function useThemeToggle(): UseThemeToggleReturn {
  const { setTheme, resolvedTheme, theme: storedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? "dark" : "light";
  const preference: ThemePreference = isThemePreference(storedTheme)
    ? storedTheme
    : theme;
  const isMounted = useIsMounted();

  function onToggleTheme(): void {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return {
    onToggleTheme,
    theme,
    preference,
    setPreference: setTheme,
    isMounted,
  };
}
