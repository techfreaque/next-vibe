/**
 * Asset Zipper Service
 * Zip folders for release assets
 */

import { createWriteStream, existsSync, mkdirSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "../../unified-interface/shared/logger/endpoint";
import type { PackageJson } from "../definition";
import { MESSAGES } from "./constants";

// ============================================================================
// Interface
// ============================================================================

export interface IAssetZipper {
  /**
   * Zip folders for release
   */
  zipFolders(
    newTag: string,
    packageJson: PackageJson,
    foldersToZip: Array<{
      input: string;
      output: string;
      includeBase?: boolean;
      exclude?: string[];
    }>,
    logger: EndpointLogger,
    dryRun: boolean,
  ): Promise<ResponseType<void>>;
}

// ============================================================================
// Implementation
// ============================================================================

export class AssetZipper implements IAssetZipper {
  async zipFolders(
    newTag: string,
    packageJson: PackageJson,
    foldersToZip: Array<{
      input: string;
      output: string;
      includeBase?: boolean;
      exclude?: string[];
    }>,
    logger: EndpointLogger,
    dryRun: boolean,
  ): Promise<ResponseType<void>> {
    if (!foldersToZip || foldersToZip.length === 0) {
      return success();
    }

    if (dryRun) {
      logger.info(MESSAGES.DRY_RUN_MODE, { action: "zip folders" });
      return success();
    }

    logger.info(MESSAGES.ZIPPING_FOLDERS);

    for (const zipConfig of foldersToZip) {
      const inputPath = resolve(process.cwd(), zipConfig.input);

      let outputFileName = basename(zipConfig.output);
      outputFileName = outputFileName
        .replaceAll("%NAME%", packageJson.name)
        .replaceAll("%VERSION%", newTag)
        .replaceAll(
          "%TIMESTAMP%",
          new Date()
            .toISOString()
            .replaceAll(/[:.T]/g, "-")
            .split("-")
            .slice(0, 6)
            .join("-"),
        );

      const outputDir = dirname(resolve(process.cwd(), zipConfig.output));
      const outputPath = join(outputDir, outputFileName);

      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
      }

      if (!existsSync(inputPath)) {
        logger.error(`Input folder ${inputPath} does not exist`);
        continue;
      }

      try {
        const output = createWriteStream(outputPath);
        const archiverPkg = "archiver";
        const archiver = (await import(/* webpackIgnore: true */ archiverPkg))
          .default;
        const archive = archiver("zip", { zlib: { level: 9 } });

        await new Promise<void>((resolve, reject) => {
          output.on("close", () => {
            logger.info(MESSAGES.ZIP_COMPLETE, {
              input: inputPath,
              output: outputPath,
              bytes: archive.pointer(),
            });
            resolve();
          });

          archive.on("error", (err: Error) => reject(err));
          archive.pipe(output);
          archive.directory(inputPath, false);
          archive.finalize().then(resolve).catch(reject);
        });
      } catch (error) {
        logger.error(MESSAGES.ZIP_FAILED, parseError(error));
      }
    }

    return success();
  }
}

// Singleton instance
export const assetZipper = new AssetZipper();
