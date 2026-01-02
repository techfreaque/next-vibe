/**
 * Endpoints Index Generator Repository
 * Handles endpoint index generation functionality
 */

import "server-only";

import { join } from "node:path";

import type { ResponseType as BaseResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes, fail, success } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  formatCount,
  formatDuration,
  formatGenerator,
} from "@/app/api/[locale]/system/unified-interface/shared/logger/formatters";
import type { ApiSection } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";

import {
  extractNestedPath,
  findFilesRecursively,
  generateFileHeader,
  getRelativeImportPath,
  writeGeneratedFile,
} from "../shared/utils";

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
 * Endpoints Index Generator Repository Interface
 */
interface EndpointsIndexGeneratorRepository {
  generateEndpointsIndex(
    data: EndpointsRequestType,
    logger: EndpointLogger,
  ): Promise<BaseResponseType<EndpointsResponseType>>;
}

/**
 * Endpoints Index Generator Repository Implementation
 */
class EndpointsIndexGeneratorRepositoryImpl implements EndpointsIndexGeneratorRepository {
  async generateEndpointsIndex(
    data: EndpointsRequestType,
    logger: EndpointLogger,
  ): Promise<BaseResponseType<EndpointsResponseType>> {
    const startTime = Date.now();

    try {
      const outputFile = data.outputFile;
      logger.debug("Starting endpoints index generation", { outputFile });

      // Discover definition files
      // eslint-disable-next-line i18next/no-literal-string
      const apiCorePath = ["src", "app", "api", "[locale]"];
      const startDir = join(process.cwd(), ...apiCorePath);

      logger.debug("Discovering definition files");
      const definitionFiles = findFilesRecursively(startDir, "definition.ts");

      logger.debug(`Found ${definitionFiles.length} definition files`);

      // Generate content
      const content = await this.generateContent(definitionFiles, outputFile);

      // Write file
      await writeGeneratedFile(outputFile, content, data.dryRun);

      const duration = Date.now() - startTime;

      logger.info(
        formatGenerator(
          `Generated endpoints index with ${formatCount(definitionFiles.length, "endpoint")} in ${formatDuration(duration)}`,
          "📋",
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
      logger.error("Endpoints index generation failed", {
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
   */
  private async extractMethodsFromDefinition(defFile: string): Promise<string[]> {
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
        ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"].includes(key),
      );
      return methods;
    } catch {
      return [];
    }
  }

  /**
   * Extract aliases from definition file (async)
   */
  private async extractAliasesFromDefinition(defFile: string): Promise<string[]> {
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
   */
  private formatPathArray(pathSegments: string[]): string {
    // eslint-disable-next-line i18next/no-literal-string
    const pathArrayElements = pathSegments.map((p) => `"${p}"`);
    const pathArrayLiteral = pathArrayElements.join(", ");
    const shouldSplitArray = pathArrayElements.length > 7 || pathArrayLiteral.length > 70;

    if (shouldSplitArray) {
      // eslint-disable-next-line i18next/no-literal-string
      return `[\n      ${pathArrayElements.join(",\n      ")},\n    ]`;
    }
    return `[${pathArrayLiteral}]`;
  }

  /**
   * Generate endpoints content with singleton pattern
   * Each path includes method suffix (e.g., ["core", "agent", "ai-stream", "POST"])
   * Each import includes method in the name (e.g., endpointDefinition_POST_0)
   * No aliases generated
   */
  private async generateContent(definitionFiles: string[], outputFile: string): Promise<string> {
    const imports: string[] = [];
    const setNestedPathCalls: string[] = [];
    let importCounter = 0;

    for (const defFile of definitionFiles) {
      const relativePath = getRelativeImportPath(defFile, outputFile);
      const nestedPath = extractNestedPath(defFile);

      // Get methods for this endpoint
      const methods = await this.extractMethodsFromDefinition(defFile);

      // Add separate import and path for each method
      for (const method of methods) {
        // eslint-disable-next-line i18next/no-literal-string
        const importName = `endpointDefinition_${method}_${importCounter}`;
        // eslint-disable-next-line i18next/no-literal-string
        const importStatement = `import { default as ${importName} } from "${relativePath}";`;
        imports.push(importStatement);

        // Add path with method suffix (e.g., ["core", "agent", "ai-stream", "POST"])
        const pathWithMethod = [...nestedPath, method];
        const arrayStr = this.formatPathArray(pathWithMethod);

        // eslint-disable-next-line i18next/no-literal-string
        const singleLine = `  setNestedPath(endpoints, ${arrayStr}, ${importName}.${method});`;
        if (singleLine.length > 80 || arrayStr.includes("\n")) {
          // eslint-disable-next-line i18next/no-literal-string
          const multiLine = `  setNestedPath(\n    endpoints,\n    ${arrayStr},\n    ${importName}.${method},\n  );`;
          setNestedPathCalls.push(multiLine);
        } else {
          setNestedPathCalls.push(singleLine);
        }

        importCounter++;
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

import type { ApiSection } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
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

export const endpointsIndexGeneratorRepository = new EndpointsIndexGeneratorRepositoryImpl();
