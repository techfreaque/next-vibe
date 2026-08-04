/**
 * Generic Handler Utilities
 * Functions for creating generic handlers from endpoint configurations using unified core logic
 * Handles validation, handler execution, email handling for ALL platforms
 */

import "server-only";

import type { ToolExecutionContext } from "next-vibe/core/execution-context";
import type { NextRequest } from "next-vibe/ui/lib/request";
import type { z } from "zod";

import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";

import type { UserRoleValue } from "../../identity/roles/enum";
import { filterUserPermissionRoles } from "../../identity/roles/enum";
import type { EndpointLogger } from "../../logger/types";
import type { Platform } from "../../platforms/platforms";
import {
  collectServerDefaults,
  generateRoleFilteredRequestSchema,
} from "../../unified-ui/_shared/utils";
import { DEFAULT_ENDPOINT_TIMEOUT_MS } from "../definition/create";
import type { CreateApiEndpointAny } from "../definition/endpoint-base";
import type { CountryLanguage } from "../i18n/core/config";
import type { TranslatedKeyType } from "../i18n/core/scoped-translation";
import type { TParams } from "../i18n/core/static-types";
import { scopedTranslation as sharedScopedTranslation } from "../i18n/shared";
import {
  endpointAccessDenialCode,
  resolveEndpointAccessDenial,
} from "../permissions/denial-message";
import { permissionsRegistry } from "../permissions/registry";
import type { WidgetData } from "../utils/json";
import {
  type MessagingHandlerOptions,
  type MessagingMethodConfig,
  runAfterHandlerMessaging,
} from "./handler-messaging";
import type {
  ChannelResolverField,
  OnRemoteEventField,
  RealtimeHandlerFields,
} from "./handler-realtime";
import type { InferJwtPayloadTypeFromRoles } from "./handler-roles";
import {
  validateHandlerRequestData,
  validateResponseData,
} from "./request-validator";
import {
  ErrorResponseTypes,
  fail,
  type HandlerResponse,
  isContentResponse,
  isFileResponse,
  isStreamingResponse,
} from "./response.schema";
import type { ServerDefaultContext } from "./server-default";

/**
 * API handler props - handlers receive OUTPUT types (validated data)
 */
interface ApiHandlerProps<
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
  toolExecutionContext: ToolExecutionContext;
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
type ApiHandlerFunction<TEndpoint extends CreateApiEndpointAny> = (
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
 * Context passed to `requestDefaults` callbacks.
 * Same shape as ServerDefaultContext — reused for consistency.
 */
export type RequestDefaultsContext = ServerDefaultContext;

/**
 * Pre-parse request defaults callback.
 * Receives raw (pre-validation) request and url params, returns a patch
 * merged into the request data BEFORE Zod validation. The patch wins over
 * whatever the caller provided — use for server-authoritative values (e.g.
 * resolving the active favorite's model for AI-hidden fields where the AI
 * may pass a stale example value).
 */
export type RequestDefaultsFn<TEndpoint extends CreateApiEndpointAny> = (
  ctx: RequestDefaultsContext,
  raw: {
    requestData: Partial<TEndpoint["types"]["RequestInput"]>;
    urlPathParams: Partial<TEndpoint["types"]["UrlVariablesInput"]>;
  },
) =>
  | Promise<Partial<TEndpoint["types"]["RequestInput"]>>
  | Partial<TEndpoint["types"]["RequestInput"]>;

/**
 * Handler configuration for a single method.
 */
export type MethodHandlerConfig<TEndpoint extends CreateApiEndpointAny> = {
  handler: ApiHandlerFunction<TEndpoint>;
  /**
   * Pre-parse defaults. Runs BEFORE Zod validation. The returned patch is
   * merged over the raw request so missing required fields can be filled in
   * (validation catches anything still absent). The patch always wins — use
   * for server-authoritative values like resolving the active favorite's model.
   */
  requestDefaults?: RequestDefaultsFn<TEndpoint>;
  fieldDefaults?: Partial<
    Record<
      keyof TEndpoint["types"]["RequestOutput"] & string,
      (ctx: ServerDefaultContext) => Promise<WidgetData | undefined>
    >
  >;
} & MessagingMethodConfig<TEndpoint> &
  ChannelResolverField<TEndpoint> &
  OnRemoteEventField<TEndpoint>;

export interface ApiHandlerOptions<
  TEndpoint extends CreateApiEndpointAny,
> extends MessagingHandlerOptions<TEndpoint> {
  endpoint: TEndpoint;
  handler: ApiHandlerFunction<TEndpoint>;
  /**
   * Pre-parse defaults. Runs BEFORE Zod validation. The returned patch is
   * merged over the raw request so missing required fields can be filled in
   * (validation catches anything still absent). The patch always wins — use
   * for server-authoritative values like resolving the active favorite's model.
   */
  requestDefaults?: RequestDefaultsFn<TEndpoint>;
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
    toolExecutionContext: ToolExecutionContext;
  }) => Promise<HandlerResponse<TEndpoint["types"]["ResponseOutput"]>>) & {
    /** Pre-parse defaults exposed so dispatchers (e.g. execute-tool remote dispatch)
     *  can apply them at the caller before shipping the call to a peer. */
    requestDefaults?: RequestDefaultsFn<CreateApiEndpointAny>;
    /** Server-side field-default resolvers, exposed so dispatchers (execute-tool
     *  remote dispatch) can pre-resolve caller-context defaults before sending
     *  the call to a peer that lacks the caller's skill/favorite context. The
     *  local execution path resolves these inside createGenericHandler; remote
     *  dispatch resolves them at the caller — same resolvers, same context,
     *  either way ("transport is invisible"). */
    fieldDefaults?: ApiHandlerOptions<TEndpoint>["fieldDefaults"];
  } & RealtimeHandlerFields<TEndpoint>;

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
  const { endpoint, handler, requestDefaults, fieldDefaults } = options;

  const genericHandler: GenericHandlerReturnType<T> = async ({
    data,
    urlPathParams,
    user: providedUser,
    locale,
    logger,
    platform,
    request,
    cronTaskId,
    toolExecutionContext,
  }): Promise<HandlerResponse<T["types"]["ResponseOutput"]>> => {
    // For inline endpoints (`createEndpoint` from create.ts) this resolves to a
    // pass-through that returns the key unchanged - their copy IS the key.
    const { t } = endpoint.scopedTranslation.scopedT(locale);
    const { t: tCredits } = creditsScopedTranslation.scopedT(locale);

    // 1. Authenticate user - call authRepository directly if user not provided
    let user: InferJwtPayloadTypeFromRoles<T["allowedRoles"]>;
    if (providedUser) {
      user = providedUser as InferJwtPayloadTypeFromRoles<T["allowedRoles"]>;
    } else {
      const { AuthRepository } = await import("../../identity/auth/repository");
      const authUser = await AuthRepository.getAuthMinimalUser(
        endpoint.allowedRoles,
        { platform, locale, request },
        logger,
      );

      if (!authUser) {
        // `errorTypes.unauthorized` is the generic ErrorResponseTypes label and
        // renders param-free, so the specific cause gets its own key.
        return fail({
          message: sharedScopedTranslation
            .scopedT(locale)
            .t("errors.authenticationFailed"),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      user = authUser as InferJwtPayloadTypeFromRoles<T["allowedRoles"]>;
    }

    // 2. Validate endpoint access (platform + permissions)
    const accessValidation = permissionsRegistry.validateEndpointAccess(
      endpoint,
      user,
      platform,
    );

    if (!accessValidation.allowed) {
      logger.warn(`[Generic Handler] Endpoint access denied`, {
        routePath: `${endpoint.path.join("/")}/${endpoint.method}`,
        userId: user.isPublic ? "public" : user.id,
        reason: endpointAccessDenialCode(accessValidation.denial),
      });
      return resolveEndpointAccessDenial(accessValidation.denial, locale);
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

    // 3a. Apply pre-parse requestDefaults — runs BEFORE validation so the patch
    // can fill in fields that would otherwise fail required-field checks. The patch
    // wins over whatever the caller provided (e.g. stale AI example values for
    // platform-hidden fields get replaced with server-resolved favorites/skill values).
    let resolvedData = data;
    if (requestDefaults) {
      const defaultsCtx: RequestDefaultsContext = {
        user,
        locale,
        platform,
        toolExecutionContext,
      };
      const patch = await requestDefaults(defaultsCtx, {
        requestData: data as Partial<T["types"]["RequestInput"]>,
        urlPathParams: urlPathParams as Partial<
          T["types"]["UrlVariablesInput"]
        >,
      });
      if (patch && Object.keys(patch).length > 0) {
        resolvedData = { ...data, ...patch } as typeof data;
      }
    }

    const validationResult = validateHandlerRequestData(
      {
        requestSchema: roleFilteredRequestSchema,
        requestUrlPathParamsSchema: endpoint.requestUrlPathParamsSchema,
      },
      {
        method: endpoint.method,
        requestData: resolvedData as z.input<typeof roleFilteredRequestSchema>,
        urlParameters: urlPathParams as z.input<
          typeof endpoint.requestUrlPathParamsSchema
        >,
        locale,
        endpointPath: `${endpoint.path.join("/")}/${endpoint.method}`,
      },
      logger,
      platform,
      endpoint,
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
        toolExecutionContext,
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
      const { CreditRepository } = await import("@/credits/repository");
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
          message: tCredits("errors.insufficientCredits", {
            cost: endpoint.credits,
          }),
          errorType: ErrorResponseTypes.PAYMENT_REQUIRED,
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
          message: tCredits("errors.deductionFailed", {
            cost: endpoint.credits,
          }),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
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
        toolExecutionContext,
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

    await runAfterHandlerMessaging<T>(
      options,
      {
        responseData: responseValidation.data as T["types"]["ResponseOutput"],
        urlPathParams: validationResult.data
          .urlPathParams as T["types"]["UrlVariablesOutput"],
        requestData: validationResult.data
          .requestData as T["types"]["RequestOutput"],
        t,
        locale: validationResult.data.locale,
        user,
      },
      logger,
    );

    // Preserve isErrorResponse flag and performance metadata from handler result
    return {
      success: true,
      data: responseValidation.data as T["types"]["ResponseOutput"],
      ...(result.isErrorResponse && { isErrorResponse: true as const }),
      ...(result.performance && { performance: result.performance }),
    };
  };

  if (requestDefaults) {
    genericHandler.requestDefaults =
      requestDefaults as RequestDefaultsFn<CreateApiEndpointAny>;
  }
  if (fieldDefaults) {
    genericHandler.fieldDefaults = fieldDefaults;
  }

  return genericHandler;
}
