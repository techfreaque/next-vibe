import type { JSX, ReactNode } from "react";
import type { StyleType } from "../utils/style-type";

export type HtmlProps = {
  lang: string;
  children: ReactNode;
  suppressHydrationWarning?: boolean;
} & StyleType;

/**
 * Platform-agnostic HTML wrapper component (Web implementation)
 * Wraps Next.js <html> tag with platform-agnostic interface
 */
export function Html({
  lang,
  children,
  className,
  style,
  suppressHydrationWarning,
}: HtmlProps): JSX.Element {
  return (
    <html
      lang={lang}
      className={className}
      style={style}
      suppressHydrationWarning={suppressHydrationWarning}
    >
      {children}
    </html>
  );
}
