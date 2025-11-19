/**
 * Next.js Request Validators
 * Platform-specific validation for Next.js requests
 * Extracted from shared/validation/platform.ts to eliminate Next.js dependencies in shared/
 */

import "server-only";

import type { NextRequest } from "next/server";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";
import { z } from "zod";

import type { EndpointLogger } from "../shared/logger/endpoint";
import {
  validateEndpointRequestData,
  isEmptyObjectSchema,
  isNeverSchema,
} from "../shared/validation/schema";

/**
 * Extract and validate GET request query parameters from Next.js request
 * Types flow naturally from the schema
 */
export function validateGetRequestData<TSchema extends z.ZodTypeAny>(
  endpoint: { requestSchema: TSchema },
  request: NextRequest,
  logger: EndpointLogger,
): ResponseType<z.output<TSchema>> {
  // Check if the schema is z.undefined(), z.never(), or empty z.object({}) (no request data expected)
  // This happens when an endpoint has no request fields (e.g., GET with only response fields)
  const isEmptyObject = isEmptyObjectSchema(endpoint.requestSchema);
  const isNever = isNeverSchema(endpoint.requestSchema);

  if (
    endpoint.requestSchema instanceof z.ZodUndefined ||
    endpoint.requestSchema instanceof z.ZodNever ||
    isNever ||
    isEmptyObject
  ) {
    // Return success with undefined as the data for GET requests with no params
    return {
      success: true,
      data: undefined as z.output<TSchema>,
    };
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const queryData: Record<string, string> = {};

    // Convert URLSearchParams to object
    for (const [key, value] of searchParams.entries()) {
      queryData[key] = value;
    }

    // If no query params and schema expects data, validate empty object
    if (Object.keys(queryData).length === 0) {
      return validateEndpointRequestData({}, endpoint.requestSchema, logger);
    }

    // Types flow naturally through validateEndpointRequestData
    const validationResult = validateEndpointRequestData(
      queryData,
      endpoint.requestSchema,
      logger,
    );

    if (!validationResult.success) {
      logger.error("GET request validation failed", {
        error: validationResult.message,
        messageParams: validationResult.messageParams,
      });
      return fail({
        message: ErrorResponseTypes.INVALID_QUERY_ERROR.errorKey,
        errorType: ErrorResponseTypes.INVALID_QUERY_ERROR,
        messageParams: {
          error: validationResult.message,
        },
        cause: validationResult,
      });
    }

    return validationResult;
  } catch (error) {
    const parsedError = parseError(error);
    logger.error("GET request validation error", {
      error: parsedError.message,
    });
    return fail({
      message: ErrorResponseTypes.INVALID_QUERY_ERROR.errorKey,
      errorType: ErrorResponseTypes.INVALID_QUERY_ERROR,
      messageParams: {
        error: parsedError.message,
      },
    });
  }
}

/**
 * Extract and validate POST/PUT/PATCH/DELETE request body from Next.js request
 * Types flow naturally from the schema
 */
export async function validatePostRequestData<TSchema extends z.ZodTypeAny>(
  endpoint: { requestSchema: TSchema },
  request: NextRequest,
  logger: EndpointLogger,
): Promise<ResponseType<z.output<TSchema>>> {
  // Check if the schema is z.undefined(), z.never(), or empty z.object({}) (no request data expected)
  // This happens when an endpoint has no request fields (e.g., DELETE with only URL params)
  const isEmptyObject = isEmptyObjectSchema(endpoint.requestSchema);
  const isNever = isNeverSchema(endpoint.requestSchema);

  if (
    endpoint.requestSchema instanceof z.ZodUndefined ||
    endpoint.requestSchema instanceof z.ZodNever ||
    isNever ||
    isEmptyObject
  ) {
    // Return success with empty object as the data
    return {
      success: true,
      data: {} as z.output<TSchema>,
    };
  }

  try {
    // Try to get the request body text first to check if it's empty
    const bodyText = await request.text();

    // If body is empty or whitespace only, treat as empty object
    if (!bodyText || bodyText.trim() === "") {
      // Validate empty object against schema
      return validateEndpointRequestData({}, endpoint.requestSchema, logger);
    }

    // Parse the JSON body
    const body = JSON.parse(bodyText) as Record<
      string,
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- JSON parsing requires unknown type for nested objects
      string | number | boolean | null | Record<string, unknown>
    >;

    // Types flow naturally through validateEndpointRequestData
    const validationResult = validateEndpointRequestData(
      body,
      endpoint.requestSchema,
      logger,
    );

    if (!validationResult.success) {
      logger.error("POST request validation failed", {
        error: validationResult.message,
        messageParams: validationResult.messageParams,
      });
      return fail({
        message: ErrorResponseTypes.INVALID_REQUEST_ERROR.errorKey,
        errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
        messageParams: {
          error: validationResult.message,
        },
        cause: validationResult,
      });
    }

    return validationResult;
  } catch (error) {
    const parsedError = parseError(error);
    logger.error("POST request validation error", {
      error: parsedError.message,
    });
    return fail({
      message: ErrorResponseTypes.INVALID_REQUEST_ERROR.errorKey,
      errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
      messageParams: {
        error: parsedError.message,
      },
    });
  }
}
