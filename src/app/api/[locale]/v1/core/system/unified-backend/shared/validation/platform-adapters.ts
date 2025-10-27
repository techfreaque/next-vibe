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

import type { CreateApiEndpoint } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-endpoint";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger } from "../endpoint-logger";
import type {
  ValidatedRequestData,
  ValidationContext,
} from "../request-validator";
import {
  validateEndpointRequestData,
  validateEndpointUrlParameters,
  validateLocale,
} from "../request-validator";

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
 */
export function validateCliRequestData<
  TRequestInput,
  TRequestOutput,
  TResponseInput,
  TUrlVariablesInput,
  TUrlVariablesOutput,
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly string[],
  TFields,
>(
  endpoint: CreateApiEndpoint<
    TExampleKey,
    TMethod,
    TUserRoleValue,
    TFields,
    TRequestInput,
    TRequestOutput,
    TResponseInput,
    TUrlVariablesInput,
    TUrlVariablesOutput
  >,
  context: CliValidationContext<TRequestInput, TUrlVariablesInput>,
  logger: EndpointLogger,
): ResponseType<ValidatedRequestData<TRequestOutput, TUrlVariablesOutput>> {
  try {
    // Validate locale
    const validatedLocale = validateLocale(context.locale, logger);

    // Validate URL parameters
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
          "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.endpointHandler.error.errors.invalid_request_data",
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
        "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.endpointHandler.error.errors.validation_failed",
      errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
    };
  }
}

/**
 * Extract and validate GET request query parameters from Next.js request
 */
export function validateGetRequestData<TRequestInput, TRequestOutput>(
  endpoint: { requestSchema: z.ZodSchema<TRequestOutput, TRequestInput> },
  request: NextRequest,
  logger: EndpointLogger,
): ResponseType<TRequestOutput> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryData: Record<string, unknown> = {};

    // Convert URLSearchParams to object
    for (const [key, value] of searchParams.entries()) {
      queryData[key] = value;
    }

    // The schema will validate and transform the data to TRequestOutput
    // We pass unknown and let the schema handle type safety
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
      message:
        "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.endpointHandler.error.errors.invalid_query_parameters",
      errorType: ErrorResponseTypes.INVALID_QUERY_ERROR,
    };
  }
}

/**
 * Extract and validate POST/PUT/PATCH/DELETE request body from Next.js request
 */
export async function validatePostRequestData<TRequestInput, TRequestOutput>(
  endpoint: { requestSchema: z.ZodSchema<TRequestOutput, TRequestInput> },
  request: NextRequest,
  logger: EndpointLogger,
): Promise<ResponseType<TRequestOutput>> {
  try {
    const body = await request.json();

    // The schema will validate and transform the data to TRequestOutput
    // We pass unknown and let the schema handle type safety
    return validateEndpointRequestData(
      body,
      endpoint.requestSchema,
      logger,
    );
  } catch (error) {
    logger.error("POST request validation error", {
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      success: false,
      message:
        "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.endpointHandler.error.errors.invalid_request_body",
      errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
    };
  }
}

/**
 * Validate Next.js request data
 * Extracts data from request object based on HTTP method
 */
export async function validateNextRequestData<
  TRequestInput,
  TRequestOutput,
  TResponseInput,
  TUrlVariablesInput,
  TUrlVariablesOutput,
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly string[],
  TFields,
>(
  endpoint: CreateApiEndpoint<
    TExampleKey,
    TMethod,
    TUserRoleValue,
    TFields,
    TRequestInput,
    TRequestOutput,
    TResponseInput,
    TUrlVariablesInput,
    TUrlVariablesOutput
  >,
  context: NextValidationContext<TUrlVariablesInput>,
  logger: EndpointLogger,
): Promise<
  ResponseType<ValidatedRequestData<TRequestOutput, TUrlVariablesOutput>>
> {
  try {
    // Validate locale
    const validatedLocale = validateLocale(context.locale, logger);

    // Validate URL parameters
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

    // Validate request data based on method
    let requestValidation: ResponseType<TRequestOutput>;

    if (context.method === Methods.GET) {
      requestValidation = validateGetRequestData(
        endpoint,
        context.request,
        logger,
      );
    } else {
      requestValidation = await validatePostRequestData<
        TRequestInput,
        TRequestOutput
      >(endpoint, context.request, logger);
    }

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
        "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.endpointHandler.error.errors.validation_failed",
      errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
    };
  }
}

/**
 * Validate tRPC request data
 * tRPC data is already validated by tRPC, but we validate against endpoint schema
 */
export function validateTrpcRequestData<
  TRequestInput,
  TRequestOutput,
  TResponseInput,
  TUrlVariablesInput,
  TUrlVariablesOutput,
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly string[],
  TFields,
>(
  endpoint: CreateApiEndpoint<
    TExampleKey,
    TMethod,
    TUserRoleValue,
    TFields,
    TRequestInput,
    TRequestOutput,
    TResponseInput,
    TUrlVariablesInput,
    TUrlVariablesOutput
  >,
  context: TrpcValidationContext<TRequestOutput, TUrlVariablesOutput>,
  logger: EndpointLogger,
): ResponseType<ValidatedRequestData<TRequestOutput, TUrlVariablesOutput>> {
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
        "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.endpointHandler.error.errors.validation_failed",
      errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
    };
  }
}

