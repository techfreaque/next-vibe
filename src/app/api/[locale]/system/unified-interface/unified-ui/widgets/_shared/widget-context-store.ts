/**
 * Widget Context Store
 * Zustand store for widget rendering context to avoid prop drilling and optimize re-renders
 */

import { create, type StoreApi, type UseBoundStore } from "zustand";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";

import type { InkWidgetContext } from "./cli-types";
import type { ReactWidgetContext } from "./react-types";

/**
 * Widget Context Store State
 * Can hold either React or Ink context
 * Context is guaranteed to be non-null - initialized synchronously in provider
 */
export interface WidgetContextStore<
  TEndpoint extends CreateApiEndpointAny,
  TContext extends ReactWidgetContext<TEndpoint> | InkWidgetContext<TEndpoint> =
    | ReactWidgetContext<TEndpoint>
    | InkWidgetContext<TEndpoint>,
> {
  context: TContext;
  setContext: (context: TContext) => void;
}

/**
 * Type for the widget context store (Zustand UseBoundStore)
 */
export type WidgetContextStoreType<
  TEndpoint extends CreateApiEndpointAny,
  TContext extends ReactWidgetContext<TEndpoint> | InkWidgetContext<TEndpoint> =
    | ReactWidgetContext<TEndpoint>
    | InkWidgetContext<TEndpoint>,
> = UseBoundStore<StoreApi<WidgetContextStore<TEndpoint, TContext>>>;

/**
 * Create a widget context store
 * Each endpoint renderer should create its own store instance
 */
export function createWidgetContextStore<
  TEndpoint extends CreateApiEndpointAny,
  TContext extends ReactWidgetContext<TEndpoint> | InkWidgetContext<TEndpoint>,
>(initialContext: TContext): WidgetContextStoreType<TEndpoint, TContext> {
  return create<WidgetContextStore<TEndpoint, TContext>>((set) => ({
    context: initialContext,
    setContext: (newContext): void =>
      set((state) => {
        // If no existing context, just set it (first initialization)
        if (!state.context) {
          return { context: newContext };
        }

        // Only update if context actually changed
        // Shallow equality check on object properties
        if (state.context === newContext) {
          return state;
        }

        // Check if any property is different using keyof to get proper types
        const keys = Object.keys(newContext) as Array<keyof TContext>;
        let hasChanges = false;
        for (const key of keys) {
          if (newContext[key] !== state.context[key]) {
            hasChanges = true;
            break;
          }
        }

        // Return new context only if there were changes
        return hasChanges ? { context: newContext } : state;
      }),
  }));
}
