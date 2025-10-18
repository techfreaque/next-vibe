import {
  createErrorResponse,
  ErrorResponseTypes,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { validateData } from "next-vibe/shared/utils";
import { parseError } from "next-vibe/shared/utils/parse-error";
import type z from "zod";

import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import type { TranslationKey } from "@/i18n/core/static-types";

import { authClientRepository } from "../../../../user/auth/repository-client";
import type { EndpointLogger } from "../../cli/vibe/endpoints/endpoint-handler/logger";

// Type for values that can be in FormData
type FormDataValue =
  | string
  | number
  | boolean
  | File
  | Blob
  | null
  | undefined
  | FormDataValue[]
  | { [key: string]: FormDataValue };

/**
 * Check if an object contains File instances (recursively)
 */
export function containsFile(obj: FormDataValue): boolean {
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
  obj: Record<string, FormDataValue>,
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
        } else if (item && typeof item === "object") {
          objectToFormData(
            item as Record<string, FormDataValue>,
            formData,
            arrayKey,
          );
        } else if (item !== null && item !== undefined) {
          // Primitives: string, number, boolean
          formData.append(arrayKey, String(item));
        }
      });
    } else if (value && typeof value === "object") {
      // Handle nested objects
      objectToFormData(
        value as Record<string, FormDataValue>,
        formData,
        formKey,
      );
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
export async function callApi<
  TResponseInput,
  TResponseOutput,
  TEndpoint extends {
    readonly TResponseOutput: TResponseOutput;
    readonly requestSchema: z.ZodTypeAny;
    readonly responseSchema: z.ZodTypeAny;
    readonly method: Methods;
    readonly path: readonly string[];
    readonly requiresAuthentication: () => boolean;
  },
>(
  endpoint: TEndpoint,
  endpointUrl: string,
  postBody: string | FormData | undefined,
  logger: EndpointLogger,
): Promise<ResponseType<TResponseOutput>> {
  try {
    // Prepare headers - don't set Content-Type for FormData (browser will set it with boundary)
    const headers: HeadersInit =
      postBody instanceof FormData
        ? {}
        : {
            "Content-Type": "application/json",
          };

    // Check authentication status if required
    if (endpoint.requiresAuthentication()) {
      const tokenResponse = authClientRepository.hasAuthStatus(logger);
      if (!tokenResponse.success || !tokenResponse.data) {
        // Return error - server should provide proper translation key
        return createErrorResponse(
          "app.user.auth.errors.auth_required" as TranslationKey,
          ErrorResponseTypes.UNAUTHORIZED,
        );
      }

      // Note: We don't set Authorization header here because the JWT token
      // is stored in an httpOnly cookie for security. The cookie will be
      // sent automatically with credentials: "include"
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
    const json = (await response.json()) as ResponseType<TResponseInput>;

    // Handle API response
    if (!response.ok) {
      // If the server returned a properly formatted error response, use it directly
      if (!json.success && json.message) {
        return json;
      }

      // Fallback error when server doesn't return proper error format
      return createErrorResponse(
        "error.api.http_error" as TranslationKey,
        ErrorResponseTypes.HTTP_ERROR,
        {
          statusCode: response.status,
          url: endpointUrl,
        },
      );
    }

    // Validate successful response against schema
    if (json.success) {
      const validationResponse = validateData(
        json.data,
        endpoint.responseSchema as z.ZodSchema<TResponseOutput, TResponseInput>,
        logger,
      );

      if (!validationResponse.success) {
        // Fallback error when response validation fails
        return createErrorResponse(
          "error.api.validation_error" as TranslationKey,
          ErrorResponseTypes.VALIDATION_ERROR,
          {
            message: validationResponse.message,
          },
        );
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
    return createErrorResponse(
      "error.api.internal_error" as TranslationKey,
      ErrorResponseTypes.INTERNAL_ERROR,
      {
        url: endpointUrl,
      },
    );
  } catch (error) {
    // Fallback error when request fails completely
    return createErrorResponse(
      "error.api.internal_error" as TranslationKey,
      ErrorResponseTypes.INTERNAL_ERROR,
      { error: parseError(error).message, endpoint: endpoint.path.join("/") },
    );
  }
}
