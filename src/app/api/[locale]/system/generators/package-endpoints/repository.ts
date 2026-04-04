/**
 * Package Endpoint Generator
 *
 * Generates scoped endpoint.ts + alias-map.ts for a standalone package.
 * Filters the full endpoint set to only those declared in the PackageManifest,
 * plus the help endpoint (always injected automatically).
 *
 * Output files are written to the given outputDir, mirroring the structure of
 * src/app/api/[locale]/system/generated/ but containing only the package subset.
 */

import { join } from "node:path";

import { TOOL_HELP_ALIAS } from "@/app/api/[locale]/system/help/constants";
import {
  endpointToToolName,
  getPreferredToolName,
} from "@/app/api/[locale]/system/unified-interface/shared/utils/path";

import type { PackageManifest } from "../../packages/types";
import {
  findFilesRecursively,
  generateFileHeader,
  writeGeneratedFile,
} from "../shared/utils";

// ============================================================================
// Types
// ============================================================================

interface PackageEndpointGeneratorInput {
  manifest: PackageManifest;
  /** Absolute path where generated files will be written */
  outputDir: string;
  dryRun?: boolean;
}

interface PackageEndpointGeneratorResult {
  endpointFile: string;
  aliasMapFile: string;
  routeHandlersFile: string;
  endpointCount: number;
}

// ============================================================================
// Repository
// ============================================================================

export class PackageEndpointGeneratorRepository {
  // ============================================================================
  // Alias resolution
  // ============================================================================

  /**
   * Extract all aliases and canonical tool names from a definition file.
   * Returns a Set of strings (aliases + tool names) that identify this endpoint.
   */
  private static async extractEndpointIdentifiers(
    defFile: string,
  ): Promise<Set<string>> {
    const identifiers = new Set<string>();

    let definition;
    try {
      definition = await import(defFile);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      if (msg.includes("before initialization")) {
        await Bun.sleep(10);
        try {
          definition = await import(defFile);
        } catch {
          return identifiers;
        }
      } else {
        return identifiers;
      }
    }

    const defaultExport = definition.default;
    if (!defaultExport) {
      return identifiers;
    }

    const methods = [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "HEAD",
      "OPTIONS",
    ];
    for (const method of methods) {
      const endpoint = defaultExport[method];
      if (!endpoint) {
        continue;
      }

      // Add canonical tool name
      identifiers.add(endpointToToolName(endpoint));

      // Add all declared aliases
      if (Array.isArray(endpoint.aliases)) {
        for (const alias of endpoint.aliases) {
          identifiers.add(alias);
        }
      }
    }

    return identifiers;
  }

  /**
   * Check if a definition file matches any of the declared manifest aliases/names.
   * Loads the definition and compares its identifiers against the manifest set.
   */
  private static async fileMatchesManifest(
    defFile: string,
    manifestAliases: Set<string>,
  ): Promise<boolean> {
    const identifiers =
      await PackageEndpointGeneratorRepository.extractEndpointIdentifiers(
        defFile,
      );
    for (const id of identifiers) {
      if (manifestAliases.has(id)) {
        return true;
      }
    }
    return false;
  }

  // ============================================================================
  // Content generation (mirrors endpoint/repository.ts logic)
  // ============================================================================

  // Build import path for a definition file - same @/app/api/[locale]/... format
  private static toImportPath(filePath: string): string {
    const marker = "[locale]/";
    const idx = filePath.indexOf(marker);
    if (idx === -1) {
      return filePath;
    }
    const after = filePath.slice(idx + marker.length);
    const segment = after.replace(/\/definition\.ts$/, "");
    return `@/app/api/[locale]/${segment}/definition`;
  }

  // Build route.ts import path from definition file path
  private static toRouteImportPath(defFile: string): string {
    const marker = "[locale]/";
    const idx = defFile.indexOf(marker);
    if (idx === -1) {
      return defFile;
    }
    const after = defFile.slice(idx + marker.length);
    const segment = after.replace(/\/definition\.ts$/, "");
    return `@/app/api/[locale]/${segment}/route`;
  }

  private static async generateContent(
    filteredDefinitionFiles: string[],
  ): Promise<{
    endpointContent: string;
    aliasMapContent: string;
    routeHandlersContent: string;
    endpointCount: number;
  }> {
    const pathMap: Record<
      string,
      { importPath: string; routeImportPath: string; method: string }
    > = {};
    const allPaths: string[] = [];
    let endpointCount = 0;

    for (const defFile of filteredDefinitionFiles) {
      const importPath =
        PackageEndpointGeneratorRepository.toImportPath(defFile);
      const routeImportPath =
        PackageEndpointGeneratorRepository.toRouteImportPath(defFile);

      let definition;
      try {
        definition = await import(defFile);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        if (msg.includes("before initialization")) {
          await Bun.sleep(10);
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

        const toolName = endpointToToolName(endpoint);

        if (!pathMap[toolName]) {
          pathMap[toolName] = { importPath, routeImportPath, method };
          allPaths.push(toolName);
          endpointCount++;
        }

        if (endpoint.aliases && Array.isArray(endpoint.aliases)) {
          for (const alias of endpoint.aliases) {
            if (!pathMap[alias]) {
              pathMap[alias] = { importPath, routeImportPath, method };
              allPaths.push(alias);
            }
          }
        }
      }
    }

    allPaths.sort();

    // Build alias map
    const pathToAliasMap: Record<string, string> = {};
    for (const defFile of filteredDefinitionFiles) {
      let definition;
      try {
        definition = await import(defFile);
      } catch {
        continue;
      }
      const defaultExport = definition.default;
      if (!defaultExport) {
        continue;
      }

      const methodEntries = [
        { endpoint: defaultExport.GET },
        { endpoint: defaultExport.POST },
        { endpoint: defaultExport.PUT },
        { endpoint: defaultExport.PATCH },
        { endpoint: defaultExport.DELETE },
        { endpoint: defaultExport.HEAD },
        { endpoint: defaultExport.OPTIONS },
      ];

      for (const { endpoint } of methodEntries) {
        if (!endpoint) {
          continue;
        }
        const canonicalName = endpointToToolName(endpoint);
        const preferred = getPreferredToolName(endpoint);
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

    // Generate switch cases
    const cases: string[] = [];
    const routeCases: string[] = [];
    for (const path of allPaths) {
      const { importPath, routeImportPath, method } = pathMap[path];
      const fullLine = `      return (await import("${importPath}")).default.${method};`;
      const returnWithDefault = `      return (await import("${importPath}")).default`;
      const returnWithParen = `      return (await import("${importPath}"))`;

      if (fullLine.length <= 80) {
        // eslint-disable-next-line i18next/no-literal-string
        cases.push(`    case "${path}":
      return (await import("${importPath}")).default.${method};`);
      } else if (returnWithDefault.length <= 80) {
        // eslint-disable-next-line i18next/no-literal-string
        cases.push(`    case "${path}":
      return (await import("${importPath}")).default
        .${method};`);
      } else if (returnWithParen.length <= 80) {
        // eslint-disable-next-line i18next/no-literal-string
        cases.push(`    case "${path}":
      return (await import("${importPath}"))
        .default.${method};`);
      } else {
        // eslint-disable-next-line i18next/no-literal-string
        cases.push(`    case "${path}":
      return (
        await import("${importPath}")
      ).default.${method};`);
      }

      // Route handler case: maps alias → route.ts handler
      const routeFullLine = `      return (await import("${routeImportPath}")).tools.${method} as GenericHandlerBase;`;
      const routeWithParen = `      return (await import("${routeImportPath}"))`;
      if (routeFullLine.length <= 80) {
        // eslint-disable-next-line i18next/no-literal-string
        routeCases.push(`    case "${path}":
      return (await import("${routeImportPath}")).tools.${method} as GenericHandlerBase;`);
      } else if (routeWithParen.length <= 80) {
        // eslint-disable-next-line i18next/no-literal-string
        routeCases.push(`    case "${path}":
      return (await import("${routeImportPath}"))
        .tools.${method} as GenericHandlerBase;`);
      } else {
        // eslint-disable-next-line i18next/no-literal-string
        routeCases.push(`    case "${path}":
      return (
        await import("${routeImportPath}")
      ).tools.${method} as GenericHandlerBase;`);
      }
    }

    const header = generateFileHeader(
      "AUTO-GENERATED FILE - DO NOT EDIT",
      "generators/package-endpoints",
      {
        "Endpoints in package": endpointCount,
        "Total paths (with aliases)": allPaths.length,
      },
    );

    // Alias map entries
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

/**
 * Map of aliases to their canonical full paths (scoped to this package).
 */
export const pathToAliasMap = {
${aliasMapEntries}
} as const;
`;

    // eslint-disable-next-line i18next/no-literal-string
    const endpointContent = `${header}

/* eslint-disable prettier/prettier */

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";

/**
 * Dynamically import endpoint definition by path (scoped to this package).
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
    const routeHandlersContent = `${header}

/* eslint-disable prettier/prettier */

import type { GenericHandlerBase } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/handler";

/**
 * Dynamically import route handler by path (scoped to this package).
 */
export async function getRouteHandler(
  path: string,
): Promise<GenericHandlerBase | null> {
  switch (path) {
${routeCases.join("\n")}
    default:
      return null;
  }
}
`;

    return {
      endpointContent,
      aliasMapContent,
      routeHandlersContent,
      endpointCount,
    };
  }

  // ============================================================================
  // Main generator
  // ============================================================================

  /**
   * Generate scoped endpoint.ts + alias-map.ts for a package manifest.
   * Writes files to outputDir/endpoint.ts and outputDir/alias-map.ts.
   */
  static async generate(
    input: PackageEndpointGeneratorInput,
  ): Promise<PackageEndpointGeneratorResult> {
    const { manifest, outputDir, dryRun = false } = input;

    // Build set of all declared aliases/tool names including auto-injected help
    const manifestAliases = new Set([
      ...manifest.endpoints,
      TOOL_HELP_ALIAS, // always include help
    ]);

    // Discover all definition files in the codebase
    const apiCorePath = join(process.cwd(), "src", "app", "api", "[locale]");
    const allDefinitionFiles = findFilesRecursively(
      apiCorePath,
      "definition.ts",
    );
    const allRouteFiles = new Set(
      findFilesRecursively(apiCorePath, "route.ts"),
    );

    // Filter: must have a route.ts AND match the manifest by alias/tool name
    const filteredDefinitionFiles: string[] = [];
    for (const defFile of allDefinitionFiles) {
      const routePath = defFile.replace("/definition.ts", "/route.ts");
      if (!allRouteFiles.has(routePath)) {
        continue;
      }
      const matches =
        await PackageEndpointGeneratorRepository.fileMatchesManifest(
          defFile,
          manifestAliases,
        );
      if (matches) {
        filteredDefinitionFiles.push(defFile);
      }
    }

    const {
      endpointContent,
      aliasMapContent,
      routeHandlersContent,
      endpointCount,
    } = await PackageEndpointGeneratorRepository.generateContent(
      filteredDefinitionFiles,
    );

    const endpointFile = join(outputDir, "endpoint.ts");
    const aliasMapFile = join(outputDir, "alias-map.ts");
    const routeHandlersFile = join(outputDir, "route-handlers.ts");

    await writeGeneratedFile(endpointFile, endpointContent, dryRun);
    await writeGeneratedFile(aliasMapFile, aliasMapContent, dryRun);
    await writeGeneratedFile(routeHandlersFile, routeHandlersContent, dryRun);

    return { endpointFile, aliasMapFile, routeHandlersFile, endpointCount };
  }
}
