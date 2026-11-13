import type { JSX, ReactNode } from "react";

export interface HeadProps {
  children: ReactNode;
}

// Mirrors next-themes' inline script (attribute="class", storageKey="theme_v2",
// defaultTheme="dark", enableSystem=true). Must run before any stylesheet
// so the correct dark/light class is on <html> before first paint. "system"
// resolves through prefers-color-scheme.
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("theme_v2");if(t==="system"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}else if(t!=="light"&&t!=="dark"){t="dark";}var d=document.documentElement;d.classList.remove("light","dark");d.classList.add(t);d.style.colorScheme=t;}catch(e){}})()`;

/**
 * Platform-agnostic Head wrapper component (Web implementation)
 * Wraps HTML <head> tag with platform-agnostic interface
 */
export function Head({ children }: HeadProps): JSX.Element {
  return (
    <head>
      <script
        dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
        suppressHydrationWarning
      />
      {children}
    </head>
  );
}
