// eslint-disable-next-line react-compiler/react-compiler
/* eslint-disable react-hooks/rules-of-hooks */

"use client";

import { useEffect, useMemo } from "react";

import type { DeepPartial } from "@/app/api/[locale]/shared/types/utils";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";

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

    // Merge defaultValues priority: endpoint < hook < autoPrefill < initialState
    const mergedDefaultValues = deepMerge(
      primaryEndpoint.options?.formOptions?.defaultValues,
      options.formOptions?.defaultValues,
      options.autoPrefillData,
      options.initialState,
    );

    return {
      ...merged,
      defaultValues: mergedDefaultValues,
    } as ApiFormOptions<TEndpoint["types"]["RequestOutput"]>;
  }, [
    primaryEndpoint.options,
    options.formOptions,
    options.autoPrefillData,
    options.initialState,
  ]);

  const mergedMutationOptions = useMemo(() => {
    return deepMerge(
      (primaryEndpoint.options?.mutationOptions ?? {}) as ApiMutationOptions<
        TEndpoint["types"]["RequestOutput"],
        TEndpoint["types"]["ResponseOutput"],
        TEndpoint["types"]["UrlVariablesOutput"]
      >,
      (options.mutationOptions ?? {}) as ApiMutationOptions<
        TEndpoint["types"]["RequestOutput"],
        TEndpoint["types"]["ResponseOutput"],
        TEndpoint["types"]["UrlVariablesOutput"]
      >,
    ) as ApiMutationOptions<
      TEndpoint["types"]["RequestOutput"],
      TEndpoint["types"]["ResponseOutput"],
      TEndpoint["types"]["UrlVariablesOutput"]
    >;
  }, [primaryEndpoint.options, options.mutationOptions]);

  // Use the existing mutation form hook with merged options
  const formResult = useApiForm(
    primaryEndpoint,
    logger,
    mergedFormOptions,
    mergedMutationOptions,
  );

  // Reset form when autoPrefillData or initialState changes (after initial render)
  // This handles cases where data is loaded asynchronously after mount
  useEffect(() => {
    if (formResult?.form && (options.autoPrefillData || options.initialState)) {
      const dataToReset = {
        ...options.autoPrefillData,
        ...options.initialState,
      };
      if (Object.keys(dataToReset).length > 0) {
        formResult.form.reset(dataToReset);
      }
    }
  }, [options.autoPrefillData, options.initialState, formResult?.form]);

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
