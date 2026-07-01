/* eslint-disable oxlint-plugin-jsx-capitalization/jsx-capitalization -- platform-agnostic HTML wrapper */
import type { StyleType } from "next-vibe/ui/web/utils/style-type";
import type { JSX, ReactNode } from "react";

export type HtmlProps = {
  lang?: string;
  children: ReactNode;
  suppressHydrationWarning?: boolean;
} & StyleType;

/**
 * Platform-agnostic HTML wrapper component (TanStack Start implementation)
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
