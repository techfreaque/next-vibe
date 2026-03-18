import NextScript from "next/script";
import type { JSX } from "react";

interface ScriptProps {
  id?: string;
  src?: string;
  type?: string;
  strategy?: "beforeInteractive" | "afterInteractive" | "lazyOnload" | "worker";
  dangerouslySetInnerHTML?: { __html: string };
  children?: string;
}

/**
 * Web (Next.js) implementation — wraps next/script.
 */
export function Script(props: ScriptProps): JSX.Element {
  return <NextScript {...props} />;
}
