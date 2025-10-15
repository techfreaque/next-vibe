"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { isErrorResponseType } from "next-vibe/shared/utils/parse-error";
import type { FormEvent } from "react";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { useTranslation } from "@/i18n/core/client";

import type { UserRoleValue } from "../../../../../user/user-roles/enum";
import type { EndpointLogger } from "../../../cli/vibe/endpoints/endpoint-handler/logger";
import type { Methods } from "../../../cli/vibe/endpoints/endpoint-types/core/enums";
import type { UnifiedField } from "../../../cli/vibe/endpoints/endpoint-types/core/types";
import type { CreateApiEndpoint } from "../../../cli/vibe/endpoints/endpoint-types/endpoint/create";
import type { ApiStore, FormQueryParams } from "../store";
import { useApiStore } from "../store";
import type {
  ApiFormOptions,
  ApiFormReturn,
  ApiMutationOptions,
  SubmitFormFunction,
  SubmitFormFunctionOptions,
} from "../types";

/**
 * Creates a form integrated with API mutation based on the endpoint's request schema
 * Works with both React and React Native
 *
 * Features:
 * - Form validation using Zod schema
 * - Form persistence using localStorage (enabled by default)
 * - API integration with error handling
 * - Toast notifications for success and error states
 *
 * @param endpoint - The API endpoint to use
 * @param options - Form options including defaultValues and persistence options
 * @param mutationOptions - API mutation options
 * @returns Form and mutation for API interaction with enhanced error handling
 */
export function useApiForm<
  TEndpoint extends CreateApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
    any
  >,
>(
  endpoint: TEndpoint,
  logger: EndpointLogger,
  options: ApiFormOptions<TEndpoint["TRequestOutput"]> = {},
  mutationOptions: ApiMutationOptions<
    TEndpoint["TRequestOutput"],
    TEndpoint["TResponseOutput"],
    TEndpoint["TUrlVariablesOutput"]
  > = {},
): ApiFormReturn<
  TEndpoint["TRequestOutput"],
  TEndpoint["TResponseOutput"],
  TEndpoint["TUrlVariablesOutput"]
> {
  // Get Zustand store methods
  const { executeMutation, getMutationId, getFormId } = useApiStore();
  const { t, locale } = useTranslation();
  const formId = getFormId(endpoint);
  const mutationId = getMutationId(endpoint);

  // Create memoized selectors to prevent re-renders
  const mutationSelector = useMemo(
    () =>
      (
        state: ApiStore,
      ):
        | {
            isPending: boolean;
            isError: boolean;
            error: ErrorResponseType | null;
            isSuccess: boolean;
            data: TEndpoint["TResponseOutput"] | undefined;
          }
        | undefined =>
        state.mutations[mutationId] as
          | {
              isPending: boolean;
              isError: boolean;
              error: ErrorResponseType | null;
              isSuccess: boolean;
              data: TEndpoint["TResponseOutput"] | undefined;
            }
          | undefined,
    [mutationId],
  );

  const formSelector = useMemo(
    () =>
      (
        state: ApiStore,
      ):
        | {
            formError: ErrorResponseType | null;
            isSubmitting: boolean;
            queryParams?: FormQueryParams;
          }
        | undefined =>
        state.forms[formId],
    [formId],
  );

  // Extract state from the Zustand store with shallow comparison
  const mutationState = useApiStore(mutationSelector) ?? {
    isPending: false,
    isError: false,
    error: null,
    isSuccess: false,
    data: undefined,
  };

  const formState = useApiStore(formSelector) ?? {
    formError: null,
    isSubmitting: false,
  };

  // Extract store methods for error handling
  const setFormErrorStore = useApiStore((state) => state.setFormError);
  const clearFormErrorStore = useApiStore((state) => state.clearFormError);
  // Create base configuration with resolver
  type FormData = TEndpoint["TRequestOutput"];
  const formConfig = {
    ...options,
    resolver: zodResolver(endpoint.requestSchema),
  };

  // Extract persistence options
  const { persistForm = true, persistenceKey } = options;

  // Generate a storage key based on the endpoint if not provided
  const storageKey =
    // eslint-disable-next-line i18next/no-literal-string
    persistenceKey || `form-${endpoint.path.join("-")}-${endpoint.method}`;

  // @ts-ignore - FormData is guaranteed to be an object type from Zod, satisfying FieldValues
  const formMethods = useForm<FormData>(formConfig);

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
        (options.defaultValues as TEndpoint["TRequestOutput"]) ||
        ({} as TEndpoint["TRequestOutput"]);
      formMethods.reset(resetData);
    } catch (error) {
      logger.error("Error clearing form data from storage:", error);
    }
  }, [formMethods, storageKey, options.defaultValues, logger]);

  // Load saved form values on mount
  useEffect(() => {
    if (!persistForm || typeof window === "undefined") {
      return;
    }

    try {
      const savedFormData = localStorage.getItem(storageKey);
      if (savedFormData) {
        const parsedData = JSON.parse(
          savedFormData,
        ) as TEndpoint["TRequestOutput"];
        formMethods.reset(parsedData);
      }
    } catch (error) {
      logger.error("Error loading form data from storage:", error);
    }
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
          try {
            localStorage.setItem(storageKey, JSON.stringify(formValues));
          } catch (error) {
            logger.error("Error saving form data to storage:", error);
          }
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
    event: FormEvent<HTMLFormElement> | undefined,
    options: TEndpoint["TUrlVariablesOutput"] extends undefined
      ? undefined
      : SubmitFormFunctionOptions<
          TEndpoint["TRequestOutput"],
          TEndpoint["TResponseOutput"],
          TEndpoint["TUrlVariablesOutput"]
        >,
  ): void => {
    // Prevent default form submission behavior
    if (event) {
      event.preventDefault();
    }

    const _submitForm = async (validatedData: FormData): Promise<void> => {
      try {
        // Clear any previous errors
        clearFormError();

        // Call the API with the validated form data
        const result = await executeMutation(
          endpoint,
          logger,
          validatedData,
          (options?.urlParamVariables as TEndpoint["TUrlVariablesOutput"]) ||
            ({} as TEndpoint["TUrlVariablesOutput"]),
          t,
          locale,
          mutationOptions,
        );

        if (result === undefined) {
          logger.error("Mutation result is undefined", {
            endpoint: endpoint.path.join("/"),
          });
          return undefined;
        }

        // Ensure we have a proper ResponseType

        // Cast the result to TResponse to satisfy the type system
        const onSuccessResult = options?.onSuccess?.({
          responseData: result as TEndpoint["TResponseOutput"],
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
        logger.error("Error in submitForm", {
          endpoint: endpoint.path.join("/"),
          error,
        });

        // Handle any errors that occur during submission
        // If the error is already an ErrorResponseType, use it directly
        const errorResponse = isErrorResponseType(error)
          ? error
          : createErrorResponse(
              "error.api.store.errors.mutation_failed",
              ErrorResponseTypes.INTERNAL_ERROR,
            );

        setError(errorResponse);
        const formData = formMethods.getValues();
        options?.onError?.({
          error: errorResponse,
          requestData: formData,
          pathParams: options?.urlParamVariables,
        });
      }
    };
    // @ts-ignore - FormData type is correct, type system can't infer the equivalence with TFieldValues
    void formMethods.handleSubmit(_submitForm, (errors) => {
      // Create an error response for form validation errors
      const errorResponse = createErrorResponse(
        "error.errorTypes.validation_error",
        ErrorResponseTypes.VALIDATION_ERROR,
        { formErrors: JSON.stringify(errors) },
      );

      options?.onError?.({
        error: errorResponse,
        requestData: formMethods.getValues(),
        pathParams: options?.urlParamVariables,
      });
    })(event);
  }) as SubmitFormFunction<
    TEndpoint["TRequestOutput"],
    TEndpoint["TResponseOutput"],
    TEndpoint["TUrlVariablesOutput"]
  >;

  // Create the response object
  const response: ResponseType<TEndpoint["TResponseOutput"]> | undefined =
    mutationState.isSuccess
      ? createSuccessResponse(
          mutationState.data as TEndpoint["TResponseOutput"],
        )
      : mutationState.isError && mutationState.error
        ? mutationState.error
        : formState.formError
          ? formState.formError
          : undefined;

  return {
    // @ts-ignore - FormData is TEndpoint["TRequestOutput"], type system can't infer the equivalence
    form: formMethods,
    response,
    // Backward compatibility properties
    isSubmitSuccessful: mutationState.isSuccess,
    submitError:
      mutationState.error || formState.formError
        ? createErrorResponse(
            mutationState.error?.message ||
              formState.formError?.message ||
              "error.unknown",
            ErrorResponseTypes.INTERNAL_ERROR,
            mutationState.error?.messageParams ||
              formState.formError?.messageParams,
          )
        : undefined,

    isSubmitting: mutationState.isPending,
    submitForm,
    clearSavedForm,
    setErrorType,
  };
}
