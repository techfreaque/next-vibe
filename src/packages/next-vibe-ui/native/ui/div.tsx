import type { ViewRef } from "@rn-primitives/types";
import * as React from "react";
import { View, type ViewProps } from "react-native";

import { cn } from "../lib/utils";

/**
 * Platform-agnostic Div component for React Native
 * On native, this is a View component with NativeWind className support
 * Alias for View to provide more traditional web naming
 */
export const Div = React.forwardRef<
  ViewRef,
  ViewProps & { className?: string }
>(({ className, ...props }, ref) => (
  <View ref={ref} className={cn(className)} {...props} />
));

Div.displayName = "Div";
