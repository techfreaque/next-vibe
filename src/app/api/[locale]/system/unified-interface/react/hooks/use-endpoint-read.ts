// eslint-disable-next-line react-compiler/react-compiler
/* eslint-disable react-hooks/rules-of-hooks */

"use client";

import { useMemo } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { CreateApiEndpointAny } from "../../shared/types/endpoint";
import type { AutoPrefillConfig, FormDataSources } from "./endpoint-types";
import { determineFormDataPriority } from "./endpoint-utils";
import type {
  ApiQueryFormOptions,
  ApiQueryFormReturn,
  ApiQueryOptions,
} from "./types";
import { useApiQueryForm } from "./use-api-query-form";

/**
 * Creates a query form integrated with API query based on the endpoint's request schema
 * Works with both React and React Native
 *
 * Features:
 * - Form validation using Zod schema
 * - Form persistence using platform-agnostic storage (enabled by default)
 * - API integration with error handling
 * - Auto-prefilling from saved data
 * - Debounced form submissions
 * - Form clearing based on environment and debug settings
 *
 * @param primaryEndpoint - The API endpoint to use for queries
 * @param options - Form and query options
 * @returns Query form for API interaction with enhanced error handling
 */
export function useEndpointRead<TEndpoint extends CreateApiEndpointAny>(
  primaryEndpoint: TEndpoint | null,
  logger: EndpointLogger,
  options: {
    formOptions?: ApiQueryFormOptions<TEndpoint["types"]["RequestOutput"]>;
    queryOptions?: ApiQueryOptions<
      TEndpoint["types"]["RequestOutput"],
      TEndpoint["types"]["ResponseOutput"],
      TEndpoint["types"]["UrlVariablesOutput"]
    >;
    urlPathParams?: TEndpoint["types"]["UrlVariablesOutput"];
    autoPrefillData?: Partial<TEndpoint["types"]["RequestOutput"]>;
    initialState?: Partial<TEndpoint["types"]["RequestOutput"]>;
    initialData?: TEndpoint["types"]["ResponseOutput"];
    autoPrefillConfig?: AutoPrefillConfig;
  } = {},
): ApiQueryFormReturn<
  TEndpoint["types"]["RequestOutput"],
  TEndpoint["types"]["ResponseOutput"],
  TEndpoint["types"]["UrlVariablesOutput"]
> | null {
  // Return null if endpoint is not provided
  if (!primaryEndpoint) {
    return null;
  }
  const {
    formOptions = { persistForm: true, autoSubmit: true, debounceMs: 500 },
    queryOptions = {},
    urlPathParams,
    autoPrefillData,
    initialState,
    initialData,
    autoPrefillConfig = {
      autoPrefill: true,
      autoPrefillFromLocalStorage: false,
      showUnsavedChangesAlert: true,
    },
  } = options;

  // Merge all form data sources with proper priority handling
  const enhancedFormOptions = useMemo(() => {
    // Prepare data sources - include initialData as server data source
    const dataSources: FormDataSources<TEndpoint["types"]["ResponseOutput"]> = {
      defaultValues: formOptions.defaultValues as Partial<
        TEndpoint["types"]["ResponseOutput"]
      >,
      serverData: (autoPrefillData ||
        initialData) as TEndpoint["types"]["ResponseOutput"],
      localStorageData: undefined,
      initialState: initialState as Partial<
        TEndpoint["types"]["ResponseOutput"]
      >,
    };

    // Determine final data with proper priority
    const { finalData } = determineFormDataPriority(
      dataSources,
      autoPrefillConfig,
    );

    // Merge urlPathParams into defaultValues for GET endpoints
    // This ensures form initializes with path/query params (e.g., { id: "thea" })
    // which triggers auto-submit to fetch the full data
    const defaultValuesWithUrlParams = {
      ...finalData,
      ...(urlPathParams as Partial<TEndpoint["types"]["RequestOutput"]>),
    } as TEndpoint["types"]["RequestOutput"];

    return {
      ...formOptions,
      defaultValues: defaultValuesWithUrlParams,
      // Store additional metadata for unsaved changes detection
      _dataSources: dataSources,
      _autoPrefillConfig: autoPrefillConfig,
    } as ApiQueryFormOptions<TEndpoint["types"]["RequestOutput"]> & {
      _dataSources: FormDataSources<TEndpoint["types"]["ResponseOutput"]>;
      _autoPrefillConfig: AutoPrefillConfig;
    };
  }, [
    formOptions,
    autoPrefillData,
    initialData,
    initialState,
    autoPrefillConfig,
    urlPathParams,
  ]);

  // Enhanced query options with initial data support
  const enhancedQueryOptions = useMemo(() => {
    return {
      ...queryOptions,
      // Keep query enabled so it gets cached properly in React Query
      // This allows optimistic updates (updateEndpointData) to find the cached data
      enabled: queryOptions.enabled ?? true,
      // Pass initial data for the query
      // This will be wrapped in a success response by useApiQuery
      initialData: initialData,
    };
  }, [queryOptions, initialData]);

  // Use the existing query form hook with enhanced options
  const queryFormResult = useApiQueryForm({
    endpoint: primaryEndpoint,
    urlPathParams: urlPathParams as TEndpoint["types"]["UrlVariablesOutput"],
    formOptions: enhancedFormOptions,
    queryOptions: enhancedQueryOptions,
    logger,
  });

  return queryFormResult;
}
