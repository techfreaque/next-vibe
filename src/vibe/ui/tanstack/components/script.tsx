import type { JSX } from "react";
import { createElement, useSyncExternalStore } from "react";

interface ScriptProps {
  id?: string;
  src?: string;
  type?: string;
  strategy?: string;
  dangerouslySetInnerHTML?: { __html: string };
  children?: string;
}

const subscribe = (): (() => void) => () => undefined;
const clientSnapshot = (): boolean => false;
const serverSnapshot = (): boolean => true;

/** Bootstrap scripts run from the HTML delivered before hydration. */
export function Script({
  id,
  src,
  type,
  dangerouslySetInnerHTML,
  children,
}: ScriptProps): JSX.Element | null {
  const isInitialDocument = useSyncExternalStore(
    subscribe,
    clientSnapshot,
    serverSnapshot,
  );
  if (!src && !isInitialDocument) {
    return null;
  }
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
