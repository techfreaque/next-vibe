/* eslint-disable @next/next/no-head-element -- platform-agnostic HTML wrapper, not a Next.js page */
/* eslint-disable oxlint-plugin-jsx-capitalization/jsx-capitalization -- platform-agnostic HTML wrapper */
import { HeadContent } from "@tanstack/react-router";
import type { JSX, ReactNode } from "react";

export interface HeadProps {
  children: ReactNode;
}

/**
 * Blocking inline script that applies the stored theme class to <html> before
 * first paint. Appends the theme class at the END so the order matches what
 * next-themes produces after hydration (remove + add always appends last).
 */
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("theme")||"system";var d=document.documentElement;if(t==="system")t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";d.classList.remove("light","dark");d.classList.add(t);}catch(e){}})()`;

/**
 * Platform-agnostic Head wrapper component (TanStack Start implementation).
 * Injects HeadContent so TanStack Router can inject CSS links, meta tags,
 * and dev-mode styles into the document head.
 */
export function Head({ children }: HeadProps): JSX.Element {
  return (
    <head>
      {/* eslint-disable-next-line react/no-danger -- blocking inline script must run before stylesheet to prevent FOUC */}
      <script
        dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
        suppressHydrationWarning
      />
      <HeadContent />
      {children}
    </head>
  );
}
