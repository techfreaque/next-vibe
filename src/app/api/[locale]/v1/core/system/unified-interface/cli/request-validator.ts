/**
 * CLI Platform-Specific Validation
 * Handles CLI request validation (direct data passing)
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
import { z } from "zod";

import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger } from "../shared/logger/endpoint";
import type { Methods } from "../shared/types/enums";
import {
  type ValidatedRequestData,
  validateEndpointRequestData,
  validateEndpointUrlParameters,
  validateLocale,
} from "../shared/validation/schema";

/**
 * CLI validation context
 */
export interface CliValidationContext<TRequestData, TUrlParameters> {
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
 * Validate CLI request data
 * Types flow naturally from schemas - no explicit type parameters needed
 */
export function validateCliRequestData<
  TRequestSchema extends z.ZodTypeAny,
  TUrlSchema extends z.ZodTypeAny,
>(
  endpoint: {
    requestSchema: TRequestSchema;
    requestUrlPathParamsSchema: TUrlSchema;
  },
  context: CliValidationContext<
    Parameters<TRequestSchema["parse"]>[0],
    Parameters<TUrlSchema["parse"]>[0]
  >,
  logger: EndpointLogger,
): ResponseType<
  ValidatedRequestData<z.output<TRequestSchema>, z.output<TUrlSchema>>
> {
  try {
    // Validate locale
    const validatedLocale = validateLocale(context.locale, logger);

    // Special case: If the request schema is z.never() and we receive an empty object,
    // skip validation entirely (GET/HEAD endpoints that don't expect any input)
    const isEmptyObject =
      typeof context.requestData === "object" &&
      context.requestData !== null &&
      Object.keys(context.requestData).length === 0;
    // Check if schema is z.never() using instanceof
    const isNeverSchema = endpoint.requestSchema instanceof z.ZodNever;

    if (isEmptyObject && isNeverSchema) {
      // This is a GET/HEAD/OPTIONS endpoint that expects no input
      // Check if URL params schema is also z.never()
      const isUrlParamsNever =
        endpoint.requestUrlPathParamsSchema instanceof z.ZodNever;

      if (isUrlParamsNever) {
        // URL params also expect no input
        return {
          success: true,
          data: {
            requestData: endpoint.requestSchema.parse({}),
            urlPathParams: endpoint.requestUrlPathParamsSchema.parse(undefined),
            locale: validatedLocale,
          },
        };
      } else {
        // Validate URL parameters normally
        const urlValidation = validateEndpointUrlParameters(
          context.urlParameters,
          endpoint.requestUrlPathParamsSchema,
          logger,
        );
        if (!urlValidation.success) {
          return {
            success: false,
            message:
              "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.endpointHandler.error.errors.invalid_url_parameters",
            errorType: ErrorResponseTypes.INVALID_QUERY_ERROR,
            messageParams: {
              error: urlValidation.message,
            },
          };
        }

        return {
          success: true,
          data: {
            requestData: endpoint.requestSchema.parse({}),
            urlPathParams: urlValidation.data,
            locale: validatedLocale,
          },
        };
      }
    }

    // For CLI, we need to preserve explicitly provided arguments and only apply defaults for missing fields
    // First, validate without applying defaults to see what was actually provided
    const rawValidation = endpoint.requestSchema.safeParse(context.requestData);

    let finalRequestData = context.requestData;
    if (rawValidation.success) {
      // Use the validated data which includes defaults
      finalRequestData = rawValidation.data;
    } else {
      // If validation fails, still try to preserve CLI args by merging with defaults
      const defaultsResult = endpoint.requestSchema.safeParse({});
      if (
        defaultsResult.success &&
        typeof defaultsResult.data === "object" &&
        defaultsResult.data !== null &&
        typeof context.requestData === "object" &&
        context.requestData !== null
      ) {
        // Merge defaults with CLI data, but preserve CLI values
        finalRequestData = {
          ...defaultsResult.data,
          ...context.requestData,
        };
      }
    }

    // Now validate the final merged data
    const requestValidation = validateEndpointRequestData(
      finalRequestData,
      endpoint.requestSchema,
      logger,
    );
    if (!requestValidation.success) {
      return {
        success: false,
        message:
          "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.endpointHandler.error.errors.invalid_request_data",
        errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
        messageParams: {
          error: requestValidation.message,
        },
      };
    }

    // Validate URL parameters if schema exists
    // Check if URL params schema is z.never() - if so, skip validation
    const isUrlParamsNever =
      endpoint.requestUrlPathParamsSchema instanceof z.ZodNever;

    const urlValidation = isUrlParamsNever
      ? { success: true as const, data: undefined as z.output<TUrlSchema> }
      : validateEndpointUrlParameters(
          context.urlParameters,
          endpoint.requestUrlPathParamsSchema,
          logger,
        );
    if (!urlValidation.success) {
      return {
        success: false,
        message:
          "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.endpointHandler.error.errors.invalid_url_parameters",
        errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
        messageParams: {
          error: urlValidation.message,
        },
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
    return {
      success: false,
      message:
        "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.endpointHandler.error.form_validation_failed",
      errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
      messageParams: {
        error:
          error instanceof Error
            ? error.message
            : "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.endpointHandler.error.errors.unknown_validation_error",
      },
    };
  }
}
