/**
 * Core Handler Implementation
 * Unified handler logic used by Next.js, tRPC, and CLI handlers
 * This ensures DRY principles and consistent behavior across all handler types
 */

import "server-only";

import type { NextRequest } from "next/server";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";
import type z from "zod";

import {
  type AuthContext,
  authRepository,
} from "@/app/api/[locale]/v1/core/user/auth/repository";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import type { Methods } from "../../endpoint-types/core/enums";
import type { UnifiedField } from "../../endpoint-types/core/types";
import type { ApiEndpoint } from "../../endpoint-types/endpoint/create";
import type { EndpointLogger } from "../logger";
import type {
  ApiHandlerFunction,
  InferJwtPayloadTypeFromRoles,
} from "../types";

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
  TUserRoleValue extends readonly (typeof UserRoleValue)[],
  TFields extends UnifiedField<z.ZodTypeAny>,
> {
  endpoint: ApiEndpoint<TExampleKey, TMethod, TUserRoleValue, TFields>;
  handler: ApiHandlerFunction<
    TRequestOutput,
    TResponseOutput,
    TUrlVariablesOutput,
    TUserRoleValue
  >;
  validatedData: TRequestOutput;
  urlVariables: TUrlVariablesOutput;
  user: InferJwtPayloadTypeFromRoles<TUserRoleValue>;
  t: TFunction;
  locale: CountryLanguage;
  request: NextRequest;
  logger: EndpointLogger;
}

/**
 * Handler execution result - handlers return OUTPUT types
 */
export type HandlerResult<TResponse> = ResponseType<TResponse>;

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
  TUserRoleValue extends readonly (typeof UserRoleValue)[],
  TFields extends UnifiedField<z.ZodTypeAny>,
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
    urlVariables,
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
      urlVariables,
      user,
      t,
      locale,
      request,
      logger,
    });

    return result;
  } catch (error) {
    // Log the error for debugging
    logger.error(`Handler execution error: ${parseError(error).message}`, {
      endpoint: endpoint.path.join("/"),
      method: endpoint.method,
      userId: user.id,
      error: parseError(error),
    });

    // Return a standardized error response
    return createErrorResponse(
      "error.general.internal_server_error",
      ErrorResponseTypes.INTERNAL_ERROR,
      {
        error: parseError(error).message,
      },
    );
  }
}

/**
 * Authenticate user for endpoint access
 * Unified authentication logic used by all handler types
 */
export async function authenticateUser<
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly (typeof UserRoleValue)[],
  TFields extends UnifiedField<z.ZodTypeAny>,
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
      return createErrorResponse(
        "error.unauthorized",
        ErrorResponseTypes.UNAUTHORIZED,
      );
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

    return createErrorResponse(
      "error.unauthorized",
      ErrorResponseTypes.UNAUTHORIZED,
    );
  }
}

/**
 * Type-safe authentication that returns the correct user type based on endpoint roles
 */
export async function authenticateTypedUser<
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly (typeof UserRoleValue)[],
  TFields extends UnifiedField<z.ZodTypeAny>,
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
      return createErrorResponse(
        "error.unauthorized",
        ErrorResponseTypes.UNAUTHORIZED,
      );
    }

    return {
      success: true,
      data: user,
    };
  } catch (error) {
    logger.error(`Authentication error: ${parseError(error).message}`, {
      endpoint: endpoint.path.join("/"),
      method: endpoint.method,
      platform: context?.platform,
      error: parseError(error),
    });

    return createErrorResponse(
      "error.unauthorized",
      ErrorResponseTypes.UNAUTHORIZED,
    );
  }
}
