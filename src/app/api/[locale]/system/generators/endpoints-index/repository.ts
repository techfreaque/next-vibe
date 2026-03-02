/**
 * Endpoints Index Generator Repository
 * Handles endpoint index generation functionality
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

import type { LiveIndex } from "../shared/live-index";
import {
  extractNestedPath,
  findFilesRecursively,
  generateFileHeader,
  getRelativeImportPath,
  writeGeneratedFile,
} from "../shared/utils";
import type { scopedTranslation } from "./i18n";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

// Type definitions for endpoints generator
interface EndpointsRequestType {
  outputFile: string;
  dryRun: boolean;
}

interface EndpointsResponseType {
  success: boolean;
  message: string;
  endpointsFound: number;
  duration: number;
  outputFile?: string;
}

/**
 * Endpoints Index Generator Repository Implementation
 */
class EndpointsIndexGeneratorRepositoryImpl {
  async generateEndpointsIndex(
    data: EndpointsRequestType,
    logger: EndpointLogger,
    t: ModuleT,
    liveIndex?: LiveIndex,
  ): Promise<BaseResponseType<EndpointsResponseType>> {
    const startTime = Date.now();

    try {
      const outputFile = data.outputFile;
      logger.debug(`Starting endpoints index generation: ${outputFile}`);

      // Use live index when available (dev watcher), otherwise scan from disk
      let definitionFiles: string[];
      let routeFiles: string[];

      if (liveIndex) {
        logger.debug("Using live index for file discovery");
        definitionFiles = [...liveIndex.definitionFiles];
        routeFiles = [...liveIndex.routeFiles];
      } else {
        // eslint-disable-next-line i18next/no-literal-string
        const apiCorePath = ["src", "app", "api", "[locale]"];
        const startDir = join(process.cwd(), ...apiCorePath);

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

      if (definitionsWithoutRoute.length > 0) {
        const defList = definitionsWithoutRoute
          .map(
            (d) => `    • ${d.replace(process.cwd(), "").replace(/^\//, "")}`,
          )
          .join("\n");
        logger.warn(
          formatWarning(
            `Skipped ${formatCount(definitionsWithoutRoute.length, "definition")} without matching route:\n${defList}`,
          ),
        );
      }

      // Generate content
      const content = await this.generateContent(
        validDefinitionFiles,
        outputFile,
        liveIndex?.methodCache,
      );

      // Write file
      await writeGeneratedFile(outputFile, content, data.dryRun);

      const duration = Date.now() - startTime;

      logger.info(
        formatGenerator(
          `Generated endpoints index with ${formatCount(validDefinitionFiles.length, "endpoint")} in ${formatDuration(duration)}`,
          "📋",
        ),
      );

      return success({
        success: true,
        message: t("success.generated"),
        endpointsFound: definitionFiles.length,
        duration,
        outputFile: data.dryRun ? undefined : outputFile,
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error("Endpoints index generation failed", {
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
   * Extract aliases from definition file (async)
   */
  private async extractAliasesFromDefinition(
    defFile: string,
  ): Promise<string[]> {
    try {
      const definition = (await import(defFile)) as {
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
   * Helper function to format path array
   * Never split arrays - always keep them on one line
   */
  private formatPathArray(pathSegments: string[]): string {
    // eslint-disable-next-line i18next/no-literal-string
    const pathArrayElements = pathSegments.map((p) => `"${p}"`);
    const inlineLiteral = pathArrayElements.join(", ");
    const inlineFormat = `[${inlineLiteral}]`;

    // Check if the indented line would be too long for prettier's printWidth (80)
    // The array is indented with 4 spaces, plus 1 trailing comma = 5 extra chars
    const indentedLength = 4 + inlineFormat.length + 1;

    if (indentedLength > 80) {
      // eslint-disable-next-line i18next/no-literal-string
      const multilineElements = pathArrayElements
        .map((e) => `      ${e},`)
        .join("\n");
      return `[\n${multilineElements}\n    ]`;
    }
    return inlineFormat;
  }

  /**
   * Generate endpoints content with singleton pattern
   * Each path includes method suffix (e.g., ["core", "agent", "ai-stream", "POST"])
   * Each import includes method in the name (e.g., endpointDefinition_POST_0)
   * No aliases generated
   */
  private async generateContent(
    definitionFiles: string[],
    outputFile: string,
    methodCache?: Map<string, string[]>,
  ): Promise<string> {
    const imports: string[] = [];
    const setNestedPathCalls: string[] = [];

    // Reserved JS keywords that cannot be used as identifiers
    const JS_RESERVED = new Set([
      "break",
      "case",
      "catch",
      "class",
      "const",
      "continue",
      "debugger",
      "default",
      "delete",
      "do",
      "else",
      "export",
      "extends",
      "finally",
      "for",
      "function",
      "if",
      "import",
      "in",
      "instanceof",
      "let",
      "new",
      "return",
      "static",
      "super",
      "switch",
      "this",
      "throw",
      "try",
      "typeof",
      "var",
      "void",
      "while",
      "with",
      "yield",
      "enum",
      "await",
    ]);

    const usedImportNames = new Set<string>();

    for (const defFile of definitionFiles) {
      const relativePath = getRelativeImportPath(defFile, outputFile);
      const nestedPath = extractNestedPath(defFile);

      // Get methods for this endpoint — use cache when available (dev watcher)
      const methods = methodCache?.has(defFile)
        ? (methodCache.get(defFile) ?? [])
        : await this.extractMethodsFromDefinition(defFile);

      // Derive a stable base name from the nested path segments, e.g.
      // agent/chat/threads -> agent_chat_threads
      const pathSegments = nestedPath
        .map((seg) => {
          const parts = seg.split(/[^a-zA-Z0-9]+/);
          return parts
            .map((part, i) =>
              i === 0
                ? part.toLowerCase()
                : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
            )
            .join("");
        })
        .filter(Boolean);
      let baseName = pathSegments.join("_") || "root";
      if (JS_RESERVED.has(baseName)) {
        baseName = `endpoint_${baseName}`;
      }

      // Add separate import and path for each method
      for (const method of methods) {
        // eslint-disable-next-line i18next/no-literal-string
        let importName = `endpointDefinition_${method}_${baseName}`;
        // Ensure uniqueness with numeric suffix only on collision
        let suffix = 2;
        while (usedImportNames.has(importName)) {
          importName = `endpointDefinition_${method}_${baseName}_${suffix++}`;
        }
        usedImportNames.add(importName);

        // eslint-disable-next-line i18next/no-literal-string
        const importStatement = `import { default as ${importName} } from "${relativePath}";`;
        imports.push(importStatement);

        // Add path with method suffix (e.g., ["core", "agent", "ai-stream", "POST"])
        const pathWithMethod = [...nestedPath, method];
        const arrayStr = this.formatPathArray(pathWithMethod);

        // eslint-disable-next-line i18next/no-literal-string
        const singleLine = `  setNestedPath(endpoints, ${arrayStr}, ${importName}.${method});`;
        // Use multiline format for: 5+ segments, array already split, OR line > 80 chars (prettier printWidth)
        if (
          pathWithMethod.length >= 5 ||
          arrayStr.includes("\n") ||
          singleLine.length > 80
        ) {
          // eslint-disable-next-line i18next/no-literal-string
          const multiLine = `  setNestedPath(\n    endpoints,\n    ${arrayStr},\n    ${importName}.${method},\n  );`;
          setNestedPathCalls.push(multiLine);
        } else {
          setNestedPathCalls.push(singleLine);
        }
      }
    }

    // eslint-disable-next-line i18next/no-literal-string
    const autoGenTitle = "AUTO-GENERATED FILE - DO NOT EDIT";
    const generatorName = "generators/endpoints-index";
    const header = generateFileHeader(autoGenTitle, generatorName);

    // eslint-disable-next-line i18next/no-literal-string
    return `${header}

/* eslint-disable simple-import-sort/imports */
/* eslint-disable prettier/prettier */

import type { ApiSection } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { setNestedPath } from "next-vibe/shared/utils/object-path";

${imports.join("\n")}

/**
 * Singleton instance for endpoints registry
 */
let endpointsInstance: Record<string, ApiSection> | null = null;

/**
 * Initialize and return singleton endpoints instance
 */
function initializeEndpoints(): Record<string, ApiSection> {
  if (endpointsInstance !== null) {
    return endpointsInstance;
  }

  const endpoints: Record<string, ApiSection> = {};
${setNestedPathCalls.join("\n")}

  endpointsInstance = endpoints;
  return endpoints;
}

/**
 * Get the singleton endpoints instance
 */
export const endpoints = initializeEndpoints();

/**
 * @deprecated Use 'endpoints' singleton export instead
 */
export function setupEndpoints(): Record<string, ApiSection> {
  return endpoints;
}
`;
  }
}

export const endpointsIndexGeneratorRepository =
  new EndpointsIndexGeneratorRepositoryImpl();
