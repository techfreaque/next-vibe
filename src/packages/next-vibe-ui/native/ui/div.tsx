import * as React from "react";
import type { ViewProps } from "react-native";
import { View } from "react-native";

import { cn } from "next-vibe/shared/utils/utils";

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
export function Div({ className, ...props }: DivProps): React.JSX.Element {
  // Merge className into props for NativeWind processing
  const mergedProps = {
    ...props,
    className: cn(className),
  };
  return <View {...mergedProps} />;
}

Div.displayName = "Div";
