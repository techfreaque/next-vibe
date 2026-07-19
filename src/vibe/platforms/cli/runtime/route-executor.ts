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
import type { ErrorResponseType } from "next-vibe/core/route/response.schema";
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

type CliResponseData = Record<string, WidgetData>;

function isRecord(
  v: WidgetData | null | undefined,
): v is Record<string, WidgetData> {
  return (
    v !== null &&
    v !== undefined &&
    typeof v === "object" &&
    !(v instanceof Date) &&
    !Array.isArray(v)
  );
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
  interactive: boolean | undefined;
  /** Enable file-based IPC for AI agent control (frame capture + key injection) */
  agentControl: boolean | undefined;
  verbose: boolean | undefined;
  output: "json" | "pretty" | undefined;
  /** Execution target: dev, local, or remote */
  cliTarget: CliTargetValue;
  /** Instance ID to target when cliTarget === REMOTE (looked up from remote_connections) */
  remoteInstanceId?: string;
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
        },
        logger,
      );

      // Single dispatch path for local and remote calls.
      // Remote: instanceId routes through execute-tool's RemoteDispatch which resolves
      // the connection row, validates it, and picks direct-http or reverse-ws.
      // Local: instanceId undefined → runs in-process.
      // To add a remote connection: vibe remote-connect <url> (not vibe --remote login).
      const remoteInstanceId =
        options.cliTarget === CliTarget.REMOTE
          ? options.remoteInstanceId
          : undefined;

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

      // Single dispatch path for both local and remote non-login/logout calls.
      // Remote: instanceId routes through execute-tool's remote dispatch (direct-http
      // or reverse-ws per connection config). Local: instanceId is undefined, runs
      // in-process. Both share the same permission cascade, folder restrictions,
      // confirmation gate, and callback mode handling.
      const { RouteExecuteRepository } =
        await import("next-vibe/execute-tool/repository");
      const rawResult = await RouteExecuteRepository.runInProcess({
        toolName: resolvedCommand,
        input: inputData.data || {},
        urlPathParams: inputData.urlPathParams || {},
        callbackMode: "wait",
        instanceId: remoteInstanceId,
        user: cliUser,
        locale: options.locale,
        logger,
        platform: options.platform,
        // Only pass preloadedHandler for local path — remote ignores it.
        preloadedHandler: remoteInstanceId ? undefined : routeHandler,
        toolExecutionContext: makeHeadlessContext(
          options.signal,
          undefined,
          "UTC",
        ),
      });

      const routeResult: RouteExecutionResult = {
        success: rawResult.success,
        data:
          rawResult.success && isRecord(rawResult.data)
            ? rawResult.data
            : undefined,
        error: rawResult.success ? undefined : rawResult.message,
        errorParams: rawResult.success ? undefined : rawResult.messageParams,
        inputData: rawResult.success ? undefined : inputData.data,
        metadata: {
          executionTime: Date.now() - startTime,
          endpointPath: resolvedCommand,
          method: "",
          resolvedCommand,
        },
        isErrorResponse:
          "isErrorResponse" in rawResult && rawResult.isErrorResponse
            ? true
            : undefined,
        performance:
          "performance" in rawResult && rawResult.performance
            ? rawResult.performance
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
