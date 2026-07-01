import { styled } from "nativewind";
import { convertCSSToViewStyle } from "next-vibe/ui/native/utils/style-converter";
import type { NavProps } from "next-vibe/ui/web/ui/nav";
import { applyStyleType } from "next-vibe/ui/web/utils/style-type";
import * as React from "react";
import { View } from "react-native";

// Type-safe View with className support (NativeWind)
const StyledView = styled(View);

/**
 * Platform-agnostic Nav component for native
 * On native, this is a View component (semantic nav element doesn't exist in RN)
 * Provides consistent API across platforms
 * Supports both className (via NativeWind) and style (via React.CSSProperties)
 */
export function Nav({
  children,
  className,
  style,
  id,
}: NavProps): React.JSX.Element {
  // Convert CSS style to React Native ViewStyle if provided
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <StyledView
      {...applyStyleType({
        nativeStyle,
        className,
      })}
      nativeID={id}
    >
      {children}
    </StyledView>
  );
}
