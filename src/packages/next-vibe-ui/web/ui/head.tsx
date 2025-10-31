import type { JSX, ReactNode } from "react";

// Cross-platform props interface
export interface HeadProps {
  children: ReactNode;
}

/**
 * Platform-agnostic Head wrapper component (Web implementation)
 * Wraps Next.js <head> tag with platform-agnostic interface
 */
export function Head({ children }: HeadProps): JSX.Element {
  /* eslint-disable-next-line @next/next/no-head-element */
  return <head>{children}</head>;
}
