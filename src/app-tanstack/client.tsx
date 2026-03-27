import { Await, RouterProvider } from "@tanstack/react-router";
import { hydrateStart } from "@tanstack/react-start/client";
import { TSR_DEFERRED_PROMISE } from "@tanstack/router-core";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

hydrateStart()
  .then(async (router) => {
    const { preloadAllWidgets } =
      await import("@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/widget-preloader");
    await Promise.all([
      ...router.state.matches.flatMap((match) => {
        const route =
          router.routesByPath[match.routeId] ??
          router.routesById[match.routeId];
        return [route?.lazyFn?.(), route?.options?.component?.preload?.()];
      }),
      preloadAllWidgets(),
    ]);

    // React 19's trackUsedThenable checks thenable.status first:
    //   "fulfilled" → returns thenable.value synchronously (no suspend)
    //   anything else → suspends, causing a blank flash during hydration
    // Stamping status="fulfilled" + value makes React.use() resolve instantly.
    const syncThenable = {
      status: "fulfilled" as const,
      value: router,
      then() {},
      [TSR_DEFERRED_PROMISE]: { status: "success" as const, data: router },
    };

    hydrateRoot(
      document,
      <StrictMode>
        <Await promise={syncThenable}>
          {(r) => <RouterProvider router={r} />}
        </Await>
      </StrictMode>,
    );
    return undefined;
  })
  .catch((err: Error) => {
    console.error("[client] hydration failed:", err);
  });
