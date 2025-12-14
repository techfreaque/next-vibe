import { styled } from "nativewind";
import * as React from "react";
import { View } from "react-native";

import type { HrProps } from "@/packages/next-vibe-ui/web/ui/hr";

import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle } from "../utils/style-converter";

// Type-safe View with className support (NativeWind)
const StyledView = styled(View);

/**
 * Platform-agnostic Hr component for native
 * On native, this is rendered as a horizontal View with border
 * Provides a horizontal rule/separator
 * Supports both className (via NativeWind) and style (via React.CSSProperties)
 */
export function Hr({
  className,
  style,
  id,
}: HrProps): React.JSX.Element {
  // Convert CSS style to React Native ViewStyle if provided
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <StyledView
      {...applyStyleType({
        nativeStyle,
        className: `border-b border-gray-300 ${className || ""}`.trim(),
      })}
      nativeID={id}
    />
  );
}
