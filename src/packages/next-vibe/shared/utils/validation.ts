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
    // Validate the data against the schema
    const result = schema.safeParse(data);

    if (!result.success) {
      const formattedErrors = formatZodErrors(result.error);
      logger.error("Validation error", result.error);
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
  if (!zodError?.errors || !Array.isArray(zodError.errors)) {
    return ["error.general.unknown_validation_error"];
  }
  return zodError.errors.map((err) => `${err.path.join(".")}: ${err.message}`);
}
