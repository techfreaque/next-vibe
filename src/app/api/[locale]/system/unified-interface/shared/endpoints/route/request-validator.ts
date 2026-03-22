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

import { scopedTranslation as sharedScopedTranslation } from "@/app/api/[locale]/shared/i18n";
import type { CountryLanguage } from "@/i18n/core/config";
import { CountryLanguageValues } from "@/i18n/core/config";

import type { EndpointLogger } from "../../logger/endpoint";
import type { Methods } from "../../types/enums";
import {
  isAgentPlatform,
  isCliPlatform,
  type Platform,
} from "../../types/platform";
import type { WidgetData } from "../../widgets/widget-data";

/**
 * Validate locale using the standard schema
 */
export function validateLocale(
  locale: CountryLanguage,
  logger: EndpointLogger,
  platform: Platform,
): ResponseType<CountryLanguage> {
  const localeValidation = validateData(
    locale,
    z.enum(CountryLanguageValues).optional(),
    logger,
    locale,
    platform,
    "locale-validation",
  );
  const validatedLocale = localeValidation.success
    ? localeValidation.data
    : undefined;
  if (!validatedLocale) {
    logger.error("Invalid locale provided:", locale);
    const { t } = sharedScopedTranslation.scopedT(locale);
    return fail({
      message: t("errors.invalid_request_data"),
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
  /** Endpoint path for logging context (optional) */
  endpointPath: string;
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
 * Recursively parse JSON strings in request data.
 * AI models sometimes send object/array fields as JSON-stringified strings.
 * This normalizes them so Zod validation succeeds.
 */
function deepParseJsonStrings(value: WidgetData): WidgetData {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
      try {
        return JSON.parse(trimmed) as WidgetData;
      } catch {
        // not valid JSON, return as-is
      }
    }
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(deepParseJsonStrings);
  }
  if (value instanceof File || value instanceof Blob) {
    return value;
  }
  if (value !== null && typeof value === "object") {
    const result: Record<string, WidgetData> = {};
    for (const [k, v] of Object.entries(value)) {
      result[k] = deepParseJsonStrings(v);
    }
    return result;
  }
  return value;
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
  platform: Platform,
): ResponseType<
  ValidatedRequestData<z.output<TRequestSchema>, z.output<TUrlSchema>>
> {
  try {
    // Validate locale
    const localeResult = validateLocale(context.locale, logger, platform);
    if (!localeResult.success) {
      return localeResult;
    }
    const validatedLocale = localeResult.data;

    const urlValidation = validateData(
      context.urlParameters,
      endpoint.requestUrlPathParamsSchema,
      logger,
      context.locale,
      platform,
      `${context.endpointPath}/url-params`,
    );
    if (!urlValidation.success) {
      const logUrl =
        isCliPlatform(platform) || isAgentPlatform(platform)
          ? logger.debug.bind(logger)
          : logger.error.bind(logger);
      logUrl("URL validation failed", {
        endpoint: context.endpointPath,
        error: urlValidation.message,
        urlParams: JSON.stringify(context.urlParameters),
      });
      return urlValidation;
    }

    // Normalize: AI models sometimes send object fields as JSON strings — parse them
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Request data from AI tools is WidgetData at runtime despite generic typing
    const normalizedRequestData = deepParseJsonStrings(
      context.requestData as WidgetData,
    );

    // Now validate the final merged data
    const requestValidation = validateData(
      normalizedRequestData,
      endpoint.requestSchema,
      logger,
      context.locale,
      platform,
      context.endpointPath,
    );
    if (!requestValidation.success) {
      const logReq =
        isCliPlatform(platform) || isAgentPlatform(platform)
          ? logger.debug.bind(logger)
          : logger.error.bind(logger);
      logReq("Request validation failed", {
        endpoint: context.endpointPath,
        error: requestValidation.message,
      });
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
    logger.error("Request validation failed", parseError(error), {
      endpoint: context.endpointPath,
    });
    const { t } = sharedScopedTranslation.scopedT(context.locale);
    return {
      success: false,
      message: t("errors.invalid_request_data"),
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
  locale: CountryLanguage,
  platform: Platform,
  endpointPath: string,
): ResponseType<TResponseOutput> {
  const { t } = sharedScopedTranslation.scopedT(locale);
  const validation = validateData(
    data,
    schema,
    logger,
    locale,
    platform,
    endpointPath,
  );

  if (!validation.success) {
    logger.error("[Request Validator] Response validation failed", {
      error: validation.message,
      messageParams: validation.messageParams,
      endpoint: endpointPath,
    });
    return {
      success: false,
      message: t("errorTypes.invalid_response_error"),
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
