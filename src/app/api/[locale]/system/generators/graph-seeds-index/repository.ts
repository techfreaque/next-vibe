/**
 * Graph Seeds Index Generator Repository
 * Scans for graph-seeds.ts files and generates a unified index.
 */

/* eslint-disable i18next/no-literal-string */
// Generator output — no i18n needed

import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  formatCount,
  formatDuration,
  formatGenerator,
} from "@/app/api/[locale]/system/unified-interface/shared/logger/formatters";

import type { LiveIndex } from "../shared/live-index";
import {
  findFilesRecursively,
  generateFileHeader,
  getRelativeImportPath,
  writeGeneratedFile,
} from "../shared/utils";

interface GenerateOptions {
  outputFile: string;
  dryRun: boolean;
}

interface GenerateResult {
  success: boolean;
  message: string;
  filesFound: number;
  duration: number;
}

class GraphSeedsIndexGeneratorRepositoryImpl {
  async generateGraphSeedsIndex(
    data: GenerateOptions,
    logger: EndpointLogger,
    liveIndex?: LiveIndex,
  ): Promise<GenerateResult> {
    const startTime = Date.now();

    try {
      logger.debug(`Starting graph seeds index generation: ${data.outputFile}`);

      let seedFiles: string[];

      if (liveIndex) {
        logger.debug("Using live index for file discovery");
        seedFiles = [...liveIndex.graphSeedFiles];
      } else {
        const apiCorePath = ["src", "app", "api", "[locale]"];
        const startDir = join(process.cwd(), ...apiCorePath);

        logger.debug("Discovering graph-seeds.ts files");
        seedFiles = findFilesRecursively(startDir, "graph-seeds.ts");
      }

      logger.debug(`Found ${seedFiles.length} graph-seeds.ts files`);

      // Validate files
      const validationResult = await this.validateFiles(seedFiles);
      if (!validationResult.success) {
        return {
          success: false,
          message: validationResult.error ?? "Validation failed",
          filesFound: 0,
          duration: Date.now() - startTime,
        };
      }

      const content = this.generateContent(seedFiles, data.outputFile);

      await writeGeneratedFile(data.outputFile, content, data.dryRun);

      const duration = Date.now() - startTime;

      logger.info(
        formatGenerator(
          `Generated graph seeds index with ${formatCount(seedFiles.length, "module")} in ${formatDuration(duration)}`,
          "🌱",
        ),
      );

      return {
        success: true,
        message: `Generated graph seeds index with ${seedFiles.length} modules in ${duration}ms`,
        filesFound: seedFiles.length,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error("Graph seeds index generation failed", {
        error: parseError(error),
      });
      return {
        success: false,
        message: `Graph seeds index generation failed: ${parseError(error).message}`,
        filesFound: 0,
        duration,
      };
    }
  }

  private async validateFiles(
    files: string[],
  ): Promise<{ success: boolean; error?: string }> {
    for (const file of files) {
      try {
        const content = await readFile(file, "utf-8");

        if (
          !content.includes("export const graphSeeds") &&
          !content.includes("export { graphSeeds }")
        ) {
          return {
            success: false,
            error: `Graph seeds file ${file} must export 'graphSeeds' array`,
          };
        }
      } catch (error) {
        return {
          success: false,
          error: `Failed to validate graph seeds file ${file}: ${parseError(error).message}`,
        };
      }
    }

    return { success: true };
  }

  private generateContent(seedFiles: string[], outputFile: string): string {
    const imports: string[] = [];
    const spreadEntries: string[] = [];

    let moduleIndex = 0;

    for (const file of seedFiles) {
      const relativePath = getRelativeImportPath(file, outputFile);
      imports.push(
        `import { graphSeeds as seedModule${moduleIndex} } from "${relativePath}";`,
      );
      spreadEntries.push(`  ...seedModule${moduleIndex},`);
      moduleIndex++;
    }

    const header = generateFileHeader(
      "AUTO-GENERATED GRAPH SEEDS INDEX",
      "Graph Seeds Index Generator",
      {
        Implements:
          "Auto-discovery of graph-seeds.ts files for Vibe Sense pipeline graphs",
        "Graph seed modules": seedFiles.length,
      },
    );

    return `${header}

/* eslint-disable prettier/prettier */
/* eslint-disable simple-import-sort/imports */

import type { GraphSeedEntry } from "../unified-interface/vibe-sense/graph/types";

${imports.join("\n")}

/**
 * All graph seed entries discovered from the codebase.
 */
export const allGraphSeeds: GraphSeedEntry[] = [
${spreadEntries.join("\n")}
];
`;
  }
}

export const graphSeedsIndexGeneratorRepository =
  new GraphSeedsIndexGeneratorRepositoryImpl();
