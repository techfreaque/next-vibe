/**
 * CLI Route Executor
 * Thin adapter that parses CLI input and delegates to central executor
 * Handles CLI-specific concerns: argument parsing, interactive forms, output formatting
 */

import { makeHeadlessContext } from "next-vibe/agent/chat/config";
import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import {
  definitionLoader,
  type IDefinitionLoader,
} from "next-vibe/core/definition/loader";
import { Platform } from "next-vibe/core/definition/platform";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { TranslatedKeyType } from "next-vibe/core/i18n/core/scoped-translation";
import type { TParams } from "next-vibe/core/i18n/core/static-types";
import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import { parseError } from "next-vibe/core/utils/parse-error";
import { TOOL_HELP_ALIAS } from "next-vibe/help-tool/constants";
import type {
  JwtPayloadType,
  JWTPublicPayloadType,
} from "next-vibe/identity/auth/types";
import {
  filterPlatformMarkers,
  PlatformMarker,
  UserPermissionRole,
} from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";
import { createCliBypassUser } from "next-vibe/platforms/cli/auth/cli-bypass-user";
import type { getCliUser } from "next-vibe/platforms/cli/auth/cli-user";
import { scopedTranslation as cliScopedTranslation } from "next-vibe/platforms/cli/i18n";
import {
  CliTarget,
  type CliTargetValue,
} from "next-vibe/platforms/cli/types/cli-target";
import type { CliResultFormatter as CliResultFormatterType } from "next-vibe/unified-ui/renderers/cli/response/result-formatter";

import { AUTH_TOKEN_COOKIE_NAME, LEAD_ID_COOKIE_NAME } from "@/env/constants";
import { getEndpoint } from "@/generated/endpoints/endpoint";

import { CliInputParser } from "./parsing";

// Lazy-loaded: only needed for MCP + non-bypass paths, not for normal `vibe c`
let _getCliUser: typeof getCliUser | null = null;
async function loadGetCliUser(): Promise<typeof getCliUser> {
  if (!_getCliUser) {
    _getCliUser = (await import("next-vibe/platforms/cli/auth/cli-user"))
      .getCliUser;
  }
  return _getCliUser;
}

// Lazy-loaded to avoid pulling in ~50 Ink widget modules at startup (~120ms)
let _resultFormatter: typeof CliResultFormatterType | null = null;
async function getResultFormatter(): Promise<typeof CliResultFormatterType> {
  if (!_resultFormatter) {
    const mod =
      await import("next-vibe/unified-ui/renderers/cli/response/result-formatter");
    _resultFormatter = mod.CliResultFormatter;
  }
  return _resultFormatter;
}

interface CliResponseData {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | undefined
    | CliResponseData
    | CliResponseData[];
}

/**
 * Unwrap execute-tool's local-WAIT response shape into the raw endpoint data the
 * CLI formatter expects. runInProcess wraps success as `{ result: <data> }` for
 * MCP/AI rendering; CLI needs `<data>` flat. isErrorResponse / performance ride
 * through on the response options (CLI uses them for exit codes + the summary).
 */
function unwrapExecuteToolResult(
  raw: ResponseType<WidgetData>,
): ResponseType<CliResponseData> {
  if (!raw.success) {
    return raw as ResponseType<CliResponseData>;
  }
  const wrapped = raw.data;
  const data: CliResponseData =
    wrapped !== null &&
    typeof wrapped === "object" &&
    !Array.isArray(wrapped) &&
    "result" in wrapped
      ? ((wrapped as { result: WidgetData })["result"] as CliResponseData)
      : (wrapped as CliResponseData);
  return success(data, {
    ...(raw.isErrorResponse && { isErrorResponse: true }),
    ...(raw.performance && { performance: raw.performance }),
  });
}

/** CLI-compatible platforms for type assertions */
export type CliCompatiblePlatform =
  | typeof Platform.CLI
  | typeof Platform.CLI_PACKAGE
  | typeof Platform.MCP;

/**
 * Route execution result
 * Extends BaseExecutionResult with CLI-specific fields
 */
export interface RouteExecutionResult {
  success: boolean;
  /** CLI response data */
  data?: CliResponseData;

  /** Error message */
  error?: TranslatedKeyType;

  /** Error parameters for translation */
  errorParams?: TParams;

  /** Original input data provided by the user (for --interactive hint pre-fill) */
  inputData?: Record<string, WidgetData>;

  /** CLI-specific metadata */
  metadata?: {
    executionTime: number;
    endpointPath: string;
    method?: string;
    route?: string;
    resolvedCommand?: string;
  };

  /** Performance metadata from route execution (translation keys as keys) */
  performance?: Partial<Record<TranslatedKeyType, number>>;

  /** Time spent loading the endpoint definition + route handler (ms) */
  endpointLoadMs?: number;

  /** Time spent rendering the result (ms) */
  renderMs?: number;

  /** Error cause chain for debugging - reuses ErrorResponseType */
  cause?: ErrorResponseType;

  /** Formatted output string ready for display */
  formattedOutput?: string;

  /**
   * Indicates that RouteDelegationHandler is a logical error response (e.g., operation failed)
   * even though success: true was returned. Used for CLI exit code handling.
   */
  isErrorResponse?: true;
}

/**
 * CLI execution options interface
 */
interface CliExecutionOptions {
  data: Record<string, WidgetData> | undefined;
  urlPathParams:
    | Record<string, string | number | boolean | null | undefined>
    | undefined;
  cliArgs: {
    positionalArgs: string[];
    namedArgs: Record<string, WidgetData>;
    rawTokens?: string[];
  };
  locale: CountryLanguage;
  /**
   * Platform reported to the handler. Normally a CLI variant, but `--platform`
   * may override it to any Platform (e.g. `ai`, `mcp`) for surface inspection.
   * Auth still resolves the real CLI user; only the reported platform changes.
   */
  platform: Platform;
  dryRun: boolean | undefined;
  interactive: boolean | undefined;
  /** Enable file-based IPC for AI agent control (frame capture + key injection) */
  agentControl: boolean | undefined;
  verbose: boolean | undefined;
  output: "json" | "pretty" | undefined;
  /** Execution target: dev, local, or remote */
  cliTarget: CliTargetValue;
  /** Remote URL when cliTarget === REMOTE */
  remoteUrl?: string;
  /** Optional abort signal (e.g. from SIGINT) to cancel long-running commands */
  signal: AbortSignal;
}

/**
 * CLI Route Executor
 * Thin adapter: parses CLI input → calls central executor → formats CLI output
 */
export class RouteDelegationHandler {
  /**
   * Execute a route - main entry point
   */
  public static async executeRoute(
    command: string,
    options: CliExecutionOptions,
    logger: EndpointLogger,
    loader: IDefinitionLoader = definitionLoader,
  ): Promise<RouteExecutionResult> {
    const startTime = Date.now();

    // Default to interactive mode if no command provided
    const resolvedCommand = command || `${TOOL_HELP_ALIAS} --interactive`;

    try {
      // Load route handler first - route.ts imports definition.ts transitively,
      // so after this resolves, definition.ts is already in Bun's module cache.
      // getEndpoint() then returns near-instantly with no TDZ risk.
      logger.debug("[ROUTE] endpoint load start");
      const endpointLoadStart = Date.now();
      const { getRouteHandler } = await import("@/generated/routes/handlers");
      const routeHandler = await getRouteHandler(resolvedCommand);
      const peekedEndpoint = await getEndpoint(resolvedCommand);
      const endpointLoadMs = Date.now() - endpointLoadStart;
      logger.debug(`[ROUTE] endpoint loaded (${endpointLoadMs}ms)`);

      // Get CLI user for authentication if not provided.
      // If the endpoint has CLI_AUTH_BYPASS, try to load the real admin user from env/session.
      // Fall back to a synthetic admin only if the real user can't be loaded, or for
      // performance-critical routes (vibe check / vibe c) that run on every keystroke.
      let cliUser: JwtPayloadType;
      const isCliAuthBypass =
        peekedEndpoint !== null &&
        peekedEndpoint !== undefined &&
        filterPlatformMarkers(peekedEndpoint.allowedRoles).includes(
          PlatformMarker.CLI_AUTH_BYPASS,
        );

      // vibe check (c / check) skips DB for performance - it runs constantly during dev
      const isVibeCheckRoute =
        resolvedCommand.startsWith("c ") ||
        resolvedCommand === "c" ||
        resolvedCommand.startsWith("check ") ||
        resolvedCommand === "check";

      if (
        isCliAuthBypass &&
        isVibeCheckRoute &&
        options.platform !== Platform.MCP &&
        options.cliTarget !== CliTarget.REMOTE
      ) {
        // Performance path: vibe check never touches the DB
        cliUser = createCliBypassUser();
      } else if (
        isCliAuthBypass &&
        options.platform !== Platform.MCP &&
        options.cliTarget !== CliTarget.REMOTE
      ) {
        // CLI / CLI_PACKAGE with CLI_AUTH_BYPASS: try real admin user, fall back to bypass
        const cliUserResult = await (
          await loadGetCliUser()
        )(logger, options.locale);
        cliUser = cliUserResult.success
          ? cliUserResult.data
          : createCliBypassUser();
      } else if (
        isCliAuthBypass &&
        options.platform === Platform.MCP &&
        options.cliTarget !== CliTarget.REMOTE
      ) {
        // MCP with CLI_AUTH_BYPASS: try DB/session for a real user, fall back to bypass
        const cliUserResult = await (
          await loadGetCliUser()
        )(logger, options.locale);
        cliUser =
          cliUserResult.success && !cliUserResult.data.isPublic
            ? cliUserResult.data
            : createCliBypassUser();
      } else {
        const cliUserResult = await (
          await loadGetCliUser()
        )(logger, options.locale);

        if (cliUserResult.success) {
          cliUser = cliUserResult.data;
        } else {
          logger.debug("Failed to get CLI user", cliUserResult);
          cliUser = {
            isPublic: true,
            leadId: "temp-for-loading",
            roles: [UserPermissionRole.PUBLIC],
          } satisfies JWTPublicPayloadType;
        }
      }

      // Get endpoint definition for CLI-specific features (interactive forms, arg parsing)
      // For remote execution, skip access validation - the remote server handles its own auth
      const endpointResult = await loader.load<CreateApiEndpointAny>({
        identifier: resolvedCommand,
        platform: options.platform,
        user: cliUser,
        logger,
        locale: options.locale,
        skipAccessValidation: options.cliTarget === CliTarget.REMOTE,
      });
      const endpoint = endpointResult.success ? endpointResult.data : null;

      // Interactive mode: Use Ink terminal UI
      if (options.interactive && endpoint) {
        const { renderInkEndpointPage } =
          await import("next-vibe/unified-ui/renderers/cli/CliEndpointPage");

        // Collect CLI input data first (parse args, but no interactive prompts)
        const inputData = await CliInputParser.collectCliRequestData(
          endpoint,
          {
            data: options.data || {},
            urlPathParams: options.urlPathParams,
            positionalArgs: options.cliArgs?.positionalArgs ?? [],
            namedArgs: options.cliArgs?.namedArgs ?? [],
            rawTokens: options.cliArgs?.rawTokens,
            interactive: false,
            dryRun: options.dryRun ?? false,
          },
          logger,
        );

        // Render interactive Ink UI - waits until user exits
        // EndpointsPage handles submission internally via useEndpoint
        await renderInkEndpointPage({
          endpoint: { [endpoint.method]: endpoint },
          locale: options.locale,
          user: cliUser,
          debug: options.verbose || false,
          initialData: inputData.data,
          agentControl: options.agentControl || false,
        });

        // Ink handled all rendering - return empty output
        return {
          success: true,
          data: undefined,
          metadata: {
            executionTime: Date.now() - startTime,
            endpointPath: resolvedCommand,
            method: endpoint.method,
            resolvedCommand,
          },
          formattedOutput: "",
        };
      }

      // CLI-specific: Collect input data (parse CLI args, interactive forms)
      const inputData = await CliInputParser.collectCliRequestData(
        endpoint,
        {
          data: options.data || {},
          urlPathParams: options.urlPathParams,
          positionalArgs: options.cliArgs?.positionalArgs ?? [],
          namedArgs: options.cliArgs?.namedArgs ?? [],
          rawTokens: options.cliArgs?.rawTokens,
          interactive: false, // Non-interactive mode - args only
          dryRun: options.dryRun ?? false,
        },
        logger,
      );

      // CLI-specific: Handle dry run
      if (options.dryRun) {
        logger.info("🔍 Dry run - would execute with:");
        logger.info(
          JSON.stringify(
            { data: inputData.data, urlPathParams: inputData.urlPathParams },
            null,
            2,
          ),
        );
        const dryRunData: CliResponseData = Object.assign(
          { dryRun: true } as CliResponseData,
          inputData.data || {},
          inputData.urlPathParams
            ? { urlPathParams: inputData.urlPathParams }
            : {},
        );
        return {
          success: true,
          data: dryRunData,
          metadata: {
            executionTime: Date.now() - startTime,
            endpointPath: resolvedCommand,
            resolvedCommand,
          },
        };
      }

      // Remote execution: transport-aware dispatch
      if (
        options.cliTarget === CliTarget.REMOTE &&
        options.remoteUrl &&
        endpoint
      ) {
        const remoteResult = await executeRemoteEndpoint({
          endpoint,
          data: inputData.data || {},
          urlPathParams: inputData.urlPathParams,
          locale: options.locale,
          logger,
          remoteUrl: options.remoteUrl,
          userId: !cliUser.isPublic && cliUser.id ? cliUser.id : undefined,
          user: cliUser,
          signal: options.signal,
          platform: options.platform,
        });

        const routeResult: RouteExecutionResult = {
          success: remoteResult.success,
          data: remoteResult.success
            ? (remoteResult.data as CliResponseData)
            : undefined,
          error: remoteResult.success ? undefined : remoteResult.message,
          errorParams: remoteResult.success
            ? undefined
            : remoteResult.messageParams,
          metadata: {
            executionTime: Date.now() - startTime,
            endpointPath: resolvedCommand,
            method: endpoint.method,
            resolvedCommand,
          },
        };

        const { output: formattedOutput, renderMs } = await (
          await getResultFormatter()
        ).formatResult(
          routeResult,
          options.output || "pretty",
          options.locale,
          options.verbose || false,
          logger,
          endpoint,
          cliUser,
          inputData.data,
        );

        return { ...routeResult, formattedOutput, renderMs };
      }

      // CLI-specific: Show execution info if verbose
      if (options.verbose) {
        logger.debug(
          `[ROUTE] executing: ${resolvedCommand} data=${JSON.stringify(inputData.data)}`,
        );
        if (
          inputData.urlPathParams &&
          Object.keys(inputData.urlPathParams).length > 0
        ) {
          logger.info(
            `URL Params: ${JSON.stringify(inputData.urlPathParams, null, 2)}`,
          );
        }
      }

      // Delegate to the unified execute-tool repository — the single dispatch
      // path (permission cascade, folder restrictions, confirmation gate) shared
      // with AI/MCP/remote. CLI keeps its own concerns: arg parsing (pre-split
      // urlPathParams), handler reuse (preloadedHandler), and output formatting.
      const { RouteExecuteRepository } =
        await import("next-vibe/execute-tool/repository");
      const rawResult = await RouteExecuteRepository.runInProcess({
        toolName: resolvedCommand,
        input: inputData.data || {},
        urlPathParams: inputData.urlPathParams || {},
        callbackMode: "wait",
        user: cliUser,
        locale: options.locale,
        logger,
        platform: options.platform,
        preloadedHandler: routeHandler,
        // no user context — UTC (dates not user-facing here)
        streamContext: makeHeadlessContext(options.signal, undefined, "UTC"),
      });
      // runInProcess wraps inline WAIT success as { result: <data> } for MCP/AI
      // display. CLI formatting needs the raw endpoint data — unwrap it.
      const result: ResponseType<CliResponseData> =
        unwrapExecuteToolResult(rawResult);

      // 7. Convert ResponseType to RouteExecutionResult
      const routeResult: RouteExecutionResult = {
        success: result.success,
        data: result.success ? result.data : undefined,
        error: result.success ? undefined : result.message,
        errorParams: result.success ? undefined : result.messageParams,
        inputData: result.success ? undefined : inputData.data,
        metadata: {
          executionTime: Date.now() - startTime,
          endpointPath: resolvedCommand,
          method: "",
          resolvedCommand,
        },
        // Pass through isErrorResponse from API response for CLI exit code handling
        // Note: isErrorResponse can be true even when result.success is true (e.g., vibe check found errors)
        isErrorResponse:
          "isErrorResponse" in result && result.isErrorResponse
            ? true
            : undefined,
        // Pass through performance metadata from API response for execution summary
        performance:
          "performance" in result && result.performance
            ? result.performance
            : undefined,
        endpointLoadMs,
      };

      // Format result for CLI output
      const { output: formattedOutput, renderMs } = await (
        await getResultFormatter()
      ).formatResult(
        routeResult,
        options.output || "pretty",
        options.locale,
        options.verbose || false,
        logger,
        endpoint,
        cliUser,
        inputData.data,
      );

      // Return result with formatted output and render timing
      return {
        ...routeResult,
        formattedOutput,
        renderMs,
      };
    } catch (error) {
      logger.error("Command execution failed", {
        command: resolvedCommand,
        error: parseError(error),
      });
      const { t } = cliScopedTranslation.scopedT(options.locale);
      const errorResult: RouteExecutionResult = {
        success: false,
        error: t("vibe.errors.executionFailed"),
        errorParams: {
          error: parseError(error).message,
        },
        metadata: {
          executionTime: Date.now() - startTime,
          endpointPath: resolvedCommand,
          method: "",
        },
      };

      return {
        ...errorResult,
        formattedOutput: "",
      };
    }
  }
}

// ── Remote endpoint execution ──────────────────────────────────────────────────
//
// Login/logout use raw fetch to access Set-Cookie headers.
// Everything else goes through RouteExecuteRepository.runInProcess with the instanceId
// from the DB session, which handles direct-http and reverse-ws transports uniformly.

const LOGIN_PATH = "user/public/login";
const LOGOUT_PATH = "user/auth/logout";

interface RemoteEndpointResponse {
  success: boolean;
  data?: Record<
    string,
    | string
    | number
    | boolean
    | null
    | Record<string, string | number | boolean | null>
    | Record<string, string | number | boolean | null>[]
  >;
  message?: string;
  errorType?: string;
  messageParams?: Record<string, string>;
}

async function executeRemoteEndpoint(params: {
  endpoint: CreateApiEndpointAny;
  data: Record<string, WidgetData>;
  urlPathParams?: Record<string, string | number | boolean | null | undefined>;
  locale: CountryLanguage;
  logger: EndpointLogger;
  remoteUrl: string;
  userId: string | undefined;
  user: JwtPayloadType;
  signal: AbortSignal;
  platform: Platform;
}): Promise<ResponseType<WidgetData>> {
  const {
    endpoint,
    data,
    urlPathParams,
    locale,
    logger,
    remoteUrl,
    userId,
    user,
    signal,
    platform,
  } = params;
  const { scopedTranslation: cliT } =
    await import("next-vibe/platforms/cli/i18n");
  const { t } = cliT.scopedT(locale);

  const endpointPath = endpoint.path.join("/");
  const isLoginEndpoint = endpointPath === LOGIN_PATH;
  const isLogoutEndpoint = endpointPath === LOGOUT_PATH;

  const { getRemoteSession } =
    await import("next-vibe/platforms/cli/auth/remote-session-cache");
  const { Methods } = await import("next-vibe/core/definition/enums");
  const { BEARER_LEAD_ID_SEPARATOR } = await import("@/env/constants");

  // Resolve session from DB
  let resolvedToken: string | null = null;
  let resolvedLeadId: string | null = null;
  let resolvedRemoteUrl = remoteUrl;
  let resolvedInstanceId: string | null = null;

  if (userId) {
    const dbSession = await getRemoteSession(userId);
    if (dbSession) {
      resolvedToken = dbSession.token;
      resolvedLeadId = dbSession.leadId;
      resolvedRemoteUrl = dbSession.remoteUrl;
      resolvedInstanceId = dbSession.instanceId;
    }
  }

  if (!resolvedToken && !isLoginEndpoint) {
    return fail({
      message: t("vibe.errors.remoteNotLoggedIn"),
      errorType: ErrorResponseTypes.UNAUTHORIZED,
    });
  }

  // Login: bootstrap leadId from remote host if we don't have one
  let leadId: string | null = resolvedLeadId;
  if (isLoginEndpoint && !leadId) {
    leadId = await bootstrapRemoteLeadId(resolvedRemoteUrl, logger);
    if (!leadId) {
      return fail({
        message: t("vibe.errors.remoteNoLeadId"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  if (!leadId) {
    return fail({
      message: t("vibe.errors.remoteNoLeadId"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }

  const effectiveLeadId = leadId;
  const token = resolvedToken ?? "";

  // Non-login/logout: all tool calls go through the unified execute-tool repository.
  // RouteExecuteRepository.runInProcess handles routing rule resolution, direct-http and
  // reverse-ws transports, all callback modes, platform-based permission gating, and
  // long-running task creation.
  if (!isLoginEndpoint && !isLogoutEndpoint) {
    if (userId && resolvedInstanceId) {
      const { createEndpointLogger } = await import("next-vibe/logger/server");
      const transportLogger = createEndpointLogger(false, locale);
      const { RouteExecuteRepository } =
        await import("next-vibe/execute-tool/repository");
      return RouteExecuteRepository.runInProcessTyped({
        definition: endpoint,
        input: data,
        urlPathParams,
        instanceId: resolvedInstanceId,
        callbackMode: "wait",
        user,
        locale,
        logger: transportLogger,
        // no user context — UTC (dates not user-facing here)
        streamContext: makeHeadlessContext(signal, undefined, "UTC"),
        platform,
      });
    }
    return fail({
      message: t("vibe.errors.remoteNotLoggedIn"),
      errorType: ErrorResponseTypes.UNAUTHORIZED,
    });
  }

  // Login/logout: direct fetch to access raw Set-Cookie headers. This is an
  // auth-bootstrap call (no session/instanceId exists yet at login, and we need
  // the raw Set-Cookie response) — the one place that legitimately bypasses the
  // unified runInProcessTyped path.
  const loginPath = endpoint.path.join("/");
  let url = `${resolvedRemoteUrl}/api/${locale}/${loginPath}`;
  if (endpoint.method === Methods.GET) {
    const u = new URL(`/api/${locale}/${loginPath}`, resolvedRemoteUrl);
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null) {
        u.searchParams.set(
          key,
          typeof value === "object" ? JSON.stringify(value) : String(value),
        );
      }
    }
    url = u.toString();
  }
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}${BEARER_LEAD_ID_SEPARATOR}${effectiveLeadId}`,
  };

  // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- auth-bootstrap: login/logout needs the raw Set-Cookie response and runs before any session/instanceId exists (see comment above)
  const response = await fetch(url, {
    method: endpoint.method,
    headers,
    body: endpoint.method === Methods.GET ? undefined : JSON.stringify(data),
    redirect: "manual",
  });

  if (isLoginEndpoint && response.ok && userId) {
    await handleRemoteLoginResponse(
      response,
      resolvedRemoteUrl,
      userId,
      logger,
    );
  }

  if (isLogoutEndpoint && response.ok && userId) {
    const { db } = await import("next-vibe/database");
    const { remoteConnections } =
      await import("next-vibe/remote-connection/db");
    const { eq, and } = await import("drizzle-orm");
    await db
      .delete(remoteConnections)
      .where(
        and(
          eq(remoteConnections.userId, userId),
          eq(remoteConnections.remoteUrl, resolvedRemoteUrl),
        ),
      );
    logger.info(`[REMOTE] Logged out from ${resolvedRemoteUrl}`);
  }

  try {
    return (await response.json()) as ResponseType<
      RemoteEndpointResponse["data"]
    >;
  } catch {
    return fail({
      message: t("vibe.errors.remoteServerError"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}

function parseSetCookie(
  setCookieHeader: string,
  name: string,
): string | undefined {
  const cookies = setCookieHeader.split(/,\s*(?=[^;]*=)/);
  for (const cookie of cookies) {
    const match = cookie.match(new RegExp(`${name}=([^;]*)`));
    if (match?.[1]) {
      return match[1];
    }
  }
  return undefined;
}

async function bootstrapRemoteLeadId(
  host: string,
  logger: EndpointLogger,
): Promise<string | null> {
  try {
    // auth-bootstrap: reads the raw Set-Cookie lead_id before any session exists;
    // must hit the wire, cannot go through the typed/in-process path.
    // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- lead-id bootstrap (raw Set-Cookie, pre-session)
    const response = await fetch(host, { method: "GET", redirect: "manual" });
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      const leadId = parseSetCookie(setCookie, LEAD_ID_COOKIE_NAME);
      if (leadId) {
        return leadId;
      }
    }
    const location = response.headers.get("location");
    if (location) {
      const redirectUrl = location.startsWith("http")
        ? location
        : `${host}${location}`;
      // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- lead-id bootstrap: follow redirect to read raw Set-Cookie (pre-session)
      const redirectResponse = await fetch(redirectUrl, {
        method: "GET",
        redirect: "manual",
      });
      const redirectCookie = redirectResponse.headers.get("set-cookie");
      if (redirectCookie) {
        const leadId = parseSetCookie(redirectCookie, LEAD_ID_COOKIE_NAME);
        if (leadId) {
          return leadId;
        }
      }
    }
    logger.warn("[REMOTE] Could not bootstrap leadId from remote host");
    return null;
  } catch (error) {
    logger.error(`[REMOTE] Failed to bootstrap leadId: ${String(error)}`);
    return null;
  }
}

async function handleRemoteLoginResponse(
  response: Response,
  host: string,
  userId: string,
  logger: EndpointLogger,
): Promise<void> {
  const setCookie = response.headers.get("set-cookie");
  if (!setCookie) {
    logger.warn("[REMOTE] Login succeeded but no Set-Cookie header received");
    return;
  }

  const token = parseSetCookie(setCookie, AUTH_TOKEN_COOKIE_NAME);
  const leadId = parseSetCookie(setCookie, LEAD_ID_COOKIE_NAME);

  if (!token) {
    logger.error("[REMOTE] Login succeeded but no token in Set-Cookie");
    return;
  }
  if (!leadId) {
    logger.error("[REMOTE] Login succeeded but no leadId in Set-Cookie");
    return;
  }

  const { RemoteConnectionRepository } =
    await import("next-vibe/remote-connection/repository");
  // CLI login flow (vibe --thea/--hermes) has no user-decided sync scope to
  // carry - unlike the connect endpoint's request body. Omitting it here
  // makes the repository carry forward the existing row's scope on a
  // reconnect, only falling back to the schema's baseline for a genuinely
  // first-ever row - never a value fabricated at this call site.
  const result = await RemoteConnectionRepository.upsertRemoteConnection({
    userId,
    remoteUrl: host,
    token,
    leadId,
    logger,
  });

  if (result.success) {
    logger.info(`[REMOTE] Logged in to ${host} (userId: ${userId})`);
  } else {
    logger.error("[REMOTE] Failed to store session in DB after login");
  }
}
