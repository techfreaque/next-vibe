import { Scripts as TanstackScripts } from "@tanstack/react-router";
import type { JSX } from "react";

/**
 * TanStack Start implementation of Scripts.
 * Injects the client-side hydration scripts required by TanStack Start SSR.
 */
export function Scripts(): JSX.Element {
  return <TanstackScripts />;
}
