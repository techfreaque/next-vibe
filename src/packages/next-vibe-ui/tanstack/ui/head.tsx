import { HeadContent } from "@tanstack/react-router";
import type { JSX, ReactNode } from "react";

// Import globals.css as an inline string so Vite renders it as a <style> tag
// on both SSR and client — avoiding the <link>→<style> swap that causes flash.
import globalCSS from "@/app/[locale]/globals.css?inline";

export interface HeadProps {
  children: ReactNode;
}

/**
 * Platform-agnostic Head wrapper component (TanStack Start implementation).
 * Injects HeadContent so TanStack Router can inject CSS links, meta tags,
 * and dev-mode styles into the document head.
 *
 * Theme class is set server-side on <html> via getCookie("theme") in the root
 * layout loader — no inline script needed.
 */
export function Head({ children }: HeadProps): JSX.Element {
  return (
    <head>
      {process.env.NODE_ENV === "development" && (
        /* eslint-disable-next-line react/no-danger -- Vite HMR + React Fast Refresh preamble required in dev */
        <script
          type="module"
          dangerouslySetInnerHTML={{
            __html: [
              `import "/@vite/client";`,
              `import { injectIntoGlobalHook } from "/@react-refresh";`,
              `injectIntoGlobalHook(window);`,
              `window.$RefreshReg$ = () => {};`,
              `window.$RefreshSig$ = () => (type) => type;`,
            ].join("\n"),
          }}
          suppressHydrationWarning
        />
      )}
      {/* Inline CSS directly so SSR and client both have a <style> tag —
          no <link>→<style> swap, no flash. HeadContent still handles meta/title/etc. */}
      <style dangerouslySetInnerHTML={{ __html: globalCSS }} />
      <HeadContent />
      {children}
    </head>
  );
}
