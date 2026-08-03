"use client";

import type { NavigationStackEntry } from "../../core/definition/endpoint";
import type { CreateApiEndpointAny } from "../../core/definition/endpoint-base";
import type { WidgetData } from "../../core/utils/json";
import type { CliComponent } from "../_shared/lazy-widget";
import { createContext, type ReactNode, useContext, useRef } from "react";
import { createStore, type StoreApi, useStore } from "zustand";

/** Preload the lazyWidget for an endpoint before pushing it onto the stack. */
async function preloadEndpointWidget(
  endpoint: CreateApiEndpointAny,
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- runtime duck-typing on lazyWidget
  const render = (endpoint.fields as Record<string, any>)?.render;
  if (
    render &&
    typeof render === "function" &&
    "cliWidget" in render &&
    "preload" in render &&
    typeof (render as CliComponent).preload === "function" &&
    (render as CliComponent).resolved === null
  ) {
    await (render as CliComponent).preload();
  }
}

/**
 * Navigation options
 */
interface NavigationOptions<TEndpoint extends CreateApiEndpointAny> {
  urlPathParams?: Partial<TEndpoint["types"]["UrlVariablesOutput"]>;
  data?: Partial<TEndpoint["types"]["RequestOutput"]>;
  prefillFromGet?: boolean;
  getEndpoint?: CreateApiEndpointAny;
  renderInModal?: boolean;
  popNavigationOnSuccess?: number;
  onSuccessCallback?: () => void;
  /**
   * Picker callback — when set, the pushed widget is in "picker mode".
   * Pass a typed callback; it will be carried as WidgetData in the stack entry.
   */
  pickerCallback?: (value: WidgetData) => void;
  /**
   * For CLI picker mode: the field name in each list item to use as the display label.
   * e.g. "name" or "title". Falls back to heuristic if not set.
   */
  pickerLabelField?: string;
  replaceOnSuccess?: {
    endpoint: CreateApiEndpointAny;
    getUrlPathParams?: (
      responseData: TEndpoint["types"]["ResponseOutput"],
    ) => Record<string, string> | undefined;
    prefillFromGet?: boolean;
    getEndpoint?: CreateApiEndpointAny;
  };
  modalPosition?: { x: number; y: number };
}

/**
 * Navigation stack store interface
 */
interface NavigationStackStore {
  /**
   * Current navigation stack
   */
  stack: NavigationStackEntry[];

  /**
   * True while a push/replace is preloading the widget for the next entry.
   * The base layer stays visible during this time.
   */
  isPushPending: boolean;

  /**
   * Navigate to a new endpoint with type-safe parameters.
   * Preloads the endpoint's lazy widget before pushing so the old view
   * stays visible until the new one is fully ready.
   */
  push: <TEndpoint extends CreateApiEndpointAny>(
    endpoint: TEndpoint,
    options?: NavigationOptions<TEndpoint>,
  ) => void;

  /**
   * Replace the top of the stack with a new endpoint
   * Useful for redirecting after successful creation (e.g., POST -> GET)
   */
  replace: <TEndpoint extends CreateApiEndpointAny>(
    endpoint: TEndpoint,
    options?: NavigationOptions<TEndpoint>,
  ) => void;

  /**
   * Go back to previous endpoint in navigation stack
   */
  pop: (count?: number) => void;
}

/**
 * Create a new navigation stack store instance
 * Each context provider will have its own isolated store
 */

function createNavigationStackStore(): StoreApi<NavigationStackStore> {
  return createStore<NavigationStackStore>((set) => ({
    stack: [],
    isPushPending: false,

    push: <TEndpoint extends CreateApiEndpointAny>(
      endpoint: TEndpoint,
      options: NavigationOptions<TEndpoint> = {},
    ): void => {
      const {
        urlPathParams,
        data,
        prefillFromGet = false,
        getEndpoint,
        renderInModal = false,
        popNavigationOnSuccess,
        onSuccessCallback,
        pickerCallback,
        pickerLabelField,
        replaceOnSuccess,
        modalPosition,
      } = options;

      const entry: NavigationStackEntry<TEndpoint> = {
        endpoint,
        params: { urlPathParams, data },
        timestamp: Date.now(),
        prefillFromGet,
        getEndpoint,
        renderInModal,
        popNavigationOnSuccess,
        onSuccessCallback,
        pickerCallback,
        pickerLabelField,
        replaceOnSuccess,
        modalPosition,
      };

      // Preload the widget before showing the new view so the old view stays
      // visible until the new one is fully ready (no flash / blank frame).
      set({ isPushPending: true });
      void preloadEndpointWidget(endpoint).then(() => {
        set((state) => ({
          stack: [...state.stack, entry as NavigationStackEntry],
          isPushPending: false,
        }));
        return undefined;
      });
    },

    replace: <TEndpoint extends CreateApiEndpointAny>(
      endpoint: TEndpoint,
      options: NavigationOptions<TEndpoint> = {},
    ): void => {
      const {
        urlPathParams,
        data,
        prefillFromGet = false,
        getEndpoint,
        renderInModal = false,
        popNavigationOnSuccess,
        onSuccessCallback,
        pickerCallback,
        pickerLabelField,
        replaceOnSuccess,
        modalPosition,
      } = options;

      const entry: NavigationStackEntry<TEndpoint> = {
        endpoint,
        params: { urlPathParams, data },
        timestamp: Date.now(),
        prefillFromGet,
        getEndpoint,
        renderInModal,
        popNavigationOnSuccess,
        onSuccessCallback,
        pickerCallback,
        pickerLabelField,
        replaceOnSuccess,
        modalPosition,
      };

      set({ isPushPending: true });
      void preloadEndpointWidget(endpoint).then(() => {
        set((state) => {
          if (state.stack.length === 0) {
            return {
              stack: [entry as NavigationStackEntry],
              isPushPending: false,
            };
          }
          return {
            stack: [...state.stack.slice(0, -1), entry as NavigationStackEntry],
            isPushPending: false,
          };
        });
        return undefined;
      });
    },

    pop: (count = 1): void => {
      set((state) => {
        if (state.stack.length === 0) {
          // eslint-disable-next-line no-console
          console.warn("Navigation: Cannot pop - stack is empty");
          return state;
        }
        const newLength = Math.max(0, state.stack.length - count);
        return {
          stack: state.stack.slice(0, newLength),
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
    options?: NavigationOptions<TEndpoint>,
    nativePush?: <TEndpoint extends CreateApiEndpointAny>(
      endpoint: TEndpoint,
      options?: NavigationOptions<TEndpoint>,
    ) => void,
  ) => void;
  replace: <TEndpoint extends CreateApiEndpointAny>(
    endpoint: TEndpoint,
    options?: NavigationOptions<TEndpoint>,
  ) => void;
  pop: (count?: number) => void;
  stack: NavigationStackEntry[];
  canGoBack: boolean;
  current: NavigationStackEntry | null;
  isPushPending: boolean;
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
  const isPushPending = useStore(store, (state) => state.isPushPending);

  const canGoBack = stack.length > 0;
  const current = stack.length > 0 ? stack[stack.length - 1] : null;

  return {
    push,
    replace,
    pop,
    stack,
    canGoBack,
    current,
    isPushPending,
  };
}

export type UseNavigationStackReturn = ReturnType<typeof useNavigationStack>;
