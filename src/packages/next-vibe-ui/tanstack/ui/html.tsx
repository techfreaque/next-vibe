/* eslint-disable oxlint-plugin-jsx-capitalization/jsx-capitalization -- platform-agnostic HTML wrapper */
import type { JSX, ReactNode } from "react";

import type { StyleType } from "../../web/utils/style-type";

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
    // eslint-disable-next-line jsx-a11y/html-has-lang -- lang is optional at root shell level, set on $locale route
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
