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
      <HeadContent />
      {children}
    </head>
  );
}
