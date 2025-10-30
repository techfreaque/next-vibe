"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ErrorResponseType } from "next-vibe/shared/types/response.schema";
import type { z } from "zod";
import {
  createSuccessResponse,
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import type { FormEvent } from "react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";

import type { CreateApiEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import type {
  ExtractOutput,
  FieldUsage,
  InferSchemaFromField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/endpoint";
import type { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import type { ApiStore, FormQueryParams } from "./store";
import { useApiStore } from "./store";
import type {
  ApiQueryFormOptions,
  ApiQueryFormReturn,
  ApiQueryOptions,
  SubmitFormFunction,
  SubmitFormFunctionOptions,
} from "./types";
import { useApiQuery } from "./use-api-query";

/**
 * Creates a form that automatically updates a query based on form values
 * Useful for search forms, filters, and other query parameter-based APIs
 *
 * Features:
 * - Form validation using Zod schema
 * - Form persistence using localStorage (enabled by default)
 * - Automatic query updates based on form values
 * - Debounced form submissions to prevent excessive API calls
 *
 * @param endpoint - The API endpoint to use
 * @param urlPathParams - URL variables for the endpoint
 * @param formOptions - Form options including defaultValues and persistence options
 * @param queryOptions - API query options
 * @returns Form and query for API interaction with enhanced error handling
 */
export function useApiQueryForm<
  TEndpoint extends CreateApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  >,
>({
  endpoint,
  urlPathParams,
  formOptions = { persistForm: true, autoSubmit: true, debounceMs: 500 },
  queryOptions = { enabled: true },
  logger,
}: {
  endpoint: TEndpoint;
  urlPathParams: TEndpoint["TUrlVariablesOutput"];
  formOptions?: ApiQueryFormOptions<TEndpoint["TRequestOutput"]> & {
    /**
     * Whether to enable form persistence
     * @default true
     */
    persistForm?: boolean;
    /**
     * The key to use for storing form data in localStorage
     * If not provided, a key will be generated based on the endpoint
     */
    persistenceKey?: string;
  };
  queryOptions: ApiQueryOptions<
    ExtractOutput<
      InferSchemaFromField<TEndpoint["fields"], FieldUsage.RequestData>
    >,
    ExtractOutput<
      InferSchemaFromField<TEndpoint["fields"], FieldUsage.Response>
    >,
    ExtractOutput<
      InferSchemaFromField<TEndpoint["fields"], FieldUsage.RequestUrlParams>
    >
  >;
  logger: EndpointLogger;
}): ApiQueryFormReturn<
  ExtractOutput<
    InferSchemaFromField<TEndpoint["fields"], FieldUsage.RequestData>
  >,
  ExtractOutput<InferSchemaFromField<TEndpoint["fields"], FieldUsage.Response>>,
  ExtractOutput<
    InferSchemaFromField<TEndpoint["fields"], FieldUsage.RequestUrlParams>
  >
> {
  if (!endpoint) {
    // eslint-disable-next-line no-restricted-syntax, i18next/no-literal-string
    throw new Error("Endpoint is required");
  }
  const {
    autoSubmit = true,
    debounceMs = 500,
    persistForm = true,
    persistenceKey,
    ...restFormOptions
  } = formOptions;

  // Get Zustand store methods
  const { getFormId, setFormQueryParams } = useApiStore();
  const formId = getFormId(endpoint);

  // For query state - use number type instead of NodeJS.Timeout
  const debounceTimerRef = useRef<number | null>(null);

  // Get query params reactively using a memoized selector with stable default
  const defaultQueryParams = useMemo(
    () =>
      ({}) as ExtractOutput<
        InferSchemaFromField<TEndpoint["fields"], FieldUsage.RequestData>
      >,
    [],
  );
  const queryParamsSelector = useMemo(
    () =>
      (
        state: ApiStore,
      ): ExtractOutput<
        InferSchemaFromField<TEndpoint["fields"], FieldUsage.RequestData>
      > =>
        (state.forms[formId]?.queryParams as ExtractOutput<
          InferSchemaFromField<TEndpoint["fields"], FieldUsage.RequestData>
        >) ?? defaultQueryParams,
    [formId, defaultQueryParams],
  );
  const queryParams = useApiStore(queryParamsSelector);

  // Create a function to update query params in the store
  const setQueryParams = useCallback(
    (
      params: ExtractOutput<
        InferSchemaFromField<TEndpoint["fields"], FieldUsage.RequestData>
      >,
    ) => {
      // Type-safe conversion for form query params
      if (params === undefined || params === null) {
        setFormQueryParams(formId, {});
      } else if (typeof params === "object") {
        // Convert object to FormQueryParams
        const safeParams: FormQueryParams = {};
        for (const [key, value] of Object.entries(
          params as {
            [key: string]: string | number | boolean | null | undefined;
          },
        )) {
          if (
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean"
          ) {
            safeParams[key] = value;
          } else if (value !== undefined && value !== null) {
            // Convert other types to string safely
            if (typeof value === "object") {
              // Try to serialize object safely, skip if it fails
              try {
                safeParams[key] = JSON.stringify(value);
              } catch {
                // Skip objects that can't be serialized
                continue;
              }
            } else {
              safeParams[key] = String(value);
            }
          }
        }
        setFormQueryParams(formId, safeParams);
      } else {
        // For primitive types, create a simple object
        setFormQueryParams(formId, { value: String(params) });
      }
    },
    [formId, setFormQueryParams],
  );

  // Form selectors and state management
  const formSelector = useMemo(
    () =>
      (
        state: ApiStore,
      ):
        | {
          formError: ErrorResponseType | null;
          isSubmitting: boolean;
        }
        | undefined =>
        state.forms[formId],
    [formId],
  );

  const formState = useApiStore(formSelector) ?? {
    formError: null,
    isSubmitting: false,
  };

  // Extract store methods for error handling
  const setFormErrorStore = useApiStore((state) => state.setFormError);
  const clearFormErrorStore = useApiStore((state) => state.clearFormError);

  // Create base form configuration
  type FormData = ExtractOutput<
    InferSchemaFromField<TEndpoint["fields"], FieldUsage.RequestData>
  >;

  const formConfig = {
    ...restFormOptions,
    resolver: zodResolver(endpoint.requestSchema as z.ZodType<FormData>),
  };

  // Generate a storage key based on the endpoint if not provided
  const storageKey =
    persistenceKey ||
    `query-form-${endpoint.path.join("-")}-${endpoint.method}`;

  // Initialize form with the proper configuration
  const formMethods = useForm<FormData>(formConfig);
  const { watch } = formMethods;

  // Implement form persistence directly
  const clearSavedForm = useCallback((): void => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      // Clear from localStorage
      localStorage.removeItem(storageKey);
      // Reset the form to default values if available, otherwise empty
      const resetData =
        (restFormOptions.defaultValues as ExtractOutput<
          InferSchemaFromField<TEndpoint["fields"], FieldUsage.RequestData>
        >) ||
        ({} as ExtractOutput<
          InferSchemaFromField<TEndpoint["fields"], FieldUsage.RequestData>
        >);
      formMethods.reset(resetData);
      // Update query params with reset data
      setQueryParams(resetData);
    } catch {
      // Handle error silently - we don't want to break the UI for storage errors
      // In a production app, this would use a proper error logging service
    }
  }, [formMethods, storageKey, setQueryParams, restFormOptions.defaultValues]);

  // Load saved form values on mount
  useEffect(() => {
    if (!persistForm || typeof window === "undefined") {
      return;
    }

    try {
      const savedFormData = localStorage.getItem(storageKey);
      if (savedFormData) {
        const parsedData = JSON.parse(savedFormData) as ExtractOutput<
          InferSchemaFromField<TEndpoint["fields"], FieldUsage.RequestData>
        >;
        formMethods.reset(parsedData);
        // Update query params with saved data
        setQueryParams(parsedData);
      }
    } catch {
      // Handle error silently - we don't want to break the UI for storage errors
      // In a production app, this would use a proper error logging service
    }
  }, [formMethods, storageKey, persistForm, setQueryParams]);

  // Save form values when they change
  useEffect(() => {
    if (!persistForm || typeof window === "undefined") {
      return;
    }

    let persistDebounceTimer: number | null = null;
    const persistDebounceMs = 500; // 500ms debounce for persistence

    const subscription = formMethods.watch((formValues) => {
      if (Object.keys(formValues).length > 0) {
        // Clear any existing timer
        if (persistDebounceTimer !== null) {
          window.clearTimeout(persistDebounceTimer);
        }

        // Set a new timer
        persistDebounceTimer = window.setTimeout(() => {
          try {
            localStorage.setItem(storageKey, JSON.stringify(formValues));
          } catch {
            // Handle error silently - we don't want to break the UI for storage errors
            // In a production app, this would use a proper error logging service
          }
        }, persistDebounceMs);
      }
    });

    return (): void => {
      subscription.unsubscribe();
      if (persistDebounceTimer !== null) {
        window.clearTimeout(persistDebounceTimer);
      }
    };
  }, [formMethods, storageKey, persistForm]);

  // Error management functions
  const clearFormError = useCallback(
    () => clearFormErrorStore(formId),
    [clearFormErrorStore, formId],
  );

  const setError = useCallback(
    (error: Error | null) => {
      if (error) {
        // Convert Error to ErrorResponseType
        const errorResponse = fail({
          message:
            "app.api.v1.core.system.unifiedInterface.react.hooks.queryForm.errors.validation_failed",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          messageParams: { formId, message: error.message },
        });
        setFormErrorStore(formId, errorResponse);
      } else {
        setFormErrorStore(formId, null);
      }
    },
    [setFormErrorStore, formId],
  );

  // Use API query with form values as parameters from the store
  const finalEnabled = queryOptions.enabled !== false;

  const query = useApiQuery({
    endpoint,
    requestData: queryParams,
    urlPathParams: urlPathParams,
    logger,
    options: {
      ...queryOptions,
      enabled: finalEnabled,
      staleTime: 0, // Disable caching for filter forms to ensure fresh data
      cacheTime: 0, // Disable cache storage
      // Use a custom onError handler
      onError: ({ error }): void => {
        if (queryOptions.onError) {
          // Call the user's onError handler with the error
          queryOptions.onError({
            error,
            requestData: queryParams,
            urlPathParams: urlPathParams,
          });
        }
      },
      // Ensure retry is a number if provided
      retry:
        typeof queryOptions.retry === "boolean"
          ? queryOptions.retry
            ? 3
            : 0
          : typeof queryOptions.retry === "function"
            ? 3
            : queryOptions.retry,
    },
  });

  // Force refetch when queryParams change (since useApiQuery doesn't auto-refetch)
  const prevQueryParamsRef = useRef<
    | ExtractOutput<
      InferSchemaFromField<TEndpoint["fields"], FieldUsage.RequestData>
    >
    | undefined
  >(undefined);
  useEffect(() => {
    // Skip the first render (initial load)
    if (
      prevQueryParamsRef.current &&
      queryParams &&
      typeof queryParams === "object"
    ) {
      // Deep compare to avoid infinite rerenders
      const hasChanged =
        JSON.stringify(prevQueryParamsRef.current) !==
        JSON.stringify(queryParams);
      if (hasChanged && Object.keys(queryParams).length > 0) {
        // Only refetch if not already loading to avoid conflicts
        if (!query.isLoading) {
          void query.refetch();
        }
      }
    }
    prevQueryParamsRef.current = queryParams;
  }, [queryParams, query]);

  // Watch for form changes and update query params
  useEffect(() => {
    if (autoSubmit) {
      // Track if this effect is still mounted to prevent memory leaks
      let isMounted = true;

      // Track the last time we submitted to prevent excessive submissions
      let lastSubmitTime = 0;
      const minSubmitInterval = 2000; // Minimum 2 seconds between submissions

      const subscription = watch((formData) => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
          debounceTimerRef.current = null;
        }

        // Check if we've submitted recently
        const now = Date.now();
        if (now - lastSubmitTime < minSubmitInterval) {
          // If we're submitting too frequently, use a longer debounce
          const adjustedDebounce = debounceMs * 2;

          debounceTimerRef.current = window.setTimeout(() => {
            if (!isMounted) {
              return;
            }

            if (formData) {
              lastSubmitTime = Date.now();
              setQueryParams(
                formData as ExtractOutput<
                  InferSchemaFromField<
                    TEndpoint["fields"],
                    FieldUsage.RequestData
                  >
                >,
              );
            }
          }, adjustedDebounce);
        } else {
          // Normal debounce behavior
          debounceTimerRef.current = window.setTimeout(() => {
            if (!isMounted) {
              return;
            }

            if (formData) {
              lastSubmitTime = Date.now();
              setQueryParams(
                formData as ExtractOutput<
                  InferSchemaFromField<
                    TEndpoint["fields"],
                    FieldUsage.RequestData
                  >
                >,
              );
            }
          }, debounceMs);
        }
      });

      return (): void => {
        isMounted = false;
        subscription.unsubscribe();
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
          debounceTimerRef.current = null;
        }
      };
    }
    return;
  }, [watch, autoSubmit, debounceMs, setQueryParams]);

  // Track the last submission time to prevent excessive API calls
  const lastSubmitTimeRef = useRef<number>(0);
  const isSubmittingRef = useRef<boolean>(false);
  const minSubmitInterval = 2000; // Minimum 2 seconds between submissions

  // Create a submit handler that validates and submits the form
  const submitForm: SubmitFormFunction<
    ExtractOutput<
      InferSchemaFromField<TEndpoint["fields"], FieldUsage.RequestData>
    >,
    ExtractOutput<
      InferSchemaFromField<TEndpoint["fields"], FieldUsage.Response>
    >,
    ExtractOutput<
      InferSchemaFromField<TEndpoint["fields"], FieldUsage.RequestUrlParams>
    >
  > = (
    event: FormEvent<HTMLFormElement> | undefined,
    inputOptions?: SubmitFormFunctionOptions<
      ExtractOutput<
        InferSchemaFromField<TEndpoint["fields"], FieldUsage.RequestData>
      >,
      ExtractOutput<
        InferSchemaFromField<TEndpoint["fields"], FieldUsage.Response>
      >,
      ExtractOutput<
        InferSchemaFromField<TEndpoint["fields"], FieldUsage.RequestUrlParams>
      >
    >,
  ): void => {
      // Prevent default form submission behavior
      if (event) {
        event.preventDefault();
      }

      // Create a properly typed options object with urlParamVariables
      const options: SubmitFormFunctionOptions<
        ExtractOutput<
          InferSchemaFromField<TEndpoint["fields"], FieldUsage.RequestData>
        >,
        ExtractOutput<
          InferSchemaFromField<TEndpoint["fields"], FieldUsage.Response>
        >,
        ExtractOutput<
          InferSchemaFromField<TEndpoint["fields"], FieldUsage.RequestUrlParams>
        >
      > = {
        ...(inputOptions || {}),
        urlParamVariables:
          inputOptions?.urlParamVariables ||
          ({} as ExtractOutput<
            InferSchemaFromField<TEndpoint["fields"], FieldUsage.RequestUrlParams>
          >),
      };
      // Define the internal submit function that will be called after validation
      const _submitForm = async (): Promise<void> => {
        try {
          // Check if we're already submitting to prevent duplicate requests
          if (isSubmittingRef.current) {
            logger.debug("Already submitting, skipping duplicate request", {
              endpoint: endpoint.path.join("/"),
            });
            return;
          }

          // Get the current time for throttling
          const currentTime = Date.now();

          // Check if we're submitting too frequently
          if (currentTime - lastSubmitTimeRef.current < minSubmitInterval) {
            // We're submitting too frequently, throttle by waiting
            logger.debug("Throttling form submission", {
              endpoint: endpoint.path.join("/"),
            });
            await new Promise<void>((resolve) => {
              setTimeout(() => resolve(), minSubmitInterval);
            });
          }

          // Mark as submitting - use a synchronized approach to avoid race conditions
          // First, store the current state
          const wasSubmitting = isSubmittingRef.current;

          // Only update if not already submitting
          if (!wasSubmitting) {
            // Set the submitting flag atomically
            isSubmittingRef.current = true;
          }

          // Update the last submit time
          // This is safe because we're not depending on the previous value
          // and we're not in a concurrent environment where this would be an issue
          // This is a false positive for race conditions
          // eslint-disable-next-line require-atomic-updates
          lastSubmitTimeRef.current = Date.now();

          // Get form data
          const formData: ExtractOutput<
            InferSchemaFromField<TEndpoint["fields"], FieldUsage.RequestData>
          > = formMethods.getValues();

          // Clear any previous errors
          clearFormError();

          // Update query params immediately
          setQueryParams(formData);

          // Refetch with the new params
          const response = await query.refetch();
          // Convert the response to a proper ResponseType
          const result =
            typeof response === "object" &&
              response !== null &&
              "success" in response
              ? response
              : createSuccessResponse(response);

          // Call the onSuccess callback if provided and the result is successful
          if (result.success && options.onSuccess) {
            logger.debug("Calling onSuccess callback", {
              endpoint: endpoint.path.join("/"),
            });
            options.onSuccess({
              responseData: result.data,
              pathParams: options.urlParamVariables,
              requestData: formData,
            });
          } else if (!result.success && options.onError) {
            logger.debug("Calling onError callback", {
              endpoint: endpoint.path.join("/"),
            });
            // If the result is not successful, call the onError callback
            options.onError({
              error: result,
              requestData: formData,
              pathParams:
                options.urlParamVariables ||
                ({} as ExtractOutput<
                  InferSchemaFromField<
                    TEndpoint["fields"],
                    FieldUsage.RequestUrlParams
                  >
                >),
            });
          }
        } catch (error) {
          // Handle any errors that occur during submission
          const errorMessage = parseError(error).message;
          logger.error("Error in submitForm", {
            endpoint: endpoint.path.join("/"),
            error: errorMessage,
          });

          const errorResponse = fail({
            message:
              "app.api.v1.core.system.unifiedInterface.react.hooks.queryForm.errors.network_failure",
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
            messageParams: { formId, error: errorMessage },
          });

          // Set the error in the form state
          setError(new Error(errorResponse.message));

          // Call the onError callback if provided
          if (options.onError) {
            options.onError({
              error: errorResponse,
              requestData: formMethods.getValues(),
              pathParams:
                options.urlParamVariables ||
                ({} as ExtractOutput<
                  InferSchemaFromField<
                    TEndpoint["fields"],
                    FieldUsage.RequestUrlParams
                  >
                >),
            });
          }
        } finally {
          // Mark as no longer submitting
          // This is safe because we're not depending on the previous value
          // and we're not in a concurrent environment where this would be an issue
          // This is a false positive for race conditions
          // eslint-disable-next-line require-atomic-updates
          isSubmittingRef.current = false;
        }
      };

      // Use the form's handleSubmit method to validate before submitting
      void formMethods.handleSubmit(
        // Success handler - form is valid
        _submitForm,
        // Error handler - form is invalid
        (errors) => {
          if (options.onError) {
            // Create a proper error response for validation errors with translation key
            const errorResponse = fail({
              message:
                "app.api.v1.core.system.unifiedInterface.react.hooks.queryForm.errors.validation_failed",
              errorType: ErrorResponseTypes.VALIDATION_ERROR,
              messageParams: { formId, errors: JSON.stringify(errors) },
            });

            // Call the onError callback with the validation error
            options.onError({
              error: errorResponse,
              requestData: formMethods.getValues(),
              pathParams:
                options.urlParamVariables ||
                ({} as ExtractOutput<
                  InferSchemaFromField<
                    TEndpoint["fields"],
                    FieldUsage.RequestUrlParams
                  >
                >),
            });
          }
        },
      )(event);
    };

  // Create a result object that combines form and query functionality
  return {
    form: formMethods,

    // Use the query response as the primary response
    response: query.response,

    // Backward compatibility properties
    isSubmitSuccessful: query.isSuccess,
    submitError: query.error ?? formState.formError ?? undefined,
    errorMessage:
      query.error?.message ?? formState.formError?.message ?? undefined,

    // Query-specific properties (backward compatibility)
    data: query.data,
    error: query.error,
    isError: query.isError,
    isSuccess: query.isSuccess,

    isSubmitting: query.isLoading,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    status: query.status,
    refetch: query.refetch,
    submitForm,
    setErrorType: (error: ErrorResponseType | null): void => {
      // Update form error state
      setFormErrorStore(formId, error);

      // Also update query error state if query.setErrorType exists
      if (query.setErrorType) {
        query.setErrorType(error);
      }
    },

    // Form persistence
    clearSavedForm,
  };
}
