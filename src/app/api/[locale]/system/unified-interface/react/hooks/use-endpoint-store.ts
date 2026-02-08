"use client";

import { useEffect, useMemo } from "react";
import { create } from "zustand";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import type { EndpointReturn, UseEndpointOptions } from "./endpoint-types";
import { buildKey } from "./query-key-builder";
import { useEndpoint as useEndpointOriginal } from "./use-endpoint-implementation";

/**
 * Endpoint instance metadata stored in the registry
 */
interface EndpointInstanceMetadata {
  /** Number of active subscribers */
  refCount: number;
  /** Timestamp of last access */
  lastAccessed: number;
  /** Cleanup timer */
  cleanupTimer?: ReturnType<typeof setTimeout>;
}

/**
 * Store for managing endpoint instance metadata
 * Note: We only store metadata here (refCount, timers), not the actual hook return values
 * The actual values come from React Query's cache, ensuring reactivity
 */
interface EndpointInstanceStore {
  /** Map of query key -> instance metadata */
  instances: Map<string, EndpointInstanceMetadata>;

  /** Get instance metadata by key */
  getMetadata: (key: string) => EndpointInstanceMetadata | undefined;

  /** Initialize or update instance metadata */
  initInstance: (key: string) => void;

  /** Increment reference count */
  incrementRef: (key: string) => void;

  /** Decrement reference count and schedule cleanup if needed */
  decrementRef: (key: string) => void;

  /** Remove instance metadata from the registry */
  removeInstance: (key: string) => void;

  /** Clear all instances */
  clearAll: () => void;
}

/** Time in ms before cleaning up unused instances (5 minutes) */
const CLEANUP_DELAY = 5 * 60 * 1000;

/**
 * Zustand store for endpoint instance metadata
 * This tracks which instances are active and manages cleanup
 */
export const useEndpointInstanceStore = create<EndpointInstanceStore>(
  (set, get) => ({
    instances: new Map(),

    getMetadata: (key: string): EndpointInstanceMetadata | undefined => {
      return get().instances.get(key);
    },

    initInstance: (key: string): void => {
      set((state) => {
        const newInstances = new Map(state.instances);
        const existing = newInstances.get(key);

        if (!existing) {
          newInstances.set(key, {
            refCount: 0,
            lastAccessed: Date.now(),
          });
        } else {
          // Update last accessed time
          existing.lastAccessed = Date.now();
        }

        return { instances: newInstances };
      });
    },

    incrementRef: (key: string): void => {
      set((state) => {
        const newInstances = new Map(state.instances);
        const instance = newInstances.get(key);

        if (instance) {
          // Clear cleanup timer when ref count increases
          if (instance.cleanupTimer) {
            clearTimeout(instance.cleanupTimer);
            instance.cleanupTimer = undefined;
          }

          instance.refCount++;
          instance.lastAccessed = Date.now();
          newInstances.set(key, instance);
        }

        return { instances: newInstances };
      });
    },

    decrementRef: (key: string): void => {
      set((state) => {
        const newInstances = new Map(state.instances);
        const instance = newInstances.get(key);

        if (instance) {
          instance.refCount = Math.max(0, instance.refCount - 1);
          instance.lastAccessed = Date.now();

          // Schedule cleanup if no more subscribers
          if (instance.refCount === 0) {
            instance.cleanupTimer = setTimeout(() => {
              get().removeInstance(key);
            }, CLEANUP_DELAY);
          }

          newInstances.set(key, instance);
        }

        return { instances: newInstances };
      });
    },

    removeInstance: (key: string): void => {
      set((state) => {
        const newInstances = new Map(state.instances);
        const instance = newInstances.get(key);

        // Clear any cleanup timer
        if (instance?.cleanupTimer) {
          clearTimeout(instance.cleanupTimer);
        }

        newInstances.delete(key);
        return { instances: newInstances };
      });
    },

    clearAll: (): void => {
      const instances = get().instances;

      // Clear all cleanup timers
      for (const instance of instances.values()) {
        if (instance.cleanupTimer) {
          clearTimeout(instance.cleanupTimer);
        }
      }

      set({ instances: new Map() });
    },
  }),
);

/**
 * Generate a unique key for endpoint instance
 * Key format: endpoint-path-method-urlPathParams
 */
function generateInstanceKey<
  T extends Partial<Record<Methods, CreateApiEndpointAny>>,
  TUrlPathParams = T extends { [K in Methods]: CreateApiEndpointAny }
    ? T[Methods]["types"]["UrlVariablesOutput"]
    : never,
>(endpoints: T, urlPathParams: TUrlPathParams, logger: EndpointLogger): string {
  // Use the first available endpoint to generate the base key
  const firstEndpoint = Object.values(endpoints)[0];

  if (!firstEndpoint) {
    return "endpoint-empty";
  }

  // Use buildKey for consistent key generation
  return buildKey("endpoint", firstEndpoint, urlPathParams, logger);
}

/**
 * New useEndpoint hook - drop-in replacement with instance management
 *
 * This wrapper ensures that only ONE instance exists per unique combination of:
 * - Endpoint definitions
 * - URL path parameters
 *
 * The instance tracking works by:
 * 1. All components with the same endpoint+params call the underlying hook
 * 2. React Query deduplicates the actual API calls
 * 3. We track how many components are using each instance
 * 4. When all components unmount, we schedule cleanup
 *
 * This approach relies on React Query for the actual deduplication and caching,
 * while we just track metadata for cleanup purposes.
 *
 * @param endpoints - Object containing endpoint definitions (e.g., { GET: endpoint, POST: endpoint })
 * @param options - Configuration options for forms and queries
 * @param logger - Logger instance for debugging
 * @param user - User authentication payload
 * @returns Endpoint instance with all CRUD operations
 */
export function useEndpointManaged<
  T extends Partial<Record<Methods, CreateApiEndpointAny>>,
>(
  endpoints: T,
  options: UseEndpointOptions<T> | undefined,
  logger: EndpointLogger,
  user: JwtPayloadType,
): EndpointReturn<T> {
  // Extract urlPathParams from options (try different locations)
  const urlPathParams =
    options?.urlPathParams ??
    options?.read?.urlPathParams ??
    options?.create?.urlPathParams ??
    options?.update?.urlPathParams ??
    options?.delete?.urlPathParams ??
    options?.queryOptions?.urlPathParams;

  // Generate unique instance key
  const instanceKey = useMemo(
    () => generateInstanceKey(endpoints, urlPathParams, logger),
    [endpoints, urlPathParams, logger],
  );

  // Initialize instance metadata on first render
  useEffect((): (() => void) => {
    const store = useEndpointInstanceStore.getState();
    store.initInstance(instanceKey);
    store.incrementRef(instanceKey);

    return (): void => {
      store.decrementRef(instanceKey);
    };
  }, [instanceKey]);

  // Call the original hook - React Query handles deduplication
  // All components with the same query key will share the same cache
  const endpointReturn = useEndpointOriginal(endpoints, options, logger, user);

  return endpointReturn;
}

/**
 * Utility function to manually clear all endpoint instances
 * Useful for testing or when you need to reset all cached instances
 */
export function clearEndpointInstances(): void {
  useEndpointInstanceStore.getState().clearAll();
}

/**
 * Utility function to get current instance count (for debugging)
 */
export function getEndpointInstanceCount(): number {
  return useEndpointInstanceStore.getState().instances.size;
}

/**
 * Utility function to get instance details (for debugging)
 */
export function getEndpointInstanceDetails(): Array<{
  key: string;
  refCount: number;
  lastAccessed: Date;
}> {
  const instances = useEndpointInstanceStore.getState().instances;
  return [...instances.entries()].map(([key, instance]) => ({
    key,
    refCount: instance.refCount,
    lastAccessed: new Date(instance.lastAccessed),
  }));
}
