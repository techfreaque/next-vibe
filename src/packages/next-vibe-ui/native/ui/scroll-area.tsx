/**
 * ScrollArea Component for React Native
 * Wrapper around ScrollView with consistent styling
 */
import type { ReactNode } from "react";
import React from "react";
import type { ScrollViewProps } from "react-native";
import { ScrollView } from "react-native";

import { cn } from "../lib/utils";

interface ScrollAreaProps extends ScrollViewProps {
  children: ReactNode;
  className?: string;
}

export const ScrollArea = React.forwardRef<ScrollView, ScrollAreaProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <ScrollView ref={ref} className={cn("relative", className)} {...props}>
        {children}
      </ScrollView>
    );
  },
);

ScrollArea.displayName = "ScrollArea";

// ScrollBar is not needed on React Native as it's handled automatically
export const ScrollBar = (): null => null;
