/**
 * Ink Widget Context Provider
 * Provides Zustand store instance via React Context for CLI/Ink widget rendering
 * Separate from React context to maintain type safety
 */

"use client";

import type { ReactElement, ReactNode } from "react";
import { useRef } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";

import type { InkWidgetContext } from "./cli-types";
import { InkWidgetContextStoreContext } from "./use-ink-widget-context";
import { createWidgetContextStore } from "./widget-context-store";

/**
 * Ink Widget Context Provider Props
 */
export interface InkWidgetContextProviderProps<
  TEndpoint extends CreateApiEndpointAny,
> {
  context: InkWidgetContext<TEndpoint>;
  children: ReactNode;
}

/**
 * Ink Widget Context Provider
 * Creates a Zustand store instance and provides it via React Context
 * This allows CLI widgets to subscribe to specific context properties via hooks
 */
export function InkWidgetContextProvider<
  TEndpoint extends CreateApiEndpointAny,
>({
  context,
  children,
}: InkWidgetContextProviderProps<TEndpoint>): ReactElement {
  // Create store instance once and initialize with context immediately
  // Using useRef to avoid recreating the store on every render
  const storeRef = useRef<ReturnType<
    typeof createWidgetContextStore<
      CreateApiEndpointAny,
      InkWidgetContext<CreateApiEndpointAny>
    >
  > | null>(null);
  if (!storeRef.current) {
    storeRef.current = createWidgetContextStore<
      CreateApiEndpointAny,
      InkWidgetContext<CreateApiEndpointAny>
    >(context as InkWidgetContext<CreateApiEndpointAny>);
  }
  const store = storeRef.current;

  // Update store synchronously when context changes (before render)
  // This ensures context is always up-to-date before children render
  store.setState({
    context: context as InkWidgetContext<CreateApiEndpointAny>,
  });

  return (
    <InkWidgetContextStoreContext.Provider value={store}>
      {children}
    </InkWidgetContextStoreContext.Provider>
  );
}
