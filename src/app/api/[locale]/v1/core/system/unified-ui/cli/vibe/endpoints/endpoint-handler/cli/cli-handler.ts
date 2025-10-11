/**
 * CLI Handler Utilities
 * Functions for creating CLI handlers from endpoint configurations using unified core logic
 */

import type { NextRequest } from "next/server";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import type z from "zod";

import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { Methods } from "../../endpoint-types/core/enums";
import type { UnifiedField } from "../../endpoint-types/core/types";
import { authenticateUser, executeHandler } from "../core/handler-core";
import { createEndpointLogger } from "../logger/endpoint-logger";
import type { ApiHandlerOptions, InferJwtPayloadTypeFromRoles } from "../types";
import type { CliHandlerReturnType } from "./types";
import { validateCliRequestData } from "./validation";

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
  TFields extends UnifiedField<z.ZodTypeAny>,
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
    urlVariables: TUrlVariablesOutput,
    user: InferJwtPayloadTypeFromRoles<TUserRoleValue>,
    locale: CountryLanguage,
    verbose = false,
  ): Promise<ResponseType<TResponseOutput>> => {
    const { t } = simpleT(locale);
    const logger = createEndpointLogger(verbose, Date.now(), locale);

    // Authenticate user using unified core with CLI context
    const authResult = await authenticateUser(
      endpoint,
      {
        platform: "cli",
        jwtPayload: user,
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
        urlParameters: urlVariables,
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
      urlVariables: validationResult.data.urlVariables,
      user,
      t,
      locale: validationResult.data.locale,
      request: {} as NextRequest, // TODO: Create proper mock request object for CLI
      logger,
    });

    return result as ResponseType<TResponseOutput>;
  };
}
