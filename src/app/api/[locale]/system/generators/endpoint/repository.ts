/**
 * Endpoint Generator Repository
 * Generates endpoint.ts with dynamic imports and flat path structure
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
import {
  endpointToToolName,
  getPreferredToolName,
} from "@/app/api/[locale]/system/unified-interface/shared/utils/path";

import type { LiveIndex } from "../shared/live-index";
import {
  findFilesRecursively,
  generateAbsoluteImportPath,
  generateFileHeader,
  writeGeneratedFile,
} from "../shared/utils";
import type { scopedTranslation } from "./i18n";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

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
 * Endpoint Generator Repository Implementation
 */
class EndpointGeneratorRepositoryImpl {
  async generateEndpoint(
    data: EndpointRequestType,
    logger: EndpointLogger,
    t: ModuleT,
    liveIndex?: LiveIndex,
  ): Promise<BaseResponseType<EndpointResponseType>> {
    const startTime = Date.now();

    try {
      const outputFile = data.outputFile;
      logger.debug(`Starting endpoint generation: ${outputFile}`);

      // Use live index when available (dev watcher), otherwise scan from disk
      let definitionFiles: string[];
      let routeFiles: string[];

      if (liveIndex) {
        logger.debug("Using live index for file discovery");
        definitionFiles = [...liveIndex.definitionFiles];
        routeFiles = [...liveIndex.routeFiles];
      } else {
        const startDir = `${process.cwd()}/src/app/api/[locale]`;

        logger.debug("Discovering definition files");
        definitionFiles = findFilesRecursively(startDir, "definition.ts");
        routeFiles = findFilesRecursively(startDir, "route.ts");
      }

      logger.debug(`Found ${definitionFiles.length} definition files`);

      // Filter to only definitions with matching route files
      const routeFilesSet = new Set(routeFiles);
      const definitionsWithoutRoute: string[] = [];
      const validDefinitionFiles: string[] = [];

      for (const defFile of definitionFiles) {
        const routePath = defFile.replace("/definition.ts", "/route.ts");
        if (!routeFilesSet.has(routePath)) {
          definitionsWithoutRoute.push(defFile);
        } else {
          validDefinitionFiles.push(defFile);
        }
      }

      // Skip definitions without route (warning shown by endpoints-index generator)

      // Generate both files
      const { endpointContent, aliasMapContent, endpointCount } =
        await this.generateContent(validDefinitionFiles, logger);

      // Derive alias-map path from outputFile (same dir)
      const aliasMapFile = outputFile.replace(
        /\/endpoint\.ts$/,
        "/alias-map.ts",
      );

      // Write both files
      await writeGeneratedFile(outputFile, endpointContent, data.dryRun);
      await writeGeneratedFile(aliasMapFile, aliasMapContent, data.dryRun);

      const duration = Date.now() - startTime;

      logger.info(
        formatGenerator(
          `Generated endpoint file with ${formatCount(endpointCount, "endpoint")} in ${formatDuration(duration)}`,
          "📄",
        ),
      );

      return success({
        success: true,
        message: t("post.success.generated"),
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
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          duration,
        },
      });
    }
  }

  /**
   * Generate both endpoint.ts and alias-map.ts content from definitions.
   * Main paths include method suffix (e.g., "core/agent/ai-stream/POST")
   * Aliases also include method from their definition
   */
  private async generateContent(
    definitionFiles: string[],
    logger: EndpointLogger,
  ): Promise<{
    endpointContent: string;
    aliasMapContent: string;
    endpointCount: number;
  }> {
    const pathMap: Record<string, { importPath: string; method: string }> = {};
    const allPaths: string[] = [];
    let endpointCount = 0;

    // Build path map with real aliases (deduplicate)
    for (const defFile of definitionFiles) {
      const importPath = generateAbsoluteImportPath(defFile, "definition");

      // Load the actual definition - let TypeScript infer the concrete type
      let definition;
      try {
        definition = await import(defFile);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        // Bun TDZ race: "Cannot access 'X' before initialization" — yield and retry once
        if (errorMsg.includes("before initialization")) {
          await new Promise((resolve) => {
            setTimeout(resolve, 10);
          });
          try {
            definition = await import(defFile);
          } catch (retryError) {
            const retryMsg =
              retryError instanceof Error
                ? retryError.message
                : String(retryError);
            logger.warn(
              formatWarning(
                `Could not load definition: ${defFile.replace(process.cwd(), "").replace(/^\//, "")} — ${retryMsg}`,
              ),
            );
            continue;
          }
        } else {
          logger.warn(
            formatWarning(
              `Import error: ${defFile.replace(process.cwd(), "").replace(/^\//, "")}\n    ${errorMsg}`,
            ),
          );
          continue;
        }
      }
      let defaultExport;
      try {
        defaultExport = definition.default;
      } catch {
        // Bun plugin race: synthetic onLoad modules with `export *` can delay
        // initialization. Yield to the event loop then retry.
        await new Promise((resolve) => {
          setTimeout(resolve, 10);
        });
        try {
          defaultExport = definition.default;
        } catch (retryError) {
          const errorMsg =
            retryError instanceof Error
              ? retryError.message
              : String(retryError);
          logger.warn(
            formatWarning(
              `Deferred init (Bun plugin race): ${defFile.replace(process.cwd(), "").replace(/^\//, "")}\n    ${errorMsg}`,
            ),
          );
          continue;
        }
      }

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
          endpointCount++;
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
    const pathToAliasMap: Record<string, string> = {};

    for (const defFile of definitionFiles) {
      // Load the actual definition - let TypeScript infer the concrete type
      let definition;
      try {
        definition = await import(defFile);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        // Bun TDZ race: yield and retry once
        if (errorMsg.includes("before initialization")) {
          await new Promise((resolve) => {
            setTimeout(resolve, 10);
          });
          try {
            definition = await import(defFile);
          } catch {
            continue;
          }
        } else {
          continue;
        }
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

        const canonicalName = endpointToToolName(endpoint);
        // preferred = first alias if any, otherwise canonical
        const preferred = getPreferredToolName(endpoint);

        // Every name (canonical + all aliases) maps to the preferred name
        pathToAliasMap[canonicalName] = preferred;
        if (endpoint.aliases && Array.isArray(endpoint.aliases)) {
          for (const alias of endpoint.aliases) {
            if (!pathToAliasMap[alias]) {
              pathToAliasMap[alias] = preferred;
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

      if (fullLine.length <= 80) {
        // Short (<=80 chars, prettier printWidth): keep on one line
        // eslint-disable-next-line i18next/no-literal-string
        cases.push(`    case "${path}":
      return (await import("${importPath}")).default.${method};`);
      } else if (returnWithDefault.length <= 80) {
        // Wrap after .default (returnWithDefault <=80, but fullLine >80)
        // eslint-disable-next-line i18next/no-literal-string
        cases.push(`    case "${path}":
      return (await import("${importPath}")).default
        .${method};`);
      } else if (returnWithParen.length <= 80) {
        // Wrap after import paren (returnWithParen <=80, but returnWithDefault >80)
        // eslint-disable-next-line i18next/no-literal-string
        cases.push(`    case "${path}":
      return (await import("${importPath}"))
        .default.${method};`);
      } else {
        // Very long: wrap import statement itself (returnWithParen >80)
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

    // Generate alias map entries (sorted, quoted if needed, wrapped at 80 chars)
    const entries = Object.entries(pathToAliasMap).toSorted(([a], [b]) =>
      a.localeCompare(b),
    );
    const aliasMapEntries = entries
      .map(([alias, fullPath]) => {
        const needsQuotes = /[^a-zA-Z0-9_$]/.test(alias);
        const key = needsQuotes ? `"${alias}"` : alias;
        const singleLine = `  ${key}: "${fullPath}",`;
        if (singleLine.length >= 80) {
          return `  ${key}:\n    "${fullPath}",`;
        }
        return singleLine;
      })
      .join("\n");

    // eslint-disable-next-line i18next/no-literal-string
    const aliasMapContent = `${header}

/* eslint-disable prettier/prettier */
/* eslint-disable i18next/no-literal-string */

/**
 * Map of aliases to their canonical full paths.
 * Full paths map to themselves.
 */
export const pathToAliasMap = {
${aliasMapEntries}
} as const;
`;

    // eslint-disable-next-line i18next/no-literal-string
    const endpointContent = `${header}

/* eslint-disable prettier/prettier */
/* eslint-disable i18next/no-literal-string */

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";

/**
 * Dynamically import endpoint definition by path
 * @param path - The endpoint path (e.g., "core/agent/chat/threads")
 * @returns The endpoint definition or null if not found
 */
export async function getEndpoint(
  path: string,
): Promise<CreateApiEndpointAny | null> {
  switch (path) {
${cases.join("\n")}
    default:
      return null;
  }
}
`;

    return { endpointContent, aliasMapContent, endpointCount };
  }
}

export const endpointGeneratorRepository =
  new EndpointGeneratorRepositoryImpl();
