/**
 * Endpoint Generator Repository
 * Generates endpoint.ts with dynamic imports and flat path structure
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
import { endpointToToolName } from "@/app/api/[locale]/system/unified-interface/shared/utils/path";

import {
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
      logger.debug(`Starting endpoint generation: ${outputFile}`);

      // Discover definition files
      // eslint-disable-next-line i18next/no-literal-string
      const apiCorePath = ["src", "app", "api", "[locale]"];
      const startDir = join(process.cwd(), ...apiCorePath);

      logger.debug("Discovering definition files");
      const definitionFiles = findFilesRecursively(startDir, "definition.ts");

      logger.debug(`Found ${definitionFiles.length} definition files`);

      // Check for definitions without routes - filter them out
      const routeFiles = findFilesRecursively(startDir, "route.ts");
      const definitionsWithoutRoute: string[] = [];
      const validDefinitionFiles: string[] = [];

      for (const defFile of definitionFiles) {
        const routePath = defFile.replace("/definition.ts", "/route.ts");
        if (!routeFiles.includes(routePath)) {
          definitionsWithoutRoute.push(defFile);
        } else {
          validDefinitionFiles.push(defFile);
        }
      }

      // Skip definitions without route (warning shown by endpoints-index generator)

      // Generate content with only valid definition files
      const content = await this.generateContent(validDefinitionFiles, logger);

      // Write file
      await writeGeneratedFile(outputFile, content, data.dryRun);

      const duration = Date.now() - startTime;

      logger.info(
        formatGenerator(
          `Generated endpoint file with ${formatCount(validDefinitionFiles.length, "endpoint")} in ${formatDuration(duration)}`,
          "📄",
        ),
      );

      return success({
        success: true,
        message: "app.api.system.generators.endpoints.success.generated",
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
        message: "app.api.system.generators.endpoints.post.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          duration,
        },
      });
    }
  }

  /**
   * Generate endpoint content with dynamic imports and real aliases from definitions
   * Main paths include method suffix (e.g., "core/agent/ai-stream/POST")
   * Aliases also include method from their definition
   */
  private async generateContent(
    definitionFiles: string[],
    logger: EndpointLogger,
  ): Promise<string> {
    const pathMap: Record<string, { importPath: string; method: string }> = {};
    const allPaths: string[] = [];

    // Build path map with real aliases (deduplicate)
    for (const defFile of definitionFiles) {
      const importPath = generateAbsoluteImportPath(defFile, "definition");

      // Load the actual definition - let TypeScript infer the concrete type
      let definition;
      try {
        definition = await import(defFile);
      } catch (error) {
        // Log import errors and skip - same pattern as route-handlers generator
        const errorMsg = error instanceof Error ? error.message : String(error);
        logger.warn(
          formatWarning(
            `Import error: ${defFile.replace(process.cwd(), "").replace(/^\//, "")}\n    ${errorMsg}`,
          ),
        );
        continue;
      }
      const defaultExport = definition.default;

      if (!defaultExport) {
        logger.warn(
          formatWarning(
            `No default export: ${defFile.replace(process.cwd(), "").replace(/^\//, "")}`,
          ),
        );
        continue;
      }

      // Explicitly access each HTTP method property
      const methodEntries = [
        { method: "GET" as const, endpoint: defaultExport.GET },
        { method: "POST" as const, endpoint: defaultExport.POST },
        { method: "PUT" as const, endpoint: defaultExport.PUT },
        { method: "PATCH" as const, endpoint: defaultExport.PATCH },
        { method: "DELETE" as const, endpoint: defaultExport.DELETE },
        { method: "HEAD" as const, endpoint: defaultExport.HEAD },
        { method: "OPTIONS" as const, endpoint: defaultExport.OPTIONS },
      ];

      for (const { method, endpoint } of methodEntries) {
        if (!endpoint) {
          continue;
        }

        // Use endpointToToolName to get properly sanitized tool name
        const toolName = endpointToToolName(endpoint);

        if (!pathMap[toolName]) {
          pathMap[toolName] = { importPath, method };
          allPaths.push(toolName);
        }

        // Add aliases if they exist
        if (endpoint.aliases && Array.isArray(endpoint.aliases)) {
          for (const alias of endpoint.aliases) {
            if (!pathMap[alias]) {
              pathMap[alias] = { importPath, method };
              allPaths.push(alias);
            }
          }
        }
      }
    }

    // Sort paths for consistent output
    allPaths.sort();

    // Build alias to full path map (alias -> full path with method)
    // Full paths map to themselves
    const aliasToPathMap: Record<string, string> = {};

    for (const defFile of definitionFiles) {
      // Load the actual definition - let TypeScript infer the concrete type
      let definition;
      try {
        definition = await import(defFile);
      } catch (error) {
        // Skip files with import errors (already logged above)
        continue;
      }
      const defaultExport = definition.default;

      if (!defaultExport) {
        continue;
      }

      // Explicitly access each HTTP method property
      const methodEntries = [
        { method: "GET" as const, endpoint: defaultExport.GET },
        { method: "POST" as const, endpoint: defaultExport.POST },
        { method: "PUT" as const, endpoint: defaultExport.PUT },
        { method: "PATCH" as const, endpoint: defaultExport.PATCH },
        { method: "DELETE" as const, endpoint: defaultExport.DELETE },
        { method: "HEAD" as const, endpoint: defaultExport.HEAD },
        { method: "OPTIONS" as const, endpoint: defaultExport.OPTIONS },
      ];

      for (const { endpoint } of methodEntries) {
        if (!endpoint) {
          continue;
        }

        // Use endpointToToolName to get properly sanitized canonical tool name
        const canonicalName = endpointToToolName(endpoint);

        // Canonical name maps to itself
        aliasToPathMap[canonicalName] = canonicalName;

        // Map aliases to their canonical names
        if (endpoint.aliases && Array.isArray(endpoint.aliases)) {
          for (const alias of endpoint.aliases) {
            if (!aliasToPathMap[alias]) {
              aliasToPathMap[alias] = canonicalName;
            }
          }
        }
      }
    }

    // Generate getEndpoint function cases
    const cases: string[] = [];
    for (const path of allPaths) {
      const { importPath, method } = pathMap[path];
      // Calculate line lengths for different wrapping strategies
      const returnWithDefault = `      return (await import("${importPath}")).default`;
      const returnWithParen = `      return (await import("${importPath}"))`;
      const fullLine = `      return (await import("${importPath}")).default.${method};`;

      if (fullLine.length <= 100) {
        // Short (<=100 chars): keep on one line
        // eslint-disable-next-line i18next/no-literal-string
        cases.push(`    case "${path}":
      return (await import("${importPath}")).default.${method};`);
      } else if (returnWithDefault.length <= 100) {
        // Wrap after .default (returnWithDefault <=100, but fullLine >100)
        // eslint-disable-next-line i18next/no-literal-string
        cases.push(`    case "${path}":
      return (await import("${importPath}")).default
        .${method};`);
      } else if (returnWithParen.length <= 100) {
        // Wrap after import paren (returnWithParen <=100, but returnWithDefault >100)
        // eslint-disable-next-line i18next/no-literal-string
        cases.push(`    case "${path}":
      return (await import("${importPath}"))
        .default.${method};`);
      } else {
        // Very long: wrap import statement itself (returnWithParen >100)
        // eslint-disable-next-line i18next/no-literal-string
        cases.push(`    case "${path}":
      return (
        await import("${importPath}")
      ).default.${method};`);
      }
    }

    // eslint-disable-next-line i18next/no-literal-string
    const autoGenTitle = "AUTO-GENERATED FILE - DO NOT EDIT";
    const generatorName = "generators/endpoint";
    const header = generateFileHeader(autoGenTitle, generatorName, {
      "Endpoints found": definitionFiles.length,
      "Total paths (with aliases)": allPaths.length,
    });

    // Generate alias map entries (with trailing commas)
    // Only quote keys when they contain special characters (hyphens, etc.)
    // Split long lines at 100+ characters
    const entries = Object.entries(aliasToPathMap).toSorted(([a], [b]) =>
      a.localeCompare(b),
    );
    const aliasMapEntries = entries
      .map(([alias, fullPath]) => {
        const needsQuotes = /[^a-zA-Z0-9_$]/.test(alias);
        const key = needsQuotes ? `"${alias}"` : alias;
        const singleLine = `  ${key}: "${fullPath}",`;
        // Check if line is 100+ chars, if so split it
        if (singleLine.length >= 100) {
          return `  ${key}:\n    "${fullPath}",`;
        }
        return singleLine;
      })
      .join("\n");

    // eslint-disable-next-line i18next/no-literal-string
    return `${header}

/* eslint-disable prettier/prettier */
/* eslint-disable i18next/no-literal-string */

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";

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
export function getFullPath(
  aliasOrPath: string,
): (typeof aliasToPathMap)[keyof typeof aliasToPathMap] | null {
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
