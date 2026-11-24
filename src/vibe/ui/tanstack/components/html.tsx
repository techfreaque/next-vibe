/* eslint-disable oxlint-plugin-jsx-capitalization/jsx-capitalization -- platform-agnostic HTML wrapper */
import type { JSX } from "react";

import type { HtmlProps } from "../../web/components/html";

export type { HtmlProps } from "../../web/components/html";

/**
 * Platform-agnostic HTML wrapper component (TanStack Start implementation)
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
    >
      {children}
    </html>
  );
}
