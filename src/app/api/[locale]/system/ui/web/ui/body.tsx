import type { StyleType } from "next-vibe/ui/web/utils/style-type";
import type { JSX, ReactNode } from "react";

export type BodyProps = {
  children: ReactNode;
} & StyleType;

/**
 * Platform-agnostic Body wrapper component (Web implementation)
 * Wraps Next.js <body> tag with platform-agnostic interface
 */
export function Body({ children, className, style }: BodyProps): JSX.Element {
  return (
    <body className={className} style={style}>
      {children}
    </body>
  );
}
