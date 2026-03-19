/**
 * Seeds Generator Repository
 * Handles database seed generation functionality
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
} from "@/app/api/[locale]/system/unified-interface/shared/logger/formatters";

import type { LiveIndex } from "../shared/live-index";
import {
  extractModuleName,
  findFilesRecursively,
  generateFileHeader,
  getRelativeImportPath,
  writeGeneratedFile,
} from "../shared/utils";
import type { GeneratorsSeedsT } from "./i18n";

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

export class SeedsGeneratorRepository {
  static async generateSeeds(
    data: SeedsRequestType,
    logger: EndpointLogger,
    t: GeneratorsSeedsT,
    liveIndex?: LiveIndex,
  ): Promise<BaseResponseType<SeedsResponseType>> {
    const startTime = Date.now();

    try {
      const outputFile = join(data.outputDir, "seeds.ts");
      logger.debug(`Starting seeds generation: ${outputFile}`);

      // Use live index when available (dev watcher), otherwise scan from disk
      let seedFiles: string[];

      if (liveIndex) {
        logger.debug("Using live index for file discovery");
        seedFiles = [...liveIndex.seedFiles];
      } else {
        // Use template string to prevent Turbopack from statically tracing paths
        const startDir = `${process.cwd()}/src/app/api/[locale]`;

        logger.debug("Discovering seed files");
        seedFiles = findFilesRecursively(startDir, "seeds.ts");
      }

      logger.debug(`Found ${seedFiles.length} seed files`);

      // Generate content
      const content = SeedsGeneratorRepository.generateContent(
        seedFiles,
        outputFile,
      );

      // Write file
      await writeGeneratedFile(outputFile, content, data.dryRun);

      const duration = Date.now() - startTime;

      logger.info(
        formatGenerator(
          `Generated seeds file with ${formatCount(seedFiles.length, "seed")} in ${formatDuration(duration)}`,
          "🌱",
        ),
      );

      return success({
        success: true,
        message: t("success.generated"),
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
        message: t("error.generation_failed"),
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
  private static generateContent(
    seedFiles: string[],
    outputFile: string,
  ): string {
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

import type { EnvironmentSeeds } from "@/app/api/[locale]/system/db/seed/seed-manager";

/**
 * Dynamically import seed module by name
 * @param moduleName - The seed module name (e.g., "user", "leads")
 * @returns The seed module or null if not found
 */
export async function getSeedModule(
  moduleName: string,
): Promise<EnvironmentSeeds | null> {
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
