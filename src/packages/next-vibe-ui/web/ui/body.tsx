import type { JSX, ReactNode } from "react";

export interface BodyProps {
  children: ReactNode;
  className?: string;
}

/**
 * Platform-agnostic Body wrapper component (Web implementation)
 * Wraps Next.js <body> tag with platform-agnostic interface
 */
export function Body({ children, className }: BodyProps): JSX.Element {
  return <body className={className}>{children}</body>;
}
