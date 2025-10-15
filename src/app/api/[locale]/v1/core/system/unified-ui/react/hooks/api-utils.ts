import {
  createErrorResponse,
  ErrorResponseTypes,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { validateData } from "next-vibe/shared/utils";
import { parseError } from "next-vibe/shared/utils/parse-error";
import type z from "zod";

import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import { authClientRepository } from "../../../../user/auth/repository-client";
import type { EndpointLogger } from "../../cli/vibe/endpoints/endpoint-handler/logger";

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
  postBody: string | undefined,
  logger: EndpointLogger,
): Promise<ResponseType<TResponseOutput>> {
  try {
    // Prepare headers
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Check authentication status if required
    if (endpoint.requiresAuthentication()) {
      const tokenResponse = authClientRepository.hasAuthStatus(logger);
      if (!tokenResponse.success || !tokenResponse.data) {
        return createErrorResponse(
          "error.errorTypes.unauthorized",
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

      return createErrorResponse(
        "error.errorTypes.http_error",
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
        return createErrorResponse(
          "error.errorTypes.validation_error",
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

    return createErrorResponse(
      "error.errorTypes.internal_error",
      ErrorResponseTypes.INTERNAL_ERROR,
      {
        url: endpointUrl,
      },
    );
  } catch (error) {
    return createErrorResponse(
      "error.errorTypes.internal_error",
      ErrorResponseTypes.INTERNAL_ERROR,
      { error: parseError(error).message, endpoint: endpoint.path.join("/") },
    );
  }
}
