"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { NavigationStackEntry } from "../../shared/types/endpoint";
import type { CreateApiEndpointAny } from "../../shared/types/endpoint-base";
import { endpointToUrlSegment } from "../../shared/utils/path";
import { resolveEndpoint } from "../utils/resolve-endpoint";
import type { UseNavigationStackReturn } from "./use-navigation-stack";

// ── Serialization ─────────────────────────────────────────────────────────────
// Each nav action encodes ONE active endpoint in the URL:
//   path:    /tools/<alias>
//   search:  ?<urlPathParams + data primitives as search params>
//
// "alias" is the first element of endpoint.aliases[], or path.join("/").
// urlPathParams and primitive data fields are written as plain search params.
// On popstate the URL is read back and the single current entry is reconstructed.

function serializeEntry(entry: NavigationStackEntry): {
  alias: string;
  params: Record<string, string>;
} {
  const alias = endpointToUrlSegment(entry.endpoint);
  const params: Record<string, string> = {};

  if (entry.params.urlPathParams) {
    for (const [k, v] of Object.entries(entry.params.urlPathParams)) {
      if (v !== undefined && v !== null) {
        params[k] = String(v);
      }
    }
  }

  if (entry.params.data) {
    const dataRecord = entry.params.data as Record<
      string,
      string | number | boolean | null | undefined
    >;
    for (const [k, v] of Object.entries(dataRecord)) {
      if (
        v !== undefined &&
        v !== null &&
        (typeof v === "string" ||
          typeof v === "number" ||
          typeof v === "boolean")
      ) {
        params[k] = String(v);
      }
    }
  }

  return { alias, params };
}

async function reconstructEntry(
  alias: string,
  params: Record<string, string>,
): Promise<NavigationStackEntry | null> {
  const endpoint = await resolveEndpoint(alias);
  if (!endpoint) {
    return null;
  }

  const pathParamKeys = new Set(
    endpoint.path.filter((s) => s.startsWith("[")).map((s) => s.slice(1, -1)),
  );
  const urlPathParams: Record<string, string> = {};
  const data: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) {
    if (pathParamKeys.has(k)) {
      urlPathParams[k] = v;
    } else {
      data[k] = v;
    }
  }

  return {
    endpoint,
    params: {
      urlPathParams:
        Object.keys(urlPathParams).length > 0 ? urlPathParams : undefined,
      data: Object.keys(data).length > 0 ? data : undefined,
    },
    timestamp: Date.now(),
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

interface UrlNavStackHistory {
  pushState: (url: string) => void;
  replaceState: (url: string) => void;
  /** Navigate browser back (pop). Falls back to replaceState(baseUrl) if unavailable. */
  back: () => void;
}

interface UseUrlNavStackOptions {
  /** Whether URL sync is active. When false, hook is a no-op returning undefined. */
  enabled: boolean;
  history: UrlNavStackHistory;
  /**
   * Build the full URL for the given active endpoint entry (or null = back at base).
   * Receives the serialized alias + params; caller owns path structure.
   */
  buildUrl: (
    entry: { alias: string; params: Record<string, string> } | null,
  ) => string;
  /**
   * Read the current active endpoint alias + params from the URL.
   * Return null when the URL represents the base (no active stacked endpoint).
   */
  readActiveEntry: () => {
    alias: string;
    params: Record<string, string>;
  } | null;
  /**
   * Subscribe to browser popstate events. Return an unsubscribe function.
   */
  onPopState: (handler: () => void) => () => void;
  /**
   * Called after stack is restored from a popstate event.
   * Receives the single restored entry (or null if back at base).
   */
  onStackRestored?: (restored: NavigationStackEntry | null) => void;
}

/**
 * URL-synced single-entry navigation for EndpointsPage in the admin tool pane.
 *
 * Each nav push/replace encodes the CURRENT active endpoint in the URL
 * (alias + params) — no stack serialization. Browser back = pop.
 *
 * push  → pushState(buildUrl(entry))   — browser back will pop
 * pop   → history.back()               — real browser back
 * replace → replaceState(buildUrl(entry))
 *
 * On popstate the URL is read and the single entry reconstructed.
 * The in-memory "stack" is always 0 or 1 entries.
 */
export type UrlNavStackReturn = UseNavigationStackReturn & {
  /** Reset in-memory stack without touching browser history. For sidebar-driven base changes. */
  _clearStack: () => void;
  /** Seed an initial stack entry without touching browser history. For restoring URL params on page refresh. */
  _seedStack: (entry: NavigationStackEntry) => void;
};

export function useUrlNavStack(
  options: UseUrlNavStackOptions,
): UrlNavStackReturn | undefined {
  const {
    enabled,
    history,
    buildUrl,
    readActiveEntry,
    onPopState: subscribePopState,
    onStackRestored,
  } = options;

  const [stack, setStack] = useState<NavigationStackEntry[]>([]);
  const stackRef = useRef<NavigationStackEntry[]>([]);

  const historyRef = useRef(history);
  historyRef.current = history;
  const buildUrlRef = useRef(buildUrl);
  buildUrlRef.current = buildUrl;
  const readActiveEntryRef = useRef(readActiveEntry);
  readActiveEntryRef.current = readActiveEntry;
  const onStackRestoredRef = useRef(onStackRestored);
  onStackRestoredRef.current = onStackRestored;
  const subscribePopStateRef = useRef(subscribePopState);
  subscribePopStateRef.current = subscribePopState;

  // NOTE: No initial mount restoration here.
  // The help widget's selectedAdminEndpoint already restores the base endpoint
  // from the URL on mount. Restoring here would create a duplicate stacked entry
  // causing the back button to appear when there is nothing to go back to.

  // ── Popstate: restore from URL on back/forward ────────────────────────────
  useEffect(() => {
    if (!enabled) {
      return;
    }
    const handler = (): void => {
      const active = readActiveEntryRef.current();
      if (active) {
        void (async (): Promise<void> => {
          const entry = await reconstructEntry(active.alias, active.params);
          const next = entry ? [entry] : [];
          stackRef.current = next;
          setStack(next);
          onStackRestoredRef.current?.(entry ?? null);
        })();
      } else {
        stackRef.current = [];
        setStack([]);
        onStackRestoredRef.current?.(null);
      }
    };
    return subscribePopStateRef.current(handler);
  }, [enabled]);

  // ── Push ──────────────────────────────────────────────────────────────────
  type NavPushOptions = Parameters<UseNavigationStackReturn["push"]>[1];

  const push = useCallback<UseNavigationStackReturn["push"]>(
    (endpoint: CreateApiEndpointAny, opts?: NavPushOptions): void => {
      const entry: NavigationStackEntry = {
        endpoint,
        params: {
          urlPathParams: opts?.urlPathParams as
            | Record<string, string>
            | undefined,
          data: opts?.data,
        },
        timestamp: Date.now(),
        prefillFromGet: opts?.prefillFromGet,
        getEndpoint: opts?.getEndpoint,
        renderInModal: opts?.renderInModal,
        popNavigationOnSuccess: opts?.popNavigationOnSuccess,
        onSuccessCallback: opts?.onSuccessCallback,
        pickerCallback: opts?.pickerCallback,
        pickerLabelField: opts?.pickerLabelField,
        replaceOnSuccess:
          opts?.replaceOnSuccess as NavigationStackEntry["replaceOnSuccess"],
        modalPosition: opts?.modalPosition,
      };
      stackRef.current = [entry];
      setStack([entry]);
      const serialized = serializeEntry(entry);
      historyRef.current.pushState(buildUrlRef.current(serialized));
    },
    [],
  );

  // ── Pop: real browser back ────────────────────────────────────────────────
  const pop = useCallback((): void => {
    // Stack is always 0-1 entries — one pop = go back
    historyRef.current.back();
  }, []);

  // ── Clear: reset in-memory stack without touching browser history ──────────
  // Use when switching base endpoints from outside (e.g. sidebar click).
  // Does NOT call history.back() so no popstate fires.
  const clearStack = useCallback((): void => {
    stackRef.current = [];
    setStack([]);
  }, []);

  // ── Seed: set initial stack entry without touching browser history ──────────
  // Use on mount when the URL already encodes endpoint params (e.g. page refresh
  // at leads/lead/[id]?id=xxx). Unlike push(), no pushState is emitted.
  const seedStack = useCallback((entry: NavigationStackEntry): void => {
    stackRef.current = [entry];
    setStack([entry]);
  }, []);

  // ── Replace ───────────────────────────────────────────────────────────────
  const replace = useCallback<UseNavigationStackReturn["replace"]>(
    (endpoint: CreateApiEndpointAny, opts?: NavPushOptions): void => {
      const entry: NavigationStackEntry = {
        endpoint,
        params: {
          urlPathParams: opts?.urlPathParams as
            | Record<string, string>
            | undefined,
          data: opts?.data,
        },
        timestamp: Date.now(),
        prefillFromGet: opts?.prefillFromGet,
        getEndpoint: opts?.getEndpoint,
        renderInModal: opts?.renderInModal,
        popNavigationOnSuccess: opts?.popNavigationOnSuccess,
        onSuccessCallback: opts?.onSuccessCallback,
        pickerCallback: opts?.pickerCallback,
        pickerLabelField: opts?.pickerLabelField,
        replaceOnSuccess:
          opts?.replaceOnSuccess as NavigationStackEntry["replaceOnSuccess"],
        modalPosition: opts?.modalPosition,
      };
      stackRef.current = [entry];
      setStack([entry]);
      const serialized = serializeEntry(entry);
      historyRef.current.replaceState(buildUrlRef.current(serialized));
    },
    [],
  );

  if (!enabled) {
    return undefined;
  }

  return {
    push,
    pop,
    replace,
    stack,
    canGoBack: stack.length > 0,
    current: stack.length > 0 ? (stack[stack.length - 1] ?? null) : null,
    // Extra: reset in-memory stack without touching browser history.
    // Not part of UseNavigationStackReturn — accessed directly by the widget.
    _clearStack: clearStack,
    _seedStack: seedStack,
  };
}
