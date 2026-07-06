/**
 * Endpoint Generator Repository
 * Generates endpoint.ts with dynamic imports and flat path structure
 */

import "server-only";

import {
  endpointToToolName,
  getPreferredToolName,
} from "next-vibe/core/core-utils/path";
import { formatWarning } from "next-vibe/logger/formatters";
import type { EndpointLogger } from "next-vibe/logger/types";
import type {
  GeneratorContext,
  GeneratorResult,
} from "next-vibe/tooling/generators/shared/shared-inputs";
import {
  generateAbsoluteImportPath,
  generateFileHeader,
  stripProjectRoot,
  writeGeneratedFile,
} from "next-vibe/tooling/generators/shared/utils";

const OUTPUT_FILE = "src/generated/endpoints/endpoint.ts";

/**
 * Generate endpoint.ts + alias-map.ts + endpoint-hot-paths.ts. Consumes shared
 * definition/route file lists. Byte-identical to the former
 * tooling/generators/endpoint.
 */
export async function generateEndpoint(
  ctx: GeneratorContext,
): Promise<GeneratorResult> {
  const { logger } = ctx;
  const definitionFiles = ctx.files.definition;
  const routeFiles = ctx.files.route;

  logger.debug(`Found ${definitionFiles.length} definition files`);

  const routeFilesSet = new Set(routeFiles);
  const validDefinitionFiles: string[] = [];
  for (const defFile of definitionFiles) {
    const routePath = defFile.replace("/definition.ts", "/route.ts");
    if (routeFilesSet.has(routePath)) {
      validDefinitionFiles.push(defFile);
    }
  }

  const {
    endpointContent,
    aliasMapContent,
    endpointHotPathsContent,
    endpointCount,
  } = await EndpointGenerator.generateContent(validDefinitionFiles, logger);

  const aliasMapFile = OUTPUT_FILE.replace(/\/endpoint\.ts$/, "/alias-map.ts");
  const hotPathsFile = OUTPUT_FILE.replace(/\/endpoint\.ts$/, "/hot-paths.ts");

  await writeGeneratedFile(OUTPUT_FILE, endpointContent);
  await writeGeneratedFile(aliasMapFile, aliasMapContent);
  await writeGeneratedFile(hotPathsFile, endpointHotPathsContent);

  return {
    summary: `endpoint registry (${endpointCount} endpoints, ${definitionFiles.length} definitions)`,
    counts: { endpoints: endpointCount, definitions: definitionFiles.length },
  };
}

class EndpointGenerator {
  /**
   * Generate both endpoint.ts and alias-map.ts content from definitions.
   * Main paths include method suffix (e.g., "core/agent/ai-stream/POST")
   * Aliases also include method from their definition
   */
  static async generateContent(
    definitionFiles: string[],
    logger: EndpointLogger,
  ): Promise<{
    endpointContent: string;
    aliasMapContent: string;
    endpointHotPathsContent: string;
    endpointCount: number;
  }> {
    const pathMap: Record<
      string,
      { importPath: string; absPath: string; method: string }
    > = {};
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
        // Bun TDZ race: "Cannot access 'X' before initialization" - yield and retry once
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
                `Could not load definition: ${stripProjectRoot(defFile)} - ${retryMsg}`,
              ),
            );
            continue;
          }
        } else {
          logger.warn(
            formatWarning(
              `Import error: ${stripProjectRoot(defFile)}\n    ${errorMsg}`,
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
              `Deferred init (Bun plugin race): ${stripProjectRoot(defFile)}\n    ${errorMsg}`,
            ),
          );
          continue;
        }
      }

      if (!defaultExport) {
        logger.warn(
          formatWarning(`No default export: ${stripProjectRoot(defFile)}`),
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
          pathMap[toolName] = { importPath, absPath: defFile, method };
          allPaths.push(toolName);
          endpointCount++;
        }

        // Add aliases if they exist
        if (endpoint.aliases && Array.isArray(endpoint.aliases)) {
          for (const alias of endpoint.aliases) {
            if (!pathMap[alias]) {
              pathMap[alias] = { importPath, absPath: defFile, method };
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

    // Routes that use process.cwd() + fs scanning - must be turbopack-ignored to
    // prevent NFT from tracing the entire project through these imports.
    const NFT_IGNORE_PATTERNS = [
      /\/tanstack-start\/generate\//,
      /\/cli\/setup\/install\//,
      /\/generators\//,
      /\/builder\//,
      /\/check\//,
      /\/guard\//,
    ];
    const needsTurbopackIgnore = (p: string): boolean =>
      NFT_IGNORE_PATTERNS.some((re) => re.test(p));

    // Generate static-import cases (bundler-traceable) and hot-paths map entries
    const cases: string[] = [];
    const hotPathEntries: string[] = [];
    for (const path of allPaths) {
      const { importPath, absPath, method } = pathMap[path];
      // Add turbopack/webpack ignore hints for routes that scan the filesystem
      const ignoreComment = needsTurbopackIgnore(importPath)
        ? "/* turbopackIgnore: true */ /* webpackIgnore: true */ "
        : "";
      // Static import strings for bundler tracing
      const returnWithDefault = `      return (await import(${ignoreComment}"${importPath}")).default`;
      const returnWithParen = `      return (await import(${ignoreComment}"${importPath}"))`;
      const fullLine = `      return (await import(${ignoreComment}"${importPath}")).default.${method};`;

      if (fullLine.length <= 80) {
        // eslint-disable-next-line i18next/no-literal-string
        cases.push(`    case "${path}":
      return (await import(${ignoreComment}"${importPath}")).default.${method};`);
      } else if (returnWithDefault.length <= 80) {
        // eslint-disable-next-line i18next/no-literal-string
        cases.push(`    case "${path}":
      return (await import(${ignoreComment}"${importPath}")).default
        .${method};`);
      } else if (returnWithParen.length <= 80) {
        // eslint-disable-next-line i18next/no-literal-string
        cases.push(`    case "${path}":
      return (await import(${ignoreComment}"${importPath}"))
        .default.${method};`);
      } else if (ignoreComment) {
        // turbopack/webpack ignore comments force the import onto its own line
        // eslint-disable-next-line i18next/no-literal-string
        cases.push(`    case "${path}":
      return (
        await import(
          ${ignoreComment}"${importPath}"
        )
      ).default.${method};`);
      } else {
        // prettier/prettier is disabled in this file — emit compact form
        // eslint-disable-next-line i18next/no-literal-string
        cases.push(`    case "${path}":
      return (
        await import("${importPath}")
      ).default.${method};`);
      }

      // eslint-disable-next-line i18next/no-literal-string
      const hotPathNeedsQuotes = /[^a-zA-Z0-9_$]/.test(path);
      const hotPathKey = hotPathNeedsQuotes ? `"${path}"` : path;
      const absPathLine = `    absPath: "${absPath}",`;
      if (absPathLine.length <= 80) {
        hotPathEntries.push(
          `  ${hotPathKey}: {\n    absPath: "${absPath}",\n    method: "${method}",\n  },`,
        );
      } else {
        hotPathEntries.push(
          `  ${hotPathKey}: {\n    absPath:\n      "${absPath}",\n    method: "${method}",\n  },`,
        );
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
        if (singleLine.length > 80) {
          return `  ${key}:\n    "${fullPath}",`;
        }
        return singleLine;
      })
      .join("\n");

    // eslint-disable-next-line i18next/no-literal-string
    const aliasMapContent = `${header}

/* eslint-disable prettier/prettier */

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

import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";

/**
 * Dynamically import endpoint definition by path.
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

    // eslint-disable-next-line i18next/no-literal-string
    const endpointHotPathsContent = `${header}

/* eslint-disable prettier/prettier */

/**
 * Maps every endpoint path to its import path and HTTP method.
 * Used by the MCP hot-loader to build fresh (cache-busted) imports at runtime
 * without static import strings that bundlers would trace.
 */
export const endpointHotPaths: Record<
  string,
  { absPath: string; method: string }
> = {
${hotPathEntries.join("\n")}
};
`;

    return {
      endpointContent,
      aliasMapContent,
      endpointHotPathsContent,
      endpointCount,
    };
  }
}
