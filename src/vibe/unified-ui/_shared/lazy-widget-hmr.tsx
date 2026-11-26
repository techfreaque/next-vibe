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
  // A prewarmed widget starts on the direct path. HMR intentionally replaces
  // the mounted implementation through state.
  const [current, setCurrent] = useState(() => {
    const component = state.resolved;
    return {
      promise: component ? null : getModulePromise(),
      component: component ?? state.lazy,
    };
  });
  const registeredRef = useRef(false);

  useEffect(() => {
    if (registeredRef.current) {
      return;
    }
    registeredRef.current = true;
    ensureGlobals();

    const onUpdate: UpdateCallback = (Component): void => {
      setCurrent({ promise: null, component: Component });
    };
    const registration = (async (): Promise<(() => void) | null> => {
      const mod = (await factory()) as WidgetModule;

      const moduleId: string | undefined =
        (mod.__vibeWidgetModuleId as string | undefined) ??
        (mod.default as AnyComponent & { __vibeWidgetModuleId?: string })
          .__vibeWidgetModuleId;

      if (!moduleId) {
        return null;
      }

      const byFile = globalThis.__vibeWidgetByFile;
      if (!byFile) {
        return null;
      }

      if (!byFile.has(moduleId)) {
        byFile.set(moduleId, new Set());
      }

      byFile.get(moduleId)!.add(onUpdate);
      return (): void => {
        byFile.get(moduleId)?.delete(onUpdate);
      };
    })();

    return (): void => {
      void registration.then((cleanup) => cleanup?.());
    };
  }, [factory]);

  // Choose the mounted path once. The promise resolving must not insert or
  // remove a component layer around a widget that is already mounted.
  const child = current.promise
    ? React.createElement(ResolvedWidget, {
        promise: current.promise,
        widgetProps,
      })
    : React.createElement(current.component, widgetProps);
  return React.createElement(React.Suspense, { fallback: null }, child);
}
