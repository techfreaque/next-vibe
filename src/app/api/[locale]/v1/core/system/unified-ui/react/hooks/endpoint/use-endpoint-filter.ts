// eslint-disable-next-line react-compiler/react-compiler
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useMemo } from "react";
import type z from "zod";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type {
  ExtractInput,
  ExtractOutput,
  FieldUsage,
  InferSchemaFromField,
  UnifiedField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/types";
import type { CreateApiEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import type { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/types";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { useApiQueryForm } from "../query-form";
import type {
  ApiQueryFormOptions,
  ApiQueryFormReturn,
  ApiQueryOptions,
} from "../types";

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
  TEndpoint extends CreateApiEndpoint<any, any, any, any>,
>(
  filterEndpoint: TEndpoint | null,
  logger: EndpointLogger,
  options: {
    formOptions?: ApiQueryFormOptions<any>;
    queryOptions?: ApiQueryOptions<any, any, any>;
    urlParams?: any;
    initialFilters?: any;
  } = {},
): any {
  // Return null if endpoint is not provided
  if (!filterEndpoint) {
    return null;
  }
  const {
    formOptions = { persistForm: true, autoSubmit: true, debounceMs: 300 },
    queryOptions = {},
    urlParams = {} as ExtractOutput<
      InferSchemaFromField<TFields, FieldUsage.RequestUrlParams>
    >,
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
      } as Partial<
        ExtractInput<InferSchemaFromField<TFields, FieldUsage.RequestData>>
      >, // Type assertion for form defaults
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
  const queryFormResult = useApiQueryForm<
    TExampleKey,
    TMethod,
    TUserRoleValue,
    TFields
  >({
    endpoint: filterEndpoint,
    urlVariables: urlParams,
    queryOptions: enhancedQueryOptions,
    formOptions: enhancedFormOptions as ApiQueryFormOptions<
      ExtractInput<InferSchemaFromField<TFields, FieldUsage.RequestData>>
    >,
    logger: logger,
  });

  return queryFormResult;
}
