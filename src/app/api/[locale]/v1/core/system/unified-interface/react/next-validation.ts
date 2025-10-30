/**
 * Next.js Platform-Specific Validation
 * Handles Next.js request validation (query params, request body, etc.)
 */

import "server-only";

import type { NextRequest } from "next/server";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
import { z } from "zod";

import type { CreateApiEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger } from "../shared/logger/endpoint";
import {
  type ValidatedRequestData,
  validateEndpointRequestData,
  validateEndpointUrlParameters,
  validateLocale,
} from "../shared/validation/schema";

/**
 * Next.js validation context
 * Handles raw INPUT data from Next.js requests
 *
 * Note: urlParameters is Record<string, unknown> to handle cases where
 * we extract parameters from Next.js params (which includes locale) and need
 * to pass the remaining parameters. TypeScript doesn't automatically narrow
 * Omit<T & {locale}, "locale"> to T, so we use a more flexible type here.
 */
export interface NextValidationContext {
  /** HTTP method being used */
  method: Methods;
  /** Next.js request object */
  request: NextRequest;
  /** Raw URL parameters from Next.js route (INPUT type) */
  // eslint-disable-next-line no-restricted-syntax -- Infrastructure: Validation helper requires 'unknown' for untrusted input validation
  urlParameters: Record<string, unknown>;
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
  TResponseOutput,
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
    TResponseOutput,
    TUrlVariablesInput,
    TUrlVariablesOutput
  >,
  context: NextValidationContext,
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
        endpoint.requestUrlPathParamsSchema,
        logger,
      )
      : { success: true as const, data: undefined as TUrlVariablesOutput };

    if (!urlValidation.success) {
      return {
        success: false,
        message: "app.api.v1.core.shared.errors.invalid_url_parameters",
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
      requestValidation = validateGetRequestData<TRequestOutput>(
        endpoint,
        context.request,
        logger,
      );
    } else {
      // For POST/PUT/PATCH/DELETE requests, validate body
      requestValidation = await validatePostRequestData<TRequestOutput>(
        endpoint,
        context.request,
        logger,
      );
    }

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
        urlPathParams: urlValidation.data as TUrlVariablesOutput,
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

/**
 * Validate GET request data from query parameters
 * Extracts raw query parameters and validates using schema
 */
function validateGetRequestData<TRequestOutput>(
  endpoint: {
    requestSchema: z.ZodTypeAny;
  },
  request: NextRequest,
  logger: EndpointLogger,
): ResponseType<TRequestOutput> {
  // Check if the schema is z.undefined(), z.never(), or empty z.object({}) (no request data expected)
  // This happens when an endpoint has no request fields
  const isEmptyObject =
    endpoint.requestSchema instanceof z.ZodObject &&
    Object.keys(endpoint.requestSchema.shape).length === 0;

  // Check if schema is z.never() by testing if it rejects empty object
  const isNeverSchema = ((): boolean => {
    try {
      const testResult = endpoint.requestSchema.safeParse({});
      return (
        !testResult.success &&
        testResult.error?.issues?.[0]?.code === "invalid_type" &&
        testResult.error?.issues?.[0]?.expected === "never"
      );
    } catch {
      return false;
    }
  })();

  if (
    endpoint.requestSchema instanceof z.ZodUndefined ||
    endpoint.requestSchema instanceof z.ZodNever ||
    isNeverSchema ||
    isEmptyObject
  ) {
    // Return success with empty object as the data (will be cast to TRequestOutput)
    return {
      success: true,
      data: {} as TRequestOutput,
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
  return validateEndpointRequestData(
    queryData,
    endpoint.requestSchema,
    logger,
  ) as ResponseType<TRequestOutput>;
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
async function validatePostRequestData<TRequestOutput>(
  endpoint: {
    requestSchema: z.ZodTypeAny;
  },
  request: NextRequest,
  logger: EndpointLogger,
): Promise<ResponseType<TRequestOutput>> {
  // Check if the schema is z.undefined(), z.never(), or empty z.object({}) (no request data expected)
  // This happens when an endpoint has no request fields
  const isEmptyObject =
    endpoint.requestSchema instanceof z.ZodObject &&
    Object.keys(endpoint.requestSchema.shape).length === 0;

  // Check if schema is z.never() by testing if it rejects empty object
  const isNeverSchema = ((): boolean => {
    try {
      const testResult = endpoint.requestSchema.safeParse({});
      return (
        !testResult.success &&
        testResult.error?.issues?.[0]?.code === "invalid_type" &&
        testResult.error?.issues?.[0]?.expected === "never"
      );
    } catch {
      return false;
    }
  })();

  if (
    endpoint.requestSchema instanceof z.ZodUndefined ||
    endpoint.requestSchema instanceof z.ZodNever ||
    isNeverSchema ||
    isEmptyObject
  ) {
    // Return success with empty object as the data (will be cast to TRequestOutput)
    return {
      success: true,
      data: {} as TRequestOutput,
    };
  }

  // Extract from request body (raw data)
  try {
    const contentType = request.headers.get("content-type") || "";

    // eslint-disable-next-line no-restricted-syntax -- Infrastructure: Cache key generation requires 'unknown' for flexible parameter support
    let body: unknown;

    if (contentType.includes("multipart/form-data")) {
      // Parse FormData
      const formData = await request.formData();
      // eslint-disable-next-line no-restricted-syntax -- Infrastructure: Parameter serialization requires 'unknown' for dynamic value handling
      body = parseFormDataToObject(formData as unknown as FormData);
    } else {
      // Parse JSON
      body = await request.json();
    }

    // Validate using schema - schema takes raw input and produces validated output
    return validateEndpointRequestData(
      body,
      endpoint.requestSchema,
      logger,
    ) as ResponseType<TRequestOutput>;
  } catch (error) {
    return {
      success: false,
      message: "app.api.v1.core.shared.errors.invalid_request_data",
      errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
      messageParams: {
        error:
          error instanceof Error
            ? error.message
            : "app.api.v1.core.system.unifiedInterface.cli.vibe.endpoints.endpointHandler.error.errors.invalid_json_request_body",
      },
    };
  }
}
