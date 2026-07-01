/**
 * Generic Handler Utilities
 * Functions for creating generic handlers from endpoint configurations using unified core logic
 * Handles validation, handler execution, email handling for ALL platforms
 */

import "server-only";

import { DEFAULT_ENDPOINT_TIMEOUT_MS } from "next-vibe/core/definition/create";
import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type { Platform } from "next-vibe/core/definition/platform";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { TranslatedKeyType } from "next-vibe/core/i18n/core/scoped-translation";
import type { TParams } from "next-vibe/core/i18n/core/static-types";
import { permissionsRegistry } from "next-vibe/core/permissions/registry";
import {
  validateHandlerRequestData,
  validateResponseData,
} from "./request-validator";
import {
  ErrorResponseTypes,
  type HandlerResponse,
  isContentResponse,
  isFileResponse,
  isStreamingResponse,
} from "./response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
  JWTPublicPayloadType,
} from "next-vibe/identity/auth/types";
import type { UserRole, UserRoleValue } from "next-vibe/identity/roles/enum";
import { filterUserPermissionRoles } from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { CacheKeyRequestInput } from "next-vibe/platforms/react/hooks/query-key-builder";
import type { HasClientDeliveredEventsOf } from "next-vibe/realtime/structured-events";
import type { NextRequest } from "next-vibe/ui/web/lib/request";
import {
  collectServerDefaults,
  generateRoleFilteredRequestSchema,
} from "next-vibe/unified-ui/_shared/utils";
import type { z } from "zod";

import { scopedTranslation as sharedScopedTranslation } from "@/app/[locale]/shared/i18n";
import type { ToolExecutionContext } from "@/app/api/[locale]/agent/chat/config";
import { scopedTranslation as creditsScopedTranslation } from "@/app/api/[locale]/credits/i18n";
import type {
  EmailHandler,
  EmailHandleRequestOutput,
} from "@/app/api/[locale]/messenger/providers/email/smtp-client/email-handling/handler";
import type { SmsFunctionType } from "@/app/api/[locale]/sms/utils";

import type { ServerDefaultContext } from "./server-default";

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

/**
 * The channel an endpoint's events ride on, decided per (resource, identity) at
 * runtime — NOT a static convention. Returned by `resolveChannel`.
 *
 *   - `user`     — deliver on / admit to the identity's own `user/{id}` channel.
 *                  The identity IS the authorization boundary; nothing shared.
 *                  Owner-private resources (the caller's own list/thread/skill).
 *   - `resource` — deliver on / admit to the shared `buildWsChannel` channel
 *                  (path + urlPathParams + keyBy requestData). Many identities
 *                  may share it; admission is whatever `resolveChannel` allows.
 *                  Public or shared resources.
 *   - `deny`     — no channel; the subscriber is rejected and the emit is dropped
 *                  for this identity.
 *
 * The resolver returns *intent* (a kind), never a channel string — the framework
 * builds the concrete channel (`buildUserChannel` / `buildWsChannel`) from the
 * kind so emit-side and subscribe-side construct byte-identical channels and
 * cannot drift.
 */
export type ChannelKind = "user" | "resource" | "deny";

/** A channel decision. A discriminated object so future kinds can carry data. */
export interface ChannelDecision {
  readonly kind: ChannelKind;
}

/**
 * Context handed to `resolveChannel`. Carries the exact tuple the channel is
 * keyed on — `urlPathParams` (typed) and `requestData` (the `includeInCacheKey`
 * request fields, typed via CacheKeyRequestData) — so the resolver authorizes
 * against the same identity the channel is built from, with no string parsing.
 *
 * Called in two contexts with the SAME logic:
 *   - emit-side, `user` = the resource owner → picks the delivery channel.
 *   - subscribe-side, `user` = the prospective subscriber → admit iff the
 *     resolved channel equals the one they asked to join.
 */
export type ChannelResolverFn<TEndpoint extends CreateApiEndpointAny> = {
  bivarianceHack(params: {
    user: JwtPayloadType;
    urlPathParams: TEndpoint["types"]["UrlVariablesOutput"];
    requestData: CacheKeyRequestInput<TEndpoint>;
    logger: EndpointLogger;
    locale: CountryLanguage;
  }): Promise<ChannelDecision> | ChannelDecision;
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
 * True when TEndpoint declares at least one CLIENT-DELIVERED event. Delegates to
 * the single source of truth (HasClientDeliveredEventsOf) so the route's
 * resolveChannel obligation and the definition's channel obligation are derived
 * from the same classifier.
 */
type HasClientDeliveredEvents<TEndpoint extends CreateApiEndpointAny> =
  HasClientDeliveredEventsOf<TEndpoint["types"]["Events"]>;

/** The declared channel scope, or undefined when no `channel` is declared. */
type ScopeOf<TEndpoint extends CreateApiEndpointAny> =
  TEndpoint["types"]["Channel"] extends { scope: infer S } ? S : undefined;

/**
 * Forces a readable compile error when an endpoint has client-delivered events
 * but no `channel` declaration on its definition. The route field becomes a
 * branded never-ish requirement that no value satisfies, with the brand string
 * naming the fix.
 */
export interface MissingChannelDeclaration {
  readonly __error: "This method emits client-delivered events but its definition has no `channel` declaration. Add `channel: { scope: 'user' | 'resource' | 'resolved' }` to the definition.";
}

/**
 * Requires `resolveChannel` exactly when the definition's channel scope needs
 * server-side logic, and FORBIDS it when the definition already decided the
 * channel. This is the TYPE-LEVEL enforcement of the fail-closed model — derived
 * from the definition's `channel.scope`, on the emitting method, with no
 * generator round-trip:
 *
 *   scope "user"              → resolveChannel forbidden (definition decided it).
 *   scope "resource"/"resolved" → resolveChannel REQUIRED.
 *   client events, no channel → MissingChannelDeclaration (unsatisfiable → error).
 *   abstract (any)            → optional (keeps GenericHandlerReturnType assignable).
 *
 * `resolveChannel` subsumes the old `canSubscribe`: it both authorizes a
 * subscription AND decides the channel an event rides on, from one declaration,
 * so emit-side delivery and subscribe-side admission can never disagree.
 */
export type ChannelResolverField<TEndpoint extends CreateApiEndpointAny> =
  HasClientDeliveredEvents<TEndpoint> extends true
    ? ScopeOf<TEndpoint> extends "user"
      ? { resolveChannel?: never }
      : ScopeOf<TEndpoint> extends "resource" | "resolved"
        ? { resolveChannel: ChannelResolverFn<TEndpoint> }
        : { resolveChannel: MissingChannelDeclaration }
    : HasClientDeliveredEvents<TEndpoint> extends boolean
      ? { resolveChannel?: ChannelResolverFn<TEndpoint> }
      : { resolveChannel?: never };

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
} & ChannelResolverField<TEndpoint> &
  OnRemoteEventField<TEndpoint>;

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
    // Optional here because this is the runtime-CONSTRUCTED handler type (the
    // dispatcher checks presence at runtime). Author-time exhaustiveness — every
    // method with client-delivered events MUST supply resolveChannel, every
    // declared remoteEvent MUST have a handler — is enforced on the INPUT config
    // via MethodHandlerConfig → ChannelResolverField / OnRemoteEventField.
    resolveChannel?: ChannelResolverFn<TEndpoint>;
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
      const { installFetchCache, setFetchCacheContext } =
        await import("@/app/api/[locale]/agent/ai-stream/testing/fetch-cache");
      // The fetch PATCH must live in THIS (SSR/route-handler) module graph — it is
      // where the relayed AI loop's model/media calls go out. The dev server only
      // installs it in the CLI startup graph, so the SSR graph's global.fetch is
      // otherwise unpatched and the relayed loop runs LIVE (non-deterministic, no
      // fixtures). installFetchCache is per-graph idempotent.
      installFetchCache();
      const fixtureContext = request.headers.get("x-vibe-fixture-context");
      if (fixtureContext) {
        setFetchCacheContext(fixtureContext);
      }
    }

    // 1. Authenticate user - call authRepository directly if user not provided
    let user: InferJwtPayloadTypeFromRoles<T["allowedRoles"]>;
    if (providedUser) {
      user = providedUser as InferJwtPayloadTypeFromRoles<T["allowedRoles"]>;
    } else {
      const { AuthRepository } =
        await import("next-vibe/identity/auth/repository");
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
