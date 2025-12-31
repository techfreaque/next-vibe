/**
 * CLI Route Executor
 * Thin adapter that parses CLI input and delegates to central executor
 * Handles CLI-specific concerns: argument parsing, interactive forms, output formatting
 */

import type { ErrorResponseType } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/types";
import { type UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TranslatedKeyType } from "@/i18n/core/scoped-translation";
import { simpleT } from "@/i18n/core/shared";
import type {
  TFunction,
  TParams,
  TranslationKey,
} from "@/i18n/core/static-types";

import { isEmptySchema } from "../../../../shared/utils/validation";
import { definitionLoader } from "../../shared/endpoints/definition/loader";
import type { BaseExecutionContext } from "../../shared/endpoints/route/executor";
import { routeExecutionExecutor } from "../../shared/endpoints/route/executor";
import type { InferJwtPayloadTypeFromRoles } from "../../shared/endpoints/route/handler";
import type { EndpointLogger } from "../../shared/logger/endpoint";
import type {
  CreateApiEndpointAny,
  UnifiedField,
} from "../../shared/types/endpoint";
import type { Platform } from "../../shared/types/platform";
import { getCliUser } from "../auth/cli-user";
import { modularCLIResponseRenderer } from "../widgets/renderers/response-renderer";
import { schemaUIHandler } from "../widgets/renderers/schema-handler";
import type { CliObject } from "./parsing";

// Input data interfaces
interface InputData {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | undefined
    | InputData
    | InputData[]
    | Array<string | number | boolean | null | undefined>;
}

interface CollectedInputData {
  data?: Partial<InputData>;
  urlPathParams?: Partial<InputData>;
}

// CLI data types
export interface CliRequestData {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | undefined
    | CliRequestData
    | CliRequestData[];
}

interface CliUrlParams {
  [key: string]: string | number | boolean | null | undefined;
}

// Use CliObject from parsing.ts for type-safe nested object support
type CliNamedArgs = CliObject;

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
  | typeof Platform.AI
  | typeof Platform.MCP;

/**
 * Route execution context
 * Extends BaseExecutionContext with CLI-specific fields
 */
export interface RouteExecutionContext
  extends Omit<BaseExecutionContext<InputData>, "user"> {
  /** URL path parameters */
  urlPathParams?: CliUrlParams;

  /** CLI-specific arguments */
  cliArgs?: {
    positionalArgs: string[];
    namedArgs: CliNamedArgs;
  };

  /** More specific user type for CLI */
  user: InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]> | undefined;

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
   * Indicates that this is a logical error response (e.g., operation failed)
   * even though success: true was returned. Used for CLI exit code handling.
   */
  isErrorResponse?: true;
}

/**
 * CLI Route Executor
 * Thin adapter: parses CLI input → calls central executor → formats CLI output
 */
export class RouteDelegationHandler {
  /**
   * Execute a route - delegates to central executor
   */
  async executeRoute(
    resolvedCommand: string,
    context: RouteExecutionContext,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<RouteExecutionResult> {
    const startTime = Date.now();

    try {
      // 1. Get CLI user (fallback to getCliUser if not provided)
      // Note: Auth will be handled again by shared handler, this is just for endpoint loading
      let cliUser = context.user;
      if (!cliUser) {
        const cliUserResult = await getCliUser(logger, context.locale);
        if (cliUserResult.success) {
          cliUser = cliUserResult.data;
        } else {
          // If auth fails, still try to load endpoint - shared handler will re-auth properly
          cliUser = {
            isPublic: true,
            leadId: "temp-for-loading",
          } as InferJwtPayloadTypeFromRoles<readonly UserRoleValue[]>;
        }
      }

      // 2. Get endpoint definition for CLI-specific features (interactive forms, arg parsing)
      const endpointResult = await definitionLoader.load<CreateApiEndpointAny>({
        identifier: resolvedCommand,
        platform: context.platform,
        user: cliUser,
        logger,
      });
      const endpoint = endpointResult.success ? endpointResult.data : null;

      // 3. CLI-specific: Collect input data (parse CLI args, interactive forms)
      const inputData = await this.collectInputData(endpoint, context, logger);

      // 4. CLI-specific: Handle dry run
      if (context.options?.dryRun) {
        logger.info("🔍 Dry run - would execute with:");
        logger.info(
          JSON.stringify(
            { data: inputData.data, urlPathParams: inputData.urlPathParams },
            null,
            2,
          ),
        );
        return {
          success: true,
          data: {
            dryRun: true,
            data: inputData.data as CliResponseData,
            urlPathParams: inputData.urlPathParams as CliResponseData,
          } as CliResponseData,
          metadata: {
            executionTime: Date.now() - startTime,
            endpointPath: resolvedCommand,
            resolvedCommand,
          },
        };
      }

      // 5. CLI-specific: Show execution info if verbose
      if (context.options?.verbose) {
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

      // 6. Delegate to shared generic handler executor
      let result = await routeExecutionExecutor.executeGenericHandler({
        toolName: resolvedCommand,
        data: (inputData.data || {}) as Record<string, never>,
        urlPathParams: (inputData.urlPathParams || {}) as Record<string, never>,
        user: cliUser,
        locale,
        logger,
        platform: context.platform,
      });

      // 7. Convert ResponseType to RouteExecutionResult
      const routeResult: RouteExecutionResult = {
        success: result.success,
        data: result.success
          ? (result.data as CliResponseData | undefined)
          : undefined,
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

      // 8. Format result for CLI output
      const formattedOutput = this.formatResult(
        routeResult,
        context.options?.output || "pretty",
        endpoint, // Pass endpoint definition for widget-based formatting
        locale,
        context.options?.verbose || false,
        logger,
      );

      // 9. Return result with formatted output
      return {
        ...routeResult,
        formattedOutput,
      };
    } catch (error) {
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

      // Format error result
      const formattedOutput = this.formatResult(
        errorResult,
        context.options?.output || "pretty",
        null, // endpoint definition not needed for formatting
        locale,
        context.options?.verbose || false,
        logger,
      );

      return {
        ...errorResult,
        formattedOutput,
      };
    }
  }

  /**
   * Collect input data using schema-driven UI
   * Now delegates validation to registry
   */
  private async collectInputData(
    endpoint: CreateApiEndpointAny | null,
    context: RouteExecutionContext,
    logger: EndpointLogger,
  ): Promise<CollectedInputData> {
    const inputData: CollectedInputData = {};

    // Always try to build data from CLI arguments first
    const cliData = this.buildDataFromCliArgs(endpoint, context);

    // Merge CLI data with provided data using registry
    const contextData = context.data;
    if (contextData || (cliData && Object.keys(cliData).length > 0)) {
      const mergedData = routeExecutionExecutor.mergeData(
        contextData || {},
        cliData || {},
      );
      // mergedData is Partial<InputData>, which is compatible with InputData for our purposes
      inputData.data = mergedData;

      // Check if all required fields are satisfied using registry
      const missingRequired = routeExecutionExecutor.getMissingRequiredFields(
        inputData.data,
        endpoint?.requestSchema,
        logger,
      );

      if (
        missingRequired.length > 0 &&
        context.options?.interactive &&
        !contextData &&
        endpoint
      ) {
        // Some required fields missing AND no data was provided, use interactive mode
        logger.info("📝 Request Data:");
        logger.warn(
          `⚠️  Missing required fields: ${missingRequired.join(", ")}`,
        );
        inputData.data = await this.generateFormFromEndpoint(
          endpoint,
          "request",
        );
      }
    } else if (
      endpoint?.requestSchema &&
      context.options?.interactive !== false
    ) {
      // No data provided and interactive mode allowed
      logger.info("📝 Request Data:");
      inputData.data = await this.generateFormFromEndpoint(endpoint, "request");
    } else {
      // No CLI data and interactive mode disabled - use empty data
      inputData.data = {};
    }

    // Collect URL parameters if needed
    if (endpoint?.requestUrlPathParamsSchema && !context.urlPathParams) {
      // Check if schema is empty
      if (!isEmptySchema(endpoint.requestUrlPathParamsSchema)) {
        logger.info("🔗 URL Parameters:");
        inputData.urlPathParams = await this.generateFormFromEndpoint(
          endpoint,
          "urlPathParams",
        );
      }
    } else if (context.urlPathParams) {
      inputData.urlPathParams = context.urlPathParams;
    }

    return inputData;
  }

  /**
   * Generate form from endpoint using schema UI handler
   */
  private async generateFormFromEndpoint(
    endpoint: CreateApiEndpointAny,
    formType: "request" | "urlPathParams" = "request",
  ): Promise<InputData> {
    const schema =
      formType === "request"
        ? endpoint.requestSchema
        : endpoint.requestUrlPathParamsSchema;

    if (!schema) {
      return {};
    }

    const fields = schemaUIHandler.parseSchema(schema);
    const config = {
      title: `${endpoint.method} ${endpoint.path.join("/")}`,
      description: endpoint.description || endpoint.title,
      fields,
    };

    const result = await schemaUIHandler.generateForm(config);
    return result as InputData;
  }

  /**
   * Format execution result for display with enhanced rendering
   */
  formatResult(
    result: RouteExecutionResult,
    outputFormat = "pretty",
    endpointDefinition: CreateApiEndpointAny | null,
    locale: CountryLanguage,
    verbose = false,
    logger: EndpointLogger,
  ): string {
    if (!result.success) {
      // Translate error message if it's a translation key
      const { t } = simpleT(locale);
      let errorMessage = t(
        result.error ||
          "app.api.system.unifiedInterface.cli.vibe.errors.unknownError",
        result.errorParams,
      );

      // Build detailed error message with errorParams
      let detailedError = errorMessage;

      // Always show error details from errorParams, even in non-verbose mode
      if (result.errorParams && Object.keys(result.errorParams).length > 0) {
        // eslint-disable-next-line i18next/no-literal-string
        detailedError += "\n\nDetails:";
        for (const [key, value] of Object.entries(result.errorParams)) {
          // eslint-disable-next-line i18next/no-literal-string
          detailedError += `\n  ${key}: ${value}`;
        }
      }

      // Handle error cause chain
      const causeChain = this.formatErrorCauseChain(result, t, verbose);
      if (causeChain) {
        detailedError += causeChain;
      }

      if (verbose) {
        // eslint-disable-next-line i18next/no-literal-string
        return `❌ Error: ${detailedError}\n\nFull Response:\n${JSON.stringify(
          result,
          null,
          2,
        )}`;
      }
      // eslint-disable-next-line i18next/no-literal-string
      return `❌ Error: ${detailedError}`;
    }

    let output = "";

    // Only show metadata in verbose mode
    if (verbose) {
      // Add success indicator
      // eslint-disable-next-line i18next/no-literal-string
      output += "✅ Success\n";

      // Add execution metadata if available
      if (result.metadata) {
        if (result.metadata.route) {
          // eslint-disable-next-line i18next/no-literal-string
          output += `🛣️  Route: ${result.metadata.method} ${result.metadata.route}\n`;
        }
      }
      output += "\n";
    }

    // Format data based on output format
    if (result.data) {
      output += "\n";

      switch (outputFormat) {
        case "json":
          // eslint-disable-next-line i18next/no-literal-string
          output += "📊 Result (JSON):\n";
          output += JSON.stringify(result.data, null, 2);
          break;
        case "pretty":
        default:
          // Always use enhanced renderer for pretty format
          if (endpointDefinition) {
            output += this.formatWithEnhancedRenderer(
              result.data,

              endpointDefinition,
              locale,
              logger,
            );
          } else {
            // Fallback to JSON without endpoint definition
            if (typeof result.data === "object") {
              output += JSON.stringify(result.data, null, 2);
            } else {
              output += String(result.data);
            }
          }
          break;
      }
    }

    return output;
  }

  /**
   * Format error cause chain recursively
   */
  private formatErrorCauseChain(
    result: RouteExecutionResult,
    t: TFunction,
    verbose: boolean,
    depth = 0,
  ): string {
    if (!result.cause || depth > 10) {
      // Prevent infinite recursion (increased limit for deep error chains)
      return "";
    }

    const indent = "  ".repeat(depth + 1);
    let output = "";

    // Format cause error message - ErrorResponseType uses 'message' field
    const causeTranslationKey: TranslationKey =
      result.cause.message ||
      "app.api.system.unifiedInterface.cli.vibe.errors.unknownError";

    const causeMessage = t(causeTranslationKey, result.cause.messageParams);

    // Show error type in verbose mode or for root cause
    const errorTypeInfo =
      verbose || !result.cause.cause
        ? ` [${result.cause.errorType.errorKey}]`
        : "";

    // eslint-disable-next-line i18next/no-literal-string
    output += `\n\n${indent}↳ Caused by${errorTypeInfo}: ${causeMessage}`;

    // Add cause error params - ErrorResponseType uses 'messageParams' field
    if (
      result.cause.messageParams &&
      Object.keys(result.cause.messageParams).length > 0
    ) {
      for (const [key, value] of Object.entries(result.cause.messageParams)) {
        // eslint-disable-next-line i18next/no-literal-string
        output += `\n${indent}  • ${key}: ${value}`;
      }
    }

    // Recursively format nested causes
    if (result.cause.cause) {
      // Create a temporary RouteExecutionResult to continue recursion
      const nestedResult: RouteExecutionResult = {
        success: false,
        cause: result.cause.cause,
      };
      output += this.formatErrorCauseChain(nestedResult, t, verbose, depth + 1);
    }

    return output;
  }

  /**
   * Sanitize data for renderer to match expected type
   */
  private sanitizeDataForRenderer(
    data: CliResponseData,
  ): Record<string, WidgetData> {
    if (typeof data !== "object" || data === null) {
      return { result: String(data) };
    }

    const sanitizeValue = (
      value:
        | CliResponseData
        | CliResponseData[]
        | string
        | number
        | boolean
        | null
        | undefined,
    ): WidgetData => {
      if (value === undefined || value === null) {
        return undefined;
      }
      if (typeof value === "string") {
        return value;
      }
      if (typeof value === "number") {
        return value;
      }
      if (typeof value === "boolean") {
        return value;
      }
      if (Array.isArray(value)) {
        return value.map(sanitizeValue) as WidgetData[];
      }
      if (typeof value === "object") {
        const sanitizedObj: { [key: string]: WidgetData } = {};
        for (const [k, v] of Object.entries(value)) {
          sanitizedObj[k] = sanitizeValue(v);
        }
        return sanitizedObj;
      }
      return String(value);
    };

    const sanitized: Record<string, WidgetData> = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeValue(value);
    }

    return sanitized;
  }

  /**
   * Extract response fields from endpoint definition
   */
  private extractResponseFields<const TKey extends string>(
    endpointDefinition: CreateApiEndpointAny,
  ): Array<[string, UnifiedField<TKey>]> {
    // Type guard: check if it's a valid endpoint with fields
    if (
      !endpointDefinition ||
      typeof endpointDefinition !== "object" ||
      !("fields" in endpointDefinition)
    ) {
      return [];
    }

    const fields = endpointDefinition.fields;

    // Check if fields is an ObjectField with children
    if (
      !fields ||
      typeof fields !== "object" ||
      !("children" in fields) ||
      typeof fields.children !== "object" ||
      fields.children === null
    ) {
      return [];
    }

    const children = fields.children as Record<string, UnifiedField<TKey>>;
    const responseFields: Array<[string, UnifiedField<TKey>]> = [];

    // Extract fields that have usage.response = true
    for (const [fieldName, fieldDef] of Object.entries(children)) {
      if (
        "usage" in fieldDef &&
        typeof fieldDef.usage === "object" &&
        fieldDef.usage !== null
      ) {
        const usage = fieldDef.usage;
        let hasResponse = false;

        if ("response" in usage) {
          hasResponse = usage.response === true;
        } else {
          // Check each method's usage for response field
          const usageValues = Object.values(usage);
          hasResponse = usageValues.some(
            (methodUsage) =>
              typeof methodUsage === "object" &&
              methodUsage !== null &&
              "response" in methodUsage &&
              methodUsage.response === true,
          );
        }

        if (hasResponse) {
          responseFields.push([fieldName, fieldDef]);
        }
      }
    }

    return responseFields;
  }

  /**
   * Format result using enhanced CLI response renderer
   */
  private formatWithEnhancedRenderer(
    data: CliResponseData,
    endpointDefinition: CreateApiEndpointAny,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): string {
    try {
      // Extract response fields from endpoint definition
      const fields = this.extractResponseFields(endpointDefinition);

      // Use enhanced modular renderer with locale
      return modularCLIResponseRenderer.render(
        this.sanitizeDataForRenderer(data),
        fields,
        locale,
        endpointDefinition.scopedTranslation.scopedT,
      );
    } catch (error) {
      // Fallback to basic formatting
      logger.warn("Enhanced rendering failed, falling back to basic format:", {
        error: parseError(error),
      });
      // eslint-disable-next-line i18next/no-literal-string
      return `📊 Result:\n${this.formatPretty(data, locale, endpointDefinition.scopedTranslation.scopedT)}`;
    }
  }

  /**
   * Format data in pretty format using enhanced renderer
   */
  private formatPretty(
    data: CliResponseData,
    locale: CountryLanguage,
    scopedT: (locale: CountryLanguage) => {
      t: (key: string, params?: TParams) => TranslatedKeyType;
    },
  ): string {
    // Use the enhanced modular CLI response renderer for pretty formatting
    try {
      return modularCLIResponseRenderer.render(
        this.sanitizeDataForRenderer(data),
        [],
        locale,
        scopedT,
      );
    } catch {
      // Fallback to JSON if enhanced rendering fails
      if (typeof data === "object") {
        return JSON.stringify(data, null, 2);
      }
      return String(data);
    }
  }

  /**
   * Build data object from CLI arguments
   */
  private buildDataFromCliArgs(
    endpoint: CreateApiEndpointAny | null,
    context: RouteExecutionContext,
  ): InputData | null {
    if (!context.cliArgs) {
      return null;
    }

    const { positionalArgs, namedArgs } = context.cliArgs;
    const data: InputData = {};

    // Handle firstCliArgKey mapping - safely access nested properties
    const cliConfig =
      endpoint && typeof endpoint === "object" && "cli" in endpoint
        ? endpoint.cli
        : null;
    const firstCliArgKey =
      cliConfig &&
      typeof cliConfig === "object" &&
      "firstCliArgKey" in cliConfig
        ? cliConfig.firstCliArgKey
        : null;

    if (
      firstCliArgKey &&
      typeof firstCliArgKey === "string" &&
      positionalArgs.length > 0
    ) {
      // If there's only one positional arg, use it as a string for backward compatibility
      // If there are multiple positional args, use them as an array
      const firstArg = positionalArgs[0];
      if (positionalArgs.length === 1 && firstArg !== undefined) {
        data[firstCliArgKey] = firstArg;
      } else {
        // Pass positional args as a simple string array
        // Explicitly type as array of strings (which is compatible with InputData value types)
        data[firstCliArgKey] = positionalArgs as Array<
          string | number | boolean | null | undefined
        >;
      }
    }

    // Map named arguments to data fields (convert kebab-case to camelCase)
    for (const [key, value] of Object.entries(namedArgs)) {
      // Convert kebab-case to camelCase (e.g., skip-generation -> skipGeneration)
      const camelCaseKey = key.replaceAll(
        /-([a-z])/g,
        // oxlint-disable-next-line no-unused-vars
        (_, letter: string): string => letter.toUpperCase(),
      );

      // Convert string boolean values to actual booleans if not already parsed
      let convertedValue:
        | string
        | number
        | boolean
        | null
        | undefined
        | InputData
        | InputData[] = value;
      if (typeof value === "string") {
        const lowerValue = value.toLowerCase();
        if (lowerValue === "true") {
          convertedValue = true;
        } else if (lowerValue === "false") {
          convertedValue = false;
        }
        // Note: Numbers should already be parsed by the CLI argument parser
      }

      data[camelCaseKey] = convertedValue as
        | string
        | number
        | boolean
        | null
        | undefined
        | InputData
        | InputData[]
        | Array<string | number | boolean | null | undefined>;
    }
    return Object.keys(data).length > 0 ? data : null;
  }
}

export const routeDelegationHandler = new RouteDelegationHandler();
