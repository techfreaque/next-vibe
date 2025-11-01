/**
 * ScrollArea Component for React Native
 * Wrapper around ScrollView with consistent styling
 */
import React from "react";
import type { ScrollViewProps } from "react-native";
import { ScrollView } from "react-native";

import { cn } from "../lib/utils";
import type { ScrollAreaProps } from "next-vibe-ui/ui/scroll-area";

// Type-safe ScrollView with className support (NativeWind)
const StyledScrollView = ScrollView as unknown as React.ForwardRefExoticComponent<
  ScrollViewProps & { className?: string } & React.RefAttributes<ScrollView>
>;

export const ScrollArea = React.forwardRef<ScrollView, ScrollAreaProps>(
  function ScrollArea({ className, children }, ref) {
    return (
      <StyledScrollView ref={ref} className={cn("relative", className)}>
        {children}
      </StyledScrollView>
    );
  },
);

ScrollArea.displayName = "ScrollArea";

// ScrollBar is not needed on React Native as it's handled automatically
export const ScrollBar = (): null => null;
