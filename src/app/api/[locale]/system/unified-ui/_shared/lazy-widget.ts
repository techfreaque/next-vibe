/**
 * Helper for lazy-loading CLI widgets in endpoint definitions.
 *
 * Usage in definition.ts:
 *   const MyWidget = lazyWidget(() =>
 *     import("./widget").then((m) => ({ default: m.MyWidget })),
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
  if (typeof globalThis.__vibeWidgetByFile !== "undefined") {
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

export function lazyWidget(
  factory: () => Promise<{ default: AnyComponent }>,
): CliComponent {
  const state: {
    lazy: ReturnType<typeof React.lazy<AnyComponent>>;
    resolved: AnyComponent | null;
  } = {
    lazy: React.lazy(factory),
    resolved: null,
  };

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
    });
  }

  // resolved is set by preload() so the CLI EndpointRenderer can render
  // the component directly without hitting Suspense.
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
