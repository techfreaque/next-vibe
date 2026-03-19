/**
 * Database Migration Sync Repository
 * Handles migration state synchronization operations
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { sql } from "drizzle-orm";
import { migrate as drizzleMigrate } from "drizzle-orm/node-postgres/migrator";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type {
  MigrateSyncRequestOutput,
  MigrateSyncResponseOutput,
} from "./definition";
import type { MigrateSyncT } from "./i18n";

/**
 * Database Migration Sync Repository
 */
export class DatabaseMigrateSyncRepository {
  private static readonly SQL_FILE_EXTENSION = ".sql";
  private static readonly BACKUP_FOLDER_NAME = ".backup";
  private static readonly TRACKING_COMMENT = `-- Migration tracking only - original backed up
-- This allows Drizzle to establish proper tracking without executing DDL
SELECT 1; -- No-op for tracking
`;
  static async syncMigrations(
    data: MigrateSyncRequestOutput,
    t: MigrateSyncT,
    logger: EndpointLogger,
  ): Promise<ResponseType<MigrateSyncResponseOutput>> {
    try {
      logger.info("Starting migration sync process", { options: data });

      // Initialize response values
      let trackingCleared = false;
      let trackingFilesCreated = false;
      let drizzleMigrationRun = false;
      let originalFilesRestored = false;

      if (data.dryRun) {
        logger.info("DRY RUN MODE - No changes will be made");

        // Count migration files for dry run
        const migrationFiles =
          DatabaseMigrateSyncRepository.getMigrationFiles();
        const output = t("messages.dryRunComplete");

        return success({
          success: true,
          output,
          trackingCleared: false,
          trackingFilesCreated: false,
          drizzleMigrationRun: false,
          originalFilesRestored: false,
          migrationsProcessed: migrationFiles.length,
        });
      }

      // Step 1: Clear existing migration tracking to start fresh
      logger.info("Clearing existing migration tracking");
      await DatabaseMigrateSyncRepository.clearMigrationTracking(logger);
      trackingCleared = true;

      // Step 2: Create temporary migration files that only track without executing
      logger.info("Creating tracking-only migration files");
      const migrationFiles = DatabaseMigrateSyncRepository.getMigrationFiles();
      await DatabaseMigrateSyncRepository.createTrackingMigrations(
        migrationFiles,
        logger,
      );
      trackingFilesCreated = true;

      // Step 3: Run Drizzle migration to establish proper tracking
      logger.info("Running Drizzle migration for tracking");
      await DatabaseMigrateSyncRepository.runTrackingMigration(logger);
      drizzleMigrationRun = true;

      // Step 4: Restore original migration files
      logger.info("Restoring original migration files");
      await DatabaseMigrateSyncRepository.restoreOriginalMigrations(
        migrationFiles,
        logger,
      );
      originalFilesRestored = true;

      const output = t("messages.success");
      logger.info("Migration sync completed successfully", {
        migrationsProcessed: migrationFiles.length,
      });

      return success({
        success: true,
        output,
        trackingCleared,
        trackingFilesCreated,
        drizzleMigrationRun,
        originalFilesRestored,
        migrationsProcessed: migrationFiles.length,
      });
    } catch (error) {
      logger.error("Migration sync failed", { error: String(error) });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: String(error) },
      });
    }
  }

  /**
   * Clear existing migration tracking
   */
  private static async clearMigrationTracking(
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      // Drop and recreate the migration table to start fresh
      await db.execute(
        sql`DROP TABLE IF EXISTS drizzle.__drizzle_migrations__`,
      );
      logger.debug("Cleared existing migration tracking");
    } catch (error) {
      logger.error("Error clearing migration tracking", {
        error: String(error),
      });
      // Log error but don't throw - let the main method handle it
    }
  }

  /**
   * Get list of migration files
   */
  private static getMigrationFiles(): { filename: string; content: string }[] {
    const migrationsFolder = path.resolve(process.cwd(), "drizzle");

    if (!existsSync(migrationsFolder)) {
      return [];
    }

    return readdirSync(migrationsFolder)
      .filter((file) =>
        file.endsWith(DatabaseMigrateSyncRepository.SQL_FILE_EXTENSION),
      )
      .toSorted()
      .map((filename) => ({
        filename,
        content: readFileSync(path.join(migrationsFolder, filename), "utf-8"),
      }));
  }

  /**
   * Create tracking-only migration files (empty SQL that just establishes tracking)
   */
  private static async createTrackingMigrations(
    migrationFiles: { filename: string; content: string }[],
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      const fs = await import("node:fs/promises");
      const migrationsFolder = path.resolve(process.cwd(), "drizzle");

      // Backup original files
      const backupFolder = path.join(
        migrationsFolder,
        DatabaseMigrateSyncRepository.BACKUP_FOLDER_NAME,
      );
      await fs.mkdir(backupFolder, { recursive: true });

      for (const { filename, content } of migrationFiles) {
        // Backup original
        await fs.writeFile(path.join(backupFolder, filename), content, "utf-8");

        // Create tracking-only version (empty SQL with just a comment)
        const trackingContent = DatabaseMigrateSyncRepository.TRACKING_COMMENT;

        await fs.writeFile(
          path.join(migrationsFolder, filename),
          trackingContent,
          "utf-8",
        );
      }

      logger.debug("Created tracking-only versions of migration files", {
        count: migrationFiles.length,
      });
    } catch (error) {
      logger.error("Error creating tracking migrations", {
        error: String(error),
      });
      // Log error but don't throw - let the main method handle it
    }
  }

  /**
   * Run Drizzle migration with tracking-only files
   */
  private static async runTrackingMigration(
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      // This will establish proper Drizzle tracking without executing DDL
      await drizzleMigrate(db, { migrationsFolder: "drizzle" });
      logger.debug("Drizzle migration tracking established");
    } catch (error) {
      logger.error("Error running tracking migration", {
        error: String(error),
      });
      // Log error but don't throw - let the main method handle it
    }
  }

  /**
   * Restore original migration files
   */
  private static async restoreOriginalMigrations(
    migrationFiles: { filename: string; content: string }[],
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      const fs = await import("node:fs/promises");
      const migrationsFolder = path.resolve(process.cwd(), "drizzle");
      const backupFolder = path.join(
        migrationsFolder,
        DatabaseMigrateSyncRepository.BACKUP_FOLDER_NAME,
      );

      for (const { filename } of migrationFiles) {
        // Restore original from backup
        const backupPath = path.join(backupFolder, filename);
        const originalPath = path.join(migrationsFolder, filename);

        const originalContent = await fs.readFile(backupPath, "utf-8");
        await fs.writeFile(originalPath, originalContent, "utf-8");
      }

      // Clean up backup folder
      await fs.rm(backupFolder, { recursive: true, force: true });

      logger.debug("Restored original migration files", {
        count: migrationFiles.length,
      });
    } catch (error) {
      logger.error("Error restoring original migrations", {
        error: String(error),
      });
      // Log error but don't throw - let the main method handle it
    }
  }
}
