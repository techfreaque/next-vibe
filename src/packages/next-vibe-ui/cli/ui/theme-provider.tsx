import * as React from "react";

export type {
  ThemeProviderProps,
  UseThemeToggleReturn,
} from "../../web/ui/theme-provider";

export const THEME_COOKIE_NAME = "theme_v2";

import type {
  ThemeProviderProps,
  UseThemeToggleReturn,
} from "../../web/ui/theme-provider";

export function ThemeProvider({
  children,
}: ThemeProviderProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function useThemeToggle(): UseThemeToggleReturn {
  return {
    onToggleTheme: (): void => undefined,
    theme: "dark",
    isMounted: true,
  };
}
