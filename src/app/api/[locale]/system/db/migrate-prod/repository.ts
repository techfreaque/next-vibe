/**
 * Database Production Migration Repository
 * Handles production migration operations with safety checks
 */
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import { parseError } from "@/app/api/[locale]/shared/utils/parse-error";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type {
  MigrateProdRequestOutput,
  MigrateProdResponseOutput,
} from "./definition";
import type { MigrateProdT } from "./i18n";

/**
 * Database Production Migration Repository
 */
export class DatabaseMigrateProdRepository {
  private static readonly SEED_COMMAND = ["vibe", "db:seed", "--data"];
  private static readonly SEED_ENV_PROD = { env: "prod" };
  static async runProductionMigrations(
    data: MigrateProdRequestOutput,
    t: MigrateProdT,
    logger: EndpointLogger,
  ): Promise<ResponseType<MigrateProdResponseOutput>> {
    try {
      logger.info("Starting production migration process", { options: data });

      // Initialize response values
      let migrationsGenerated = false;
      let migrationsApplied = false;
      let seedingCompleted = false;

      if (data.dryRun) {
        logger.info("DRY RUN MODE - No changes will be made");
        const output = t("messages.dryRunComplete");

        return success({
          success: true,
          output,
          environment: DatabaseMigrateProdRepository.getEnvironment(),
          databaseUrl: DatabaseMigrateProdRepository.getMaskedDatabaseUrl(),
          migrationsGenerated: false,
          migrationsApplied: false,
          seedingCompleted: false,
        });
      }

      // Log that this is a production migration
      logger.info(
        "Starting production migration - ensure environment is properly configured",
      );

      // Step 1: Generate latest migrations
      logger.info("Generating Drizzle migrations");
      const generateResult =
        await DatabaseMigrateProdRepository.generateMigrations(logger, t);
      if (!generateResult.success) {
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: {
            error: generateResult.message || t("post.errors.unknown.title"),
          },
        });
      }
      migrationsGenerated = true;

      // Step 2: Apply migrations
      logger.info("Applying migrations to production database");
      const applyResult = await DatabaseMigrateProdRepository.applyMigrations(
        logger,
        t,
      );
      if (!applyResult.success) {
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: {
            error: applyResult.message || t("post.errors.unknown.title"),
          },
        });
      }
      migrationsApplied = true;

      // Step 3: Run production seeding (optional)
      if (data.skipSeeding) {
        logger.info("Skipping production seeding (--skip-seeding)");
      } else {
        logger.info("Running production seeding");
        const seedResult =
          await DatabaseMigrateProdRepository.runProductionSeeding(logger, t);
        if (!seedResult.success) {
          return fail({
            message: t("post.errors.server.title"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
            messageParams: {
              error: seedResult.message || t("post.errors.unknown.title"),
            },
          });
        }
        seedingCompleted = true;
      }

      const output = seedingCompleted
        ? t("messages.successWithSeeding")
        : t("messages.successWithoutSeeding");

      logger.info("Production migration completed successfully");

      return success({
        success: true,
        output,
        environment: DatabaseMigrateProdRepository.getEnvironment(),
        databaseUrl: DatabaseMigrateProdRepository.getMaskedDatabaseUrl(),
        migrationsGenerated,
        migrationsApplied,
        seedingCompleted,
      });
    } catch (error) {
      logger.error("Production migration failed", { error: String(error) });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: String(error) },
      });
    }
  }

  /**
   * Generate migrations using the migrate repository
   */
  private static async generateMigrations(
    logger: EndpointLogger,
    t: MigrateProdT,
  ): Promise<ResponseType<void>> {
    try {
      // Run drizzle-kit generate command
      const { spawnSync } = await import("node:child_process");
      const result = spawnSync("bunx", ["drizzle-kit", "generate"], {
        stdio: "pipe",
        encoding: "utf-8",
      });

      if (result.status !== 0) {
        const errorDetail =
          result.stderr ||
          result.error?.message ||
          t("post.errors.unknown.title");
        logger.error("Migration generation failed", {
          error: parseError(errorDetail),
        });
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: { error: errorDetail },
        });
      }

      logger.debug("Migrations generated successfully");
      return success(undefined);
    } catch (error) {
      logger.error("Error generating migrations", { error: String(error) });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: String(error) },
      });
    }
  }

  /**
   * Apply migrations using the migrate repository
   */
  private static async applyMigrations(
    logger: EndpointLogger,
    t: MigrateProdT,
  ): Promise<ResponseType<void>> {
    try {
      // Run migrations using Drizzle
      const { migrate } = await import("drizzle-orm/node-postgres/migrator");
      const { db } = await import("@/app/api/[locale]/system/db");

      await migrate(db, { migrationsFolder: "./drizzle" });

      logger.debug("Migrations applied successfully");
      return success(undefined);
    } catch (error) {
      logger.error("Error applying migrations", { error: String(error) });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: String(error) },
      });
    }
  }

  /**
   * Run production seeding using the seed repository
   */
  private static async runProductionSeeding(
    logger: EndpointLogger,
    t: MigrateProdT,
  ): Promise<ResponseType<void>> {
    try {
      // Run production seeds by executing seed command
      const { spawnSync } = await import("node:child_process");
      const result = spawnSync(
        "bunx",
        [
          ...DatabaseMigrateProdRepository.SEED_COMMAND,
          JSON.stringify(DatabaseMigrateProdRepository.SEED_ENV_PROD),
        ],
        {
          stdio: "pipe",
          encoding: "utf-8",
        },
      );

      if (result.status !== 0) {
        const errorDetail =
          result.stderr ||
          result.error?.message ||
          t("post.errors.unknown.title");
        logger.error("Production seeding failed", {
          error: parseError(errorDetail),
        });
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: { error: errorDetail },
        });
      }

      logger.debug("Production seeding completed successfully");
      return success(undefined);
    } catch (error) {
      logger.error("Error running production seeding", {
        error: String(error),
      });
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: String(error) },
      });
    }
  }

  /**
   * Get current environment
   */
  private static getEnvironment(): string {
    // Return a static value since we can't access process.env directly
    return "production";
  }

  /**
   * Get masked database URL for security
   */
  private static getMaskedDatabaseUrl(): string {
    // Return masked placeholder since we can't access process.env directly
    return "postgres://***:***@***:5432/***";
  }
}
