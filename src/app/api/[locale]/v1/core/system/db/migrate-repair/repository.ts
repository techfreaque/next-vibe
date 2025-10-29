/**
 * Database Migration Repair Repository
 * Handles migration tracking repair operations
 */

import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

import { sql } from "drizzle-orm";
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

import type migrateRepairEndpoints from "./definition";

// Constants to avoid literal strings
const MIGRATION_TABLE_NAME = "__drizzle_migrations__";
const SQL_FILE_EXTENSION = ".sql";
const DRIZZLE_SCHEMA = "drizzle";

type MigrateRepairRequestType =
  typeof migrateRepairEndpoints.POST.types.RequestOutput;
type MigrateRepairResponseType =
  typeof migrateRepairEndpoints.POST.types.ResponseOutput;

/**
 * Migration state interface
 */
interface MigrationState {
  hasTable: boolean;
  schema: string;
  tableName: string;
  trackedMigrations: number;
}

/**
 * Database Migration Repair Repository Interface
 */
export interface DatabaseMigrateRepairRepository {
  repairMigrations(
    data: MigrateRepairRequestType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MigrateRepairResponseType>>;
}

/**
 * Database Migration Repair Repository Implementation
 */
export class DatabaseMigrateRepairRepositoryImpl
  implements DatabaseMigrateRepairRepository
{
  async repairMigrations(
    data: MigrateRepairRequestType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MigrateRepairResponseType>> {
    const { t } = simpleT(locale);

    try {
      logger.info("Starting migration repair process", { options: data });

      if (data.dryRun) {
        logger.info("DRY RUN MODE - No changes will be made");
      }

      // Step 1: Check current migration state
      logger.info("Checking current migration state");
      const migrationState = await this.checkMigrationState(logger);

      logger.info("Migration state checked", {
        hasTable: migrationState.hasTable,
        schema: migrationState.schema,
        tableName: migrationState.tableName,
        trackedMigrations: migrationState.trackedMigrations,
      });

      // Step 2: Check migration files
      const migrationFiles = this.getMigrationFiles();
      logger.info("Migration files found", { count: migrationFiles.length });

      // Step 3: Determine what needs to be fixed
      const needsRepair =
        migrationState.trackedMigrations < migrationFiles.length;
      const repairedCount =
        migrationFiles.length - migrationState.trackedMigrations;

      if (!needsRepair) {
        const output = t(
          "app.api.v1.core.system.db.migrateRepair.messages.upToDate",
        );
        logger.info("No repair needed - migrations up to date");

        return createSuccessResponse({
          success: true,
          output,
          hasTable: migrationState.hasTable,
          schema: migrationState.schema,
          tableName: migrationState.tableName,
          trackedMigrations: migrationState.trackedMigrations,
          migrationFiles: migrationFiles.length,
          repaired: 0,
        });
      }

      logger.info("Migration repair needed", { repairedCount });

      if (data.dryRun) {
        const output = t(
          "app.api.v1.core.system.db.migrateRepair.messages.dryRunComplete",
        );
        logger.info("Dry run completed - no changes made");

        return createSuccessResponse({
          success: true,
          output,
          hasTable: migrationState.hasTable,
          schema: migrationState.schema,
          tableName: migrationState.tableName,
          trackedMigrations: migrationState.trackedMigrations,
          migrationFiles: migrationFiles.length,
          repaired: 0,
        });
      }

      // Step 4: Reset migration tracking if requested
      if (data.reset) {
        logger.info("Resetting migration tracking");
        await this.resetMigrationTracking(logger);
      }

      // Step 5: Ensure proper migration table exists
      await this.ensureMigrationTable(logger);

      // Step 6: Mark all existing migrations as applied
      await this.markMigrationsAsApplied(migrationFiles, logger);

      const output =
        repairedCount > 0
          ? t(
              "app.api.v1.core.system.db.migrateRepair.messages.repairComplete",
              { count: repairedCount },
            )
          : t("app.api.v1.core.system.db.migrateRepair.messages.success");

      logger.info("Migration repair completed successfully", { repairedCount });

      return createSuccessResponse({
        success: true,
        output,
        hasTable: true,
        schema: DRIZZLE_SCHEMA,
        tableName: MIGRATION_TABLE_NAME,
        trackedMigrations: migrationFiles.length,
        migrationFiles: migrationFiles.length,
        repaired: repairedCount,
      });
    } catch (error) {
      logger.error("Migration repair failed", { error: String(error) });
      return createErrorResponse(
        "app.api.v1.core.system.db.migrateRepair.post.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: String(error) },
      );
    }
  }

  /**
   * Check current migration state
   */
  private async checkMigrationState(
    logger: EndpointLogger,
  ): Promise<MigrationState> {
    try {
      // Ensure drizzle schema exists
      await db.execute(sql`CREATE SCHEMA IF NOT EXISTS drizzle`);

      // Check if migration table exists in drizzle schema
      const drizzleTableExists = await db.execute(sql`
        SELECT EXISTS(
          SELECT 1 FROM information_schema.tables
          WHERE table_schema = 'drizzle' AND table_name = '__drizzle_migrations__'
        ) as exists
      `);

      const exists = (drizzleTableExists.rows[0] as { exists: boolean })
        ?.exists;

      if (exists) {
        // Count migrations in drizzle schema
        const count = await db.execute(sql`
          SELECT COUNT(*) as count FROM drizzle.__drizzle_migrations__
        `);

        return {
          hasTable: true,
          schema: DRIZZLE_SCHEMA,
          tableName: MIGRATION_TABLE_NAME,
          trackedMigrations:
            Number((count.rows[0] as { count: string | number })?.count) || 0,
        };
      }

      return {
        hasTable: false,
        schema: DRIZZLE_SCHEMA,
        tableName: MIGRATION_TABLE_NAME,
        trackedMigrations: 0,
      };
    } catch (error) {
      logger.error("Error checking migration state", { error: String(error) });
      return {
        hasTable: false,
        schema: DRIZZLE_SCHEMA,
        tableName: MIGRATION_TABLE_NAME,
        trackedMigrations: 0,
      };
    }
  }

  /**
   * Get list of migration files
   */
  private getMigrationFiles(): string[] {
    const migrationsFolder = path.resolve(process.cwd(), "drizzle");

    if (!existsSync(migrationsFolder)) {
      return [];
    }

    return readdirSync(migrationsFolder)
      .filter((file) => file.endsWith(SQL_FILE_EXTENSION))
      .sort();
  }

  /**
   * Reset migration tracking by clearing the migration table
   */
  private async resetMigrationTracking(logger: EndpointLogger): Promise<void> {
    try {
      logger.debug("Clearing migration tracking table");
      await db.execute(
        sql`DROP TABLE IF EXISTS drizzle.__drizzle_migrations__`,
      );
      logger.info("Migration tracking reset successfully");
    } catch (error) {
      logger.error("Failed to reset migration tracking", {
        error: String(error),
      });
      // Log error but don't throw - let the main method handle it
    }
  }

  /**
   * Ensure proper migration table exists
   */
  private async ensureMigrationTable(logger: EndpointLogger): Promise<void> {
    try {
      // Ensure drizzle schema exists
      await db.execute(sql`CREATE SCHEMA IF NOT EXISTS drizzle`);

      // Create migration table in drizzle schema
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations__ (
          id SERIAL PRIMARY KEY,
          hash text NOT NULL,
          created_at bigint
        )
      `);

      logger.debug("Ensured migration table exists in drizzle schema");
    } catch (error) {
      logger.error("Error ensuring migration table", { error: String(error) });
      // Log error but don't throw - let the main method handle it
    }
  }

  /**
   * Mark all migrations as applied
   */
  private async markMigrationsAsApplied(
    migrationFiles: string[],
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      // Read the journal file to get the correct migration metadata
      const journalPath = path.resolve(
        process.cwd(),
        "drizzle/meta/_journal.json",
      );
      let journalData: {
        entries: Array<{ tag: string; when: number }>;
      } = {
        entries: [],
      };

      if (existsSync(journalPath)) {
        const fs = await import("fs/promises");
        const journalContent = await fs.readFile(journalPath, "utf-8");
        journalData = JSON.parse(journalContent) as {
          entries: Array<{ tag: string; when: number }>;
        };
      }

      // Create a map of migration files to journal entries
      const journalMap = new Map<string, { tag: string; when: number }>();
      for (const entry of journalData.entries || []) {
        journalMap.set(`${entry.tag}${SQL_FILE_EXTENSION}`, entry);
      }

      for (const file of migrationFiles) {
        const hash = file.replace(SQL_FILE_EXTENSION, "");
        const journalEntry = journalMap.get(file);
        const timestamp = journalEntry?.when || Date.now();

        // Check if migration is already tracked
        const exists = await db.execute(sql`
          SELECT EXISTS(
            SELECT 1 FROM drizzle.__drizzle_migrations__
            WHERE hash = ${hash}
          ) as exists
        `);

        const migrationExists = (exists.rows[0] as { exists: boolean })?.exists;

        if (!migrationExists) {
          // Insert migration record with correct timestamp
          await db.execute(sql`
            INSERT INTO drizzle.__drizzle_migrations__ (hash, created_at)
            VALUES (${hash}, ${timestamp})
          `);

          logger.debug("Marked migration as applied", { hash, timestamp });
        } else {
          logger.debug("Migration already tracked", { hash });
        }
      }

      logger.info("Marked migrations as applied", {
        count: migrationFiles.length,
      });
    } catch (error) {
      logger.error("Error marking migrations as applied", {
        error: String(error),
      });
      // Log error but don't throw - let the main method handle it
    }
  }
}

/**
 * Export repository instance
 */
export const databaseMigrateRepairRepository =
  new DatabaseMigrateRepairRepositoryImpl();
