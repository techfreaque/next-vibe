/* eslint-disable no-console */
/* eslint-disable i18next/no-literal-string */
/**
 * CLI Entry Point System
 * Core CLI execution functionality that can execute any route.ts from generated index files
 * Integrates with schema-driven handlers for enhanced CLI experience
 */

import * as fs from "fs";
import { parseError } from "next-vibe/shared/utils";
import * as path from "path";

import { UserDetailLevel } from "@/app/api/[locale]/v1/core/user/enum";
import { userRepository } from "@/app/api/[locale]/v1/core/user/repository";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import type { EndpointLogger } from "./endpoints/endpoint-handler/logger";
import { helpHandler } from "./endpoints/renderers/cli-ui/help-handler";
import { interactiveModeHandler } from "./endpoints/renderers/cli-ui/interactive-mode-handler";
import { getConfig } from "./utils/config-stub";
import { memoryMonitor } from "./utils/performance";
import type {
  CliRequestData,
  RouteExecutionResult,
} from "./utils/route-delegation-handler";
import { routeDelegationHandler } from "./utils/route-delegation-handler";



/**
 * Endpoint definition type for CLI
 */
interface EndpointDefinition {
  title?: string;
  description?: string;
  requestSchema?: Record<string, string | number | boolean>;
  requestUrlParamsSchema?: Record<string, string | number | boolean>;
  responseSchema?: Record<string, string | number | boolean>;
  fields?: Record<string, string | number | boolean>;
}

// Types for CLI execution - compatible with RouteExecutionContext
interface CliExecutionOptions {
  data?: CliRequestData;
  urlParams?: Record<string, string | number | boolean | null | undefined>;
  cliArgs?: {
    positionalArgs: string[];
    namedArgs: Record<string, string>;
  };
  user?: {
    isPublic: boolean;
    id?: string;
    email?: string;
    role?: string;
    iat?: number;
    exp?: number;
  };
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
  initialize(): void {
    if (this.initialized) {
      return;
    }

    const config = getConfig();

    try {
      this.logger.debug(
        this.t("app.api.v1.core.system.cli.vibe.vibe.startingUp"),
      );

      memoryMonitor.snapshot();

      this.discoverRoutes(config.apiBaseDir);

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
     this.logger.error("Route discovery failed:", {
        baseDir: config.apiBaseDir,
        error: error instanceof Error ? error.message : String(error),
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
    options: CliExecutionOptions = {},
  ): Promise<RouteExecutionResult> {
    if (!this.initialized) {
      this.initialize();
    }

    // Handle special commands
    if (command === "help") {
      return await this.showHelp(options);
    }

    if (command === "interactive" || !command) {
      return await this.startInteractiveMode(this.logger);
    }

    // Find the route
    const route = this.findRoute(command);
    if (!route) {
      const availableCommands = this.routes.map((r) => r.alias).slice(0, 10);
      this.logger.error(
        this.t("app.api.v1.core.system.cli.vibe.errors.routeNotFound"),
        { command, availableCommands },
      );
      return {
        success: false,
        error: this.t("app.api.v1.core.system.cli.vibe.errors.routeNotFound"),
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
    let cliUser = options.user;
    if (!cliUser) {
      // For seed commands, always use fallback authentication since we're creating the users
      const isSeedCommand = command.includes("seed") || command.includes("db:seed");

      if (isSeedCommand) {
        // Use fallback authentication for seed commands
        this.logger.debug("Using fallback CLI authentication for seed command");
        cliUser = {
          isPublic: false,
          id: "00000000-0000-0000-0000-000000000001",
          email: "cli@system.local",
          role: "ADMIN",
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 3600,
        };
      } else {
        // For non-seed commands, try to get the real user from database
        cliUser = (await this.getCliUser(this.logger)) || undefined;
      }
    }

    // Create execution context
    const context = {
      command,
      data: options.data,
      urlParams: options.urlParams,
      cliArgs: options.cliArgs, // Pass CLI arguments
      user: cliUser
        ? {
            ...cliUser,
            isPublic: cliUser.isPublic ?? false,
          }
        : undefined,
      locale: options.locale || this.locale,
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
        await this.getEndpointDefinition(discoveredRoute);

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
        this.t("app.api.v1.core.system.cli.vibe.errors.executionFailed", {
          error: error instanceof Error ? error.message : String(error),
        }),
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
  private discoverRoutes(baseDir: string): void {
    const _baseDir = path.join(process.cwd(), baseDir);

    // Collect all route files first
    const routeFiles = this.findAllRouteFiles(_baseDir);

    // Process each route file
    for (const { pathSegments, routeFile } of routeFiles) {
      this.addRoute(pathSegments, routeFile);
    }
  }

  /**
   * Find all route.ts files recursively
   */
  private findAllRouteFiles(
    dir: string,
    currentPath: string[] = [],
  ): Array<{ pathSegments: string[]; routeFile: string }> {
    const results: Array<{ pathSegments: string[]; routeFile: string }> = [];

    if (!fs.existsSync(dir)) {
      return results;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith(".")) {
        const fullPath = path.join(dir, entry.name);
        const newPath = [...currentPath, entry.name];

        // Check if this directory has a route.ts file
        const routeFile = path.join(fullPath, "route.ts");
        if (fs.existsSync(routeFile)) {
          results.push({ pathSegments: newPath, routeFile });
        }

        // Continue scanning subdirectories
        results.push(...this.findAllRouteFiles(fullPath, newPath));
      }
    }

    return results;
  }

  /**
   * Add route - registers route with default aliases
   * Aliases from definition.ts will be loaded lazily when needed
   */
  private addRoute(pathSegments: string[], routeFile: string): void {
    // Generate default aliases
    const shortAlias = pathSegments.slice(-2).join(":");
    const fullAlias = pathSegments.join(":");
    const apiPath = `/${pathSegments.join("/")}`;

    // All possible HTTP methods - route-delegation-handler will check which ones exist
    const allMethods = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

    // Register route with short alias
    for (const method of allMethods) {
      this.routes.push({
        alias: shortAlias,
        path: apiPath,
        method,
        routePath: routeFile,
        description: this.t("app.api.v1.core.system.cli.vibe.vibe.executeCommand"),
      });
    }

    // Register route with full alias if different
    if (fullAlias !== shortAlias) {
      for (const method of allMethods) {
        this.routes.push({
          alias: fullAlias,
          path: apiPath,
          method,
          routePath: routeFile,
          description: this.t("app.api.v1.core.system.cli.vibe.vibe.executeCommand"),
        });
      }
    }
  }

  /**
   * Find a route by command
   * Checks definition files for custom aliases if not found in registered routes
   */
  private findRoute(command: string): CliRouteMetadata | null {
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

    // Check definition files for custom aliases (synchronous check)
    const aliasRoute = this.findRouteByDefinitionAlias(command);
    if (aliasRoute) {
      return aliasRoute;
    }

    return null;
  }

  /**
   * Find route by checking definition files for custom aliases
   */
  private findRouteByDefinitionAlias(command: string): CliRouteMetadata | null {
    // Get unique route files
    const uniqueRouteFiles = [...new Set(this.routes.map(r => r.routePath))];

    for (const routeFile of uniqueRouteFiles) {
      const definitionPath = routeFile.replace("/route.ts", "/definition.ts");

      if (!fs.existsSync(definitionPath)) {
        continue;
      }

      try {
        // Use synchronous require for faster lookup
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const definitionModule = require(definitionPath);

        // Check default export
        if (definitionModule.default && typeof definitionModule.default === "object") {
          for (const methodKey of Object.keys(definitionModule.default)) {
            const methodDef = definitionModule.default[methodKey];
            if (methodDef && typeof methodDef === "object" && Array.isArray(methodDef.aliases)) {
              if (methodDef.aliases.includes(command)) {
                // Found it! Return a route with this alias
                const existingRoute = this.routes.find(r => r.routePath === routeFile);
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
    for (const [basePath, routes] of Array.from(routeGroups)) {
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
    options: CliExecutionOptions = {},
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
      options.locale || this.locale,
      this.logger,
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
      await interactiveModeHandler.startInteractiveMode(this.routes, logger);
      return { success: true };
    } catch (error) {
      logger.error(
        "app.api.v1.core.system.cli.vibe.errors.executionFailed",
        error,
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Get CLI user with fallback to default when database user doesn't exist
   */
  private async getCliUser(logger: EndpointLogger): Promise<{
    isPublic: boolean;
    id?: string;
    email?: string;
    role?: string;
    iat?: number;
    exp?: number;
  } | null> {
    try {
      // Get CLI user from database by email
      const CLI_USER_EMAIL = "cli@system.local";

      const userResponse = await userRepository.getUserByEmail(
        CLI_USER_EMAIL,
        UserDetailLevel.COMPLETE,
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
        };
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
        };
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
      };
    }
  }

  /**
   * Get endpoint definition from route for enhanced rendering
   */
  private async getEndpointDefinition(
    route: CliRouteMetadata,
  ): Promise<EndpointDefinition | null> {
    try {
      // Import the route module dynamically
      const routeModule = (await import(route.routePath)) as {
        tools?: {
          definitions?: Record<string, EndpointDefinition>;
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
          default?: Record<string, EndpointDefinition>;
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
