/**
 * Core Validation Module
 * Generic validation utilities used by all handler types
 * Platform-specific validation logic should be in respective handler folders
 */

import "server-only";

import { parseError, validateData } from "next-vibe/shared/utils";
import { z } from "zod";

import type { CountryLanguage } from "@/i18n/core/config";
import { CountryLanguageValues } from "@/i18n/core/config";
import {
  type ResponseType,
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import type { Methods } from "../../types/enums";
import type { EndpointLogger } from "../../logger/endpoint";

/**
 * Validate locale using the standard schema
 */
export function validateLocale(
  locale: CountryLanguage,
  logger: EndpointLogger,
): ResponseType<CountryLanguage> {
  const localeValidation = validateData(
    locale,
    z.enum(CountryLanguageValues).optional(),
    logger,
  );
  const validatedLocale = localeValidation.success
    ? localeValidation.data
    : undefined;
  if (!validatedLocale) {
    logger.error("Invalid locale provided:", locale);
    return fail({
      message: ErrorResponseTypes.INVALID_REQUEST_ERROR.errorKey,
      errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
      messageParams: {
        error: "Invalid locale provided",
      },
    });
  }
  return success(validatedLocale);
}

/**
 * CLI validation context
 */
export interface HandlerValidationContext<TRequestData, TUrlParameters> {
  /** HTTP method being used */
  method: Methods;
  /** Direct request data */
  requestData: TRequestData;
  /** Direct URL parameters */
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
  urlPathParams: TUrlVariablesOutput;
  /** Validated locale */
  locale: CountryLanguage;
}

/**
 * Validate CLI request data
 * Types flow naturally from schemas - no explicit type parameters needed
 */
export function validateHandlerRequestData<
  TRequestSchema extends z.ZodTypeAny,
  TUrlSchema extends z.ZodTypeAny,
>(
  endpoint: {
    requestSchema: TRequestSchema;
    requestUrlPathParamsSchema: TUrlSchema;
  },
  context: HandlerValidationContext<
    z.input<TRequestSchema>,
    z.input<TUrlSchema>
  >,
  logger: EndpointLogger,
): ResponseType<
  ValidatedRequestData<z.output<TRequestSchema>, z.output<TUrlSchema>>
> {
  try {
    // Validate locale
    const localeResult = validateLocale(context.locale, logger);
    if (!localeResult.success) {
      return localeResult;
    }
    const validatedLocale = localeResult.data;

    const urlValidation = validateData(
      context.urlParameters,
      endpoint.requestUrlPathParamsSchema,
      logger,
    );
    if (!urlValidation.success) {
      logger.error("URL validation failed", {
        error: urlValidation.message,
        messageParams: urlValidation.messageParams,
      });
      return {
        success: false,
        message: ErrorResponseTypes.INVALID_QUERY_ERROR.errorKey,
        errorType: ErrorResponseTypes.INVALID_QUERY_ERROR,
        messageParams: {
          error: urlValidation.message,
        },
      };
    }

    // Now validate the final merged data
    const requestValidation = validateData(
      context.requestData,
      endpoint.requestSchema,
      logger,
    );
    if (!requestValidation.success) {
      logger.error("Request validation failed", {
        error: requestValidation.message,
        messageParams: requestValidation.messageParams,
      });
      return {
        success: false,
        message: ErrorResponseTypes.INVALID_REQUEST_ERROR.errorKey,
        errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
        messageParams: {
          error: requestValidation.message,
        },
        cause: requestValidation,
      };
    }

    return {
      success: true,
      data: {
        requestData: requestValidation.data,
        urlPathParams: urlValidation.data,
        locale: validatedLocale,
      },
    };
  } catch (error) {
    logger.error("Request validation failed", parseError(error));
    return {
      success: false,
      message: ErrorResponseTypes.INVALID_REQUEST_ERROR.errorKey,
      errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
      messageParams: {
        error: parseError(error).message,
      },
    };
  }
}
