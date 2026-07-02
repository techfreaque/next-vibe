import { styled } from "nativewind";
import * as React from "react";
import { View } from "react-native";

import { convertCSSToViewStyle } from "../../native/utils/style-converter";
import type { TrProps } from "../../web/ui/tr";
import { applyStyleType } from "../../web/utils/style-type";

// Type-safe View with className support (NativeWind)
const StyledView = styled(View);

/**
 * Platform-agnostic Tr component for native
 * On native, this is a View component (table tr doesn't exist in RN)
 * Part of the table component structure
 * Supports both className (via NativeWind) and style (via React.CSSProperties)
 */
export function Tr({
  children,
  className,
  style,
  id,
}: TrProps): React.JSX.Element {
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
