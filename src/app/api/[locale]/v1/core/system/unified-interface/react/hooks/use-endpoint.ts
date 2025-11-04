"use client";

import type { ErrorResponseType } from "next-vibe/shared/types/response.schema";
import type { FormEvent } from "react";
import { useMemo } from "react";
import type { z } from "zod";

import type { CreateApiEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import type { UnifiedField } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/endpoint";
import type { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import type {
  EndpointReturn,
  FormAlertState,
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
  // Detect available methods and determine primary mutation method
  const availableMethods = useAvailableMethods(endpoints);
  const primaryMutationMethod = usePrimaryMutationMethod(availableMethods);

  // Extract endpoints
  const readEndpoint = endpoints.GET ?? null;

  type PrimaryEndpoint = T[keyof T & Methods] extends infer E
    ? E extends CreateApiEndpoint<string, Methods, readonly (typeof UserRoleValue)[], UnifiedField<z.ZodTypeAny>>
      ? E
      : never
    : never;

  const primaryEndpoint = primaryMutationMethod
    ? (endpoints[primaryMutationMethod] ?? null)
    : null;

  const deleteEndpoint = endpoints.DELETE ?? null;

  // Compute read options with defaults
  const readQueryEnabled = options.read?.queryOptions?.enabled ?? options.enabled ?? options.queryOptions?.enabled ?? true;
  const readUrlPathParams = options.read?.urlPathParams ?? options.urlPathParams ?? options.queryOptions?.urlPathParams;
  const readStaleTime = options.read?.queryOptions?.staleTime ?? options.staleTime ?? options.queryOptions?.staleTime ?? 5 * 60 * 1000;
  const readRefetchOnWindowFocus = options.read?.queryOptions?.refetchOnWindowFocus ?? options.refetchOnWindowFocus ?? options.queryOptions?.refetchOnWindowFocus ?? true;
  const autoPrefillEnabled = options.autoPrefill ?? true;

  // Use read hook for GET endpoints
  const read = useEndpointRead(readEndpoint, logger, {
    formOptions: {
      persistForm: options.read?.formOptions?.persistForm ?? false,
      persistenceKey: options.read?.formOptions?.persistenceKey,
      autoSubmit: options.read?.formOptions?.autoSubmit,
      debounceMs: options.read?.formOptions?.debounceMs,
    },
    queryOptions: {
      enabled: readQueryEnabled,
      staleTime: readStaleTime,
      refetchOnWindowFocus: readRefetchOnWindowFocus,
    },
    urlPathParams: readUrlPathParams,
    autoPrefillConfig: {
      autoPrefill: autoPrefillEnabled,
      autoPrefillFromLocalStorage: false,
      showUnsavedChangesAlert: false,
      clearStorageAfterSubmit: false,
    },
    initialState: options.read?.initialState ?? options.filterOptions?.initialFilters,
  });

  // Use the appropriate operation based on endpoint type
  const autoPrefillData = useMemo(() => {
    if (autoPrefillEnabled && read?.response?.success) {
      return read.response.data;
    }
    return undefined;
  }, [autoPrefillEnabled, read?.response]);

  // Compute create options with defaults
  const createUrlPathParams = options.create?.urlPathParams ?? options.urlPathParams ?? readUrlPathParams;

  // Build create options - keep types flowing from original options
  const createFormOptions = {
    persistForm: options.create?.formOptions?.persistForm ?? false,
    persistenceKey: options.create?.formOptions?.persistenceKey,
    defaultValues: options.create?.formOptions?.defaultValues ?? options.defaultValues ?? options.formOptions?.defaultValues,
  };

  // Calculate the appropriate reset data for form clearing
  // Priority: autoPrefillData (loaded data) > defaultValues
  const resetData = useMemo(() => {
    if (autoPrefillData) {
      return autoPrefillData;
    }
    return createFormOptions.defaultValues;
  }, [autoPrefillData, createFormOptions.defaultValues]);

  // Note: Type assertion necessary due to TypeScript limitation with conditional types.
  // PrimaryMutationTypes<T> and PrimaryEndpoint are structurally equivalent (both derived from T),
  // but TypeScript cannot prove this through its type system. The assertion is safe because:
  // 1. Both types are extracted from the same generic T
  // 2. UseEndpointOptions<T> ensures options match the endpoint types at compile time
  // 3. Runtime behavior is correct as types are structurally compatible
  type CreateOptions = typeof options.create extends object ? typeof options.create : Record<string, never>;

  const createOperation = primaryEndpoint
    ? useEndpointCreate<PrimaryEndpoint>(
        primaryEndpoint as PrimaryEndpoint | null,
        logger,
        {
          ...(options.create as CreateOptions),
          urlPathParams: createUrlPathParams,
          autoPrefillData: autoPrefillData ?? options.create?.autoPrefillData,
        } as Parameters<typeof useEndpointCreate<PrimaryEndpoint>>[2],
      )
    : null;

  const deleteOperation = useEndpointDelete(deleteEndpoint, logger, {
    mutationOptions: options.delete?.mutationOptions ?? {},
    urlPathParams: options.delete?.urlPathParams ?? options.urlPathParams,
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
    create: create ?? undefined,
    delete: deleteOperation ?? undefined,
    isLoading,
    error,
  } as EndpointReturn<T>;
}
