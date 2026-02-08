/**
 * Widget Context Hooks
 * Hooks for accessing widget context from Zustand store with optimized selectors
 */

"use client";

import { createContext, useContext } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TranslatedKeyType } from "@/i18n/core/scoped-translation";
import type { TParams } from "@/i18n/core/static-types";

import type { UseNavigationStackReturn } from "../../../react/hooks/use-navigation-stack";
import type { EndpointLogger } from "../../../shared/logger/endpoint";
import type { ReactWidgetContext } from "./react-types";
import type { BaseWidgetContext } from "./types";
import type {
  WidgetContextStore,
  WidgetContextStoreType,
} from "./widget-context-store";

/**
 * React Context for the Zustand store
 * This allows us to have different store instances for different endpoint renderers
 */
export const WidgetContextStoreContext = createContext<WidgetContextStoreType<
  CreateApiEndpointAny,
  ReactWidgetContext<CreateApiEndpointAny>
> | null>(null);

/**
 * Hook to get the widget context store
 * Returns the store as CreateApiEndpointAny since React Context cannot be properly generic
 */
function useWidgetContextStore<
  TEndpoint extends CreateApiEndpointAny,
>(): WidgetContextStoreType<TEndpoint, ReactWidgetContext<TEndpoint>> {
  const store = useContext(WidgetContextStoreContext);
  if (!store) {
    // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Provider check
    throw new Error(
      "useWidgetContextStore must be used within a WidgetContextStoreProvider",
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- React Context cannot be properly generic
  return store as any as WidgetContextStoreType<
    TEndpoint,
    ReactWidgetContext<TEndpoint>
  >;
}

/**
 * Hook to get the entire widget context
 * Use this sparingly - prefer specific selectors below for better performance
 */
export function useWidgetContext(): ReactWidgetContext<CreateApiEndpointAny> {
  const store = useWidgetContextStore();
  return store(
    (
      state: WidgetContextStore<
        CreateApiEndpointAny,
        ReactWidgetContext<CreateApiEndpointAny>
      >,
    ) => state.context,
  );
}

/**
 * Hook to get locale from context
 */
export function useWidgetLocale(): CountryLanguage {
  const store = useWidgetContextStore();
  return store(
    (
      state: WidgetContextStore<
        CreateApiEndpointAny,
        ReactWidgetContext<CreateApiEndpointAny>
      >,
    ) => state.context.locale,
  );
}

/**
 * Hook to get user from context
 */
export function useWidgetUser(): BaseWidgetContext<CreateApiEndpointAny>["user"] {
  const store = useWidgetContextStore();
  return store(
    (
      state: WidgetContextStore<
        CreateApiEndpointAny,
        ReactWidgetContext<CreateApiEndpointAny>
      >,
    ) => state.context.user,
  );
}

/**
 * Hook to get logger from context
 */
export function useWidgetLogger(): EndpointLogger {
  const store = useWidgetContextStore();
  return store(
    (
      state: WidgetContextStore<
        CreateApiEndpointAny,
        ReactWidgetContext<CreateApiEndpointAny>
      >,
    ) => state.context.logger,
  );
}

/**
 * Hook to get platform from context
 */
export function useWidgetPlatform(): BaseWidgetContext<CreateApiEndpointAny>["platform"] {
  const store = useWidgetContextStore();
  return store(
    (
      state: WidgetContextStore<
        CreateApiEndpointAny,
        ReactWidgetContext<CreateApiEndpointAny>
      >,
    ) => state.context.platform,
  );
}

/**
 * Hook to get endpoint fields from context
 */
export function useWidgetEndpointFields(): CreateApiEndpointAny["fields"] {
  const store = useWidgetContextStore();
  return store(
    (
      state: WidgetContextStore<
        CreateApiEndpointAny,
        ReactWidgetContext<CreateApiEndpointAny>
      >,
    ) => state.context.endpointFields,
  );
}

/**
 * Hook to get disabled state from context
 */
export function useWidgetDisabled(): boolean {
  const store = useWidgetContextStore();
  return store(
    (
      state: WidgetContextStore<
        CreateApiEndpointAny,
        ReactWidgetContext<CreateApiEndpointAny>
      >,
    ) => state.context.disabled,
  );
}

/**
 * Hook to get response from context
 */
export function useWidgetResponse(): BaseWidgetContext<CreateApiEndpointAny>["response"] {
  const store = useWidgetContextStore();
  return store(
    (
      state: WidgetContextStore<
        CreateApiEndpointAny,
        ReactWidgetContext<CreateApiEndpointAny>
      >,
    ) => state.context.response,
  );
}

/**
 * Hook to get navigation from context
 */
export function useWidgetNavigation(): UseNavigationStackReturn {
  const store = useWidgetContextStore();
  return store(
    (
      state: WidgetContextStore<
        CreateApiEndpointAny,
        ReactWidgetContext<CreateApiEndpointAny>
      >,
    ) => state.context.navigation,
  );
}

/**
 * Hook to get endpoint from context
 */
export function useWidgetEndpoint<
  TEndpoint extends CreateApiEndpointAny,
>(): TEndpoint {
  const store = useWidgetContextStore<TEndpoint>();
  return store(
    (state: WidgetContextStore<TEndpoint, ReactWidgetContext<TEndpoint>>) =>
      state.context.endpoint,
  );
}

/**
 * Hook to get translation function from context
 */
export function useWidgetTranslation(): <K extends string>(
  key: K,
  params?: TParams,
) => TranslatedKeyType {
  const store = useWidgetContextStore();
  return store(
    (
      state: WidgetContextStore<
        CreateApiEndpointAny,
        ReactWidgetContext<CreateApiEndpointAny>
      >,
    ) => state.context.t,
  );
}

/**
 * Hook to get endpoint mutations from context
 */
export function useWidgetEndpointMutations(): BaseWidgetContext<CreateApiEndpointAny>["endpointMutations"] {
  const store = useWidgetContextStore();
  return store(
    (
      state: WidgetContextStore<
        CreateApiEndpointAny,
        ReactWidgetContext<CreateApiEndpointAny>
      >,
    ) => state.context.endpointMutations,
  );
}

/**
 * Hook to get isInteractive from context
 */
export function useWidgetIsInteractive(): boolean {
  const store = useWidgetContextStore();
  return store(
    (
      state: WidgetContextStore<
        CreateApiEndpointAny,
        ReactWidgetContext<CreateApiEndpointAny>
      >,
    ) => state.context.isInteractive,
  );
}

/**
 * Hook to get form from context (React Hook Form only)
 * Use this in React widgets. CLI widgets should use useInkWidgetForm from use-ink-widget-context.
 */
export function useWidgetForm<
  TEndpoint extends CreateApiEndpointAny,
>(): ReactWidgetContext<TEndpoint>["form"] {
  const store = useWidgetContextStore();
  return store(
    (
      state: WidgetContextStore<
        CreateApiEndpointAny,
        ReactWidgetContext<CreateApiEndpointAny>
      >,
    ) => state.context.form,
  );
}

/**
 * Hook to get onSubmit from context
 */
export function useWidgetOnSubmit(): (() => void) | undefined {
  const store = useWidgetContextStore();
  return store(
    (
      state: WidgetContextStore<
        CreateApiEndpointAny,
        ReactWidgetContext<CreateApiEndpointAny>
      >,
    ) => state.context.onSubmit,
  );
}

/**
 * Hook to get onCancel from context
 */
export function useWidgetOnCancel(): (() => void) | undefined {
  const store = useWidgetContextStore();
  return store(
    (
      state: WidgetContextStore<
        CreateApiEndpointAny,
        ReactWidgetContext<CreateApiEndpointAny>
      >,
    ) => state.context.onCancel,
  );
}

/**
 * Hook to get isSubmitting from context
 */
export function useWidgetIsSubmitting(): boolean | undefined {
  const store = useWidgetContextStore();
  return store(
    (
      state: WidgetContextStore<
        CreateApiEndpointAny,
        ReactWidgetContext<CreateApiEndpointAny>
      >,
    ) => state.context.isSubmitting,
  );
}

/**
 * Hook to get submitButton config from context
 */
export function useWidgetSubmitButton(): ReactWidgetContext<CreateApiEndpointAny>["submitButton"] {
  const store = useWidgetContextStore();
  return store(
    (
      state: WidgetContextStore<
        CreateApiEndpointAny,
        ReactWidgetContext<CreateApiEndpointAny>
      >,
    ) => state.context.submitButton,
  );
}

/**
 * Hook to get cancelButton config from context
 */
export function useWidgetCancelButton(): ReactWidgetContext<CreateApiEndpointAny>["cancelButton"] {
  const store = useWidgetContextStore();
  return store(
    (
      state: WidgetContextStore<
        CreateApiEndpointAny,
        ReactWidgetContext<CreateApiEndpointAny>
      >,
    ) => state.context.cancelButton,
  );
}

/**
 * Hook to get buttonState from context
 */
export function useWidgetButtonState(): BaseWidgetContext<CreateApiEndpointAny>["buttonState"] {
  const store = useWidgetContextStore();
  return store(
    (
      state: WidgetContextStore<
        CreateApiEndpointAny,
        ReactWidgetContext<CreateApiEndpointAny>
      >,
    ) => state.context.buttonState,
  );
}

/**
 * Hook to get responseOnly flag from context
 */
export function useWidgetResponseOnly(): boolean | undefined {
  const store = useWidgetContextStore();
  return store(
    (
      state: WidgetContextStore<
        CreateApiEndpointAny,
        ReactWidgetContext<CreateApiEndpointAny>
      >,
    ) => state.context.responseOnly,
  );
}
