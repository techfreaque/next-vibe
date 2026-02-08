/**
 * Widget Context Provider
 * Provides Zustand store instance via React Context for widget rendering
 */

"use client";

import type { ReactElement, ReactNode } from "react";
import { useRef } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";

import type { ReactWidgetContext } from "./react-types";
import { WidgetContextStoreContext } from "./use-widget-context";
import { createWidgetContextStore } from "./widget-context-store";

/**
 * Widget Context Provider Props
 */
export interface WidgetContextProviderProps<
  TEndpoint extends CreateApiEndpointAny,
> {
  context: ReactWidgetContext<TEndpoint>;
  children: ReactNode;
}

/**
 * Widget Context Provider
 * Creates a Zustand store instance and provides it via React Context
 * This allows widgets to subscribe to specific context properties via hooks
 */
export function WidgetContextProvider<TEndpoint extends CreateApiEndpointAny>({
  context,
  children,
}: WidgetContextProviderProps<TEndpoint>): ReactElement {
  // Create store instance once and initialize with context immediately
  // Using useRef to avoid recreating the store on every render
  const storeRef = useRef<ReturnType<
    typeof createWidgetContextStore<
      CreateApiEndpointAny,
      ReactWidgetContext<CreateApiEndpointAny>
    >
  > | null>(null);

  // Initialize store with current context
  if (!storeRef.current) {
    storeRef.current = createWidgetContextStore<
      CreateApiEndpointAny,
      ReactWidgetContext<CreateApiEndpointAny>
    >(context as ReactWidgetContext<CreateApiEndpointAny>);
  } else {
    // Update the store's internal state directly without triggering subscriptions during render
    // This is safe because we're just updating the store's state object, not calling setState
    const currentState = storeRef.current.getState();
    if (currentState.context !== context) {
      // Use Object.assign to update the internal state without triggering listeners
      Object.assign(currentState, {
        context: context as ReactWidgetContext<CreateApiEndpointAny>,
      });
    }
  }
  const store = storeRef.current;

  return (
    <WidgetContextStoreContext.Provider value={store}>
      {children}
    </WidgetContextStoreContext.Provider>
  );
}
