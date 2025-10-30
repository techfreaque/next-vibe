/* eslint-disable no-console */
/* eslint-disable i18next/no-literal-string */
/**
 * CLI Entry Point System
 * Core CLI execution functionality that can execute any route.ts from generated index files
 * Integrates with schema-driven handlers for enhanced CLI experience
 */

import * as fs from "node:fs";
import { parseError } from "next-vibe/shared/utils";
import * as path from "node:path";

import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import type { EndpointLogger } from "../shared/logger/endpoint";
import type { EndpointDefinition } from "../shared/types/endpoint";
import { getCliUserForCommand } from "../shared/server-only/auth/cli-user";
import type { ParameterValue } from "../shared/server-only/execution/executor";
import { findRouteFiles } from "../shared/server-only/filesystem/scanner";
import { memoryMonitor } from "../shared/server-only/utils/performance";
import type { InferJwtPayloadTypeFromRoles } from "../shared/types/handler";
import { getConfig } from "./config";
import type {
  CliRequestData,
  RouteExecutionContext,
  RouteExecutionResult,
} from "./route-executor";
import { routeDelegationHandler } from "./route-executor";
import { helpHandler } from "./widgets/help-handler";
import { interactiveModeHandler } from "./widgets/interactive-mode-handler";

// Types for CLI execution - compatible with RouteExecutionContext
interface CliExecutionOptions {
  data?: CliRequestData;
  urlPathParams?: Record<string, string | number | boolean | null | undefined>;
  cliArgs?: {
    positionalArgs: string[];
    namedArgs: Record<string, string | number | boolean>;
  };
  user?: InferJwtPayloadTypeFromRoles<readonly (typeof UserRoleValue)[]>;
  locale?: CountryLanguage;
  dryRun?: boolean;
  interactive?: boolean;
  verbose?: boolean;
  output?: "json" | "table" | "pretty";
  userType?: string;
  category?: string;
  format?: string;
  examples?: boolean;
  parameters?: boolean;
}

/**
 * CLI Route Metadata
 */
interface CliRouteMetadata {
  alias: string;
  path: string;
  method: string;
  routePath: string;
  description?: string;
}

/**
 * CLI Entry Point Class
 * Discovers and executes routes from the filesystem
 */
export class CliEntryPoint {
  private routes: CliRouteMetadata[] = [];
  private initialized = false;

  constructor(
    private logger: EndpointLogger,
    private t: TFunction,
    private locale: CountryLanguage,
  ) {}

  /**
   * Initialize the CLI system by discovering routes
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    const config = getConfig();

    try {
      this.logger.debug(
        this.t("app.api.v1.core.system.unifiedInterface.cli.vibe.startingUp"),
      );

      memoryMonitor.snapshot();

      await this.discoverRoutes(config.apiBaseDir);

      const validRoutes = this.routes.length;

      // Only show route discovery info in this.logger.isDebugEnabled mode
      if (this.logger.isDebugEnabled) {
        this.logger.debug("Route discovery completed", { validRoutes });
      }

      // Check for potential memory issues
      const memCheck = memoryMonitor.checkMemoryLeak();
      if (memCheck.hasLeak && this.logger.isDebugEnabled) {
        this.logger.warn(`⚠️  Memory usage concern: ${memCheck.message}`);
      }

      this.initialized = true;
    } catch (error) {
      const parsedError = parseError(error);
      this.logger.error("Route discovery failed:", {
        baseDir: config.apiBaseDir,
        error: parsedError.message,
      });
      // Set initialized to true to prevent infinite loops, but routes will be empty
      this.initialized = true;
    }
  }

  /**
   * Execute a command using the new schema-driven system
   */
  async executeCommand(
    command: string,
    options: CliExecutionOptions,
  ): Promise<RouteExecutionResult> {
    if (!this.initialized) {
      await this.initialize();
    }

    // Handle special commands
    if (command === "interactive" || !command) {
      return await this.startInteractiveMode(this.logger);
    }

    // Find the route
    const route = await this.findRoute(command);
    if (!route) {
      const availableCommands = this.routes.map((r) => r.alias).slice(0, 10);
      this.logger.error(
        this.t(
          "app.api.v1.core.system.unifiedInterface.cli.vibe.errors.routeNotFound",
        ),
        { command, availableCommands },
      );
      return {
        success: false,
        error: this.t(
          "app.api.v1.core.system.unifiedInterface.cli.vibe.errors.routeNotFound",
        ),
      };
    }

    // Convert to DiscoveredRoute format
    const discoveredRoute = {
      alias: route.alias,
      path: route.path,
      method: route.method,
      routePath: route.routePath,
      description: route.description,
    };

    // Get CLI user for authentication if not provided
    const cliUser = options.user
      ? options.user
      : await getCliUserForCommand(
          command,
          this.logger,
          options.locale || "en-GLOBAL",
        );

    // Create execution context
    const context: RouteExecutionContext = {
      toolName: command,
      data: (options.data || {}) as { [key: string]: ParameterValue },
      urlPathParams: options.urlPathParams,
      cliArgs: options.cliArgs, // Pass CLI arguments
      user: cliUser,
      locale: options.locale || this.locale,
      logger: this.logger,
      options: {
        dryRun: options.dryRun,
        interactive: options.interactive,
        output: options.output,
      },
    };

    try {
      // Execute using route delegation handler
      const result = await routeDelegationHandler.executeRoute(
        discoveredRoute,
        context,
        this.logger,
        this.locale,
        this.t,
      );

      // Get endpoint definition for enhanced rendering
      const endpointDefinition =
        await this.getCreateApiEndpoint(discoveredRoute);

      // Format and display result with enhanced rendering support
      const formattedResult = routeDelegationHandler.formatResult(
        result,
        options.output || "pretty",
        endpointDefinition,
        options.locale || this.locale,
        this.logger.isDebugEnabled || false,
        this.logger,
      );
      // Output the formatted result directly to stdout for CLI usage

      process.stdout.write(`\n${formattedResult}\n`);

      return result;
    } catch (error) {
      process.stderr.write(
        this.t(
          "app.api.v1.core.system.unifiedInterface.cli.vibe.errors.executionFailed",
          {
            error: error instanceof Error ? error.message : String(error),
          },
        ),
      );
      this.logger.error("Command execution failed", {
        command,
        error: parseError(error),
      });
      return {
        success: false,
        error: parseError(error).message,
      };
    }
  }

  /**
   * Discover routes from the filesystem
   */
  private async discoverRoutes(baseDir: string): Promise<void> {
    const _baseDir = path.join(process.cwd(), baseDir);

    // Use consolidated directory scanner
    const routeFiles = findRouteFiles(_baseDir, [
      "system/builder",
      "system/launchpad",
      "system/release-tool",
    ]);

    // Process each route file
    for (const { pathSegments, fullPath: routeFile } of routeFiles) {
      await this.addRoute(pathSegments, routeFile);
    }
  }

  /**
   * Add route - registers route with actual methods from definition
   */
  private async addRoute(
    pathSegments: string[],
    routeFile: string,
  ): Promise<void> {
    // Generate default aliases
    const shortAlias = pathSegments.slice(-2).join(":");
    const fullAlias = pathSegments.join(":");
    const apiPath = `/${pathSegments.join("/")}`;

    // Try to load definition to get actual methods and aliases
    const definitionPath = routeFile.replace("/route.ts", "/definition.ts");
    let actualMethods: string[] = [];
    let customAliases: string[] = [];
    let endpointDescription: string | undefined;

    try {
      const definitionImport = (await import(definitionPath)) as
        | Record<string, EndpointDefinition>
        | { default: Record<string, EndpointDefinition> };
      const definition =
        "default" in definitionImport
          ? definitionImport.default
          : definitionImport;

      let defaultExport: Record<string, EndpointDefinition>;
      if (typeof definition === "object" && definition !== null) {
        defaultExport = definition as Record<string, EndpointDefinition>;
      } else {
        defaultExport = {};
      }

      // Extract methods from exported handlers
      actualMethods = Object.keys(defaultExport).filter((key) =>
        ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"].includes(
          key,
        ),
      );

      // Extract custom aliases and description if available
      if (actualMethods.length > 0) {
        const firstMethodKey = actualMethods[0];
        if (firstMethodKey) {
          const firstMethod = defaultExport[firstMethodKey];
          if (firstMethod?.aliases) {
            customAliases = [...firstMethod.aliases];
          }
          // Extract description from endpoint definition
          if (
            firstMethod?.description &&
            typeof firstMethod.description === "string"
          ) {
            endpointDescription = firstMethod.description;
          }
        }
      }
    } catch (error) {
      // If definition can't be loaded, fall back to trying all methods
      actualMethods = ["POST", "GET", "PUT", "PATCH", "DELETE"];
      // Log error for debugging if verbose
      if (this.logger) {
        this.logger.debug?.("Failed to load definition for aliases", {
          definitionPath,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Use actual methods or fallback
    const methodsToRegister =
      actualMethods.length > 0
        ? actualMethods
        : ["POST", "GET", "PUT", "PATCH", "DELETE"];

    // Get description - use endpoint description if available, with translation fallback
    const getDescription = (): string => {
      if (endpointDescription) {
        // Try to translate if it's a translation key
        if (endpointDescription.includes(".")) {
          try {
            // Translation keys are validated at compile time via TranslationKey type
            // Runtime strings need to be checked dynamically
            const tFunc = this.t.bind(this);
            return tFunc(endpointDescription as Parameters<typeof tFunc>[0]);
          } catch {
            return endpointDescription;
          }
        }
        return endpointDescription;
      }
      return this.t(
        "app.api.v1.core.system.unifiedInterface.cli.vibe.executeCommand",
      );
    };

    const description = getDescription();

    // Register route with short alias
    for (const method of methodsToRegister) {
      this.routes.push({
        alias: shortAlias,
        path: apiPath,
        method,
        routePath: routeFile,
        description,
      });
    }

    // Register route with full alias if different
    if (fullAlias !== shortAlias) {
      for (const method of methodsToRegister) {
        this.routes.push({
          alias: fullAlias,
          path: apiPath,
          method,
          routePath: routeFile,
          description,
        });
      }
    }

    // Register custom aliases from definition
    for (const customAlias of customAliases) {
      for (const method of methodsToRegister) {
        this.routes.push({
          alias: customAlias,
          path: apiPath,
          method,
          routePath: routeFile,
          description,
        });
      }
    }
  }

  /**
   * Find a route by command
   * Checks definition files for custom aliases if not found in registered routes
   */
  private async findRoute(command: string): Promise<CliRouteMetadata | null> {
    // Safety check for command parameter
    if (!command || typeof command !== "string") {
      return null;
    }

    // Direct alias match
    let route = this.routes.find((r) => r.alias === command);
    if (route) {
      return route;
    }

    // Colon format (core:system:db:ping)
    if (command.includes(":")) {
      const pathParts = command.split(":");
      const apiPath = `/${pathParts.join("/")}`;
      route = this.routes.find((r) => r.path === apiPath);
      if (route) {
        return route;
      }
    }

    // Check definition files for custom aliases
    const aliasRoute = await this.findRouteByDefinitionAlias(command);
    if (aliasRoute) {
      return aliasRoute;
    }

    return null;
  }

  /**
   * Find route by checking definition files for custom aliases
   */
  private async findRouteByDefinitionAlias(
    command: string,
  ): Promise<CliRouteMetadata | null> {
    // Get unique route files
    const uniqueRouteFiles = [...new Set(this.routes.map((r) => r.routePath))];

    for (const routeFile of uniqueRouteFiles) {
      const definitionPath = routeFile.replace("/route.ts", "/definition.ts");

      if (!fs.existsSync(definitionPath)) {
        continue;
      }

      try {
        const definitionImport = (await import(definitionPath)) as
          | Record<string, unknown>
          | { default: Record<string, unknown> };
        const definitionModule =
          "default" in definitionImport
            ? definitionImport.default
            : definitionImport;

        // Check default export
        let definitions: Record<string, unknown> | undefined;
        if (typeof definitionModule === "object" && definitionModule !== null) {
          definitions = definitionModule as Record<string, unknown>;
        }

        if (definitions && typeof definitions === "object") {
          for (const methodKey of Object.keys(definitions)) {
            const methodDef = definitions[methodKey];
            if (
              methodDef &&
              typeof methodDef === "object" &&
              "aliases" in methodDef &&
              methodDef.aliases
            ) {
              const aliasArray = [...(methodDef.aliases as Iterable<string>)];
              if (aliasArray.includes(command)) {
                const existingRoute = this.routes.find(
                  (r) => r.routePath === routeFile,
                );
                if (existingRoute) {
                  return {
                    ...existingRoute,
                    alias: command,
                  };
                }
              }
            }
          }
        }
      } catch {
        // Ignore errors
      }
    }

    return null;
  }

  /**
   * Get all routes
   */
  getAllRoutes(): CliRouteMetadata[] {
    return this.routes;
  }

  /**
   * Show discovered routes with their aliases
   */
  showDiscoveredRoutes(): void {
    console.log(`\n📊 Total routes discovered: ${this.routes.length}\n`);

    // Group routes by their base path for better organization
    const routeGroups = new Map<string, CliRouteMetadata[]>();

    for (const route of this.routes) {
      // Safety check for route.alias
      if (!route.alias || typeof route.alias !== "string") {
        continue;
      }

      const basePath = route.alias.split(":").slice(0, -1).join(":");
      if (!routeGroups.has(basePath)) {
        routeGroups.set(basePath, []);
      }
      routeGroups.get(basePath)!.push(route);
    }

    // Display routes grouped by base path
    for (const [basePath, routes] of routeGroups) {
      console.log(`📁 ${basePath || "root"}:`);
      for (const route of routes) {
        console.log(`  ✅ ${route.alias} → ${route.path}`);
        if (route.description) {
          console.log(`     ${route.description}`);
        }
      }
      console.log(String());
    }
  }

  /**
   * Show help using the help handler
   */
  private async showHelp(
    options: Partial<Pick<CliExecutionOptions, "format">>,
  ): Promise<RouteExecutionResult> {
    const helpOptions = {
      format: "text" as const,
      includeExamples: true,
      includeParameters: true,
      category: undefined,
    };

    const helpContent = await helpHandler.generateHelp(
      this.routes,
      helpOptions,
    );

    const formattedHelp =
      options.format === "json"
        ? helpHandler.formatAsJson(helpContent)
        : helpHandler.formatAsText(helpContent);

    console.log(formattedHelp);
    return {
      success: true,
      data: {
        title: helpContent.title,
        description: helpContent.description,
        usage: helpContent.usage,
        commandCount: helpContent.commands?.length || 0,
      },
    };
  }

  /**
   * Start interactive mode
   */
  private async startInteractiveMode(
    logger: EndpointLogger,
  ): Promise<RouteExecutionResult> {
    try {
      const cliUser = await getCliUserForCommand(
        "interactive",
        logger,
        this.locale,
      );
      await interactiveModeHandler.startInteractiveMode(
        cliUser,
        this.locale,
        this.routes,
        logger,
      );
      return { success: true };
    } catch (error) {
      const parsedError = parseError(error);
      logger.error(
        "app.api.v1.core.system.unifiedInterface.cli.vibe.errors.executionFailed",
        parsedError,
      );
      return {
        success: false,
        error: parsedError.message,
      };
    }
  }

  /**
   * Get endpoint definition from route for enhanced rendering
   */
  private async getCreateApiEndpoint(
    route: CliRouteMetadata,
  ): Promise<unknown | null> {
    try {
      // Import the route module dynamically
      const routeModule = (await import(route.routePath)) as {
        tools?: {
          definitions?: Record<string, unknown>;
        };
      };

      // Get the definitions from the tools export (new structure)
      if (routeModule.tools?.definitions) {
        const definitions = routeModule.tools.definitions;
        return definitions[route.method] || definitions.POST || definitions.GET;
      }

      // Fallback: try to import definition file directly
      const definitionPath = route.routePath.replace(
        "/route.ts",
        "/definition.ts",
      );
      try {
        const definitionModule = (await import(definitionPath)) as {
          default?: Record<string, unknown>;
        };
        const definitions = definitionModule.default;
        if (definitions?.[route.method]) {
          return definitions[route.method];
        }
      } catch {
        // Definition file not found or doesn't export expected structure
      }

      return null;
    } catch {
      // Silently ignore endpoint definition loading errors
      return null;
    }
  }
}
