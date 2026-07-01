import type { HtmlProps } from "next-vibe/ui/web/ui/html";
import type { JSX } from "react";

export type { HtmlProps } from "next-vibe/ui/web/ui/html";

// CLI: no HTML document wrapper - passthrough children
export function Html({ children, lang }: HtmlProps): JSX.Element {
  void lang;
  return <>{children}</>;
}
