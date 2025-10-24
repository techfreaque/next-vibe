import type { z, ZodError } from "zod";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";

import type { ResponseType } from "../types/response.schema";
import {
  createErrorResponse,
  ErrorResponseTypes,
} from "../types/response.schema";
import { parseError } from "./parse-error";

/**
 * Validate data against a schema
 * @param data - The data to validate
 * @param schema - The schema to validate against
 * @returns A response with the validated data or error
 */
export function validateData<TSchema extends z.ZodType>(
  data: z.input<TSchema>,
  schema: TSchema,
  logger: EndpointLogger,
): ResponseType<z.infer<TSchema>> {
  try {
    const result = schema.safeParse(data);

    if (!result.success) {
      // Log the full error object to understand its structure
      logger.error("Zod validation failed", {
        errorType: typeof result.error,
        errorConstructor: result.error?.constructor?.name,
        hasErrors: "errors" in result.error,
        errorsLength: result.error.errors?.length,
        errorKeys: Object.keys(result.error),
        fullError: JSON.stringify(result.error, null, 2),
      });

      const formattedErrors = formatZodErrors(result.error);
      logger.error("Validation error details", {
        errorCount: result.error.errors?.length || 0,
        errors: result.error.errors?.slice(0, 3).map((e) => ({
          path: e.path.join("."),
          message: e.message,
          code: e.code,
        })),
        allErrors: result.error.errors,
        formattedErrors,
      });
      return createErrorResponse(
        "error.general.validation_failed",
        ErrorResponseTypes.VALIDATION_ERROR,
        {
          error: formattedErrors.join("\n"),
        },
      );
    }

    // For API responses, don't wrap the response in a success object, return the data directly
    return { data: result.data as z.infer<TSchema>, success: true };
  } catch (error) {
    const parsedError = parseError(error);
    logger.error("Unexpected validation error", parsedError);
    return createErrorResponse(
      "error.general.unexpected_validation_error",
      ErrorResponseTypes.VALIDATION_ERROR,
      { error: parsedError.message },
    );
  }
}

/**
 * Format Zod errors into a readable format
 * @param zodError - The ZodError object to format
 * @returns A formatted error string array
 */
export function formatZodErrors(zodError: ZodError): string[] {
  if (
    !zodError?.errors ||
    !Array.isArray(zodError.errors) ||
    zodError.errors.length === 0
  ) {
    return ["error.general.unknown_validation_error"];
  }
  return zodError.errors.map((err) => `${err.path.join(".")}: ${err.message}`);
}
