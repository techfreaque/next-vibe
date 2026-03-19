/**
 * Database Utils Repository
 * Provides utility functions for database operations and health checks
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation as resetScopedTranslation } from "../reset/i18n";
// Logger will be provided by the route handler
import type { DbUtilsRequestOutput, DbUtilsResponseOutput } from "./definition";
import type { UtilsT } from "./i18n";

/**
 * Database Utils Repository Implementation
 */
export class DbUtilsRepository {
  /**
   * Check database health and connectivity
   */
  static async checkHealth(
    request: DbUtilsRequestOutput,
    t: UtilsT,
    logger: EndpointLogger,
  ): Promise<ResponseType<DbUtilsResponseOutput>> {
    try {
      logger.info("Checking database health...");

      const timestamp = new Date().toISOString();
      let status: "healthy" | "degraded" | "unhealthy" = "healthy";

      // Test primary connection
      const primaryHealthy = await DbUtilsRepository.testConnection(t, logger);
      if (!primaryHealthy.success) {
        status = "unhealthy";
        logger.error("Primary database connection failed");
      }

      const connections = {
        primary: primaryHealthy.success,
        // Add replica check if needed
      };

      let details:
        | {
            version?: string;
            uptime?: number;
            activeConnections?: number;
            maxConnections?: number;
          }
        | undefined;
      if (request.includeDetails) {
        logger.debug("Including detailed health information");
        const statsResult = await DbUtilsRepository.getStats(t, logger);
        if (statsResult.success) {
          details = {
            version: statsResult.data.version,
            activeConnections: statsResult.data.activeConnections,
            maxConnections: statsResult.data.maxConnections,
            uptime: Date.now(), // Simplified uptime
          };
        }
      }

      const response: DbUtilsResponseOutput = {
        status,
        timestamp,
        connections,
        ...(details !== undefined && { details }),
      };

      logger.info(`Database health check completed with status: ${status}`);
      return success(response);
    } catch (error) {
      logger.error("Database health check failed:", parseError(error));
      return fail({
        message: t("errors.health_check_failed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Test database connection
   */
  static async testConnection(
    t: UtilsT,
    logger: EndpointLogger,
  ): Promise<ResponseType<boolean>> {
    try {
      logger.debug("Testing database connection...");
      // Simple query to test connection
      // eslint-disable-next-line i18next/no-literal-string
      await db.execute("SELECT 1");
      logger.debug("Database connection test successful");
      return success(true);
    } catch (error) {
      logger.error("Database connection test failed:", parseError(error));
      return fail({
        message: t("errors.connection_failed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Get database statistics
   */
  static async getStats(
    t: UtilsT,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      activeConnections: number;
      maxConnections: number;
      version: string;
    }>
  > {
    try {
      logger.debug("Retrieving database statistics...");
      // These would be actual database queries in production
      // For now, return mock data with a simulated async operation
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 1);
      });
      const stats = {
        activeConnections: 5,
        maxConnections: 100,
        // eslint-disable-next-line i18next/no-literal-string
        version: "PostgreSQL 15.0",
      };

      logger.debug("Database statistics retrieved successfully");
      return success(stats);
    } catch (error) {
      logger.error(
        "Failed to retrieve database statistics:",
        parseError(error),
      );
      return fail({
        message: t("errors.stats_failed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Check if Docker is available
   */
  static async isDockerAvailable(
    t: UtilsT,
    logger: EndpointLogger,
  ): Promise<ResponseType<boolean>> {
    try {
      const { spawn } = await import("node:child_process");

      return await new Promise((resolve) => {
        const docker = spawn("docker", ["--version"], { stdio: "ignore" });

        docker.on("close", (code) => {
          const isAvailable = code === 0;
          logger.debug(`Docker availability check completed: ${isAvailable}`);
          resolve(success(isAvailable));
        });

        docker.on("error", () => {
          resolve(success(false));
        });
      });
    } catch (error) {
      return fail({
        message: t("errors.docker_check_failed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Manage the database (reset or initialize)
   */
  static async manageDatabase(
    options: {
      runMigrations?: boolean;
      initialize?: boolean;
      hard?: boolean;
      fastDbReset?: boolean;
    } = {},
    logger: EndpointLogger,
    t: UtilsT,
    locale: CountryLanguage,
  ): Promise<ResponseType<boolean>> {
    try {
      const {
        runMigrations = false,
        initialize = false,
        hard = false,
      } = options;

      // eslint-disable-next-line i18next/no-literal-string
      const operation = initialize ? "Initialize" : "Reset";
      logger.info(`${operation} database...`);

      if (hard) {
        logger.warn("Hard reset requested - this will delete all data!");
      }

      try {
        // Import reset functionality from the reset subdomain
        const { DatabaseResetRepository } = await import("../reset/repository");
        const { t: resetT } = resetScopedTranslation.scopedT(locale);

        const resetResult = await DatabaseResetRepository.resetDatabase(
          {
            force: true,
            skipMigrations: !runMigrations,
            skipSeeds: false,
            dryRun: false,
          },
          resetT,
          logger,
        );

        if (resetResult.success) {
          logger.info(`Database ${operation.toLowerCase()} completed`);
          return success(true);
        }
        const errorMessage = t("errors.reset_operation_failed");
        logger.error("Failed to reset database:", errorMessage);
        return fail({
          message: t("errors.reset_failed"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: { error: errorMessage },
          cause: resetResult,
        });
      } catch (error) {
        logger.error("Failed to reset database:", parseError(error));
        return fail({
          message: t("errors.reset_failed"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: { error: parseError(error).message },
        });
      }
    } catch (error) {
      logger.error("Failed to manage database:", parseError(error));
      return fail({
        message: t("errors.manage_failed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Reset the database by truncating all tables
   * @deprecated Use manageDatabase() instead
   */
  static async resetDatabase(
    runMigrations = false,
    logger: EndpointLogger,
    t: UtilsT,
    locale: CountryLanguage,
  ): Promise<ResponseType<boolean>> {
    return await DbUtilsRepository.manageDatabase(
      { runMigrations },
      logger,
      t,
      locale,
    );
  }
}
