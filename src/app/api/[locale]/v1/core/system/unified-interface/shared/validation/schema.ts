/**
 * Schema Validation Core
 * Shared validation logic for all platforms
 * Eliminates duplication across CLI, Next.js, tRPC validators
 * Pure Zod validation logic - no server dependencies
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
import { validateData } from "next-vibe/shared/utils/validation";
import { z } from "zod";

import type { CountryLanguage } from "@/i18n/core/config";
import { CountryLanguageValues, defaultLocale } from "@/i18n/core/config";

import type { EndpointLogger } from "../types/logger";

/**
 * Validate locale using the standard schema
 */
export function validateLocale(
  locale: CountryLanguage,
  logger: EndpointLogger,
): CountryLanguage {
  const localeValidation = validateData(
    locale,
    z.enum(CountryLanguageValues).optional(),
    logger,
  );
  const validatedLocale = localeValidation.success
    ? localeValidation.data
    : undefined;
  if (!validatedLocale) {
    logger.error("Invalid locale provided, using default", {
      providedLocale: String(locale),
      defaultLocale: String(defaultLocale),
    });
    return defaultLocale;
  }
  return validatedLocale;
}

/**
 * Validate request data with schema
 * Types flow naturally from the schema without explicit constraints
 */
export function validateRequestData<TSchema extends z.ZodTypeAny>(
  data: unknown,
  schema: TSchema,
  logger: EndpointLogger,
): ResponseType<z.output<TSchema>> {
  // If schema is z.never() and data is empty, skip validation
  // This happens when an endpoint has no request body (e.g., GET requests)
  if (
    schema instanceof z.ZodNever &&
    (data === undefined ||
      (typeof data === "object" &&
        data !== null &&
        Object.keys(data).length === 0))
  ) {
    return { success: true, data: undefined as z.output<TSchema> };
  }

  return validateData(data, schema, logger);
}

/**
 * Validate URL parameters with schema
 * Types flow naturally from the schema without explicit constraints
 */
export function validateUrlParameters<TSchema extends z.ZodTypeAny>(
  urlParameters: unknown,
  schema: TSchema,
  logger: EndpointLogger,
): ResponseType<z.output<TSchema>> {
  // If schema is z.never() and urlParameters is empty, skip validation
  // This happens when an endpoint has no URL parameters
  if (
    schema instanceof z.ZodNever &&
    (urlParameters === undefined ||
      (typeof urlParameters === "object" &&
        urlParameters !== null &&
        Object.keys(urlParameters).length === 0))
  ) {
    return { success: true, data: undefined as z.output<TSchema> };
  }

  return validateData(urlParameters, schema, logger);
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
  const testResult = schema.safeParse({});
  return (
    !testResult.success &&
    testResult.error?.issues?.[0]?.code === "invalid_type"
  );
}

/**
 * Get missing required fields from validation error
 */
export function getMissingFields(
  data: Record<string, string | number | boolean | null>,
  schema: z.ZodSchema,
  logger: EndpointLogger,
): string[] {
  const missing: string[] = [];

  try {
    const result = schema.safeParse(data);

    if (!result.success && result.error) {
      for (const issue of result.error.issues) {
        if (
          issue.code === "invalid_type" &&
          "received" in issue &&
          issue.received === "undefined"
        ) {
          missing.push(issue.path.join("."));
        }
      }
    }
  } catch (error) {
    logger.warn("Failed to extract missing fields", {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  return missing;
}

/**
 * Merge data with schema defaults
 * Returns the merged data or the original data if merging fails
 */
export function mergeWithDefaults<T>(
  data: Partial<T>,
  schema: z.ZodSchema<T>,
  logger: EndpointLogger,
): Partial<T> | T {
  try {
    const defaultsResult = schema.safeParse({});
    if (defaultsResult.success) {
      return {
        ...defaultsResult.data,
        ...data,
      };
    }
  } catch (error) {
    logger.warn("Failed to merge with defaults", {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  // Return partial data if defaults couldn't be extracted
  return data;
}

/**
 * Create validation error response
 */
export function createValidationError(error?: string): ResponseType<never> {
  return {
    success: false,
    message: ErrorResponseTypes.INVALID_REQUEST_ERROR.errorKey,
    errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
    messageParams: error ? { error } : undefined,
  };
}

/**
 * Create URL validation error response
 */
export function createUrlValidationError(error: string): ResponseType<never> {
  return {
    success: false,
    message: ErrorResponseTypes.INVALID_QUERY_ERROR.errorKey,
    errorType: ErrorResponseTypes.INVALID_QUERY_ERROR,
    messageParams: {
      error,
    },
  };
}

/**
 * Create request validation error response
 */
export function createRequestValidationError(
  error: string,
): ResponseType<never> {
  return {
    success: false,
    message: ErrorResponseTypes.INVALID_REQUEST_ERROR.errorKey,
    errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
    messageParams: {
      error,
    },
  };
}

/**
 * Validated request data structure
 */
export interface ValidatedRequestData<TRequestOutput, TUrlParametersOutput> {
  requestData: TRequestOutput;
  urlPathParams: TUrlParametersOutput;
  locale: CountryLanguage;
}

/**
 * Validate endpoint request data (alias for validateRequestData)
 */
export const validateEndpointRequestData = validateRequestData;

/**
 * Validate endpoint URL parameters (alias for validateUrlParameters)
 */
export const validateEndpointUrlParameters = validateUrlParameters;
