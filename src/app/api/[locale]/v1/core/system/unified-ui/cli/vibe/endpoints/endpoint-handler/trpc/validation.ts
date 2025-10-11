/**
 * tRPC Platform-Specific Validation
 * Handles tRPC request validation (direct data passing)
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
import { validateData } from "next-vibe/shared/utils/validation";
import type z from "zod";

import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import type { UnifiedField } from "../../endpoint-types/core/types";
import type { CreateApiEndpoint } from "../../endpoint-types/endpoint/create";
import type { Methods } from "../../endpoint-types/core/enums";
import {
  type ValidatedRequestData,
  validateEndpointUrlParameters,
  validateLocale,
} from "../core/validation-core";
import type { EndpointLogger } from "../logger";

/**
 * tRPC validation context
 */
export interface TrpcValidationContext<TRequestData, TUrlParameters> {
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
 * Validate tRPC request data
 */
export function validateTrpcRequestData<
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly (typeof UserRoleValue)[],
  TFields extends UnifiedField<z.ZodTypeAny>,
  TRequestOutput,
  TUrlVariablesOutput,
>(
  endpoint: CreateApiEndpoint<TExampleKey, TMethod, TUserRoleValue, TFields>,
  context: TrpcValidationContext<TRequestOutput, TUrlVariablesOutput>,
  logger: EndpointLogger,
): ResponseType<ValidatedRequestData<TRequestOutput, TUrlVariablesOutput>> {
  try {
    // Validate locale
    const validatedLocale = validateLocale(context.locale, logger);

    // Validate URL parameters
    const urlValidation = validateEndpointUrlParameters<
      TUrlVariablesOutput,
      TUrlVariablesOutput
    >(context.urlParameters, endpoint.requestUrlParamsSchema, logger);
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

    // Validate request data
    const requestValidation = validateData(
      context.requestData,
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

    // Return validated data with type assertions to match handler expectations
    return {
      success: true,
      data: {
        requestData: requestValidation.data as TRequestOutput,
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
