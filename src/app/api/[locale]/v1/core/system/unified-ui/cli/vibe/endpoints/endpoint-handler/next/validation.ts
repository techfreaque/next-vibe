/**
 * Next.js Platform-Specific Validation
 * Handles Next.js request validation (query params, request body, etc.)
 */

import "server-only";

import type { NextRequest } from "next/server";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
import { validateData } from "next-vibe/shared/utils/validation";
import { z } from "zod";

import type { CountryLanguage } from "@/i18n/core/config";

import { Methods } from "../../endpoint-types/core/enums";
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
        message: "app.error.errors.invalid_url_parameters",
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
        message:
          "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.endpointHandler.error.errors.invalid_request_data",
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
  // Check if the schema is z.undefined() or z.never() (no request data expected)
  // This happens when an endpoint has no request fields
  if (
    endpoint.requestSchema instanceof z.ZodUndefined ||
    endpoint.requestSchema instanceof z.ZodNever
  ) {
    // Return success with undefined as the data (will be cast to TRequestOutput)
    return {
      success: true,
      data: undefined as TRequestOutput,
    };
  }

  // Extract from URL search parameters (raw data)
  const { searchParams } = new URL(request.url);

  // Parse dot notation into nested objects (same as FormData parsing)
  // eslint-disable-next-line no-restricted-syntax
  const queryData: Record<string, unknown> = {};

  for (const [key, value] of searchParams.entries()) {
    // Handle placeholder fields (used to ensure empty objects are sent)
    // eslint-disable-next-line i18next/no-literal-string
    const placeholderSuffix = "._placeholder";
    if (key.endsWith(placeholderSuffix)) {
      // Create the parent object if it doesn't exist
      const parentKey = key.replace(/\._placeholder$/, String(key));
      const keys = parentKey.split(".");
      // eslint-disable-next-line no-restricted-syntax
      let current: Record<string, unknown> = queryData;

      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        const isLast = i === keys.length - 1;

        if (isLast) {
          // Create empty object if it doesn't exist
          if (!current[k]) {
            current[k] = {};
          }
        } else {
          // Intermediate key - create nested object if it doesn't exist
          if (!current[k] || typeof current[k] !== "object") {
            current[k] = {};
          }
          // eslint-disable-next-line no-restricted-syntax
          current = current[k] as Record<string, unknown>;
        }
      }
      continue;
    }

    // Split by dots to handle nested objects (e.g., "pagination.page")
    const keys = key.split(".");
    // eslint-disable-next-line no-restricted-syntax
    let current: Record<string, unknown> = queryData;

    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const isLast = i === keys.length - 1;

      if (isLast) {
        // Last key - set the value with type coercion
        // URL params are always strings, but we need to convert them to proper types
        // Try to parse as number if it looks like a number
        if (value === "") {
          // Empty string - keep as is (will be handled by Zod's optional/default)
          current[k] = value;
        } else if (/^-?\d+$/.test(value)) {
          // Integer
          current[k] = parseInt(value, 10);
        } else if (/^-?\d+\.\d+$/.test(value)) {
          // Float
          current[k] = parseFloat(value);
        } else if (value === "true") {
          current[k] = true;
        } else if (value === "false") {
          current[k] = false;
        } else if (value === "null") {
          current[k] = null;
        } else {
          // String
          current[k] = value;
        }
      } else {
        // Intermediate key - create nested object if it doesn't exist
        if (!current[k] || typeof current[k] !== "object") {
          current[k] = {};
        }
        // eslint-disable-next-line no-restricted-syntax
        current = current[k] as Record<string, unknown>;
      }
    }
  }

  // Validate using schema - schema takes raw input and produces validated output
  return validateData(
    queryData as TRequestInput,
    endpoint.requestSchema,
    logger,
  );
}

/**
 * Parse FormData into a nested object structure
 * Handles dot notation (e.g., "fileUpload.file") and array notation (e.g., "items[0]")
 */
// eslint-disable-next-line no-restricted-syntax
function parseFormDataToObject(formData: FormData): Record<string, unknown> {
  // eslint-disable-next-line no-restricted-syntax
  const result: Record<string, unknown> = {};

  for (const [key, value] of formData.entries()) {
    // Split by dots to handle nested objects (e.g., "fileUpload.file")
    const keys = key.split(".");
    // eslint-disable-next-line no-restricted-syntax
    let current: Record<string, unknown> = result;

    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const isLast = i === keys.length - 1;

      if (isLast) {
        // Last key - set the value
        current[k] = value;
      } else {
        // Intermediate key - create nested object if it doesn't exist
        if (!current[k] || typeof current[k] !== "object") {
          current[k] = {};
        }
        // eslint-disable-next-line no-restricted-syntax
        current = current[k] as Record<string, unknown>;
      }
    }
  }

  return result;
}

/**
 * Validate POST/PUT/PATCH/DELETE request data from body
 * Extracts raw request body and validates using schema
 * Handles both JSON and FormData (multipart/form-data)
 */
async function validatePostRequestData<TRequestInput, TRequestOutput>(
  endpoint: {
    requestSchema: z.ZodSchema<TRequestOutput, TRequestInput>;
  },
  request: NextRequest,
  logger: EndpointLogger,
): Promise<ResponseType<TRequestOutput>> {
  // Check if the schema is z.undefined() or z.never() (no request data expected)
  // This happens when an endpoint has no request fields
  if (
    endpoint.requestSchema instanceof z.ZodUndefined ||
    endpoint.requestSchema instanceof z.ZodNever
  ) {
    // Return success with undefined as the data (will be cast to TRequestOutput)
    return {
      success: true,
      data: undefined as TRequestOutput,
    };
  }

  // Extract from request body (raw data)
  try {
    const contentType = request.headers.get("content-type") || "";

    let body: TRequestInput;

    if (contentType.includes("multipart/form-data")) {
      // Parse FormData
      const formData = await request.formData();
      body = parseFormDataToObject(formData) as TRequestInput;
    } else {
      // Parse JSON
      body = (await request.json()) as TRequestInput;
    }

    // Validate using schema - schema takes raw input and produces validated output
    return validateEndpointRequestData(body, endpoint.requestSchema, logger);
  } catch (error) {
    return {
      success: false,
      message: "app.error.errors.invalid_request_data",
      errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
      messageParams: {
        error:
          error instanceof Error
            ? error.message
            : "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.endpointHandler.error.errors.invalid_json_request_body",
      },
    };
  }
}
