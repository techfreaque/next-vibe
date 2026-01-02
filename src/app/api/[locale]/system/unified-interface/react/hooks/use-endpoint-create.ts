// eslint-disable-next-line react-compiler/react-compiler
/* eslint-disable react-hooks/rules-of-hooks */

"use client";

import { useEffect, useMemo } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";

import { mergeFormData } from "./endpoint-utils";
import type { ApiFormOptions, ApiFormReturn, ApiMutationOptions } from "./types";
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
    autoPrefillData?: Partial<TEndpoint["types"]["RequestOutput"]>;
    initialState?: Partial<TEndpoint["types"]["RequestOutput"]>;
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
  const {
    formOptions = { persistForm: true },
    mutationOptions = {},
    autoPrefillData,
    initialState,
  } = options;

  // Merge all form data sources (defaultValues < autoPrefillData < initialState < savedData)
  const enhancedFormOptions = useMemo(() => {
    if (!primaryEndpoint) {
      return formOptions;
    }

    // No local storage - savedData is always null

    const mergedDefaultValues = mergeFormData(
      formOptions.defaultValues,
      autoPrefillData,
      initialState,
    );

    return {
      ...formOptions,
      defaultValues: mergedDefaultValues,
    } as ApiFormOptions<TEndpoint["types"]["RequestOutput"]>;
  }, [formOptions, autoPrefillData, initialState, primaryEndpoint]);

  // Use the existing mutation form hook with enhanced options
  const formResult = useApiForm(primaryEndpoint, logger, enhancedFormOptions, mutationOptions);

  // Reset form when autoPrefillData becomes available (after initial render)
  useEffect(() => {
    if (autoPrefillData && formResult?.form && Object.keys(autoPrefillData).length > 0) {
      formResult.form.reset(autoPrefillData as never);
    }
  }, [autoPrefillData, formResult?.form]);

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
      } as never);
    };

    return {
      ...formResult,
      submitForm: wrappedSubmitForm,
    };
  }

  return formResult;
}
