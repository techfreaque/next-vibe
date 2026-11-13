import React, { useSyncExternalStore } from "react";
import { Appearance, useColorScheme, View } from "react-native";

import { cn } from "../../../unified-ui/_shared/cn";

/** Mirrors the web constant - no cookie in React Native but exported for interface parity */
export const THEME_COOKIE_NAME = "theme_v2";

import type {
  ThemePreference,
  ThemeProviderProps,
  UseThemeToggleReturn,
} from "../../web/components/theme-provider";
import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle, styledNative } from "../utils/style-converter";

const StyledView = styledNative(View);

export function ThemeProvider({
  children,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
  defaultTheme = "system", // Intentionally extracted - not used in React Native, uses system color scheme
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
  storageKey = "theme_v2", // Intentionally extracted - not used in React Native, uses system color scheme
  className,
  style,
}: ThemeProviderProps): React.JSX.Element {
  const colorScheme = useColorScheme();
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <StyledView
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "will-change-variable",
          colorScheme === "dark" ? "dark" : "",
          className,
        ),
      })}
    >
      {children}
    </StyledView>
  );
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

function setPreference(preference: ThemePreference): void {
  Appearance.setColorScheme(
    preference === "system" ? "unspecified" : preference,
  );
}

export function useThemeToggle(): UseThemeToggleReturn {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const isMounted = useIsMounted();

  function onToggleTheme(): void {
    Appearance.setColorScheme(theme === "dark" ? "light" : "dark");
  }

  return {
    onToggleTheme,
    theme,
    // RN exposes no "is following OS" flag; the resolved scheme is the best
    // available reflection of the choice.
    preference: theme,
    setPreference,
    isMounted,
  };
}
