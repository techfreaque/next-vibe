/**
 * Endpoints Index Generator Repository
 * Handles endpoint index generation functionality
 */

import "server-only";

import { join } from "node:path";

import type { ResponseType as BaseResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { JwtPayloadType } from "../../../user/auth/types";
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
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<BaseResponseType<EndpointsResponseType>>;
}

/**
 * Endpoints Index Generator Repository Implementation
 */
class EndpointsIndexGeneratorRepositoryImpl
  implements EndpointsIndexGeneratorRepository
{
  async generateEndpointsIndex(
    data: EndpointsRequestType,
    _user: JwtPayloadType,
    _locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<BaseResponseType<EndpointsResponseType>> {
    const startTime = Date.now();

    try {
      const outputFile = data.outputFile;
      logger.debug("Starting endpoints index generation", { outputFile });

      // Discover definition files
      // eslint-disable-next-line i18next/no-literal-string
      const apiCorePath = ["src", "app", "api", "[locale]", "v1", "core"];
      const startDir = join(process.cwd(), ...apiCorePath);

      logger.debug("Discovering definition files");
      const definitionFiles = findFilesRecursively(startDir, "definition.ts");

      logger.debug(`Found ${definitionFiles.length} definition files`);

      // Generate content
      const content = this.generateContent(definitionFiles, outputFile);

      // Write file
      await writeGeneratedFile(outputFile, content, data.dryRun);

      const duration = Date.now() - startTime;

      logger.info("Generated endpoints file", {
        endpointCount: definitionFiles.length,
        duration,
        outputPath: data.dryRun ? undefined : outputFile,
      });

      return createSuccessResponse({
        success: true,
        message:
          "app.api.v1.core.system.generators.endpoints.success.generated",
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

      return createErrorResponse(
        "app.api.v1.core.system.generators.endpoints.post.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        {
          duration,
        },
      );
    }
  }

  /**
   * Generate endpoints content with singleton pattern
   */
  private generateContent(
    definitionFiles: string[],
    outputFile: string,
  ): string {
    const imports: string[] = [];
    const setNestedPathCalls: string[] = [];

    for (let i = 0; i < definitionFiles.length; i++) {
      const defFile = definitionFiles[i];
      const relativePath = getRelativeImportPath(defFile, outputFile);
      const nestedPath = extractNestedPath(defFile);

      // eslint-disable-next-line i18next/no-literal-string
      const importStatement = `import { default as endpointDefinition${i} } from "${relativePath}";`;
      imports.push(importStatement);

      // Format array - split if too many elements or total length > 70
      // eslint-disable-next-line i18next/no-literal-string
      const pathArrayElements = nestedPath.map((p) => `"${p}"`);
      const pathArrayLiteral = pathArrayElements.join(", ");
      const shouldSplitArray =
        pathArrayElements.length > 7 || pathArrayLiteral.length > 70;

      let arrayStr;
      if (shouldSplitArray) {
        // eslint-disable-next-line i18next/no-literal-string
        arrayStr = `[\n      ${pathArrayElements.join(",\n      ")},\n    ]`;
      } else {
        arrayStr = `[${pathArrayLiteral}]`;
      }

      // Format as multiline if too long (>80 chars)
      // eslint-disable-next-line i18next/no-literal-string
      const singleLine = `  setNestedPath(endpoints, ${arrayStr}, endpointDefinition${i});`;
      if (singleLine.length > 80 || shouldSplitArray) {
        // eslint-disable-next-line i18next/no-literal-string
        const multiLine = `  setNestedPath(\n    endpoints,\n    ${arrayStr},\n    endpointDefinition${i},\n  );`;
        setNestedPathCalls.push(multiLine);
      } else {
        setNestedPathCalls.push(singleLine);
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

import type { ApiSection } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/endpoint";
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
