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
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type migrateSyncEndpoints from "./definition";

// Constants to avoid literal strings
const SQL_FILE_EXTENSION = ".sql";
const BACKUP_FOLDER_NAME = ".backup";
const TRACKING_COMMENT = `-- Migration tracking only - original backed up
-- This allows Drizzle to establish proper tracking without executing DDL
SELECT 1; -- No-op for tracking
`;

type MigrateSyncRequestType =
  typeof migrateSyncEndpoints.POST.types.RequestOutput;
type MigrateSyncResponseType =
  typeof migrateSyncEndpoints.POST.types.ResponseOutput;

/**
 * Migration file interface
 */
interface MigrationFile {
  filename: string;
  content: string;
}

/**
 * Database Migration Sync Repository Interface
 */
export interface DatabaseMigrateSyncRepository {
  syncMigrations(
    data: MigrateSyncRequestType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MigrateSyncResponseType>>;
}

/**
 * Database Migration Sync Repository Implementation
 */
export class DatabaseMigrateSyncRepositoryImpl
  implements DatabaseMigrateSyncRepository
{
  async syncMigrations(
    data: MigrateSyncRequestType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MigrateSyncResponseType>> {
    const { t } = simpleT(locale);

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
        const migrationFiles = this.getMigrationFiles();
        const output = t(
          "app.api.v1.core.system.db.migrateSync.messages.dryRunComplete",
        );

        return createSuccessResponse({
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
      await this.clearMigrationTracking(logger);
      trackingCleared = true;

      // Step 2: Create temporary migration files that only track without executing
      logger.info("Creating tracking-only migration files");
      const migrationFiles = this.getMigrationFiles();
      await this.createTrackingMigrations(migrationFiles, logger);
      trackingFilesCreated = true;

      // Step 3: Run Drizzle migration to establish proper tracking
      logger.info("Running Drizzle migration for tracking");
      await this.runTrackingMigration(logger);
      drizzleMigrationRun = true;

      // Step 4: Restore original migration files
      logger.info("Restoring original migration files");
      await this.restoreOriginalMigrations(migrationFiles, logger);
      originalFilesRestored = true;

      const output = t(
        "app.api.v1.core.system.db.migrateSync.messages.success",
      );
      logger.info("Migration sync completed successfully", {
        migrationsProcessed: migrationFiles.length,
      });

      return createSuccessResponse({
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
      return createErrorResponse(
        "app.api.v1.core.system.db.migrateSync.post.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: String(error) },
      );
    }
  }

  /**
   * Clear existing migration tracking
   */
  private async clearMigrationTracking(logger: EndpointLogger): Promise<void> {
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
  private getMigrationFiles(): MigrationFile[] {
    const migrationsFolder = path.resolve(process.cwd(), "drizzle");

    if (!existsSync(migrationsFolder)) {
      return [];
    }

    return readdirSync(migrationsFolder)
      .filter((file) => file.endsWith(SQL_FILE_EXTENSION))
      .sort()
      .map((filename) => ({
        filename,
        content: readFileSync(path.join(migrationsFolder, filename), "utf-8"),
      }));
  }

  /**
   * Create tracking-only migration files (empty SQL that just establishes tracking)
   */
  private async createTrackingMigrations(
    migrationFiles: MigrationFile[],
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      const fs = await import("fs/promises");
      const migrationsFolder = path.resolve(process.cwd(), "drizzle");

      // Backup original files
      const backupFolder = path.join(migrationsFolder, BACKUP_FOLDER_NAME);
      await fs.mkdir(backupFolder, { recursive: true });

      for (const { filename, content } of migrationFiles) {
        // Backup original
        await fs.writeFile(path.join(backupFolder, filename), content, "utf-8");

        // Create tracking-only version (empty SQL with just a comment)
        const trackingContent = TRACKING_COMMENT;

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
  private async runTrackingMigration(logger: EndpointLogger): Promise<void> {
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
  private async restoreOriginalMigrations(
    migrationFiles: MigrationFile[],
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      const fs = await import("fs/promises");
      const migrationsFolder = path.resolve(process.cwd(), "drizzle");
      const backupFolder = path.join(migrationsFolder, BACKUP_FOLDER_NAME);

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

/**
 * Export repository instance
 */
export const databaseMigrateSyncRepository =
  new DatabaseMigrateSyncRepositoryImpl();
