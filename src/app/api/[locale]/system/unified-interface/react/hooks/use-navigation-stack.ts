"use client";

import { create } from "zustand";

import type { CreateApiEndpointAny, NavigationStackEntry } from "../../shared/types/endpoint";

/**
 * Navigation stack store interface
 */
interface NavigationStackStore {
  /**
   * Current navigation stack
   */
  stack: NavigationStackEntry[];

  /**
   * Navigate to a new endpoint with type-safe parameters
   */
  push: <TEndpoint extends CreateApiEndpointAny>(
    endpoint: TEndpoint,
    params: {
      urlPathParams?: Partial<TEndpoint["types"]["UrlVariablesOutput"]>;
      data?: Partial<TEndpoint["types"]["RequestOutput"]>;
    },
    prefillFromGet?: boolean,
    getEndpoint?: CreateApiEndpointAny,
  ) => void;

  /**
   * Replace the top of the stack with a new endpoint
   * Useful for redirecting after successful creation (e.g., POST -> GET)
   */
  replace: <TEndpoint extends CreateApiEndpointAny>(
    endpoint: TEndpoint,
    params: {
      urlPathParams?: Partial<TEndpoint["types"]["UrlVariablesOutput"]>;
      data?: Partial<TEndpoint["types"]["RequestOutput"]>;
    },
    prefillFromGet?: boolean,
    getEndpoint?: CreateApiEndpointAny,
  ) => void;

  /**
   * Go back to previous endpoint in navigation stack
   */
  pop: () => void;
}

/**
 * Zustand store for navigation stack
 * Global state shared across all components
 */
export const useNavigationStore = create<NavigationStackStore>((set) => ({
  stack: [],

  push: <TEndpoint extends CreateApiEndpointAny>(
    endpoint: TEndpoint,
    params: {
      urlPathParams?: Partial<TEndpoint["types"]["UrlVariablesOutput"]>;
      data?: Partial<TEndpoint["types"]["RequestOutput"]>;
    },
    prefillFromGet = false,
    getEndpoint?: CreateApiEndpointAny,
  ): void => {
    const entry: NavigationStackEntry<TEndpoint> = {
      endpoint,
      params,
      timestamp: Date.now(),
      prefillFromGet,
      getEndpoint,
    };

    set((state) => ({
      stack: [...state.stack, entry as NavigationStackEntry],
    }));

    // The EndpointRenderer will check the current stack entry and fetch GET data
    // before rendering the PATCH/PUT form if prefillFromGet is true
    if (prefillFromGet) {
      // eslint-disable-next-line no-console
      console.log("Navigation: Prefill from GET requested for:", endpoint, "using:", getEndpoint);
    }
  },

  replace: <TEndpoint extends CreateApiEndpointAny>(
    endpoint: TEndpoint,
    params: {
      urlPathParams?: Partial<TEndpoint["types"]["UrlVariablesOutput"]>;
      data?: Partial<TEndpoint["types"]["RequestOutput"]>;
    },
    prefillFromGet = false,
    getEndpoint?: CreateApiEndpointAny,
  ): void => {
    const entry: NavigationStackEntry<TEndpoint> = {
      endpoint,
      params,
      timestamp: Date.now(),
      prefillFromGet,
      getEndpoint,
    };

    set((state) => {
      if (state.stack.length === 0) {
        // If stack is empty, just push the new entry
        return {
          stack: [entry as NavigationStackEntry],
        };
      }
      // Replace the top of the stack
      return {
        stack: [...state.stack.slice(0, -1), entry as NavigationStackEntry],
      };
    });
  },

  pop: (): void => {
    set((state) => {
      if (state.stack.length === 0) {
        // eslint-disable-next-line no-console
        console.warn("Navigation: Cannot pop - stack is empty");
        return state;
      }
      return {
        stack: state.stack.slice(0, -1),
      };
    });
  },
}));

/**
 * Hook for managing cross-definition navigation stack
 *
 * This hook provides type-safe navigation between endpoint definitions
 * with automatic parameter extraction and optional GET prefill.
 *
 * Features:
 * - Type-safe parameter passing between definitions
 * - Navigation history with back button support
 * - Optional prefill from GET endpoints before showing forms
 * - Stack-based navigation model
 * - Global state shared across all components (via Zustand)
 *
 * @example
 * ```tsx
 * const navigation = useNavigationStack();
 *
 * // Navigate to detail view
 * navigation.push(
 *   favoriteDetailEndpoint,
 *   { id: favorite.id },
 *   false // no prefill
 * );
 *
 * // Navigate to edit view with prefill
 * navigation.push(
 *   favoriteEditEndpoint,
 *   { id: favorite.id },
 *   true // prefill from GET
 * );
 *
 * // Go back
 * navigation.pop();
 * ```
 */
export function useNavigationStack(): {
  push: <TEndpoint extends CreateApiEndpointAny>(
    endpoint: TEndpoint,
    params: {
      urlPathParams?: Partial<TEndpoint["types"]["UrlVariablesOutput"]>;
      data?: Partial<TEndpoint["types"]["RequestOutput"]>;
    },
    prefillFromGet?: boolean,
    getEndpoint?: CreateApiEndpointAny,
  ) => void;
  replace: <TEndpoint extends CreateApiEndpointAny>(
    endpoint: TEndpoint,
    params: {
      urlPathParams?: Partial<TEndpoint["types"]["UrlVariablesOutput"]>;
      data?: Partial<TEndpoint["types"]["RequestOutput"]>;
    },
    prefillFromGet?: boolean,
    getEndpoint?: CreateApiEndpointAny,
  ) => void;
  pop: () => void;
  stack: NavigationStackEntry[];
  canGoBack: boolean;
  current: NavigationStackEntry | null;
} {
  const stack = useNavigationStore((state) => state.stack);
  const push = useNavigationStore((state) => state.push);
  const replace = useNavigationStore((state) => state.replace);
  const pop = useNavigationStore((state) => state.pop);

  const canGoBack = stack.length > 0;
  const current = stack.length > 0 ? stack[stack.length - 1] : null;

  return {
    push,
    replace,
    pop,
    stack,
    canGoBack,
    current,
  };
}

export type UseNavigationStackReturn = ReturnType<typeof useNavigationStack>;
