/**
 * Generic Handler Utilities
 * Functions for creating generic handlers from endpoint configurations using unified core logic
 * Handles validation, handler execution, email handling for ALL platforms
 */

import "server-only";

import type { NextRequest } from "next/server";
import {
  ErrorResponseTypes,
  isStreamingResponse,
  type ResponseType,
  type StreamingResponse,
} from "next-vibe/shared/types/response.schema";
import { validateData } from "next-vibe/shared/utils";
import type { z } from "zod";

import { emailHandlingRepository } from "@/app/api/[locale]/v1/core/emails/smtp-client/email-handling/repository";
import type { EmailHandleRequestOutput } from "@/app/api/[locale]/v1/core/emails/smtp-client/email-handling/types";
import { handleSms } from "@/app/api/[locale]/v1/core/sms/handle-sms";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import { authRepository } from "@/app/api/[locale]/v1/core/user/auth/repository";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { Platform } from "../../types/platform";
import type { EndpointLogger } from "../../logger/endpoint";
import type { Methods } from "../../types/enums";
import type { UnifiedField } from "../../types/endpoint";
import { validateHandlerRequestData } from "./request-validator";
import { permissionsRegistry } from "../permissions/registry";
import type { CreateApiEndpoint } from "../definition/create";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
  JWTPublicPayloadType,
} from "@/app/api/[locale]/v1/core/user/auth/types";
import type { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { TFunction } from "@/i18n/core/static-types";
import type { EmailFunctionType } from "@/app/api/[locale]/v1/core/emails/smtp-client/email-handling/types";
import type { SmsFunctionType } from "@/app/api/[locale]/v1/core/sms/utils";

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
 * Type helper for arrays of user roles
 *
 * Logic:
 * - Exclude<TRoles[number], "PUBLIC"> removes "PUBLIC" from the union
 * - If the result is never, then ONLY PUBLIC was in the array → JWTPublicPayloadType
 * - If TRoles[number] includes "PUBLIC" (check with Extract) → JwtPayloadType (mixed)
 * - Otherwise → JwtPrivatePayloadType (no PUBLIC, guaranteed authenticated)
 */
export type InferJwtPayloadTypeFromRoles<
  TRoles extends readonly UserRoleValue[],
> =
  Exclude<TRoles[number], typeof UserRole.PUBLIC> extends never
    ? JWTPublicPayloadType
    : Extract<TRoles[number], typeof UserRole.PUBLIC> extends never
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
  | Promise<ResponseType<TResponseOutput> | StreamingResponse>
  | ResponseType<TResponseOutput>
  | StreamingResponse;

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

/**
 * API handler options - handlers receive OUTPUT types and return OUTPUT types
 *
 * Type parameters with inferred defaults:
 * - TRequestInput/Output: Inferred from endpoint.types.RequestInput/RequestOutput
 * - TResponseInput/Output: Inferred from endpoint.types.ResponseInput/ResponseOutput
 * - TUrlVariablesInput/Output: Inferred from endpoint.types.UrlVariablesInput/UrlVariablesOutput
 */
export interface ApiHandlerOptions<
  TRequestOutput,
  TResponseOutput,
  TUrlVariablesOutput,
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly UserRoleValue[],
  TFields extends UnifiedField<z.ZodTypeAny>,
  TRequestInput = TRequestOutput,
  TResponseInput = TResponseOutput,
  TUrlVariablesInput = TUrlVariablesOutput,
  TPlatform extends Platform = Platform,
> {
  /** API endpoint definition */
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
  >;

  /** Handler function - receives OUTPUT types, returns OUTPUT types */
  handler: ApiHandlerFunction<
    TRequestOutput,
    TResponseOutput,
    TUrlVariablesOutput,
    TUserRoleValue,
    TPlatform
  >;

  /** Email handlers (optional) */
  email?:
    | {
        afterHandlerEmails?: EmailHandler<
          TRequestOutput,
          TResponseOutput,
          TUrlVariablesOutput
        >[];
      }
    | undefined;
  /** SMS handlers (optional) */
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
}) => Promise<ResponseType<TResponseOutput> | StreamingResponse>;

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

/**
 * Create a generic handler for a specific method
 * This is the CORE handler that ALL platforms use
 * Handles: auth, permission checking, validation, business logic execution, email handling
 */
export function createGenericHandler<
  TRequestOutput,
  TResponseOutput,
  TUrlVariablesOutput,
  TExampleKey extends string,
  TMethod extends Methods,
  TUserRoleValue extends readonly UserRoleValue[],
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
): GenericHandlerReturnType<
  TRequestOutput,
  TResponseOutput,
  TUrlVariablesOutput,
  TUserRoleValue
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
  }): Promise<ResponseType<TResponseOutput> | StreamingResponse> => {
    const { t } = simpleT(locale);

    // 1. Authenticate user (if not already provided by platform)
    let user = providedUser;
    if (!user) {
      user = await authRepository.getAuthMinimalUser(
        endpoint.allowedRoles,
        { platform, locale, request },
        logger,
      );
    }

    // 2. Check user permissions
    const hasPermission = permissionsRegistry.hasEndpointPermission(
      endpoint,
      user,
      platform,
    );

    if (!hasPermission) {
      logger.warn(`[Generic Handler] User permission denied`, {
        routePath: `${endpoint.path.join("/")}/${endpoint.method}`,
        userId: user.isPublic ? "public" : user.id,
      });
      return {
        success: false,
        message: ErrorResponseTypes.FORBIDDEN.errorKey,
        errorType: ErrorResponseTypes.FORBIDDEN,
        messageParams: {
          error: "User does not have permission to access this endpoint",
        },
      };
    }

    // 3. Validate request data
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

    // 4. Execute business logic handler
    const result = await handler({
      data: validationResult.data.requestData as TRequestOutput,
      urlPathParams: validationResult.data.urlPathParams as TUrlVariablesOutput,
      user,
      t,
      locale: validationResult.data.locale,
      logger,
      request, // Pass request (undefined for CLI/AI/MCP, NextRequest for Next.js)
      platform,
    });

    // 5. Handle streaming responses - return immediately without email/SMS processing
    if (isStreamingResponse(result)) {
      logger.info("Streaming response detected - returning immediately");
      return result;
    }

    // 6. Return errors without validation (errors are already validated)
    if (!result.success) {
      return result;
    }

    // 7. Validate response data against schema
    const responseValidation = validateData(
      result.data,
      endpoint.responseSchema,
      logger,
    );

    if (!responseValidation.success) {
      logger.error("Response validation failed", {
        error: responseValidation.message,
        messageParams: responseValidation.messageParams,
      });
      return {
        success: false,
        message: "app.api.v1.core.shared.errorTypes.invalid_response_error",
        errorType: ErrorResponseTypes.INVALID_RESPONSE_ERROR,
        messageParams: {
          error: responseValidation.message,
        },
      };
    }

    // 8. Handle email sending if configured
    if (email?.afterHandlerEmails) {
      await emailHandlingRepository.handleEmails<
        TRequestOutput,
        TResponseOutput,
        TUrlVariablesOutput
      >(
        {
          email,
          responseData: responseValidation.data as TResponseOutput,
          urlPathParams: validationResult.data
            .urlPathParams as TUrlVariablesOutput,
          requestData: validationResult.data.requestData as TRequestOutput,
          t,
          locale: validationResult.data.locale,
          user,
        } satisfies EmailHandleRequestOutput<
          TRequestOutput,
          TResponseOutput,
          TUrlVariablesOutput
        >,
        logger,
      );
    }

    // 9. Handle SMS sending if configured
    if (sms?.afterHandlerSms) {
      await handleSms<TRequestOutput, TResponseOutput, TUrlVariablesOutput>({
        sms,
        user,
        responseData: responseValidation.data as TResponseOutput,
        urlPathParams: validationResult.data
          .urlPathParams as TUrlVariablesOutput,
        requestData: validationResult.data.requestData as TRequestOutput,
        t,
        locale: validationResult.data.locale,
        logger,
      });
    }

    // 10. Return validated response
    return {
      success: true,
      data: responseValidation.data as TResponseOutput,
    };
  };
}
