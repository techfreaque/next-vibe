import { styled } from "nativewind";
import { cn } from "next-vibe/shared/utils/utils";
import React, { useEffect, useState } from "react";
import { Appearance, useColorScheme, View } from "react-native";

import type {
  ThemeProviderProps,
  UseThemeToggleReturn,
} from "@/packages/next-vibe-ui/web/ui/theme-provider";

import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle } from "../utils/style-converter";

const StyledView = styled(View, { className: "style" });

export function ThemeProvider({
  children,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
  defaultTheme = "system", // Intentionally extracted - not used in React Native, uses system color scheme
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
  storageKey = "theme", // Intentionally extracted - not used in React Native, uses system color scheme
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

export function useThemeToggle(): UseThemeToggleReturn {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? "dark" : "light";
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  function onToggleTheme(): void {
    Appearance.setColorScheme(theme === "dark" ? "light" : "dark");
  }

  return {
    onToggleTheme,
    theme,
    isMounted,
  };
}
