/**
 * ScrollArea Component for React Native
 * Cross-platform wrapper around ScrollView with full web API compatibility
 */
import * as React from "react";
import { ScrollView } from "react-native";
import { styled } from "nativewind";

import { cn } from "next-vibe/shared/utils/utils";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { applyStyleType } from "../../web/utils/style-type";
import type {
  ScrollAreaProps,
  ScrollAreaRootProps,
  ScrollAreaViewportProps,
  ScrollAreaBarProps,
  ScrollAreaThumbProps,
  ScrollAreaCornerProps,
  ScrollBarProps,
} from "@/packages/next-vibe-ui/web/ui/scroll-area";

// Re-export all types from web for cross-platform compatibility
export type {
  ScrollAreaProps,
  ScrollAreaRootProps,
  ScrollAreaViewportProps,
  ScrollAreaBarProps,
  ScrollAreaThumbProps,
  ScrollAreaCornerProps,
  ScrollBarProps,
};

// Type-safe ScrollView with className support via NativeWind
const StyledScrollView = styled(ScrollView);

/**
 * ScrollArea - Cross-platform scrollable container
 *
 * Accepts all Radix UI ScrollArea.Root props for web compatibility.
 * React Native ScrollView provides native scrolling behavior automatically.
 */
export function ScrollArea({
  className,
  style,
  children,
}: ScrollAreaRootProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  // Map to React Native ScrollView
  // React Native provides native scrolling with automatic scrollbar handling
  return (
    <StyledScrollView
      {...applyStyleType({
        nativeStyle,
        className: cn("relative", className),
      })}
    >
      {children}
    </StyledScrollView>
  );
}

ScrollArea.displayName = "ScrollArea";

/**
 * ScrollBar - Cross-platform scrollbar component
 *
 * On React Native, scrollbars are handled automatically by the OS.
 * This component accepts all web props for API compatibility but renders nothing.
 * The function signature matches web exactly to ensure type safety.
 */
export function ScrollBar({
  className: _className,
  style: _style,
  orientation: _orientation = "vertical",
}: ScrollAreaBarProps): React.JSX.Element {
  // React Native handles scrollbars natively - no custom rendering needed
  // Return empty fragment to maintain component contract
  return <></>;
}

ScrollBar.displayName = "ScrollBar";
