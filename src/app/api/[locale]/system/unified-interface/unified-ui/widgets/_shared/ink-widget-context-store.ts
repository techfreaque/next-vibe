/**
 * Ink Widget Context Store
 * Zustand store for CLI/Ink widget rendering context
 * Separate from React context to maintain type safety
 */

import { create, type StoreApi, type UseBoundStore } from "zustand";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";

import type { InkWidgetContext } from "./cli-types";

/**
 * Ink Widget Context Store State
 */
export interface InkWidgetContextStore<TEndpoint extends CreateApiEndpointAny> {
  context: InkWidgetContext<TEndpoint>;
  setContext: (context: InkWidgetContext<TEndpoint>) => void;
}

/**
 * Type for the Ink widget context store (Zustand UseBoundStore)
 */
export type InkWidgetContextStoreType<TEndpoint extends CreateApiEndpointAny> =
  UseBoundStore<StoreApi<InkWidgetContextStore<TEndpoint>>>;

/**
 * Create an Ink widget context store
 * Each CLI endpoint renderer should create its own store instance
 */
export function createInkWidgetContextStore<
  TEndpoint extends CreateApiEndpointAny,
>(
  initialContext: InkWidgetContext<TEndpoint>,
): InkWidgetContextStoreType<TEndpoint> {
  return create<InkWidgetContextStore<TEndpoint>>((set) => ({
    context: initialContext,
    setContext: (newContext): void =>
      set((state) => {
        // If no existing context, just set it (first initialization)
        if (!state.context) {
          return { context: newContext };
        }

        // Only update if context actually changed
        // Check if any property is different
        const keys = Object.keys(newContext) as Array<
          keyof InkWidgetContext<TEndpoint>
        >;
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
