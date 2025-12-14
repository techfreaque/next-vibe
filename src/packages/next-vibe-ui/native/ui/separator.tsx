import { styled } from "nativewind";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import { View } from "react-native";

import type { SeparatorRootProps } from "@/packages/next-vibe-ui/web/ui/separator";

import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle } from "../utils/style-converter";

export type { SeparatorRootProps };

// Styled View component using nativewind
const StyledView = styled(View);

/**
 * Separator component for React Native
 * On native, we use a simple View styled with NativeWind instead of @rn-primitives
 * This provides better compatibility and simpler implementation
 */
export function Separator({
  className,
  style,
  orientation = "horizontal",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Web-only props extracted for React Native compatibility
  decorative = true, // Intentionally extracted - not used in React Native
}: SeparatorRootProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <StyledView
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "shrink-0 bg-border",
          orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
          className,
        ),
      })}
    />
  );
}
