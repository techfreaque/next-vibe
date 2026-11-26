"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { z } from "zod";

import { endpointToUrlSegment } from "../../core/core-utils/path";
import type { NavigationStackEntry } from "../../core/definition/endpoint";
import type { CreateApiEndpointAny } from "../../core/definition/endpoint-base";
import type { WidgetData } from "../../core/utils/json";
import { createUrlNavigationRestore } from "../_shared/url-navigation-restore";
import { resolveEndpoint } from "./resolve-endpoint";
import type { UseNavigationStackReturn } from "./use-navigation-stack";

// ── Serialization ─────────────────────────────────────────────────────────────
// Each nav action encodes ONE active endpoint in the URL:
//   path:    /tools/<alias>
//   search:  ?<urlPathParams + data primitives as search params>
//
// "alias" is the first element of endpoint.aliases[], or path.join("/").
// urlPathParams and primitive data fields are written as plain search params.
// On popstate the URL is read back and the single current entry is reconstructed.

function appendNavigationData(
  data: Record<string, WidgetData>,
  params: Record<string, string>,
  prefix: string,
): void {
  for (const [name, value] of Object.entries(data)) {
    const key = `${prefix}${name}`;
    if (value instanceof Date) {
      if (Number.isFinite(value.getTime())) {
        params[key] = value.toISOString();
      }
    } else if (typeof value === "boolean") {
      params[`${key}:bool`] = String(value);
    } else if (typeof value === "string" || typeof value === "number") {
      params[key] = String(value);
    } else if (
      Array.isArray(value) &&
      value.length > 0 &&
      value.every((item) => typeof item === "string")
    ) {
      // Multi-selects use a distinct argument key, so literal search strings
      // that look like JSON are still restored as strings.
      params[`${key}[]`] = JSON.stringify(value);
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      appendNavigationData(value, params, `${key}.`);
    }
  }
}

export function serializeNavigationData(
  data: NavigationStackEntry["params"]["data"],
): Record<string, string> {
  const params: Record<string, string> = {};
  if (data) {
    appendNavigationData(data, params, "");
  }
  return params;
}

export type NavigationArgument = string | string[] | boolean | number;

interface NavigationData {
  [key: string]: NavigationArgument | NavigationData;
}

function unwrapNavigationField(
  schema: z.core.$ZodType | undefined,
): z.core.$ZodType | undefined {
  while (
    schema instanceof z.ZodOptional ||
    schema instanceof z.ZodNullable ||
    schema instanceof z.ZodDefault ||
    schema instanceof z.ZodPrefault
  ) {
    schema = schema.unwrap();
  }
  return schema;
}

function navigationField(
  schema: z.core.$ZodType | undefined,
  key: string,
): z.core.$ZodType | undefined {
  let field = unwrapNavigationField(schema);
  for (const segment of key.split(".")) {
    if (
      !(field instanceof z.ZodObject) ||
      !Object.hasOwn(field.shape, segment)
    ) {
      return undefined;
    }
    field = unwrapNavigationField(field.shape[segment]);
  }
  return field;
}

export function deserializeNavigationData(
  args: Record<string, string>,
  schema?: z.ZodType,
): NavigationData {
  const data: NavigationData = {};
  for (const [rawKey, value] of Object.entries(args)) {
    const isArray = rawKey.endsWith("[]");
    const isBoolean = rawKey.endsWith(":bool");
    const key = isArray
      ? rawKey.slice(0, -2)
      : isBoolean
        ? rawKey.slice(0, -5)
        : rawKey;
    const field = navigationField(schema, key);
    const path = field ? key.split(".") : [key];
    if (
      path.some(
        (part) =>
          part === "__proto__" ||
          part === "constructor" ||
          part === "prototype",
      )
    ) {
      continue;
    }

    let argument: NavigationArgument = value;
    if (isArray) {
      try {
        const parsed: string | string[] = JSON.parse(value);
        if (
          !Array.isArray(parsed) ||
          !parsed.every((item) => typeof item === "string")
        ) {
          continue;
        }
        argument = parsed;
      } catch {
        // Skip malformed multi-select values in manually edited URLs.
        continue;
      }
    } else if (isBoolean || field instanceof z.ZodBoolean) {
      if (value === "true" || value === "false") {
        argument = value === "true";
      } else if (isBoolean) {
        continue;
      }
    } else if (
      field instanceof z.ZodNumber &&
      value.trim() !== "" &&
      Number.isFinite(Number(value))
    ) {
      argument = Number(value);
    }

    // React Hook Form submits nested fields as objects. Store declared
    // dotted inputs in that same shape so edits preserve their siblings.
    const leaf = path.pop() ?? key;
    let target = data;
    for (const segment of path) {
      const previous = Object.hasOwn(target, segment)
        ? target[segment]
        : undefined;
      if (
        previous &&
        typeof previous === "object" &&
        !Array.isArray(previous)
      ) {
        target = previous;
      } else {
        const nested: NavigationData = {};
        target[segment] = nested;
        target = nested;
      }
    }
    target[leaf] = argument;
  }
  return data;
}

function serializeEntry(entry: NavigationStackEntry): {
  alias: string;
  params: Record<string, string>;
} {
  const alias = endpointToUrlSegment(entry.endpoint);
  const params = serializeNavigationData(entry.params.data);

  if (entry.params.urlPathParams) {
    for (const [k, v] of Object.entries(entry.params.urlPathParams)) {
      if (v !== undefined && v !== null) {
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
  const endpoint = await resolveEndpoint(alias).catch((): null => null);
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
      data:
        Object.keys(data).length > 0
          ? deserializeNavigationData(data, endpoint.requestSchema)
          : undefined,
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
 * Modal entries (renderInModal) stay in memory on top: no URL, no history.
 * replace → replaceState(buildUrl(entry))
 *
 * On popstate the URL is read and the single entry reconstructed.
 * The in-memory "stack" is 0 or 1 URL entries, plus any open modals.
 */
type UrlNavStackReturn = UseNavigationStackReturn & {
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
  const [navigationRestore] = useState(
    createUrlNavigationRestore<NavigationStackEntry>,
  );
  const stackRef = useRef<NavigationStackEntry[]>([]);

  const historyRef = useRef(history);
  const buildUrlRef = useRef(buildUrl);
  const readActiveEntryRef = useRef(readActiveEntry);
  const onStackRestoredRef = useRef(onStackRestored);
  const subscribePopStateRef = useRef(subscribePopState);
  // Latest-value refs: synced after commit (layout effects run before the
  // popstate effect below); read only from handlers and callbacks.
  useLayoutEffect(() => {
    historyRef.current = history;
    buildUrlRef.current = buildUrl;
    readActiveEntryRef.current = readActiveEntry;
    onStackRestoredRef.current = onStackRestored;
    subscribePopStateRef.current = subscribePopState;
  });

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
        void navigationRestore.restore(
          () => reconstructEntry(active.alias, active.params),
          (entry) => {
            const next = entry ? [entry] : [];
            stackRef.current = next;
            setStack(next);
            onStackRestoredRef.current?.(entry ?? null);
          },
        );
      } else {
        navigationRestore.cancel();
        stackRef.current = [];
        setStack([]);
        onStackRestoredRef.current?.(null);
      }
    };
    const unsubscribe = subscribePopStateRef.current(handler);
    return (): void => {
      navigationRestore.cancel();
      unsubscribe();
    };
  }, [enabled, navigationRestore]);

  // ── Push ──────────────────────────────────────────────────────────────────
  type NavPushOptions = Parameters<UseNavigationStackReturn["push"]>[1];

  const push = useCallback<UseNavigationStackReturn["push"]>(
    (endpoint: CreateApiEndpointAny, opts?: NavPushOptions): void => {
      navigationRestore.cancel();
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
      // Modals (pickers, confirmations) are transient overlays on the current
      // entry: they carry callbacks a URL can't encode, and closing one must
      // not navigate. Keep them in memory only, on top of the current entry.
      if (entry.renderInModal) {
        const next = [...stackRef.current, entry];
        stackRef.current = next;
        setStack(next);
        return;
      }
      const serialized = serializeEntry(entry);
      historyRef.current.pushState(buildUrlRef.current(serialized));
      stackRef.current = [entry];
      setStack([entry]);
    },
    [navigationRestore],
  );

  // ── Pop: close the top modal, else real browser back ──────────────────────
  const pop = useCallback((): void => {
    const top = stackRef.current[stackRef.current.length - 1];
    if (top?.renderInModal) {
      const next = stackRef.current.slice(0, -1);
      stackRef.current = next;
      setStack(next);
      return;
    }
    // Non-modal stack is always 0-1 entries — one pop = go back
    historyRef.current.back();
  }, []);

  // ── Clear: reset in-memory stack without touching browser history ──────────
  // Use when switching base endpoints from outside (e.g. sidebar click).
  // Does NOT call history.back() so no popstate fires.
  const clearStack = useCallback((): void => {
    navigationRestore.cancel();
    stackRef.current = [];
    setStack([]);
  }, [navigationRestore]);

  // ── Seed: set initial stack entry without touching browser history ──────────
  // Use on mount when the URL already encodes endpoint params (e.g. page refresh
  // at leads/lead/[id]?id=xxx). Unlike push(), no pushState is emitted.
  const seedStack = useCallback(
    (entry: NavigationStackEntry): void => {
      navigationRestore.cancel();
      stackRef.current = [entry];
      setStack([entry]);
    },
    [navigationRestore],
  );

  // ── Replace ───────────────────────────────────────────────────────────────
  const replace = useCallback<UseNavigationStackReturn["replace"]>(
    (endpoint: CreateApiEndpointAny, opts?: NavPushOptions): void => {
      navigationRestore.cancel();
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
      const serialized = serializeEntry(entry);
      historyRef.current.replaceState(buildUrlRef.current(serialized));
      stackRef.current = [entry];
      setStack([entry]);
    },
    [navigationRestore],
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
    // URL-driven pushes are synchronous history operations — never pending.
    isPushPending: false,
    // Extra: reset in-memory stack without touching browser history.
    // Not part of UseNavigationStackReturn — accessed directly by the widget.
    _clearStack: clearStack,
    _seedStack: seedStack,
  };
}
