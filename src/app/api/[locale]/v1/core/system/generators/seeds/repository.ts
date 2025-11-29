/**
 * Seeds Generator Repository
 * Handles database seed generation functionality
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
    logger: EndpointLogger,
  ): Promise<BaseResponseType<SeedsResponseType>>;
}

/**
 * Seeds Generator Repository Implementation
 */
class SeedsGeneratorRepositoryImpl implements SeedsGeneratorRepository {
  async generateSeeds(
    data: SeedsRequestType,
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

      logger.info(
        `Generated seeds file with ${seedFiles.length} seeds in ${duration}ms`,
      );

      return success({
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

      return fail({
        message:
          "app.api.v1.core.system.generators.seeds.error.generation_failed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          duration,
        },
      });
    }
  }

  /**
   * Generate seeds content with dynamic imports
   */
  private generateContent(seedFiles: string[], outputFile: string): string {
    const switchCases: string[] = [];
    const seedPaths: string[] = [];

    for (let i = 0; i < seedFiles.length; i++) {
      const seedFile = seedFiles[i];
      const relativePath = getRelativeImportPath(seedFile, outputFile);
      const moduleName = extractModuleName(seedFile);

      // eslint-disable-next-line i18next/no-literal-string
      seedPaths.push(`    "${moduleName}",`);

      // eslint-disable-next-line i18next/no-literal-string
      const caseStatement = `    case "${moduleName}":\n      return (await import("${relativePath}")) as EnvironmentSeeds;`;
      switchCases.push(caseStatement);
    }

    // eslint-disable-next-line i18next/no-literal-string
    const autoGenTitle = "AUTO-GENERATED FILE - DO NOT EDIT";
    // eslint-disable-next-line i18next/no-literal-string
    const generatorName = "Seeds Generator";
    const header = generateFileHeader(autoGenTitle, generatorName);

    // eslint-disable-next-line i18next/no-literal-string
    return `${header}

/* eslint-disable prettier/prettier */
/* eslint-disable i18next/no-literal-string */

import type { EnvironmentSeeds } from "@/app/api/[locale]/v1/core/system/db/seed/seed-manager";

/**
 * Dynamically import seed module by name
 * @param moduleName - The seed module name (e.g., "user", "leads")
 * @returns The seed module or null if not found
 */
export async function getSeedModule(moduleName: string): Promise<EnvironmentSeeds | null> {
  switch (moduleName) {
${switchCases.join("\n")}
    default:
      return null;
  }
}

/**
 * Get all available seed module names
 */
export function getAllSeedModuleNames(): string[] {
  return [
${seedPaths.join("\n")}
  ];
}

/**
 * Check if a seed module exists
 */
export function hasSeedModule(moduleName: string): boolean {
  return getAllSeedModuleNames().includes(moduleName);
}
`;
  }
}

export const seedsGeneratorRepository = new SeedsGeneratorRepositoryImpl();
