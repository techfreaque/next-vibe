import * as React from "react";
import { View } from "react-native";
import { styled } from "nativewind";

import type { TdProps } from "@/packages/next-vibe-ui/web/ui/td";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { applyStyleType } from "../../web/utils/style-type";

// Type-safe View with className support (NativeWind)
const StyledView = styled(View);

/**
 * Platform-agnostic Td component for native
 * On native, this is a View component (table td doesn't exist in RN)
 * Part of the table component structure
 * Supports both className (via NativeWind) and style (via React.CSSProperties)
 */
export function Td({
  children,
  className,
  style,
  id,
}: TdProps): React.JSX.Element {
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
