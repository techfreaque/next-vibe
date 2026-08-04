/**
 * Core Validation Module
 * Generic validation utilities used by all handler types
 * Platform-specific validation logic should be in respective handler folders
 */

import "server-only";

import type { z } from "zod";

import type { EndpointLogger } from "../../logger/types";
import {
  isAgentPlatform,
  isCliPlatform,
  Platform,
} from "../../platforms/platforms";
import { validateData } from "../core-utils/validation";
import type { CreateApiEndpointAny } from "../definition/endpoint-base";
import type { Methods } from "../definition/enums";
import type { CountryLanguage } from "../i18n/core/config";
import { scopedTranslation as sharedScopedTranslation } from "../i18n/shared";
import type { WidgetData } from "../utils/json";
import { parseError } from "../utils/parse-error";
import { ErrorResponseTypes, fail, type ResponseType } from "./response.schema";
import { validateLocale } from "./validate-locale";

/**
 * CLI validation context
 */
interface HandlerValidationContext<TRequestData, TUrlParameters> {
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
  /**
   * Full endpoint definition, used to build the CLI example command shown on a
   * validation failure.
   *
   * REQUIRED, and threaded from the route rather than looked up here. The route
   * has already loaded this definition before dispatch — passing it down is free,
   * whereas re-resolving it at this depth would mean a registry lookup or a
   * module-level cache, i.e. ambient state standing in for an argument the
   * caller already holds.
   *
   * Kept separate from the schemas above because the caller passes a
   * ROLE-FILTERED request schema, not the endpoint's raw one; this is the
   * unfiltered definition, and conflating them would leak fields a role cannot
   * see into the example command.
   */
  endpointDefinition: CreateApiEndpointAny,
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
      platform,
      `${context.endpointPath}/url-params`,
      validatedLocale,
      endpointDefinition,
    );
    if (!urlValidation.success) {
      const logUrl =
        isCliPlatform(platform) || platform === Platform.MCP
          ? logger.debug.bind(logger)
          : logger.error.bind(logger);
      logUrl("URL validation failed", {
        endpoint: context.endpointPath,
        error: urlValidation.message,
        urlParams: JSON.stringify(context.urlParameters),
      });
      return urlValidation;
    }

    // Normalize: AI/CLI models sometimes send object fields as JSON strings — parse them.
    // Only for agent/CLI platforms: machine-to-machine HTTP calls send properly typed
    // data and must not have their string values auto-parsed.
    const normalizedRequestData =
      isAgentPlatform(platform) || isCliPlatform(platform)
        ? deepParseJsonStrings(context.requestData as WidgetData)
        : (context.requestData as WidgetData);

    // Now validate the final merged data
    const requestValidation = validateData(
      normalizedRequestData,
      endpoint.requestSchema,
      logger,
      platform,
      context.endpointPath,
      validatedLocale,
      endpointDefinition,
    );
    if (!requestValidation.success) {
      const logReq =
        isCliPlatform(platform) || isAgentPlatform(platform)
          ? logger.debug.bind(logger)
          : logger.error.bind(logger);
      logReq("Request validation failed", {
        endpoint: context.endpointPath,
        error: requestValidation.message,
        receivedKeys:
          normalizedRequestData &&
          typeof normalizedRequestData === "object" &&
          !Array.isArray(normalizedRequestData)
            ? Object.keys(normalizedRequestData as Record<string, string>).join(
                ", ",
              )
            : typeof normalizedRequestData,
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
    logger.error("Request validation failed (exception)", parseError(error), {
      endpoint: context.endpointPath,
    });
    const { t } = sharedScopedTranslation.scopedT(context.locale);
    return fail({
      message: t("errors.invalidRequestDataDetail", {
        error: parseError(error).message,
      }),
      errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
    });
  }
}

/**
 * Validate response data against endpoint schema
 * Returns validated data or error
 */
export function validateResponseData<TResponseOutput>(
  // eslint-disable-next-line restricted/no-unknown -- Schema validation: Response data can be any type until validated against schema, so unknown is correct.
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
    platform,
    endpointPath,
    locale,
  );

  if (!validation.success) {
    logger.error("[Request Validator] Response validation failed", {
      error: validation.message,
      endpoint: endpointPath,
    });
    // `errorTypes.invalid_response_error` is the generic ErrorResponseTypes
    // label and renders param-free, so the schema detail gets its own key.
    return fail({
      message: t("errors.invalidResponseDetail", {
        error: validation.message,
      }),
      errorType: ErrorResponseTypes.INVALID_RESPONSE_ERROR,
    });
  }

  return {
    success: true,
    data: validation.data as TResponseOutput,
  };
}
