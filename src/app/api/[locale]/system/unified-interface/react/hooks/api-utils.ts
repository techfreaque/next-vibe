import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { validateData } from "next-vibe/shared/utils";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { Platform } from "../../shared/types/platform";

import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { scopedTranslation as authScopedTranslation } from "@/app/api/[locale]/user/auth/i18n";
import { authClientRepository } from "@/app/api/[locale]/user/auth/repository-client";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import {
  BEARER_LEAD_ID_SEPARATOR,
  CSRF_TOKEN_COOKIE_NAME,
  CSRF_TOKEN_HEADER_NAME,
} from "@/config/constants";
import { platform } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";

import { type CreateApiEndpointAny } from "../../shared/types/endpoint-base";
import { scopedTranslation as hooksTranslation } from "./i18n";

/**
 * Read the CSRF double-submit cookie and return its value, or null if absent.
 * The cookie is non-HttpOnly so JS can read it for the double-submit pattern.
 */
function getCsrfToken(): string | null {
  if (typeof document === "undefined") {
    return null; // SSR / non-browser environments
  }
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${CSRF_TOKEN_COOKIE_NAME}=`));
  return match ? (match.split("=")[1] ?? null) : null;
}

const MUTATING_METHODS = new Set([
  Methods.POST,
  Methods.PUT,
  Methods.DELETE,
  Methods.PATCH,
]);

/**
 * Type guard to check if a value is a Record<string, WidgetData>
 */
function isJsonObject(value: WidgetData): value is Record<string, WidgetData> {
  return (
    value !== null &&
    value !== undefined &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    !(value instanceof File) &&
    !(value instanceof Blob) &&
    !(value instanceof Date)
  );
}

/**
 * Check if an object contains File instances (recursively)
 */
export function containsFile(obj: WidgetData): boolean {
  if (obj instanceof File) {
    return true;
  }
  if (obj instanceof Blob) {
    return true;
  }
  if (Array.isArray(obj)) {
    return obj.some((item) => containsFile(item));
  }
  if (obj && typeof obj === "object") {
    return Object.values(obj).some((value) => containsFile(value));
  }
  return false;
}

/**
 * Extract File/Blob entries from an object as flat dot-notation key→file pairs.
 * Used to separate files from JSON-serializable data when building mixed FormData.
 */
function extractFiles(
  obj: WidgetData,
  parentKey = "",
  result: Array<[string, File | Blob]> = [],
): Array<[string, File | Blob]> {
  if (obj instanceof File || obj instanceof Blob) {
    result.push([parentKey, obj]);
  } else if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      extractFiles(item, `${parentKey}[${index}]`, result);
    });
  } else if (isJsonObject(obj)) {
    for (const [key, value] of Object.entries(obj)) {
      extractFiles(value, parentKey ? `${parentKey}.${key}` : key, result);
    }
  }
  return result;
}

/**
 * Strip File/Blob instances from an object, replacing them with null.
 * The result is safe to JSON.stringify.
 */
function stripFiles(obj: WidgetData): WidgetData {
  if (obj instanceof File || obj instanceof Blob) {
    return null;
  }
  if (Array.isArray(obj)) {
    return obj.map(stripFiles);
  }
  if (isJsonObject(obj)) {
    const result: Record<string, WidgetData> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = stripFiles(value);
    }
    return result;
  }
  return obj;
}

/**
 * Convert an object containing File/Blob values to FormData using the mixed pattern:
 * - Non-file data is JSON-serialized into a "data" field (preserves types like booleans)
 * - File/Blob values are appended as separate dot-notation fields
 *
 * The server-side request-parser already handles this pattern (checks for "data" field first).
 */
export function objectToFormData(obj: Record<string, WidgetData>): FormData {
  const formData = new FormData();

  // Serialize all non-file data as JSON in "data" field - preserves booleans, numbers, nulls
  const jsonData = stripFiles(obj);
  formData.append("data", JSON.stringify(jsonData));

  // Append File/Blob values separately with dot-notation keys
  const files = extractFiles(obj);
  for (const [key, file] of files) {
    formData.append(key, file);
  }

  return formData;
}

/**
 * Core function to call an API endpoint
 * Handles request validation, authentication, and response parsing
 */
export async function callApi<TEndpoint extends CreateApiEndpointAny>(
  endpoint: TEndpoint,
  endpointUrl: string,
  postBody: string | FormData | undefined,
  logger: EndpointLogger,
  user: JwtPayloadType,
  locale: CountryLanguage,
  requestData: TEndpoint["types"]["RequestOutput"],
  pathParams: TEndpoint["types"]["UrlVariablesOutput"],
): Promise<ResponseType<TEndpoint["types"]["ResponseOutput"]>> {
  logger.debug("callApi", {
    endpoint: endpoint.path.join("/"),
    method: endpoint.method,
    pathParams,
  });
  // Determine if we should use client route (route-client.ts)
  let shouldUseClientRoute = false;

  // 1. Check useClientRoute callback (data-driven decision, e.g. incognito)
  // The callback is typed with InferRequestOutput<TFields> which becomes `never`
  // due to covariant TFields + contravariant function params. We extract it as a
  // wider function type since the concrete endpoint always accepts its own data.
  if (endpoint.useClientRoute) {
    const clientRouteCheck = endpoint.useClientRoute as (props: {
      data: TEndpoint["types"]["RequestOutput"];
      urlPathParams: TEndpoint["types"]["UrlVariablesOutput"];
      locale: CountryLanguage;
      logger: EndpointLogger;
    }) => boolean | Promise<boolean>;
    shouldUseClientRoute = await clientRouteCheck({
      data: requestData,
      urlPathParams: pathParams,
      locale,
      logger,
    });
  }

  // 2. Check allowedClientRoles (role-based decision, e.g. public users)
  if (!shouldUseClientRoute && endpoint.allowedClientRoles) {
    const { filterUserPermissionRoles, UserPermissionRole } =
      await import("@/app/api/[locale]/user/user-roles/enum");
    const clientPermissionRoles = filterUserPermissionRoles(
      endpoint.allowedClientRoles,
    );

    if (
      user.isPublic &&
      clientPermissionRoles.includes(UserPermissionRole.PUBLIC)
    ) {
      shouldUseClientRoute = true;
    } else if (
      user.roles?.some((role) => clientPermissionRoles.includes(role))
    ) {
      shouldUseClientRoute = true;
    }
  }

  // Route to client handler if either check passed
  if (shouldUseClientRoute) {
    const { endpointToToolName } =
      await import("@/app/api/[locale]/system/unified-interface/shared/utils/path");
    const { getClientRouteHandler } =
      await import("@/app/api/[locale]/system/generated/route-handlers-client");

    const pathKey = endpointToToolName(endpoint);

    const handlerObject = await getClientRouteHandler(pathKey);
    if (handlerObject?.handler) {
      return handlerObject.handler({
        data: requestData,
        urlPathParams: pathParams,
        locale,
        logger,
        user,
      });
    }

    logger.warn(
      "Client handler not found, falling back to server API",
      pathKey,
    );
  }

  try {
    // Prepare headers - don't set Content-Type for FormData (browser will set it with boundary)
    const headers: Record<string, string> =
      postBody instanceof FormData
        ? {}
        : {
            "Content-Type": "application/json",
          };

    // Attach CSRF double-submit token for mutating browser requests.
    // The server validates that X-CSRF-Token === csrf_token cookie.
    // Non-browser callers (CLI, MCP, server-to-server) won't have the cookie
    // so the header is simply absent - the server allows that case.
    if (MUTATING_METHODS.has(endpoint.method)) {
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        headers[CSRF_TOKEN_HEADER_NAME] = csrfToken;
      }
    }

    // For React Native and mobile platforms, check for stored token and add Authorization header.
    // Format: "Bearer <jwtToken>####<leadId>" - embeds both values so the server can identify
    // the caller without relying on cookies (which don't work cross-origin).
    // Web apps on the same origin continue to use httpOnly cookies via credentials: "include".
    if (platform.isReactNative) {
      const { t: authT } = authScopedTranslation.scopedT(locale);
      const storedToken = await authClientRepository.getAuthToken(
        logger,
        authT,
      );
      const leadId = user?.leadId;
      if (storedToken.success && storedToken.data && leadId) {
        // Authenticated: embed JWT + leadId suffix
        headers.Authorization = `Bearer ${storedToken.data}${BEARER_LEAD_ID_SEPARATOR}${leadId}`;
        logger.debug(
          "Added Authorization header for React Native authentication",
        );
      } else if (leadId) {
        // Public user: no JWT, leadId-only suffix
        headers.Authorization = `Bearer ${BEARER_LEAD_ID_SEPARATOR}${leadId}`;
        logger.debug("Added public leadId-only Authorization header");
      }
    }

    // Prepare request options
    const options: RequestInit = {
      method: endpoint.method,
      headers,
      credentials: "include", // Include cookies for session-based auth
    };

    // Add request body for non-GET requests
    if (endpoint.method !== Methods.GET && postBody) {
      options.body = postBody;
    }

    // Make the API call
    const response = await fetch(endpointUrl, options);
    const json = (await response.json()) as ResponseType<
      TEndpoint["types"]["ResponseOutput"]
    >;

    // Handle API response
    if (!response.ok) {
      // If the server returned a properly formatted error response, use it directly
      if (!json.success && json.message) {
        return json;
      }

      // Fallback error when server doesn't return proper error format
      return fail({
        message: hooksTranslation
          .scopedT(locale)
          .t("apiUtils.errors.http_error"),
        errorType: ErrorResponseTypes.HTTP_ERROR,
        messageParams: {
          statusCode: response.status,
          url: endpointUrl,
        },
      });
    }

    // Validate successful response against schema
    if (json.success) {
      const validationResponse = validateData(
        json.data,
        endpoint.responseSchema,
        logger,
        locale,
        Platform.NEXT_API,
        `${endpoint.path.join("/")}/${endpoint.method}`,
      );

      if (!validationResponse.success) {
        // Fallback error when response validation fails
        return fail({
          message: hooksTranslation
            .scopedT(locale)
            .t("apiUtils.errors.validation_error"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
          messageParams: {
            message: validationResponse.message,
          },
        });
      }

      return {
        success: true,
        data: validationResponse.data,
      };
    }

    // If we have a properly formatted error response, return it directly
    if (!json.success && "errorType" in json) {
      return json;
    }

    // Fallback error when server returns success but no data
    return fail({
      message: hooksTranslation
        .scopedT(locale)
        .t("apiUtils.errors.internal_error"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: {
        url: endpointUrl,
      },
    });
  } catch (error) {
    // Fallback error when request fails completely
    return fail({
      message: hooksTranslation
        .scopedT(locale)
        .t("apiUtils.errors.internal_error"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: {
        error: parseError(error).message,
        endpoint: endpoint.path.join("/"),
      },
    });
  }
}
