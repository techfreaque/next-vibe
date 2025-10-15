/**
 * Next.js Platform-Specific Validation
 * Handles Next.js request validation (query params, request body, etc.)
 */

import "server-only";

import type { NextRequest } from "next/server";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
import { validateData } from "next-vibe/shared/utils/validation";
import type { z } from "zod";

import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import { Methods } from "../../endpoint-types/core/enums";
import type { UnifiedField } from "../../endpoint-types/core/types";
import type { CreateApiEndpoint } from "../../endpoint-types/endpoint/create";
import {
  type ValidatedRequestData,
  validateEndpointRequestData,
  validateEndpointUrlParameters,
  validateLocale,
} from "../core/validation-core";
import type { EndpointLogger } from "../logger";

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
 * Receives raw INPUT data from Next.js and validates to OUTPUT types
 */
export async function validateNextRequestData<
  TRequestInput,
  TRequestOutput,
  TResponseInput,
  TUrlVariablesInput,
  TUrlVariablesOutput,
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly (typeof UserRoleValue)[],
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

    // Validate URL parameters using schema
    // Schema takes raw input and produces validated output
    // Skip validation if there are no URL parameters (empty object means no params after removing locale)
    const hasUrlParams = Object.keys(context.urlParameters || {}).length > 0;
    const urlValidation = hasUrlParams
      ? validateEndpointUrlParameters(
          context.urlParameters,
          endpoint.requestUrlParamsSchema,
          logger,
        )
      : { success: true as const, data: undefined };

    if (!urlValidation.success) {
      return {
        success: false,
        message: "error.errors.invalid_url_parameters",
        errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
        messageParams: {
          error: urlValidation.message,
        },
      };
    }

    // Validate request data based on method
    // Extract raw data and validate it using schemas
    let requestValidation: ResponseType<TRequestOutput>;

    if (context.method === Methods.GET) {
      // For GET requests, extract query parameters
      requestValidation = validateGetRequestData(
        endpoint,
        context.request,
        logger,
      ) as ResponseType<TRequestOutput>;
    } else {
      // For POST/PUT/PATCH/DELETE requests, validate body
      requestValidation = await validatePostRequestData<
        TRequestInput,
        TRequestOutput
      >(endpoint, context.request, logger);
    }

    if (!requestValidation.success) {
      return {
        success: false,
        message: "error.errors.invalid_request_data",
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
        urlVariables: urlValidation.data as TUrlVariablesOutput,
        locale: validatedLocale,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "error.form_validation_failed",
      errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
      messageParams: {
        error:
          error instanceof Error
            ? error.message
            : "error.errors.unknown_validation_error",
      },
    };
  }
}

/**
 * Validate GET request data from query parameters
 * Extracts raw query parameters and validates using schema
 */
function validateGetRequestData<TRequestInput, TRequestOutput>(
  endpoint: {
    requestSchema: z.ZodSchema<TRequestOutput, TRequestInput>;
  },
  request: NextRequest,
  logger: EndpointLogger,
): ResponseType<TRequestOutput> {
  // Extract from URL search parameters (raw data)
  const { searchParams } = new URL(request.url);
  const queryData: Record<string, string> = {};

  for (const [key, value] of searchParams.entries()) {
    queryData[key] = value;
  }

  // Validate using schema - schema takes raw input and produces validated output
  return validateData(
    queryData as TRequestInput,
    endpoint.requestSchema,
    logger,
  );
}

/**
 * Validate POST/PUT/PATCH/DELETE request data from body
 * Extracts raw request body and validates using schema
 */
async function validatePostRequestData<TRequestInput, TRequestOutput>(
  endpoint: {
    requestSchema: z.ZodSchema<TRequestOutput, TRequestInput>;
  },
  request: NextRequest,
  logger: EndpointLogger,
): Promise<ResponseType<TRequestOutput>> {
  // Extract from request body (raw data)
  try {
    const body = (await request.json()) as TRequestInput;
    // Validate using schema - schema takes raw input and produces validated output
    return validateEndpointRequestData(body, endpoint.requestSchema, logger);
  } catch (error) {
    return {
      success: false,
      message: "error.errors.invalid_request_data",
      errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
      messageParams: {
        error:
          error instanceof Error
            ? error.message
            : "error.errors.invalid_json_request_body",
      },
    };
  }
}
