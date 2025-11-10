/**
 * Shared Help Service
 * Unified service for command discovery and help generation
 * Used by both CLI (helpHandler) and API endpoints (help/list)
 */

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { EndpointLogger } from "../../logger/endpoint";
import { routeRegistry } from "../registry/route-registry";
import { endpointRegistry } from "../../registry/endpoint-registry";

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
   * Discover all available commands from RouteRegistry
   */
  discoverCommands(
    logger: EndpointLogger,
    options: HelpServiceOptions = {},
  ): CommandMetadata[] {
    const locale = options.locale || "en-GLOBAL";
    const { t } = simpleT(locale);
    const commands: CommandMetadata[] = [];

    logger.debug("Discovering commands", {
      category: options.category,
      locale: options.locale,
    });

    // Get all route paths from RouteRegistry
    const routePaths = routeRegistry.getAllPaths();

    // Process each route path
    for (const routePath of routePaths) {
      // Convert route path to path segments
      // e.g., "core/system/help" -> ["system", "help"]
      const pathSegments = routePath.split("/");

      const commandsFromRoute = this.extractCommandMetadataFromPath(
        pathSegments,
        routePath,
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

    let result = [...uniqueCommands.values()];

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
   * Extract command metadata using EndpointRegistry
   */
  private extractCommandMetadataFromPath(
    pathSegments: string[],
    routePath: string,
    t: ReturnType<typeof simpleT>["t"],
    logger: EndpointLogger,
  ): CommandMetadata[] {
    const commands: CommandMetadata[] = [];

    // Generate default metadata
    const shortAlias = pathSegments.slice(-2).join(":");
    const fullAlias = pathSegments.join(":");
    const apiPath = `/${routePath}`;

    // Determine category from path segments
    const category = this.extractCategory(pathSegments);

    // Try to load endpoint definition using registry
    const definitionResult = endpointRegistry.loadDefinition<
      Record<string, { aliases?: string[]; description?: string }>
    >({ routePath, method: "POST" }, logger);

    // If no endpoint definition found, create basic metadata
    if (!definitionResult.definition) {
      logger.debug("No endpoint definition found", { routePath });
      return [
        {
          alias: shortAlias,
          path: apiPath,
          method: "POST",
          category,
          description: t(
            "app.api.v1.core.system.unifiedInterface.cli.vibe.executeCommand",
          ),
          aliases: [shortAlias, fullAlias],
          routePath: apiPath,
        },
      ];
    }

    // Extract available methods
    const definition = definitionResult.definition;
    const actualMethods = Object.keys(definition).filter((key) =>
      ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"].includes(
        key,
      ),
    );

    if (actualMethods.length === 0) {
      logger.debug("No methods found in endpoint definition", { routePath });
      return [];
    }

    // Extract metadata from the first method
    const firstMethodDef = definition[actualMethods[0]];
    const customAliases = Array.isArray(firstMethodDef?.aliases)
      ? firstMethodDef.aliases.filter(
          (alias): alias is string => typeof alias === "string",
        )
      : [];

    let endpointDescription: string | undefined = firstMethodDef?.description;
    if (endpointDescription?.includes(".")) {
      try {
        endpointDescription = t(endpointDescription as Parameters<typeof t>[0]);
      } catch {
        // Keep original if translation fails
      }
    }

    // Use endpoint description or fallback
    const description =
      endpointDescription ||
      t("app.api.v1.core.system.unifiedInterface.cli.vibe.executeCommand");

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
        routePath: apiPath,
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
