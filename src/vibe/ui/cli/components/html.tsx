import type { JSX } from "react";

import type { HtmlProps } from "../../web/ui/html";

export type { HtmlProps } from "../../web/ui/html";

// CLI: no HTML document wrapper - passthrough children
export function Html({ children, lang }: HtmlProps): JSX.Element {
  void lang;
  return <>{children}</>;
}
