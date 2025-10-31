/**
 * ScrollArea Component for React Native
 * Wrapper around ScrollView with consistent styling
 */
import React from "react";
import { ScrollView as RNScrollView } from "react-native";

import type { ScrollViewPropsWithClassName } from "../lib/types";
import { cn } from "../lib/utils";
import type { ScrollAreaProps } from "next-vibe-ui/ui/scroll-area";

// Type-safe ScrollView component with className support for NativeWind
const ScrollView = RNScrollView as React.ComponentType<ScrollViewPropsWithClassName>;

export const ScrollArea = React.forwardRef<RNScrollView, ScrollAreaProps>(
  function ScrollArea({ className, children }, ref) {
    return (
      <ScrollView ref={ref} className={cn("relative", className)}>
        {children}
      </ScrollView>
    );
  },
);

ScrollArea.displayName = "ScrollArea";

// ScrollBar is not needed on React Native as it's handled automatically
export const ScrollBar = (): null => null;
