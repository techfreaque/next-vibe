import * as React from "react";

// Web: Just a regular span element
export const Span = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>((props, ref) => <span ref={ref} {...props} />);

Span.displayName = "Span";
