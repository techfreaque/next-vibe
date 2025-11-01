import * as React from "react";
import type { TextProps } from "react-native";
import { Text as RNText } from "react-native";

import type { SpanProps as WebSpanProps } from "next-vibe-ui/ui/span";
import { cn } from "../lib/utils";

// Native Span extends TextProps (native) with web SpanProps for cross-platform compatibility
export type SpanProps = TextProps & Pick<WebSpanProps, "id"> & {
  className?: string;
};

// Native: Use Text component (inline text in React Native)
export const Span = React.forwardRef<React.ElementRef<typeof RNText>, SpanProps>(
  ({ className, children, id, ...props }, ref) => (
    <RNText
      ref={ref}
      className={cn("text-base text-foreground", className)}
      nativeID={id}
      {...props}
    >
      {children}
    </RNText>
  )
);

Span.displayName = "Span";
