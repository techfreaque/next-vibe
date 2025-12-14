import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { validateData } from "next-vibe/shared/utils";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { authClientRepository } from "@/app/api/[locale]/user/auth/repository-client";

import { type CreateApiEndpointAny } from "../../shared/types/endpoint";

/**
 * JSON-serializable value type for request/response data
 */
type JsonValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | File
  | Blob
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
 * Check if an object contains File instances (recursively)
 */
export function containsFile(obj: JsonValue): boolean {
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
 * Convert an object to FormData (recursively handles nested objects and arrays)
 */
export function objectToFormData(
  obj: JsonObject,
  formData: FormData = new FormData(),
  parentKey = "",
): FormData {
  for (const [key, value] of Object.entries(obj)) {
    const formKey = parentKey ? `${parentKey}.${key}` : key;

    if (value instanceof File || value instanceof Blob) {
      // Append File/Blob directly
      formData.append(formKey, value);
    } else if (Array.isArray(value)) {
      // Handle arrays
      value.forEach((item, index) => {
        const arrayKey = `${formKey}[${index}]`;
        if (item instanceof File || item instanceof Blob) {
          formData.append(arrayKey, item);
        } else if (isJsonObject(item)) {
          objectToFormData(item, formData, arrayKey);
        } else if (item !== null && item !== undefined) {
          // Primitives: string, number, boolean
          formData.append(arrayKey, String(item));
        }
      });
    } else if (isJsonObject(value)) {
      // Handle nested objects
      objectToFormData(value, formData, formKey);
    } else if (value !== null && value !== undefined) {
      // Handle primitives: string, number, boolean
      formData.append(formKey, String(value));
    }
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
): Promise<ResponseType<TEndpoint["types"]["ResponseOutput"]>> {
  try {
    // Prepare headers - don't set Content-Type for FormData (browser will set it with boundary)
    const headers: HeadersInit =
      postBody instanceof FormData
        ? {}
        : {
            "Content-Type": "application/json",
          };

    // For React Native and mobile platforms, check for stored token and add Authorization header
    // This allows React Native apps to authenticate using Bearer tokens stored in AsyncStorage
    // Web apps will continue to use httpOnly cookies automatically sent with credentials: "include"
    if (endpoint.requiresAuthentication()) {
      const storedToken = await authClientRepository.getAuthToken(logger);
      if (storedToken.success && storedToken.data) {
        headers.Authorization = `Bearer ${storedToken.data}`;
        logger.debug(
          "Added Authorization header for React Native authentication",
        );
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
        message:
          "app.api.system.unifiedInterface.react.hooks.apiUtils.errors.http_error",
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
      );

      if (!validationResponse.success) {
        // Fallback error when response validation fails
        return fail({
          message:
            "app.api.system.unifiedInterface.react.hooks.apiUtils.errors.validation_error",
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
      message:
        "app.api.system.unifiedInterface.react.hooks.apiUtils.errors.internal_error",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: {
        url: endpointUrl,
      },
    });
  } catch (error) {
    // Fallback error when request fails completely
    return fail({
      message:
        "app.api.system.unifiedInterface.react.hooks.apiUtils.errors.internal_error",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: {
        error: parseError(error).message,
        endpoint: endpoint.path.join("/"),
      },
    });
  }
}
