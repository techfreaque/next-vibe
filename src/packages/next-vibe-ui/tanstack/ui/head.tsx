// oxlint-disable nextjs/no-head-element
import { HeadContent } from "@tanstack/react-router";
import type { JSX, ReactNode } from "react";

export interface HeadProps {
  children: ReactNode;
}

export function Head({ children }: HeadProps): JSX.Element {
  return (
    <head>
      {process.env.NODE_ENV === "development" && (
        <>
          {/* Synchronous placeholder so $RefreshReg$/$RefreshSig$ exist before
              any module scripts execute. Without this, the first page load after
              server start races: component modules can run before the async
              /@react-refresh import resolves, hitting "can't detect preamble". */}
          <script
            dangerouslySetInnerHTML={{
              __html: `window.$RefreshReg$ = () => {};window.$RefreshSig$ = () => (type) => type;`,
            }}
            suppressHydrationWarning
          />
          {/* eslint-disable-next-line react/no-danger -- Vite HMR + React Fast Refresh preamble required in dev */}
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
        </>
      )}
      <HeadContent />
      {children}
    </head>
  );
}
