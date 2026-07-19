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
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { TranslatedKeyType } from "next-vibe/core/i18n/core/scoped-translation";
import type { TParams } from "next-vibe/core/i18n/core/static-types";
import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/core/route/response.schema";
import { success } from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import { parseError } from "next-vibe/core/utils/parse-error";
import { TOOL_HELP_ALIAS } from "next-vibe/help-tool/constants";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { scopedTranslation as cliScopedTranslation } from "next-vibe/platforms/cli/i18n";
import {
  CliTarget,
  type CliTargetValue,
} from "next-vibe/platforms/cli/types/cli-target";
import type { Platform } from "next-vibe/platforms/platforms";
import type { CliResultFormatter as CliResultFormatterType } from "next-vibe/unified-ui/renderers/cli/response/result-formatter";

import { getEndpoint } from "@/generated/endpoints/endpoint";

// THE AUTH SEAM: resolves WHICH user the CLI acts as (env + session file + DB).
// It does NOT decide access — allowedRoles + platform markers do, via the
// permission registry, either way. A local-only build points this single import at
// ./cli-auth-local (always the marker-driven bypass admin) and drops
// ./auth/cli-user + ./auth/session-file with their identity/DB surface.
import { resolveCliUser } from "./cli-auth";
import { CliInputParser } from "./parsing";
// THE REMOTE SEAM: the --thea/--hermes remote leg — HTTP dispatch to another
// instance, remote session/cookies, remote login bookkeeping. It is the only thing
// pulling remote-connection + the DB into the CLI runtime. A local-only build
// points this single import at ./remote-target-local and drops ./remote-target.
import { executeRemoteEndpoint } from "./remote-target";

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

      // WHO the CLI acts as. Access control is NOT decided here — the permission
      // registry gates every endpoint from allowedRoles + platform markers,
      // identically regardless of which seam is wired in.
      const cliUser: JwtPayloadType = await resolveCliUser({
        endpoint: peekedEndpoint,
        platform: options.platform,
        cliTarget: options.cliTarget,
        locale: options.locale,
        logger,
      });

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
      // Activated by -i flag OR by endpoint declaring alwaysInteractive in its cli config
      const effectiveInteractive =
        options.interactive || (endpoint?.cli?.alwaysInteractive ?? false);
      if (effectiveInteractive && endpoint) {
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
          initialData: { ...inputData.data, interactive: true },
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
        toolExecutionContext: makeHeadlessContext(
          options.signal,
          undefined,
          "UTC",
        ),
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
