/**
 * Folder Cleaner Service
 * Cleans output folders before building
 */

import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { TFunction } from "@/i18n/core/static-types";

import { ROOT_DIR } from "./constants";
import { outputFormatter } from "./output-formatter";

// ============================================================================
// Interface
// ============================================================================

export interface IFolderCleaner {
  /**
   * Clean (delete) specified folders
   */
  clean(
    folders: string[],
    output: string[],
    logger: EndpointLogger,
    t: TFunction,
    dryRun?: boolean,
  ): Promise<void>;

  /**
   * Check if a folder exists
   */
  exists(folder: string): boolean;
}

// ============================================================================
// Implementation
// ============================================================================

export class FolderCleaner implements IFolderCleaner {
  async clean(
    folders: string[],
    output: string[],
    logger: EndpointLogger,
    t: TFunction,
    dryRun?: boolean,
  ): Promise<void> {
    output.push(
      outputFormatter.formatSection(
        t("app.api.system.builder.messages.cleaningFolders"),
      ),
    );

    for (const folder of folders) {
      const folderPath = resolve(ROOT_DIR, folder);
      const exists = existsSync(folderPath);

      output.push(
        outputFormatter.formatItem(
          folder,
          exists ? "✓ will be deleted" : "⊘ not found, skipping",
        ),
      );
      logger.info("Cleaning folder", { folder: folderPath, exists, dryRun });

      if (!dryRun && exists) {
        rmSync(folderPath, { force: true, recursive: true });
      }
    }
  }

  exists(folder: string): boolean {
    const folderPath = resolve(ROOT_DIR, folder);
    return existsSync(folderPath);
  }
}

// Singleton instance
export const folderCleaner = new FolderCleaner();
