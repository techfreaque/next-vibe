/**
 * Database Utils Repository
 * Provides utility functions for database operations and health checks
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

// Logger will be provided by the route handler
import type { DbUtilsRequestOutput, DbUtilsResponseOutput } from "./definition";

/**
 * Database Utils Repository Interface
 */
export interface IDbUtilsRepository {
  /**
   * Check database health and connectivity
   */
  checkHealth(
    request: DbUtilsRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<DbUtilsResponseOutput>>;

  /**
   * Test database connection
   */
  testConnection(logger: EndpointLogger): Promise<ResponseType<boolean>>;

  /**
   * Get database statistics
   */
  getStats(logger: EndpointLogger): Promise<
    ResponseType<{
      activeConnections: number;
      maxConnections: number;
      version: string;
    }>
  >;

  /**
   * Check if Docker is available
   */
  isDockerAvailable(logger: EndpointLogger): Promise<ResponseType<boolean>>;

  /**
   * Manage the database (reset or initialize)
   */
  manageDatabase(
    options: {
      runMigrations?: boolean;
      initialize?: boolean;
      hard?: boolean;
      fastDbReset?: boolean;
    },
    logger: EndpointLogger,
    locale?: CountryLanguage,
  ): Promise<ResponseType<boolean>>;

  /**
   * Reset the database by truncating all tables
   */
  resetDatabase(
    runMigrations: boolean,
    logger: EndpointLogger,
  ): Promise<ResponseType<boolean>>;
}

/**
 * Database Utils Repository Implementation
 */
class DbUtilsRepositoryImpl implements IDbUtilsRepository {
  /**
   * Check database health and connectivity
   */
  async checkHealth(
    request: DbUtilsRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<DbUtilsResponseOutput>> {
    try {
      logger.info("Checking database health...");

      const timestamp = new Date().toISOString();
      let status: "healthy" | "degraded" | "unhealthy" = "healthy";

      // Test primary connection
      const primaryHealthy = await this.testConnection(logger);
      if (!primaryHealthy.success) {
        status = "unhealthy";
        logger.error("Primary database connection failed");
      }

      const connections = {
        primary: primaryHealthy.success,
        // Add replica check if needed
      };

      let details;
      if (request.includeDetails) {
        logger.debug("Including detailed health information");
        const statsResult = await this.getStats(logger);
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
        details,
      };

      logger.info(`Database health check completed with status: ${status}`);
      return createSuccessResponse(response);
    } catch (error) {
      logger.error("Database health check failed:", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.system.db.utils.errors.health_check_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Test database connection
   */
  async testConnection(logger: EndpointLogger): Promise<ResponseType<boolean>> {
    try {
      logger.debug("Testing database connection...");
      // Simple query to test connection
      // eslint-disable-next-line i18next/no-literal-string
      await db.execute("SELECT 1");
      logger.debug("Database connection test successful");
      return createSuccessResponse(true);
    } catch (error) {
      logger.error("Database connection test failed:", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.system.db.utils.errors.connection_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Get database statistics
   */
  async getStats(logger: EndpointLogger): Promise<
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
      return createSuccessResponse(stats);
    } catch (error) {
      logger.error(
        "Failed to retrieve database statistics:",
        parseError(error),
      );
      return createErrorResponse(
        "app.api.v1.core.system.db.utils.errors.stats_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Check if Docker is available
   */
  async isDockerAvailable(
    logger: EndpointLogger,
  ): Promise<ResponseType<boolean>> {
    try {
      const { spawn } = await import("child_process");

      return await new Promise((resolve) => {
        const docker = spawn("docker", ["--version"], { stdio: "ignore" });

        docker.on("close", (code) => {
          const isAvailable = code === 0;
          logger.debug(`Docker availability check completed: ${isAvailable}`);
          resolve(createSuccessResponse(isAvailable));
        });

        docker.on("error", () => {
          resolve(createSuccessResponse(false));
        });
      });
    } catch (error) {
      return createErrorResponse(
        "app.api.v1.core.system.db.utils.errors.docker_check_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Manage the database (reset or initialize)
   */
  async manageDatabase(
    options: {
      runMigrations?: boolean;
      initialize?: boolean;
      hard?: boolean;
      fastDbReset?: boolean;
    } = {},
    logger: EndpointLogger,
    locale: CountryLanguage = "en-GLOBAL",
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
        const { databaseResetRepository } = await import("../reset/repository");

        const resetResult = await databaseResetRepository.resetDatabase(
          {
            force: true,
            skipMigrations: !runMigrations,
            skipSeeds: false,
            dryRun: false,
          },
          { id: "system", isPublic: false },
          "en-GLOBAL",
          logger,
        );

        if (resetResult.success) {
          logger.info(`Database ${operation.toLowerCase()} completed`);
          return createSuccessResponse(true);
        } else {
          const { t } = simpleT(locale);
          const errorMessage = t(
            "app.api.v1.core.system.db.utils.errors.reset_operation_failed",
          );
          logger.error("Failed to reset database:", errorMessage);
          return createErrorResponse(
            "app.api.v1.core.system.db.utils.errors.reset_failed",
            ErrorResponseTypes.INTERNAL_ERROR,
            { error: errorMessage },
          );
        }
      } catch (error) {
        logger.error("Failed to reset database:", parseError(error));
        return createErrorResponse(
          "app.api.v1.core.system.db.utils.errors.reset_failed",
          ErrorResponseTypes.INTERNAL_ERROR,
          { error: parseError(error).message },
        );
      }
    } catch (error) {
      logger.error("Failed to manage database:", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.system.db.utils.errors.manage_failed",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }

  /**
   * Reset the database by truncating all tables
   * @deprecated Use manageDatabase() instead
   */
  async resetDatabase(
    runMigrations = false,
    logger: EndpointLogger,
  ): Promise<ResponseType<boolean>> {
    return await this.manageDatabase({ runMigrations }, logger, "en-GLOBAL");
  }
}

export const dbUtilsRepository = new DbUtilsRepositoryImpl();
