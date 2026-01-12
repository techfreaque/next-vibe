/**
 * Core Validation Module
 * Generic validation utilities used by all handler types
 * Platform-specific validation logic should be in respective handler folders
 */

import "server-only";

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError, validateData } from "next-vibe/shared/utils";
import { z } from "zod";

import type { CountryLanguage } from "@/i18n/core/config";
import { CountryLanguageValues } from "@/i18n/core/config";

import type { EndpointLogger } from "../../logger/endpoint";
import type { Methods } from "../../types/enums";

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
      // Return the validation error directly with proper message and params
      return urlValidation;
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
      // Return the validation error directly with proper message and params
      return requestValidation;
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

/**
 * Validate response data against endpoint schema
 * Returns validated data or error
 */
export function validateResponseData<TResponseOutput>(
  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Schema validation: Response data can be any type until validated against schema, so unknown is correct.
  data: unknown,
  schema: z.ZodTypeAny,
  logger: EndpointLogger,
): ResponseType<TResponseOutput> {
  const validation = validateData(data, schema, logger);

  if (!validation.success) {
    logger.error("[Request Validator] Response validation failed", {
      error: validation.message,
      messageParams: validation.messageParams,
    });
    return {
      success: false,
      message: "app.api.shared.errorTypes.invalid_response_error",
      errorType: ErrorResponseTypes.INVALID_RESPONSE_ERROR,
      messageParams: {
        error: validation.message,
      },
    };
  }

  return {
    success: true,
    data: validation.data as TResponseOutput,
  };
}
