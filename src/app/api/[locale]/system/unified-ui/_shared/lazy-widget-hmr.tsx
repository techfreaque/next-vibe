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

// A promise stamped with status="fulfilled" by React's thenable tracking.
type FulfilledPromise<T> = Promise<T> & { status: "fulfilled"; value: T };

function isFulfilled<T>(p: Promise<T>): p is FulfilledPromise<T> {
  return (p as FulfilledPromise<T>).status === "fulfilled";
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

  // Fast path: component already resolved (prior render, preload(), or HMR update).
  // Render directly — no Suspense, no async wait. This is the hot path for every
  // request after the first SSR cold-start and for all hydrated client renders.
  if (state.resolved !== null) {
    return React.createElement(state.resolved, widgetProps);
  }

  const currentPromise = modulePromiseRef.current;

  // If the promise is already fulfilled (React stamps .status on resolved thenables),
  // extract the value and render synchronously — avoids Suspense entirely.
  // (state.resolved is set by the .then() in getOrCreateModulePromise, so this
  // branch is only hit in the same render cycle where the promise just resolved.)
  if (currentPromise !== null && isFulfilled(currentPromise)) {
    return React.createElement(currentPromise.value, widgetProps);
  }

  // Async path: promise is pending (first SSR cold-start or not yet preloaded).
  // React.use() inside Suspense suspends until the promise resolves.
  // React streaming waits inline before flushing this boundary's HTML.
  if (currentPromise !== null) {
    return React.createElement(
      React.Suspense,
      { fallback: null },
      React.createElement(ResolvedWidget, {
        promise: currentPromise,
        widgetProps,
      }),
    );
  }

  // Fallback: no promise (drizzle-kit or non-Vite context).
  return React.createElement(
    React.Suspense,
    { fallback: null },
    React.createElement(lazyRef.current, widgetProps),
  );
}
