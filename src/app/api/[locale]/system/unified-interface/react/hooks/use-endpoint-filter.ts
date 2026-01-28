// eslint-disable-next-line react-compiler/react-compiler
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useMemo } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { CreateApiEndpointAny } from "../../shared/types/endpoint-base";
import type {
  ApiQueryFormOptions,
  ApiQueryFormReturn,
  ApiQueryOptions,
} from "./types";
import { useApiQueryForm } from "./use-api-query-form";

/**
 * Creates a filtering form for list endpoints
 * Works similar to mutation forms but for filtering data
 *
 * Features:
 * - Form validation using Zod schema
 * - Form persistence using localStorage
 * - Automatic query updates based on form values
 * - Debounced form submissions to prevent excessive API calls
 * - Pagination support
 * - Sorting support
 *
 * @param filterEndpoint - The API endpoint to use for filtering (should be LIST_FILTER type)
 * @param options - Form and query options
 * @returns Filter form for API interaction with enhanced error handling
 */
export function useEndpointFilter<TEndpoint extends CreateApiEndpointAny>(
  filterEndpoint: TEndpoint | null,
  logger: EndpointLogger,
  options: {
    formOptions?: ApiQueryFormOptions<TEndpoint["types"]["RequestOutput"]>;
    queryOptions?: ApiQueryOptions<
      TEndpoint["types"]["RequestOutput"],
      TEndpoint["types"]["ResponseOutput"],
      TEndpoint["types"]["UrlVariablesOutput"]
    >;
    urlPathParams?: TEndpoint["types"]["UrlVariablesOutput"];
    initialFilters?: Partial<TEndpoint["types"]["RequestOutput"]>;
  } = {},
): ApiQueryFormReturn<
  TEndpoint["types"]["RequestOutput"],
  TEndpoint["types"]["ResponseOutput"],
  TEndpoint["types"]["UrlVariablesOutput"]
> | null {
  // Return null if endpoint is not provided
  if (!filterEndpoint) {
    return null;
  }
  const {
    formOptions = { persistForm: true, autoSubmit: true, debounceMs: 300 },
    queryOptions = {},
    urlPathParams = {} as TEndpoint["types"]["UrlVariablesOutput"],
    initialFilters,
  } = options;

  // Merge initial filters with pagination and sorting
  const enhancedFormOptions: ApiQueryFormOptions<
    TEndpoint["types"]["RequestOutput"]
  > = useMemo(() => {
    if (!filterEndpoint) {
      return formOptions;
    }

    const mergedDefaultValues: Partial<TEndpoint["types"]["RequestOutput"]> = {
      ...formOptions,
      defaultValues: {
        ...formOptions.defaultValues,
        ...initialFilters,
      },
      // Generate storage key for form persistence
      persistenceKey:
        formOptions.persistenceKey ||
        // eslint-disable-next-line i18next/no-literal-string
        `filter-${filterEndpoint.path.join("-")}-${filterEndpoint.method}`,
    };
    return mergedDefaultValues;
  }, [formOptions, initialFilters, filterEndpoint]);

  // Enhanced query options for filtering
  const enhancedQueryOptions: ApiQueryOptions<
    TEndpoint["types"]["RequestOutput"],
    TEndpoint["types"]["ResponseOutput"],
    TEndpoint["types"]["UrlVariablesOutput"]
  > = useMemo(() => {
    return {
      enabled: true,
      refetchOnWindowFocus: false, // Don't refetch on focus for filters
      staleTime: 30 * 1000, // 30 seconds - shorter for dynamic data
      ...queryOptions,
    };
  }, [queryOptions]);

  // Use the existing query form hook with enhanced options
  // Only call the hook if endpoint is provided to avoid conditional hook calls
  const queryFormResult = useApiQueryForm({
    endpoint: filterEndpoint,
    urlPathParams: urlPathParams,
    queryOptions: enhancedQueryOptions,
    formOptions: enhancedFormOptions,
    logger: logger,
  });

  return queryFormResult;
}
