import { styled } from "nativewind";
import * as React from "react";
import { View } from "react-native";

import type { TbodyProps } from "@/packages/next-vibe-ui/web/ui/tbody";

import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle } from "../utils/style-converter";

// Type-safe View with className support (NativeWind)
const StyledView = styled(View);

/**
 * Platform-agnostic Tbody component for native
 * On native, this is a View component (table tbody doesn't exist in RN)
 * Part of the table component structure
 * Supports both className (via NativeWind) and style (via React.CSSProperties)
 */
export function Tbody({ children, className, style, id }: TbodyProps): React.JSX.Element {
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
