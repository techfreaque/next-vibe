/* eslint-disable @next/next/no-head-element -- platform-agnostic HTML wrapper, not a Next.js page */
import type { JSX, ReactNode } from "react";

export interface HeadProps {
  children: ReactNode;
}

// Mirrors next-themes' inline script (attribute="class", storageKey="theme",
// defaultTheme="dark", enableSystem=false). Must run before any stylesheet
// so the correct dark/light class is on <html> before first paint.
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t="dark";}var d=document.documentElement;d.classList.remove("light","dark");d.classList.add(t);d.style.colorScheme=t;}catch(e){}})()`;

/**
 * Platform-agnostic Head wrapper component (Web implementation)
 * Wraps HTML <head> tag with platform-agnostic interface
 */
export function Head({ children }: HeadProps): JSX.Element {
  return (
    <head>
      {/* eslint-disable-next-line react/no-danger -- blocking inline script must run before stylesheet to prevent FOUC */}
      <script
        dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
        suppressHydrationWarning
      />
      {children}
    </head>
  );
}
