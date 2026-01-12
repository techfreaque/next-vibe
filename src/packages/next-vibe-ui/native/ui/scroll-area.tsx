/**
 * ScrollArea Component for React Native
 * Cross-platform wrapper around ScrollView with full web API compatibility
 */
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import { ScrollView } from "react-native";

import type {
  ScrollAreaBarProps,
  ScrollAreaCornerProps,
  ScrollAreaProps,
  ScrollAreaRootProps,
  ScrollAreaThumbProps,
  ScrollAreaViewportProps,
  ScrollBarProps,
} from "@/packages/next-vibe-ui/web/ui/scroll-area";

import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle, styledNative } from "../utils/style-converter";

// Re-export all types from web for cross-platform compatibility
export type {
  ScrollAreaBarProps,
  ScrollAreaCornerProps,
  ScrollAreaProps,
  ScrollAreaRootProps,
  ScrollAreaThumbProps,
  ScrollAreaViewportProps,
  ScrollBarProps,
};

// Type-safe ScrollView with className support via NativeWind
const StyledScrollView = styledNative(ScrollView);

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
  className,
}: ScrollAreaBarProps): React.JSX.Element {
  void className;
  // React Native handles scrollbars natively - no custom rendering needed
  // Return empty fragment to maintain component contract
  return <></>;
}

ScrollBar.displayName = "ScrollBar";
