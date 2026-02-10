"use client";

import type { ErrorResponseType } from "next-vibe/shared/types/response.schema";
import { useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";

import type { DeepPartial } from "@/app/api/[locale]/shared/types/utils";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type {
  DeleteRequest,
  DeleteResponse,
  DeleteUrlVariables,
  PatchRequest,
  PatchResponse,
  PatchUrlVariables,
  PrimaryMutationRequest,
  PrimaryMutationResponse,
  PrimaryMutationUrlVariables,
} from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-helpers";
import type { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { useTranslation } from "@/i18n/core/client";

import type {
  EndpointReturn,
  FormAlertState,
  UseEndpointOptions,
} from "./endpoint-types";
import {
  useAvailableMethods,
  usePrimaryMutationMethod,
} from "./endpoint-utils";
import type { ApiMutationOptions } from "./types";
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
 * @param logger - Logger instance for debugging
 * @returns Object with all available operations based on endpoint methods
 */
export function useEndpoint<
  T extends Partial<Record<Methods, CreateApiEndpointAny>>,
>(
  endpoints: T,
  options: UseEndpointOptions<T> | undefined,
  logger: EndpointLogger,
  user: JwtPayloadType,
): EndpointReturn<T> {
  const { locale } = useTranslation();
  // Detect available methods and determine primary mutation method
  const availableMethods = useAvailableMethods(endpoints);
  const primaryMutationMethod = usePrimaryMutationMethod(availableMethods);

  // Extract endpoints
  const readEndpoint = endpoints.GET ?? null;

  const primaryEndpoint = primaryMutationMethod
    ? (endpoints[primaryMutationMethod] ?? null)
    : null;

  const deleteEndpoint = endpoints.DELETE ?? null;

  // Merge endpoint-level options with hook options (hook options take precedence)
  // Extract endpoint read options if it's a GET endpoint
  const endpointReadOptions =
    readEndpoint?.options && "queryOptions" in readEndpoint.options
      ? readEndpoint.options
      : undefined;

  const readQueryEnabled =
    options?.read?.queryOptions?.enabled ??
    endpointReadOptions?.queryOptions?.enabled ??
    true;
  const readUrlPathParams = options?.read?.urlPathParams;
  const readStaleTime =
    options?.read?.queryOptions?.staleTime ??
    endpointReadOptions?.queryOptions?.staleTime ??
    5 * 60 * 1000;
  const readRefetchOnWindowFocus =
    options?.read?.queryOptions?.refetchOnWindowFocus ??
    endpointReadOptions?.queryOptions?.refetchOnWindowFocus ??
    true;
  const autoPrefillEnabled = options?.autoPrefill ?? true;

  // Use read hook for GET endpoints - route to client or server
  // Extract form options carefully handling the union type
  const endpointAutoSubmit =
    endpointReadOptions?.formOptions &&
    "autoSubmit" in endpointReadOptions.formOptions
      ? endpointReadOptions.formOptions.autoSubmit
      : undefined;
  const endpointDebounceMs =
    endpointReadOptions?.formOptions &&
    "debounceMs" in endpointReadOptions.formOptions
      ? endpointReadOptions.formOptions.debounceMs
      : undefined;

  const read = useEndpointRead(readEndpoint, logger, user, {
    formOptions: {
      persistForm: options?.read?.formOptions?.persistForm ?? false,
      persistenceKey: options?.read?.formOptions?.persistenceKey,
      autoSubmit: options?.read?.formOptions?.autoSubmit ?? endpointAutoSubmit,
      debounceMs: options?.read?.formOptions?.debounceMs ?? endpointDebounceMs,
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
    initialState: options?.read?.initialState,
    initialData: options?.read?.initialData,
  });

  // Use the appropriate operation based on endpoint type
  const autoPrefillData = useMemo(() => {
    if (autoPrefillEnabled && read?.response?.success) {
      return read.response.data;
    }
    return;
  }, [autoPrefillEnabled, read?.response]);

  // Merge create options - only use hook-provided options (endpoint-level options not accessible due to dynamic endpoint selection)
  const createFormOptions = useMemo(() => {
    const hookOpts = options?.create?.formOptions;

    return {
      persistForm: hookOpts?.persistForm ?? false,
      persistenceKey: hookOpts?.persistenceKey,
      defaultValues: hookOpts?.defaultValues,
    };
  }, [options?.create?.formOptions]);

  const createMutationOptions = useMemo(():
    | ApiMutationOptions<
        PrimaryMutationRequest<T>,
        PrimaryMutationResponse<T>,
        PrimaryMutationUrlVariables<T>
      >
    | undefined => {
    return options?.create?.mutationOptions;
  }, [options?.create?.mutationOptions]);

  const createInitialState = useMemo(():
    | DeepPartial<PrimaryMutationRequest<T>>
    | undefined => {
    return options?.create?.initialState;
  }, [options?.create?.initialState]);

  const createAutoPrefillData = useMemo(():
    | DeepPartial<PrimaryMutationRequest<T>>
    | undefined => {
    return autoPrefillData ?? options?.create?.autoPrefillData;
  }, [autoPrefillData, options?.create?.autoPrefillData]);

  const createUrlPathParams =
    options?.create?.urlPathParams ?? readUrlPathParams;

  // Always call the hook unconditionally - it handles null endpoints internally
  const createOperation = useEndpointCreate(primaryEndpoint, logger, user, {
    formOptions: createFormOptions,
    mutationOptions: createMutationOptions,
    urlPathParams: createUrlPathParams,
    autoPrefillData: createAutoPrefillData,
    initialState: createInitialState,
  });

  // Calculate the appropriate reset data for form clearing
  const resetData = useMemo(() => {
    if (autoPrefillData) {
      return autoPrefillData;
    }
    return createFormOptions.defaultValues;
  }, [autoPrefillData, createFormOptions.defaultValues]);

  // Merge delete options - only use hook-provided options (endpoint-level options not accessible due to dynamic endpoint selection)
  const deleteMutationOptions = useMemo(():
    | ApiMutationOptions<
        DeleteRequest<T>,
        DeleteResponse<T>,
        DeleteUrlVariables<T>
      >
    | undefined => {
    return options?.delete?.mutationOptions;
  }, [options?.delete?.mutationOptions]);

  const deleteUrlPathParams = options?.delete?.urlPathParams;

  const deleteAutoPrefillData = useMemo(():
    | DeepPartial<DeleteRequest<T>>
    | undefined => {
    return options?.delete?.autoPrefillData;
  }, [options?.delete?.autoPrefillData]);

  // Hook will merge endpoint options with passed options internally
  const deleteOperation = useEndpointDelete(deleteEndpoint, logger, user, {
    mutationOptions: deleteMutationOptions,
    urlPathParams: deleteUrlPathParams,
    autoPrefillData: deleteAutoPrefillData,
  });

  const isLoading =
    read?.isLoading ||
    createOperation?.isSubmitting ||
    deleteOperation?.isSubmitting ||
    false;

  // Combined error state - all hooks return compatible error types
  const error: ErrorResponseType | null =
    read?.error ||
    createOperation?.submitError ||
    deleteOperation?.submitError ||
    null;

  // Memoize create operation wrapper
  const createValues = createOperation?.form.watch();
  const create = useMemo(() => {
    if (!createOperation) {
      return undefined;
    }

    return {
      ...createOperation,
      values: createValues,
      setValue: createOperation.form.setValue.bind(createOperation.form),
      onSubmit: createOperation.submitForm,
      reset: (): void => createOperation.form.reset(resetData || {}),
      isSuccess: createOperation.isSubmitSuccessful,
      isDirty: createOperation.form.formState.isDirty,
      error:
        createOperation.submitError &&
        Object.keys(createOperation.submitError).length > 0
          ? createOperation.submitError
          : null,
    };
  }, [createOperation, createValues, resetData]);

  // Generate alert state from success/error states and endpoint types
  const alert = useMemo((): FormAlertState | null => {
    if (!primaryEndpoint) {
      return null;
    }

    const { t: scopedT } = primaryEndpoint.scopedTranslation.scopedT(locale);

    // Check for success state

    if (create?.isSuccess && primaryEndpoint.successTypes) {
      return {
        variant: "success",
        title: {
          message: scopedT(primaryEndpoint.successTypes.title),
        },
        message: {
          message: scopedT(primaryEndpoint.successTypes.description),
        },
      };
    }

    // Check for error state

    if (error && primaryEndpoint.errorTypes) {
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
            message: scopedT(errorConfig.title),
          },
          message: {
            message: scopedT(errorConfig.description),
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
  }, [create?.isSuccess, error, primaryEndpoint, locale]);

  // Handle PATCH endpoint as update operation
  const patchEndpoint = endpoints.PATCH ?? null;

  // Merge update options - only use hook-provided options (endpoint-level options not accessible due to dynamic endpoint selection)
  const updateFormOptions = useMemo(() => {
    const hookOpts = options?.update?.formOptions;

    return {
      persistForm: hookOpts?.persistForm ?? false,
      persistenceKey: hookOpts?.persistenceKey,
      defaultValues: hookOpts?.defaultValues,
    };
  }, [options?.update?.formOptions]);

  const updateMutationOptions = useMemo(():
    | ApiMutationOptions<
        PatchRequest<T>,
        PatchResponse<T>,
        PatchUrlVariables<T>
      >
    | undefined => {
    return options?.update?.mutationOptions;
  }, [options?.update?.mutationOptions]);

  const updateInitialState = useMemo(():
    | DeepPartial<PatchRequest<T>>
    | undefined => {
    return options?.update?.initialState;
  }, [options?.update?.initialState]);

  const updateAutoPrefillData = useMemo(():
    | DeepPartial<PatchRequest<T>>
    | undefined => {
    return autoPrefillData ?? options?.update?.autoPrefillData;
  }, [autoPrefillData, options?.update?.autoPrefillData]);

  const updateUrlPathParams =
    options?.update?.urlPathParams ?? readUrlPathParams;

  // Hook will merge endpoint options with passed options internally
  const updateOperation = useEndpointCreate(patchEndpoint, logger, user, {
    formOptions: updateFormOptions,
    mutationOptions: updateMutationOptions,
    urlPathParams: updateUrlPathParams,
    autoPrefillData: updateAutoPrefillData,
    initialState: updateInitialState,
  });

  // Memoize update operation wrapper
  const updateValues = updateOperation?.form.watch();
  const update = useMemo(() => {
    if (!updateOperation) {
      return undefined;
    }

    return {
      form: updateOperation.form,
      response: updateOperation.response,
      isSuccess: updateOperation.isSubmitSuccessful,
      error:
        updateOperation.submitError &&
        Object.keys(updateOperation.submitError).length > 0
          ? updateOperation.submitError
          : null,
      values: updateValues,
      setValue: updateOperation.form.setValue.bind(updateOperation.form),
      submit: async (
        data: typeof updateOperation.form extends UseFormReturn<infer TValues>
          ? TValues
          : never,
      ): Promise<void> => {
        updateOperation.form.reset(data);
        await updateOperation.submitForm();
      },
      reset: (): void => updateOperation.form.reset(resetData || {}),
      isSubmitting: updateOperation.isSubmitting,
      isDirty: updateOperation.form.formState.isDirty,
      clearSavedForm: updateOperation.clearSavedForm,
      setErrorType: updateOperation.setErrorType,
    };
  }, [updateOperation, updateValues, resetData]);

  // Memoize return object for stable reference
  return useMemo(
    () =>
      ({
        alert,
        read: read ?? undefined,
        create,
        update,
        delete: deleteOperation ?? undefined,
        isLoading,
        error,
      }) as EndpointReturn<T>,
    [alert, read, create, update, deleteOperation, isLoading, error],
  );
}
