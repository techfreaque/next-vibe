"use client";

import type { ErrorResponseType } from "next-vibe/shared/types/response.schema";
import type { FormEvent } from "react";
import { useMemo } from "react";

import type { CreateApiEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import type { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";

import type {
  EndpointReturn,
  EndpointUrlVariables,
  FormAlertState,
  GetEndpointTypes,
  PrimaryMutationTypes,
  UseEndpointOptions,
} from "./endpoint-types";
import {
  useAvailableMethods,
  usePrimaryMutationMethod,
} from "./endpoint-utils";
import { useEndpointCreate } from "./use-endpoint-create";
import { useEndpointDelete } from "./use-endpoint-delete";
import { useEndpointRead } from "./use-endpoint-read";

// Export types that are commonly imported
export type { EndpointReturn, FormAlertState, UseEndpointOptions };

// Export commonly used hooks
export { createCustomStateKey, useCustomState } from "./store";
export {
  type EnhancedMutationResult,
  useApiMutation,
} from "./use-api-mutation";
export { useApiForm } from "./use-api-mutation-form";
export { useApiQuery } from "./use-api-query";
export { useApiQueryForm } from "./use-api-query-form";

/**
 * Utility function to normalize options with smart defaults and full type safety
 * Supports both new operation-specific options and legacy flat options
 */
function normalizeOptions<T>(options: UseEndpointOptions<T> = {}): {
  readOptions: {
    formOptions: {
      persistForm: boolean;
      persistenceKey?: string;
      autoSubmit?: boolean;
      debounceMs?: number;
    };
    queryOptions: {
      enabled: boolean;
      urlPathParams?: EndpointUrlVariables<T>;
      staleTime: number;
      refetchOnWindowFocus: boolean;
    };
    urlPathParams?: EndpointUrlVariables<T>;
    autoPrefillConfig: {
      autoPrefill: boolean;
      autoPrefillFromLocalStorage: boolean;
      showUnsavedChangesAlert: boolean;
      clearStorageAfterSubmit: boolean;
    };
    initialState?: GetEndpointTypes<T> extends never
      ? undefined
      : Partial<GetEndpointTypes<T>["request"]>;
  };
  createOptions: {
    formOptions: {
      persistForm: boolean;
      persistenceKey?: string;
      defaultValues?: PrimaryMutationTypes<T> extends never
        ? undefined
        : Partial<PrimaryMutationTypes<T>["request"]>;
    };
    mutationOptions: object;
    urlPathParams?: EndpointUrlVariables<T>;
    autoPrefillData?: PrimaryMutationTypes<T> extends never
      ? undefined
      : Partial<PrimaryMutationTypes<T>["request"]>;
    initialState?: PrimaryMutationTypes<T> extends never
      ? undefined
      : Partial<PrimaryMutationTypes<T>["request"]>;
  };
  deleteOptions: {
    mutationOptions: object;
    urlPathParams?: EndpointUrlVariables<T>;
  };
  autoPrefill: boolean;
} {
  // Support both new operation-specific options and legacy flat options
  // Priority: new options > legacy nested options > legacy flat options

  // Read options
  const readQueryOptions = {
    enabled:
      options.read?.queryOptions?.enabled ??
      options.enabled ??
      options.queryOptions?.enabled ??
      true,
    urlPathParams:
      options.read?.urlPathParams ??
      options.urlPathParams ??
      options.queryOptions?.urlPathParams,
    staleTime:
      options.read?.queryOptions?.staleTime ??
      options.staleTime ??
      options.queryOptions?.staleTime ??
      5 * 60 * 1000, // 5 minutes default
    refetchOnWindowFocus:
      options.read?.queryOptions?.refetchOnWindowFocus ??
      options.refetchOnWindowFocus ??
      options.queryOptions?.refetchOnWindowFocus ??
      true,
  };

  const readFormOptions = {
    persistForm: options.read?.formOptions?.persistForm ?? false,
    persistenceKey: options.read?.formOptions?.persistenceKey,
    autoSubmit: options.read?.formOptions?.autoSubmit,
    debounceMs: options.read?.formOptions?.debounceMs,
  };

  const autoPrefillConfig = {
    autoPrefill: options.autoPrefill ?? true,
    autoPrefillFromLocalStorage: false, // Always false - no local storage
    showUnsavedChangesAlert: false, // Always false - no local storage
    clearStorageAfterSubmit: false, // Always false - no local storage
  };

  // Create options
  const createDefaultValues =
    options.create?.formOptions?.defaultValues ??
    options.defaultValues ??
    options.formOptions?.defaultValues;

  const createFormOptions = {
    persistForm: options.create?.formOptions?.persistForm ?? false,
    persistenceKey: options.create?.formOptions?.persistenceKey,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValues: createDefaultValues as any,
  };

  // Delete options
  const deleteUrlPathParams =
    options.delete?.urlPathParams ?? options.urlPathParams;

  return {
    readOptions: {
      formOptions: readFormOptions,
      queryOptions: readQueryOptions,
      urlPathParams: readQueryOptions.urlPathParams,
      autoPrefillConfig,
      initialState:
        options.read?.initialState ?? options.filterOptions?.initialFilters,
    },
    createOptions: {
      formOptions: createFormOptions,
      mutationOptions: options.create?.mutationOptions ?? {},
      urlPathParams:
        options.create?.urlPathParams ??
        options.urlPathParams ??
        readQueryOptions.urlPathParams,
      autoPrefillData: options.create?.autoPrefillData,
      initialState: options.create?.initialState,
    },
    deleteOptions: {
      mutationOptions: options.delete?.mutationOptions ?? {},
      urlPathParams: deleteUrlPathParams,
    },
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
export function useEndpoint<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Partial<Record<Methods, CreateApiEndpoint<any, any, any, any>>>,
>(
  endpoints: T,
  options: UseEndpointOptions<T> = {},
  logger: EndpointLogger,
): EndpointReturn<T> {
  // Normalize options with smart defaults
  const { readOptions, createOptions, deleteOptions, autoPrefill } =
    normalizeOptions(options);

  // Detect available methods and determine primary mutation method
  const availableMethods = useAvailableMethods(endpoints);
  const primaryMutationMethod = usePrimaryMutationMethod(availableMethods);

  // Extract endpoints
  const readEndpoint = endpoints.GET ?? null;

  const primaryEndpoint = primaryMutationMethod
    ? (endpoints[primaryMutationMethod] ?? null)
    : null;

  const deleteEndpoint = endpoints.DELETE ?? null;

  // Use read hook for GET endpoints
  const read = useEndpointRead(readEndpoint, logger, {
    formOptions: readOptions.formOptions,
    queryOptions: readOptions.queryOptions,
    urlPathParams: readOptions.urlPathParams,
    autoPrefillConfig: readOptions.autoPrefillConfig,
    initialState: readOptions.initialState,
  });

  // Use the appropriate operation based on endpoint type
  const autoPrefillData = useMemo(() => {
    if (autoPrefill && read?.response?.success) {
      return read.response.data;
    }
    return undefined;
  }, [autoPrefill, read?.response]);

  // Calculate the appropriate reset data for form clearing
  // Priority: autoPrefillData (loaded data) > defaultValues
  const resetData = useMemo(() => {
    if (autoPrefillData) {
      return autoPrefillData;
    }
    return createOptions.formOptions?.defaultValues;
  }, [autoPrefillData, createOptions.formOptions?.defaultValues]);

  const createOperation = useEndpointCreate(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    primaryEndpoint as any,
    logger,
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formOptions: createOptions.formOptions as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mutationOptions: createOptions.mutationOptions as any,
      urlPathParams: createOptions.urlPathParams,
      autoPrefillData: autoPrefillData ?? createOptions.autoPrefillData,
      initialState: createOptions.initialState,
    },
  );

  const deleteOperation = useEndpointDelete(deleteEndpoint, logger, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationOptions: deleteOptions.mutationOptions as any,
    urlPathParams: deleteOptions.urlPathParams,
  });

  const isLoading =
    read?.isLoading ||
    createOperation?.isSubmitting ||
    deleteOperation?.isSubmitting ||
    false;

  // Combined error state
  const error: ErrorResponseType | null =
    read?.error ||
    createOperation?.submitError ||
    deleteOperation?.error ||
    null;

  // Return the appropriate create operation
  const createValues = createOperation?.form.watch();
  const create = createOperation
    ? {
        ...createOperation,
        values: createValues,
        setValue: createOperation.form.setValue.bind(createOperation.form),
        onSubmit: async (
          e: FormEvent<HTMLFormElement> | undefined,
        ): Promise<void> => {
          e?.preventDefault();
          await createOperation.submitForm(e);
        },
        reset: (): void => createOperation.form.reset(resetData || {}),
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
  const alert = useMemo((): FormAlertState | null => {
    // Check for success state

    if (create?.isSuccess && primaryEndpoint?.successTypes) {
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
            message: errorConfig.title,
          },
          message: {
            message: errorConfig.description,
          },
        };
      }

      // Fallback to generic error
      return {
        variant: "destructive",
        title: {
          message: "app.common.error.title",
        },
        message: {
          message: error.message,
          messageParams: error.messageParams,
        },
      };
    }

    return null;
  }, [create?.isSuccess, error, primaryEndpoint]);

  return {
    alert,
    read: read ?? undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    create: (create as any) ?? undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete: (deleteOperation as any) ?? undefined,
    isLoading,
    error,
  } as EndpointReturn<T>;
}
