import type { ZodError, ZodIssue } from "zod";
import { z } from "zod";

import type { EndpointLogger } from "../../logger/types";
import type { Platform } from "../../platforms/platforms";
import { isAgentPlatform, isCliPlatform } from "../../platforms/platforms";
import type { CreateApiEndpointAny } from "../definition/endpoint-base";
import type { CountryLanguage } from "../i18n/core/config";
import { scopedTranslation as sharedScopedTranslation } from "../i18n/shared";
import type { ResponseType } from "../route/response.schema";
import { ErrorResponseTypes, fail } from "../route/response.schema";
import type { WidgetData } from "../utils/json";
import { parseError } from "../utils/parse-error";
import {
  formatValidationErrorCompact,
  formatValidationErrorDetails,
} from "./format-validation-error";

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
    // reportInput puts the offending value on each issue, so the log says WHAT
    // was rejected (e.g. which model id) - summarizeIssueForLog redacts it.
    const result = schema.safeParse(data, { reportInput: true });

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
        // Compact one-liners for EVERY failing path (path, code, received
        // value, allowed-value count) - the full Zod message for an enum
        // lists every option and drowned the actual failing paths.
        errors: issues
          .slice(0, MAX_LOGGED_ISSUES)
          .map((e: ZodIssue) => summarizeIssueForLog(e)),
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
    (err: ZodIssue) => `${err.path.join(".")}: ${compactIssueMessage(err)}`,
  );
}

/** Max issues summarized in the "Validation error details" log. */
const MAX_LOGGED_ISSUES = 20;

/** Enum issues listing more allowed values than this are collapsed to a count. */
const MAX_LISTED_ENUM_VALUES = 8;

/** Path segments whose received value must never reach the logs. */
const SENSITIVE_PATH_PATTERN =
  /pass(word)?|secret|token|api[-_]?key|otp|credential|cookie|authorization/i;

/** Zod's message, minus the full option list on large enums (e.g. every model id). */
function compactIssueMessage(issue: ZodIssue): string {
  if (
    issue.code === "invalid_value" &&
    issue.values.length > MAX_LISTED_ENUM_VALUES
  ) {
    return `Invalid option: not one of the ${issue.values.length} allowed values`;
  }
  return issue.message;
}

/**
 * One log line per issue: path, code, compact message and the received value
 * (primitives verbatim and truncated, objects/arrays as shape only, sensitive
 * paths redacted). Needs the issue parsed with `reportInput: true`.
 */
function summarizeIssueForLog(issue: ZodIssue): string {
  const path = issue.path.join(".") || "(root)";
  const input = issue.input;
  let received: string;
  if (SENSITIVE_PATH_PATTERN.test(path)) {
    received = "[redacted]";
  } else if (input === undefined) {
    received = "undefined";
  } else if (typeof input === "string") {
    received = JSON.stringify(
      input.length > 80 ? `${input.slice(0, 77)}...` : input,
    );
  } else if (
    input === null ||
    typeof input === "number" ||
    typeof input === "boolean" ||
    typeof input === "bigint"
  ) {
    received = String(input);
  } else if (Array.isArray(input)) {
    received = `array(${input.length})`;
  } else if (typeof input === "object") {
    const keys = Object.keys(input);
    received = `object{${keys.slice(0, 8).join(",")}${keys.length > 8 ? ",..." : ""}}`;
  } else {
    received = typeof input;
  }
  return `${path}: [${issue.code}] ${compactIssueMessage(issue)} (received ${received})`;
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
