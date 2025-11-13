import * as React from "react";

// Cross-platform props interface
// Extends both web span props and allows React Native Text props
export interface SpanProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
}

// Web: Just a regular span element
export function Span(props: SpanProps): React.JSX.Element {
  return <span {...props} />;
}
