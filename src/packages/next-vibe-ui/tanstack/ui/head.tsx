/* eslint-disable @next/next/no-head-element -- platform-agnostic HTML wrapper, not a Next.js page */
/* eslint-disable oxlint-plugin-jsx-capitalization/jsx-capitalization -- platform-agnostic HTML wrapper */
import { HeadContent } from "@tanstack/react-router";
import type { JSX, ReactNode } from "react";

export interface HeadProps {
  children: ReactNode;
}

/**
 * Blocking inline script that applies the stored theme class to <html> before
 * first paint — same approach Next.js uses. Must run in <head> so the browser
 * executes it synchronously before rendering any body content.
 *
 * Mirrors the logic from next-themes' inline script (attribute="class",
 * storageKey="theme", defaultTheme="system", enableSystem=true).
 */
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("theme")||"system";var d=document.documentElement;if(t==="system")t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";d.classList.remove("light","dark");d.classList.add(t);d.style.colorScheme=t;}catch(e){}})()`;

/**
 * Platform-agnostic Head wrapper component (TanStack Start implementation).
 * Injects HeadContent so TanStack Router can inject CSS links, meta tags,
 * and dev-mode styles into the document head.
 * Also injects a blocking theme script so the correct dark/light class is
 * applied before first paint, preventing a flash of wrong theme.
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
