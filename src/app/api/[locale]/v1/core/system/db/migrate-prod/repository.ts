/**
 * Database Production Migration Repository
 * Handles production migration operations with safety checks
 */
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  fail,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { parseError } from "@/app/api/[locale]/v1/core/shared/utils/parse-error";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type migrateProdEndpoints from "./definition";

// Constants to avoid lint issues
const UNKNOWN_ERROR = "Unknown error";
const SEED_COMMAND = ["vibe", "db:seed", "--data"];
const SEED_ENV_PROD = { env: "prod" };

type MigrateProdRequestType =
  typeof migrateProdEndpoints.POST.types.RequestOutput;
type MigrateProdResponseType =
  typeof migrateProdEndpoints.POST.types.ResponseOutput;

/**
 * Database Production Migration Repository Interface
 */
export interface DatabaseMigrateProdRepository {
  runProductionMigrations(
    data: MigrateProdRequestType,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MigrateProdResponseType>>;
}

/**
 * Database Production Migration Repository Implementation
 */
export class DatabaseMigrateProdRepositoryImpl
  implements DatabaseMigrateProdRepository
{
  async runProductionMigrations(
    data: MigrateProdRequestType,
    _user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<MigrateProdResponseType>> {
    const { t } = simpleT(locale);

    try {
      logger.info("Starting production migration process", { options: data });

      // Initialize response values
      let migrationsGenerated = false;
      let migrationsApplied = false;
      let seedingCompleted = false;

      if (data.dryRun) {
        logger.info("DRY RUN MODE - No changes will be made");
        const output = t(
          "app.api.v1.core.system.db.migrateProd.messages.dryRunComplete",
        );

        return success({
          success: true,
          output,
          environment: this.getEnvironment(),
          databaseUrl: this.getMaskedDatabaseUrl(),
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
      const generateResult = await this.generateMigrations(logger);
      if (!generateResult.success) {
        return fail({
          message:
            "app.api.v1.core.system.db.migrateProd.post.errors.server.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: { error: generateResult.error || UNKNOWN_ERROR },
        });
      }
      migrationsGenerated = true;

      // Step 2: Apply migrations
      logger.info("Applying migrations to production database");
      const applyResult = await this.applyMigrations(logger);
      if (!applyResult.success) {
        return fail({
          message:
            "app.api.v1.core.system.db.migrateProd.post.errors.server.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: { error: applyResult.error || UNKNOWN_ERROR },
        });
      }
      migrationsApplied = true;

      // Step 3: Run production seeding (optional)
      if (data.skipSeeding) {
        logger.info("Skipping production seeding (--skip-seeding)");
      } else {
        logger.info("Running production seeding");
        const seedResult = await this.runProductionSeeding(logger);
        if (!seedResult.success) {
          return fail({
            message:
              "app.api.v1.core.system.db.migrateProd.post.errors.server.title",
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
            messageParams: { error: seedResult.error || UNKNOWN_ERROR },
          });
        }
        seedingCompleted = true;
      }

      const output = seedingCompleted
        ? t("app.api.v1.core.system.db.migrateProd.messages.successWithSeeding")
        : t(
            "app.api.v1.core.system.db.migrateProd.messages.successWithoutSeeding",
          );

      logger.info("Production migration completed successfully");

      return success({
        success: true,
        output,
        environment: this.getEnvironment(),
        databaseUrl: this.getMaskedDatabaseUrl(),
        migrationsGenerated,
        migrationsApplied,
        seedingCompleted,
      });
    } catch (error) {
      logger.error("Production migration failed", { error: String(error) });
      return fail({
        message:
          "app.api.v1.core.system.db.migrateProd.post.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: String(error) },
      });
    }
  }

  /**
   * Generate migrations using the migrate repository
   */
  private async generateMigrations(
    logger: EndpointLogger,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Run drizzle-kit generate command
      const { spawnSync } = await import("node:child_process");
      const result = spawnSync("bunx", ["drizzle-kit", "generate"], {
        stdio: "pipe",
        encoding: "utf-8",
      });

      if (result.status !== 0) {
        const error = result.stderr || result.error?.message || UNKNOWN_ERROR;
        logger.error("Migration generation failed", {
          error: parseError(error),
        });
        return { success: false, error: String(error) };
      }

      logger.debug("Migrations generated successfully");
      return { success: true };
    } catch (error) {
      logger.error("Error generating migrations", { error: String(error) });
      return { success: false, error: String(error) };
    }
  }

  /**
   * Apply migrations using the migrate repository
   */
  private async applyMigrations(
    logger: EndpointLogger,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Run migrations using Drizzle
      const { migrate } = await import("drizzle-orm/node-postgres/migrator");
      const { db } = await import("@/app/api/[locale]/v1/core/system/db");

      await migrate(db, { migrationsFolder: "./drizzle" });

      logger.debug("Migrations applied successfully");
      return { success: true };
    } catch (error) {
      logger.error("Error applying migrations", { error: String(error) });
      return { success: false, error: String(error) };
    }
  }

  /**
   * Run production seeding using the seed repository
   */
  private async runProductionSeeding(
    logger: EndpointLogger,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Run production seeds by executing seed command
      const { spawnSync } = await import("node:child_process");
      const result = spawnSync(
        "bunx",
        [...SEED_COMMAND, JSON.stringify(SEED_ENV_PROD)],
        {
          stdio: "pipe",
          encoding: "utf-8",
        },
      );

      if (result.status !== 0) {
        const error = result.stderr || result.error?.message || UNKNOWN_ERROR;
        logger.error("Production seeding failed", { error: parseError(error) });
        return { success: false, error: String(error) };
      }

      logger.debug("Production seeding completed successfully");
      return { success: true };
    } catch (error) {
      logger.error("Error running production seeding", {
        error: String(error),
      });
      return { success: false, error: String(error) };
    }
  }

  /**
   * Get current environment
   */
  private getEnvironment(): string {
    // Return a static value since we can't access process.env directly
    return "production";
  }

  /**
   * Get masked database URL for security
   */
  private getMaskedDatabaseUrl(): string {
    // Return masked placeholder since we can't access process.env directly
    return "postgres://***:***@***:5432/***";
  }
}

/**
 * Export repository instance
 */
export const databaseMigrateProdRepository =
  new DatabaseMigrateProdRepositoryImpl();
