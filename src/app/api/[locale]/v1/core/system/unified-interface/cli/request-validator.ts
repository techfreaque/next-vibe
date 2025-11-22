/**
 * CLI Platform-Specific Validation
 * Handles CLI request validation (direct data passing)
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";
import { z } from "zod";

import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger } from "../shared/logger/endpoint";
import type { Methods } from "../shared/types/enums";
import {
  type ValidatedRequestData,
  validateEndpointRequestData,
  validateEndpointUrlParameters,
  validateLocale,
  isNeverSchema,
} from "../shared/validation/schema";

/**
 * Coerce data types to match schema expectations
 * Handles CLI form inputs where strings need to be converted to numbers/booleans
 */
function coerceDataTypes(
  data: unknown,
  schema: z.ZodTypeAny,
): unknown {
  if (!data || typeof data !== 'object') {
    return data;
  }

  // Handle ZodObject - traverse fields
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape as Record<string, z.ZodTypeAny>;
    const coercedData: Record<string, unknown> = { ...(data as Record<string, unknown>) };

    for (const [key, fieldSchema] of Object.entries(shape)) {
      if (key in coercedData) {
        const value = coercedData[key];

        // Unwrap optional/default schemas
        let unwrappedSchema = fieldSchema;
        while (unwrappedSchema instanceof z.ZodOptional || unwrappedSchema instanceof z.ZodDefault) {
          const def = (unwrappedSchema as z.ZodOptional | z.ZodDefault)._def;
          if ('innerType' in def && def.innerType) {
            unwrappedSchema = def.innerType;
          } else {
            break;
          }
        }

        // Coerce based on schema type
        if (unwrappedSchema instanceof z.ZodNumber && typeof value === 'string') {
          const parsed = parseFloat(value);
          if (!isNaN(parsed)) {
            coercedData[key] = parsed;
          }
        } else if (unwrappedSchema instanceof z.ZodBoolean && typeof value === 'string') {
          const lower = value.toLowerCase();
          if (lower === 'true') coercedData[key] = true;
          else if (lower === 'false') coercedData[key] = false;
        } else if (unwrappedSchema instanceof z.ZodObject) {
          coercedData[key] = coerceDataTypes(value, unwrappedSchema);
        }
      }
    }

    return coercedData;
  }

  return data;
}

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
  context: CliValidationContext<z.input<TRequestSchema>, z.input<TUrlSchema>>,
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
    // Check if schema is z.never() using utility
    const isNever = isNeverSchema(endpoint.requestSchema);

    if (isEmptyObject && isNever) {
      // This is a GET/HEAD/OPTIONS endpoint that expects no input
      // Check if URL params schema is also z.never()
      const isUrlParamsNever = isNeverSchema(
        endpoint.requestUrlPathParamsSchema,
      );

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
              "app.api.v1.core.system.unifiedInterface.cli.vibe.endpoints.endpointHandler.error.errors.invalid_url_parameters",
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
    // First, coerce data types to match schema expectations (e.g., string "1" -> number 1)
    const coercedRequestData = coerceDataTypes(context.requestData, endpoint.requestSchema);

    // Then validate without applying defaults to see what was actually provided
    const rawValidation = endpoint.requestSchema.safeParse(coercedRequestData);

    let finalRequestData: z.output<TRequestSchema> =
      coercedRequestData as z.output<TRequestSchema>;
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
        typeof coercedRequestData === "object" &&
        coercedRequestData !== null
      ) {
        // Merge defaults with CLI data, but preserve CLI values
        finalRequestData = {
          ...defaultsResult.data,
          ...(coercedRequestData as Record<string, unknown>),
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
          "app.api.v1.core.system.unifiedInterface.cli.vibe.endpoints.endpointHandler.error.errors.invalid_request_data",
        errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
        messageParams: {
          error: requestValidation.message,
        },
      };
    }

    // Validate URL parameters if schema exists
    // Check if URL params schema is z.never() - if so, skip validation
    const isUrlParamsNever = isNeverSchema(endpoint.requestUrlPathParamsSchema);

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
        "app.api.v1.core.system.unifiedInterface.cli.vibe.endpoints.endpointHandler.error.form_validation_failed",
      errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
      messageParams: {
        error: parseError(error).message,
      },
    };
  }
}
