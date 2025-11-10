/**
 * ScrollArea Component for React Native
 * Wrapper around ScrollView with consistent styling
 */
import React from "react";
import { ScrollView } from "react-native";
import { styled } from "nativewind";

import { cn } from "next-vibe/shared/utils/utils";
import type {
  ScrollAreaProps,
  ScrollAreaRootProps,
  ScrollAreaViewportProps,
  ScrollAreaBarProps,
  ScrollAreaThumbProps,
  ScrollAreaCornerProps,
  ScrollBarProps,
} from "@/packages/next-vibe-ui/web/ui/scroll-area";

// Re-export all types from web
export type {
  ScrollAreaProps,
  ScrollAreaRootProps,
  ScrollAreaViewportProps,
  ScrollAreaBarProps,
  ScrollAreaThumbProps,
  ScrollAreaCornerProps,
  ScrollBarProps,
};

// Type-safe ScrollView with className support (NativeWind)
const StyledScrollView = styled(ScrollView);

export function ScrollArea({
  className,
  children,
}: ScrollAreaProps): React.JSX.Element {
  return (
    <StyledScrollView className={cn("relative", className)}>
      {children}
    </StyledScrollView>
  );
}

ScrollArea.displayName = "ScrollArea";

// ScrollBar is not needed on React Native as it's handled automatically
export function ScrollBar(): null {
  return null;
}
