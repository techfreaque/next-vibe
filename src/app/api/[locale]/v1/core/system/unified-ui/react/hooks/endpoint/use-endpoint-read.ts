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
import type { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { determineFormDataPriority } from "../form/data-priority";
import type { AutoPrefillConfig, FormDataSources } from "../form/types";
import { useApiQueryForm } from "../query-form";
import type {
  ApiQueryFormOptions,
  ApiQueryFormReturn,
  ApiQueryOptions,
} from "../types";

/**
 * Creates a query form integrated with API query based on the endpoint's request schema
 * Works with both React and React Native
 *
 * Features:
 * - Form validation using Zod schema
 * - Form persistence using localStorage (enabled by default)
 * - API integration with error handling
 * - Auto-prefilling from saved data
 * - Debounced form submissions
 * - Form clearing based on environment and debug settings
 *
 * @param primaryEndpoint - The API endpoint to use for queries
 * @param options - Form and query options
 * @returns Query form for API interaction with enhanced error handling
 */
export function useEndpointRead<
  TEndpoint extends CreateApiEndpoint<any, any, any, any>,
>(
  primaryEndpoint: TEndpoint | null,
  logger: EndpointLogger,
  options: {
    formOptions?: ApiQueryFormOptions<any>;
    queryOptions?: ApiQueryOptions<any, any, any>;
    urlParams?: any;
    autoPrefillData?: any;
    initialState?: any;
    autoPrefillConfig?: AutoPrefillConfig;
  } = {},
): any {
  // Return null if endpoint is not provided
  if (!primaryEndpoint) {
    return null;
  }
  const {
    formOptions = { persistForm: true, autoSubmit: true, debounceMs: 500 },
    queryOptions = {},
    urlParams = {} as ExtractOutput<
      InferSchemaFromField<TFields, FieldUsage.RequestUrlParams>
    >,
    autoPrefillData,
    initialState,
    autoPrefillConfig = {
      autoPrefill: true,
      autoPrefillFromLocalStorage: false,
      showUnsavedChangesAlert: true,
    },
  } = options;

  // Merge all form data sources with proper priority handling
  const enhancedFormOptions = useMemo(() => {
    // Prepare data sources
    const dataSources: FormDataSources<
      ExtractOutput<InferSchemaFromField<TFields, FieldUsage.RequestData>>
    > = {
      defaultValues: formOptions.defaultValues as Partial<
        ExtractOutput<InferSchemaFromField<TFields, FieldUsage.RequestData>>
      >,
      serverData: autoPrefillData as ExtractOutput<
        InferSchemaFromField<TFields, FieldUsage.RequestData>
      >,
      localStorageData: undefined,
      initialState: initialState as Partial<
        ExtractOutput<InferSchemaFromField<TFields, FieldUsage.RequestData>>
      >,
    };

    // Determine final data with proper priority
    const { finalData } = determineFormDataPriority(
      dataSources,
      autoPrefillConfig,
      false, // isDirty will be determined by the form itself
    );

    return {
      ...formOptions,
      defaultValues: finalData,
      // Store additional metadata for unsaved changes detection
      _dataSources: dataSources,
      _autoPrefillConfig: autoPrefillConfig,
    } as ApiQueryFormOptions<
      ExtractInput<InferSchemaFromField<TFields, FieldUsage.RequestData>>
    > & {
      _dataSources: FormDataSources<
        ExtractOutput<InferSchemaFromField<TFields, FieldUsage.RequestData>>
      >;
      _autoPrefillConfig: AutoPrefillConfig;
    };
  }, [formOptions, autoPrefillData, initialState, autoPrefillConfig]);

  // Enhanced query options with initial state support
  const enhancedQueryOptions = useMemo(() => {
    // If initial state is provided, disable the initial request
    const shouldSkipInitialRequest = Boolean(
      initialState && Object.keys(initialState).length > 0,
    );

    const finalEnabled = shouldSkipInitialRequest
      ? false
      : (queryOptions.enabled ?? true);

    return {
      ...queryOptions,
      // Skip initial request if we have initial state
      enabled: finalEnabled,
    };
  }, [queryOptions, initialState]);

  // Use the existing query form hook with enhanced options
  const queryFormResult = useApiQueryForm({
    endpoint: primaryEndpoint,
    urlVariables:
      urlParams ||
      ({} as ExtractOutput<
        InferSchemaFromField<TFields, FieldUsage.RequestUrlParams>
      >),
    formOptions: enhancedFormOptions,
    queryOptions: enhancedQueryOptions,
    logger,
  });

  return queryFormResult;
}
