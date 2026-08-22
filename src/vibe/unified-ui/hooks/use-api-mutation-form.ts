"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { storage } from "next-vibe/ui/lib/storage";
import { useCallback, useEffect, useMemo } from "react";
import { useForm, type UseFormProps } from "react-hook-form";

import type { CreateApiEndpointAny } from "../../core/definition/endpoint-base";
import type { CountryLanguage } from "../../core/i18n/core/config";
import type {
  ErrorResponseType,
  ResponseType,
} from "../../core/route/response.schema";
import { ErrorResponseTypes, fail } from "../../core/route/response.schema";
import type { WidgetData } from "../../core/utils/json";
import { isErrorResponseType, parseError } from "../../core/utils/parse-error";
import type { JwtPayloadType } from "../../identity/auth/types";
import type { EndpointLogger } from "../../logger/types";
import { extractSchemaDefaults } from "../_shared/utils";
import { containsFile } from "./api-utils-shared";
import { scopedTranslation as hooksTranslation } from "./i18n";
import { buildKey, type CacheKeyRequestData } from "./query-key-builder";
import { splitFormValues } from "./split-form-values";
import { useApiStore } from "./store";
import type {
  ApiFormOptions,
  ApiFormReturn,
  ApiMutationOptions,
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
type ApiFormKeyOptions<TEndpoint extends CreateApiEndpointAny> =
  (TEndpoint["types"]["UrlVariablesOutput"] extends never
    ? { urlPathParams?: never }
    : { urlPathParams: TEndpoint["types"]["UrlVariablesOutput"] }) &
    (CacheKeyRequestData<TEndpoint> extends undefined
      ? { requestData?: never }
      : { requestData: CacheKeyRequestData<TEndpoint> });

export function useApiForm<TEndpoint extends CreateApiEndpointAny>(
  endpoint: TEndpoint,
  logger: EndpointLogger,
  user: JwtPayloadType,
  locale: CountryLanguage,
  options?: ApiFormOptions<
    TEndpoint["types"]["RequestOutput"],
    TEndpoint["types"]["FormValues"]
  >,
  mutationOptions?: ApiMutationOptions<
    TEndpoint["types"]["RequestOutput"],
    TEndpoint["types"]["ResponseOutput"],
    TEndpoint["types"]["UrlVariablesOutput"]
  >,
  keyOptions?: ApiFormKeyOptions<TEndpoint>,
): ApiFormReturn<
  TEndpoint["types"]["RequestOutput"],
  TEndpoint["types"]["ResponseOutput"],
  TEndpoint["types"]["UrlVariablesOutput"],
  TEndpoint["types"]["FormValues"]
> {
  const { getFormId } = useApiStore();
  const formId = getFormId(endpoint);

  const resolvedOptions: ApiFormOptions<
    TEndpoint["types"]["RequestOutput"],
    TEndpoint["types"]["FormValues"]
  > = options ?? {};
  const resolvedMutationOptions: ApiMutationOptions<
    TEndpoint["types"]["RequestOutput"],
    TEndpoint["types"]["ResponseOutput"],
    TEndpoint["types"]["UrlVariablesOutput"]
  > = mutationOptions ?? {};

  // Use React Query-based mutation hook
  const mutation = useApiMutation(
    endpoint,
    logger,
    user,
    resolvedMutationOptions,
  );

  // Get form state from Zustand (forms state remains in Zustand)
  const formState = useApiStore((state) => state.forms[formId]) ?? {
    formError: null,
    isSubmitting: false,
  };

  // Extract store methods for error handling
  const setFormErrorStore = useApiStore((state) => state.setFormError);
  const clearFormErrorStore = useApiStore((state) => state.clearFormError);

  // Create base configuration with resolver

  // Auto-generate default values from schema if not provided
  // This ensures form fields start with empty strings instead of undefined
  const schemaDefaultValues = useMemo(() => {
    const extracted = extractSchemaDefaults<TEndpoint["types"]["FormValues"]>(
      endpoint.formSchema,
      logger,
      "",
      true, // forFormInit: return empty values for primitives
    );
    const baseDefaults = extracted ?? {};

    // Pass through Zod's parse to validate and apply transformations
    const parsed = endpoint.formSchema.safeParse(baseDefaults);
    if (parsed.success) {
      return parsed.data;
    }

    // If validation fails, return the extracted defaults as-is
    return baseDefaults;
  }, [endpoint.formSchema, logger]);

  // Merge schema defaults with provided defaultValues (provided values take priority)
  const mergedDefaultValues: TEndpoint["types"]["FormValues"] = useMemo(() => {
    const provided = resolvedOptions.defaultValues;
    if (provided && Object.keys(provided).length > 0) {
      // Only keys with an actual value override a schema default. Object.assign
      // copies `undefined` entries too, so a caller passing a key it has no
      // value for — the CLI builds one entry per known field — silently wiped
      // out `.default(1)` and the form started empty.
      const defined: Record<string, WidgetData> = {};
      for (const [key, value] of Object.entries(provided)) {
        if (value !== undefined) {
          defined[key] = value;
        }
      }
      // Request outputs are always Zod object outputs; merge as records
      // (Object.assign avoids the "spread on non-object generic" error while
      // preserving the precise RequestOutput type).
      return Object.assign({}, schemaDefaultValues, defined);
    }
    return schemaDefaultValues;
  }, [schemaDefaultValues, resolvedOptions.defaultValues]);

  // Extract persistence and custom options
  const {
    persistForm = true,
    persistenceKey,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    defaultValues: _ignoredDefaultValues,
    ...restFormOptions
  } = resolvedOptions;

  // Build form config with all options
  // Type annotation matches UseFormProps to ensure compatibility with react-hook-form
  const formConfig: UseFormProps<TEndpoint["types"]["FormValues"]> = {
    resolver: zodResolver(endpoint.formSchema),
    mode: "onSubmit" as const,
    reValidateMode: "onChange" as const,
    ...restFormOptions,
    defaultValues: mergedDefaultValues,
  };

  // Generate a storage key based on the endpoint if not provided
  const storageKey =
    persistenceKey ||
    buildKey(
      "query-form",
      endpoint,
      keyOptions?.urlPathParams,
      logger,
      keyOptions?.requestData as CacheKeyRequestData<TEndpoint>,
    );

  const formMethods = useForm<TEndpoint["types"]["FormValues"]>(formConfig);

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
          ) as TEndpoint["types"]["FormValues"];

          // Validate persisted data against the schema before restoring.
          // File/Blob objects serialize to {} in JSON; restoring them would
          // corrupt the form state and break subsequent submissions.
          const validation = endpoint.formSchema.safeParse(parsedData);
          if (!validation.success) {
            logger.debug("Discarding invalid persisted form data", {
              storageKey,
              error: validation.error.issues
                .map((i) => `${i.path.join(".")}: ${i.message}`)
                .join("; "),
            });
            await storage.removeItem(storageKey);
            return;
          }

          formMethods.reset(parsedData);
        }
      } catch (error) {
        logger.error(
          "Error loading form data from storage:",
          parseError(error),
        );
      }
    })();
  }, [formMethods, storageKey, persistForm, endpoint.formSchema, logger]);

  // Save form values when they change
  useEffect(() => {
    if (!persistForm || typeof window === "undefined") {
      return;
    }

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const debounceMs = 500; // 500ms debounce

    const subscription = formMethods.watch((formValues) => {
      if (Object.keys(formValues).length > 0) {
        // Skip persistence entirely when form contains File/Blob values.
        // File objects serialize to {} via JSON.stringify, and on remount
        // the corrupted {} gets loaded back, breaking subsequent submissions.
        if (containsFile(formValues)) {
          return;
        }

        // Clear any existing timer
        if (debounceTimer !== null) {
          clearTimeout(debounceTimer);
        }

        // Set a new timer
        debounceTimer = setTimeout(() => {
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
        clearTimeout(debounceTimer);
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
  const submitForm = useCallback(
    (
      submitOptions?: SubmitFormFunctionOptions<
        TEndpoint["types"]["RequestOutput"],
        TEndpoint["types"]["ResponseOutput"],
        TEndpoint["types"]["UrlVariablesOutput"]
      >,
    ): void => {
      const _submitForm = async (
        validatedValues: TEndpoint["types"]["FormValues"],
      ): Promise<void> => {
        // Split the flat form values (request-data ∪ url-path-params) into the
        // two buckets the API call expects. An explicit urlParamVariables
        // override (e.g. from a parent route) takes priority over the split.
        const split = splitFormValues(endpoint, validatedValues);
        const validatedData = split.data;
        const urlPathParams =
          submitOptions?.urlParamVariables ?? split.urlPathParams;

        logger.debug("Submitting form", {
          endpoint: endpoint.path.join("/"),
          keys: Object.keys(validatedData ?? {}),
        });
        try {
          // Clear any previous errors
          clearFormError();

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

          const onSuccessResult = submitOptions?.onSuccess?.({
            responseData: responseData as TEndpoint["types"]["ResponseOutput"],
            pathParams: urlPathParams,
            requestData: validatedData,
          });

          // If onSuccess returns an error, treat it as an error
          if (onSuccessResult) {
            setError(onSuccessResult);
            submitOptions?.onError?.({
              error: onSuccessResult,
              requestData: validatedData,
              pathParams: urlPathParams,
            });
          }
        } catch (error) {
          const formSnapshot = formMethods.getValues();
          // No manual "[client] " prefix - the client-log receiver
          // (error-monitor/client-log/repository.ts) already prepends it to
          // every forwarded client log; adding it here doubled up as
          // "[client] [client] Error in submitForm".
          const logMeta = {
            endpoint: endpoint.path.join("/"),
            fieldKeys: Object.keys(formSnapshot).join(", "),
            hasFiles: containsFile(formSnapshot),
          };

          // Handle any errors that occur during submission
          // If the error is already an ErrorResponseType, use it directly
          let errorResponse: ErrorResponseType;
          if (isErrorResponseType(error)) {
            // Known API error responses (permission denied, not found, etc.) are
            // expected, user-facing outcomes — log at warn, not error.
            logger.warn("Error in submitForm", parseError(error), logMeta);
            errorResponse = error;
          } else {
            // Unexpected throw (network failure, code bug) — real error.
            logger.error("Error in submitForm", parseError(error), logMeta);
            errorResponse = fail({
              message: hooksTranslation
                .scopedT(locale)
                .t("mutationForm.post.errors.mutation_failed.title"),
              errorType: ErrorResponseTypes.INTERNAL_ERROR,
            });
          }

          setError(errorResponse);
          submitOptions?.onError?.({
            error: errorResponse,
            requestData: validatedData,
            pathParams: urlPathParams,
          });
        }
      };
      void formMethods.handleSubmit(_submitForm, (errors) => {
        logger.error("Form validation errors", {
          endpoint: [...endpoint.path].join("/"),
          errors: JSON.stringify(errors),
        });

        // The `.title` key renders generically elsewhere, so the field errors
        // go in a sibling that can carry them.
        const errorResponse = fail({
          message: hooksTranslation
            .scopedT(locale)
            .t("mutationForm.post.errors.validation_error.detail", {
              errors: JSON.stringify(errors),
            }),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });

        // Set the error in the form state so it's displayed
        setError(errorResponse);

        const failSplit = splitFormValues(endpoint, formMethods.getValues());
        submitOptions?.onError?.({
          error: errorResponse,
          requestData: failSplit.data,
          pathParams:
            submitOptions?.urlParamVariables ?? failSplit.urlPathParams,
        });
      })();
    },
    [clearFormError, endpoint, formMethods, locale, logger, mutation, setError],
  );

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

  return useMemo(
    () => ({
      form: formMethods,
      response,
      // Backward compatibility properties
      isSubmitSuccessful: mutation.isSuccess,
      submitError,
      isSubmitting: mutation.isPending,
      submitForm,
      clearSavedForm,
      setErrorType,
    }),
    [
      response,
      mutation.isSuccess,
      submitError,
      mutation.isPending,
      formMethods,
      submitForm,
      clearSavedForm,
      setErrorType,
    ],
  );
}
