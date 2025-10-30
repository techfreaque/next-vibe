/**
 * Route Delegation Handler
 * Integrates with existing CLI handler system to execute routes
 */

import type { ErrorResponseType } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import type z from "zod";

import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TFunction, TranslationKey } from "@/i18n/core/static-types";

import type { CreateApiEndpoint } from "../shared/endpoint/create";
import type { EndpointLogger } from "../shared/logger/endpoint";
import { getCliUser } from "../shared/server-only/auth/cli-user";
import { loadEndpointDefinition } from "../shared/server-only/execution/definition-loader";
import type {
  BaseExecutionContext,
  BaseExecutionResult,
} from "../shared/server-only/execution/executor";
import { loadRouteHandler } from "../shared/server-only/execution/route-loader";
import type { UnifiedField } from "../shared/types/endpoint";
import type { Methods } from "../shared/types/enums";
import type { InferJwtPayloadTypeFromRoles } from "../shared/types/handler";
import { modularCLIResponseRenderer } from "./widgets/modular-response-renderer";
import { responseMetadataExtractor } from "./widgets/response-metadata-extractor";
import { schemaUIHandler } from "./widgets/schema-ui-handler";
import type { RenderableValue, ResponseFieldMetadata } from "./widgets/types";

// Default fields type for generic endpoint handling
// This is used as the TFields parameter in CreateApiEndpoint
type DefaultFields = Record<string, string | number | boolean | null>;

// CLI handler function type - matches createCliHandler signature
interface CliHandlerFunction<
  TUserRoleValue extends readonly (typeof UserRoleValue)[],
> {
  (
    data: CliRequestData,
    urlPathParams: CliUrlParams,
    user: InferJwtPayloadTypeFromRoles<TUserRoleValue>,
    locale: CountryLanguage,
    verbose?: boolean,
  ): Promise<{
    success: boolean;
    data?: CliResponseData;
    message?: string;
  }>;
}

// Endpoint definition interface - removed as we now use CreateApiEndpoint

// Input data interfaces
interface InputData {
  [key: string]:
  | string
  | number
  | boolean
  | null
  | undefined
  | InputData
  | InputData[];
}

interface CollectedInputData {
  data?: InputData;
  urlPathParams?: InputData;
}

// Schema interface for validation
interface SchemaValidator {
  safeParse: (data: InputData) => {
    success: boolean;
    error?: {
      issues: Array<{ code: string; received: string; path: string[] }>;
    };
  };
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

interface CliNamedArgs {
  [key: string]: string | number | boolean | null | undefined;
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
 * Route execution context
 * Extends BaseExecutionContext with CLI-specific fields
 */
export interface RouteExecutionContext
  extends Omit<BaseExecutionContext, "user"> {
  /** URL path parameters */
  urlPathParams?: CliUrlParams;

  /** CLI-specific arguments */
  cliArgs?: {
    positionalArgs: string[];
    namedArgs: CliNamedArgs;
  };

  /** More specific user type for CLI */
  user: InferJwtPayloadTypeFromRoles<readonly (typeof UserRoleValue)[]>;

  /** CLI-specific options */
  options?: {
    verbose?: boolean;
    dryRun?: boolean;
    interactive?: boolean;
    output?: "json" | "table" | "pretty";
  };
}

/**
 * Route execution result
 * Extends BaseExecutionResult with CLI-specific fields
 */
export interface RouteExecutionResult
  extends Omit<BaseExecutionResult, "data" | "metadata"> {
  /** CLI response data */
  data?: CliResponseData;

  /** CLI-specific metadata */
  metadata?: {
    executionTime: number;
    endpointPath: string;
    method: string;
    route?: string;
  };

  /** Error cause chain for debugging - reuses ErrorResponseType */
  cause?: ErrorResponseType;
}

/**
 * Route metadata from discovery
 */
export interface DiscoveredRoute {
  alias: string;
  path: string;
  method: string;
  routePath: string;
  description?: string;
}

/**
 * Route delegation handler class
 */
export class RouteDelegationHandler {
  /**
   * Execute a route using the existing CLI handler system
   */
  async executeRoute(
    route: DiscoveredRoute,
    context: RouteExecutionContext,
    logger: EndpointLogger,
    locale: CountryLanguage,
    t: TFunction,
  ): Promise<RouteExecutionResult> {
    const startTime = Date.now();

    try {
      // Get the CLI handler from the route
      let cliHandler = await this.getCliHandler(route, logger);

      // Method is now explicit from route registration - no fallback needed

      if (!cliHandler) {
        return {
          success: false,
          error: t(
            "app.api.v1.core.system.unifiedInterface.cli.vibe.errors.routeNotFound",
          ),
        };
      }

      // Get endpoint definition for schema-driven UI
      const endpoint = await this.getCreateApiEndpoint(route, logger);

      // Collect input data using schema-driven UI if needed
      const inputData = await this.collectInputData(endpoint, context, logger);

      // Create CLI user context
      const cliUser =
        context.user || (await getCliUser(logger, context.locale));

      if (!cliUser) {
        logger.error("Failed to get CLI user for authentication");
        return {
          success: false,
          data: {
            error: "CLI user authentication failed",
            details: "Could not retrieve CLI user from database",
          },
        };
      }

      // Show execution info if verbose
      if (context.options?.verbose) {
        logger.info(`🎯 Executing route: ${route.path}`);
        logger.info(`Method: ${route.method}`);
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

      // Execute dry run if requested
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
            args: {
              data: inputData.data,
              urlPathParams: inputData.urlPathParams,
            },
          },
          metadata: {
            executionTime: Date.now() - startTime,
            endpointPath: route.path,
            route: route.path,
            method: route.method,
          },
        };
      }

      // Execute the CLI handler
      // Only pass URL parameters if they exist, otherwise pass undefined for never schemas
      const urlPathParams = inputData.urlPathParams as CliUrlParams | undefined;

      // Debug locale before passing to CLI handler
      logger.debug("CLI handler execution", {
        locale: locale,
        localeType: typeof locale,
        cliUserId: cliUser.isPublic ? cliUser.leadId : cliUser.id,
      });

      logger.debug("About to call CLI handler", {
        handlerType: typeof cliHandler,
        dataKeys: Object.keys(inputData.data || {}),
        urlPathParamsKeys: Object.keys(urlPathParams || {}),
      });

      const result = await cliHandler(
        inputData.data || {},
        urlPathParams || {},
        cliUser,
        locale,
        context.options?.verbose || false,
      );

      logger.debug("CLI handler completed", {
        success: result.success,
        hasData: !!result.data,
      });

      // Format result - pass through error response directly including cause chain
      return {
        success: result.success,
        data: result.data,
        error: result.success ? undefined : result.message,
        errorParams: result.success
          ? undefined
          : (result as { messageParams?: Record<string, string | number> })
            .messageParams,
        cause: result.success
          ? undefined
          : (result as { cause?: ErrorResponseType }).cause,
        metadata: {
          executionTime: Date.now() - startTime,
          endpointPath: route.path,
          route: route.path,
          method: route.method,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        metadata: {
          executionTime: Date.now() - startTime,
          endpointPath: route.path,
          route: route.path,
          method: route.method,
        },
      };
    }
  }

  /**
   * Get CLI handler from new format route (0 type errors only)
   */
  private async getCliHandler(
    route: DiscoveredRoute,
    logger: EndpointLogger,
  ): Promise<CliHandlerFunction<readonly (typeof UserRoleValue)[]> | null> {
    try {
      const result = await loadRouteHandler<
        CliHandlerFunction<readonly (typeof UserRoleValue)[]>,
        CreateApiEndpoint<
          string,
          Methods,
          readonly (typeof UserRoleValue)[],
          DefaultFields
        >
      >(
        {
          routePath: route.routePath,
          method: route.method,
          alias: route.alias,
        },
        "cli",
        logger,
      );

      if (result.error) {
        logger.error(
          `[Route Executor] Failed to load CLI handler for ${route.routePath}`,
          {
            error: result.error,
            method: route.method,
            alias: route.alias,
          },
        );
        return null;
      }

      return result.handler;
    } catch (error) {
      logger.error(
        `[Route Executor] Failed to load CLI handler for ${route.routePath}`,
        {
          error: parseError(error),
          method: route.method,
          alias: route.alias,
        },
      );
      return null;
    }
  }

  /**
   * Get endpoint definition from route
   */
  private async getCreateApiEndpoint(
    route: DiscoveredRoute,
    logger: EndpointLogger,
  ): Promise<CreateApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
    UnifiedField<z.ZodTypeAny>
  > | null> {
    const result = await loadEndpointDefinition<
      CreateApiEndpoint<
        string,
        Methods,
        readonly (typeof UserRoleValue)[],
        UnifiedField<z.ZodTypeAny>
      >
    >(
      {
        routePath: route.routePath,
        method: route.method,
      },
      logger,
    );

    if (result.error) {
      logger.warn(
        `Failed to load endpoint definition for ${route.routePath}:`,
        result.error,
      );
    }

    return result.definition;
  }

  /**
   * Collect input data using schema-driven UI
   */
  private async collectInputData(
    endpoint: CreateApiEndpoint<
      string,
      Methods,
      readonly (typeof UserRoleValue)[],
      UnifiedField<z.ZodTypeAny>
    > | null,
    context: RouteExecutionContext,
    logger: EndpointLogger,
  ): Promise<CollectedInputData> {
    const inputData: CollectedInputData = {};

    // Always try to build data from CLI arguments first
    const cliData = this.buildDataFromCliArgs(endpoint, context);

    // Merge CLI data with provided data (CLI args take precedence)
    const contextData = context.data as InputData | undefined;
    if (contextData || (cliData && Object.keys(cliData).length > 0)) {
      inputData.data = {
        ...(contextData || {}),
        ...(cliData || {}),
      } as InputData;

      // Check if all required fields are satisfied with merged data
      const mergedData = inputData.data;
      const missingRequired = this.getMissingRequiredFields(
        endpoint,
        mergedData,
        logger,
      );

      if (
        missingRequired.length > 0 &&
        context.options?.interactive &&
        endpoint
      ) {
        // Some required fields missing, use interactive mode
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
      // Safely check if the schema is effectively empty (z.never() or
      // empty object)
      try {
        const schema = endpoint.requestUrlPathParamsSchema as SchemaValidator;
        const testResult = schema.safeParse({});
        const isNeverSchema =
          !testResult.success &&
          testResult.error?.issues?.[0]?.code === "invalid_type";
        const isEmptySchema =
          testResult.success &&
          Object.keys((testResult as { data?: CliUrlParams }).data || {})
            .length === 0;

        if (!isNeverSchema && !isEmptySchema) {
          logger.info("🔗 URL Parameters:");
          inputData.urlPathParams = await this.generateFormFromEndpoint(
            endpoint,
            "urlPathParams",
          );
        }
        // For never schema, don't set urlPathParams at all
      } catch (error) {
        // If schema validation fails, skip URL parameters collection
        logger.debug(
          "Failed to validate URL parameters schema:",
          parseError(error),
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
    endpoint: CreateApiEndpoint<
      string,
      Methods,
      readonly (typeof UserRoleValue)[],
      UnifiedField<z.ZodTypeAny>
    >,
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
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Infrastructure: Route handler execution requires 'unknown' for flexible handler types
    endpointDefinition: unknown | null,
    locale: CountryLanguage,
    verbose = false,
    logger: EndpointLogger,
  ): string {
    if (!result.success) {
      // Translate error message if it's a translation key
      const { t } = simpleT(locale);
      let errorMessage =
        result.error ||
        t(
          "app.api.v1.core.system.unifiedInterface.cli.vibe.errors.unknownError",
        );

      // Try to translate if it looks like a translation key (contains dots)
      if (errorMessage.includes(".")) {
        try {
          errorMessage = t(errorMessage as TranslationKey, result.errorParams);
        } catch {
          // If translation fails, use the key as-is
        }
      }

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
            // Use enhanced renderer even without endpoint definition
            output += this.formatPretty(result.data, locale);
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
      "app.api.v1.core.system.unifiedInterface.cli.vibe.errors.unknownError";

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
  ): Record<string, RenderableValue> {
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
    ): RenderableValue => {
      if (value === undefined) {
        return null;
      } else if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean" ||
        value === null
      ) {
        return value;
      } else if (Array.isArray(value)) {
        return value.map(sanitizeValue);
      } else if (typeof value === "object") {
        const sanitizedObj: { [key: string]: RenderableValue } = {};
        for (const [k, v] of Object.entries(value)) {
          sanitizedObj[k] = sanitizeValue(v);
        }
        return sanitizedObj;
      } else {
        return String(value);
      }
    };

    const sanitized: Record<string, RenderableValue> = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeValue(value);
    }

    return sanitized;
  }

  /**
   * Format result using enhanced CLI response renderer
   */
  private formatWithEnhancedRenderer(
    data: CliResponseData,
    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Infrastructure: Response transformation requires 'unknown' for flexible response types
    endpointDefinition: unknown,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): string {
    try {
      // Extract response metadata from endpoint definition
      const metadata = responseMetadataExtractor.extractResponseMetadata(
        endpointDefinition,
        data as
        | string
        | number
        | boolean
        | null
        | (
          | string
          | number
          | boolean
          | null
          | (string | number | boolean | null)[]
        )[]
        | { [key: string]: string | number | boolean | null },
      );

      // Use enhanced modular renderer with locale
      const emptyMetadata: ResponseFieldMetadata[] = [];
      return modularCLIResponseRenderer.render(
        this.sanitizeDataForRenderer(data),
        metadata !== null ? metadata : emptyMetadata,
        locale,
      );
    } catch (error) {
      // Fallback to basic formatting
      logger.warn("Enhanced rendering failed, falling back to basic format:", {
        error: parseError(error),
      });
      // eslint-disable-next-line i18next/no-literal-string
      return `📊 Result:\n${this.formatPretty(data, locale)}`;
    }
  }

  /**
   * Format data in pretty format using enhanced renderer
   */
  private formatPretty(data: CliResponseData, locale: CountryLanguage): string {
    // Use the enhanced modular CLI response renderer for pretty formatting
    try {
      return modularCLIResponseRenderer.render(
        this.sanitizeDataForRenderer(data),
        [],
        locale,
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
    endpoint: CreateApiEndpoint<
      string,
      Methods,
      readonly (typeof UserRoleValue)[],
      UnifiedField<z.ZodTypeAny>
    > | null,
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
        // Convert string[] to InputData[] by mapping each string to an InputData object
        data[firstCliArgKey] = positionalArgs.map((arg) => ({ value: arg }));
      }
    }

    // Map named arguments to data fields (convert kebab-case to camelCase)
    for (const [key, value] of Object.entries(namedArgs)) {
      // Convert kebab-case to camelCase (e.g., skip-generation -> skipGeneration)
      const camelCaseKey = key.replace(
        /-([a-z])/g,
        (_match, letter: string): string => letter.toUpperCase(),
      );

      // Convert string boolean values to actual booleans if not already parsed
      let convertedValue: string | number | boolean | null | undefined = value;
      if (typeof value === "string") {
        const lowerValue = value.toLowerCase();
        if (lowerValue === "true") {
          convertedValue = true;
        } else if (lowerValue === "false") {
          convertedValue = false;
        }
        // Note: Numbers should already be parsed by the CLI argument parser
      }

      data[camelCaseKey] = convertedValue;
    }
    return Object.keys(data).length > 0 ? data : null;
  }

  /**
   * Check for missing required fields
   */
  private getMissingRequiredFields(
    endpoint: CreateApiEndpoint<
      string,
      Methods,
      readonly (typeof UserRoleValue)[],
      UnifiedField<z.ZodTypeAny>
    > | null,
    providedData: InputData,
    logger: EndpointLogger,
  ): string[] {
    // Safely access requestSchema
    const requestSchema =
      endpoint && typeof endpoint === "object" && "requestSchema" in endpoint
        ? endpoint.requestSchema
        : null;

    if (
      !requestSchema ||
      typeof requestSchema !== "object" ||
      !("safeParse" in requestSchema)
    ) {
      return [];
    }

    const missing: string[] = [];

    try {
      // Try to parse the provided data with the schema
      const validator = requestSchema as SchemaValidator;
      const result = validator.safeParse(providedData);

      if (!result.success && result.error) {
        // Extract missing required fields from Zod errors
        for (const issue of result.error.issues) {
          if (issue.code === "invalid_type" && issue.received === "undefined") {
            missing.push(issue.path.join("."));
          }
        }
      }
    } catch (error) {
      // If schema parsing fails, assume no missing fields
      logger.warn("Failed to validate schema:", parseError(error));
    }

    return missing;
  }
}

export const routeDelegationHandler = new RouteDelegationHandler();
