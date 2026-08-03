/**
 * Helper for lazy-loading CLI widgets in endpoint definitions.
 *
 * Usage in definition.ts:
 *   const MyWidget = lazyWidget(() =>
 *     import("../../platforms/web/rebuild/widget").then((m) => ({ default: m.MyWidget })),
 *   );
 *
 * HMR (Vite dev): The `widget-hmr` Vite plugin injects `import.meta.hot.accept()`
 * into every widget.tsx. The accept handler calls `window.__vibeWidgetHmr` which
 * dispatches to HmrWrapper instances (lazy-widget-hmr.tsx), swapping the
 * React.lazy component and forcing a re-render via a state counter.
 *
 * SSR: This file has no hooks so it is safe to import from React Server
 * Components. The HMR subscription lives in lazy-widget-hmr.tsx ("use client").
 * Client Components render on both server (for SSR HTML) and client (hydration),
 * with hooks running only on the client — exactly what we want.
 *
 * Preloading: all registered factories are collected in `_lazyWidgetRegistry`.
 * Call preloadAllLazyWidgets() before SSR render and before hydrateRoot()
 * so every factory() is resolved and state.resolved is set — eliminating
 * Suspense boundaries during SSR and hydration flashes on the client.
 */

import React from "react";

import { HmrWrapper } from "./lazy-widget-hmr";

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- dispatch-boundary
type AnyComponent = React.ComponentType<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- dispatch-boundary
export type CliComponent = AnyComponent & {
  cliWidget: true;
  preload: () => Promise<void>;
  resolved: AnyComponent | null;
};

export type UpdateCallback = (newDefault: AnyComponent) => void;

declare global {
  var __vibeWidgetHmr:
    | ((moduleId: string, newModule: Record<string, AnyComponent>) => void)
    | undefined;
  var __vibeWidgetByFile: Map<string, Set<UpdateCallback>> | undefined;
}

export function ensureGlobals(): void {
  if (globalThis.__vibeWidgetByFile !== undefined) {
    return;
  }
  globalThis.__vibeWidgetByFile = new Map();
  globalThis.__vibeWidgetHmr = (moduleId, newModule): void => {
    const cbs = globalThis.__vibeWidgetByFile?.get(moduleId);
    if (!cbs) {
      return;
    }
    const Component =
      typeof newModule?.["default"] === "function"
        ? (newModule["default"] as AnyComponent)
        : undefined;
    if (!Component) {
      return;
    }
    for (const cb of cbs) {
      cb(Component);
    }
  };
}

// Registry of all lazyWidget preload functions. Populated at module-eval time
// (factory references only — no imports fired). Call preloadAllLazyWidgets()
// to fire them all.
const _lazyWidgetRegistry: Array<() => Promise<void>> = [];

// Single-flight queue for SERVER-side widget factory imports — the same
// pattern as the generated endpoint/route registries: widget modules pull in
// large cyclic graphs, and CONCURRENT dynamic imports of two such graphs can
// deadlock or fail in the Vite SSR module runner during cold evaluation
// (observed as boot-window 500s with "[SSR onError]" at ResolvedWidget).
// preloadAllLazyWidgets() fires every factory at once, so without this queue
// the server races hundreds of imports on a cold graph. Client-side imports
// are plain chunk fetches with no shared runner — they stay concurrent.
let _serverWidgetImportQueue: Promise<AnyComponent | undefined> =
  Promise.resolve(undefined);

function enqueueServerWidgetImport(
  run: () => Promise<AnyComponent>,
): Promise<AnyComponent> {
  const result = _serverWidgetImportQueue.then(run);
  // Chain regardless of outcome so one failed import never blocks the queue.
  _serverWidgetImportQueue = result.catch(() => undefined);
  return result;
}

/**
 * Fires every registered lazyWidget factory in parallel and awaits resolution.
 * Call this before SSR render (server side) and before hydrateRoot() (client)
 * so all custom widgets are fully resolved — no Suspense, no hydration flash.
 *
 * Safe to call in drizzle-kit context: each factory guards itself with
 * the import.meta.env check.
 */
export function preloadAllLazyWidgets(): Promise<void> {
  return Promise.all(_lazyWidgetRegistry.map((fn) => fn())).then(
    () => undefined,
  );
}

export function lazyWidget(
  factory: () => Promise<{ default: AnyComponent }>,
): CliComponent {
  const state: {
    lazy: ReturnType<typeof React.lazy<AnyComponent>>;
    resolved: AnyComponent | null;
    modulePromise: Promise<AnyComponent> | null;
  } = {
    lazy: React.lazy(factory),
    resolved: null,
    modulePromise: null,
  };

  function getOrCreateModulePromise(): Promise<AnyComponent> | null {
    // drizzle-kit: plain Node.js ESM, no import.meta.env, can't resolve .tsx
    if (import.meta.env === undefined) {
      return null;
    }
    if (state.modulePromise === null) {
      const load = async (): Promise<AnyComponent> => {
        const mod = await factory();
        state.resolved = mod.default;
        return mod.default;
      };
      state.modulePromise =
        typeof window === "undefined"
          ? enqueueServerWidgetImport(load)
          : load();
    }
    return state.modulePromise;
  }

  // Register this widget's preload in the global registry.
  // Only the factory reference is stored here — no import is triggered.
  _lazyWidgetRegistry.push(async () => {
    // Skip in drizzle-kit / plain Node contexts without Vite.
    if (import.meta.env === undefined) {
      return;
    }
    await getOrCreateModulePromise();
  });

  /**
   * Renders the widget via HmrWrapper ("use client").
   *
   * HmrWrapper is a Client Component: it renders on the server for SSR HTML
   * (no hooks run), then hydrates on the client (hooks run, HMR subscribed).
   * This gives us full SSR + streaming + HMR with no hooks in this file.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- dispatch-boundary: widget props vary per endpoint
  function HmrWidget(props: any): React.ReactElement {
    return React.createElement(HmrWrapper, {
      widgetProps: props,
      state,
      factory,
      getModulePromise: getOrCreateModulePromise,
    });
  }

  const widget = Object.assign(HmrWidget, {
    cliWidget: true as const,
    get resolved(): AnyComponent | null {
      return state.resolved;
    },
    set resolved(v: AnyComponent | null) {
      state.resolved = v;
    },
    preload: async (): Promise<void> => {
      const result = await factory();
      state.resolved = result.default;
    },
  });

  return widget as CliComponent;
}
