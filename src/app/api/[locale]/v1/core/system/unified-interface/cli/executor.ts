/**
 * CLI Handler Utilities
 * Functions for creating CLI handlers from endpoint configurations using unified core logic
 */

import { NextRequest } from "next/server";
import {
  ErrorResponseTypes,
  isStreamingResponse,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import type { z } from "zod";

import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { createEndpointLogger } from "../shared/logger/endpoint";
import { executeHandler } from "../shared/server-only/execution/core";
import type { Methods } from "../shared/types/enums";
import type { UnifiedField } from "../shared/types/endpoint";
import type {
  ApiHandlerOptions,
  CliHandlerReturnType,
  InferJwtPayloadTypeFromRoles,
} from "../shared/types/handler";
import { validateCliRequestData } from "./request-validator";

/**
 * Create a CLI handler for a specific method
 */
export function createCliHandler<
  TRequestOutput,
  TResponseOutput,
  TUrlVariablesOutput,
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly UserRoleValue[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Infrastructure: Generic endpoint type requires 'any' for TFields parameter to accept all endpoint field configurations
  TFields extends UnifiedField<any>,
>(
  options: ApiHandlerOptions<
    TRequestOutput,
    TResponseOutput,
    TUrlVariablesOutput,
    TExampleKey,
    TMethod,
    TUserRoleValue,
    TFields
  >,
): CliHandlerReturnType<
  TRequestOutput,
  TResponseOutput,
  TUrlVariablesOutput,
  TUserRoleValue
> {
  const { endpoint, handler } = options;

  return async (
    data: TRequestOutput,
    urlPathParams: TUrlVariablesOutput,
    user: InferJwtPayloadTypeFromRoles<TUserRoleValue>,
    locale: CountryLanguage,
    verbose = false,
  ): Promise<ResponseType<TResponseOutput>> => {
    const { t } = simpleT(locale);
    const logger = createEndpointLogger(verbose, Date.now(), locale);

    // Validate request data using CLI-specific validation
    const validationResult = validateCliRequestData(
      endpoint,
      {
        method: endpoint.method,
        requestData: data as z.input<typeof endpoint.requestSchema>,
        urlParameters: urlPathParams as z.input<typeof endpoint.requestUrlPathParamsSchema>,
        locale,
      },
      logger,
    );

    if (!validationResult.success) {
      return validationResult;
    }

    // Type guard ensures data exists after success check
    const validatedData = validationResult.data.requestData;
    const validatedUrlParams = validationResult.data.urlPathParams;
    const validatedLocale = validationResult.data.locale;

    // Create minimal NextRequest for CLI context
    const url = new URL(endpoint.path.join('/'), 'http://localhost');
    const mockRequest = new NextRequest(url, {
      method: endpoint.method,
      headers: new Headers(),
    });

    // Execute handler using unified core
    const result = await executeHandler({
      endpoint,
      handler,
      validatedData,
      urlPathParams: validatedUrlParams,
      user,
      t,
      locale: validatedLocale,
      logger,
      request: mockRequest,
    });

    // CLI doesn't support streaming responses
    if (isStreamingResponse(result)) {
      logger.error("CLI handler returned streaming response - not supported");
      return {
        success: false,
        message: ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      };
    }

    // Return the full result including error details and cause chain
    return result;
  };
}
