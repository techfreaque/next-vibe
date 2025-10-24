import * as React from "react";
import { Text as RNText } from "react-native";

import { cn } from "../lib/utils";

// Native: Use Text component (inline text in React Native)
export const Span = React.forwardRef<
  React.ElementRef<typeof RNText>,
  React.ComponentPropsWithoutRef<typeof RNText>
>(({ className, ...props }, ref) => (
  <RNText
    ref={ref}
    className={cn("text-base text-foreground", className)}
    {...props}
  />
));

Span.displayName = "Span";

