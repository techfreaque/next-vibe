import * as React from "react";
import { View } from "react-native";
import { styled } from "nativewind";

import type { NavProps } from "@/packages/next-vibe-ui/web/ui/nav";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { applyStyleType } from "../../web/utils/style-type";

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
