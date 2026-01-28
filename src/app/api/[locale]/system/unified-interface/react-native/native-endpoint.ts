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

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { envClient } from "@/config/env-client";
import { type CountryLanguage } from "@/i18n/core/config";

import { type CreateApiEndpointAny } from "../shared/types/endpoint-base";

/**
 * Type helpers to extract input/output types from endpoint definitions
 */

export type InferRequestInput<T> = T extends CreateApiEndpointAny
  ? T["types"]["RequestInput"]
  : never;

export type InferRequestOutput<T> = T extends CreateApiEndpointAny
  ? T["types"]["RequestOutput"]
  : never;

export type InferResponseOutput<T> = T extends CreateApiEndpointAny
  ? T["types"]["ResponseOutput"]
  : never;

export type InferUrlVariablesInput<T> = T extends CreateApiEndpointAny
  ? T["types"]["UrlVariablesInput"]
  : never;

export type InferUrlVariablesOutput<T> = T extends CreateApiEndpointAny
  ? T["types"]["UrlVariablesOutput"]
  : never;

/**
 * Combined parameters for endpoint calls
 * Merges request data and URL parameters into a single object
 */
export type EndpointParams<TEndpoint> =
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
function constructUrl<TEndpoint extends CreateApiEndpointAny>(
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
              "app.api.system.unifiedInterface.reactNative.errors.missingUrlParam",
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
        "app.api.system.unifiedInterface.reactNative.errors.urlConstructionFailed",
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
export async function nativeEndpoint<TEndpoint extends CreateApiEndpointAny>(
  endpoint: TEndpoint,
  params: EndpointParams<TEndpoint>,
  logger: EndpointLogger,
  locale: CountryLanguage,
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
            "app.api.system.unifiedInterface.reactNative.errors.validationFailed",
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

    // Get auth token from native storage and include in request
    try {
      const { storage } = await import("next-vibe-ui/lib/storage");
      const token = await storage.getItem("@auth/token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    } catch (storageError) {
      logger.debug("Could not get auth token from storage", {
        error: parseError(storageError),
      });
      // Continue without auth token - endpoint may not require it
    }

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
      bodyPreview: responseText.slice(0, 200),
    });

    // Try to parse as JSON
    let jsonResponse: ResponseType<InferResponseOutput<TEndpoint>>;
    try {
      jsonResponse = JSON.parse(responseText);
    } catch (parseError) {
      logger.error("Failed to parse response as JSON", {
        error:
          parseError instanceof Error ? parseError.message : String(parseError),
        responseText: responseText.slice(0, 500),
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
            "app.api.system.unifiedInterface.reactNative.errors.htmlResponseReceived",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: {
            url: fetchUrl,
            status: fetchResponse.status,
            // eslint-disable-next-line i18next/no-literal-string
            hint: "Server returned HTML instead of JSON. Check that the API server is running and the endpoint exists.",
          },
        });
      }

      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Infrastructure code requires throwing for system-level errors and initialization failures
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
        "app.api.system.unifiedInterface.reactNative.errors.networkError",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: {
        error: String(error),
      },
    });
  }
}
