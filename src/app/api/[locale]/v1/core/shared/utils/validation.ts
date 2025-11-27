import type { ZodError, ZodIssue } from "zod";
import { z } from "zod";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";

import type { ResponseType } from "../types/response.schema";
import { fail, ErrorResponseTypes } from "../types/response.schema";
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
  if (isEmptyObjectSchema(schema)) {
    return { success: true, data: {} as z.infer<TSchema> };
  }
  if (isEmptySchema(schema)) {
    return { success: true, data: undefined as z.infer<TSchema> };
  }
  if (isNeverSchema(schema)) {
    return { success: true, data: undefined as z.infer<TSchema> };
  }

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
      return fail({
        message: "app.api.v1.core.shared.errorTypes.validation_error",
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
        messageParams: {
          error: formattedErrors.join(", "),
          errorCount: error.errorCount,
        },
      });
    }

    // For API responses, don't wrap the response in a success object, return the data directly
    return { data: result.data, success: true };
  } catch (error) {
    const parsedError = parseError(error);
    logger.error("Unexpected validation error", parsedError);
    return fail({
      message: "app.api.v1.core.shared.errorTypes.validation_error",
      errorType: ErrorResponseTypes.VALIDATION_ERROR,
      messageParams: { error: parsedError.message },
    });
  }
}

/**
 * Format Zod errors into a readable format
 * @param zodError - The ZodError object to format
 * @returns A formatted error string array
 */
function formatZodErrors(zodError: ZodError): string[] {
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

/**
 * Check if request schema is an empty object
 */
export function isEmptyObjectSchema(schema: z.ZodSchema): boolean {
  return (
    schema instanceof z.ZodObject && Object.keys(schema.shape).length === 0
  );
}

/**
 * Check if schema expects no input (undefined or never)
 */
export function isEmptySchema(schema: z.ZodSchema): boolean {
  return (
    schema instanceof z.ZodUndefined ||
    schema instanceof z.ZodNever ||
    schema instanceof z.ZodVoid
  );
}

/**
 * Check if schema expects never type specifically
 */
export function isNeverSchema(schema: z.ZodSchema): boolean {
  try {
    const testResult = schema.safeParse({});
    return (
      !testResult.success &&
      testResult.error?.issues?.[0]?.code === "invalid_type" &&
      testResult.error?.issues?.[0]?.expected === "never"
    );
  } catch {
    return false;
  }
}
