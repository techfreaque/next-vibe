import { styled } from "nativewind";
import { convertCSSToViewStyle } from "next-vibe/ui/native/utils/style-converter";
import type { SectionProps } from "next-vibe/ui/web/ui/section";
import { applyStyleType } from "next-vibe/ui/web/utils/style-type";
import * as React from "react";
import { View } from "react-native";

// Type-safe View with className support (NativeWind)
const StyledView = styled(View);

/**
 * Platform-agnostic Section component for native
 * On native, this is a View component (semantic sections don't exist in RN)
 * Provides consistent API across platforms
 * Supports both className (via NativeWind) and style (via React.CSSProperties)
 */
export function Section({
  children,
  className,
  style,
  id,
}: SectionProps): React.JSX.Element {
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
