// eslint-disable-next-line react-compiler/react-compiler
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useMemo } from "react";

import type { CreateApiEndpoint } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";
import type { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

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
export function useEndpointFilter<
  TEndpoint extends CreateApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
    // eslint-disable-next-line no-restricted-syntax
    unknown
  >,
>(
  filterEndpoint: TEndpoint | null,
  logger: EndpointLogger,
  options: {
    formOptions?: ApiQueryFormOptions<TEndpoint["TRequestOutput"]>;
    queryOptions?: ApiQueryOptions<
      TEndpoint["TRequestOutput"],
      TEndpoint["TResponseOutput"],
      TEndpoint["TUrlVariablesOutput"]
    >;
    urlPathParams?: TEndpoint["TUrlVariablesOutput"];
    initialFilters?: Partial<TEndpoint["TRequestOutput"]>;
  } = {},
): ApiQueryFormReturn<
  TEndpoint["TRequestOutput"],
  TEndpoint["TResponseOutput"],
  TEndpoint["TUrlVariablesOutput"]
> | null {
  // Return null if endpoint is not provided
  if (!filterEndpoint) {
    return null;
  }
  const {
    formOptions = { persistForm: true, autoSubmit: true, debounceMs: 300 },
    queryOptions = {},
    urlPathParams = {} as TEndpoint["TUrlVariablesOutput"],
    initialFilters,
  } = options;

  // Merge initial filters with pagination and sorting
  const enhancedFormOptions = useMemo(() => {
    if (!filterEndpoint) {
      return formOptions;
    }

    return {
      ...formOptions,
      defaultValues: {
        ...formOptions.defaultValues,
        ...initialFilters,
      } as Partial<TEndpoint["TRequestInput"]>, // Type assertion for form defaults
      // Generate storage key for form persistence
      persistenceKey:
        formOptions.persistenceKey ||
        // eslint-disable-next-line i18next/no-literal-string
        `filter-${filterEndpoint.path.join("-")}-${filterEndpoint.method}`,
    };
  }, [formOptions, initialFilters, filterEndpoint]);

  // Enhanced query options for filtering
  const enhancedQueryOptions = useMemo(() => {
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
    formOptions: enhancedFormOptions as ApiQueryFormOptions<
      TEndpoint["TRequestOutput"]
    >,
    logger: logger,
  });

  return queryFormResult;
}
