/**
 * Generic Handler Utilities
 * Functions for creating generic handlers from endpoint configurations using unified core logic
 * Handles validation, handler execution, email handling for ALL platforms
 */

import "server-only";

import type { NextRequest } from "next/server";
import type { z } from "zod";

import { CreditRepository } from "@/app/api/[locale]/credits/repository";
import { emailHandlingRepository } from "@/app/api/[locale]/emails/smtp-client/email-handling/repository";
import type { EmailHandleRequestOutput } from "@/app/api/[locale]/emails/smtp-client/email-handling/types";
import type { EmailFunctionType } from "@/app/api/[locale]/emails/smtp-client/email-handling/types";
import {
  ErrorResponseTypes,
  type FileResponse,
  isFileResponse,
  isStreamingResponse,
  type ResponseType,
  type StreamingResponse,
} from "@/app/api/[locale]/shared/types/response.schema";
import { handleSms } from "@/app/api/[locale]/sms/handle-sms";
import type { SmsFunctionType } from "@/app/api/[locale]/sms/utils";
import { AuthRepository } from "@/app/api/[locale]/user/auth/repository";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
  JWTPublicPayloadType,
} from "@/app/api/[locale]/user/auth/types";
import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";
import type { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TFunction } from "@/i18n/core/static-types";

import type { EndpointLogger } from "../../logger/endpoint";
import type { CreateApiEndpointAny } from "../../types/endpoint-base";
import type { Platform } from "../../types/platform";
import { permissionsRegistry } from "../permissions/registry";
import {
  validateHandlerRequestData,
  validateResponseData,
} from "./request-validator";

/**
 * Type helper to infer JWT payload type based on user roles
 * - Only PUBLIC role in roles → JWTPublicPayloadType
 * - No PUBLIC role in roles → JwtPayloadType
 * - Mixed roles (includes PUBLIC + others) → JwtPayloadType (union)
 */
export type InferJwtPayloadType<TUserRoleValue extends UserRoleValue> =
  TUserRoleValue extends typeof UserRole.PUBLIC
    ? JWTPublicPayloadType
    : JwtPayloadType;

/**
 * Type helper to filter out platform markers from role arrays
 * Platform markers (CLI_OFF, WEB_OFF, etc.) don't affect JWT payload type
 *
 * Platform markers are identified by their values:
 * - CLI_OFF, CLI_AUTH_BYPASS, AI_TOOL_OFF, WEB_OFF, MCP_ON, PRODUCTION_OFF
 */
type FilterPlatformMarkers<TRoles extends readonly UserRoleValue[]> = Exclude<
  TRoles[number],
  | typeof UserRole.CLI_OFF
  | typeof UserRole.CLI_AUTH_BYPASS
  | typeof UserRole.AI_TOOL_OFF
  | typeof UserRole.WEB_OFF
  | typeof UserRole.MCP_ON
  | typeof UserRole.PRODUCTION_OFF
>;

/**
 * Type helper for arrays of user roles
 *
 * Logic:
 * 1. First, filter out platform markers (CLI_OFF, WEB_OFF, etc.) - they don't affect auth
 * 2. Check if filtering resulted in an empty set (never):
 *    - If FilterPlatformMarkers<TRoles> is never → only platform markers, treat as private (JwtPrivatePayloadType)
 * 3. Otherwise, apply the standard logic:
 *    - Exclude<FilteredRoles, "PUBLIC"> removes "PUBLIC" from the union
 *    - If the result is never, then ONLY PUBLIC was in the filtered array → JWTPublicPayloadType
 *    - If FilteredRoles includes "PUBLIC" (check with Extract) → JwtPayloadType (mixed)
 *    - Otherwise → JwtPrivatePayloadType (no PUBLIC, guaranteed authenticated)
 *
 * Examples:
 * - ["PUBLIC", "CLI_OFF", "WEB_OFF"] → JWTPublicPayloadType (only PUBLIC after filtering)
 * - ["PUBLIC", "ADMIN", "CLI_OFF"] → JwtPayloadType (PUBLIC + ADMIN after filtering)
 * - ["ADMIN", "CLI_OFF"] → JwtPrivatePayloadType (only ADMIN after filtering)
 * - ["CLI_OFF"] → JwtPrivatePayloadType (no user permission roles, platform markers only)
 */
export type InferJwtPayloadTypeFromRoles<
  TRoles extends readonly UserRoleValue[],
> = [FilterPlatformMarkers<TRoles>] extends [never]
  ? JwtPrivatePayloadType
  : Exclude<FilterPlatformMarkers<TRoles>, typeof UserRole.PUBLIC> extends never
    ? JWTPublicPayloadType
    : Extract<
          FilterPlatformMarkers<TRoles>,
          typeof UserRole.PUBLIC
        > extends never
      ? JwtPrivatePayloadType
      : JwtPayloadType;

/**
 * Email handler configuration
 */
export interface EmailHandler<TRequest, TResponse, TUrlVariables> {
  readonly ignoreErrors?: boolean;
  readonly render: EmailFunctionType<TRequest, TResponse, TUrlVariables>;
}

/**
 * SMS handler configuration
 */
export interface SMSHandler<TRequest, TResponse, TUrlVariables> {
  readonly ignoreErrors?: boolean;
  readonly render: SmsFunctionType<TRequest, TResponse, TUrlVariables>;
}

/**
 * API handler props - handlers receive OUTPUT types (validated data)
 */
export interface ApiHandlerProps<
  TRequestOutput,
  TUrlVariablesOutput,
  TUserRoleValue extends readonly UserRoleValue[],
  TPlatform extends Platform = Platform,
> {
  /** Request data (validated by Zod schema) */
  data: TRequestOutput;

  /** URL variables (validated by Zod schema) */
  urlPathParams: TUrlVariablesOutput;

  /** Authenticated user - type inferred from endpoint roles */
  user: InferJwtPayloadTypeFromRoles<TUserRoleValue>;

  /** Server translation function */
  t: TFunction;

  /** Locale */
  locale: CountryLanguage;

  /** Platform where the request originated */
  platform: TPlatform;

  /** Logger instance */
  logger: EndpointLogger;

  /** Original request (optional, platform-specific) */
  request?: NextRequest;
}

/**
 * API handler function type - receives validated data and returns validated response
 * Note: In our schema system, TRequestInput is the validated data (what handlers should receive)
 * but the current interface uses TRequestOutput for backward compatibility
 *
 * Can return either:
 * - ResponseType<TResponseOutput> for standard JSON responses
 * - StreamingResponse for streaming endpoints (e.g., AI chat)
 * - FileResponse for binary file responses (e.g., file downloads)
 */
export type ApiHandlerFunction<
  TRequestOutput,
  TResponseOutput,
  TUrlVariablesOutput,
  TUserRoleValue extends readonly UserRoleValue[],
  TPlatform extends Platform,
> = (
  props: ApiHandlerProps<
    TRequestOutput,
    TUrlVariablesOutput,
    TUserRoleValue,
    TPlatform
  >,
) =>
  | Promise<ResponseType<TResponseOutput> | StreamingResponse | FileResponse>
  | ResponseType<TResponseOutput>
  | StreamingResponse
  | FileResponse;

/**
 * Handler configuration for a single method with proper typing
 * Handlers receive validated data (OUTPUT types) from Zod
 * and return validated response data (OUTPUT types)
 */
export interface MethodHandlerConfig<
  TRequestOutput,
  TResponseOutput,
  TUrlVariablesOutput,
  TUserRoleValue extends readonly UserRoleValue[],
  TPlatform extends Platform = Platform,
> {
  handler: ApiHandlerFunction<
    TRequestOutput,
    TResponseOutput,
    TUrlVariablesOutput,
    TUserRoleValue,
    TPlatform
  >;
  email?: EmailHandler<TRequestOutput, TResponseOutput, TUrlVariablesOutput>[];
  sms?: SMSHandler<TRequestOutput, TResponseOutput, TUrlVariablesOutput>[];
}

export interface ApiHandlerOptions<
  TRequestOutput,
  TResponseOutput,
  TUrlVariablesOutput,
  TUserRoleValue extends readonly UserRoleValue[],
  TEndpoint extends CreateApiEndpointAny,
  TPlatform extends Platform = Platform,
> {
  endpoint: TEndpoint;
  handler: ApiHandlerFunction<
    TRequestOutput,
    TResponseOutput,
    TUrlVariablesOutput,
    TUserRoleValue,
    TPlatform
  >;
  email?:
    | {
        afterHandlerEmails?: EmailHandler<
          TRequestOutput,
          TResponseOutput,
          TUrlVariablesOutput
        >[];
      }
    | undefined;
  sms?: {
    afterHandlerSms?: SMSHandler<
      TRequestOutput,
      TResponseOutput,
      TUrlVariablesOutput
    >[];
  };
}

export type GenericHandlerReturnType<
  TRequestOutput,
  TResponseOutput,
  TUrlVariablesOutput,
  TUserRoleValue extends readonly UserRoleValue[],
> = (props: {
  data: TRequestOutput;
  urlPathParams: TUrlVariablesOutput;
  user?: InferJwtPayloadTypeFromRoles<TUserRoleValue>; // Optional: if provided, skip auth; if not, do auth
  locale: CountryLanguage;
  logger: EndpointLogger;
  platform: Platform;
  request?: NextRequest; // Optional NextRequest for Next.js platform
}) => Promise<ResponseType<TResponseOutput> | StreamingResponse | FileResponse>;

/**
 * Base type for generic handlers when exact types are not known
 * Used for dynamic handler loading where specific types cannot be inferred
 *
 * This type represents the structural shape of a handler function without
 * constraining the specific types, allowing handlers with different specific
 * types to be stored together while maintaining type safety at the call site.
 */
export type GenericHandlerBase = GenericHandlerReturnType<
  // oxlint-disable-next-line no-explicit-any
  any,
  // oxlint-disable-next-line no-explicit-any
  any,
  // oxlint-disable-next-line no-explicit-any
  any,
  // oxlint-disable-next-line no-explicit-any
  readonly any[]
>;

export function createGenericHandler<T extends CreateApiEndpointAny>(
  options: ApiHandlerOptions<
    T["types"]["RequestOutput"],
    T["types"]["ResponseOutput"],
    T["types"]["UrlVariablesOutput"],
    T["allowedRoles"],
    T
  >,
): GenericHandlerReturnType<
  T["types"]["RequestOutput"],
  T["types"]["ResponseOutput"],
  T["types"]["UrlVariablesOutput"],
  T["allowedRoles"]
> {
  const { endpoint, handler, email, sms } = options;

  return async ({
    data,
    urlPathParams,
    user: providedUser,
    locale,
    logger,
    platform,
    request,
  }): Promise<
    | ResponseType<T["types"]["ResponseOutput"]>
    | StreamingResponse
    | FileResponse
  > => {
    const { t } = simpleT(locale);

    // 1. Authenticate user - call authRepository directly if user not provided
    let user: InferJwtPayloadTypeFromRoles<T["allowedRoles"]>;
    if (providedUser) {
      user = providedUser as InferJwtPayloadTypeFromRoles<T["allowedRoles"]>;
    } else {
      const authUser = await AuthRepository.getAuthMinimalUser(
        endpoint.allowedRoles,
        { platform, locale, request },
        logger,
      );

      if (!authUser) {
        return {
          success: false,
          message: ErrorResponseTypes.UNAUTHORIZED.errorKey,
          errorType: ErrorResponseTypes.UNAUTHORIZED,
          messageParams: { error: "User authentication failed" },
        };
      }

      user = authUser as InferJwtPayloadTypeFromRoles<T["allowedRoles"]>;
    }

    // 2. Validate endpoint access (platform + permissions)
    const accessValidation = permissionsRegistry.validateEndpointAccess(
      endpoint,
      user,
      platform,
      locale,
    );

    if (!accessValidation.success) {
      logger.warn(`[Generic Handler] Endpoint access denied`, {
        routePath: `${endpoint.path.join("/")}/${endpoint.method}`,
        userId: user.isPublic ? "public" : user.id,
        reason: accessValidation.message,
      });
      return accessValidation;
    }

    // 3. Validate request data using request validator
    const validationResult = validateHandlerRequestData(
      endpoint,
      {
        method: endpoint.method,
        requestData: data as z.input<typeof endpoint.requestSchema>,
        urlParameters: urlPathParams as z.input<
          typeof endpoint.requestUrlPathParamsSchema
        >,
        locale,
      },
      logger,
    );

    if (!validationResult.success) {
      return validationResult;
    }

    // 4. Check and deduct credits if endpoint has credit cost
    if (endpoint.credits && endpoint.credits > 0) {
      const hasSufficient = await CreditRepository.hasSufficientCredits(
        user.id
          ? { userId: user.id, leadId: user.leadId }
          : { leadId: user.leadId },
        endpoint.credits,
        logger,
      );

      if (!hasSufficient) {
        logger.warn("Insufficient credits for endpoint", {
          routePath: `${endpoint.path.join("/")}/${endpoint.method}`,
          userId: user.isPublic ? "public" : user.id,
          cost: endpoint.credits,
        });
        return {
          success: false,
          message: "app.api.credits.errors.insufficientCredits",
          errorType: ErrorResponseTypes.PAYMENT_REQUIRED,
          messageParams: { cost: endpoint.credits },
        };
      }

      const deductResult = await CreditRepository.deductCreditsForFeature(
        user,
        endpoint.credits,
        t(endpoint.title),
        logger,
      );

      if (!deductResult.success) {
        logger.error("Failed to deduct credits for endpoint", {
          routePath: `${endpoint.path.join("/")}/${endpoint.method}`,
          userId: user.isPublic ? "public" : user.id,
          cost: endpoint.credits,
        });
        return {
          success: false,
          message: "app.api.credits.errors.deductionFailed",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: { cost: endpoint.credits },
        };
      }
    }

    const result = await handler({
      data: validationResult.data.requestData as T["types"]["RequestOutput"],
      urlPathParams: validationResult.data
        .urlPathParams as T["types"]["UrlVariablesOutput"],
      user,
      t,
      locale: validationResult.data.locale,
      logger,
      request,
      platform,
    });

    // 5. Handle file responses - return immediately without email/SMS processing
    if (isFileResponse(result)) {
      logger.debug("File response detected - returning immediately");
      return result;
    }

    // 6. Handle streaming responses - return immediately without email/SMS processing
    if (isStreamingResponse(result)) {
      logger.debug("Streaming response detected - returning immediately");
      return result;
    }

    // 7. Return errors without validation (errors are already validated)
    if (!result.success) {
      return result;
    }

    // 7. Validate response data using request validator
    const responseValidation = validateResponseData<
      T["types"]["ResponseOutput"]
    >(result.data, endpoint.responseSchema, logger);

    if (!responseValidation.success) {
      return responseValidation;
    }

    if (email?.afterHandlerEmails) {
      await emailHandlingRepository.handleEmails<
        T["types"]["RequestOutput"],
        T["types"]["ResponseOutput"],
        T["types"]["UrlVariablesOutput"]
      >(
        {
          email,
          responseData: responseValidation.data as T["types"]["ResponseOutput"],
          urlPathParams: validationResult.data
            .urlPathParams as T["types"]["UrlVariablesOutput"],
          requestData: validationResult.data
            .requestData as T["types"]["RequestOutput"],
          t,
          locale: validationResult.data.locale,
          user,
        } satisfies EmailHandleRequestOutput<
          T["types"]["RequestOutput"],
          T["types"]["ResponseOutput"],
          T["types"]["UrlVariablesOutput"]
        >,
        logger,
      );
    }

    if (sms?.afterHandlerSms) {
      await handleSms<
        T["types"]["RequestOutput"],
        T["types"]["ResponseOutput"],
        T["types"]["UrlVariablesOutput"]
      >({
        sms,
        user,
        responseData: responseValidation.data as T["types"]["ResponseOutput"],
        urlPathParams: validationResult.data
          .urlPathParams as T["types"]["UrlVariablesOutput"],
        requestData: validationResult.data
          .requestData as T["types"]["RequestOutput"],
        t,
        locale: validationResult.data.locale,
        logger,
      });
    }

    // Preserve isErrorResponse flag and performance metadata from handler result
    return {
      success: true,
      data: responseValidation.data as T["types"]["ResponseOutput"],
      ...(result.isErrorResponse && { isErrorResponse: true as const }),
      ...(result.performance && { performance: result.performance }),
    };
  };
}
