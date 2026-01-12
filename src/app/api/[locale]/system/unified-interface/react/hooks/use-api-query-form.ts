"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ErrorResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { storage } from "next-vibe-ui/lib/storage";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useForm, type UseFormProps } from "react-hook-form";

import { extractSchemaDefaults } from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";

import { buildKey } from "./query-key-builder";
import type { ApiStore, FormQueryParams } from "./store";
import { useApiStore } from "./store";
import { deserializeQueryParams } from "./store";
import type {
  ApiQueryFormOptions,
  ApiQueryFormReturn,
  ApiQueryOptions,
  SubmitFormFunction,
  SubmitFormFunctionOptions,
} from "./types";
import { useApiQuery } from "./use-api-query";

/**
 * Deep merge saved data with defaults
 * Uses default values for any undefined/null values in saved data
 */
function mergeWithDefaults<T>(saved: T, defaults: T): T {
  if (defaults === null || defaults === undefined) {
    return saved;
  }
  if (saved === null || saved === undefined) {
    return defaults;
  }
  if (typeof defaults !== "object" || typeof saved !== "object") {
    // For primitives, use saved if it has a value, otherwise use default
    return saved ?? defaults;
  }
  if (Array.isArray(defaults)) {
    // For arrays, use saved if it exists
    return saved as T;
  }

  // For objects, recursively merge
  const result = { ...defaults } as Record<string, unknown>;
  for (const key of Object.keys(saved as Record<string, unknown>)) {
    const savedValue = (saved as Record<string, unknown>)[key];
    const defaultValue = (defaults as Record<string, unknown>)[key];

    if (savedValue !== undefined && savedValue !== null && savedValue !== "") {
      // Saved value exists and is not empty - use it (with recursive merge for objects)
      if (
        typeof savedValue === "object" &&
        !Array.isArray(savedValue) &&
        savedValue !== null
      ) {
        result[key] = mergeWithDefaults(savedValue, defaultValue);
      } else {
        result[key] = savedValue;
      }
    }
    // If savedValue is undefined/null/empty, we keep the default (already in result)
  }
  return result as T;
}

/**
 * Creates a form that automatically updates a query based on form values
 * Useful for search forms, filters, and other query parameter-based APIs
 *
 * Features:
 * - Form validation using Zod schema
 * - Form persistence using platform-agnostic storage (enabled by default)
 * - Automatic query updates based on form values
 * - Debounced form submissions to prevent excessive API calls
 *
 * @param endpoint - The API endpoint to use
 * @param urlPathParams - URL variables for the endpoint
 * @param formOptions - Form options including defaultValues and persistence options
 * @param queryOptions - API query options
 * @returns Form and query for API interaction with enhanced error handling
 */
export function useApiQueryForm<TEndpoint extends CreateApiEndpointAny>({
  endpoint,
  urlPathParams,
  formOptions = { persistForm: true, autoSubmit: true, debounceMs: 500 },
  queryOptions = { enabled: true },
  logger,
}: {
  endpoint: TEndpoint;
  urlPathParams: TEndpoint["types"]["UrlVariablesOutput"];
  formOptions?: ApiQueryFormOptions<TEndpoint["types"]["RequestOutput"]> & {
    /**
     * Whether to enable form persistence
     * @default true
     */
    persistForm?: boolean;
    /**
     * The key to use for storing form data in storage
     * If not provided, a key will be generated based on the endpoint
     */
    persistenceKey?: string;
  };
  queryOptions: ApiQueryOptions<
    TEndpoint["types"]["RequestOutput"],
    TEndpoint["types"]["ResponseOutput"],
    TEndpoint["types"]["UrlVariablesOutput"]
  >;
  logger: EndpointLogger;
}): ApiQueryFormReturn<
  TEndpoint["types"]["RequestOutput"],
  TEndpoint["types"]["ResponseOutput"],
  TEndpoint["types"]["UrlVariablesOutput"]
> {
  if (!endpoint) {
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax, i18next/no-literal-string -- React hook requires throwing for missing required endpoint parameter
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
  // Recursively extract default values from the Zod schema
  // This traverses the entire schema tree and builds an object with all default values
  // Works even when the top-level schema has required fields without defaults
  const schemaDefaultValues = useMemo<
    TEndpoint["types"]["RequestOutput"]
  >(() => {
    // Step 1: Extract defaults recursively from schema structure
    // Use forFormInit=true to get empty defaults for primitives (e.g., "" for strings)
    // This ensures required fields are initialized with proper empty values
    const extracted = extractSchemaDefaults<
      TEndpoint["types"]["RequestOutput"]
    >(endpoint.requestSchema, logger, "", true);
    const baseDefaults = (extracted ??
      {}) as TEndpoint["types"]["RequestOutput"];

    // Step 2: Pass through Zod's parse to validate and apply transformations
    // This ensures coercions (z.coerce.number()) and other transforms work
    const parsed = endpoint.requestSchema.safeParse(baseDefaults);
    if (parsed.success) {
      return parsed.data as TEndpoint["types"]["RequestOutput"];
    }

    // If validation fails, return the extracted defaults as-is
    return baseDefaults;
  }, [endpoint.requestSchema, logger]);

  // Merge schema defaults with provided defaultValues
  const mergedDefaultValues = useMemo<
    TEndpoint["types"]["RequestOutput"]
  >(() => {
    const provided = restFormOptions.defaultValues;
    if (
      provided &&
      typeof provided === "object" &&
      Object.keys(provided).length > 0
    ) {
      // Merge provided values over schema defaults
      return {
        ...schemaDefaultValues,
        ...provided,
      } as TEndpoint["types"]["RequestOutput"];
    }
    return schemaDefaultValues;
  }, [schemaDefaultValues, restFormOptions.defaultValues]);

  // Get query params reactively using a memoized selector with stable default
  // Use mergedDefaultValues (schema defaults + provided defaults) as the default query params
  const defaultQueryParams = useMemo(
    () => mergedDefaultValues,
    [mergedDefaultValues],
  );
  // Selector must return stable references - just get raw params from store
  const rawQueryParamsSelector = useMemo(
    () =>
      (state: ApiStore): FormQueryParams | undefined =>
        state.forms[formId]?.queryParams,
    [formId],
  );
  const rawQueryParams = useApiStore(rawQueryParamsSelector);

  // Deserialize outside selector to avoid infinite loop from new object references
  const queryParams = useMemo((): TEndpoint["types"]["RequestOutput"] => {
    if (!rawQueryParams) {
      return defaultQueryParams;
    }
    // Deserialize JSON-stringified nested objects back to their original form
    return deserializeQueryParams<TEndpoint["types"]["RequestOutput"]>(
      rawQueryParams,
    );
  }, [rawQueryParams, defaultQueryParams]);

  // Create a function to update query params in the store
  const setQueryParams = useCallback(
    (params: TEndpoint["types"]["RequestOutput"]) => {
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

  // Generate a storage key based on the endpoint if not provided
  const storageKey =
    persistenceKey || buildKey("query-form", endpoint, undefined, logger);

  // Create form configuration with schema defaults
  const formConfigWithDefaults: UseFormProps<
    TEndpoint["types"]["RequestOutput"]
  > = {
    ...restFormOptions,
    resolver: zodResolver<
      TEndpoint["types"]["RequestOutput"],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
      TEndpoint["types"]["RequestOutput"]
    >(endpoint.requestSchema),
    defaultValues: mergedDefaultValues,
  };

  // Initialize form with the proper configuration including schema defaults
  const formMethods = useForm<TEndpoint["types"]["RequestOutput"]>(
    formConfigWithDefaults,
  );
  const { watch } = formMethods;

  // Implement form persistence directly
  const clearSavedForm = useCallback((): void => {
    if (typeof window === "undefined") {
      return;
    }

    void (async (): Promise<void> => {
      try {
        // Clear from storage
        await storage.removeItem(storageKey);
        // Reset the form to default values if available, otherwise empty
        const resetData: TEndpoint["types"]["RequestOutput"] =
          (restFormOptions.defaultValues as TEndpoint["types"]["RequestOutput"]) ||
          ({} as TEndpoint["types"]["RequestOutput"]);
        formMethods.reset(resetData);
        // Update query params with reset data
        setQueryParams(resetData);
      } catch {
        // Handle error silently - we don't want to break the UI for storage errors
        // In a production app, this would use a proper error logging service
      }
    })();
  }, [formMethods, storageKey, setQueryParams, restFormOptions.defaultValues]);

  // Load saved form values on mount - merge with schema defaults
  useEffect(() => {
    if (!persistForm || typeof window === "undefined") {
      return;
    }

    void (async (): Promise<void> => {
      try {
        const savedFormData = await storage.getItem(storageKey);
        if (savedFormData) {
          const parsedData = JSON.parse(
            savedFormData,
          ) as TEndpoint["types"]["RequestOutput"];
          // Merge saved data with schema defaults - defaults take precedence for undefined/null values
          const mergedData = mergeWithDefaults(parsedData, mergedDefaultValues);
          formMethods.reset(mergedData);
          // Update query params with merged data
          setQueryParams(mergedData);
        }
      } catch {
        // Handle error silently - we don't want to break the UI for storage errors
        // In a production app, this would use a proper error logging service
      }
    })();
  }, [
    formMethods,
    storageKey,
    persistForm,
    setQueryParams,
    mergedDefaultValues,
  ]);

  // Save form values when they change
  useEffect(() => {
    if (!persistForm || typeof window === "undefined") {
      return;
    }

    let persistDebounceTimer: number | null = null;
    const persistDebounceMs = 500; // 500ms debounce for persistence

    const subscription = formMethods.watch((formValues) => {
      if (formValues && Object.keys(formValues).length > 0) {
        // Clear any existing timer
        if (persistDebounceTimer !== null) {
          window.clearTimeout(persistDebounceTimer);
        }

        // Set a new timer
        persistDebounceTimer = window.setTimeout(() => {
          void (async (): Promise<void> => {
            try {
              await storage.setItem(storageKey, JSON.stringify(formValues));
            } catch {
              // Handle error silently - we don't want to break the UI for storage errors
              // In a production app, this would use a proper error logging service
            }
          })();
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
            "app.api.system.unifiedInterface.react.hooks.queryForm.errors.validation_failed",
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
      // Respect staleTime and cacheTime from queryOptions
      // Don't hardcode to 0 as this breaks caching for all read endpoints
      // Custom onSuccess handler to merge response data into form
      onSuccess: (
        data,
      ): void | ErrorResponseType | Promise<void | ErrorResponseType> => {
        // Merge response data into form so FormFieldWidget can display it
        const responseData = data.responseData;
        const currentFormData = formMethods.getValues();

        // Merge response data into form - preserve request fields
        const mergedData = {
          ...currentFormData,
          ...responseData,
        } as TEndpoint["types"]["RequestOutput"];

        // Update form with merged data
        // This will trigger auto-submit watcher, but watcher filters through requestSchema
        // so only request fields are sent back to API (preventing 431 error)
        formMethods.reset(mergedData, { keepDirty: false, keepTouched: false });

        // Call the user's onSuccess handler if provided
        if (queryOptions.onSuccess) {
          return queryOptions.onSuccess(data);
        }
      },
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
    TEndpoint["types"]["RequestOutput"] | undefined
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
              // Filter formData through requestSchema to remove response-only fields
              // This prevents sending response data back to the API as query params
              const parsed = endpoint.requestSchema.safeParse(formData);
              const requestOnlyData = parsed.success ? parsed.data : formData;

              lastSubmitTime = Date.now();
              setQueryParams(requestOnlyData);
            }
          }, adjustedDebounce);
        } else {
          // Normal debounce behavior
          debounceTimerRef.current = window.setTimeout(() => {
            if (!isMounted) {
              return;
            }

            if (formData) {
              // Filter formData through requestSchema to remove response-only fields
              // This prevents sending response data back to the API as query params
              const parsed = endpoint.requestSchema.safeParse(formData);
              const requestOnlyData = parsed.success ? parsed.data : formData;

              lastSubmitTime = Date.now();
              setQueryParams(requestOnlyData);
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
  }, [watch, autoSubmit, debounceMs, setQueryParams, endpoint.requestSchema]);

  // Track the last submission time to prevent excessive API calls
  const lastSubmitTimeRef = useRef<number>(0);
  const isSubmittingRef = useRef<boolean>(false);
  const minSubmitInterval = 2000; // Minimum 2 seconds between submissions

  // Create a submit handler that validates and submits the form
  const submitForm: SubmitFormFunction<
    TEndpoint["types"]["RequestOutput"],
    TEndpoint["types"]["ResponseOutput"],
    TEndpoint["types"]["UrlVariablesOutput"]
  > = (
    inputOptions?: SubmitFormFunctionOptions<
      TEndpoint["types"]["RequestOutput"],
      TEndpoint["types"]["ResponseOutput"],
      TEndpoint["types"]["UrlVariablesOutput"]
    >,
  ): void => {
    // Create a properly typed options object with urlParamVariables
    const options: SubmitFormFunctionOptions<
      TEndpoint["types"]["RequestOutput"],
      TEndpoint["types"]["ResponseOutput"],
      TEndpoint["types"]["UrlVariablesOutput"]
    > = {
      ...(inputOptions || {}),
      urlParamVariables: inputOptions?.urlParamVariables,
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

        lastSubmitTimeRef.current = Date.now();

        // Get form data
        const formData: TEndpoint["types"]["RequestOutput"] =
          formMethods.getValues();

        // Clear any previous errors
        clearFormError();

        // Update query params in the store
        // The useApiQuery hook reads directly from the store using getState(),
        // so the refetch will use the updated values immediately
        setQueryParams(formData);

        // Refetch with the new params (reads from store directly)
        const response = await query.refetch();
        // Convert the response to a proper ResponseType
        const result =
          typeof response === "object" &&
          response !== null &&
          "success" in response
            ? response
            : success(response);

        // Call the onSuccess callback if provided and the result is successful
        if (result.success && options.onSuccess) {
          logger.debug("Calling onSuccess callback", {
            endpoint: endpoint.path.join("/"),
          });
          options.onSuccess({
            responseData: result.data,
            pathParams: options.urlParamVariables!,
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
            pathParams: options.urlParamVariables,
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
            "app.api.system.unifiedInterface.react.hooks.queryForm.errors.network_failure",
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
            pathParams: options.urlParamVariables,
          });
        }
      } finally {
        // Mark as no longer submitting
        // This is safe because we're not depending on the previous value
        // and we're not in a concurrent environment where this would be an issue
        // This is a false positive for race conditions

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
              "app.api.system.unifiedInterface.react.hooks.queryForm.errors.validation_failed",
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
            messageParams: { formId, errors: JSON.stringify(errors) },
          });

          // Call the onError callback with the validation error
          options.onError({
            error: errorResponse,
            requestData: formMethods.getValues(),
            pathParams: options.urlParamVariables,
          });
        }
      },
    )();
  };

  // Create a result object that combines form and query functionality
  // Simplify error message to avoid complex union type - use explicit type assertion
  const queryError = query.error;
  const formError = formState.formError;
  const queryErrorMessage: string = queryError
    ? (queryError.message as string)
    : "";
  const formErrorMessage: string = formError
    ? (formError.message as string)
    : "";
  const errorMessage: string | undefined =
    queryErrorMessage || formErrorMessage || undefined;

  return {
    form: formMethods,

    // Use the query response as the primary response
    response: query.response,

    // Backward compatibility properties
    isSubmitSuccessful: query.isSuccess,
    submitError: query.error || formState.formError || undefined,
    errorMessage,

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
