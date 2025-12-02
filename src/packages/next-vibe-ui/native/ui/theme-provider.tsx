import React, { useEffect, useState } from "react";
import { styled } from "nativewind";

import type {
  ThemeProviderProps,
  UseThemeToggleReturn,
} from "@/packages/next-vibe-ui/web/ui/theme-provider";
import { View, useColorScheme, Appearance } from "react-native";
import { cn } from "next-vibe/shared/utils/utils";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { applyStyleType } from "../../web/utils/style-type";

const StyledView = styled(View, { className: "style" });

export function ThemeProvider({
  children,
  defaultTheme: _defaultTheme = "system",
  storageKey: _storageKey = "theme",
  className,
  style,
}: ThemeProviderProps): React.JSX.Element {
  const colorScheme = useColorScheme();
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  // Note: defaultTheme and storageKey are ignored on native
  // as React Native uses system color scheme
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
