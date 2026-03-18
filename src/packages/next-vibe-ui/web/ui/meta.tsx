import type { JSX } from "react";

export interface MetaProps {
  charSet?: string;
  name?: string;
  content?: string;
  httpEquiv?: string;
}

/**
 * Platform-agnostic Meta wrapper component (Web implementation)
 * Wraps HTML <meta> tag with platform-agnostic interface
 */
export function Meta({
  charSet,
  name,
  content,
  httpEquiv,
}: MetaProps): JSX.Element {
  return (
    <meta
      charSet={charSet}
      name={name}
      content={content}
      httpEquiv={httpEquiv}
    />
  );
}
