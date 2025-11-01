import * as React from "react";
import type { ViewProps } from "react-native";
import { View } from "react-native";

type ViewRef = React.ElementRef<typeof View>;

import { cn } from "../lib/utils";

// Cross-platform props interface - use ViewProps directly
// Note: className is added via nativewind-env.d.ts module augmentation
export type DivProps = ViewProps & {
  className?: string;
};

/**
 * Platform-agnostic Div component for React Native
 * On native, this is a View component with NativeWind className support
 * Alias for View to provide more traditional web naming
 */
export const Div = React.forwardRef<ViewRef, DivProps>(
  ({ className, ...props }, ref) => {
    // Merge className into props for NativeWind processing
    const mergedProps = {
      ...props,
      className: cn(className),
    };
    return <View ref={ref} {...mergedProps} />;
  }
);

Div.displayName = "Div";
