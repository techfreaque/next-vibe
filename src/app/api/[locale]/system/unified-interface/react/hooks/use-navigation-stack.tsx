"use client";

import { createContext, type ReactNode, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";

import type { NavigationStackEntry } from "../../shared/types/endpoint";
import type { CreateApiEndpointAny } from "../../shared/types/endpoint-base";

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
    renderInModal?: boolean,
    popNavigationOnSuccess?: number,
    modalPosition?: { x: number; y: number },
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
    renderInModal?: boolean,
    popNavigationOnSuccess?: number,
    modalPosition?: { x: number; y: number },
  ) => void;

  /**
   * Go back to previous endpoint in navigation stack
   */
  pop: () => void;
}

/**
 * Create a new navigation stack store instance
 * Each context provider will have its own isolated store
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function createNavigationStackStore() {
  return createStore<NavigationStackStore>((set) => ({
    stack: [],

    push: <TEndpoint extends CreateApiEndpointAny>(
      endpoint: TEndpoint,
      params: {
        urlPathParams?: Partial<TEndpoint["types"]["UrlVariablesOutput"]>;
        data?: Partial<TEndpoint["types"]["RequestOutput"]>;
      },
      prefillFromGet = false,
      getEndpoint?: CreateApiEndpointAny,
      renderInModal = false,
      popNavigationOnSuccess?: number,
      modalPosition?: { x: number; y: number },
    ): void => {
      const entry: NavigationStackEntry<TEndpoint> = {
        endpoint,
        params,
        timestamp: Date.now(),
        prefillFromGet,
        getEndpoint,
        renderInModal,
        popNavigationOnSuccess,
        modalPosition,
      };

      set((state) => ({
        stack: [...state.stack, entry as NavigationStackEntry],
      }));

      // The EndpointRenderer will check the current stack entry and fetch GET data
      // before rendering the PATCH/PUT form if prefillFromGet is true
      if (prefillFromGet) {
        // eslint-disable-next-line no-console
        console.log(
          "Navigation: Prefill from GET",
          endpoint.path.join("/"),
          getEndpoint ? `using ${getEndpoint.path.join("/")}` : "",
        );
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
      renderInModal = false,
      popNavigationOnSuccess?: number,
      modalPosition?: { x: number; y: number },
    ): void => {
      const entry: NavigationStackEntry<TEndpoint> = {
        endpoint,
        params,
        timestamp: Date.now(),
        prefillFromGet,
        getEndpoint,
        renderInModal,
        popNavigationOnSuccess,
        modalPosition,
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
}

/**
 * Type for the Zustand store instance
 */
type NavigationStackStoreInstance = ReturnType<
  typeof createNavigationStackStore
>;

/**
 * Context for the navigation stack store
 */
const NavigationStackContext =
  createContext<NavigationStackStoreInstance | null>(null);

/**
 * Provider component that creates and provides a navigation stack store
 */
export function NavigationStackProvider({
  children,
}: {
  children: ReactNode;
}): React.JSX.Element {
  const storeRef = useRef<NavigationStackStoreInstance>(null!);

  if (!storeRef.current) {
    storeRef.current = createNavigationStackStore();
  }

  return (
    <NavigationStackContext.Provider value={storeRef.current}>
      {children}
    </NavigationStackContext.Provider>
  );
}

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
 * - Context-scoped state (each provider has its own isolated stack)
 * - Selective subscriptions via Zustand (only re-render when needed)
 *
 * @example
 * ```tsx
 * // Wrap your component tree with the provider
 * <NavigationStackProvider>
 *   <YourComponent />
 * </NavigationStackProvider>
 *
 * // Inside YourComponent
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
    renderInModal?: boolean,
    popNavigationOnSuccess?: number,
    modalPosition?: { x: number; y: number },
  ) => void;
  replace: <TEndpoint extends CreateApiEndpointAny>(
    endpoint: TEndpoint,
    params: {
      urlPathParams?: Partial<TEndpoint["types"]["UrlVariablesOutput"]>;
      data?: Partial<TEndpoint["types"]["RequestOutput"]>;
    },
    prefillFromGet?: boolean,
    getEndpoint?: CreateApiEndpointAny,
    renderInModal?: boolean,
    popNavigationOnSuccess?: number,
    modalPosition?: { x: number; y: number },
  ) => void;
  pop: () => void;
  stack: NavigationStackEntry[];
  canGoBack: boolean;
  current: NavigationStackEntry | null;
} {
  const store = useContext(NavigationStackContext);

  if (!store) {
    // eslint-disable-next-line no-restricted-syntax
    throw new Error(
      "useNavigationStack must be used within a NavigationStackProvider",
    );
  }

  // Use Zustand's useStore hook for selective subscriptions
  const stack = useStore(store, (state) => state.stack);
  const push = useStore(store, (state) => state.push);
  const replace = useStore(store, (state) => state.replace);
  const pop = useStore(store, (state) => state.pop);

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
