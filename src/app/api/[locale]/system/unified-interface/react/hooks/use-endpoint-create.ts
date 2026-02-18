// eslint-disable-next-line react-compiler/react-compiler
/* eslint-disable react-hooks/rules-of-hooks */

"use client";

import { useEffect, useMemo, useRef } from "react";

import type { DeepPartial } from "@/app/api/[locale]/shared/types/utils";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import { deepMerge } from "./endpoint-utils";
import type {
  ApiFormOptions,
  ApiFormReturn,
  ApiMutationOptions,
} from "./types";
import { useApiForm } from "./use-api-mutation-form";

/**
 * Creates a form integrated with API mutation based on the endpoint's request schema
 * Works with both React and React Native
 *
 * Features:
 * - Form validation using Zod schema
 * - Form persistence using localStorage (enabled by default)
 * - API integration with error handling
 * - Auto-prefilling from GET endpoint data (localStorage wins)
 * - Form clearing based on environment and debug settings
 * - Toast notifications for success and error states
 *
 * @param primaryEndpoint - The API endpoint to use for mutations
 * @param options - Form options including defaultValues and persistence options
 * @returns Form and mutation for API interaction with enhanced error handling
 */
export function useEndpointCreate<TEndpoint extends CreateApiEndpointAny>(
  primaryEndpoint: TEndpoint | null,
  logger: EndpointLogger,
  user: JwtPayloadType,
  options: {
    formOptions?: ApiFormOptions<TEndpoint["types"]["RequestOutput"]>;
    mutationOptions?: ApiMutationOptions<
      TEndpoint["types"]["RequestOutput"],
      TEndpoint["types"]["ResponseOutput"],
      TEndpoint["types"]["UrlVariablesOutput"]
    >;
    urlPathParams?: TEndpoint["types"]["UrlVariablesOutput"];
    autoPrefillData?: DeepPartial<TEndpoint["types"]["RequestOutput"]>;
    initialState?: DeepPartial<TEndpoint["types"]["RequestOutput"]>;
  } = {},
): ApiFormReturn<
  TEndpoint["types"]["RequestOutput"],
  TEndpoint["types"]["ResponseOutput"],
  TEndpoint["types"]["UrlVariablesOutput"]
> | null {
  // Return null if endpoint is not provided
  if (!primaryEndpoint) {
    return null;
  }

  // Stable serialized keys for object dependencies to prevent infinite re-renders
  // when callers pass new object literals on every render
  const urlPathParamsKey = JSON.stringify(options.urlPathParams ?? null);
  const autoPrefillDataKey = JSON.stringify(options.autoPrefillData ?? null);
  const initialStateKey = JSON.stringify(options.initialState ?? null);

  // Merge endpoint and hook options (hook takes priority)
  // Merge defaultValues separately to combine autoPrefillData and initialState
  const mergedFormOptions = useMemo(() => {
    const merged = deepMerge(
      (primaryEndpoint.options?.formOptions ?? {}) as ApiFormOptions<
        TEndpoint["types"]["RequestOutput"]
      >,
      (options.formOptions ?? {}) as ApiFormOptions<
        TEndpoint["types"]["RequestOutput"]
      >,
    );

    // Merge defaultValues priority: endpoint < hook < urlPathParams < autoPrefill < initialState
    // urlPathParams are included so requestUrlPathParamsField fields are pre-filled in the form
    const mergedDefaultValues = deepMerge(
      primaryEndpoint.options?.formOptions?.defaultValues,
      options.formOptions?.defaultValues,
      options.urlPathParams,
      options.autoPrefillData,
      options.initialState,
    );

    return {
      ...merged,
      defaultValues: mergedDefaultValues,
    } as ApiFormOptions<TEndpoint["types"]["RequestOutput"]>;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- serialized keys used for stable object comparison
  }, [
    primaryEndpoint.options,
    options.formOptions,
    urlPathParamsKey,
    autoPrefillDataKey,
    initialStateKey,
  ]);

  const mergedMutationOptions = useMemo(() => {
    const endpointMutOpts = primaryEndpoint.options?.mutationOptions as
      | ApiMutationOptions<
          TEndpoint["types"]["RequestOutput"],
          TEndpoint["types"]["ResponseOutput"],
          TEndpoint["types"]["UrlVariablesOutput"]
        >
      | undefined;
    const hookMutOpts = options.mutationOptions as
      | ApiMutationOptions<
          TEndpoint["types"]["RequestOutput"],
          TEndpoint["types"]["ResponseOutput"],
          TEndpoint["types"]["UrlVariablesOutput"]
        >
      | undefined;
    return deepMerge(endpointMutOpts, hookMutOpts);
  }, [primaryEndpoint.options, options.mutationOptions]);

  // Use the existing mutation form hook with merged options
  const formResult = useApiForm(
    primaryEndpoint,
    logger,
    user,
    mergedFormOptions,
    mergedMutationOptions,
  );

  // Track the previous serialized prefill key to avoid resetting when object references
  // change but values are identical (prevents infinite reset loops)
  const prevPrefillKeyRef = useRef<string | null>(null);
  const prefillKey = `${urlPathParamsKey}|${autoPrefillDataKey}|${initialStateKey}`;

  // Reset form when prefill data actually changes (after initial render)
  // Uses serialized comparison so new object literals don't cause spurious resets
  // urlPathParams are included so requestUrlPathParamsField fields display their values
  useEffect(() => {
    if (formResult?.form && prefillKey !== prevPrefillKeyRef.current) {
      prevPrefillKeyRef.current = prefillKey;
      const dataToReset = {
        ...options.urlPathParams,
        ...options.autoPrefillData,
        ...options.initialState,
      };
      if (Object.keys(dataToReset).length > 0) {
        formResult.form.reset(dataToReset);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- prefillKey is the stable serialized composite
  }, [prefillKey, formResult?.form]);

  // If no URL parameters are needed, return the form result as-is
  if (!options.urlPathParams) {
    return formResult;
  }

  // If URL parameters are provided, wrap the submitForm function to automatically include them
  if (formResult) {
    const originalSubmitForm = formResult.submitForm;

    const wrappedSubmitForm = (): Promise<void> | void => {
      return originalSubmitForm({
        urlParamVariables: options.urlPathParams,
      });
    };

    return {
      ...formResult,
      submitForm: wrappedSubmitForm,
    };
  }

  return formResult;
}
