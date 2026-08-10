import type { JSX } from "react";

import type { HtmlProps } from "../../web/components/html";

export type { HtmlProps } from "../../web/components/html";

// CLI: no HTML document wrapper - passthrough children
export function Html({ children, lang }: HtmlProps): JSX.Element {
  void lang;
  return <>{children}</>;
}
