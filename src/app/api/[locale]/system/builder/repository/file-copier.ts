/**
 * File Copier Service
 * Copies files and folders during build
 */

import { existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { TFunction } from "@/i18n/core/static-types";

import type { CopyConfig } from "../definition";
import { ROOT_DIR } from "./constants";
import { outputFormatter } from "./output-formatter";

// ============================================================================
// Interface
// ============================================================================

export interface IFileCopier {
  /**
   * Copy files and folders to destinations
   */
  copy(
    filesToCopy: CopyConfig[],
    output: string[],
    filesCopied: string[],
    logger: EndpointLogger,
    t: TFunction,
    dryRun?: boolean,
  ): Promise<void>;

  /**
   * Check if source path exists
   */
  sourceExists(input: string): boolean;
}

// ============================================================================
// Implementation
// ============================================================================

export class FileCopier implements IFileCopier {
  async copy(
    filesToCopy: CopyConfig[],
    output: string[],
    filesCopied: string[],
    logger: EndpointLogger,
    t: TFunction,
    dryRun?: boolean,
  ): Promise<void> {
    output.push(
      outputFormatter.formatSection(
        t("app.api.system.builder.messages.copyingAdditionalFiles"),
      ),
    );
    logger.info("Copying files", { count: filesToCopy.length });

    for (const fileData of filesToCopy) {
      const srcPath = resolve(ROOT_DIR, fileData.input);
      const destPath = resolve(ROOT_DIR, fileData.output);
      const destDir = dirname(destPath);

      if (!existsSync(srcPath)) {
        output.push(
          outputFormatter.formatWarning(`${fileData.input} → skipped (not found)`),
        );
        logger.warn("Source file not found, skipping", { src: srcPath });
        continue;
      }

      output.push(outputFormatter.formatItem(fileData.input, `→ ${fileData.output}`));

      if (!dryRun) {
        if (!existsSync(destDir)) {
          mkdirSync(destDir, { recursive: true });
        }
        const fsExtraPkg = "fs-extra";
        const { copy } = await import(/* webpackIgnore: true */ fsExtraPkg);
        await copy(srcPath, destPath);
      }

      filesCopied.push(fileData.output);
    }
  }

  sourceExists(input: string): boolean {
    const srcPath = resolve(ROOT_DIR, input);
    return existsSync(srcPath);
  }
}

// Singleton instance
export const fileCopier = new FileCopier();
