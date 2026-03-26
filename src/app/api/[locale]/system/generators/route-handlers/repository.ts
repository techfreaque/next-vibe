/**
 * Route Handlers Generator Repository
 * Generates route-handlers.ts with dynamic imports and flat path structure
 */

import "server-only";

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

import type { LiveIndex } from "../shared/live-index";
import {
  extractPathKey,
  findFilesRecursively,
  generateAbsoluteImportPath,
  generateFileHeader,
  writeGeneratedFile,
} from "../shared/utils";
import type { GeneratorsRouteHandlersT } from "./i18n";

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
 * Route Handlers Generator Repository Implementation
 */
export class RouteHandlersGeneratorRepository {
  static async generateRouteHandlers(
    data: RouteHandlersRequestType,
    logger: EndpointLogger,
    t: GeneratorsRouteHandlersT,
    liveIndex?: LiveIndex,
  ): Promise<BaseResponseType<RouteHandlersResponseType>> {
    const startTime = Date.now();

    try {
      const outputFile = data.outputFile;
      logger.debug(`Starting route handlers generation: ${outputFile}`);

      // Use live index when available (dev watcher), otherwise scan from disk
      let routeFiles: string[];
      let definitionFiles: string[];

      if (liveIndex) {
        logger.debug("Using live index for file discovery");
        routeFiles = [...liveIndex.routeFiles];
        definitionFiles = [...liveIndex.definitionFiles];
      } else {
        // Use template string to prevent Turbopack from statically tracing paths
        const startDir = `${process.cwd()}/src/app/api/[locale]`;

        logger.debug("Discovering route files");
        routeFiles = findFilesRecursively(startDir, "route.ts");
        definitionFiles = findFilesRecursively(startDir, "definition.ts");
      }

      logger.debug(`Found ${routeFiles.length} route files`);

      // Filter routes that have no matching definition
      const definitionFilesSet = new Set(definitionFiles);
      const routesWithoutDefinition: string[] = [];
      const validRouteFiles: string[] = [];

      for (const routeFile of routeFiles) {
        const definitionPath = routeFile.replace("/route.ts", "/definition.ts");
        if (!definitionFilesSet.has(definitionPath)) {
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
      const { content, hotPathsContent, routeCount } =
        await RouteHandlersGeneratorRepository.generateContent(
          validRouteFiles,
          logger,
        );

      // Write route-handlers.ts and hot-paths.ts
      const hotPathsFile = outputFile.replace(
        /\/route-handlers\.ts$/,
        "/route-hot-paths.ts",
      );
      await writeGeneratedFile(outputFile, content, data.dryRun);
      await writeGeneratedFile(hotPathsFile, hotPathsContent, data.dryRun);

      const duration = Date.now() - startTime;

      logger.info(
        formatGenerator(
          `Generated route handlers file with ${formatCount(routeCount, "route")} in ${formatDuration(duration)}`,
          "🔗",
        ),
      );

      return success({
        success: true,
        message: t("post.success.generated"),
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
        message: t("post.errors.server.title"),
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
  private static async extractMethodsFromDefinition(
    routeFile: string,
  ): Promise<string[]> {
    const definitionPath = routeFile.replace("/route.ts", "/definition.ts");
    try {
      const definition = (await import(definitionPath)) as {
        default?: ApiSection;
      };
      let defaultExport;
      try {
        defaultExport = definition.default;
      } catch {
        // Bun plugin race - yield then retry
        await new Promise((resolve) => {
          setTimeout(resolve, 10);
        });
        defaultExport = definition.default;
      }

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
  private static async extractAliasesFromDefinition(
    routeFile: string,
  ): Promise<Array<{ alias: string; method: string }>> {
    const definitionPath = routeFile.replace("/route.ts", "/definition.ts");
    try {
      const definition = (await import(definitionPath)) as {
        default?: Record<string, { aliases?: string[] }>;
      };
      let defaultExport;
      try {
        defaultExport = definition.default;
      } catch {
        await new Promise((resolve) => {
          setTimeout(resolve, 10);
        });
        defaultExport = definition.default;
      }

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
  private static async generateContent(
    routeFiles: string[],
    logger: EndpointLogger,
  ): Promise<{ content: string; hotPathsContent: string; routeCount: number }> {
    const pathMap: Record<
      string,
      { importPath: string; absPath: string; method: string }
    > = {};
    const allPaths: string[] = [];
    let routeCount = 0;

    // Build path map with method suffixes and aliases (deduplicate)
    for (const routeFile of routeFiles) {
      const { path } = extractPathKey(routeFile);
      const importPath = generateAbsoluteImportPath(routeFile, "route");

      // Get methods for this route from definition file
      const methods =
        await RouteHandlersGeneratorRepository.extractMethodsFromDefinition(
          routeFile,
        );

      if (methods.length === 0) {
        logger.warn(
          formatWarning(
            ` No methods found: ${routeFile.replace(process.cwd(), "").replace(/^\//, "")}`,
          ),
        );
        continue;
      }

      // Add main path with method suffix for each method (e.g., "v1_core_agent_ai-stream_POST")
      for (const method of methods) {
        const pathWithMethod = `${path}${PATH_SEPARATOR}${method}`;
        if (!pathMap[pathWithMethod]) {
          pathMap[pathWithMethod] = { importPath, absPath: routeFile, method };
          allPaths.push(pathWithMethod);
          routeCount++;
        }
      }

      // Extract and add real aliases from definition file (with their method)
      const definitionAliases =
        await RouteHandlersGeneratorRepository.extractAliasesFromDefinition(
          routeFile,
        );
      for (const { alias, method } of definitionAliases) {
        // Only add if not already present (first wins)
        if (!pathMap[alias]) {
          pathMap[alias] = { importPath, absPath: routeFile, method };
          allPaths.push(alias);
        }
      }
    }

    // Sort paths for consistent output
    allPaths.sort();

    // Generate static-import cases (bundler-traceable)
    const cases: string[] = [];
    // Also build the hot-paths map: toolName -> { absPath, method }
    const hotPathEntries: string[] = [];
    for (const path of allPaths) {
      const { importPath, absPath, method } = pathMap[path];
      // Static import strings for bundler tracing
      const returnWithTools = `      return (await import("${importPath}")).tools`;
      const returnWithParen = `      return (await import("${importPath}"))`;
      const fullLine = `      return (await import("${importPath}")).tools.${method} as GenericHandlerBase;`;

      if (fullLine.length <= 80) {
        // eslint-disable-next-line i18next/no-literal-string
        cases.push(`    case "${path}":
      return (await import("${importPath}")).tools.${method} as GenericHandlerBase;`);
      } else if (returnWithTools.length <= 80) {
        // eslint-disable-next-line i18next/no-literal-string
        cases.push(`    case "${path}":
      return (await import("${importPath}")).tools
        .${method} as GenericHandlerBase;`);
      } else if (returnWithParen.length <= 80) {
        // eslint-disable-next-line i18next/no-literal-string
        cases.push(`    case "${path}":
      return (await import("${importPath}"))
        .tools.${method} as GenericHandlerBase;`);
      } else {
        // eslint-disable-next-line i18next/no-literal-string
        cases.push(`    case "${path}":
      return (
        await import("${importPath}")
      ).tools.${method} as GenericHandlerBase;`);
      }

      // eslint-disable-next-line i18next/no-literal-string
      hotPathEntries.push(
        `  "${path}": { absPath: "${absPath}", method: "${method}" },`,
      );
    }

    // eslint-disable-next-line i18next/no-literal-string
    const autoGenTitle = "AUTO-GENERATED FILE - DO NOT EDIT";
    const generatorName = "generators/route-handlers";
    const header = generateFileHeader(autoGenTitle, generatorName, {
      "Routes found": routeFiles.length,
      "Total paths (with aliases)": allPaths.length,
    });

    // eslint-disable-next-line i18next/no-literal-string
    const content = `${header}

import type { GenericHandlerBase } from "../unified-interface/shared/endpoints/route/handler";

/* eslint-disable prettier/prettier */

/**
 * Dynamically import route handler by path.
 * @param path - The route path (e.g., "core/agent/chat/threads")
 * @returns The route module or null if not found
 */
export async function getRouteHandler(
  path: string,
): Promise<GenericHandlerBase | null> {
  switch (path) {
${cases.join("\n")}
    default:
      return null;
  }
}
`;

    // eslint-disable-next-line i18next/no-literal-string
    const hotPathsContent = `${header}

/* eslint-disable prettier/prettier */

/**
 * Maps every tool name to its import path and HTTP method.
 * Used by the MCP hot-loader to build fresh (cache-busted) imports at runtime
 * without static import strings that bundlers would trace.
 */
export const routeHotPaths: Record<string, { absPath: string; method: string }> = {
${hotPathEntries.join("\n")}
};
`;
    return { content, hotPathsContent, routeCount };
  }
}
