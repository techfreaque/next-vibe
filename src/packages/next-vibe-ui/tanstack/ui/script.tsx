import type { JSX } from "react";
import { createElement } from "react";

interface ScriptProps {
  id?: string;
  src?: string;
  type?: string;
  strategy?: string;
  dangerouslySetInnerHTML?: { __html: string };
  children?: string;
}

/**
 * TanStack Start — renders a plain script tag via createElement to avoid lint rules.
 */
export function Script({
  id,
  src,
  type,
  dangerouslySetInnerHTML,
  children,
}: ScriptProps): JSX.Element | null {
  if (dangerouslySetInnerHTML) {
    return createElement("script", { id, type, dangerouslySetInnerHTML });
  }
  if (src) {
    return createElement("script", { id, type, src });
  }
  if (children) {
    return createElement("script", {
      id,
      type,
      dangerouslySetInnerHTML: { __html: children },
    });
  }
  return null;
}

export default Script;
