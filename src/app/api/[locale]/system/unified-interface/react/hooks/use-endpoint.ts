"use client";
/* oxlint-disable oxlint-plugin-restricted/restricted-syntax -- Core endpoint hook needs 'unknown' for dynamic endpoint type handling. Foundational infrastructure for unified interface. */

import type { ErrorResponseType } from "next-vibe/shared/types/response.schema";
import { useMemo } from "react";
import type { z } from "zod";

import type { CreateApiEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { UnifiedField } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import type { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";

import type {
  EndpointReturn,
  FormAlertState,
  UseEndpointOptions,
} from "./endpoint-types";
import {
  mergeCreateOptions,
  mergeDeleteOptions,
  mergeReadOptions,
  useAvailableMethods,
  usePrimaryMutationMethod,
} from "./endpoint-utils";
import { useEndpointCreate } from "./use-endpoint-create";
import { useEndpointDelete } from "./use-endpoint-delete";
import { useEndpointRead } from "./use-endpoint-read";

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
    ? E extends CreateApiEndpoint<
        string,
        Methods,
        readonly UserRoleValue[],
        UnifiedField<z.ZodTypeAny>
      >
      ? E
      : never
    : never;

  const primaryEndpoint = primaryMutationMethod
    ? (endpoints[primaryMutationMethod] ?? null)
    : null;

  const deleteEndpoint = endpoints.DELETE ?? null;

  // Merge endpoint options with hook options (hook options take priority)
  const mergedReadOptions = useMemo(() => {
    const endpointReadOptions = readEndpoint?.options as
      | Record<string, unknown>
      | undefined;
    return mergeReadOptions(
      endpointReadOptions,
      options.read as Record<string, unknown> | undefined,
    );
  }, [readEndpoint?.options, options.read]);

  // Compute read options with defaults
  const readQueryEnabled =
    (mergedReadOptions.queryOptions?.enabled as boolean | undefined) ??
    options.enabled ??
    options.queryOptions?.enabled ??
    true;
  const readUrlPathParams =
    mergedReadOptions.urlPathParams ??
    options.urlPathParams ??
    options.queryOptions?.urlPathParams;
  const readStaleTime =
    (mergedReadOptions.queryOptions?.staleTime as number | undefined) ??
    options.staleTime ??
    options.queryOptions?.staleTime ??
    5 * 60 * 1000;
  const readRefetchOnWindowFocus =
    (mergedReadOptions.queryOptions?.refetchOnWindowFocus as
      | boolean
      | undefined) ??
    options.refetchOnWindowFocus ??
    options.queryOptions?.refetchOnWindowFocus ??
    true;
  const autoPrefillEnabled = options.autoPrefill ?? true;

  // Use read hook for GET endpoints
  const read = useEndpointRead(readEndpoint, logger, {
    formOptions: {
      persistForm:
        (mergedReadOptions.formOptions?.persistForm as boolean | undefined) ??
        false,
      persistenceKey: mergedReadOptions.formOptions?.persistenceKey as
        | string
        | undefined,
      autoSubmit: mergedReadOptions.formOptions?.autoSubmit as
        | boolean
        | undefined,
      debounceMs: mergedReadOptions.formOptions?.debounceMs as
        | number
        | undefined,
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
    initialState:
      mergedReadOptions.initialState ?? options.filterOptions?.initialFilters,
    initialData: options.read?.initialData,
  });

  // Use the appropriate operation based on endpoint type
  const autoPrefillData = useMemo(() => {
    if (autoPrefillEnabled && read?.response?.success) {
      return read.response.data;
    }
    return undefined;
  }, [autoPrefillEnabled, read?.response]);

  // Merge endpoint create options with hook options (hook options take priority)
  const mergedCreateOptions = useMemo(() => {
    const endpointCreateOptions = primaryEndpoint?.options as
      | Record<string, unknown>
      | undefined;
    return mergeCreateOptions(
      endpointCreateOptions,
      options.create as Record<string, unknown> | undefined,
    );
  }, [primaryEndpoint?.options, options.create]);

  // Compute create options with defaults
  const createUrlPathParams =
    mergedCreateOptions.urlPathParams ??
    options.urlPathParams ??
    readUrlPathParams;

  // Build create options - keep types flowing from original options
  const createFormOptions = {
    persistForm:
      (mergedCreateOptions.formOptions?.persistForm as boolean | undefined) ??
      false,
    persistenceKey: mergedCreateOptions.formOptions?.persistenceKey as
      | string
      | undefined,
    defaultValues:
      mergedCreateOptions.formOptions?.defaultValues ??
      options.defaultValues ??
      options.formOptions?.defaultValues,
  };

  // Calculate the appropriate reset data for form clearing
  // Priority: autoPrefillData (loaded data) > defaultValues
  const resetData = useMemo(() => {
    if (autoPrefillData) {
      return autoPrefillData;
    }
    return createFormOptions.defaultValues;
  }, [autoPrefillData, createFormOptions.defaultValues]);

  // Always call the hook unconditionally - it handles null endpoints internally
  const createOperation = useEndpointCreate<PrimaryEndpoint>(
    primaryEndpoint as PrimaryEndpoint | null,
    logger,
    {
      formOptions: createFormOptions,
      mutationOptions: mergedCreateOptions.mutationOptions,
      urlPathParams: createUrlPathParams,
      autoPrefillData:
        autoPrefillData ??
        mergedCreateOptions.autoPrefillData ??
        options.create?.autoPrefillData,
      initialState: mergedCreateOptions.initialState,
    } as Parameters<typeof useEndpointCreate<PrimaryEndpoint>>[2],
  );

  // Merge endpoint delete options with hook options (hook options take priority)
  const mergedDeleteOptions = useMemo(() => {
    const endpointDeleteOptions = deleteEndpoint?.options as
      | Record<string, unknown>
      | undefined;
    return mergeDeleteOptions(
      endpointDeleteOptions,
      options.delete as Record<string, unknown> | undefined,
    );
  }, [deleteEndpoint?.options, options.delete]);

  const deleteOperation = useEndpointDelete(deleteEndpoint, logger, {
    mutationOptions: mergedDeleteOptions.mutationOptions ?? {},
    urlPathParams: mergedDeleteOptions.urlPathParams ?? options.urlPathParams,
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
        onSubmit: createOperation.submitForm,
        reset: (): void => createOperation.form.reset(resetData || {}),
        isSuccess: createOperation.isSubmitSuccessful,
        isDirty: createOperation.form.formState.isDirty,
        error:
          createOperation.submitError &&
          Object.keys(createOperation.submitError).length
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
