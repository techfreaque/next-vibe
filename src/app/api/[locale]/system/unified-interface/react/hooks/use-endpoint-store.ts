"use client";

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { create } from "zustand";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import type {
  EndpointReturn,
  OptionsOptional,
  UseEndpointOptions,
  UseEndpointOptionsBase,
} from "./endpoint-types";
import { buildKey, type CacheKeyRequestData } from "./query-key-builder";
import { useEndpoint as useEndpointOriginal } from "./use-endpoint-implementation";

type AnyEndpointMap = Partial<Record<Methods, CreateApiEndpointAny>>;

// ---------------------------------------------------------------------------
// Module-level value registry
// Owner writes here; subscribers read via useSyncExternalStore
// ---------------------------------------------------------------------------

interface ValueEntry {
  value: EndpointReturn<AnyEndpointMap>;
  listeners: Set<() => void>;
}

const valueRegistry = new Map<string, ValueEntry>();

// Stable empty fallback - prevents useSyncExternalStore tearing loop when entry not yet set
const EMPTY_ENDPOINT_RETURN = {} as EndpointReturn<AnyEndpointMap>;

function getEntry(key: string): ValueEntry | undefined {
  return valueRegistry.get(key);
}

function setEntryValue(
  key: string,
  value: EndpointReturn<AnyEndpointMap>,
  notify: boolean,
): void {
  let entry = valueRegistry.get(key);
  if (!entry) {
    entry = { value, listeners: new Set() };
    valueRegistry.set(key, entry);
  } else {
    entry.value = value;
  }
  if (notify) {
    entry.listeners.forEach((l) => l());
  }
}

function notifyListeners(key: string): void {
  const entry = valueRegistry.get(key);
  if (entry) {
    entry.listeners.forEach((l) => l());
  }
}

function subscribeToKey(key: string, listener: () => void): () => void {
  let entry = valueRegistry.get(key);
  if (!entry) {
    // Create placeholder so subscriber can attach before owner renders
    entry = {
      value: {} as EndpointReturn<AnyEndpointMap>,
      listeners: new Set(),
    };
    valueRegistry.set(key, entry);
  }
  entry.listeners.add(listener);
  return (): void => {
    entry?.listeners.delete(listener);
    // If no listeners remain and no owner has registered this key, clean it up
    if (
      entry?.listeners.size === 0 &&
      !useEndpointInstanceStore.getState().instances.has(key)
    ) {
      valueRegistry.delete(key);
    }
  };
}

// ---------------------------------------------------------------------------
// Ref-count store - ownership + cleanup tracking only
// ---------------------------------------------------------------------------

interface RefCountEntry {
  refCount: number;
  ownerCount: number;
  lastAccessed: number;
  cleanupTimer?: ReturnType<typeof setTimeout>;
}

interface RefCountStore {
  instances: Map<string, RefCountEntry>;
  /** Register a subscriber. Returns true if this should be the owner (first ever, or no current owner) */
  register: (key: string, asOwner: boolean) => void;
  unregister: (key: string, wasOwner: boolean) => void;
  hasOwner: (key: string) => boolean;
  removeInstance: (key: string) => void;
  clearAll: () => void;
}

const CLEANUP_DELAY = 5 * 60 * 1000;

export const useEndpointInstanceStore = create<RefCountStore>((set, get) => ({
  instances: new Map(),

  register: (key: string, asOwner: boolean): void => {
    set((state) => {
      const next = new Map(state.instances);
      const inst = next.get(key);
      if (inst) {
        if (inst.cleanupTimer) {
          clearTimeout(inst.cleanupTimer);
        }
        next.set(key, {
          refCount: inst.refCount + 1,
          ownerCount: asOwner ? inst.ownerCount + 1 : inst.ownerCount,
          lastAccessed: Date.now(),
        });
      } else {
        next.set(key, {
          refCount: 1,
          ownerCount: asOwner ? 1 : 0,
          lastAccessed: Date.now(),
        });
      }
      return { instances: next };
    });
  },

  unregister: (key: string, wasOwner: boolean): void => {
    set((state) => {
      const next = new Map(state.instances);
      const inst = next.get(key);
      if (!inst) {
        return state;
      }
      const newCount = Math.max(0, inst.refCount - 1);
      const newOwnerCount = wasOwner
        ? Math.max(0, inst.ownerCount - 1)
        : inst.ownerCount;
      if (newCount === 0) {
        const timer = setTimeout(() => {
          get().removeInstance(key);
        }, CLEANUP_DELAY);
        next.set(key, {
          refCount: 0,
          ownerCount: 0,
          lastAccessed: Date.now(),
          cleanupTimer: timer,
        });
      } else {
        next.set(key, {
          refCount: newCount,
          ownerCount: newOwnerCount,
          lastAccessed: Date.now(),
        });
      }
      return { instances: next };
    });
  },

  hasOwner: (key: string): boolean => {
    return (get().instances.get(key)?.ownerCount ?? 0) > 0;
  },

  removeInstance: (key: string): void => {
    set((state) => {
      const next = new Map(state.instances);
      const inst = next.get(key);
      if (inst?.cleanupTimer) {
        clearTimeout(inst.cleanupTimer);
      }
      next.delete(key);
      valueRegistry.delete(key);
      return { instances: next };
    });
  },

  clearAll: (): void => {
    const { instances } = get();
    for (const inst of instances.values()) {
      if (inst.cleanupTimer) {
        clearTimeout(inst.cleanupTimer);
      }
    }
    valueRegistry.clear();
    set({ instances: new Map() });
  },
}));

// ---------------------------------------------------------------------------
// Key generation
// ---------------------------------------------------------------------------

function generateInstanceKey<
  T extends Partial<Record<Methods, CreateApiEndpointAny>>,
  TGetEndpoint extends CreateApiEndpointAny,
  TUrlPathParams = T extends { [K in Methods]: CreateApiEndpointAny }
    ? T[Methods]["types"]["UrlVariablesOutput"]
    : never,
>(
  endpoints: T,
  urlPathParams: TUrlPathParams,
  logger: EndpointLogger,
  requestData: CacheKeyRequestData<TGetEndpoint>,
): string {
  const firstEndpoint = Object.values(endpoints)[0];
  if (!firstEndpoint) {
    return "endpoint-empty";
  }
  return buildKey(
    "endpoint",
    firstEndpoint,
    urlPathParams,
    logger,
    requestData as CacheKeyRequestData<CreateApiEndpointAny>,
  );
}

// ---------------------------------------------------------------------------
// Main hook
// ---------------------------------------------------------------------------

export function useEndpointManaged<
  T extends Partial<Record<Methods, CreateApiEndpointAny>>,
  TOptional extends boolean = OptionsOptional<T>,
>(
  endpoints: T,
  options: TOptional extends true
    ? UseEndpointOptions<T> | undefined
    : UseEndpointOptions<T>,
  logger: EndpointLogger,
  user: JwtPayloadType,
): EndpointReturn<T> {
  type TGetEndpoint = T extends { GET: infer E extends CreateApiEndpointAny }
    ? E
    : CreateApiEndpointAny;

  const urlPathParams =
    options?.read?.urlPathParams ??
    options?.create?.urlPathParams ??
    options?.update?.urlPathParams ??
    options?.delete?.urlPathParams;

  const readInitialState = options?.read?.initialState;

  const instanceKey = useMemo(
    () =>
      generateInstanceKey<T, TGetEndpoint>(
        endpoints,
        urlPathParams as Parameters<
          typeof generateInstanceKey<T, TGetEndpoint>
        >[1],
        logger,
        readInitialState as CacheKeyRequestData<TGetEndpoint>,
      ),
    [endpoints, urlPathParams, logger, readInitialState],
  );

  const isOwnerRef = useRef<boolean | null>(null);
  // Track previous instanceKey to detect navigation (key change mid-lifecycle).
  const prevInstanceKeyRef = useRef<string | null>(null);

  // Re-evaluate ownership when instanceKey changes (e.g. navigating user1 → user2).
  // On key change: unregister from old key synchronously and reset ownership.
  if (prevInstanceKeyRef.current !== instanceKey) {
    if (prevInstanceKeyRef.current !== null) {
      useEndpointInstanceStore
        .getState()
        .unregister(prevInstanceKeyRef.current, isOwnerRef.current === true);
    }
    prevInstanceKeyRef.current = instanceKey;
    isOwnerRef.current = null; // force re-evaluation below
  }

  if (isOwnerRef.current === null) {
    isOwnerRef.current = !useEndpointInstanceStore
      .getState()
      .hasOwner(instanceKey);
  }
  const isOwner = isOwnerRef.current;

  // Always call useEndpointOriginal unconditionally - same hook order every render.
  // Owner's result gets published; subscriber's result is discarded.
  const ownResult = useEndpointOriginal(
    endpoints,
    options as UseEndpointOptionsBase<T> | undefined,
    logger,
    user,
  );

  // Owner: write latest value into registry during render (no setState = no loop).
  // Do NOT notify listeners here - defer to useEffect to avoid render-phase side effects.
  if (isOwner) {
    setEntryValue(
      instanceKey,
      ownResult as EndpointReturn<AnyEndpointMap>,
      false,
    );
  }

  // Owner: notify subscribers via microtask after render, but only when
  // meaningful data changed. We compare read.data + read.isLoading by reference only —
  // form.watch() creates new objects every render even with identical data,
  // so including create.values in the comparison would always notify and cause a loop.
  // Cast to a concrete map type so TypeScript resolves "read" (not "never").
  interface ConcreteMap {
    GET: CreateApiEndpointAny;
    POST: CreateApiEndpointAny;
  }
  type ConcreteReturn = EndpointReturn<ConcreteMap>;
  const prevReadDataRef = useRef<ConcreteReturn["read"]["data"]>(undefined);
  const prevReadIsLoadingRef = useRef<boolean | undefined>(undefined);
  if (isOwner) {
    const current = ownResult as ConcreteReturn;
    const readData = current.read?.data;
    const readIsLoading = current.read?.isLoading;
    const meaningfullyChanged =
      prevReadDataRef.current !== readData ||
      prevReadIsLoadingRef.current !== readIsLoading;
    if (meaningfullyChanged) {
      prevReadDataRef.current = readData;
      prevReadIsLoadingRef.current = readIsLoading;
      // Defer notification outside render phase - avoids setState-during-render loops
      queueMicrotask(() => {
        notifyListeners(instanceKey);
      });
    }
  }

  // Lifecycle: register on mount/key-change, unregister on unmount only.
  // Key-change unregistration is handled synchronously above (prevInstanceKeyRef).
  const registeredKeyRef = useRef<string | null>(null);
  useEffect((): (() => void) => {
    useEndpointInstanceStore.getState().register(instanceKey, isOwner);
    registeredKeyRef.current = instanceKey;
    return (): void => {
      // Only unregister if we haven't already done so synchronously (key change)
      if (registeredKeyRef.current === instanceKey) {
        if (isOwner) {
          isOwnerRef.current = null;
        }
        useEndpointInstanceStore.getState().unregister(instanceKey, isOwner);
        registeredKeyRef.current = null;
      }
    };
  }, [instanceKey, isOwner]);

  // Subscribers: read from registry reactively.
  // Owner uses a no-op subscribe so useSyncExternalStore never re-renders it
  // (the owner already re-renders when its own hooks change; subscribing to its
  // own notifications would create an infinite loop via queueMicrotask).
  const noopSubscribe = useRef<(listener: () => void) => () => void>(
    (): (() => void) => (): void => undefined,
  );
  const sharedValue = useSyncExternalStore(
    isOwner
      ? noopSubscribe.current
      : (listener): (() => void) => subscribeToKey(instanceKey, listener),
    (): EndpointReturn<AnyEndpointMap> =>
      getEntry(instanceKey)?.value ?? EMPTY_ENDPOINT_RETURN,
    (): EndpointReturn<AnyEndpointMap> =>
      getEntry(instanceKey)?.value ?? EMPTY_ENDPOINT_RETURN,
  );

  // Owner returns own result directly (no round-trip lag).
  // Subscriber returns shared value from registry.
  return (isOwner ? ownResult : sharedValue) as EndpointReturn<T>;
}

// ---------------------------------------------------------------------------
// Debug utilities
// ---------------------------------------------------------------------------

export function clearEndpointInstances(): void {
  useEndpointInstanceStore.getState().clearAll();
}

export function getEndpointInstanceCount(): number {
  return useEndpointInstanceStore.getState().instances.size;
}

export function getEndpointInstanceDetails(): Array<{
  key: string;
  refCount: number;
  lastAccessed: Date;
}> {
  const { instances } = useEndpointInstanceStore.getState();
  return [...instances.entries()].map(([key, inst]) => ({
    key,
    refCount: inst.refCount,
    lastAccessed: new Date(inst.lastAccessed),
  }));
}
