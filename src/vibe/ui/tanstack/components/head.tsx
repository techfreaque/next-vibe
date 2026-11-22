// oxlint-disable nextjs/no-head-element
import { HeadContent } from "@tanstack/react-router";
import type { JSX, ReactNode } from "react";

import { Script } from "./script";

export interface HeadProps {
  children: ReactNode;
}

export function Head({ children }: HeadProps): JSX.Element {
  return (
    <head>
      {import.meta.env?.DEV && (
        <>
          {/* Synchronous placeholder so $RefreshReg$/$RefreshSig$ exist before
              any module scripts execute. Without this, the first page load after
              server start races: component modules can run before the async
              /@react-refresh import resolves, hitting "can't detect preamble". */}
          <Script
            dangerouslySetInnerHTML={{
              __html: `window.$RefreshReg$ = () => {};window.$RefreshSig$ = () => (type) => type;`,
            }}
          />
          <Script
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
          />
        </>
      )}
      <HeadContent />
      {children}
    </head>
  );
}
