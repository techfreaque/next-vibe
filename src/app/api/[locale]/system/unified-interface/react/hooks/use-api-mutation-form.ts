"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { isErrorResponseType } from "next-vibe/shared/utils/parse-error";
import { storage } from "next-vibe-ui/lib/storage";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { extractSchemaDefaults } from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { CreateApiEndpointAny } from "../../shared/types/endpoint";
import { useApiStore } from "./store";
import type {
  ApiFormOptions,
  ApiFormReturn,
  ApiMutationOptions,
  SubmitFormFunction,
  SubmitFormFunctionOptions,
} from "./types";
import { useApiMutation } from "./use-api-mutation";

/**
 * Creates a form integrated with API mutation based on the endpoint's request schema
 * Works with both React and React Native
 *
 * Features:
 * - Form validation using Zod schema
 * - Form persistence using platform-agnostic storage (enabled by default)
 * - API integration with error handling
 * - Toast notifications for success and error states
 *
 * @param endpoint - The API endpoint to use
 * @param options - Form options including defaultValues and persistence options
 * @param mutationOptions - API mutation options
 * @returns Form and mutation for API interaction with enhanced error handling
 */
export function useApiForm<TEndpoint extends CreateApiEndpointAny>(
  endpoint: TEndpoint,
  logger: EndpointLogger,
  options: ApiFormOptions<TEndpoint["types"]["RequestOutput"]> = {},
  mutationOptions: ApiMutationOptions<
    TEndpoint["types"]["RequestOutput"],
    TEndpoint["types"]["ResponseOutput"],
    TEndpoint["types"]["UrlVariablesOutput"]
  > = {},
): ApiFormReturn<
  TEndpoint["types"]["RequestOutput"],
  TEndpoint["types"]["ResponseOutput"],
  TEndpoint["types"]["UrlVariablesOutput"]
> {
  const { getFormId } = useApiStore();
  const formId = getFormId(endpoint);

  // Use React Query-based mutation hook
  const mutation = useApiMutation(endpoint, logger, mutationOptions);

  // Get form state from Zustand (forms state remains in Zustand)
  const formState = useApiStore((state) => state.forms[formId]) ?? {
    formError: null,
    isSubmitting: false,
  };

  // Extract store methods for error handling
  const setFormErrorStore = useApiStore((state) => state.setFormError);
  const clearFormErrorStore = useApiStore((state) => state.clearFormError);

  // Create base configuration with resolver
  type FormData = TEndpoint["types"]["RequestOutput"];

  // Auto-generate default values from schema if not provided
  // This ensures form fields start with empty strings instead of undefined
  const schemaDefaultValues = useMemo(() => {
    const extracted = extractSchemaDefaults<FormData>(
      endpoint.requestSchema,
      logger,
      "",
      true, // forFormInit: return empty values for primitives
    );
    const baseDefaults = (extracted ?? {}) as FormData;

    // Pass through Zod's parse to validate and apply transformations
    const parsed = endpoint.requestSchema.safeParse(baseDefaults);
    if (parsed.success) {
      return parsed.data as FormData;
    }

    // If validation fails, return the extracted defaults as-is
    return baseDefaults;
  }, [endpoint.requestSchema, logger]);

  // Merge schema defaults with provided defaultValues (provided values take priority)
  const mergedDefaultValues = useMemo(() => {
    const provided = options.defaultValues as FormData | undefined;
    if (provided && Object.keys(provided).length > 0) {
      return { ...schemaDefaultValues, ...provided };
    }
    return schemaDefaultValues;
  }, [schemaDefaultValues, options.defaultValues]);

  const formConfig = {
    ...options,
    resolver: zodResolver(endpoint.requestSchema),
    mode: "onSubmit" as const,
    reValidateMode: "onChange" as const,
    defaultValues: mergedDefaultValues,
  };

  logger.debug("Form config for useForm", {
    endpoint: endpoint.path.join("/"),
    defaultValues: options.defaultValues,
    hasDefaultValues: !!options.defaultValues,
    defaultValuesKeys: options.defaultValues
      ? Object.keys(options.defaultValues)
      : [],
    requestSchema: endpoint.requestSchema,
    requestSchemaShape: endpoint.requestSchema?.shape
      ? Object.keys(endpoint.requestSchema.shape)
      : "no shape",
  });

  // Extract persistence options
  const { persistForm = true, persistenceKey } = options;

  // Generate a storage key based on the endpoint if not provided
  const storageKey =
    // eslint-disable-next-line i18next/no-literal-string
    persistenceKey || `form-${endpoint.path.join("-")}-${endpoint.method}`;

  const formMethods = useForm<FormData>(formConfig);

  // Implement form persistence directly
  const clearSavedForm = useCallback((): void => {
    if (typeof window === "undefined") {
      return;
    }

    void (async (): Promise<void> => {
      try {
        // Clear from storage
        await storage.removeItem(storageKey);
        // Reset the form to merged default values (schema + provided)
        formMethods.reset(mergedDefaultValues);
      } catch (error) {
        logger.error(
          "Error clearing form data from storage:",
          parseError(error),
        );
      }
    })();
  }, [formMethods, storageKey, mergedDefaultValues, logger]);

  // Load saved form values on mount
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
          formMethods.reset(parsedData);
        }
      } catch (error) {
        logger.error(
          "Error loading form data from storage:",
          parseError(error),
        );
      }
    })();
  }, [formMethods, storageKey, persistForm, logger]);

  // Save form values when they change
  useEffect(() => {
    if (!persistForm || typeof window === "undefined") {
      return;
    }

    let debounceTimer: number | null = null;
    const debounceMs = 500; // 500ms debounce

    const subscription = formMethods.watch((formValues) => {
      if (Object.keys(formValues).length > 0) {
        // Clear any existing timer
        if (debounceTimer !== null) {
          window.clearTimeout(debounceTimer);
        }

        // Set a new timer
        debounceTimer = window.setTimeout(() => {
          void (async (): Promise<void> => {
            try {
              await storage.setItem(storageKey, JSON.stringify(formValues));
            } catch (error) {
              logger.error(
                "Error saving form data to storage:",
                parseError(error),
              );
            }
          })();
        }, debounceMs);
      }
    });

    return (): void => {
      subscription.unsubscribe();
      if (debounceTimer !== null) {
        window.clearTimeout(debounceTimer);
      }
    };
  }, [formMethods, storageKey, persistForm, logger]);

  // Error management functions
  const clearFormError = useCallback(
    () => clearFormErrorStore(formId),
    [clearFormErrorStore, formId],
  );

  const setError = useCallback(
    (error: ErrorResponseType | null) => setFormErrorStore(formId, error),
    [setFormErrorStore, formId],
  );

  // Function to set error type - this is the new function
  const setErrorType = useCallback(
    (error: ErrorResponseType | null): void => {
      setError(error);
    },
    [setError],
  );

  // Create a submit handler that validates and submits the form
  const submitForm = ((
    options: TEndpoint["types"]["UrlVariablesOutput"] extends undefined
      ? undefined
      : SubmitFormFunctionOptions<
          TEndpoint["types"]["RequestOutput"],
          TEndpoint["types"]["ResponseOutput"],
          TEndpoint["types"]["UrlVariablesOutput"]
        >,
  ): void => {
    logger.debug("submitForm called", {
      endpoint: endpoint.path.join("/"),
    });

    const _submitForm = async (
      validatedData: TEndpoint["types"]["RequestOutput"],
    ): Promise<void> => {
      logger.debug("_submitForm called with validated data", {
        endpoint: endpoint.path.join("/"),
        validatedData,
        validatedDataKeys: Object.keys(validatedData),
        validatedDataValues: Object.values(validatedData),
      });
      try {
        // Clear any previous errors
        clearFormError();

        // Call the API with the validated form data using React Query mutation
        const urlPathParams = options?.urlParamVariables;

        const result = await mutation.mutateAsync({
          requestData: validatedData,
          urlPathParams,
        });

        if (result === undefined) {
          logger.error("Mutation result is undefined", {
            endpoint: [...endpoint.path].join("/"),
          });
          return undefined;
        }

        // Extract the data from the ResponseType
        const responseData = result.success
          ? result.data
          : (undefined as TEndpoint["types"]["ResponseOutput"]);

        // Cast the result to TResponse to satisfy the type system
        const onSuccessResult = options?.onSuccess?.({
          responseData: responseData as TEndpoint["types"]["ResponseOutput"],
          pathParams: options?.urlParamVariables,
          requestData: validatedData,
        });

        // If onSuccess returns an error, treat it as an error
        if (onSuccessResult) {
          setError(onSuccessResult);
          options?.onError?.({
            error: onSuccessResult,
            requestData: validatedData,
            pathParams: options?.urlParamVariables,
          });
        }
      } catch (error) {
        logger.error("Error in submitForm", parseError(error), {
          endpoint: endpoint.path.join("/"),
        });

        // Handle any errors that occur during submission
        // If the error is already an ErrorResponseType, use it directly
        const errorResponse = isErrorResponseType(error)
          ? error
          : fail({
              message:
                "app.api.system.unifiedInterface.react.hooks.mutationForm.post.errors.mutation_failed.title",
              errorType: ErrorResponseTypes.INTERNAL_ERROR,
            });

        setError(errorResponse);
        const formData = formMethods.getValues();
        options?.onError?.({
          error: errorResponse,
          requestData: formData,
          pathParams: options?.urlParamVariables,
        });
      }
    };
    void formMethods.handleSubmit(_submitForm, (errors) => {
      logger.error("Form validation errors", {
        endpoint: [...endpoint.path].join("/"),
        errors: JSON.stringify(errors),
      });

      // Create an error response for form validation errors
      const errorResponse = fail({
        message:
          "app.api.system.unifiedInterface.react.hooks.mutationForm.post.errors.validation_error.title",
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
        messageParams: { formErrors: JSON.stringify(errors) },
      });

      // Set the error in the form state so it's displayed
      setError(errorResponse);

      options?.onError?.({
        error: errorResponse,
        requestData: formMethods.getValues(),
        pathParams: options?.urlParamVariables,
      });
    })();
  }) as SubmitFormFunction<
    TEndpoint["types"]["RequestOutput"],
    TEndpoint["types"]["ResponseOutput"],
    TEndpoint["types"]["UrlVariablesOutput"]
  >;

  // Create the response object from mutation data
  const response:
    | ResponseType<TEndpoint["types"]["ResponseOutput"]>
    | undefined = mutation.data
    ? mutation.data
    : mutation.error
      ? mutation.error
      : formState.formError
        ? formState.formError
        : undefined;

  // Simplify submitError to avoid complex union types
  const submitError: ErrorResponseType | undefined =
    mutation.error || formState.formError || undefined;

  return {
    form: formMethods,
    response,
    // Backward compatibility properties
    isSubmitSuccessful: mutation.isSuccess,
    submitError,

    isSubmitting: mutation.isPending,
    submitForm,
    clearSavedForm,
    setErrorType,
  };
}
