/**
 * API Handler Execution
 * Safe execution utilities for API handlers
 */

import type { NextRequest } from "next/server";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import type { EndpointLogger } from "../../unified-interface/shared/logger/endpoint";
import type { InferJwtPayloadTypeFromRoles } from "./types";

/**
 * API Handler Function type for tRPC execution
 */
type ApiHandlerFunction<
  TRequestOutput,
  TResponseOutput,
  TUrlVariablesOutput,
  TUserRoleValue extends readonly UserRoleValue[],
> = (params: {
  data: TRequestOutput;
  urlPathParams: TUrlVariablesOutput;
  user: InferJwtPayloadTypeFromRoles<TUserRoleValue>;
  t: TFunction;
  locale: CountryLanguage;
  request: NextRequest;
  logger: EndpointLogger;
}) => Promise<ResponseType<TResponseOutput>>;

/**
 * Safely execute the handler function for tRPC with error handling
 * @param handler - API handler function
 * @param user - Authenticated user
 * @param validatedData - Validated request data
 * @param urlPathParams - Validated URL parameters
 * @param t - Translation function
 * @param locale - Current locale
 * @param request - Original request object
 * @returns Handler result or error
 */
export async function safeExecuteTRPC<
  TRequestOutput,
  TResponseOutput,
  TUrlVariablesOutput,
  TUserRoleValue extends readonly UserRoleValue[],
>(
  handler: ApiHandlerFunction<
    TRequestOutput,
    TResponseOutput,
    TUrlVariablesOutput,
    TUserRoleValue
  >,
  user: InferJwtPayloadTypeFromRoles<TUserRoleValue>,
  validatedData: TRequestOutput,
  urlPathParams: TUrlVariablesOutput,
  t: TFunction,
  locale: CountryLanguage,
  request: NextRequest,
  logger: EndpointLogger,
): Promise<ResponseType<TResponseOutput>> {
  try {
    return await handler({
      data: validatedData,
      urlPathParams,
      user,
      t,
      locale,
      request,
      logger,
    });
  } catch (err) {
    return fail({
      message:
        "app.api.v1.core.system.unifiedInterface.cli.vibe.endpoints.endpointHandler.error.general.internal_server_error",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: {
        error: parseError(err).message,
      },
    });
  }
}
