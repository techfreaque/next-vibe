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

import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { createEndpointLogger } from "../shared/logger/endpoint";
import {
  authenticateUser,
  executeHandler,
} from "../shared/server-only/execution/core";
import type { Methods } from "../shared/types/enums";
import type { UnifiedField } from "../shared/types/endpoint";
import type {
  ApiHandlerOptions,
  CliHandlerReturnType,
  InferJwtPayloadTypeFromRoles,
} from "../shared/types/handler";
import { validateCliRequestData } from "./request-validator";

/**
 * Create a minimal NextRequest mock for CLI context
 * CLI handlers don't have real HTTP requests, so we create a minimal mock
 */
function createMockNextRequest(locale: CountryLanguage): NextRequest {
  const url = `http://localhost:3000/${locale}/cli`;
  const headers = new Headers({
    "content-type": "application/json",
    "x-cli-request": "true",
  });

  return new NextRequest(url, {
    method: "POST",
    headers,
  });
}

/**
 * Create a CLI handler for a specific method
 */
export function createCliHandler<
  TRequestOutput,
  TResponseOutput,
  TUrlVariablesOutput,
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly (typeof UserRoleValue)[],
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

    // Authenticate user using unified core with CLI context
    // Only pass jwtPayload if user is not public (CLI/AI platforms don't support public payloads)
    const authResult = await authenticateUser(
      endpoint,
      {
        platform: "cli",
        jwtPayload: user.isPublic ? undefined : user,
        locale,
      },
      logger,
    );
    if (!authResult.success) {
      return authResult;
    }

    // Validate request data using CLI-specific validation
    const validationResult = validateCliRequestData(
      endpoint,
      {
        method: endpoint.method,
        requestData: data as never,
        urlParameters: urlPathParams as never,
        locale,
      },
      logger,
    );

    if (!validationResult.success) {
      return validationResult;
    }

    // Type guard ensures data exists after success check
    const validatedData = validationResult.data.requestData as TRequestOutput;
    const validatedUrlParams = validationResult.data
      .urlPathParams as TUrlVariablesOutput;
    const validatedLocale = validationResult.data.locale;

    // Execute handler using unified core
    const result = await executeHandler({
      endpoint,
      handler,
      validatedData,
      urlPathParams: validatedUrlParams,
      user,
      t,
      locale: validatedLocale,
      request: createMockNextRequest(locale),
      logger,
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
