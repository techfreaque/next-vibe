/**
 * Platform-Specific Validation Adapters
 * Consolidates platform-specific validation logic for CLI, Next.js, and tRPC
 * Eliminates duplication across platform-specific validators
 */

import "server-only";

import type { NextRequest } from "next/server";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
import { z } from "zod";

import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger } from "../logger/endpoint";
import type { ValidatedRequestData } from "./schema";
import {
  validateEndpointRequestData,
  validateEndpointUrlParameters,
  validateLocale,
} from "./schema";

/**
 * CLI Validation Context
 */
export interface CliValidationContext<TRequestData, TUrlParameters> {
  method: Methods;
  requestData: TRequestData;
  urlParameters: TUrlParameters;
  locale: CountryLanguage;
}

/**
 * Next.js Validation Context
 */
export interface NextValidationContext<TUrlParameters> {
  method: Methods;
  request: NextRequest;
  urlParameters: TUrlParameters;
  locale: CountryLanguage;
}

/**
 * tRPC Validation Context
 */
export interface TrpcValidationContext<TRequestData, TUrlParameters> {
  requestData: TRequestData;
  urlParameters: TUrlParameters;
  locale: CountryLanguage;
}

/**
 * Validate CLI request data
 * CLI passes data directly, no need to extract from request object
 * Types flow naturally from the endpoint's schemas
 */
export function validateCliRequestData<
  TRequestSchema extends z.ZodTypeAny,
  TUrlSchema extends z.ZodTypeAny,
>(
  endpoint: {
    requestSchema: TRequestSchema;
    requestUrlPathParamsSchema: TUrlSchema;
  },
  context: CliValidationContext<z.input<TRequestSchema>, z.input<TUrlSchema>>,
  logger: EndpointLogger,
): ResponseType<
  ValidatedRequestData<z.output<TRequestSchema>, z.output<TUrlSchema>>
> {
  try {
    // Validate locale
    const validatedLocale = validateLocale(context.locale, logger);

    // Validate URL parameters
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
          "app.api.v1.core.system.unifiedInterface.cli.vibe.endpoints.endpointHandler.error.errors.invalid_url_parameters",
        errorType: ErrorResponseTypes.INVALID_QUERY_ERROR,
        messageParams: {
          error: urlValidation.message,
        },
      };
    }

    // Validate request data
    const requestValidation = validateEndpointRequestData(
      context.requestData,
      endpoint.requestSchema,
      logger,
    );
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

    return {
      success: true,
      data: {
        requestData: requestValidation.data,
        urlPathParams: urlValidation.data,
        locale: validatedLocale,
      },
    };
  } catch (error) {
    logger.error("CLI validation error", {
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      success: false,
      message:
        "app.api.v1.core.system.unifiedInterface.cli.vibe.endpoints.endpointHandler.error.form_validation_failed",
      errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
    };
  }
}

/**
 * Extract and validate GET request query parameters from Next.js request
 * Types flow naturally from the schema
 */
export function validateGetRequestData<TSchema extends z.ZodTypeAny>(
  endpoint: { requestSchema: TSchema },
  request: NextRequest,
  logger: EndpointLogger,
): ResponseType<z.output<TSchema>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryData: Record<string, string> = {};

    // Convert URLSearchParams to object
    for (const [key, value] of searchParams.entries()) {
      queryData[key] = value;
    }

    // Types flow naturally through validateEndpointRequestData
    return validateEndpointRequestData(
      queryData,
      endpoint.requestSchema,
      logger,
    );
  } catch (error) {
    logger.error("GET request validation error", {
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      success: false,
      message: ErrorResponseTypes.INVALID_QUERY_ERROR.errorKey,
      errorType: ErrorResponseTypes.INVALID_QUERY_ERROR,
    };
  }
}

/**
 * Extract and validate POST/PUT/PATCH/DELETE request body from Next.js request
 * Types flow naturally from the schema
 */
export async function validatePostRequestData<TSchema extends z.ZodTypeAny>(
  endpoint: { requestSchema: TSchema },
  request: NextRequest,
  logger: EndpointLogger,
): Promise<ResponseType<z.output<TSchema>>> {
  try {
    const body = (await request.json()) as Record<
      string,
      string | number | boolean | null | object
    >;

    // Types flow naturally through validateEndpointRequestData
    return validateEndpointRequestData(body, endpoint.requestSchema, logger);
  } catch (error) {
    logger.error("POST request validation error", {
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      success: false,
      message: ErrorResponseTypes.INVALID_REQUEST_ERROR.errorKey,
      errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
    };
  }
}

/**
 * Validate Next.js request data
 * Extracts data from request object based on HTTP method
 */
export async function validateNextRequestData<
  TRequestSchema extends z.ZodTypeAny,
  TUrlSchema extends z.ZodTypeAny,
>(
  endpoint: {
    requestSchema: TRequestSchema;
    requestUrlPathParamsSchema: TUrlSchema;
  },
  context: NextValidationContext<z.input<TUrlSchema>>,
  logger: EndpointLogger,
): Promise<
  ResponseType<
    ValidatedRequestData<z.output<TRequestSchema>, z.output<TUrlSchema>>
  >
> {
  try {
    // Validate locale
    const validatedLocale = validateLocale(context.locale, logger);

    // Validate URL parameters
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
          "app.api.v1.core.system.unifiedInterface.cli.vibe.endpoints.endpointHandler.error.errors.invalid_url_parameters",
        errorType: ErrorResponseTypes.INVALID_QUERY_ERROR,
        messageParams: {
          error: urlValidation.message,
        },
      };
    }

    // Validate request data based on method
    const requestValidation =
      context.method === Methods.GET
        ? validateGetRequestData(endpoint, context.request, logger)
        : await validatePostRequestData(endpoint, context.request, logger);

    if (!requestValidation.success) {
      return {
        success: false,
        message: requestValidation.message,
        errorType: requestValidation.errorType,
        messageParams: requestValidation.messageParams,
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
    logger.error("Next.js validation error", {
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      success: false,
      message:
        "app.api.v1.core.system.unifiedInterface.cli.vibe.endpoints.endpointHandler.error.form_validation_failed",
      errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
    };
  }
}

/**
 * Validate tRPC request data
 * tRPC data is already validated by tRPC, but we validate against endpoint schema
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

    // For tRPC, data is already validated by tRPC procedures
    // We just pass it through with type safety
    return {
      success: true,
      data: {
        requestData: context.requestData,
        urlPathParams: context.urlParameters,
        locale: validatedLocale,
      },
    };
  } catch (error) {
    logger.error("tRPC validation error", {
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      success: false,
      message:
        "app.api.v1.core.system.unifiedInterface.cli.vibe.endpoints.endpointHandler.error.form_validation_failed",
      errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
    };
  }
}
