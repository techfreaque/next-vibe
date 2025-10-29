/**
 * Endpoint Generator Repository
 * Generates endpoint.ts with dynamic imports and flat path structure
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
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<BaseResponseType<EndpointResponseType>>;
}

/**
 * Endpoint Generator Repository Implementation
 */
class EndpointGeneratorRepositoryImpl implements EndpointGeneratorRepository {
  async generateEndpoint(
    data: EndpointRequestType,
    _user: JwtPayloadType,
    _locale: CountryLanguage,
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
      const content = this.generateContent(definitionFiles);

      // Write file
      await writeGeneratedFile(outputFile, content, data.dryRun);

      const duration = Date.now() - startTime;

      logger.info("Generated endpoint file", {
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
      logger.error("Endpoint generation failed", {
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
   * Generate endpoint content with dynamic imports
   */
  private generateContent(definitionFiles: string[]): string {
    const pathMap: Record<string, string> = {};
    const allPaths: string[] = [];

    // Build path map with aliases
    for (const defFile of definitionFiles) {
      const { path, aliases } = extractPathKey(defFile);
      const importPath = generateAbsoluteImportPath(defFile, "definition");

      // Add main path
      pathMap[path] = importPath;
      allPaths.push(path);

      // Add aliases
      for (const alias of aliases) {
        pathMap[alias] = importPath;
        allPaths.push(alias);
      }
    }

    // Sort paths for consistent output
    allPaths.sort();

    // Generate getEndpoint function cases
    const cases: string[] = [];
    for (const path of allPaths) {
      const importPath = pathMap[path];
      // eslint-disable-next-line i18next/no-literal-string
      cases.push(`    case "${path}":
      return (await import("${importPath}")).default;`);
    }

    // eslint-disable-next-line i18next/no-literal-string
    const autoGenTitle = "AUTO-GENERATED FILE - DO NOT EDIT";
    const generatorName = "generators/endpoint";
    const header = generateFileHeader(autoGenTitle, generatorName, {
      "Endpoints found": definitionFiles.length,
      "Total paths (with aliases)": allPaths.length,
    });

    // eslint-disable-next-line i18next/no-literal-string
    return `${header}

/* eslint-disable prettier/prettier */
/* eslint-disable i18next/no-literal-string */

import type { ApiSection } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/endpoint";

/**
 * Dynamically import endpoint definition by path
 * @param path - The endpoint path (e.g., "core/agent/chat/threads")
 * @returns The endpoint definition or null if not found
 */
export async function getEndpoint(path: string): Promise<ApiSection | null> {
  switch (path) {
${cases.join("\n")}
    default:
      return null;
  }
}

/**
 * Get all available endpoint paths
 */
export function getAllEndpointPaths(): string[] {
  return [
${allPaths.map((p) => `    "${p}",`).join("\n")}
  ];
}

/**
 * Check if an endpoint path exists
 */
export function hasEndpoint(path: string): boolean {
  return getAllEndpointPaths().includes(path);
}
`;
  }
}

export const endpointGeneratorRepository =
  new EndpointGeneratorRepositoryImpl();
