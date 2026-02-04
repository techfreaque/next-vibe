/**
 * Ink Widget Context Hooks
 * Hooks for accessing CLI/Ink widget context from Zustand store
 * Separate from React hooks to maintain type safety
 */

"use client";

import { createContext, useContext } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TranslatedKeyType } from "@/i18n/core/scoped-translation";
import type { TParams } from "@/i18n/core/static-types";

import type { EndpointLogger } from "../../../shared/logger/endpoint";
import type { InkFormState, InkWidgetContext } from "./cli-types";
import type { BaseWidgetContext } from "./types";
import type {
  WidgetContextStore,
  WidgetContextStoreType,
} from "./widget-context-store";

/**
 * React Context for the Ink Zustand store
 */
export const InkWidgetContextStoreContext =
  createContext<WidgetContextStoreType<
    CreateApiEndpointAny,
    InkWidgetContext<CreateApiEndpointAny>
  > | null>(null);

/**
 * Hook to get the Ink widget context store
 */
function useInkWidgetContextStore(): WidgetContextStoreType<
  CreateApiEndpointAny,
  InkWidgetContext<CreateApiEndpointAny>
> {
  const store = useContext(InkWidgetContextStoreContext);
  if (!store) {
    // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Provider check
    throw new Error(
      "useInkWidgetContextStore must be used within an InkWidgetContextProvider",
    );
  }
  return store;
}

/**
 * Hook to get the entire Ink widget context
 */
export function useInkWidgetContext(): InkWidgetContext<CreateApiEndpointAny> {
  const store = useInkWidgetContextStore();
  return store(
    (
      state: WidgetContextStore<
        CreateApiEndpointAny,
        InkWidgetContext<CreateApiEndpointAny>
      >,
    ) => state.context,
  );
}

/**
 * Hook to get locale from Ink context
 */
export function useInkWidgetLocale(): CountryLanguage {
  const store = useInkWidgetContextStore();
  return store(
    (
      state: WidgetContextStore<
        CreateApiEndpointAny,
        InkWidgetContext<CreateApiEndpointAny>
      >,
    ) => state.context.locale,
  );
}

/**
 * Hook to get user from Ink context
 */
export function useInkWidgetUser(): BaseWidgetContext<CreateApiEndpointAny>["user"] {
  const store = useInkWidgetContextStore();
  return store(
    (
      state: WidgetContextStore<
        CreateApiEndpointAny,
        InkWidgetContext<CreateApiEndpointAny>
      >,
    ) => state.context.user,
  );
}

/**
 * Hook to get logger from Ink context
 */
export function useInkWidgetLogger(): EndpointLogger {
  const store = useInkWidgetContextStore();
  return store(
    (
      state: WidgetContextStore<
        CreateApiEndpointAny,
        InkWidgetContext<CreateApiEndpointAny>
      >,
    ) => state.context.logger,
  );
}

/**
 * Hook to get platform from Ink context
 */
export function useInkWidgetPlatform(): BaseWidgetContext<CreateApiEndpointAny>["platform"] {
  const store = useInkWidgetContextStore();
  return store(
    (
      state: WidgetContextStore<
        CreateApiEndpointAny,
        InkWidgetContext<CreateApiEndpointAny>
      >,
    ) => state.context.platform,
  );
}

/**
 * Hook to get Ink form state from context
 */
export function useInkWidgetForm():
  | InkFormState<CreateApiEndpointAny["types"]["RequestOutput"]>
  | undefined {
  const store = useInkWidgetContextStore();
  return store(
    (
      state: WidgetContextStore<
        CreateApiEndpointAny,
        InkWidgetContext<CreateApiEndpointAny>
      >,
    ) => state.context.form,
  );
}

/**
 * Hook to get response from Ink context
 */
export function useInkWidgetResponse(): InkWidgetContext<CreateApiEndpointAny>["response"] {
  const store = useInkWidgetContextStore();
  return store(
    (
      state: WidgetContextStore<
        CreateApiEndpointAny,
        InkWidgetContext<CreateApiEndpointAny>
      >,
    ) => state.context.response,
  );
}

/**
 * Hook to get responseOnly flag from Ink context
 */
export function useInkWidgetResponseOnly(): boolean {
  const store = useInkWidgetContextStore();
  return store(
    (
      state: WidgetContextStore<
        CreateApiEndpointAny,
        InkWidgetContext<CreateApiEndpointAny>
      >,
    ) => state.context.responseOnly ?? false,
  );
}

/**
 * Hook to get translation function from Ink context
 */
export function useInkWidgetTranslation(): <K extends string>(
  key: K,
  params?: TParams,
) => TranslatedKeyType {
  const store = useInkWidgetContextStore();
  const t = store(
    (
      state: WidgetContextStore<
        CreateApiEndpointAny,
        InkWidgetContext<CreateApiEndpointAny>
      >,
    ) => state.context.t,
  );
  return t;
}
