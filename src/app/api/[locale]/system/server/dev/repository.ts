/**
 * Development Server Repository
 * Handles starting the development server with task runner and Next.js
 * Implements task system specification requirements
 */

// CLI output messages don't need internationalization

import type { ChildProcess } from "node:child_process";
import { spawn } from "node:child_process";

import { parseError } from "next-vibe/shared/utils/parse-error";

import { seedDatabase } from "@/app/api/[locale]/system/db/seed/seed-manager";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { Task } from "@/app/api/[locale]/system/unified-interface/tasks/types/repository";
import { unifiedTaskRunnerRepository } from "@/app/api/[locale]/system/unified-interface/tasks/unified-runner/repository";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";

import { databaseMigrationRepository } from "../../db/migrate/repository";
import { dockerOperationsRepository } from "../../db/utils/docker-operations/repository";
import { dbUtilsRepository } from "../../db/utils/repository";
import type endpoints from "./definition";
import { useTurbopack } from "@/config/constants";

type RequestType = typeof endpoints.POST.types.RequestOutput;

// Constants to avoid literal strings
const DOCKER_VOLUME_NAME = "next-vibe_postgres_data";
const DATABASE_TEST_QUERY = "SELECT 1";
const DOCKER_VOLUME_RM_COMMAND = `docker volume rm ${DOCKER_VOLUME_NAME} 2>/dev/null || true`;
const DATABASE_TIMEOUT_PREFIX = "Database connection timeout after";
const DATABASE_TIMEOUT_SUFFIX = "attempts";

/**
 * Returns database connection timeout error message
 * Internal dev utility - not user-facing
 * @param maxAttempts - Maximum number of connection attempts
 * @param delayMs - Delay between attempts in milliseconds
 */
const getDatabaseTimeoutMessage = (
  maxAttempts: number,
  delayMs: number,
): string =>
  // eslint-disable-next-line i18next/no-literal-string -- Internal dev error message not user-facing
  `${DATABASE_TIMEOUT_PREFIX} ${maxAttempts} ${DATABASE_TIMEOUT_SUFFIX} (${(maxAttempts * delayMs) / 1000}s)`;

/**
 * Dev Repository Interface
 */
export interface DevRepositoryInterface {
  execute(
    data: RequestType,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<never>;
}

/**
 * Dev Repository Implementation
 */
export class DevRepositoryImpl implements DevRepositoryInterface {
  private runningProcesses: Map<string, ChildProcess> = new Map();

  constructor() {
    // Set up clean exit handlers
    this.setupExitHandlers();
  }

  private setupExitHandlers(): void {
    const cleanup = (): void => {
      // Use process.stdout.write for immediate CLI output during shutdown
      // eslint-disable-next-line i18next/no-literal-string
      process.stdout.write("\n🛑 vibes have stopped\n");

      // Kill all running processes
      for (const [, process] of this.runningProcesses) {
        try {
          process.kill("SIGTERM");
        } catch {
          // Process might already be dead
        }
      }

      process.exit(0);
    };

    process.on("SIGINT", cleanup);
    process.on("SIGTERM", cleanup);
  }

  /**
   * Perform hard database reset: stop containers, delete data, restart
   */
  private async performHardDatabaseReset(
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<void> {
    // 1. Stop Docker containers
    logger.debug("Stopping Docker containers...");
    const downResult = await dockerOperationsRepository.dockerComposeDown(
      logger,
      locale,
      "docker-compose-dev.yml",
      30000,
    );

    if (!downResult.success) {
      logger.warn("Failed to stop Docker containers, continuing anyway");
    }

    // 2. Delete postgres data volume
    await this.deletePostgresDataVolume(logger);

    // 3. Start Docker containers
    logger.debug("Starting Docker containers...");
    const upResult = await dockerOperationsRepository.dockerComposeUp(
      logger,
      locale,
      "docker-compose-dev.yml",
      60000,
    );

    if (!upResult.success) {
      logger.error("Failed to start Docker containers", {
        error: upResult.message || "Unknown error",
      });
      // Continue execution - don't throw, let the process continue
      logger.vibe("❌ Database startup failed, continuing without database");
    }
    // 4. Wait for database to be ready
    await this.waitForDatabaseConnection(logger);
  }

  /**
   * Delete postgres data volume for clean reset
   */
  private async deletePostgresDataVolume(
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      const { exec } = await import("node:child_process");
      const { promisify } = await import("node:util");
      const execAsync = promisify(exec);

      logger.debug("Deleting postgres data volume...");

      try {
        // Remove the Docker volume (this is much cleaner than dealing with file permissions)
        await execAsync(DOCKER_VOLUME_RM_COMMAND);
        logger.debug("Postgres data volume deleted");
      } catch {
        logger.debug("Postgres data volume not found or already deleted");
      }
    } catch (error) {
      logger.warn("Failed to delete postgres data volume", parseError(error));
      // Don't throw - continue anyway
    }
  }

  /**
   * Wait for database connection to be ready using proper database ping
   * Uses the same approach as CLI reset script for consistency
   */
  private async waitForDatabaseConnection(
    logger: EndpointLogger,
  ): Promise<void> {
    const maxAttempts = 60; // 60 attempts = 30 seconds
    const delayMs = 500; // 500ms between attempts

    logger.debug("Waiting for database to be ready...");

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        // Wait a bit before checking
        await new Promise<void>((resolve) => {
          setTimeout(resolve, delayMs);
        });

        // Use proper database connection test
        const { Pool } = await import("pg");

        const pool = new Pool({
          connectionString: env.DATABASE_URL,
          connectionTimeoutMillis: 5000,
        });

        try {
          const testQuery = DATABASE_TEST_QUERY;
          await pool.query(testQuery);
          await pool.end();

          logger.debug(
            `✅ Database connection ready after ${attempt} attempts (${(attempt * delayMs) / 1000}s)`,
          );
          return;
        } catch {
          // Intentionally suppress pool.end() errors - pool might already be closed
          await pool.end().catch(() => undefined);
          // Log progress every 10 attempts
          if (attempt % 10 === 0) {
            logger.debug(
              `⏳ Still waiting for database... (${attempt}/${maxAttempts})`,
            );
          }
        }
      } catch {
        if (attempt === maxAttempts) {
          logger.error(
            "❌ Database connection timeout - this will cause errors",
          );
          // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Dev tooling requires throwing errors to halt execution
          throw new Error(getDatabaseTimeoutMessage(maxAttempts, delayMs));
        }

        if (attempt % 10 === 0) {
          logger.debug(
            `⏳ Database not ready yet, retrying (${attempt}/${maxAttempts})...`,
          );
        }
      }
    }
  }

  async execute(
    data: RequestType,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<never> {
    // Convert string port to number if needed (CLI compatibility)
    const port =
      typeof data.port === "string" ? parseInt(data.port, 10) : data.port;

    logger.vibe("🚀 Starting development server");
    logger.vibe(
      `📍 Port: ${port} | Debug: ${logger.isDebugEnabled ? "ON" : "OFF (use --verbose to debug)"} | Tasks: ${data.skipTaskRunner ? "DISABLED" : "ENABLED"}`,
    );

    // Database setup
    if (!data.skipDbSetup) {
      try {
        const dockerCheckResult =
          await dbUtilsRepository.isDockerAvailable(logger);

        if (dockerCheckResult.success && dockerCheckResult.data) {
          // Reset database if not skipped
          if (!data.skipDbReset) {
            logger.vibe("🔄 Resetting database...");

            try {
              // Perform hard reset: stop containers, delete data, restart
              await this.performHardDatabaseReset(logger, locale);
              logger.vibe("✅ Database reset completed");

              await databaseMigrationRepository.runMigrations(
                {
                  generate: true,
                  redo: false,
                  schema: "public",
                  dryRun: data.dryRun,
                },
                user,
                locale,
                logger,
              );
            } catch (error) {
              // parseError is already imported at the top
              const parsedError = parseError(error);
              logger.vibe("❌ Database reset failed");
              logger.error("Database reset error details", parsedError);
              logger.vibe(`💡 Error: ${parsedError.message}`);
              logger.vibe("🔧 Try running: vibe reset-db --force --hard");
              // Start Next.js anyway
              logger.vibe(`🌐 Starting Next.js on http://localhost:${port}`);
              this.startNextJsProcess(port);
              // Intentionally never resolve - keep process running indefinitely
              return await new Promise<never>(() => undefined);
            }
          } else {
            // Just start the database without reset
            try {
              // Use Docker operations repository to start the database
              const dbStartResult =
                await dockerOperationsRepository.dockerComposeUp(
                  logger,
                  locale,
                  "docker-compose-dev.yml",
                  60000, // Increased timeout for startup
                );

              if (!dbStartResult.success) {
                logger.vibe("❌ Failed to start database");
                if (dbStartResult.message) {
                  logger.error("Database startup error details", {
                    error: dbStartResult.message,
                  });
                  logger.vibe(`💡 Error: ${dbStartResult.message}`);
                }
                logger.vibe(
                  "🔧 Try running: docker compose -f docker-compose-dev.yml up -d",
                );
                logger.vibe(
                  "🔧 Or check if Docker is running: docker --version",
                );
                // Start Next.js anyway
                logger.vibe(`🌐 Starting Next.js on http://localhost:${port}`);
                this.startNextJsProcess(port);
                // Intentionally never resolve - keep process running indefinitely
                return await new Promise<never>(() => undefined);
              }

              logger.vibe("✅ Database started");
            } catch (error) {
              const { parseError } = await import("next-vibe/shared/utils");
              const parsedError = parseError(error);
              logger.vibe("❌ Failed to start database");
              logger.error("Database startup error details", parsedError);
              logger.vibe(`💡 Error: ${parsedError.message}`);
              logger.vibe(
                "🔧 Try running: docker compose -f docker-compose-dev.yml up -d",
              );
              // Start Next.js anyway
              logger.vibe(`🌐 Starting Next.js on http://localhost:${port}`);
              this.startNextJsProcess(port);
              // Intentionally never resolve - keep process running indefinitely
              return await new Promise<never>(() => undefined);
            }
          }

          // Run migrations
          await databaseMigrationRepository.runMigrations(
            { generate: true, redo: false, schema: "public", dryRun: false },
            user,
            locale,
            logger,
          );

          // Seed database
          await seedDatabase("dev", logger, locale);
          logger.vibe("✅ Database ready");
        } else {
          logger.vibe("⚠️ Docker unavailable (continuing anyway)");
          logger.vibe("🔧 Install Docker to enable database functionality");
        }
      } catch (error) {
        const { parseError } = await import("next-vibe/shared/utils");
        const parsedError = parseError(error);
        logger.vibe("❌ Database setup failed (continuing anyway)");
        logger.error("Database setup error details", parsedError);
        logger.vibe(`💡 Error: ${parsedError.message}`);
      }
    } else {
      logger.vibe("⏭️ Database setup skipped");
    }

    // Start task runner if not skipped
    if (!data.skipTaskRunner) {
      try {
        // Load tasks and start the unified task runner
        await this.startUnifiedTaskRunner(locale, logger, data);
        logger.vibe("✅ Task runner started in background");
      } catch (error) {
        const { parseError } = await import("next-vibe/shared/utils");
        const parsedError = parseError(error);
        logger.vibe("⚠️ Task runner startup failed (continuing anyway)");
        logger.error("Task runner startup error details", parsedError);
        if (logger.isDebugEnabled) {
          logger.vibe(`💡 Error: ${parsedError.message}`);
        }
      }
    } else {
      logger.vibe("⏭️ Task runner disabled");
    }

    logger.vibe(`🌐 Starting Next.js on http://localhost:${port}`);
    logger.vibe("🎯 Ready for development! Press Ctrl+C to stop");

    // Start Next.js - output goes directly to stdout (no prefix)
    this.startNextJsProcess(port);

    // Never return - keep the process alive
    return await new Promise<never>(() => {
      // This promise never resolves, keeping the API call alive
      // The processes handle their own output to stdout
    });
  }

  /**
   * Start the unified task runner with filtered tasks for development
   */
  private async startUnifiedTaskRunner(
    locale: CountryLanguage,
    logger: EndpointLogger,
    data: RequestType,
  ): Promise<void> {
    try {
      // Load the task registry
      const { taskRegistry } =
        await import("@/app/api/[locale]/system/generated/tasks-index");

      // Filter tasks for development environment
      const devTasks = this.filterTasksForDevelopment(
        taskRegistry.allTasks,
        data,
        logger,
      );

      logger.debug("Loading task registry for development", {
        totalAvailable: taskRegistry.allTasks.length,
        filteredForDev: devTasks.length,
        taskNames: devTasks.map((t) => t.name),
      });

      // Set environment to development
      unifiedTaskRunnerRepository.environment = "development";
      unifiedTaskRunnerRepository.supportsSideTasks = true;

      // Start the task runner with filtered tasks
      const signal = new AbortController().signal;
      const startResult = unifiedTaskRunnerRepository.start(
        devTasks,
        signal,
        locale,
        logger,
      );

      if (startResult.success) {
        logger.debug("Unified task runner started successfully", {
          environment: "development",
          supportsSideTasks: true,
          taskCount: devTasks.length,
          taskNames: devTasks.map((t) => t.name),
        });
      } else {
        logger.error("Failed to start unified task runner", {
          message: startResult.message,
          errorCode: startResult.errorType.errorCode,
        });
      }
    } catch (error) {
      const errorMsg = parseError(error).message;
      logger.error("Task runner initialization failed", {
        error: errorMsg,
      });
      // Don't throw - just log the error and continue
    }
  }

  /**
   * Filter tasks that are appropriate for development environment
   */
  private filterTasksForDevelopment(
    allTasks: Task[],
    data: RequestType,
    logger: EndpointLogger,
  ): Task[] {
    const filtered = allTasks.filter((task) => {
      // Skip pulse runner in development (it's for production/serverless)
      if (task.name === "pulse-runner") {
        logger.debug("Skipping pulse-runner (not needed in development)");
        return false;
      }

      // Skip dev-watcher if generator watcher is disabled
      if (task.name === "dev-file-watcher" && data.skipGeneratorWatcher) {
        logger.debug("Skipping dev-file-watcher (generator watcher disabled)");
        return false;
      }

      // Only include tasks that are enabled and appropriate for development
      if (!task.enabled) {
        logger.debug(`Skipping disabled task: ${task.name}`);
        return false;
      }

      // Include development-appropriate tasks
      const devCategories = [
        "development",
        "system",
        "generator",
        "watch",
        "build",
        "test",
      ];

      if (devCategories.includes(task.category)) {
        return true;
      }

      // Skip heavy production tasks that aren't needed in development
      const skipInDev = [
        "backup",
        "cleanup",
        "maintenance",
        "monitoring",
        "security",
      ];

      if (skipInDev.includes(task.category)) {
        logger.debug(
          `Skipping heavy task in development: ${task.name} (${task.category})`,
        );
        return false;
      }

      // Include other tasks by default (email, leads, etc. might be needed)
      return true;
    });

    logger.debug("Task filtering completed", {
      original: allTasks.length,
      filtered: filtered.length,
      skipped: allTasks.length - filtered.length,
    });

    return filtered;
  }

  /**
   * Start Next.js development server using spawn
   */
  private startNextJsProcess(port: number): void {
    const turbo = useTurbopack ? ["--turbo"] : [];
    const nextProcess = spawn(
      "bun",
      ["run", "next", "dev", ...turbo, "--port", port.toString()],
      {
        stdio: "inherit", // Pass output directly to stdout/stderr
      },
    );

    // Store the process for cleanup
    this.runningProcesses.set("next-dev", nextProcess);
  }
}

/**
 * Default repository instance
 */
export const devRepository = new DevRepositoryImpl();
