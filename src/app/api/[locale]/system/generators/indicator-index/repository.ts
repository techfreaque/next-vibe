/**
 * Indicator Index Generator Repository
 * Scans for indicators.ts files and generates a unified index.
 */

/* eslint-disable i18next/no-literal-string */
// Generator output — no i18n needed

import "server-only";

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

class IndicatorIndexGeneratorRepositoryImpl {
  async generateIndicatorIndex(
    data: GenerateOptions,
    logger: EndpointLogger,
    liveIndex?: LiveIndex,
  ): Promise<GenerateResult> {
    const startTime = Date.now();

    try {
      logger.debug(`Starting indicator index generation: ${data.outputFile}`);

      let indicatorFiles: string[];

      if (liveIndex) {
        logger.debug("Using live index for file discovery");
        indicatorFiles = [...liveIndex.indicatorFiles];
      } else {
        const apiCorePath = ["src", "app", "api", "[locale]"];
        const startDir = join(process.cwd(), ...apiCorePath);

        logger.debug("Discovering indicators.ts files");
        indicatorFiles = findFilesRecursively(startDir, "indicators.ts");
      }

      logger.debug(`Found ${indicatorFiles.length} indicators.ts files`);

      const content = this.generateContent(indicatorFiles, data.outputFile);

      await writeGeneratedFile(data.outputFile, content, data.dryRun);

      const duration = Date.now() - startTime;

      logger.info(
        formatGenerator(
          `Generated indicator index with ${formatCount(indicatorFiles.length, "module")} in ${formatDuration(duration)}`,
          "📊",
        ),
      );

      return {
        success: true,
        message: `Generated indicator index with ${indicatorFiles.length} modules in ${duration}ms`,
        filesFound: indicatorFiles.length,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error("Indicator index generation failed", {
        error: parseError(error),
      });
      return {
        success: false,
        message: `Indicator index generation failed: ${parseError(error).message}`,
        filesFound: 0,
        duration,
      };
    }
  }

  private generateContent(
    indicatorFiles: string[],
    outputFile: string,
  ): string {
    const imports: string[] = [];

    let moduleIndex = 0;

    for (const file of indicatorFiles) {
      const relativePath = getRelativeImportPath(file, outputFile);
      imports.push(
        `import * as indicatorModule${moduleIndex} from "${relativePath}";`,
      );
      moduleIndex++;
    }

    const moduleRefs: string[] = [];
    for (let i = 0; i < moduleIndex; i++) {
      moduleRefs.push(`  indicatorModule${i},`);
    }

    const header = generateFileHeader(
      "AUTO-GENERATED INDICATOR INDEX",
      "Indicator Index Generator",
      {
        Implements: "Auto-discovery of indicators.ts files for Vibe Sense",
        "Indicator modules": indicatorFiles.length,
      },
    );

    return `${header}

/* eslint-disable prettier/prettier */
/* eslint-disable simple-import-sort/imports */

import type { AnyIndicator } from "../unified-interface/vibe-sense/indicators/types";

${imports.join("\n")}

/**
 * All indicator modules discovered from the codebase.
 * Each module exports named indicator constants.
 */
export const indicatorModules: Record<string, AnyIndicator>[] = [
${moduleRefs.join("\n")}
] as Record<string, AnyIndicator>[];
`;
  }
}

export const indicatorIndexGeneratorRepository =
  new IndicatorIndexGeneratorRepositoryImpl();
