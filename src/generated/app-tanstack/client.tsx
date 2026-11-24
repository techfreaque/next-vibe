// Must stay the first import - installs polyfills + DOM guard before app modules evaluate.
// oxlint-disable-next-line import/no-unassigned-import
import "./client-bootstrap";

import type { AnyRouter } from "@tanstack/react-router";
import { Await, RouterProvider } from "@tanstack/react-router";
import { hydrateStart } from "@tanstack/react-start/client";
import { TSR_DEFERRED_PROMISE } from "@tanstack/router-core";
import { getPageLocale } from "next-vibe/logger/browser-startup-error";
import { createClientLogger } from "next-vibe/logger/client";
import { reportRenderError } from "next-vibe/logger/report-render-error";
import { preloadAllLazyWidgets } from "next-vibe/unified-ui/_shared/lazy-widget";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

hydrateStart()
  .then(async (router) => {
    await Promise.all([
      ...router.state.matches.flatMap((match) => {
        const route =
          router.routesByPath[match.routeId] ??
          router.routesById[match.routeId];
        return [route?.lazyFn?.(), route?.options?.component?.preload?.()];
      }),
      preloadAllLazyWidgets(),
    ]);

    // React 19's trackUsedThenable checks thenable.status first:
    //   "fulfilled" → returns thenable.value synchronously (no suspend)
    //   anything else → suspends, causing a blank flash during hydration
    // Stamping status="fulfilled" + value on a real Promise makes React.use()
    // resolve instantly without suspending.
    const syncPromise: Promise<AnyRouter> = Object.assign(
      Promise.resolve(router),
      {
        status: "fulfilled" as const,
        value: router,
        [TSR_DEFERRED_PROMISE]: { status: "success" as const, data: router },
      },
    );

    hydrateRoot(
      document,
      <StrictMode>
        <Await promise={syncPromise}>
          {(r) => <RouterProvider router={r} />}
        </Await>
      </StrictMode>,
      {
        // Hydration mismatches React recovers from by re-rendering on the
        // client: invisible except for a console line, but they mean SSR and
        // client disagree (stale chunk, translator extension, Date/locale).
        onRecoverableError: (error, errorInfo): void => {
          if (error instanceof Error) {
            reportRenderError({
              logger: createClientLogger(false, getPageLocale()),
              boundary: "hydrateRoot.onRecoverableError",
              error,
              componentStack: errorInfo.componentStack ?? null,
            });
          }
          // eslint-disable-next-line no-console
          console.error(error);
        },
      },
    );
    return undefined;
  })
  .catch((err: Error) => {
    // eslint-disable-next-line no-console
    console.error("[client] hydration failed:", err);
    // The page stays as dead SSR HTML - nothing is interactive.
    reportRenderError({
      logger: createClientLogger(false, getPageLocale()),
      boundary: "hydrateStart",
      error: err instanceof Error ? err : new Error(String(err)),
    });
  });
