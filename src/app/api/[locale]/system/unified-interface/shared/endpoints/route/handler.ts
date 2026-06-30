/**
 * Generic Handler Utilities
 * Functions for creating generic handlers from endpoint configurations using unified core logic
 * Handles validation, handler execution, email handling for ALL platforms
 */

import "server-only";

import type { NextRequest } from "next-vibe-ui/lib/request";
import type { z } from "zod";

import type { ToolExecutionContext } from "@/app/api/[locale]/agent/chat/config";
import { scopedTranslation as creditsScopedTranslation } from "@/app/api/[locale]/credits/i18n";
import type {
  EmailHandler,
  EmailHandleRequestOutput,
} from "@/app/api/[locale]/messenger/providers/email/smtp-client/email-handling/handler";
import { scopedTranslation as sharedScopedTranslation } from "@/app/api/[locale]/shared/i18n";
import {
  ErrorResponseTypes,
  type HandlerResponse,
  isContentResponse,
  isFileResponse,
  isStreamingResponse,
} from "@/app/api/[locale]/shared/types/response.schema";
import type { SmsFunctionType } from "@/app/api/[locale]/sms/utils";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
  JWTPublicPayloadType,
} from "@/app/api/[locale]/user/auth/types";
import type {
  UserRole,
  UserRoleValue,
} from "@/app/api/[locale]/user/user-roles/enum";
import { filterUserPermissionRoles } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TranslatedKeyType } from "@/i18n/core/scoped-translation";
import type { TParams } from "@/i18n/core/static-types";

import type { CacheKeyRequestInput } from "../../../react/hooks/query-key-builder";
import type { HasClientDeliveredEventsOf } from "../../../websocket/structured-events";
import {
  collectServerDefaults,
  generateRoleFilteredRequestSchema,
} from "../../field/utils";
import type { CreateApiEndpointAny } from "../../types/endpoint-base";
import type { WidgetData } from "../../types/json";
import type { Platform } from "../../types/platform";
import type { ServerDefaultContext } from "../../types/server-default";
import { DEFAULT_ENDPOINT_TIMEOUT_MS } from "../definition/create";
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
 * - CLI_OFF, CLI_AUTH_BYPASS, AI_TOOL_OFF, WEB_OFF, MCP_VISIBLE, PRODUCTION_OFF, REMOTE_SKILL
 */
type FilterPlatformMarkers<TRoles extends readonly UserRoleValue[]> = Exclude<
  TRoles[number],
  | typeof UserRole.CLI_OFF
  | typeof UserRole.CLI_AUTH_BYPASS
  | typeof UserRole.AI_TOOL_OFF
  | typeof UserRole.WEB_OFF
  | typeof UserRole.MCP_VISIBLE
  | typeof UserRole.PRODUCTION_OFF
  | typeof UserRole.SKILL_OFF
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
 * SMS handler configuration
 */
export interface SMSHandler<TEndpoint extends CreateApiEndpointAny> {
  readonly ignoreErrors?: boolean;
  readonly render: SmsFunctionType<
    TEndpoint["types"]["RequestOutput"],
    TEndpoint["types"]["ResponseOutput"],
    TEndpoint["types"]["UrlVariablesOutput"],
    TEndpoint["types"]["ScopedTranslationKey"]
  >;
}

/**
 * API handler props - handlers receive OUTPUT types (validated data)
 */
export interface ApiHandlerProps<
  TRequestOutput,
  TUrlVariablesOutput,
  TUserRoleValue extends readonly UserRoleValue[],
  TPlatform extends Platform,
  TScopedTranslationKey extends string,
> {
  /** Request data (validated by Zod schema) */
  data: TRequestOutput;

  /** URL variables (validated by Zod schema) */
  urlPathParams: TUrlVariablesOutput;

  /** Authenticated user - type inferred from endpoint roles */
  user: InferJwtPayloadTypeFromRoles<TUserRoleValue>;

  /** Scoped translation function - keys inferred from endpoint's scopedTranslation */
  t: (key: TScopedTranslationKey, params?: TParams) => TranslatedKeyType;

  /** Locale */
  locale: CountryLanguage;

  /** Platform where the request originated */
  platform: TPlatform;

  /** Logger instance */
  logger: EndpointLogger;

  /** Original request (optional, platform-specific) */
  request?: NextRequest;

  /** Cron task DB ID when executed by the task runner (for lifecycle tracking) */
  cronTaskId?: string;

  /** Stream context - rich metadata about the AI streaming session.
   *  Contains rootFolderId, threadId, aiMessageId, etc.
   *  Populated at every entry point (web, CLI, MCP, cron, AI tool). */
  streamContext: ToolExecutionContext;
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
 * - ContentResponse for mixed content blocks (text + images)
 */
export type ApiHandlerFunction<TEndpoint extends CreateApiEndpointAny> = (
  props: ApiHandlerProps<
    TEndpoint["types"]["RequestOutput"],
    TEndpoint["types"]["UrlVariablesOutput"],
    TEndpoint["allowedRoles"],
    Platform,
    TEndpoint["types"]["ScopedTranslationKey"]
  >,
) =>
  | Promise<HandlerResponse<TEndpoint["types"]["ResponseOutput"]>>
  | HandlerResponse<TEndpoint["types"]["ResponseOutput"]>;

export type CanSubscribeFn<TUrlVariables> = {
  bivarianceHack(params: {
    user: JwtPayloadType;
    urlPathParams: TUrlVariables;
    logger: EndpointLogger;
    locale: CountryLanguage;
  }): Promise<boolean> | boolean;
}["bivarianceHack"];

/**
 * Context passed to onRemoteEvent handlers — the non-data fields.
 * urlPathParams has been moved into the per-handler props (typed per-event).
 *
 * `user` is `JwtPrivatePayloadType` — a remote event is always a server-to-server
 * dispatch on behalf of an AUTHENTICATED user. The dispatch path enforces this:
 * a non-authenticated origin is rejected before any handler runs.
 */
export interface RemoteEventContext {
  readonly instanceId: string;
  readonly user: JwtPrivatePayloadType;
  readonly locale: CountryLanguage;
  readonly logger: EndpointLogger;
  readonly isServer: true;
}

type NeverToUndefined<T> = [T] extends [never] ? undefined : T;

/** Props passed to each onRemoteEvent handler. K narrows requestData/responseData to the event's payload. */
export interface RemoteEventHandlerProps<
  TEndpoint extends CreateApiEndpointAny,
  K extends keyof TEndpoint["types"]["Events"] =
    keyof TEndpoint["types"]["Events"],
> {
  readonly responseData: NeverToUndefined<
    TEndpoint["types"]["EventResponsePayloads"][K &
      keyof TEndpoint["types"]["EventResponsePayloads"]]
  >;
  readonly requestData: NeverToUndefined<
    TEndpoint["types"]["EventRequestPayloads"][K &
      keyof TEndpoint["types"]["EventRequestPayloads"]]
  >;
  readonly urlPathParams: NeverToUndefined<
    TEndpoint["types"]["EventUrlPayloads"][K &
      keyof TEndpoint["types"]["EventUrlPayloads"]]
  >;
  readonly payload: NeverToUndefined<
    TEndpoint["types"]["EventPayloadTypes"][K &
      keyof TEndpoint["types"]["EventPayloadTypes"]]
  >;
  readonly instanceId: string;
  readonly user: JwtPrivatePayloadType;
  readonly locale: CountryLanguage;
  readonly logger: EndpointLogger;
  readonly isServer: true;
}

/**
 * Map of server-side remote event handlers, keyed by event name.
 * Only events declared with `remoteEvent: true` on the definition are valid keys.
 */
export type OnRemoteEventMap<TEndpoint extends CreateApiEndpointAny> = {
  [K in keyof TEndpoint["types"]["Events"] as TEndpoint["types"]["Events"][K] extends {
    remoteEvent: true;
  }
    ? K
    : never]: (
    props: RemoteEventHandlerProps<
      TEndpoint,
      K & keyof TEndpoint["types"]["Events"]
    >,
  ) => Promise<void> | void;
};

/** Convenience alias — use this in repository files to type `onRemoteEvent` exports. */
export type EndpointOnRemoteEventMap<TEndpoint extends CreateApiEndpointAny> =
  OnRemoteEventMap<TEndpoint>;

type _IsAnyEvents<T> = 0 extends 1 & T ? true : false;

/** True when TEndpoint has at least one remoteEvent: true event. */
type HasRemoteEvents<TEndpoint extends CreateApiEndpointAny> =
  _IsAnyEvents<TEndpoint["types"]["Events"]> extends true
    ? boolean
    : keyof {
          [K in keyof TEndpoint["types"]["Events"] as TEndpoint["types"]["Events"][K] extends {
            remoteEvent: true;
          }
            ? K
            : never]: true;
        } extends never
      ? false
      : true;

/** Requires onRemoteEvent when the endpoint declares remoteEvent: true events; forbids it otherwise. */
export type OnRemoteEventField<TEndpoint extends CreateApiEndpointAny> =
  HasRemoteEvents<TEndpoint> extends true
    ? { onRemoteEvent: OnRemoteEventMap<TEndpoint> }
    : HasRemoteEvents<TEndpoint> extends boolean
      ? { onRemoteEvent?: OnRemoteEventMap<TEndpoint> }
      : { onRemoteEvent?: never };

/**
 * Handler configuration for a single method.
 */
export type MethodHandlerConfig<TEndpoint extends CreateApiEndpointAny> = {
  handler: ApiHandlerFunction<TEndpoint>;
  email?: EmailHandler<TEndpoint>[];
  sms?: SMSHandler<TEndpoint>[];
  fieldDefaults?: Partial<
    Record<
      keyof TEndpoint["types"]["RequestOutput"] & string,
      (ctx: ServerDefaultContext) => Promise<WidgetData | undefined>
    >
  >;
  canSubscribe?: CanSubscribeFn<TEndpoint["types"]["UrlVariablesOutput"]>;
} & OnRemoteEventField<TEndpoint>;

export interface ApiHandlerOptions<TEndpoint extends CreateApiEndpointAny> {
  endpoint: TEndpoint;
  handler: ApiHandlerFunction<TEndpoint>;
  email?:
    | {
        afterHandlerEmails?: EmailHandler<TEndpoint>[];
      }
    | undefined;
  sms?: {
    afterHandlerSms?: SMSHandler<TEndpoint>[];
  };
  /**
   * Server-side field defaults for fields hidden from this platform.
   * Runs after validation, before the handler. Values from here take precedence
   * over any `serverDefault` declared on the definition field.
   * Keyed by request field name. Only fires if the field is absent in the validated data.
   */
  fieldDefaults?: Partial<
    Record<
      keyof TEndpoint["types"]["RequestOutput"] & string,
      (ctx: ServerDefaultContext) => Promise<WidgetData | undefined>
    >
  >;
}

export type GenericHandlerReturnType<TEndpoint extends CreateApiEndpointAny> =
  ((props: {
    data: TEndpoint["types"]["RequestOutput"];
    urlPathParams: TEndpoint["types"]["UrlVariablesOutput"];
    user?: InferJwtPayloadTypeFromRoles<TEndpoint["types"]["UserRoleValue"]>; // Optional: if provided, skip auth; if not, do auth
    locale: CountryLanguage;
    logger: EndpointLogger;
    platform: Platform;
    request?: NextRequest; // Optional NextRequest for Next.js platform
    cronTaskId?: string; // Cron task DB ID when executed by the task runner
    streamContext: ToolExecutionContext;
  }) => Promise<HandlerResponse<TEndpoint["types"]["ResponseOutput"]>>) & {
    canSubscribe?: CanSubscribeFn<TEndpoint["types"]["UrlVariablesOutput"]>;
    // Optional here because this is the runtime-CONSTRUCTED handler type (the
    // dispatcher checks presence at runtime). Author-time exhaustiveness — every
    // remoteEvent the definition declares MUST have a handler — is enforced on the
    // INPUT config via MethodHandlerConfig → OnRemoteEventField, which makes each
    // declared remoteEvent a required key of onRemoteEvent.
    onRemoteEvent?: OnRemoteEventMap<TEndpoint>;
  };

/**
 * Base type for generic handlers when exact types are not known
 * Used for dynamic handler loading where specific types cannot be inferred
 *
 * This type represents the structural shape of a handler function without
 * constraining the specific types, allowing handlers with different specific
 * types to be stored together while maintaining type safety at the call site.
 */
export type GenericHandlerBase = GenericHandlerReturnType<CreateApiEndpointAny>;

function makeTimeoutRace<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`Handler timeout after ${String(ms)}ms`)),
      ms,
    );
    void promise.then(
      (v) => {
        clearTimeout(timer);
        return resolve(v);
      },
      (e: Error) => {
        clearTimeout(timer);
        return reject(e);
      },
    );
  });
}

export function createGenericHandler<T extends CreateApiEndpointAny>(
  options: ApiHandlerOptions<T>,
): GenericHandlerReturnType<T> {
  const { endpoint, handler, email, sms, fieldDefaults } = options;

  return async ({
    data,
    urlPathParams,
    user: providedUser,
    locale,
    logger,
    platform,
    request,
    cronTaskId,
    streamContext,
  }): Promise<HandlerResponse<T["types"]["ResponseOutput"]>> => {
    const { t } = endpoint.scopedTranslation.scopedT(locale);
    const { t: tCredits } = creditsScopedTranslation.scopedT(locale);

    // Fixture-mode servers scope external-call recordings per test context.
    // Relay callers send their context so both sides record/replay the same
    // per-context sequences.
    if (process.env["VIBE_FIXTURE_MODE"] === "true" && request) {
      const fixtureContext = request.headers.get("x-vibe-fixture-context");
      if (fixtureContext) {
        const { setFetchCacheContext } =
          await import("@/app/api/[locale]/agent/ai-stream/testing/fetch-cache");
        setFetchCacheContext(fixtureContext);
      }
    }

    // 1. Authenticate user - call authRepository directly if user not provided
    let user: InferJwtPayloadTypeFromRoles<T["allowedRoles"]>;
    if (providedUser) {
      user = providedUser as InferJwtPayloadTypeFromRoles<T["allowedRoles"]>;
    } else {
      const { AuthRepository } =
        await import("@/app/api/[locale]/user/auth/repository");
      const authUser = await AuthRepository.getAuthMinimalUser(
        endpoint.allowedRoles,
        { platform, locale, request },
        logger,
      );

      if (!authUser) {
        return {
          success: false,
          message: sharedScopedTranslation
            .scopedT(locale)
            .t("errorTypes.unauthorized"),
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
    // Build a role- and platform-filtered schema so fields gated by `visibleFor`
    // or `hiddenForPlatforms` are stripped - schema-level security guarantee.
    const permissionRoles = filterUserPermissionRoles(user.roles);
    const roleFilteredRequestSchema = generateRoleFilteredRequestSchema(
      endpoint.fields,
      permissionRoles,
      platform,
    );
    const validationResult = validateHandlerRequestData(
      {
        requestSchema: roleFilteredRequestSchema,
        requestUrlPathParamsSchema: endpoint.requestUrlPathParamsSchema,
      },
      {
        method: endpoint.method,
        requestData: data as z.input<typeof roleFilteredRequestSchema>,
        urlParameters: urlPathParams as z.input<
          typeof endpoint.requestUrlPathParamsSchema
        >,
        locale,
        endpointPath: `${endpoint.path.join("/")}/${endpoint.method}`,
      },
      logger,
      platform,
    );

    if (!validationResult.success) {
      return validationResult;
    }

    // 3b. Apply field-level server defaults for hidden fields.
    // Route-provided fieldDefaults take precedence over definition-level serverDefault.
    const definitionDefaults = collectServerDefaults(
      endpoint.fields,
      permissionRoles,
      platform,
    );
    const mergedDefaults = { ...definitionDefaults, ...fieldDefaults };
    if (Object.keys(mergedDefaults).length > 0) {
      const reqData = validationResult.data.requestData as Record<
        string,
        string | number | boolean | null | undefined
      >;
      const defaultCtx: ServerDefaultContext = {
        user,
        locale,
        platform,
        streamContext,
      };
      for (const [key, resolver] of Object.entries(mergedDefaults)) {
        if (reqData[key] === undefined && resolver) {
          const resolved = await resolver(defaultCtx);
          if (resolved !== undefined) {
            reqData[key] = resolved as string | number | boolean | null;
          }
        }
      }
    }

    // 4. Check and deduct credits if endpoint has credit cost
    if (endpoint.credits && endpoint.credits > 0) {
      const { CreditRepository } =
        await import("@/app/api/[locale]/credits/repository");
      const hasSufficient = await CreditRepository.hasSufficientCredits(
        user,
        endpoint.credits,
        logger,
        tCredits,
        locale,
      );

      if (!hasSufficient) {
        logger.warn("Insufficient credits for endpoint", {
          routePath: `${endpoint.path.join("/")}/${endpoint.method}`,
          userId: user.isPublic ? "public" : user.id,
          cost: endpoint.credits,
        });
        return {
          success: false,
          message: tCredits("errors.insufficientCredits"),
          errorType: ErrorResponseTypes.PAYMENT_REQUIRED,
          messageParams: { cost: endpoint.credits },
        };
      }

      const deductResult = await CreditRepository.deductCreditsForFeature(
        user,
        endpoint.credits,
        t(endpoint.title),
        logger,
        tCredits,
        locale,
      );

      if (!deductResult.success) {
        logger.error("Failed to deduct credits for endpoint", {
          routePath: `${endpoint.path.join("/")}/${endpoint.method}`,
          userId: user.isPublic ? "public" : user.id,
          cost: endpoint.credits,
        });
        return {
          success: false,
          message: tCredits("errors.deductionFailed"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: { cost: endpoint.credits },
        };
      }
    }

    const effectiveTimeoutMs =
      endpoint.timeoutMs === 0
        ? null // explicit 0 = no timeout
        : (endpoint.timeoutMs ?? DEFAULT_ENDPOINT_TIMEOUT_MS);

    const handlerPromise: Promise<
      HandlerResponse<T["types"]["ResponseOutput"]>
    > = Promise.resolve(
      handler({
        data: validationResult.data.requestData as T["types"]["RequestOutput"],
        urlPathParams: validationResult.data
          .urlPathParams as T["types"]["UrlVariablesOutput"],
        user,
        t,
        locale: validationResult.data.locale,
        logger,
        request,
        platform,
        cronTaskId,
        streamContext,
      }),
    );

    const raced =
      effectiveTimeoutMs !== null
        ? makeTimeoutRace(handlerPromise, effectiveTimeoutMs)
        : handlerPromise;

    const result = await raced.catch((err: Error) => {
      logger.error("[Generic Handler] Handler timed out or threw", {
        routePath: `${endpoint.path.join("/")}/${endpoint.method}`,
        timeoutMs: effectiveTimeoutMs,
        error: err.message,
      });
      return {
        success: false as const,
        message: sharedScopedTranslation
          .scopedT(validationResult.data.locale)
          .t("errorTypes.internal_error"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      };
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

    // 6b. Handle content responses - return immediately without email/SMS processing
    if (isContentResponse(result)) {
      logger.debug("Content response detected - returning immediately");
      return result;
    }

    // 7. Return errors without validation (errors are already validated)
    if (!result.success) {
      return result;
    }

    // 7. Validate response data using request validator
    const responseValidation = validateResponseData<
      T["types"]["ResponseOutput"]
    >(
      result.data,
      endpoint.responseSchema,
      logger,
      locale,
      platform,
      `${endpoint.path.join("/")}/${endpoint.method}`,
    );

    if (!responseValidation.success) {
      return responseValidation;
    }

    if (email?.afterHandlerEmails) {
      const { EmailHandlingRepository } =
        await import("@/app/api/[locale]/messenger/providers/email/smtp-client/email-handling/repository");
      await EmailHandlingRepository.handleEmails<T>(
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
        } satisfies EmailHandleRequestOutput<T>,
        logger,
      );
    }

    if (sms?.afterHandlerSms) {
      const { handleSms } = await import("@/app/api/[locale]/sms/handle-sms");
      await handleSms<T>({
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
