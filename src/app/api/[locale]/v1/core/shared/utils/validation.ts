import type { z, ZodError, ZodIssue } from "zod";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";

import type { ResponseType } from "../types/response.schema";
import {
  createErrorResponse,
  ErrorResponseTypes,
} from "../types/response.schema";
import { parseError } from "./parse-error";

/**
 * Validate data against a schema
 * Accepts any data (from HTTP, user input, etc.) and validates it
 * @param data - The data to validate (can be any type from HTTP)
 * @param schema - The schema to validate against
 * @returns A response with the validated data or error
 */
export function validateData<TSchema extends z.ZodType>(
  data: Parameters<TSchema["parse"]>[0],
  schema: TSchema,
  logger: EndpointLogger,
): ResponseType<z.infer<TSchema>> {
  try {
    const result = schema.safeParse(data);

    if (!result.success) {
      const formattedErrors = formatZodErrors(result.error);
      const error = {
        errorCount: result.error.issues?.length || 0,
        errors: result.error.issues?.slice(0, 3).map((e: ZodIssue) => ({
          path: e.path.join("."),
          message: e.message,
          code: e.code,
        })),
        allErrors: result.error.issues,
        formattedErrors,
        errorType: typeof result.error,
        errorConstructor: result.error?.constructor?.name,
        hasIssues: "issues" in result.error,
        fullError: JSON.stringify(result.error, null, 2),
      };
      logger.error("Validation error details", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.endpointHandler.error.form_validation_failed",
        ErrorResponseTypes.VALIDATION_ERROR,
        {
          error: formattedErrors.join(", "),
          errorCount: error.errorCount,
        },
      );
    }

    // For API responses, don't wrap the response in a success object, return the data directly
    return { data: result.data, success: true };
  } catch (error) {
    const parsedError = parseError(error);
    logger.error("Unexpected validation error", parsedError);
    return createErrorResponse(
      "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.endpointHandler.error.errors.unknown_validation_error",
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
    !zodError?.issues ||
    !Array.isArray(zodError.issues) ||
    zodError.issues.length === 0
  ) {
    return ["error.general.unknown_validation_error"];
  }
  return zodError.issues.map(
    (err: ZodIssue) => `${err.path.join(".")}: ${err.message}`,
  );
}
