"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { create } from "zustand";

import type { CreateApiEndpointAny } from "../../core/definition/endpoint-base";
import type { Methods } from "../../core/definition/enums";
import type { JwtPayloadType } from "../../identity/auth/types";
import type { EndpointLogger } from "../../logger/types";
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

// Stable no-op subscribe for owners (they never re-render from the registry)
function noopSubscribe(): () => void {
  return (): void => undefined;
}

/** Which instance key this hook instance evaluated ownership for */
interface EndpointOwnership {
  key: string;
  isOwner: boolean;
}

/**
 * Ownership records whose registration was already released. Lets the
 * render-phase release (key change) and the effect cleanup (unmount) share one
 * idempotent path, so a registration is never unregistered twice.
 */
const releasedOwnerships = new WeakSet<EndpointOwnership>();

function releaseOwnership(ownership: EndpointOwnership): void {
  if (releasedOwnerships.has(ownership)) {
    return;
  }
  releasedOwnerships.add(ownership);
  endpointInstanceStore.getState().unregister(ownership.key, ownership.isOwner);
}

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
      !endpointInstanceStore.getState().instances.has(key)
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

const endpointInstanceStore = create<RefCountStore>((set, get) => ({
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

  // Ownership is decided synchronously on the first render for a key (first
  // instance without a registered owner becomes the owner) and held in state.
  // On key change (e.g. navigating user1 → user2) it is re-evaluated during
  // render via the "adjust state when a prop changes" pattern, and the old key
  // is unregistered synchronously so ownership of it frees up immediately.
  const [ownership, setOwnership] = useState<EndpointOwnership>(() => ({
    key: instanceKey,
    isOwner: !endpointInstanceStore.getState().hasOwner(instanceKey),
  }));
  let currentOwnership = ownership;
  if (ownership.key !== instanceKey) {
    releaseOwnership(ownership);
    currentOwnership = {
      key: instanceKey,
      isOwner: !endpointInstanceStore.getState().hasOwner(instanceKey),
    };
    setOwnership(currentOwnership);
  }
  const isOwner = currentOwnership.isOwner;

  // Always call useEndpointOriginal unconditionally - same hook order every render.
  // Owner's result gets published; subscriber's result is discarded.
  const ownResult = useEndpointOriginal(
    endpoints,
    options as UseEndpointOptionsBase<T> | undefined,
    logger,
    user,
  );

  // Owner: write latest value into registry during render (no setState = no loop).
  // Do NOT notify listeners here - defer to an effect to avoid render-phase side effects.
  if (isOwner) {
    setEntryValue(
      instanceKey,
      ownResult as EndpointReturn<AnyEndpointMap>,
      false,
    );
  }

  // Owner: notify subscribers after commit, but only when meaningful data
  // changed. We compare read.data + read.isLoading by reference only —
  // form value subscriptions create new objects every render even with
  // identical data, so including create.values would always notify and loop.
  // Cast to a concrete map type so TypeScript resolves "read" (not "never").
  interface ConcreteMap {
    GET: CreateApiEndpointAny;
    POST: CreateApiEndpointAny;
  }
  type ConcreteReturn = EndpointReturn<ConcreteMap>;
  const ownRead = (ownResult as ConcreteReturn).read;
  const readData = ownRead?.data;
  const readIsLoading = ownRead?.isLoading;
  const lastNotifiedRef = useRef<{
    data: ConcreteReturn["read"]["data"];
    isLoading: boolean | undefined;
  } | null>(null);
  useLayoutEffect(() => {
    if (!isOwner) {
      return;
    }
    const prev = lastNotifiedRef.current;
    if (
      prev !== null &&
      prev.data === readData &&
      prev.isLoading === readIsLoading
    ) {
      return;
    }
    lastNotifiedRef.current = { data: readData, isLoading: readIsLoading };
    notifyListeners(instanceKey);
  });

  // Lifecycle: register on mount/key-change, unregister on unmount.
  // Key-change unregistration already happened synchronously during render
  // (releaseOwnership above); releaseOwnership is idempotent per registration.
  useEffect((): (() => void) => {
    releasedOwnerships.delete(currentOwnership);
    endpointInstanceStore
      .getState()
      .register(currentOwnership.key, currentOwnership.isOwner);
    return (): void => {
      releaseOwnership(currentOwnership);
    };
  }, [currentOwnership]);

  // Subscribers: read from registry reactively.
  // Owner uses a no-op subscribe so useSyncExternalStore never re-renders it
  // (the owner already re-renders when its own hooks change; subscribing to its
  // own notifications would create an infinite loop).
  const sharedValue = useSyncExternalStore(
    isOwner
      ? noopSubscribe
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
  endpointInstanceStore.getState().clearAll();
}

export function getEndpointInstanceCount(): number {
  return endpointInstanceStore.getState().instances.size;
}

export function getEndpointInstanceDetails(): Array<{
  key: string;
  refCount: number;
  lastAccessed: Date;
}> {
  const { instances } = endpointInstanceStore.getState();
  return [...instances.entries()].map(([key, inst]) => ({
    key,
    refCount: inst.refCount,
    lastAccessed: new Date(inst.lastAccessed),
  }));
}
