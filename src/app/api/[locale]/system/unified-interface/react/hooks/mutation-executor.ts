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

import type { CreateApiEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { Methods as MethodsEnum } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { EndpointErrorTypes } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";
import { envClient } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";

import { callApi, containsFile, objectToFormData } from "./api-utils";

/**
 * Options for mutation execution
 */
export interface MutationExecutorOptions<TRequest, TResponse, TUrlVariables> {
  /** Callback when mutation succeeds */
  onSuccess?: (context: {
    requestData: TRequest;
    urlPathParams: TUrlVariables;
    responseData: TResponse;
  }) => void | ErrorResponseType | Promise<void | ErrorResponseType>;

  /** Callback when mutation fails */
  onError?: (context: {
    error: ErrorResponseType;
    requestData: TRequest;
    urlPathParams: TUrlVariables;
  }) => void | Promise<void>;
}

/**
 * Pure function to execute a mutation
 * Extracted from store.ts to be used by useApiMutation with React Query
 *
 * This function:
 * - Validates request data
 * - Builds the API URL with path parameters
 * - Makes the API call
 * - Handles errors and returns proper error responses
 * - Calls onSuccess/onError callbacks with our custom shape
 *
 * Note: This does NOT handle:
 * - State management (handled by React Query)
 * - Retry logic (handled by React Query)
 * - Loading states (handled by React Query)
 */
export async function executeMutation<
  TUserRoleValue extends readonly UserRoleValue[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Infrastructure: Generic endpoint type requires 'any' for TFields parameter to accept all endpoint field configurations
  TEndpoint extends CreateApiEndpoint<string, Methods, TUserRoleValue, any>,
>({
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
  options?: MutationExecutorOptions<
    TEndpoint["types"]["RequestOutput"],
    TEndpoint["types"]["ResponseOutput"],
    TEndpoint["types"]["UrlVariablesOutput"]
  >;
}): Promise<ResponseType<TEndpoint["types"]["ResponseOutput"]>> {
  let requestData = initialRequestData;

  // Validate request data against schema
  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Infrastructure: Schema type cast requires 'unknown' for runtime type compatibility
  const requestSchema = endpoint.requestSchema as unknown as z.ZodTypeAny;
  const isUndefinedSchema =
    requestSchema.safeParse(undefined).success &&
    !requestSchema.safeParse({}).success;

  const isEmptyObjectSchema =
    requestSchema instanceof z.ZodObject &&
    Object.keys(requestSchema.shape).length === 0;

  // Handle schema conversions
  if (
    isUndefinedSchema &&
    typeof requestData === "object" &&
    requestData !== null
  ) {
    logger.debug(
      "Converting object to undefined for endpoint with undefinedSchema",
      endpoint.path.join("/"),
    );
    requestData = undefined as TEndpoint["types"]["RequestOutput"];
  }

  if (isEmptyObjectSchema && requestData === undefined) {
    logger.debug(
      "Converting undefined to empty object for endpoint with empty object schema",
      endpoint.path.join("/"),
    );
    requestData = {} as TEndpoint["types"]["RequestOutput"];
  }

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
        logger.error("executeMutation: Missing URL path parameter", {
          paramName,
          endpoint: endpoint.path.join("/"),
          availableParams: pathParams ? Object.keys(pathParams) : [],
        });

        const errorResponse = fail({
          message:
            "app.api.system.unifiedInterface.reactNative.errors.missingUrlParam",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          messageParams: { paramName, endpoint: endpoint.path.join("/") },
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

      // Add the parameter value to the URL
      endpointUrl += `/${String(paramValue)}`;
    } else {
      // Regular path segment
      endpointUrl += `/${segment}`;
    }
  }

  // Prepare request body
  let body: string | FormData | undefined;

  if (endpoint.method !== MethodsEnum.GET && requestData !== undefined) {
    if (containsFile(requestData)) {
      body = objectToFormData(requestData);
    } else {
      body = JSON.stringify(requestData);
    }
  }

  try {
    // Make API call
    const response = await callApi<TEndpoint["types"]["ResponseOutput"]>(
      endpoint,
      endpointUrl,
      body,
      logger,
    );

    // Handle success callback
    if (response.success && options.onSuccess) {
      const callbackResult = await options.onSuccess({
        requestData,
        urlPathParams: pathParams,
        responseData: response.data,
      });

      // If callback returns an error, return it
      if (callbackResult) {
        return callbackResult as ResponseType<
          TEndpoint["types"]["ResponseOutput"]
        >;
      }
    }

    return response;
  } catch (error) {
    const parsedError = parseError(error);

    // Use endpoint's SERVER_ERROR error type if available
    const serverErrorConfig =
      endpoint.errorTypes?.[EndpointErrorTypes.SERVER_ERROR];
    const errorMessage = serverErrorConfig?.description;

    const errorResponse: ErrorResponseType = fail({
      message: errorMessage,
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: {
        error: parsedError.message,
        endpoint: endpoint.path.join("/"),
      },
    });

    logger.error("Mutation failed", {
      endpoint: endpoint.path.join("/"),
      error: parsedError,
    });

    // Handle error callback
    if (options.onError) {
      await options.onError({
        error: errorResponse,
        requestData,
        urlPathParams: pathParams,
      });
    }

    return errorResponse;
  }
}
