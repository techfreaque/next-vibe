/**
 * Route Delegation Handler
 * Integrates with existing CLI handler system to execute routes
 */

import { parseError } from "next-vibe/shared/utils";
import type z from "zod";

import { UserDetailLevel } from "@/app/api/[locale]/v1/core/user/enum";
import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import { modularCLIResponseRenderer } from "../../unified-ui/shared/widgets/cli/modular-response-renderer";
import { responseMetadataExtractor } from "../../unified-ui/shared/widgets/cli/response-metadata-extractor";
import { schemaUIHandler } from "../../unified-ui/shared/widgets/cli/schema-ui-handler";
import type { UnifiedField } from "../shared/core-types";
import type { CreateApiEndpoint } from "../shared/create-endpoint";
import type { EndpointLogger } from "../shared/endpoint-logger";
import type { Methods } from "../shared/enums";
import type {
  CliHandlerReturnType,
  DefinitionModule,
  RouteModule,
} from "../shared/handler-types";

// CLI user type - simplified for CLI context
interface CliUserType {
  isPublic: boolean;
  id?: string;
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

// CLI handler function type - matches createCliHandler signature
interface CliHandlerFunction {
  (
    data: CliRequestData,
    urlPathParams: CliUrlParams,
    user: CliUserType,
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
 */
export interface RouteExecutionContext {
  command: string;
  data?: CliRequestData;
  urlPathParams?: CliUrlParams;
  cliArgs?: {
    positionalArgs: string[];
    namedArgs: CliNamedArgs;
  };
  user?: CliUserType;
  locale?: CountryLanguage;
  options?: {
    verbose?: boolean;
    dryRun?: boolean;
    interactive?: boolean;
    output?: "json" | "table" | "pretty";
  };
}

/**
 * Route execution result
 */
export interface RouteExecutionResult {
  success: boolean;
  data?: CliResponseData;
  error?: string;
  metadata?: {
    executionTime?: number;
    route?: string;
    method?: string;
  };
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

      // If handler not found for this method, try other methods
      if (!cliHandler) {
        const allMethods = [
          "POST",
          "GET",
          "PUT",
          "PATCH",
          "DELETE",
          "HEAD",
          "OPTIONS",
        ];
        for (const method of allMethods) {
          if (method === route.method) {
            continue;
          } // Already tried this one
          const altRoute = { ...route, method };
          cliHandler = await this.getCliHandler(altRoute, logger);
          if (cliHandler) {
            // Found a handler with a different method
            route = altRoute; // Update route to use the working method
            break;
          }
        }
      }

      if (!cliHandler) {
        return {
          success: false,
          error: t("app.api.v1.core.system.cli.vibe.errors.routeNotFound"),
        };
      }

      // Get endpoint definition for schema-driven UI
      const endpoint = await this.getEndpointDefinition(route, logger);

      // Collect input data using schema-driven UI if needed
      const inputData = await this.collectInputData(endpoint, context, logger);

      // Create CLI user context
      const cliUser = context.user || (await this.getCliUser(logger));

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
        cliUserEmail: cliUser.email,
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

      // Format result
      return {
        success: result.success,
        data: result.data,
        error: result.success ? undefined : result.message,
        metadata: {
          executionTime: Date.now() - startTime,
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
  ): Promise<CliHandlerFunction | null> {
    try {
      // Import the route module dynamically
      const routeModule: RouteModule = await import(route.routePath);

      // Check for tools.cli[method] handler (endpointsHandler pattern)
      // The endpointsHandler assigns CLI handlers to tools.cli[method]
      if (
        routeModule.tools?.cli &&
        typeof routeModule.tools.cli === "object" &&
        route.method in routeModule.tools.cli
      ) {
        const cliHandlers = routeModule.tools.cli;
        const handler = cliHandlers[route.method];
        if (typeof handler === "function") {
          return handler as CliHandlerFunction;
        }
      }

      // Fallback: Check if CLI handler is directly at tools.cli (single method routes)
      if (
        routeModule.tools?.cli &&
        typeof routeModule.tools.cli === "function"
      ) {
        return routeModule.tools.cli as CliHandlerFunction;
      }

      return null;
    } catch (error) {
      logger.warn(
        `Failed to load CLI handler for ${route.routePath}:`,
        parseError(error),
      );
      return null;
    }
  }

  /**
   * Get endpoint definition from route
   */
  private async getEndpointDefinition(
    route: DiscoveredRoute,
    logger: EndpointLogger,
  ): Promise<CreateApiEndpoint<
    string,
    Methods,
    readonly (typeof UserRoleValue)[],
    UnifiedField<z.ZodTypeAny>
  > | null> {
    try {
      // Import the route module dynamically
      const routeModule: RouteModule<
        CreateApiEndpoint<
          string,
          Methods,
          readonly (typeof UserRoleValue)[],
          UnifiedField<z.ZodTypeAny>
        >
      > = await import(route.routePath);

      // Get the definitions from the tools export (new structure)
      if (routeModule.tools?.definitions) {
        const definitions = routeModule.tools.definitions;
        return (
          definitions[route.method] ||
          definitions.POST ||
          definitions.GET ||
          null
        );
      }

      // Fallback: try to import definition file directly
      const definitionPath = route.routePath.replace(
        "/route.ts",
        "/definition.ts",
      );
      try {
        const definitionModule: DefinitionModule<
          CreateApiEndpoint<
            string,
            Methods,
            readonly (typeof UserRoleValue)[],
            UnifiedField<z.ZodTypeAny>
          >
        > = await import(definitionPath);
        const definitions = definitionModule.default;
        if (definitions?.[route.method]) {
          return definitions[route.method];
        }
      } catch (error) {
        logger.debug("Error loading definition:", parseError(error));
        // Definition file not found or doesn't export expected structure
      }

      return null;
    } catch (error) {
      logger.warn(
        `Failed to load endpoint definition for ${route.routePath}:`,
        parseError(error),
      );
      return null;
    }
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
    if (context.data || (cliData && Object.keys(cliData).length > 0)) {
      inputData.data = {
        ...(context.data || {}),
        ...(cliData || {}),
      };

      // Check if all required fields are satisfied with merged data
      const mergedData = inputData.data;
      const missingRequired = this.getMissingRequiredFields(
        endpoint,
        mergedData,
        logger,
      );

      if (missingRequired.length > 0 && context.options?.interactive) {
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
          Object.keys(
            (testResult as { data?: Record<string, unknown> }).data || {},
          ).length === 0;

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
   * Get CLI user with fallback to default when database user doesn't exist
   */
  private async getCliUser(
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<CliUserType | null> {
    try {
      // Get CLI user from database by email
      const CLI_USER_EMAIL = "cli@system.local";

      const userResponse = await userRepository.getUserByEmail(
        CLI_USER_EMAIL,
        UserDetailLevel.COMPLETE,
        locale,
        logger,
      );

      if (userResponse.success && userResponse.data) {
        const user = userResponse.data;

        // Create a proper JWT payload for CLI authentication from database user
        return {
          isPublic: false,
          id: user.id,
          email: user.email,
          role: "ADMIN", // CLI user has admin privileges
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 3600,
        } as CliUserType;
      } else {
        // Fallback to default CLI user when database user doesn't exist (e.g., before seeds)
        logger.debug("CLI user not found in database, using default CLI user");
        return {
          isPublic: false,
          id: "00000000-0000-0000-0000-000000000001", // Valid UUID for CLI user
          email: "cli@system.local",
          role: "ADMIN",
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 3600,
        } as CliUserType;
      }
    } catch (error) {
      logger.debug("Error getting CLI user, using default:", error);
      // Fallback to default CLI user on any error
      return {
        isPublic: false,
        id: "00000000-0000-0000-0000-000000000001", // Valid UUID for CLI user
        email: "cli@system.local",
        role: "ADMIN",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      } as CliUserType;
    }
  }

  /**
   * Format execution result for display with enhanced rendering
   */
  formatResult(
    result: RouteExecutionResult,
    outputFormat = "pretty",
    endpointDefinition: CreateApiEndpoint<
      string,
      Methods,
      readonly (typeof UserRoleValue)[],
      UnifiedField<z.ZodTypeAny>
    > | null,
    locale: CountryLanguage,
    verbose = false,
    logger: EndpointLogger,
  ): string {
    if (!result.success) {
      if (verbose) {
        // eslint-disable-next-line i18next/no-literal-string
        return `❌ Error: ${result.error}\n\n${JSON.stringify(
          result,
          null,
          2,
        )}`;
      }
      // eslint-disable-next-line i18next/no-literal-string
      return `❌ Error: ${result.error}`;
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
   * Sanitize data for renderer to match expected type
   */
  private sanitizeDataForRenderer(
    data: CliResponseData,
  ): Record<string, string | number | boolean | null | undefined> {
    if (typeof data !== "object" || data === null) {
      return { result: String(data) };
    }

    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) {
        sanitized[key] = null;
      } else if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean" ||
        value === null
      ) {
        sanitized[key] = value;
      } else if (Array.isArray(value)) {
        // Preserve arrays for proper widget rendering (grouped lists, tables, etc.)
        sanitized[key] = value;
      } else if (typeof value === "object") {
        sanitized[key] = JSON.stringify(value);
      } else {
        sanitized[key] = String(value);
      }
    }

    return sanitized;
  }

  /**
   * Format result using enhanced CLI response renderer
   */
  private formatWithEnhancedRenderer(
    data: CliResponseData,
    endpointDefinition: CreateApiEndpoint<
      string,
      Methods,
      readonly (typeof UserRoleValue)[],
      UnifiedField<z.ZodTypeAny>
    >,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): string {
    try {
      // Extract response metadata from endpoint definition
      const metadata = responseMetadataExtractor.extractResponseMetadata(
        endpointDefinition,
        data,
      );

      // Use enhanced modular renderer with locale
      return modularCLIResponseRenderer.render(
        this.sanitizeDataForRenderer(data),
        metadata || [],
        locale,
      );
    } catch (error) {
      // Fallback to basic formatting
      logger.warn(
        "Enhanced rendering failed, falling back to basic format:",
        error,
      );
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
      const camelCaseKey = key.replace(/-([a-z])/g, (_, letter) =>
        letter.toUpperCase(),
      );

      // Convert string boolean values to actual booleans if not already parsed
      let convertedValue = value;
      if (typeof value === "string") {
        if (value.toLowerCase() === "true") {
          convertedValue = true;
        } else if (value.toLowerCase() === "false") {
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
