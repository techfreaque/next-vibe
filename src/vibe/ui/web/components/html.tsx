import type { JSX, ReactNode } from "react";

import type { StyleType } from "../utils/style-type";

export type HtmlProps = {
  lang?: string;
  dir?: "ltr" | "rtl" | "auto";
  children: ReactNode;
  suppressHydrationWarning?: boolean;
} & StyleType;

/**
 * Platform-agnostic HTML wrapper component (Web implementation)
 * Wraps Next.js <html> tag with platform-agnostic interface
 */
export function Html({
  lang,
  dir,
  children,
  className,
  style,
  suppressHydrationWarning,
}: HtmlProps): JSX.Element {
  return (
    <html
      lang={lang}
      dir={dir}
      className={className}
      style={style}
      suppressHydrationWarning={suppressHydrationWarning}
      data-scroll-behavior="smooth"
    >
      {children}
    </html>
  );
}
