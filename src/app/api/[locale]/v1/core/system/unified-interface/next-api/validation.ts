/**
 * Next.js Platform-Specific Validation
 * Handles Next.js request validation (query params, request body, etc.)
 */

import "server-only";

import type { NextRequest } from "next/server";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
import type { z } from "zod";

import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger } from "../shared/logger/endpoint";
import {
  type ValidatedRequestData,
  validateEndpointUrlParameters,
  validateLocale,
} from "../shared/validation/schema";
import {
  validateGetRequestData,
  validatePostRequestData,
} from "../shared/validation/platform";

/**
 * Next.js validation context
 * Handles raw INPUT data from Next.js requests
 */
export interface NextValidationContext<TUrlParametersInput> {
  /** HTTP method being used */
  method: Methods;
  /** Next.js request object */
  request: NextRequest;
  /** Raw URL parameters from Next.js route (INPUT type) */
  urlParameters: TUrlParametersInput;
  /** Locale for error messages */
  locale: CountryLanguage;
}

/**
 * Validate Next.js request data
 * Types flow naturally from endpoint schemas
 */
export async function validateNextRequestData<
  TRequestSchema extends z.ZodTypeAny,
  TUrlSchema extends z.ZodTypeAny,
>(
  endpoint: {
    requestSchema: TRequestSchema;
    requestUrlPathParamsSchema: TUrlSchema;
  },
  context: NextValidationContext<Parameters<TUrlSchema["parse"]>[0]> & {
    method: Methods;
    request: NextRequest;
  },
  logger: EndpointLogger,
): Promise<
  ResponseType<
    ValidatedRequestData<z.output<TRequestSchema>, z.output<TUrlSchema>>
  >
> {
  try {
    // Validate locale
    const validatedLocale = validateLocale(context.locale, logger);

    // Validate URL parameters using schema
    // Schema takes raw input and produces validated output
    const urlValidation = validateEndpointUrlParameters(
      context.urlParameters,
      endpoint.requestUrlPathParamsSchema,
      logger,
    );

    if (!urlValidation.success) {
      return {
        success: false,
        message: ErrorResponseTypes.INVALID_QUERY_ERROR.errorKey,
        errorType: ErrorResponseTypes.INVALID_QUERY_ERROR,
        messageParams: {
          error: urlValidation.message,
        },
      };
    }

    // Validate request data based on method
    // Extract raw data and validate it using schemas
    const requestValidation =
      context.method === Methods.GET
        ? validateGetRequestData(endpoint, context.request, logger)
        : await validatePostRequestData(endpoint, context.request, logger);

    if (!requestValidation.success) {
      return {
        success: false,
        message:
          "app.api.v1.core.system.unifiedInterface.cli.vibe.endpoints.endpointHandler.error.errors.invalid_request_data",
        errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
        messageParams: {
          error: requestValidation.message,
        },
      };
    }

    // Return validated data that handlers will receive
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
        "app.api.v1.core.system.unifiedInterface.cli.vibe.endpoints.endpointHandler.error.form_validation_failed",
      errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
      messageParams: {
        error:
          error instanceof Error
            ? error.message
            : "app.api.v1.core.system.unifiedInterface.cli.vibe.endpoints.endpointHandler.error.errors.unknown_validation_error",
      },
    };
  }
}
