/**
 * Widget Context Provider
 * Provides Zustand store instance via React Context for widget rendering
 */

"use client";

import type { ReactElement, ReactNode } from "react";
import { useEffect, useRef } from "react";

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

  // Initialize store once on first render
  if (!storeRef.current) {
    storeRef.current = createWidgetContextStore<
      CreateApiEndpointAny,
      ReactWidgetContext<CreateApiEndpointAny>
    >(context as ReactWidgetContext<CreateApiEndpointAny>);
  }
  const store = storeRef.current;

  // Sync context updates after render to avoid setState-during-render
  useEffect(() => {
    store
      .getState()
      .setContext(context as ReactWidgetContext<CreateApiEndpointAny>);
  });

  // Expose form.setValue on window for browser E2E tests so programmatic
  // field filling can bypass custom UI components (e.g. Radix Select).
  useEffect((): (() => void) | void => {
    if (typeof window === "undefined" || !context.form) {
      return;
    }
    type SetValueFn = (
      name: string,
      value: string | number | boolean,
      options?: {
        shouldValidate?: boolean;
        shouldDirty?: boolean;
        shouldTouch?: boolean;
      },
    ) => void;
    type E2EWindow = Window & { __formSetValue?: SetValueFn };
    const formSetValue = context.form.setValue as SetValueFn;
    (window as E2EWindow).__formSetValue = formSetValue;
    return () => {
      if ((window as E2EWindow).__formSetValue === formSetValue) {
        delete (window as E2EWindow).__formSetValue;
      }
    };
  }, [context.form]);

  return (
    <WidgetContextStoreContext.Provider value={store}>
      {children}
    </WidgetContextStoreContext.Provider>
  );
}
