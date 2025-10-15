/**
 * CLI Platform-Specific Validation
 * Handles CLI request validation (direct data passing)
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
import type { z } from "zod";

import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import type { Methods } from "../../endpoint-types/core/enums";
import type { UnifiedField } from "../../endpoint-types/core/types";
import type { CreateApiEndpoint } from "../../endpoint-types/endpoint/create";
import {
  type ValidatedRequestData,
  validateEndpointRequestData,
  validateEndpointUrlParameters,
  validateLocale,
} from "../core/validation-core";
import type { EndpointLogger } from "../logger";

// Schema data interface for type safety
interface SchemaData {
  [key: string]: string | number | boolean | null | undefined;
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
 */
export function validateCliRequestData<
  TRequestInput,
  TUrlVariablesInput,
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly (typeof UserRoleValue)[],
  TFields,
>(
  endpoint: CreateApiEndpoint<TExampleKey, TMethod, TUserRoleValue, TFields>,
  context: CliValidationContext<TRequestInput, TUrlVariablesInput>,
  logger: EndpointLogger,
): ResponseType<ValidatedRequestData<TRequestInput, TUrlVariablesInput>> {
  try {
    // Validate locale
    const validatedLocale = validateLocale(context.locale, logger);

    // For CLI, we need to preserve explicitly provided arguments and only apply defaults for missing fields
    // First, validate without applying defaults to see what was actually provided
    const rawValidation = endpoint.requestSchema.safeParse(context.requestData);

    let finalRequestData = context.requestData;
    if (rawValidation.success) {
      // Use the validated data which includes defaults
      finalRequestData = rawValidation.data as TRequestInput;
    } else {
      // If validation fails, still try to preserve CLI args by merging with defaults
      const defaultsResult = endpoint.requestSchema.safeParse({});
      if (defaultsResult.success) {
        // Merge defaults with CLI data, but preserve CLI values
        finalRequestData = {
          ...(defaultsResult.data as SchemaData),
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
        message: "error.errors.invalid_request_data",
        errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
        messageParams: {
          error: requestValidation.message,
        },
      };
    }

    // Validate URL parameters if schema exists and expects parameters
    let urlValidation: ResponseType<TUrlVariablesInput>;
    if (endpoint.requestUrlParamsSchema) {
      // Check if schema expects never (no parameters)
      const testResult = endpoint.requestUrlParamsSchema.safeParse({});
      const isNeverSchema =
        !testResult.success &&
        testResult.error?.issues?.[0]?.code === "invalid_type";

      if (isNeverSchema) {
        // Schema expects never, don't validate URL parameters
        urlValidation = {
          success: true,
          data: undefined as TUrlVariablesInput,
        };
      } else {
        // Schema expects parameters, validate them
        urlValidation = validateEndpointUrlParameters(
          context.urlParameters,
          endpoint.requestUrlParamsSchema,
          logger,
        ) as ResponseType<TUrlVariablesInput>;
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
      }
    } else {
      // No URL schema, use empty object
      urlValidation = { success: true, data: {} as TUrlVariablesInput };
    }

    return {
      success: true,
      data: {
        requestData: requestValidation.data as TRequestInput,
        urlVariables: urlValidation.data,
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
