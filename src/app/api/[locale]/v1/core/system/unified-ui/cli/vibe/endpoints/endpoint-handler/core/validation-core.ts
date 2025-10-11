/**
 * Core Validation Module
 * Generic validation utilities used by all handler types
 * Platform-specific validation logic should be in respective handler folders
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { validateData } from "next-vibe/shared/utils";
import { z } from "zod";

import type { CountryLanguage } from "@/i18n/core/config";
import { CountryLanguageValues, defaultLocale } from "@/i18n/core/config";

import type { Methods } from "../../endpoint-types/core/enums";
import type { EndpointLogger } from "../logger";

/**
 * Generic validation context for different handler types
 */
export interface ValidationContext<TRequestData, TUrlParameters> {
  /** HTTP method being used */
  method: Methods;
  /** Raw request data */
  requestData: TRequestData;
  /** Raw URL parameters */
  urlParameters: TUrlParameters;
  /** Locale for error messages */
  locale: CountryLanguage;
}

/**
 * Validated request data - contains validated data (OUTPUT types) ready for handler
 * This represents the final validated data that domain handlers receive
 */
export interface ValidatedRequestData<TRequestOutput, TUrlVariablesOutput> {
  /** Validated request data (OUTPUT type - what handlers receive) */
  requestData: TRequestOutput;
  /** Validated URL parameters (OUTPUT type - what handlers receive) */
  urlVariables: TUrlVariablesOutput;
  /** Validated locale */
  locale: CountryLanguage;
}

/**
 * Validate locale using the standard schema
 */
export function validateLocale(
  locale: CountryLanguage,
  logger: EndpointLogger,
): CountryLanguage {
  const localeValidation = validateData(
    locale,
    z.nativeEnum(CountryLanguageValues).optional(),
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
 * Generic validation function for request data
 * Works with endpoint schema definitions where schema takes raw data and produces validated data
 * @param data - Raw input data
 * @param schema - Zod schema from endpoint definition
 * @returns Validated data or error response
 */
export function validateRequestWithSchema<TInput, TOutput>(
  data: TInput,
  schema: z.ZodSchema<TOutput, TInput>,
  logger: EndpointLogger,
): ResponseType<TOutput> {
  return validateData(data, schema, logger);
}

/**
 * Generic validation function for URL parameters
 * Works with endpoint schema definitions where schema takes raw data and produces validated data
 * @param urlParameters - Raw URL parameters
 * @param schema - Zod schema from endpoint definition
 * @returns Validated URL parameters or error response
 */
export function validateUrlParametersWithSchema<TInput, TOutput>(
  urlParameters: TInput,
  schema: z.ZodSchema<TOutput, TInput>,
  logger: EndpointLogger,
): ResponseType<TOutput> {
  return validateData(urlParameters, schema, logger);
}

/**
 * Specialized validation function for endpoint request schemas
 * Handles the specific schema structure used in endpoint definitions
 * Takes raw input data and produces validated output data
 */
export function validateEndpointRequestData<TRequestInput, TRequestOutput>(
  data: TRequestInput,
  schema: z.ZodSchema<TRequestOutput, TRequestInput>,
  logger: EndpointLogger,
): ResponseType<TRequestOutput> {
  return validateData(data, schema, logger);
}

/**
 * Specialized validation function for endpoint URL schemas
 * Handles the specific schema structure used in endpoint definitions
 * Takes raw input URL parameters and produces validated output parameters
 */
export function validateEndpointUrlParameters<
  TUrlVariablesInput,
  TUrlVariablesOutput,
>(
  urlParameters: TUrlVariablesInput,
  schema: z.ZodSchema<TUrlVariablesOutput, TUrlVariablesInput>,
  logger: EndpointLogger,
): ResponseType<TUrlVariablesOutput> {
  return validateData(urlParameters, schema, logger);
}
