/**
 * Route Handlers Generator Repository
 * Generates route-handlers.ts with dynamic imports and flat path structure
 */

import "server-only";

import { join } from "node:path";

import type { ResponseType as BaseResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  formatCount,
  formatDuration,
  formatGenerator,
  formatWarning,
} from "@/app/api/[locale]/system/unified-interface/shared/logger/formatters";
import type { ApiSection } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { PATH_SEPARATOR } from "@/app/api/[locale]/system/unified-interface/shared/utils/path";

import {
  extractPathKey,
  findFilesRecursively,
  generateAbsoluteImportPath,
  generateFileHeader,
  writeGeneratedFile,
} from "../shared/utils";

// Type definitions
interface RouteHandlersRequestType {
  outputFile: string;
  dryRun: boolean;
}

interface RouteHandlersResponseType {
  success: boolean;
  message: string;
  routesFound: number;
  duration: number;
  outputFile?: string;
}

/**
 * Route Handlers Generator Repository Interface
 */
interface RouteHandlersGeneratorRepository {
  generateRouteHandlers(
    data: RouteHandlersRequestType,
    logger: EndpointLogger,
  ): Promise<BaseResponseType<RouteHandlersResponseType>>;
}

/**
 * Route Handlers Generator Repository Implementation
 */
class RouteHandlersGeneratorRepositoryImpl implements RouteHandlersGeneratorRepository {
  async generateRouteHandlers(
    data: RouteHandlersRequestType,
    logger: EndpointLogger,
  ): Promise<BaseResponseType<RouteHandlersResponseType>> {
    const startTime = Date.now();

    try {
      const outputFile = data.outputFile;
      logger.debug(`Starting route handlers generation: ${outputFile}`);

      // Discover route files
      // eslint-disable-next-line i18next/no-literal-string
      const apiCorePath = ["src", "app", "api", "[locale]"];
      const startDir = join(process.cwd(), ...apiCorePath);

      logger.debug("Discovering route files");
      const routeFiles = findFilesRecursively(startDir, "route.ts");

      logger.debug(`Found ${routeFiles.length} route files`);

      // Check for routes without definitions - filter them out
      const definitionFiles = findFilesRecursively(startDir, "definition.ts");
      const routesWithoutDefinition: string[] = [];
      const validRouteFiles: string[] = [];

      for (const routeFile of routeFiles) {
        const definitionPath = routeFile.replace("/route.ts", "/definition.ts");
        if (!definitionFiles.includes(definitionPath)) {
          routesWithoutDefinition.push(routeFile);
        } else {
          validRouteFiles.push(routeFile);
        }
      }

      if (routesWithoutDefinition.length > 0) {
        const routeList = routesWithoutDefinition
          .map(
            (r) => `    • ${r.replace(process.cwd(), "").replace(/^\//, "")}`,
          )
          .join("\n");
        logger.debug(
          formatWarning(
            `Skipped ${formatCount(routesWithoutDefinition.length, "route")} without matching definition:\n${routeList}`,
          ),
        );
      }

      // Generate content with only valid route files
      const content = await this.generateContent(validRouteFiles, logger);

      // Write file
      await writeGeneratedFile(outputFile, content, data.dryRun);

      const duration = Date.now() - startTime;

      logger.info(
        formatGenerator(
          `Generated route handlers file with ${formatCount(validRouteFiles.length, "route")} in ${formatDuration(duration)}`,
          "🔗",
        ),
      );

      return success({
        success: true,
        message: "app.api.system.generators.endpoints.success.generated",
        routesFound: routeFiles.length,
        duration,
        outputFile: data.dryRun ? undefined : outputFile,
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error("Route handlers generation failed", {
        error: parseError(error),
        duration,
      });

      return fail({
        message: "app.api.system.generators.endpoints.post.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          duration,
        },
      });
    }
  }

  /**
   * Extract HTTP methods from definition file (async)
   * We extract from definition instead of route because route files have server-only dependencies
   */
  private async extractMethodsFromDefinition(
    routeFile: string,
  ): Promise<string[]> {
    const definitionPath = routeFile.replace("/route.ts", "/definition.ts");
    try {
      const definition = (await import(definitionPath)) as {
        default?: ApiSection;
      };
      const defaultExport = definition.default;

      if (!defaultExport) {
        return [];
      }

      // Get all HTTP methods from the definition
      const methods = Object.keys(defaultExport).filter((key) =>
        ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"].includes(
          key,
        ),
      );
      return methods;
    } catch {
      return [];
    }
  }

  /**
   * Extract aliases from definition file (async)
   */
  private async extractAliasesFromDefinition(
    routeFile: string,
  ): Promise<Array<{ alias: string; method: string }>> {
    const definitionPath = routeFile.replace("/route.ts", "/definition.ts");
    try {
      const definition = (await import(definitionPath)) as {
        default?: Record<string, { aliases?: string[] }>;
      };
      const defaultExport = definition.default;

      if (!defaultExport) {
        return [];
      }

      const aliasesWithMethods: Array<{ alias: string; method: string }> = [];

      // Get aliases from each method
      for (const method of Object.keys(defaultExport)) {
        const methodDef = defaultExport[method];
        if (methodDef?.aliases && Array.isArray(methodDef.aliases)) {
          for (const alias of methodDef.aliases) {
            aliasesWithMethods.push({ alias, method });
          }
        }
      }

      return aliasesWithMethods;
    } catch {
      // Definition file doesn't exist or can't be loaded
    }
    return [];
  }

  /**
   * Generate route handlers content with dynamic imports and real aliases from definitions
   * Main paths include method suffix (e.g., "core/agent/ai-stream/POST")
   * Aliases also include method from their definition
   */
  private async generateContent(
    routeFiles: string[],
    logger: EndpointLogger,
  ): Promise<string> {
    const pathMap: Record<string, { importPath: string; method: string }> = {};
    const allPaths: string[] = [];

    // Build path map with method suffixes and aliases (deduplicate)
    for (const routeFile of routeFiles) {
      const { path } = extractPathKey(routeFile);
      const importPath = generateAbsoluteImportPath(routeFile, "route");

      // Get methods for this route from definition file
      const methods = await this.extractMethodsFromDefinition(routeFile);

      if (methods.length === 0) {
        logger.warn(
          formatWarning(
            `No methods found: ${routeFile.replace(process.cwd(), "").replace(/^\//, "")}`,
          ),
        );
        continue;
      }

      // Add main path with method suffix for each method (e.g., "v1_core_agent_ai-stream_POST")
      for (const method of methods) {
        const pathWithMethod = `${path}${PATH_SEPARATOR}${method}`;
        if (!pathMap[pathWithMethod]) {
          pathMap[pathWithMethod] = { importPath, method };
          allPaths.push(pathWithMethod);
        }
      }

      // Extract and add real aliases from definition file (with their method)
      const definitionAliases =
        await this.extractAliasesFromDefinition(routeFile);
      for (const { alias, method } of definitionAliases) {
        // Only add if not already present (first wins)
        if (!pathMap[alias]) {
          pathMap[alias] = { importPath, method };
          allPaths.push(alias);
        }
      }
    }

    // Sort paths for consistent output
    allPaths.sort();

    // Generate getRouteHandler function cases with type-safe loading
    const cases: string[] = [];
    for (const path of allPaths) {
      const { importPath, method } = pathMap[path];
      // Calculate line lengths for different wrapping strategies
      const returnWithTools = `      return (await import("${importPath}")).tools`;
      const returnWithParen = `      return (await import("${importPath}"))`;
      const fullLine = `      return (await import("${importPath}")).tools.${method} as GenericHandlerBase;`;

      if (fullLine.length <= 100) {
        // Short (<=100 chars): keep on one line
        // eslint-disable-next-line i18next/no-literal-string
        cases.push(`    case "${path}":
      return (await import("${importPath}")).tools.${method} as GenericHandlerBase;`);
      } else if (returnWithTools.length <= 100) {
        // Wrap after .tools (returnWithTools <=100, but fullLine >100)
        // eslint-disable-next-line i18next/no-literal-string
        cases.push(`    case "${path}":
      return (await import("${importPath}")).tools
        .${method} as GenericHandlerBase;`);
      } else if (returnWithParen.length <= 100) {
        // Wrap after import paren (returnWithParen <=100, but returnWithTools >100)
        // eslint-disable-next-line i18next/no-literal-string
        cases.push(`    case "${path}":
      return (await import("${importPath}"))
        .tools.${method} as GenericHandlerBase;`);
      } else {
        // Very long: wrap import statement itself (returnWithParen >100)
        // eslint-disable-next-line i18next/no-literal-string
        cases.push(`    case "${path}":
      return (
        await import("${importPath}")
      ).tools.${method} as GenericHandlerBase;`);
      }
    }

    // eslint-disable-next-line i18next/no-literal-string
    const autoGenTitle = "AUTO-GENERATED FILE - DO NOT EDIT";
    const generatorName = "generators/route-handlers";
    const header = generateFileHeader(autoGenTitle, generatorName, {
      "Routes found": routeFiles.length,
      "Total paths (with aliases)": allPaths.length,
    });

    // eslint-disable-next-line i18next/no-literal-string
    return `${header}

import type { GenericHandlerBase } from "../unified-interface/shared/endpoints/route/handler";

/* eslint-disable prettier/prettier */
/* eslint-disable i18next/no-literal-string */

/**
 * Dynamically import route handler by path
 * @param path - The route path (e.g., "core/agent/chat/threads")
 * @returns The route module or null if not found
 */
export async function getRouteHandler(path: string): Promise<GenericHandlerBase | null> {
  switch (path) {
${cases.join("\n")}
    default:
      return null;
  }
}
`;
  }
}

export const routeHandlersGeneratorRepository =
  new RouteHandlersGeneratorRepositoryImpl();
