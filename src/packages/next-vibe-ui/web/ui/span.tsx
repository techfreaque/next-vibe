import * as React from "react";

// Cross-platform props interface - only shared props
export interface SpanProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  style?: React.CSSProperties;
}

// Web: Just a regular span element
export const Span = React.forwardRef<HTMLSpanElement, SpanProps>(
  (props, ref) => <span ref={ref} {...props} />
);

Span.displayName = "Span";
