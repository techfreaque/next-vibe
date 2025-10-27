/**
 * CLI Handler Utilities
 * Functions for creating CLI handlers from endpoint configurations using unified core logic
 */

import type { NextRequest } from "next/server";
import type { ResponseType } from "next-vibe/shared/types/response.schema";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { createEndpointLogger } from "../shared/endpoint-logger";
import type { Methods } from "../shared/enums";
import { authenticateUser, executeHandler } from "../shared/execution-core";
import type {
  ApiHandlerOptions,
  CliHandlerReturnType,
  InferJwtPayloadTypeFromRoles,
} from "../shared/handler-types";
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
  TUserRoleValue extends readonly string[],
  TFields,
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
      return authResult as ResponseType<TResponseOutput>;
    }

    // Validate request data using CLI-specific validation
    const validationResult = validateCliRequestData(
      endpoint,
      {
        method: endpoint.method,
        requestData: data,
        urlParameters: urlPathParams,
        locale,
      },
      logger,
    );

    if (!validationResult.success) {
      return validationResult as ResponseType<TResponseOutput>;
    }

    // Execute handler using unified core
    const result = await executeHandler({
      endpoint,
      handler,
      validatedData: validationResult.data.requestData,
      urlPathParams: validationResult.data.urlPathParams,
      user,
      t,
      locale: validationResult.data.locale,
      request: {} as NextRequest, // TODO: Create proper mock request object for CLI
      logger,
    });

    return result as ResponseType<TResponseOutput>;
  };
}
