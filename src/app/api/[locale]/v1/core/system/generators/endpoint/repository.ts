/**
 * Endpoint Generator Repository
 * Generates endpoint.ts with dynamic imports and flat path structure
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
import type { ApiSection } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/endpoint";
import { PATH_SEPARATOR } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/utils/path";
import {
  extractPathKey,
  findFilesRecursively,
  generateAbsoluteImportPath,
  generateFileHeader,
  writeGeneratedFile,
} from "../shared/utils";

// Type definitions
interface EndpointRequestType {
  outputFile: string;
  dryRun: boolean;
}

interface EndpointResponseType {
  success: boolean;
  message: string;
  endpointsFound: number;
  duration: number;
  outputFile?: string;
}

/**
 * Endpoint Generator Repository Interface
 */
interface EndpointGeneratorRepository {
  generateEndpoint(
    data: EndpointRequestType,
    logger: EndpointLogger,
  ): Promise<BaseResponseType<EndpointResponseType>>;
}

/**
 * Endpoint Generator Repository Implementation
 */
class EndpointGeneratorRepositoryImpl implements EndpointGeneratorRepository {
  async generateEndpoint(
    data: EndpointRequestType,
    logger: EndpointLogger,
  ): Promise<BaseResponseType<EndpointResponseType>> {
    const startTime = Date.now();

    try {
      const outputFile = data.outputFile;
      logger.debug("Starting endpoint generation", { outputFile });

      // Discover definition files
      // eslint-disable-next-line i18next/no-literal-string
      const apiCorePath = ["src", "app", "api", "[locale]", "v1", "core"];
      const startDir = join(process.cwd(), ...apiCorePath);

      logger.debug("Discovering definition files");
      const definitionFiles = findFilesRecursively(startDir, "definition.ts");

      logger.debug(`Found ${definitionFiles.length} definition files`);

      // Generate content
      const content = await this.generateContent(definitionFiles);

      // Write file
      await writeGeneratedFile(outputFile, content, data.dryRun);

      const duration = Date.now() - startTime;

      logger.info(
        `Generated endpoint file with ${definitionFiles.length} endpoints in ${duration}ms`,
      );

      return success({
        success: true,
        message:
          "app.api.v1.core.system.generators.endpoints.success.generated",
        endpointsFound: definitionFiles.length,
        duration,
        outputFile: data.dryRun ? undefined : outputFile,
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error("Endpoint generation failed", {
        error: parseError(error),
        duration,
      });

      return fail({
        message:
          "app.api.v1.core.system.generators.endpoints.post.errors.server.title",
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
    defFile: string,
  ): Promise<Array<{ alias: string; method: string }>> {
    try {
      const definition = (await import(defFile)) as {
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
   * Extract methods from definition file (async)
   */
  private async extractMethodsFromDefinition(
    defFile: string,
  ): Promise<string[]> {
    try {
      const definition = (await import(defFile)) as {
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
   * Generate endpoint content with dynamic imports and real aliases from definitions
   * Main paths include method suffix (e.g., "core/agent/ai-stream/POST")
   * Aliases also include method from their definition
   */
  private async generateContent(definitionFiles: string[]): Promise<string> {
    const pathMap: Record<string, { importPath: string; method: string }> = {};
    const allPaths: string[] = [];

    // Build path map with real aliases (deduplicate)
    for (const defFile of definitionFiles) {
      const { path } = extractPathKey(defFile);
      const importPath = generateAbsoluteImportPath(defFile, "definition");

      // Get methods for this endpoint
      const methods = await this.extractMethodsFromDefinition(defFile);

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
        await this.extractAliasesFromDefinition(defFile);
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

    // Build alias to full path map (alias -> full path with method)
    // Full paths map to themselves
    const aliasToPathMap: Record<string, string> = {};

    for (const defFile of definitionFiles) {
      const { path } = extractPathKey(defFile);
      const methods = await this.extractMethodsFromDefinition(defFile);

      for (const method of methods) {
        const fullPath = `${path}${PATH_SEPARATOR}${method}`;
        // Full path maps to itself
        aliasToPathMap[fullPath] = fullPath;
      }

      // Map aliases to their full paths
      const definitionAliases =
        await this.extractAliasesFromDefinition(defFile);
      for (const { alias, method } of definitionAliases) {
        const fullPath = `${path}${PATH_SEPARATOR}${method}`;
        if (!aliasToPathMap[alias]) {
          aliasToPathMap[alias] = fullPath;
        }
      }
    }

    // Generate getEndpoint function cases
    const cases: string[] = [];
    for (const path of allPaths) {
      const { importPath, method } = pathMap[path];
      // eslint-disable-next-line i18next/no-literal-string
      cases.push(`    case "${path}":
      return (await import("${importPath}")).default.${method};`);
    }

    // eslint-disable-next-line i18next/no-literal-string
    const autoGenTitle = "AUTO-GENERATED FILE - DO NOT EDIT";
    const generatorName = "generators/endpoint";
    const header = generateFileHeader(autoGenTitle, generatorName, {
      "Endpoints found": definitionFiles.length,
      "Total paths (with aliases)": allPaths.length,
    });

    // Generate alias map entries
    const aliasMapEntries = Object.entries(aliasToPathMap)
      .toSorted(([a], [b]) => a.localeCompare(b))
      .map(([alias, fullPath]) => `  "${alias}": "${fullPath}"`)
      .join(",\n");

    // eslint-disable-next-line i18next/no-literal-string
    return `${header}

/* eslint-disable prettier/prettier */
/* eslint-disable i18next/no-literal-string */

import type { CreateApiEndpointAny } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/endpoint";

/**
 * Map of aliases to their canonical full paths
 * Full paths map to themselves
 */
export const aliasToPathMap = {
${aliasMapEntries}
} as const;

/**
 * Get the canonical full path from an alias or full path
 * @param aliasOrPath - An alias or full path
 * @returns The canonical full path, or null if not found
 */
export function getFullPath(aliasOrPath: string): typeof aliasToPathMap[keyof typeof aliasToPathMap] | null {
  return aliasToPathMap[aliasOrPath as keyof typeof aliasToPathMap] ?? null;
}

/**
 * Dynamically import endpoint definition by path
 * @param path - The endpoint path (e.g., "core/agent/chat/threads")
 * @returns The endpoint definition or null if not found
 */
export async function getEndpoint(path: string): Promise<CreateApiEndpointAny | null> {
  switch (path) {
${cases.join("\n")}
    default:
      return null;
  }
}
`;
  }
}

export const endpointGeneratorRepository =
  new EndpointGeneratorRepositoryImpl();
