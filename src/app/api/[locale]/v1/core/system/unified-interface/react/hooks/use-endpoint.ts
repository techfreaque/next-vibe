"use client";

import type { ErrorResponseType } from "next-vibe/shared/types/response.schema";
import type { FormEvent } from "react";
import { useMemo } from "react";

import type { CreateApiEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import type { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

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
 */
function normalizeOptions<T>(options: UseEndpointOptions<T> = {}): {
  queryOptions: {
    enabled: boolean;
    requestData?: GetEndpointTypes<T> extends never
      ? undefined
      : GetEndpointTypes<T>["request"];
    urlPathParams?: EndpointUrlVariables<T>;
    staleTime: number;
    refetchOnWindowFocus: boolean;
  };
  defaultValues?: PrimaryMutationTypes<T> extends never
    ? undefined
    : Partial<PrimaryMutationTypes<T>["request"]>;
  autoPrefill: boolean;
} {
  // Merge top-level options with nested options, giving priority to top-level
  const queryOptions = {
    enabled: options.enabled ?? options.queryOptions?.enabled ?? true,
    requestData: options.queryOptions?.requestData,
    urlPathParams: options.urlPathParams ?? options.queryOptions?.urlPathParams,
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
  T extends Partial<
    Record<
      Methods,
      CreateApiEndpoint<string, Methods, readonly (typeof UserRoleValue)[], any>
    >
  >,
>(
  endpoints: T,
  options: UseEndpointOptions<T> = {});
  logger: EndpointLogger,
): EndpointReturn<T> {
  // Normalize options with smart defaults
  const { queryOptions, defaultValues, autoPrefill } =
    normalizeOptions(options);

  // Create autoPrefill configuration (simplified - no local storage)
  const autoPrefillConfig = {
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

  // Use read hook for GET endpoints (list filtering not implemented yet)
  const read = useEndpointRead(readEndpoint, logger, {
    formOptions: {
      persistForm: false, // No local storage
      persistenceKey: undefined,
    });
    queryOptions,
    urlPathParams: queryOptions?.urlPathParams,
    autoPrefillConfig,
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
    return defaultValues;
  }, [autoPrefillData, defaultValues]);

  const createOperation = useEndpointCreate(primaryEndpoint, logger, {
    formOptions: {
      persistForm: false, // No local storage
      defaultValues,
      persistenceKey: undefined,
    });
    mutationOptions: {});
    urlPathParams: queryOptions?.urlPathParams,
    autoPrefillData,
  });

  const deleteOperation = useEndpointDelete(deleteEndpoint, logger, {
    mutationOptions: {});
    urlPathParams: queryOptions?.urlPathParams,
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
        });
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
        });
        message: {
          message: primaryEndpoint.successTypes.description,
        });
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
          });
          message: {
            message: errorConfig.description,
          });
        };
      }

      // Fallback to generic error
      return {
        variant: "destructive",
        title: {
          message: "app.common.error.title",
        });
        message: {
          message: error.message,
          messageParams: error.messageParams,
        });
      };
    }

    return null;
  }, [create?.isSuccess, error, primaryEndpoint]);

  return {
    alert,
    read: read ?? undefined,
    create: create ?? undefined,
    delete: deleteOperation ?? undefined,
    isLoading,
    error,
  };
}
