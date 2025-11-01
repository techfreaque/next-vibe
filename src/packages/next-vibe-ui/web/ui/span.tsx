import * as React from "react";

// Cross-platform props interface
// Extends both web span props and allows React Native Text props
export interface SpanProps
  extends Omit<React.ComponentPropsWithoutRef<"span">, "ref"> {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  nativeID?: string; // Native-specific, optional for web (maps to id)
  style?: React.CSSProperties;
}

// Web: Just a regular span element
export const Span = React.forwardRef<HTMLSpanElement, SpanProps>(
  (props, ref) => <span ref={ref} {...props} />
);

Span.displayName = "Span";
