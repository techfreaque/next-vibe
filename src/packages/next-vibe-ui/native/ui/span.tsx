import * as React from "react";
import { Text as RNText } from "react-native";

import type { SpanProps } from "next-vibe-ui/ui/span";
import { cn } from "../lib/utils";

// Type-safe Text with className support (NativeWind)
const StyledText = RNText as unknown as React.ForwardRefExoticComponent<
  SpanProps & React.RefAttributes<React.ElementRef<typeof RNText>>
>;

// Native: Use Text component (inline text in React Native)
export const Span = React.forwardRef<React.ElementRef<typeof RNText>, SpanProps>(
  ({ className, ...props }, ref) => (
    <StyledText
      ref={ref}
      {...({
        className: cn("text-base text-foreground", className),
        ...props,
      } as any)}
    />
  )
);

Span.displayName = "Span";
