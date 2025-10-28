/**
 * Seeds Generator Repository
 * Handles database seed generation functionality
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

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";
import type { CountryLanguage } from "@/i18n/core/config";

import type { JwtPayloadType } from "../../../user/auth/types";
import {
  extractModuleName,
  findFilesRecursively,
  generateFileHeader,
  getRelativeImportPath,
  writeGeneratedFile,
} from "../shared/utils";

// Type definitions for seeds generator
interface SeedsRequestType {
  outputDir: string;
  includeTestData: boolean;
  includeProdData: boolean;
  verbose: boolean;
  dryRun: boolean;
}

interface SeedsResponseType {
  success: boolean;
  message: string;
  seedsFound: number;
  duration: number;
  outputPath: string;
}

/**
 * Seeds Generator Repository Interface
 */
interface SeedsGeneratorRepository {
  generateSeeds(
    data: SeedsRequestType,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<BaseResponseType<SeedsResponseType>>;
}

/**
 * Seeds Generator Repository Implementation
 */
class SeedsGeneratorRepositoryImpl implements SeedsGeneratorRepository {
  async generateSeeds(
    data: SeedsRequestType,
    _user: JwtPayloadType,
    _locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<BaseResponseType<SeedsResponseType>> {
    const startTime = Date.now();

    try {
      const outputFile = join(data.outputDir, "seeds.ts");
      logger.debug("Starting seeds generation", { outputFile });

      // Discover seed files
      // eslint-disable-next-line i18next/no-literal-string
      const apiCorePath = ["src", "app", "api", "[locale]", "v1", "core"];
      const startDir = join(process.cwd(), ...apiCorePath);

      logger.debug("Discovering seed files");
      const seedFiles = findFilesRecursively(startDir, "seeds.ts");

      logger.debug(`Found ${seedFiles.length} seed files`);

      // Generate content
      const content = this.generateContent(seedFiles, outputFile);

      // Write file
      await writeGeneratedFile(outputFile, content, data.dryRun);

      const duration = Date.now() - startTime;

      logger.info("Generated seeds file", {
        seedCount: seedFiles.length,
        duration,
        outputPath: data.dryRun ? undefined : outputFile,
      });

      return createSuccessResponse({
        success: true,
        message: "app.api.v1.core.system.generators.seeds.success.generated",
        seedsFound: seedFiles.length,
        duration,
        outputPath: data.dryRun ? data.outputDir : outputFile,
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error("Seeds generation failed", {
        error: parseError(error),
        duration,
      });

      return createErrorResponse(
        "app.api.v1.core.system.generators.seeds.error.generation_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
        {
          duration,
        },
      );
    }
  }

  /**
   * Generate seeds content
   */
  private generateContent(seedFiles: string[], outputFile: string): string {
    const imports: string[] = [];
    const setupStatements: string[] = [];

    for (let i = 0; i < seedFiles.length; i++) {
      const seedFile = seedFiles[i];
      const relativePath = getRelativeImportPath(seedFile, outputFile);
      const moduleName = extractModuleName(seedFile);

      // eslint-disable-next-line i18next/no-literal-string
      imports.push(`import * as seedModule${i} from "${relativePath}";`);
      // eslint-disable-next-line i18next/no-literal-string
      const seedSetupStatement = `  seeds["${moduleName}"] = seedModule${i} as EnvironmentSeeds;`;
      setupStatements.push(seedSetupStatement);
    }

    // eslint-disable-next-line i18next/no-literal-string
    const autoGenTitle = "AUTO-GENERATED FILE - DO NOT EDIT";
    // eslint-disable-next-line i18next/no-literal-string
    const generatorName = "Seeds Generator";
    const header = generateFileHeader(autoGenTitle, generatorName);

    // eslint-disable-next-line i18next/no-literal-string
    return `${header}

/* eslint-disable simple-import-sort/imports */

import type { EnvironmentSeeds } from "@/app/api/[locale]/v1/core/system/db/seed/seed-manager";

${imports.join("\n")}
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/logger-types";

export const seeds: Record<string, EnvironmentSeeds> = {};

/**
 * Initialize the seeds registry
 * In development, this is called automatically
 * In production, this should only be called once
 */
export function setupSeeds(
  logger: EndpointLogger,
): Record<string, EnvironmentSeeds> {
${setupStatements.join("\n")}
  logger.debug("Seeds setup complete.");
  return seeds;
}
`;
  }
}

export const seedsGeneratorRepository = new SeedsGeneratorRepositoryImpl();
