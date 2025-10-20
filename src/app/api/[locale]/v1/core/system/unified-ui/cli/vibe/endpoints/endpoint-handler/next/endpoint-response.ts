import { NextResponse } from "next/server";
import type { UndefinedType } from "next-vibe/shared/types/common.schema";
import type {
  ErrorResponseType,
  ErrorResponseTypesElements,
  ResponseType,
} from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  errorResponseSchema,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { validateData } from "next-vibe/shared/utils";
import { parseError } from "next-vibe/shared/utils/parse-error";
import type { z, ZodSchema } from "zod";

import type { TParams, TranslationKey } from "@/i18n/core/static-types";

import type { EndpointLogger } from "../logger";

/**
 * Creates a standardized success response
 * @param options - Response options
 * @returns Next.js response
 */
export async function createHTTPSuccessResponse<TResponse>({
  data,
  schema,
  status = 200,
  onSuccess,
  logger,
}: {
  /** Response data */
  data: TResponse;

  /** Response schema */
  schema: z.ZodSchema<TResponse>;

  /** HTTP status code */
  status?: number;

  /** Success callback */
  onSuccess?: (data: TResponse) => Promise<ResponseType<UndefinedType>>;
  logger: EndpointLogger;
}): Promise<NextResponse<ResponseType<TResponse>>> {
  // Validate response data against schema
  const validationResult = validateData(data, schema, logger);

  if (!validationResult.success) {
    logger.error(
      `Response validation error: ${validationResult.message} (${
        validationResult.messageParams
          ? JSON.stringify(validationResult.messageParams)
          : "No params"
      })`,
    );
    return createHTTPErrorResponse({
      message: "app.error.errorTypes.invalid_response_error",
      errorType: ErrorResponseTypes.INVALID_RESPONSE_ERROR,
      messageParams: { message: validationResult.message },
      logger,
    });
  }

  // Execute success callback if provided
  if (onSuccess) {
    try {
      const result = await onSuccess(validationResult.data);

      if (!result.success) {
        return createHTTPErrorResponse({
          message: result.message,
          errorType: result.errorType,
          messageParams: result.messageParams,
          logger,
        });
      }
    } catch (error) {
      logger.error(
        `Error in success callback: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      return createHTTPErrorResponse({
        message: "app.error.errorTypes.internal_error",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: parseError(error).message,
        },
        logger,
      });
    }
  }
  return NextResponse.json(createSuccessResponse(validationResult.data), {
    status,
  });
}

/**
 * Creates a standardized error response
 * @param endpoint - API endpoint
 * @param message - Error message
 * @param status - HTTP status code
 * @returns Next.js response
 */
export function createHTTPErrorResponse({
  message,
  errorType,
  messageParams,
  logger,
}: {
  message: TranslationKey;
  errorType: ErrorResponseTypesElements[keyof ErrorResponseTypesElements];
  messageParams?: TParams;
  logger: EndpointLogger;
}): NextResponse<ErrorResponseType> {
  // Log the error
  logger.error(
    `API error response: ${message} (${errorType.errorCode} / ${errorType.errorKey})`,
  );

  // Validate error response format
  const validationResult = validateData(
    createErrorResponse(message, errorType, messageParams),
    errorResponseSchema,
    logger,
  );

  // Handle validation errors in the error response itself
  if (!validationResult.success) {
    logger.error(
      `Error response validation failed: ${validationResult.message ?? "Unknown validation error"}`,
    );
    return NextResponse.json(
      createErrorResponse(
        "app.error.errorTypes.invalid_response_error",
        ErrorResponseTypes.INVALID_RESPONSE_ERROR,
        { message: validationResult.message },
      ),
      { status: 500 },
    );
  }

  // Return the error response
  return NextResponse.json(validationResult.data as ErrorResponseType, {
    status: errorType.errorCode,
  });
}

/**
 * Validates POST/PUT/PATCH/DELETE request body against a schema
 * @param request - HTTP request
 * @param schema - Zod schema
 * @returns Validated data or error
 */
export async function validatePostRequest<T>(
  request: Request,
  schema: ZodSchema<T>,
  logger: EndpointLogger,
): Promise<ResponseType<T>> {
  try {
    // Parse request body as JSON
    const body = (await request.json()) as T;

    // Validate against schema
    const validationResult = validateData(body, schema, logger);
    if (!validationResult.success) {
      logger.error(`Request validation error: ${validationResult.message}`);
      // Return the actual validation error directly, not a generic wrapper
      return createErrorResponse(
        validationResult.message,
        ErrorResponseTypes.INVALID_REQUEST_ERROR,
        validationResult.messageParams,
      );
    }

    return createSuccessResponse(validationResult.data);
  } catch (error) {
    // For JSON parsing errors, use a specific error message
    return createErrorResponse(
      "app.error.errors.invalid_request_data",
      ErrorResponseTypes.INVALID_REQUEST_ERROR,
      {
        message: parseError(error).message,
      },
    );
  }
}

/**
 * Check if a Zod schema expects undefined when no data is provided
 * @param schema - The Zod schema to inspect
 * @returns True if the schema expects undefined, false if it expects an object
 */
function schemaExpectsUndefined<T>(schema: ZodSchema<T>): boolean {
  try {
    // Test what the schema accepts by attempting to parse undefined and empty object
    const undefinedResult = schema.safeParse(undefined);
    const emptyObjectResult = schema.safeParse({});

    // If undefined parses successfully but empty object doesn't, schema expects undefined
    if (undefinedResult.success && !emptyObjectResult.success) {
      return true;
    }

    // For additional safety, check if both fail - indicates a schema that needs actual data
    if (!undefinedResult.success && !emptyObjectResult.success) {
      // This could be a schema that requires specific data, default to object approach
      return false;
    }

    // Default to object approach (most common case)
    return false;
  } catch {
    // If anything goes wrong during testing, assume it expects an object
    return false;
  }
}

/**
 * Validates GET request query parameters against a schema
 * @param request - HTTP request
 * @param schema - Zod schema
 * @returns Validated data or error
 */
export function validateGetRequest<T extends ZodSchema>(
  request: Request,
  schema: T,
  logger: EndpointLogger,
): ResponseType<z.infer<T>> {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    logger.info("Query parameters:", params);

    // Determine what to pass based on schema expectations and presence of params
    let cleanedParams: T;

    if (Object.keys(params).length === 0) {
      // No query parameters provided - decide based on schema type
      if (schemaExpectsUndefined(schema)) {
        cleanedParams = undefined as never as T;
      } else {
        // Schema expects an object structure, pass empty object
        cleanedParams = {} as never as T;
      }
    } else {
      // Query parameters provided - use them
      cleanedParams = params as never as T;
    }

    // Validate against schema
    const validationResult = validateData(
      cleanedParams as z.input<T>,
      schema,
      logger,
    );

    if (!validationResult.success) {
      logger.error(
        `Query parameter validation error: ${validationResult.message}`,
      );
    }

    if (validationResult.success) {
      return createSuccessResponse(validationResult.data);
    } else {
      logger.error(
        `Query parameter validation error: ${validationResult.message}`,
      );
      // Return the actual validation error directly, not a generic wrapper
      return createErrorResponse(
        validationResult.message,
        ErrorResponseTypes.INVALID_QUERY_ERROR,
        validationResult.messageParams,
      );
    }
  } catch (error) {
    logger.error(
      `Error validating query parameters: ${parseError(error).message}`,
    );
    return createErrorResponse(
      "app.error.errors.invalid_url_parameters",
      ErrorResponseTypes.INVALID_QUERY_ERROR,
      {
        message: parseError(error).message,
      },
    );
  }
}
