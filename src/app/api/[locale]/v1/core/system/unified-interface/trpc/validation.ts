/**
 * tRPC Platform-Specific Validation
 * Handles tRPC request validation (direct data passing)
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
import { validateData } from "next-vibe/shared/utils/validation";
import type { z } from "zod";

import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger } from "../shared/logger/endpoint";
import type { Methods } from "../shared/types/enums";
import {
  type ValidatedRequestData,
  validateEndpointUrlParameters,
  validateLocale,
} from "../shared/validation/schema";

/**
 * tRPC validation context
 * tRPC passes validated data directly, so this accepts OUTPUT types
 */
export interface TrpcValidationContext<TRequestOutput, TUrlParametersOutput> {
  /** HTTP method being used */
  method: Methods;
  /** Request data (already validated by tRPC) */
  requestData: TRequestOutput;
  /** URL parameters (already validated by tRPC) */
  urlParameters: TUrlParametersOutput;
  /** Locale for error messages */
  locale: CountryLanguage;
}

/**
 * Validate tRPC request data
 * Types flow naturally from endpoint schemas
 */
export function validateTrpcRequestData<
  TRequestSchema extends z.ZodTypeAny,
  TUrlSchema extends z.ZodTypeAny,
>(
  endpoint: {
    requestSchema: TRequestSchema;
    requestUrlPathParamsSchema: TUrlSchema;
  },
  context: TrpcValidationContext<
    z.output<TRequestSchema>,
    z.output<TUrlSchema>
  >,
  logger: EndpointLogger,
): ResponseType<
  ValidatedRequestData<z.output<TRequestSchema>, z.output<TUrlSchema>>
> {
  try {
    // Validate locale
    const validatedLocale = validateLocale(context.locale, logger);

    // Validate URL parameters
    // Note: tRPC data is already validated, so we pass OUTPUT type through schema again
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
        errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
        messageParams: {
          error: urlValidation.message,
        }
      };
    }

    // Validate request data
    const requestValidation = validateData(
      context.requestData,
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
        }
      };
    }

    // Return validated data with type assertions to match handler expectations
    return {
      success: true,
      data: {
        requestData: requestValidation.data,
        urlPathParams: urlValidation.data,
        locale: validatedLocale,
      }
    };
  } catch (error) {
    return {
      success: false,
      message:
        "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.endpointHandler.error.errors.invalid_request_data",
      errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
      messageParams: {
        error:
          error instanceof Error
            ? error.message
            : "app.error.errors.unknown_validation_error",
      }
    };
  }
}
