/**
 * tRPC Platform-Specific Validation
 * Handles tRPC request validation (direct data passing)
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
import { validateData } from "next-vibe/shared/utils/validation";

import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import type { Methods } from "../../endpoint-types/core/enums";
import type { CreateApiEndpoint } from "../../endpoint-types/endpoint/create";
import {
  type ValidatedRequestData,
  validateEndpointUrlParameters,
  validateLocale,
} from "../core/validation-core";
import type { EndpointLogger } from "../logger";

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
 */
export function validateTrpcRequestData<
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly string[],
  TFields,
  TRequestInput,
  TRequestOutput,
  TResponseInput,
  TResponseOutput,
  TUrlVariablesInput,
  TUrlVariablesOutput,
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
  context: TrpcValidationContext<TRequestOutput, TUrlVariablesOutput>,
  logger: EndpointLogger,
): ResponseType<ValidatedRequestData<TRequestOutput, TUrlVariablesOutput>> {
  try {
    // Validate locale
    const validatedLocale = validateLocale(context.locale, logger);

    // Validate URL parameters
    // Note: tRPC data is already validated, so we pass OUTPUT type through schema again
    const urlValidation = validateEndpointUrlParameters(
      context.urlParameters,
      endpoint.requestUrlParamsSchema,
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
        message:
          "app.api.v1.core.system.unifiedUi.cli.vibe.endpoints.endpointHandler.error.errors.invalid_request_data",
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
        urlVariables: urlValidation.data as TUrlVariablesOutput,
        locale: validatedLocale,
      },
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
      },
    };
  }
}
