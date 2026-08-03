import {
  formatValidationErrorCompact,
  formatValidationErrorDetails,
} from "./format-validation-error";
import type { CreateApiEndpointAny } from "../definition/endpoint-base";
import type { CountryLanguage } from "../i18n/core/config";
import { scopedTranslation as sharedScopedTranslation } from "../i18n/shared";
import type { ResponseType } from "../route/response.schema";
import { ErrorResponseTypes, fail } from "../route/response.schema";
import type { WidgetData } from "../utils/json";
import { parseError } from "../utils/parse-error";
import type { EndpointLogger } from "../../logger/types";
import type { Platform } from "../../platforms/platforms";
import { isAgentPlatform, isCliPlatform } from "../../platforms/platforms";
import type { ZodError, ZodIssue } from "zod";
import { z } from "zod";

/**
 * Validate data against a schema
 * Accepts any data (from HTTP, user input, etc.) and validates it
 * @param data - The data to validate (can be any type from HTTP)
 * @param schema - The schema to validate against
 * @param logger - Logger instance
 * @returns A response with the validated data or error
 */
export function validateData<TSchema extends z.ZodType>(
  data: Parameters<TSchema["parse"]>[0],
  schema: TSchema,
  logger: EndpointLogger,
  platform: Platform,
  endpointPath: string,
  locale: CountryLanguage,
  /**
   * Endpoint definition, used to build the CLI example command. Omitted by the
   * callers that validate something other than user input (the locale, and
   * response payloads), where an example command would be misleading.
   */
  endpoint?: CreateApiEndpointAny | null,
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

  // Not an endpoint handler, so there is no `t` prop to inherit - this is one of
  // the framework entry points that has to build its own from the request locale.
  const { t } = sharedScopedTranslation.scopedT(locale);

  try {
    const result = schema.safeParse(data);

    if (!result.success) {
      const issues = result.error.issues ?? [];
      const formattedErrors = formatZodErrors(result.error);
      const errorCount = issues.length;
      const isQuietPlatform =
        isCliPlatform(platform) || isAgentPlatform(platform);
      const logValidationDetails = isQuietPlatform
        ? logger.debug.bind(logger)
        : logger.error.bind(logger);
      let truncatedPayload: string | null = null;
      try {
        const raw = JSON.stringify(data);
        truncatedPayload = raw.length > 500 ? `${raw.slice(0, 497)}...` : raw;
      } catch {
        // not serializable
      }
      logValidationDetails("Validation error details", {
        endpoint: endpointPath,
        errorCount,
        errors: result.error.issues?.slice(0, 3).map((e: ZodIssue) => ({
          path: e.path.join("."),
          message: e.message,
          code: e.code,
        })),
        formattedErrors,
        payload: truncatedPayload,
      });
      // The CLI is the only surface with room for the example command and the
      // --interactive hint; every other surface gets the compact field list.
      // Formatting here is what lets the response carry finished text instead of
      // parts that four separate consumers had to reassemble.
      const message = isCliPlatform(platform)
        ? formatValidationErrorDetails(t, issues, endpoint, asInputData(data))
        : formatValidationErrorCompact(t, issues, endpoint);

      return fail({
        message,
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    // For API responses, don't wrap the response in a success object, return the data directly
    return { data: result.data, success: true };
  } catch (error) {
    const parsedError = parseError(error);
    logger.error("Unexpected validation error", parsedError);
    return fail({
      message: t("validation.unexpected", { error: parsedError.message }),
      errorType: ErrorResponseTypes.VALIDATION_ERROR,
    });
  }
}

/**
 * Narrow the payload to the record shape the --interactive hint pre-fills from.
 * Non-object payloads (a bare locale string) have nothing to pre-fill.
 */
function asInputData(
  // eslint-disable-next-line restricted/no-unknown -- Mirrors validateData's input, which is untyped until validated
  data: unknown,
): Record<string, WidgetData> | undefined {
  return typeof data === "object" && data !== null && !Array.isArray(data)
    ? // oxlint-disable-next-line restricted/restricted-syntax
      (data as Record<string, WidgetData>)
    : undefined;
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
