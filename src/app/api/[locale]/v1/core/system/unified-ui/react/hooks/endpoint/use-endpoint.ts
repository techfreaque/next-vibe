"use client";

import type { ErrorResponseType } from "next-vibe/shared/types/response.schema";
import type { FormEvent } from "react";
import { useMemo } from "react";

import type { EndpointLogger } from "../../../cli/vibe/endpoints/endpoint-handler/logger";
import type { AutoPrefillConfig } from "../form/types";
import {
  type EndpointReturn,
  type FormAlertState,
  type GetEndpointTypes,
  type PrimaryMutationTypes,
  type UseEndpointOptions,
  useTranslation,
} from "./types";
import { useEndpointCreate } from "./use-endpoint-create";
import { useEndpointDelete } from "./use-endpoint-delete";
import { useEndpointFilter } from "./use-endpoint-filter";
import { useEndpointRead } from "./use-endpoint-read";
import { useAvailableMethods, usePrimaryMutationMethod } from "./utils";

/**
 * Utility function to normalize options with smart defaults and full type safety
 */
function normalizeOptions<T>(options: UseEndpointOptions<T> = {}): {
  queryOptions: {
    enabled: boolean;
    requestData?: GetEndpointTypes<T> extends never
      ? undefined
      : GetEndpointTypes<T>["request"];
    urlParams?: GetEndpointTypes<T> extends never
      ? undefined
      : GetEndpointTypes<T>["urlVariables"];
    staleTime: number;
    refetchOnWindowFocus: boolean;
  };
  defaultValues?: PrimaryMutationTypes<T> extends never
    ? undefined
    : Partial<PrimaryMutationTypes<T>["request"]>;
  filterOptions?: {
    initialFilters?: GetEndpointTypes<T> extends never
      ? undefined
      : Partial<GetEndpointTypes<T>["request"]>;
  };
  autoPrefill: boolean;
} {
  // Merge top-level options with nested options, giving priority to top-level
  const queryOptions = {
    enabled: options.enabled ?? options.queryOptions?.enabled ?? true,
    requestData: options.queryOptions?.requestData,
    urlParams: options.urlParams ?? options.queryOptions?.urlParams,
    staleTime:
      options.staleTime ?? options.queryOptions?.staleTime ?? 5 * 60 * 1000, // 5 minutes default
    refetchOnWindowFocus:
      options.refetchOnWindowFocus ??
      options.queryOptions?.refetchOnWindowFocus ??
      true,
  };

  // Get default values from top-level or legacy formOptions with proper typing
  const defaultValues =
    options.defaultValues ?? options.formOptions?.defaultValues;

  return {
    queryOptions,
    defaultValues,
    filterOptions: options.filterOptions,
    autoPrefill: options.autoPrefill ?? true,
  };
}

/**
 * Hook that provides all CRUD operations for an endpoints object
 *
 * Features:
 * - Automatically detects available HTTP methods (GET, POST, PUT, PATCH, DELETE)
 * - Provides query functionality for GET endpoints
 * - Provides form functionality for mutation endpoints
 * - Auto-prefills form data from GET endpoint when available
 * - Type-safe with full TypeScript inference based on endpoint input
 * - Uses existing useApiQuery and useApiForm hooks for consistency
 * - Supports both top-level and nested options for better DX
 *
 * @param endpoints - Object containing endpoint definitions (e.g., { GET: endpoint, POST: endpoint })
 * @param options - Configuration options for forms and queries
 * @returns Object with all available operations based on endpoint methods
 */
export function useEndpoint<T extends Record<string, any>>(
  endpoints: T,
  options: UseEndpointOptions<T> = {},
  logger: EndpointLogger,
): EndpointReturn<T> {
  const { t, locale } = useTranslation();
  // Normalize options with smart defaults
  const { queryOptions, defaultValues, filterOptions, autoPrefill } =
    normalizeOptions(options);

  // Create autoPrefill configuration (simplified - no local storage)
  const autoPrefillConfig: AutoPrefillConfig = {
    autoPrefill,
    autoPrefillFromLocalStorage: false, // Always false - no local storage
    showUnsavedChangesAlert: false, // Always false - no local storage
    clearStorageAfterSubmit: false, // Always false - no local storage
  };

  // Detect available methods and determine primary mutation method
  const availableMethods = useAvailableMethods(endpoints);
  const primaryMutationMethod = usePrimaryMutationMethod(availableMethods);

  // Extract endpoints
  const readEndpoint = endpoints.GET || null;
  const primaryEndpoint = primaryMutationMethod
    ? endpoints[primaryMutationMethod]
    : null;
  const deleteEndpoint = endpoints.DELETE || null;

  // Check if the GET endpoint is a LIST_FILTER type
  const isListFilterEndpoint = false; // Simplified for now

  // Use filtering hook for LIST_FILTER endpoints, regular read hook for others
  const filterOperation = useEndpointFilter(
    isListFilterEndpoint ? (readEndpoint as never) : null,
    logger,
    {
      formOptions: {
        persistForm: false, // No local storage
        defaultValues: defaultValues as never,
        persistenceKey: undefined,
      },
      queryOptions,
      urlParams: queryOptions?.urlParams || ({} as never),
      initialFilters: filterOptions?.initialFilters as never,
    },
  );

  const readOperation = useEndpointRead(
    isListFilterEndpoint ? null : (readEndpoint as never),
    logger,
    {
      formOptions: {
        persistForm: false, // No local storage
        defaultValues: defaultValues as never,
        persistenceKey: undefined,
      },
      queryOptions,
      urlParams: queryOptions?.urlParams || ({} as never),
      autoPrefillConfig,
    },
  );

  // Use the appropriate operation based on endpoint type
  const activeReadOperation = isListFilterEndpoint
    ? filterOperation
    : readOperation;

  const autoPrefillData = useMemo(() => {
    return autoPrefill && activeReadOperation?.response?.success
      ? activeReadOperation.response.data
      : undefined;
  }, [autoPrefill, activeReadOperation?.response]);

  // Calculate the appropriate reset data for form clearing
  // Priority: autoPrefillData (loaded data) > defaultValues
  const resetData = useMemo(() => {
    if (autoPrefillData) {
      return autoPrefillData;
    }
    return defaultValues;
  }, [autoPrefillData, defaultValues]);

  const createOperation = useEndpointCreate(primaryEndpoint as never, logger, {
    formOptions: {
      persistForm: false, // No local storage
      defaultValues: defaultValues as never,
      persistenceKey: undefined,
    },
    mutationOptions: {},
    urlParams: queryOptions?.urlParams || ({} as never),
    autoPrefillData,
  });

  const deleteOperation = useEndpointDelete(deleteEndpoint as never, logger, {
    mutationOptions: {},
    urlParams: queryOptions?.urlParams || ({} as never),
  });

  const isLoading =
    activeReadOperation?.isLoading ||
    createOperation?.isSubmitting ||
    deleteOperation?.isSubmitting ||
    false;

  // Combined error state
  const error: ErrorResponseType | null =
    activeReadOperation?.error ||
    (createOperation?.submitError as ErrorResponseType) ||
    deleteOperation?.error ||
    null;

  // Create adapters to match the expected interface
  const readAdapter = activeReadOperation
    ? {
        ...activeReadOperation,
        values: activeReadOperation.form.watch(),
        setValue: <K extends keyof typeof activeReadOperation.form.watch>(
          key: K,
          value: (typeof activeReadOperation.form.watch)[K],
        ): void => {
          activeReadOperation.form.setValue(key, value);
        },
        onSubmit: async (e: FormEvent | undefined): Promise<void> => {
          e?.preventDefault();
          await activeReadOperation.submitForm(e as never);
        },
        reset: (): void =>
          activeReadOperation.form.reset((resetData || {}) as never),
      }
    : undefined;

  const createAdapter = createOperation
    ? {
        ...createOperation,
        values: createOperation.form.watch(),
        setValue: <K extends keyof typeof createOperation.form.watch>(
          key: K,
          value: (typeof createOperation.form.watch)[K],
        ): void => {
          createOperation.form.setValue(key, value);
        },
        onSubmit: async (e: FormEvent | undefined): Promise<void> => {
          e?.preventDefault();
          await createOperation.submitForm(e as never);
        },
        reset: (): void =>
          createOperation.form.reset((resetData || {}) as never),
        isSuccess: createOperation.isSubmitSuccessful,
        isDirty: createOperation.form.formState.isDirty,
        error:
          createOperation.submitError &&
          Object.keys(createOperation.submitError).length > 0
            ? createOperation.submitError
            : null,
      }
    : undefined;

  // Generate alert state from success/error states and endpoint types
  const alert: FormAlertState | null = useMemo(() => {
    // Check for success state
    if (createAdapter?.isSuccess && primaryEndpoint?.successTypes) {
      return {
        variant: "success",
        title: {
          message: primaryEndpoint.successTypes.title,
        },
        message: {
          message: primaryEndpoint.successTypes.description,
        },
      };
    }

    // Check for error state
    if (error && primaryEndpoint?.errorTypes) {
      // Try to find matching error type from endpoint by checking the errorKey
      const errorTypeEntries = Object.entries(primaryEndpoint.errorTypes);
      const matchingEntry = errorTypeEntries.find(([hookErrorType]) => {
        // Check if the error's errorKey matches any of the HookErrorTypes
        return error.errorType?.errorKey?.includes(hookErrorType.toLowerCase());
      });

      if (matchingEntry?.[1]) {
        const errorConfig = matchingEntry[1];
        return {
          variant: "destructive",
          title: {
            message: errorConfig?.title || "Error",
          },
          message: {
            message: errorConfig?.description || "An error occurred",
          },
        };
      }

      // Fallback to generic error
      return {
        variant: "destructive",
        title: {
          message: "common.error.title",
        },
        message: {
          message: error.message,
          messageParams: error.messageParams,
        },
      };
    }

    return null;
  }, [createAdapter?.isSuccess, error, primaryEndpoint]);

  return {
    // Combined alert state
    alert,

    // CRUD Operations
    read: readAdapter,
    create: createAdapter,
    delete: deleteOperation,

    // Combined state
    isLoading,
    error,
  };
}
