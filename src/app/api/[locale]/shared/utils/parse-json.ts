import { parse } from "jsonc-parser";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes, fail } from "next-vibe/shared/types/response.schema";

/**
 * JSON Parser with Comment Support
 * Handles JSON files with comments (like tsconfig.json)
 * Uses jsonc-parser which properly handles comments and trailing commas
 */

export interface JsonWithComments {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | undefined
    | JsonWithComments
    | JsonWithComments[];
}

/**
 * Parse JSON with support for comments and trailing commas
 *
 * @param jsonString - JSON string potentially containing comments
 * @returns Parsed JSON object or error response
 */
export function parseJsonWithComments(jsonString: string): ResponseType<JsonWithComments> {
  try {
    const result = parse(jsonString);
    if (typeof result !== "object" || result === null) {
      return fail({
        message: "app.api.shared.utils.parseJsonWithComments.errors.invalid_json",
        errorType: ErrorResponseTypes.INVALID_FORMAT_ERROR,
      });
    }
    // Type guard: result is an object and matches JsonWithComments structure
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return fail({
      message: "app.api.shared.utils.parseJsonWithComments.errors.invalid_json",
      errorType: ErrorResponseTypes.INVALID_FORMAT_ERROR,
      messageParams: {
        error: error instanceof Error ? error.message : String(error),
      },
    });
  }
}

/**
 * Safely parse JSON with comments, returning null on error
 *
 * @param jsonString - JSON string potentially containing comments
 * @returns Parsed JSON object or null if parsing fails
 */
export function tryParseJsonWithComments(jsonString: string): JsonWithComments | null {
  const result = parseJsonWithComments(jsonString);
  return result.success ? result.data : null;
}
