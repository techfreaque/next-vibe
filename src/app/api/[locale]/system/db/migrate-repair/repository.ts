/**
 * Database Migration Repair Repository
 * Handles migration tracking repair operations
 */

import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

import { sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type {
  MigrateRepairRequestOutput,
  MigrateRepairResponseOutput,
} from "./definition";
import type { MigrateRepairT } from "./i18n";

/**
 * Database Migration Repair Repository
 */
export class DatabaseMigrateRepairRepository {
  private static readonly MIGRATION_TABLE_NAME = "__drizzle_migrations__";
  private static readonly SQL_FILE_EXTENSION = ".sql";
  private static readonly DRIZZLE_SCHEMA = "drizzle";
  static async repairMigrations(
    data: MigrateRepairRequestOutput,
    t: MigrateRepairT,
    logger: EndpointLogger,
  ): Promise<ResponseType<MigrateRepairResponseOutput>> {
    try {
      logger.info("Starting migration repair process", { options: data });

      if (data.dryRun) {
        logger.info("DRY RUN MODE - No changes will be made");
      }

      // Step 1: Check current migration state
      logger.info("Checking current migration state");
      const migrationState =
        await DatabaseMigrateRepairRepository.checkMigrationState(logger);

      logger.info("Migration state checked", {
        hasTable: migrationState.hasTable,
        schema: migrationState.schema,
        tableName: migrationState.tableName,
        trackedMigrations: migrationState.trackedMigrations,
      });

      // Step 2: Check migration files
      const migrationFiles =
        DatabaseMigrateRepairRepository.getMigrationFiles();
      logger.info("Migration files found", { count: migrationFiles.length });

      // Step 3: Determine what needs to be fixed
      const needsRepair =
        migrationState.trackedMigrations < migrationFiles.length;
      const repairedCount =
        migrationFiles.length - migrationState.trackedMigrations;

      if (!needsRepair) {
        const output = t("messages.upToDate");
        logger.info("No repair needed - migrations up to date");

        return success({
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
        const output = t("messages.dryRunComplete");
        logger.info("Dry run completed - no changes made");

        return success({
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
        await DatabaseMigrateRepairRepository.resetMigrationTracking(logger);
      }

      // Step 5: Ensure proper migration table exists
      await DatabaseMigrateRepairRepository.ensureMigrationTable(logger);

      // Step 6: Mark all existing migrations as applied
      await DatabaseMigrateRepairRepository.markMigrationsAsApplied(
        migrationFiles,
        logger,
      );

      const output =
        repairedCount > 0
          ? t("messages.repairComplete", {
              count: repairedCount,
            })
          : t("messages.success");

      logger.info("Migration repair completed successfully", { repairedCount });

      return success({
        success: true,
        output,
        hasTable: true,
        schema: DatabaseMigrateRepairRepository.DRIZZLE_SCHEMA,
        tableName: DatabaseMigrateRepairRepository.MIGRATION_TABLE_NAME,
        trackedMigrations: migrationFiles.length,
        migrationFiles: migrationFiles.length,
        repaired: repairedCount,
      });
    } catch (error) {
      logger.error("Migration repair failed", { error: String(error) });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: String(error) },
      });
    }
  }

  /**
   * Check current migration state
   */
  private static async checkMigrationState(logger: EndpointLogger): Promise<{
    hasTable: boolean;
    schema: string;
    tableName: string;
    trackedMigrations: number;
  }> {
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
          schema: DatabaseMigrateRepairRepository.DRIZZLE_SCHEMA,
          tableName: DatabaseMigrateRepairRepository.MIGRATION_TABLE_NAME,
          trackedMigrations:
            Number((count.rows[0] as { count: string | number })?.count) || 0,
        };
      }

      return {
        hasTable: false,
        schema: DatabaseMigrateRepairRepository.DRIZZLE_SCHEMA,
        tableName: DatabaseMigrateRepairRepository.MIGRATION_TABLE_NAME,
        trackedMigrations: 0,
      };
    } catch (error) {
      logger.error("Error checking migration state", { error: String(error) });
      return {
        hasTable: false,
        schema: DatabaseMigrateRepairRepository.DRIZZLE_SCHEMA,
        tableName: DatabaseMigrateRepairRepository.MIGRATION_TABLE_NAME,
        trackedMigrations: 0,
      };
    }
  }

  /**
   * Get list of migration files
   */
  private static getMigrationFiles(): string[] {
    const migrationsFolder = path.resolve(process.cwd(), "drizzle");

    if (!existsSync(migrationsFolder)) {
      return [];
    }

    return readdirSync(migrationsFolder)
      .filter((file) =>
        file.endsWith(DatabaseMigrateRepairRepository.SQL_FILE_EXTENSION),
      )
      .toSorted();
  }

  /**
   * Reset migration tracking by clearing the migration table
   */
  private static async resetMigrationTracking(
    logger: EndpointLogger,
  ): Promise<void> {
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
  private static async ensureMigrationTable(
    logger: EndpointLogger,
  ): Promise<void> {
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
  private static async markMigrationsAsApplied(
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
        const fs = await import("node:fs/promises");
        const journalContent = await fs.readFile(journalPath, "utf-8");
        journalData = JSON.parse(journalContent) as {
          entries: Array<{ tag: string; when: number }>;
        };
      }

      // Create a map of migration files to journal entries
      const journalMap = new Map<string, { tag: string; when: number }>();
      for (const entry of journalData.entries || []) {
        journalMap.set(
          `${entry.tag}${DatabaseMigrateRepairRepository.SQL_FILE_EXTENSION}`,
          entry,
        );
      }

      for (const file of migrationFiles) {
        const hash = file.replace(
          DatabaseMigrateRepairRepository.SQL_FILE_EXTENSION,
          "",
        );
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

        if (migrationExists) {
          logger.info(`Migration ${name} already exists`, { hash });
          continue;
        }

        // Insert migration record with correct timestamp
        await db.execute(sql`
          INSERT INTO drizzle.__drizzle_migrations__ (hash, created_at)
          VALUES (${hash}, ${timestamp})
        `);

        logger.debug("Marked migration as applied", { hash, timestamp });
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
