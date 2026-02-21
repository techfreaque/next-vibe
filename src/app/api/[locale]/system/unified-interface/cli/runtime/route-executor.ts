/**
 * CLI Route Executor
 * Thin adapter that parses CLI input and delegates to central executor
 * Handles CLI-specific concerns: argument parsing, interactive forms, output formatting
 */

import type { ErrorResponseType } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type {
  JwtPayloadType,
  JWTPublicPayloadType,
} from "@/app/api/[locale]/user/auth/types";
import {
  UserPermissionRole,
  type UserRoleValue,
} from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TParams, TranslationKey } from "@/i18n/core/static-types";

import { TOOL_HELP_ALIAS } from "../../../help/constants";
import { definitionLoader } from "../../shared/endpoints/definition/loader";
import {
  type BaseExecutionContext,
  RouteExecutionExecutor,
} from "../../shared/endpoints/route/executor";
import type { InferJwtPayloadTypeFromRoles } from "../../shared/endpoints/route/handler";
import type { EndpointLogger } from "../../shared/logger/endpoint";
import type { CreateApiEndpointAny } from "../../shared/types/endpoint-base";
import type { Platform } from "../../shared/types/platform";
import type { WidgetData } from "../../shared/widgets/widget-data";
import { CliResultFormatter } from "../../unified-ui/renderers/cli/response/result-formatter";
import { getCliUser } from "../auth/cli-user";
import {
  CliInputParser,
  type CliObject,
  type CliRequestData,
  type CliUrlParams,
} from "./parsing";

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

/** CLI-compatible platforms for type assertions */
export type CliCompatiblePlatform =
  | typeof Platform.CLI
  | typeof Platform.CLI_PACKAGE
  | typeof Platform.MCP;

/**
 * Route execution context
 * Extends BaseExecutionContext with CLI-specific fields
 */
export interface RouteExecutionContext extends Omit<
  BaseExecutionContext<CliRequestData>,
  "user"
> {
  /** URL path parameters */
  urlPathParams?: CliUrlParams;

  /** CLI-specific arguments */
  cliArgs?: {
    positionalArgs: string[];
    namedArgs: CliObject;
    /** Raw tokens after the command, for endpoint-aware re-parsing */
    rawTokens?: string[];
  };

  /** More specific user type for CLI */
  user: InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>;

  /** CLI-specific options */
  options?: {
    verbose?: boolean;
    dryRun?: boolean;
    interactive?: boolean;
    output?: "json" | "table" | "pretty";
  };

  /** Timestamp of execution */
  timestamp: number;
}

/**
 * Route execution result
 * Extends BaseExecutionResult with CLI-specific fields
 */
export interface RouteExecutionResult {
  success: boolean;
  /** CLI response data */
  data?: CliResponseData;

  /** Error message (translation key or plain text) */
  error?: TranslationKey;

  /** Error parameters for translation */
  errorParams?: TParams;

  /** CLI-specific metadata */
  metadata?: {
    executionTime: number;
    endpointPath: string;
    method?: string;
    route?: string;
    resolvedCommand?: string;
  };

  /** Performance metadata from route execution (translation keys as keys) */
  performance?: Partial<Record<TranslationKey, number>>;

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
export interface CliExecutionOptions {
  data: CliRequestData | undefined;
  urlPathParams:
    | Record<string, string | number | boolean | null | undefined>
    | undefined;
  cliArgs: {
    positionalArgs: string[];
    namedArgs: CliObject;
    rawTokens?: string[];
  };
  locale: CountryLanguage;
  /** Platform identifier (CLI or CLI_PACKAGE) */
  platform: CliCompatiblePlatform;
  dryRun: boolean | undefined;
  interactive: boolean | undefined;
  verbose: boolean | undefined;
  output: "json" | "pretty" | undefined;
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
  ): Promise<RouteExecutionResult> {
    const startTime = Date.now();

    // Default to interactive mode if no command provided
    const resolvedCommand = command || `${TOOL_HELP_ALIAS} --interactive`;

    try {
      // Get CLI user for authentication if not provided
      let cliUser: JwtPayloadType;

      const cliUserResult = await getCliUser(logger, options.locale);

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

      // Get endpoint definition for CLI-specific features (interactive forms, arg parsing)
      const endpointResult = await definitionLoader.load<CreateApiEndpointAny>({
        identifier: resolvedCommand,
        platform: options.platform,
        user: cliUser,
        logger,
        locale: options.locale,
      });
      const endpoint = endpointResult.success ? endpointResult.data : null;

      // Interactive mode: Use Ink terminal UI
      if (options.interactive && endpoint) {
        const { renderInkEndpointPage } =
          await import("@/app/api/[locale]/system/unified-interface/unified-ui/renderers/cli/CliEndpointPage");
        // Render interactive Ink UI - it handles form and submission
        renderInkEndpointPage({
          endpoint: { [endpoint.method]: endpoint },
          locale: options.locale,
          user: cliUser,
          debug: options.verbose || false,
          onSubmit: async (data: WidgetData) => {
            // Execute the endpoint when user submits
            const result = await RouteExecutionExecutor.executeGenericHandler<
              CliRequestData,
              CliUrlParams,
              WidgetData
            >({
              toolName: resolvedCommand,
              data: data as CliRequestData,
              urlPathParams: options.urlPathParams || {},
              user: cliUser,
              locale: options.locale,
              logger,
              platform: options.platform,
            });

            return result;
          },
          initialData: options.data,
        });

        // Return empty result - Ink handles everything
        return {
          success: true,
          data: undefined,
          metadata: {
            executionTime: Date.now() - startTime,
            endpointPath: resolvedCommand,
            method: endpoint.method,
            resolvedCommand,
          },
          formattedOutput: "", // Ink handles rendering
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

      // CLI-specific: Show execution info if verbose
      if (options.verbose) {
        logger.info(`🎯 Executing route: ${resolvedCommand}`);
        logger.info(`Data: ${JSON.stringify(inputData.data, null, 2)}`);
        if (
          inputData.urlPathParams &&
          Object.keys(inputData.urlPathParams).length > 0
        ) {
          logger.info(
            `URL Params: ${JSON.stringify(inputData.urlPathParams, null, 2)}`,
          );
        }
      }

      // Delegate to shared generic handler executor
      const result = await RouteExecutionExecutor.executeGenericHandler<
        CliRequestData,
        CliUrlParams,
        CliResponseData
      >({
        toolName: resolvedCommand,
        data: inputData.data || {},
        urlPathParams: inputData.urlPathParams || {},
        user: cliUser,
        locale: options.locale,
        logger,
        platform: options.platform,
      });

      // 7. Convert ResponseType to RouteExecutionResult
      const routeResult: RouteExecutionResult = {
        success: result.success,
        data: result.success ? result.data : undefined,
        error: result.success ? undefined : result.message,
        errorParams: result.success ? undefined : result.messageParams,
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
      };

      // Format result for CLI output
      const formattedOutput = await CliResultFormatter.formatResult(
        routeResult,
        options.output || "pretty",
        options.locale,
        options.verbose || false,
        logger,
        endpoint,
        cliUser,
      );

      // Return result with formatted output
      return {
        ...routeResult,
        formattedOutput,
      };
    } catch (error) {
      logger.error("Command execution failed", {
        command: resolvedCommand,
        error: parseError(error),
      });
      const errorResult: RouteExecutionResult = {
        success: false,
        error:
          "app.api.system.unifiedInterface.cli.vibe.errors.executionFailed",
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
