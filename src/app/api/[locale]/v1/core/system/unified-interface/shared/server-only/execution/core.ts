/**
 * Core Handler Implementation
 * Unified handler logic used by Next.js, tRPC, and CLI handlers
 * This ensures DRY principles and consistent behavior across all handler types
 */

import "server-only";

import type { NextRequest } from "next/server";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  type StreamingResponse,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import {
  type AuthContext,
  authRepository,
} from "@/app/api/[locale]/v1/core/user/auth/repository";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import type { ApiEndpoint } from "../../endpoint/create";
import type { EndpointLogger } from "../../logger/endpoint";
import type { Methods } from "../../types/enums";
import type {
  ApiHandlerFunction,
  InferJwtPayloadTypeFromRoles,
} from "../../types/handler";

/**
 * Core handler context - everything needed to execute a handler
 * Context contains validated data (OUTPUT types) ready for handler execution
 */
export interface HandlerContext<
  TRequestOutput,
  TResponseOutput,
  TUrlVariablesOutput,
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly UserRoleValue[],
  TFields,
> {
  endpoint: ApiEndpoint<TExampleKey, TMethod, TUserRoleValue, TFields>;
  handler: ApiHandlerFunction<
    TRequestOutput,
    TResponseOutput,
    TUrlVariablesOutput,
    TUserRoleValue
  >;
  validatedData: TRequestOutput;
  urlPathParams: TUrlVariablesOutput;
  user: InferJwtPayloadTypeFromRoles<TUserRoleValue>;
  t: TFunction;
  locale: CountryLanguage;
  request: NextRequest | undefined;
  logger: EndpointLogger;
}

/**
 * Handler execution result - handlers return OUTPUT types
 * Can be either a standard ResponseType or a StreamingResponse for streaming endpoints
 */
export type HandlerResult<TResponse> =
  | ResponseType<TResponse>
  | StreamingResponse;

/**
 * Execute handler with unified authentication and error handling
 * This is the core execution function used by all handler types
 * Handlers receive OUTPUT types and return OUTPUT types
 */
export async function executeHandler<
  TRequestOutput,
  TResponseOutput,
  TUrlVariablesOutput,
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly UserRoleValue[],
  TFields,
>(
  context: HandlerContext<
    TRequestOutput,
    TResponseOutput,
    TUrlVariablesOutput,
    TExampleKey,
    TMethod,
    TUserRoleValue,
    TFields
  >,
): Promise<HandlerResult<TResponseOutput>> {
  const {
    endpoint,
    handler,
    validatedData,
    urlPathParams,
    user,
    t,
    locale,
    request,
    logger,
  } = context;

  try {
    // Execute the handler with the validated data
    const result = await handler({
      data: validatedData,
      urlPathParams,
      user,
      t,
      locale,
      request,
      logger,
    });

    return result;
  } catch (error) {
    // Log the error for debugging
    const parsedError = parseError(error);
    logger.error(`Handler execution error: ${parsedError.message}`, {
      endpoint: endpoint.path.join("/"),
      method: endpoint.method,
      userId: user.isPublic ? undefined : user.id,
      leadId: user.leadId,
      error: parsedError,
    });

    // Return a standardized error response
    return fail({
      message:
        "app.api.v1.core.system.unifiedInterface.cli.vibe.endpoints.endpointHandler.error.general.internal_server_error",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: {
        error: parsedError.message,
      },
    });
  }
}

/**
 * Authenticate user for endpoint access
 * Unified authentication logic used by all handler types
 */
export async function authenticateUser<
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly UserRoleValue[],
  TFields,
>(
  endpoint: ApiEndpoint<TExampleKey, TMethod, TUserRoleValue, TFields>,
  context: AuthContext,
  logger: EndpointLogger,
): Promise<ResponseType<InferJwtPayloadTypeFromRoles<TUserRoleValue>>> {
  try {
    const user = await authRepository.getTypedAuthMinimalUser(
      endpoint.allowedRoles,
      context,
      logger,
    );

    logger.debug(`Signed in as user: ${user?.id} - lead: ${user?.leadId}`);

    if (!user) {
      return fail({
        message:
          "app.api.v1.core.system.unifiedInterface.cli.vibe.endpoints.endpointHandler.error.unauthorized",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    return {
      success: true,
      data: user,
    };
  } catch (error) {
    const parsedError = parseError(error);
    logger.error(
      `Authentication error: ${parsedError?.message || "Unknown error"}`,
      {
        endpoint: endpoint.path.join("/"),
        method: endpoint.method,
        platform: context?.platform,
        error: parsedError,
      },
    );

    return fail({
      message:
        "app.api.v1.core.system.unifiedInterface.cli.vibe.endpoints.endpointHandler.error.unauthorized",
      errorType: ErrorResponseTypes.UNAUTHORIZED,
      cause: parsedError
        ? fail({
            message:
              "app.api.v1.core.system.unifiedInterface.cli.vibe.endpoints.endpointHandler.error.general.internal_server_error",
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
            messageParams: {
              error: parsedError.message,
            },
          })
        : undefined,
    });
  }
}

/**
 * Type-safe authentication that returns the correct user type based on endpoint roles
 */
export async function authenticateTypedUser<
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly UserRoleValue[],
  TFields,
>(
  endpoint: ApiEndpoint<TExampleKey, TMethod, TUserRoleValue, TFields>,
  context: AuthContext,
  logger: EndpointLogger,
): Promise<ResponseType<InferJwtPayloadTypeFromRoles<TUserRoleValue>>> {
  try {
    const user = await authRepository.getTypedAuthMinimalUser(
      endpoint.allowedRoles,
      context,
      logger,
    );

    if (!user) {
      return fail({
        message:
          "app.api.v1.core.system.unifiedInterface.cli.vibe.endpoints.endpointHandler.error.unauthorized",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    return {
      success: true,
      data: user,
    };
  } catch (error) {
    const parsedError = parseError(error);
    logger.error(`Authentication error: ${parsedError.message}`, {
      endpoint: endpoint.path.join("/"),
      method: endpoint.method,
      platform: context?.platform,
      error: parsedError,
    });

    return fail({
      message:
        "app.api.v1.core.system.unifiedInterface.cli.vibe.endpoints.endpointHandler.error.unauthorized",
      errorType: ErrorResponseTypes.UNAUTHORIZED,
      cause: parsedError
        ? fail({
            message:
              "app.api.v1.core.system.unifiedInterface.cli.vibe.endpoints.endpointHandler.error.general.internal_server_error",
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
            messageParams: {
              error: parsedError.message,
            },
          })
        : undefined,
    });
  }
}
