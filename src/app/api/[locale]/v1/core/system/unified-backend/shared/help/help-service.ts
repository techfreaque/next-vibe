/**
 * Shared Help Service
 * Unified service for command discovery and help generation
 * Used by both CLI (helpHandler) and API endpoints (help/list)
 */

import * as fs from "node:fs";
import * as path from "node:path";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { EndpointLogger } from "../endpoint-logger";
import { findRouteFiles } from "../filesystem/directory-scanner";

/**
 * Command metadata structure
 */
export interface CommandMetadata {
  alias: string;
  path: string;
  method: string;
  category: string;
  description?: string;
  aliases?: string[];
  routePath: string;
}

/**
 * Help service options
 */
export interface HelpServiceOptions {
  category?: string;
  locale?: CountryLanguage;
}

/**
 * Shared Help Service Class
 */
export class HelpService {
  /**
   * Discover all available commands from the filesystem
   */
  discoverCommands(
    logger: EndpointLogger,
    options: HelpServiceOptions = {},
  ): CommandMetadata[] {
    const locale = options.locale || "en-GLOBAL";
    const { t } = simpleT(locale);
    const commands: CommandMetadata[] = [];
    const baseDir = path.join(process.cwd(), "src/app/api/[locale]/v1/core");

    logger.debug("Discovering commands", { baseDir, options });

    // Use consolidated directory scanner
    const routeFiles = findRouteFiles(baseDir, [
      "system/builder",
      "system/launchpad",
      "system/release-tool",
    ]);

    // Process each route file
    for (const { pathSegments, fullPath: routeFile } of routeFiles) {
      const commandsFromRoute = this.extractCommandMetadata(
        pathSegments,
        routeFile,
        t,
        logger,
      );
      commands.push(...commandsFromRoute);
    }

    // Deduplicate commands by alias
    const uniqueCommands = new Map<string, CommandMetadata>();
    for (const cmd of commands) {
      if (!uniqueCommands.has(cmd.alias)) {
        uniqueCommands.set(cmd.alias, cmd);
      }
    }

    let result = Array.from(uniqueCommands.values());

    // Filter by category if specified
    if (options.category) {
      result = result.filter((cmd) =>
        cmd.category?.toLowerCase().includes(options.category!.toLowerCase()),
      );
    }

    logger.debug("Command discovery completed", {
      totalCommands: result.length,
      filtered: !!options.category,
    });

    return result;
  }

  /**
   * Extract command metadata from a route file
   */
  private extractCommandMetadata(
    pathSegments: string[],
    routeFile: string,
    t: ReturnType<typeof simpleT>["t"],
    logger: EndpointLogger,
  ): CommandMetadata[] {
    const commands: CommandMetadata[] = [];
    const definitionPath = routeFile.replace("/route.ts", "/definition.ts");

    // Generate default metadata
    const shortAlias = pathSegments.slice(-2).join(":");
    const fullAlias = pathSegments.join(":");
    const apiPath = `/${pathSegments.join("/")}`;

    // Determine category from path segments
    const category = this.extractCategory(pathSegments);

    try {
      // Try to load definition file
      if (!fs.existsSync(definitionPath)) {
        // If no definition exists, create basic metadata
        return [
          {
            alias: shortAlias,
            path: apiPath,
            method: "POST",
            category,
            description: t(
              "app.api.v1.core.system.unifiedBackend.cli.vibe.executeCommand",
            ),
            aliases: [shortAlias, fullAlias],
            routePath: routeFile,
          },
        ];
      }

      // Load definition module
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const definition = require(definitionPath) as {
        default?: Record<string, Record<string, string | string[]>>;
      };
      const defaultExport =
        definition.default ||
        (definition as Record<string, Record<string, string | string[]>>);

      // Extract methods from exported handlers
      const actualMethods = Object.keys(defaultExport).filter((key) =>
        ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"].includes(
          key,
        ),
      );

      if (actualMethods.length === 0) {
        logger.debug("No methods found in definition", { definitionPath });
        return [];
      }

      // Extract metadata from the first method
      const firstMethod = defaultExport[actualMethods[0]];
      let customAliases: string[] = [];
      let endpointDescription: string | undefined;

      if (firstMethod && Array.isArray(firstMethod.aliases)) {
        customAliases = firstMethod.aliases.filter(
          (alias): alias is string => typeof alias === "string",
        );
      }

      if (firstMethod && typeof firstMethod.description === "string") {
        endpointDescription = firstMethod.description;
        // Try to translate if it's a translation key
        if (endpointDescription.includes(".")) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            endpointDescription = t(endpointDescription as any);
          } catch {
            // Keep original if translation fails
          }
        }
      }

      // Use endpoint description or fallback
      const description =
        endpointDescription ||
        t("app.api.v1.core.system.unifiedBackend.cli.vibe.executeCommand");

      // Combine all aliases
      const allAliases = [
        shortAlias,
        ...(fullAlias !== shortAlias ? [fullAlias] : []),
        ...customAliases,
      ];

      // Create command metadata for each method
      for (const method of actualMethods) {
        // Use the primary alias (first custom alias if available, otherwise short alias)
        const primaryAlias =
          customAliases.length > 0 ? customAliases[0] : shortAlias;

        commands.push({
          alias: primaryAlias,
          path: apiPath,
          method,
          category,
          description,
          aliases: allAliases,
          routePath: routeFile,
        });
      }
    } catch (error) {
      logger.debug("Failed to load definition", {
        definitionPath,
        error: error instanceof Error ? error.message : String(error),
      });

      // Fallback to basic metadata
      commands.push({
        alias: shortAlias,
        path: apiPath,
        method: "POST",
        category,
        description: t(
          "app.api.v1.core.system.unifiedBackend.cli.vibe.executeCommand",
        ),
        aliases: [shortAlias, fullAlias],
        routePath: routeFile,
      });
    }

    return commands;
  }

  /**
   * Extract category from path segments
   */
  private extractCategory(pathSegments: string[]): string {
    // Try to extract a meaningful category from the path
    // e.g., ["core", "system", "db", "ping"] -> "system/db"
    if (pathSegments.length >= 2) {
      return pathSegments.slice(0, -1).join("/");
    }
    return pathSegments[0] || "general";
  }

  /**
   * Convert command metadata to DiscoveredRoute format (for CLI)
   */
  commandToDiscoveredRoute(command: CommandMetadata): {
    alias: string;
    path: string;
    method: string;
    routePath: string;
    description?: string;
  } {
    return {
      alias: command.alias,
      path: command.path,
      method: command.method,
      routePath: command.routePath,
      description: command.description,
    };
  }
}

/**
 * Shared help service singleton
 */
export const helpService = new HelpService();
