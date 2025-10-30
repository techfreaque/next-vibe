/**
 * Native Endpoint Utility
 * Typesafe polyfill for calling API endpoints from React Native
 *
 * This utility enables the same repository code to work on both web and native:
 * - Web: Direct database access via server repository
 * - Native: HTTP calls via this utility using endpoint definitions
 *
 * Key Features:
 * - Full type safety: request/response types inferred from endpoint definitions
 * - Automatic URL construction from endpoint metadata
 * - Built-in request validation using endpoint schemas
 * - Consistent ResponseType<T> return format
 * - Single source of truth (definition.ts files)
 * - Clean architecture: Uses env-client.native.ts for configuration
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { CreateApiEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import type { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import { envClient } from "@/config/env-client";

/**
 * Type helpers to extract input/output types from endpoint definitions
 */

type InferRequestInput<T> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends CreateApiEndpoint<any, any, any, any>
    ? T["types"]["RequestInput"]
    : never;

type InferRequestOutput<T> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends CreateApiEndpoint<any, any, any, any>
    ? T["types"]["RequestOutput"]
    : never;

type InferResponseOutput<T> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends CreateApiEndpoint<any, any, any, any>
    ? T["types"]["ResponseOutput"]
    : never;

type InferUrlVariablesInput<T> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends CreateApiEndpoint<any, any, any, any>
    ? T["types"]["UrlVariablesInput"]
    : never;

type InferUrlVariablesOutput<T> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends CreateApiEndpoint<any, any, any, any>
    ? T["types"]["UrlVariablesOutput"]
    : never;

/**
 * Combined parameters for endpoint calls
 * Merges request data and URL parameters into a single object
 */
type EndpointParams<TEndpoint> =
  (InferRequestOutput<TEndpoint> extends undefined
    ? // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      {}
    : { data: InferRequestOutput<TEndpoint> }) &
    (InferUrlVariablesOutput<TEndpoint> extends undefined
      ? // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        {}
      : { urlPathParams: InferUrlVariablesOutput<TEndpoint> });

/**
 * Construct URL path from endpoint definition and parameters
 * Uses envClientNative.API_BASE_URL for clean configuration
 */
function constructUrl<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TEndpoint extends CreateApiEndpoint<any, Methods, any, any>,
>(
  endpoint: TEndpoint,
  params: EndpointParams<TEndpoint>,
  locale: string,
): ResponseType<string> {
  try {
    // Use clean config from env-client.native
    const baseUrl = envClient.NEXT_PUBLIC_APP_URL;

    // Build path from endpoint.path array
    let urlPath = `${baseUrl}/api/${locale}`;

    for (const segment of endpoint.path) {
      // Check if this segment is a URL parameter (wrapped in brackets)
      if (segment.startsWith("[") && segment.endsWith("]")) {
        // Extract parameter name (e.g., "[id]" → "id")
        const paramName = segment.slice(1, -1);

        // Get value from urlPathParams
        const urlPathParams =
          "urlPathParams" in params ? params.urlPathParams : {};
        const paramValue =
          urlPathParams[paramName as keyof typeof urlPathParams];

        if (paramValue === undefined) {
          return fail({
            message:
              "app.api.v1.core.system.unifiedInterface.reactNative.errors.missingUrlParam",
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
            messageParams: { paramName, endpoint: endpoint.title },
          });
        }

        urlPath += `/${encodeURIComponent(String(paramValue))}`;
      } else {
        urlPath += `/${segment}`;
      }
    }

    return { success: true, data: urlPath };
  } catch (error) {
    return fail({
      message:
        "app.api.v1.core.system.unifiedInterface.reactNative.errors.urlConstructionFailed",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: {
        error: String(error),
      },
    });
  }
}

/**
 * Typesafe native endpoint caller
 *
 * @param endpoint - Endpoint definition from definition.ts file
 * @param params - Request data and/or URL parameters (fully typed from endpoint)
 * @param logger - Endpoint logger for tracking operations
 * @returns Promise<ResponseType<T>> where T is inferred from endpoint's response schema
 *
 * @example
 * ```typescript
 * import { nativeEndpoint } from './native-endpoint';
 * import { getUserByIdEndpoint } from './types';
 *
 * // TypeScript automatically infers:
 * // - params must be: { urlPathParams: { id: string } }
 * // - return type is: ResponseType<UserType>
 * const user = await nativeEndpoint(
 *   getUserByIdEndpoint.GET,
 *   { urlPathParams: { id: '123' } });
 *   logger
 * );
 * ```
 */
export async function nativeEndpoint<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TEndpoint extends CreateApiEndpoint<any, Methods, any, any>,
>(
  endpoint: TEndpoint,
  params: EndpointParams<TEndpoint>,
  logger: EndpointLogger,
  locale = "en",
): Promise<ResponseType<InferResponseOutput<TEndpoint>>> {
  try {
    // Construct URL from endpoint metadata and parameters
    const urlResult = constructUrl(endpoint, params, locale);
    if (!urlResult.success) {
      return urlResult;
    }
    const url = urlResult.data;

    // Extract request data if present
    const requestData = "data" in params ? params.data : undefined;

    // Validate request data against endpoint schema (if present)
    if (requestData && endpoint.requestSchema) {
      try {
        endpoint.requestSchema.parse(requestData);
      } catch (validationError) {
        logger.error("Request validation failed", parseError(validationError));
        return fail({
          message:
            "app.api.v1.core.system.unifiedInterface.reactNative.errors.validationFailed",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          messageParams: {
            error: String(validationError),
          },
        });
      }
    }

    // Make HTTP call based on method
    let response: ResponseType<InferResponseOutput<TEndpoint>>;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    let fetchUrl = url;
    let fetchOptions: RequestInit = {
      method: endpoint.method,
      headers,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (endpoint.method === "GET" || endpoint.method === "DELETE") {
      // For GET/DELETE requests, send data as query parameters
      if (requestData) {
        const searchParams = new URLSearchParams();
        for (const [key, value] of Object.entries(requestData)) {
          searchParams.append(key, String(value));
        }
        // eslint-disable-next-line i18next/no-literal-string
        fetchUrl = `${url}?${searchParams.toString()}`;
      }
    } else {
      // For POST/PUT/PATCH, send data in body
      if (requestData) {
        fetchOptions.body = JSON.stringify(requestData);
      }
    }

    logger.debug("Native endpoint request", {
      url: fetchUrl,
      method: endpoint.method,
      hasBody: !!fetchOptions.body,
    });

    const fetchResponse = await fetch(fetchUrl, fetchOptions);

    // Check if response is OK
    if (!fetchResponse.ok) {
      logger.error("HTTP error response", {
        status: fetchResponse.status,
        statusText: fetchResponse.statusText,
        url: fetchUrl,
      });
    }

    // Get response text first to check if it's valid JSON
    const responseText = await fetchResponse.text();

    logger.debug("Native endpoint response received", {
      status: fetchResponse.status,
      contentType: fetchResponse.headers.get("content-type"),
      bodyLength: responseText.length,
      bodyPreview: responseText.substring(0, 200),
    });

    // Try to parse as JSON
    let jsonResponse: ResponseType<InferResponseOutput<TEndpoint>>;
    try {
      jsonResponse = JSON.parse(responseText);
    } catch (parseError) {
      logger.error("Failed to parse response as JSON", {
        error:
          parseError instanceof Error ? parseError.message : String(parseError),
        responseText: responseText.substring(0, 500),
        contentType: fetchResponse.headers.get("content-type"),
      });

      // Check if it's HTML (likely an error page)
      if (
        // eslint-disable-next-line i18next/no-literal-string
        responseText.includes("<!DOCTYPE") ||
        // eslint-disable-next-line i18next/no-literal-string
        responseText.includes("<html")
      ) {
        return fail({
          message:
            "app.api.v1.core.system.unifiedInterface.reactNative.errors.htmlResponseReceived",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: {
            url: fetchUrl,
            status: fetchResponse.status,
            // eslint-disable-next-line i18next/no-literal-string
            hint: "Server returned HTML instead of JSON. Check that the API server is running and the endpoint exists.",
          },
        });
      }

      // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Infrastructure code requires throwing for system-level errors and initialization failures
      throw parseError;
    }

    response = jsonResponse;

    // Validate response against endpoint schema (if present and successful)
    if (response.success && endpoint.responseSchema) {
      try {
        endpoint.responseSchema.parse(response.data);
      } catch (validationError) {
        logger.warn("Response validation failed", parseError(validationError));
        // Log but don't fail - server might have added new fields
      }
    }

    return response;
  } catch (error) {
    logger.error("Native endpoint call failed", parseError(error));
    return fail({
      message:
        "app.api.v1.core.system.unifiedInterface.reactNative.errors.networkError",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: {
        error: String(error),
      },
    });
  }
}

/**
 * Type-only exports for external use
 */
export type {
  EndpointParams,
  InferRequestInput,
  InferRequestOutput,
  InferResponseOutput,
  InferUrlVariablesInput,
  InferUrlVariablesOutput,
};
