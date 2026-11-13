import * as React from "react";

export type {
  ThemePreference,
  ThemeProviderProps,
  UseThemeToggleReturn,
} from "../../web/components/theme-provider";

export const THEME_COOKIE_NAME = "theme_v2";

import type {
  ThemeProviderProps,
  UseThemeToggleReturn,
} from "../../web/components/theme-provider";

export function ThemeProvider({
  children,
}: ThemeProviderProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function useThemeToggle(): UseThemeToggleReturn {
  return {
    onToggleTheme: (): void => undefined,
    theme: "dark",
    preference: "dark",
    setPreference: (): void => undefined,
    isMounted: true,
  };
}
