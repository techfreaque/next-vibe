/**
 * Route Handlers Generator Repository
 * Generates route-handlers.ts with dynamic imports and flat path structure
 */

import "server-only";

import { join } from "node:path";

import type { ResponseType as BaseResponseType } from "next-vibe/shared/types/response.schema";
import {
  fail,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { JwtPayloadType } from "../../../user/auth/types";
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
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<BaseResponseType<RouteHandlersResponseType>>;
}

/**
 * Route Handlers Generator Repository Implementation
 */
class RouteHandlersGeneratorRepositoryImpl
  implements RouteHandlersGeneratorRepository {
  async generateRouteHandlers(
    data: RouteHandlersRequestType,
    _user: JwtPayloadType,
    _locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<BaseResponseType<RouteHandlersResponseType>> {
    const startTime = Date.now();

    try {
      const outputFile = data.outputFile;
      logger.debug("Starting route handlers generation", {
        outputFile,
      });

      // Discover route files
      // eslint-disable-next-line i18next/no-literal-string
      const apiCorePath = ["src", "app", "api", "[locale]", "v1", "core"];
      const startDir = join(process.cwd(), ...apiCorePath);

      logger.debug("Discovering route files");
      const routeFiles = findFilesRecursively(startDir, "route.ts");

      logger.debug(`Found ${routeFiles.length} route files`);

      // Generate content
      const content = await this.generateContent(routeFiles);

      // Write file
      await writeGeneratedFile(outputFile, content, data.dryRun);

      const duration = Date.now() - startTime;

      logger.info(
        `Generated route handlers file with ${routeFiles.length} routes in ${duration}ms`,
      );

      return success({
        success: true,
        message:
          "app.api.v1.core.system.generators.endpoints.success.generated",
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
          message: "app.api.v1.core.system.generators.endpoints.post.errors.server.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
                  messageParams: {
          duration,
        },
      });
    }
  }

  /**
   * Extract aliases from definition file (async)
   */
  private async extractAliasesFromDefinition(
    routeFile: string,
  ): Promise<string[]> {
    const definitionPath = routeFile.replace("/route.ts", "/definition.ts");
    try {
      const definition = (await import(definitionPath)) as {
        default?: Record<string, { aliases?: string[] }>;
      };
      const defaultExport = definition.default;

      if (!defaultExport) {
        return [];
      }

      // Get aliases from any method (usually POST)
      for (const method of Object.keys(defaultExport)) {
        const methodDef = defaultExport[method];
        if (methodDef?.aliases && Array.isArray(methodDef.aliases)) {
          return methodDef.aliases;
        }
      }
    } catch {
      // Definition file doesn't exist or can't be loaded
    }
    return [];
  }

  /**
   * Generate route handlers content with dynamic imports and real aliases from definitions
   * No duplicate parameter format aliases - only [id] format and real definition aliases
   */
  private async generateContent(routeFiles: string[]): Promise<string> {
    const pathMap: Record<string, string> = {};
    const allPaths: string[] = [];

    // Build path map with aliases (deduplicate)
    for (const routeFile of routeFiles) {
      const { path } = extractPathKey(routeFile);
      const importPath = generateAbsoluteImportPath(routeFile, "route");

      // Add main path (with [id] format only) if not already added
      if (!pathMap[path]) {
        pathMap[path] = importPath;
        allPaths.push(path);
      }

      // Extract and add real aliases from definition file
      const definitionAliases =
        await this.extractAliasesFromDefinition(routeFile);
      for (const alias of definitionAliases) {
        // Only add if not already present (first wins)
        if (!pathMap[alias]) {
          pathMap[alias] = importPath;
          allPaths.push(alias);
        }
      }
    }

    // Sort paths for consistent output
    allPaths.sort();

    // Generate getRouteHandler function cases with type-safe loading
    const cases: string[] = [];
    for (const path of allPaths) {
      const importPath = pathMap[path];
      // eslint-disable-next-line i18next/no-literal-string
      cases.push(`    case "${path}":
      return await loadRouteModule(
        () => import("${importPath}"),
        "${path}"
      );`);
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

/* eslint-disable prettier/prettier */
/* eslint-disable i18next/no-literal-string */

import type { RouteModule } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/handler";

/**
 * Helper function to load and validate route modules
 * Accepts any import function and validates the result at runtime
 */
async function loadRouteModule<T>(
  importFn: () => Promise<T>,
  path: string
): Promise<RouteModule | null> {
  try {
    const routeModule = await importFn();
    // Basic validation that it's a route module
    if (routeModule && typeof routeModule === "object") {
      return routeModule as RouteModule;
    }
    return null;
  } catch (err) {
    // eslint-disable-next-line no-console -- Required for debugging route module loading errors
    console.error(\`Failed to load route module for path: \${path}\`, err);
    return null;
  }
}

/**
 * Dynamically import route handler by path with runtime validation
 * @param path - The route path (e.g., "core/agent/chat/threads")
 * @returns The validated route module or null if not found
 * @throws {TypeError} If the imported module is not a valid RouteModule
 */
export async function getRouteHandler(path: string): Promise<RouteModule | null> {
  switch (path) {
${cases.join("\n")}
    default:
      return null;
  }
}

/**
 * Get all available route paths
 */
export function getAllRoutePaths(): string[] {
  return [
${allPaths.map((p) => `    "${p}",`).join("\n")}
  ];
}

/**
 * Check if a route path exists
 */
export function hasRoute(path: string): boolean {
  return getAllRoutePaths().includes(path);
}
`;
  }
}

export const routeHandlersGeneratorRepository =
  new RouteHandlersGeneratorRepositoryImpl();
