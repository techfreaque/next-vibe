"use client";

/**
 * Client-only HMR wrapper for lazyWidget.
 *
 * Uses React.use() + Suspense to load lazy widgets uniformly on both server
 * and client. The modulePromise is created lazily on first render (not at
 * module init time, to avoid circular import issues during Vite module graph
 * initialization). It is cached on state so SSR and client hydration share
 * the same promise — React.use() deduplicates by promise identity, ensuring
 * both sides render the same output and hydration succeeds.
 */

import React, { use, useEffect, useRef, useState } from "react";

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
    modulePromise: Promise<AnyComponent> | null;
  };
  factory: () => Promise<{ default: AnyComponent }>;
  getModulePromise: () => Promise<AnyComponent> | null;
}

// Inner component: calls use() to suspend until promise resolves.
// Must be inside a <Suspense> boundary.
function ResolvedWidget({
  promise,
  widgetProps,
}: {
  promise: Promise<AnyComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- dispatch-boundary
  widgetProps: any;
}): React.ReactElement {
  const Component = use(promise);
  return React.createElement(Component, widgetProps);
}

export function HmrWrapper({
  widgetProps,
  state,
  factory,
  getModulePromise,
}: HmrWrapperProps): React.ReactElement {
  // On first render, getModulePromise() creates and caches the promise on state.
  // Subsequent renders (and client hydration) get the same cached instance.
  const modulePromiseRef = useRef(getModulePromise());
  const lazyRef = useRef(state.lazy);
  const registeredRef = useRef(false);
  const [, setTick] = useState(0);

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

      if (!moduleId) {
        return;
      }

      const byFile = globalThis.__vibeWidgetByFile;
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
        modulePromiseRef.current = Promise.resolve(Component);
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

  // The rendered tree shape must be IDENTICAL on server and client no matter
  // which side resolved the module first. Suspense boundaries are part of the
  // hydration structure (the server emits <!--$--> markers), so the old
  // "skip Suspense when already resolved" fast path produced
  // server=<Suspense> vs client=<component> whenever one side was warm and
  // the other cold — the recurring hydration-mismatch error on every widget
  // page. A Suspense that never suspends adds no DOM and costs nothing, so
  // every path now renders through the same boundary; only the child differs
  // (component types are not part of DOM matching).
  const currentPromise = modulePromiseRef.current;
  let child: React.ReactElement;
  if (state.resolved !== null) {
    // Warm path: resolved via prior render, preload(), or HMR update.
    child = React.createElement(state.resolved, widgetProps);
  } else if (currentPromise !== null) {
    // Pending path: use() suspends until the module resolves. On the server,
    // streaming waits inline before flushing this boundary's HTML; on the
    // client during hydration, React defers hydrating just this boundary.
    child = React.createElement(ResolvedWidget, {
      promise: currentPromise,
      widgetProps,
    });
  } else {
    // No promise available (drizzle-kit or non-Vite context).
    child = React.createElement(lazyRef.current, widgetProps);
  }
  return React.createElement(React.Suspense, { fallback: null }, child);
}
