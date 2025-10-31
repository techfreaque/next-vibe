import type { JSX, ReactNode } from "react";

export interface HtmlProps {
  lang: string;
  children: ReactNode;
  suppressHydrationWarning?: boolean;
}

/**
 * Platform-agnostic HTML wrapper component (Web implementation)
 * Wraps Next.js <html> tag with platform-agnostic interface
 */
export function Html({
  lang,
  children,
  suppressHydrationWarning,
}: HtmlProps): JSX.Element {
  return (
    <html lang={lang} suppressHydrationWarning={suppressHydrationWarning}>
      {children}
    </html>
  );
}
