"use client";

/**
 * Client-only HMR wrapper for lazyWidget.
 *
 * This file is "use client" so hooks are allowed. It handles the Vite dev
 * hot-reload subscription: when window.__vibeWidgetHmr fires, it swaps the
 * React.lazy reference and forces a re-render via useState.
 *
 * In Next.js (both dev and prod) this file is rendered as a Client Component.
 * In Vite dev this provides the HMR subscription so widget.tsx changes
 * update the UI without a full reload.
 */

import React, { useEffect, useRef, useState } from "react";

import type { UpdateCallback } from "./lazy-widget";
import { ensureGlobals } from "./lazy-widget";

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- dispatch-boundary
type AnyComponent = React.ComponentType<any>;
type WidgetModule = {
  default: AnyComponent;
  __vibeWidgetModuleId?: string;
} & Record<string, AnyComponent | string | undefined>;

interface HmrWrapperProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- dispatch-boundary
  widgetProps: any;
  state: {
    lazy: ReturnType<typeof React.lazy<AnyComponent>>;
    resolved: AnyComponent | null;
  };
  factory: () => Promise<{ default: AnyComponent }>;
}

export function HmrWrapper({
  widgetProps,
  state,
  factory,
}: HmrWrapperProps): React.ReactElement {
  const [, setTick] = useState(0);
  // resolvedRef tracks the eagerly-preloaded component. On the server (SSR) this
  // is populated by lazyWidget.preload() before rendering, giving us full SSR HTML
  // with no Suspense gap. On the client it stays set until an HMR update fires.
  const resolvedRef = useRef(state.resolved);
  const lazyRef = useRef(state.lazy);
  const registeredRef = useRef(false);

  useEffect(() => {
    if (registeredRef.current) {
      return;
    }
    registeredRef.current = true;
    ensureGlobals();

    let cleanup: (() => void) | null = null;

    void (async (): Promise<void> => {
      const mod = (await factory()) as WidgetModule;

      const moduleId: string | undefined =
        (mod.__vibeWidgetModuleId as string | undefined) ??
        (mod.default as AnyComponent & { __vibeWidgetModuleId?: string })
          .__vibeWidgetModuleId;

      if (!moduleId || typeof window === "undefined") {
        return;
      }

      const byFile = window.__vibeWidgetByFile;
      if (!byFile) {
        return;
      }

      if (!byFile.has(moduleId)) {
        byFile.set(moduleId, new Set());
      }

      const onUpdate: UpdateCallback = (Component): void => {
        const freshLazy = React.lazy(
          (): Promise<{ default: AnyComponent }> =>
            Promise.resolve({ default: Component }),
        );
        lazyRef.current = freshLazy;
        // Clear resolved so HMR update switches to the fresh lazy component
        resolvedRef.current = null;
        setTick((n) => n + 1);
      };

      byFile.get(moduleId)!.add(onUpdate);
      cleanup = (): void => {
        byFile.get(moduleId)?.delete(onUpdate);
      };
    })();

    return (): void => {
      cleanup?.();
    };
  }, [factory, state]);

  // If the component was preloaded (SSR path or first client render before HMR),
  // render it directly - no Suspense, no streaming gap, no flash.
  const Resolved = resolvedRef.current;
  if (Resolved) {
    return React.createElement(Resolved, widgetProps);
  }

  // Fallback: lazy with Suspense - used when preload() was not called before render
  // (non-SSR pages, or after HMR clears resolvedRef).
  return React.createElement(
    React.Suspense,
    { fallback: null },
    React.createElement(lazyRef.current, widgetProps),
  );
}
