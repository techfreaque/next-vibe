import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";
import { z } from "zod";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  EndpointErrorTypes,
  Methods as MethodsEnum,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TranslationKey } from "@/i18n/core/static-types";

import { type CreateApiEndpointAny } from "../../shared/types/endpoint";
import { callApi, containsFile, objectToFormData } from "./api-utils";

/**
 * JSON-serializable value type for request/response data
 */
type JsonValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | JsonValue[]
  | { [key: string]: JsonValue };

interface JsonObject {
  [key: string]: JsonValue;
}

/**
 * Type guard to check if a value is a JsonObject
 */
function isJsonObject(value: JsonValue): value is JsonObject {
  return (
    value !== null &&
    value !== undefined &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    !(value instanceof File) &&
    !(value instanceof Blob)
  );
}

/**
 * Options for query execution
 */
export interface QueryExecutorOptions<TRequest, TResponse, TUrlVariables> {
  /** Callback when query succeeds */
  onSuccess?: (context: {
    requestData: TRequest;
    urlPathParams: TUrlVariables;
    responseData: TResponse;
  }) => void | ErrorResponseType | Promise<void | ErrorResponseType>;

  /** Callback when query fails */
  onError?: (context: {
    error: ErrorResponseType;
    requestData: TRequest;
    urlPathParams: TUrlVariables;
  }) => void | Promise<void>;
}

/**
 * Pure function to execute a query
 * Extracted from store.ts to be used by useApiQuery with React Query
 *
 * This function:
 * - Validates request data
 * - Builds the API URL with path parameters
 * - Makes the API call
 * - Handles errors and returns proper error responses
 * - Calls onSuccess/onError callbacks with our custom shape
 *
 * Note: This does NOT handle:
 * - Caching (handled by React Query)
 * - Deduplication (handled by React Query)
 * - Throttling (handled by React Query's staleTime)
 * - State management (handled by React Query)
 */
export async function executeQuery<TEndpoint extends CreateApiEndpointAny>({
  endpoint,
  logger,
  requestData: initialRequestData,
  pathParams,
  locale,
  options = {},
}: {
  endpoint: TEndpoint;
  logger: EndpointLogger;
  requestData: TEndpoint["types"]["RequestOutput"];
  pathParams: TEndpoint["types"]["UrlVariablesOutput"];
  locale: CountryLanguage;
  options?: QueryExecutorOptions<
    TEndpoint["types"]["RequestOutput"],
    TEndpoint["types"]["ResponseOutput"],
    TEndpoint["types"]["UrlVariablesOutput"]
  >;
}): Promise<ResponseType<TEndpoint["types"]["ResponseOutput"]>> {
  let requestData = initialRequestData;

  // Check if the endpoint expects undefined for request data
  const isUndefinedSchema =
    endpoint.requestSchema.safeParse().success &&
    !endpoint.requestSchema.safeParse({}).success;

  // Check if the endpoint expects an empty object for request data (GET endpoints with no params)
  const requestSchema = endpoint.requestSchema as z.ZodTypeAny;
  const isEmptyObjectSchema =
    requestSchema instanceof z.ZodObject &&
    Object.keys(requestSchema.shape || {}).length === 0;

  // If the schema expects undefined but we received an object, set requestData to undefined
  if (
    isUndefinedSchema &&
    typeof requestData === "object" &&
    requestData !== null
  ) {
    requestData = undefined as TEndpoint["types"]["RequestOutput"];
  }

  // If the schema expects an empty object but we received undefined, set requestData to empty object
  if (isEmptyObjectSchema && requestData === undefined) {
    requestData = {} as TEndpoint["types"]["RequestOutput"];
  }

  // Validate request data using the endpoint's schema
  // Skip validation for z.never() schemas (GET endpoints with no request data)
  const isNeverSchema = requestSchema instanceof z.ZodNever;

  if (!isNeverSchema) {
    const requestValidation = requestSchema.safeParse(requestData);

    if (!requestValidation.success) {
      logger.error("executeQuery: request validation failed", {
        endpointPath: endpoint.path.join("/"),
        error: requestValidation.error.message,
      });

      // Use endpoint's VALIDATION_FAILED error type if available
      const validationErrorConfig =
        endpoint.errorTypes?.[EndpointErrorTypes.VALIDATION_FAILED];

      const message = validationErrorConfig?.description
        ? endpoint.scopedTranslation
            .scopedT(locale)
            .t(validationErrorConfig.description)
        : ("app.api.shared.errors.validationFailed.description" satisfies TranslationKey);

      const errorResponse = fail({
        message,
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
        messageParams: {
          endpoint: endpoint.path.join("/"),
          error: requestValidation.error.message,
        },
      });

      // Call onError callback if provided
      if (options.onError) {
        options.onError({
          error: errorResponse,
          requestData,
          urlPathParams: pathParams,
        });
      }

      return errorResponse;
    }
  }

  try {
    // Build the endpoint URL with locale and replace URL path parameters
    let endpointUrl = `${envClient.NEXT_PUBLIC_APP_URL}/api/${locale}`;

    // Build path from endpoint.path array, replacing [param] placeholders
    for (const segment of endpoint.path) {
      // Check if this segment is a URL parameter (wrapped in brackets)
      if (segment.startsWith("[") && segment.endsWith("]")) {
        // Extract parameter name (e.g., "[id]" → "id")
        const paramName = segment.slice(1, -1);

        // Get value from pathParams
        const paramValue = pathParams?.[paramName as keyof typeof pathParams];

        if (paramValue === undefined) {
          logger.error("executeQuery: Missing URL path parameter", {
            paramName,
            endpoint: endpoint.path.join("/"),
            availableParams: pathParams ? Object.keys(pathParams) : [],
          });

          // Use endpoint's VALIDATION_FAILED error type if available
          const validationErrorConfig =
            endpoint.errorTypes?.[EndpointErrorTypes.VALIDATION_FAILED];

          const message = validationErrorConfig?.description
            ? endpoint.scopedTranslation
                .scopedT(locale)
                .t(validationErrorConfig.description)
            : ("app.api.shared.errors.validationFailed.description" satisfies TranslationKey);

          const errorResponse = fail({
            message,
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
            messageParams: {
              paramName,
              endpoint: endpoint.path.join("/"),
            },
          });

          // Call onError callback if provided
          if (options.onError) {
            options.onError({
              error: errorResponse,
              requestData,
              urlPathParams: pathParams,
            });
          }

          return errorResponse;
        }

        endpointUrl += `/${encodeURIComponent(String(paramValue))}`;
      } else {
        endpointUrl += `/${segment}`;
      }
    }

    // For GET requests, add query parameters to URL
    // For non-GET requests, prepare the request body
    let postBody: string | FormData | undefined;
    if (endpoint.method === MethodsEnum.GET) {
      // Add query parameters to URL for GET requests
      if (requestData && typeof requestData === "object") {
        const searchParams = new URLSearchParams();

        // Helper function to flatten nested objects into dot notation
        function flattenObject(obj: JsonObject, prefix = ""): void {
          for (const [key, value] of Object.entries(obj)) {
            const fullKey = prefix ? `${prefix}.${key}` : key;

            if (value === undefined || value === null) {
              continue;
            } else if (Array.isArray(value)) {
              // Handle arrays
              if (value.length === 0) {
                // Empty array - add placeholder
                searchParams.append(`${fullKey}._placeholder`, "");
              } else {
                value.forEach((item, index) => {
                  if (isJsonObject(item)) {
                    flattenObject(item, `${fullKey}[${index}]`);
                  } else {
                    searchParams.append(`${fullKey}[${index}]`, String(item));
                  }
                });
              }
            } else if (isJsonObject(value)) {
              // Handle nested objects
              const objEntries = Object.entries(value);
              const hasNonNullValues = objEntries.some(
                ([, v]) => v !== undefined && v !== null,
              );

              if (!hasNonNullValues) {
                // Empty object (all values are undefined/null) - add placeholder
                searchParams.append(`${fullKey}._placeholder`, "");
              } else {
                // Recursively flatten non-empty object
                flattenObject(value, fullKey);
              }
            } else {
              // Handle primitives
              searchParams.append(fullKey, String(value));
            }
          }
        }

        if (isJsonObject(requestData)) {
          flattenObject(requestData);
        }

        const queryString = searchParams.toString();
        if (queryString) {
          endpointUrl += `?${queryString}`;
        }
      }
    } else {
      // Prepare the request body for non-GET requests
      // Check if requestData contains File objects - if so, use FormData
      if (containsFile(requestData)) {
        // Convert to FormData
        if (isJsonObject(requestData)) {
          postBody = objectToFormData(requestData);
        }
      } else {
        // Use JSON
        postBody = JSON.stringify(requestData);
      }
    }

    const response = await callApi(endpoint, endpointUrl, postBody, logger);

    if (!response.success) {
      // Call onError callback if provided
      if (options.onError) {
        options.onError({
          error: response,
          requestData,
          urlPathParams: pathParams,
        });
      }

      return response;
    }

    // Call onSuccess callback if provided
    if (options.onSuccess) {
      const onSuccessResult = await options.onSuccess({
        requestData,
        urlPathParams: pathParams,
        responseData: (response.success
          ? response.data
          : undefined) as TEndpoint["types"]["ResponseOutput"],
      });

      // If onSuccess returns an error, treat it as an error
      if (onSuccessResult) {
        // Call onError callback if provided
        if (options.onError) {
          options.onError({
            error: onSuccessResult,
            requestData,
            urlPathParams: pathParams,
          });
        }

        return onSuccessResult;
      }
    }

    return response as ResponseType<TEndpoint["types"]["ResponseOutput"]>;
  } catch (err) {
    const parsedError = parseError(err);

    // Use endpoint's SERVER_ERROR or NETWORK_ERROR error type if available
    const serverErrorConfig =
      endpoint.errorTypes?.[EndpointErrorTypes.SERVER_ERROR];
    const networkErrorConfig =
      endpoint.errorTypes?.[EndpointErrorTypes.NETWORK_ERROR];

    // Prefer NETWORK_ERROR for network-related issues, otherwise SERVER_ERROR
    const isNetworkError =
      parsedError.message.toLowerCase().includes("network") ||
      parsedError.message.toLowerCase().includes("fetch");
    const errorConfig = isNetworkError ? networkErrorConfig : serverErrorConfig;

    const message = errorConfig?.description
      ? endpoint.scopedTranslation.scopedT(locale).t(errorConfig.description)
      : ("app.api.shared.errors.serverError.description" satisfies TranslationKey);

    const errorResponse = fail({
      message,
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: {
        error: parsedError.message,
        endpoint: endpoint.path.join("/"),
      },
    });

    // Call onError callback if provided
    if (options.onError) {
      options.onError({
        error: errorResponse,
        requestData,
        urlPathParams: pathParams,
      });
    }

    return errorResponse;
  }
}
