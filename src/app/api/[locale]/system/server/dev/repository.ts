/**
 * Development Server Repository
 * Handles starting the development server with task runner and Next.js
 * Implements task system specification requirements
 */

// CLI output messages don't need internationalization

import type { CountryLanguage } from "@/i18n/core/config";
import type { ChildProcess } from "node:child_process";
import { spawn } from "node:child_process";

import { parseError } from "next-vibe/shared/utils/parse-error";

import { seedDatabase } from "@/app/api/[locale]/system/db/seed/seed-manager";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { Task } from "@/app/api/[locale]/system/unified-interface/tasks/types/repository";
import { unifiedTaskRunnerRepository } from "@/app/api/[locale]/system/unified-interface/tasks/unified-runner/repository";
import { env } from "@/config/env";

import { databaseMigrationRepository } from "../../db/migrate/repository";
import { dockerOperationsRepository } from "../../db/utils/docker-operations/repository";
import { dbUtilsRepository } from "../../db/utils/repository";
import type endpoints from "./definition";
import { useTurbopack } from "@/config/constants";
import { DEV_WATCHER_TASK_NAME } from "../../unified-interface/tasks/dev-watcher/task-runner";

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
    // Set up clean exit handlers for crashes only
    this.setupExitHandlers();
  }

  private setupExitHandlers(): void {
    // Only handle crashes - let SIGINT/SIGTERM propagate naturally

    // Handle uncaught exceptions
    process.on("uncaughtException", (error) => {
      // eslint-disable-next-line i18next/no-literal-string
      process.stderr.write(
        `\n❌ Uncaught exception: ${error.message}\n${error.stack || ""}\n`,
      );

      // Kill child processes
      for (const childProcess of this.runningProcesses.values()) {
        try {
          childProcess.kill("SIGTERM");
        } catch {
          // Ignore
        }
      }

      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (reason) => {
      const errorMsg =
        reason instanceof Error ? reason.message : String(reason);
      const stack = reason instanceof Error ? reason.stack : "";
      // eslint-disable-next-line i18next/no-literal-string
      process.stderr.write(
        `\n❌ Unhandled promise rejection: ${errorMsg}\n${stack || ""}\n`,
      );

      // Kill child processes
      for (const childProcess of this.runningProcesses.values()) {
        try {
          childProcess.kill("SIGTERM");
        } catch {
          // Ignore
        }
      }

      process.exit(1);
    });
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
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<never> {
    // Convert string port to number if needed (CLI compatibility)
    const port =
      typeof data.port === "string" ? parseInt(data.port, 10) : data.port;

    this.logStartupInfo(port, logger, data);

    // Setup database if not skipped
    const dbSetupSuccess = await this.setupDatabase(data, locale, logger);
    if (!dbSetupSuccess) {
      // Database setup failed critically, start Next.js anyway
      return await this.startNextJsAndWait(port, logger);
    }

    // Start task runner if not skipped
    await this.startTaskRunnerIfEnabled(data, locale, logger);

    // Start Next.js and keep process alive
    return await this.startNextJsAndWait(port, logger);
  }

  /**
   * Log startup information
   */
  private logStartupInfo(
    port: number,
    logger: EndpointLogger,
    data: RequestType,
  ): void {
    logger.vibe("🚀 Starting development server");
    logger.vibe(
      `📍 Port: ${port} | Debug: ${logger.isDebugEnabled ? "ON" : "OFF (use --verbose to debug)"} | Tasks: ${data.skipTaskRunner ? "DISABLED" : "ENABLED"}`,
    );
  }

  /**
   * Setup database based on configuration
   * Returns false if setup failed critically and Next.js should start immediately
   */
  private async setupDatabase(
    data: RequestType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<boolean> {
    if (data.skipDbSetup) {
      logger.vibe("⏭️ Database setup skipped");
      return true;
    }

    try {
      const dockerCheckResult =
        await dbUtilsRepository.isDockerAvailable(logger);

      if (!dockerCheckResult.success || !dockerCheckResult.data) {
        logger.vibe("⚠️ Docker unavailable (continuing anyway)");
        logger.vibe("🔧 Install Docker to enable database functionality");
        return true;
      }

      // Perform database operations based on reset flag
      const dbOperationSuccess = await this.performDatabaseOperations(
        data,
        locale,
        logger,
      );

      if (!dbOperationSuccess) {
        return false; // Critical failure, start Next.js immediately
      }

      logger.vibe("✅ Database ready");
      return true;
    } catch (error) {
      const parsedError = parseError(error);
      logger.vibe("❌ Database setup failed (continuing anyway)");
      logger.error("Database setup error details", parsedError);
      logger.vibe(`💡 Error: ${parsedError.message}`);
      return true;
    }
  }

  /**
   * Perform database operations (reset or start) and migrations
   * Returns false if critical failure occurred
   */
  private async performDatabaseOperations(
    data: RequestType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<boolean> {
    try {
      if (data.dbReset || data.r) {
        await this.resetDatabase(locale, logger);
      } else {
        await this.startDatabaseWithoutReset(locale, logger);
      }

      // Run migrations and seed
      await databaseMigrationRepository.runMigrations(
        { generate: true, redo: false, schema: "public", dryRun: false },
        locale,
        logger,
      );

      await seedDatabase("dev", logger, locale);
      return true;
    } catch (error) {
      this.logDatabaseError(error, logger);
      return false; // Critical failure
    }
  }

  /**
   * Reset database with hard reset
   */
  private async resetDatabase(
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<void> {
    logger.vibe("🔄 Resetting database...");
    await this.performHardDatabaseReset(logger, locale);
    logger.vibe("✅ Database reset completed");

    await databaseMigrationRepository.runMigrations(
      {
        generate: true,
        redo: false,
        schema: "public",
        dryRun: false,
      },
      locale,
      logger,
    );
  }

  /**
   * Start database without reset
   */
  private async startDatabaseWithoutReset(
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<void> {
    const dbStartResult = await dockerOperationsRepository.dockerComposeUp(
      logger,
      locale,
      "docker-compose-dev.yml",
      60000,
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
      logger.vibe("🔧 Or check if Docker is running: docker --version");
      // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Required for error handling flow
      throw new Error("Failed to start database");
    }

    logger.vibe("✅ Database started");
  }

  /**
   * Log database error with helpful suggestions
   */
  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Error handling: Database errors can be any type (Drizzle errors, connection errors, etc), so unknown is correct before narrowing.
  private logDatabaseError(error: unknown, logger: EndpointLogger): void {
    const parsedError = parseError(error);
    logger.vibe("❌ Database operation failed");
    logger.error("Database error details", parsedError);
    logger.vibe(`💡 Error: ${parsedError.message}`);
    logger.vibe("🔧 Try running: vibe dev -r");
  }

  /**
   * Start task runner if enabled
   */
  private async startTaskRunnerIfEnabled(
    data: RequestType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<void> {
    if (data.skipTaskRunner) {
      logger.vibe("⏭️ Task runner disabled");
      return;
    }

    try {
      await this.startUnifiedTaskRunner(locale, logger, data);
      logger.vibe("✅ Task runner started in background");
    } catch (error) {
      const parsedError = parseError(error);
      logger.vibe("⚠️ Task runner startup failed (continuing anyway)");
      logger.error("Task runner startup error details", parsedError);
      if (logger.isDebugEnabled) {
        logger.vibe(`💡 Error: ${parsedError.message}`);
      }
    }
  }

  /**
   * Start Next.js and wait for it to exit
   */
  private async startNextJsAndWait(
    port: number,
    logger: EndpointLogger,
  ): Promise<never> {
    logger.vibe(`🌐 Starting Next.js on http://localhost:${port}`);

    const nextProcess = this.startNextJsProcess(port);

    // Set up SIGINT handler to prevent parent from exiting before child
    // Both parent and child receive SIGINT from terminal, but we want to wait
    // for child to finish cleanly before parent exits
    // oxlint-disable-next-line consistent-function-scoping
    const sigintHandler = (): void => {
      // Do nothing - just prevent default exit behavior
      // Child already received SIGINT from terminal and is shutting down
      // We'll exit when child exits via the 'exit' event below
    };
    process.on("SIGINT", sigintHandler);

    // Wait for Next.js to exit, then give time for buffered output
    return await new Promise<never>(() => {
      nextProcess.on("exit", (code) => {
        // Remove our SIGINT handler now that child has exited
        process.removeListener("SIGINT", sigintHandler);

        // Wait briefly for stdio streams to finish (child might have buffered output)
        // This prevents terminal pollution from warnings like browserslist age warnings
        setTimeout(() => {
          // eslint-disable-next-line i18next/no-literal-string
          process.stdout.write("\n🛑 vibes have stopped\n");
          // Exit with the same code as Next.js
          process.exit(code ?? 0);
        }, 100);
      });

      nextProcess.on("error", (error) => {
        process.removeListener("SIGINT", sigintHandler);
        // eslint-disable-next-line i18next/no-literal-string
        process.stderr.write(`❌ Next.js error: ${error.message}\n`);
        process.exit(1);
      });
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
      if (DEV_WATCHER_TASK_NAME === task.name && data.skipGeneratorWatcher) {
        logger.debug(
          "Skipping generator watcher (disabled by skipGeneratorWatcher)",
        );
        return false;
      }

      // Only include tasks that are enabled and appropriate for development
      if (!task.enabled) {
        logger.debug(`Skipping disabled task: ${task.name}`);
        return false;
      }

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
  private startNextJsProcess(port: number): ChildProcess {
    const turbo = useTurbopack ? ["--turbo"] : [];
    const nextProcess = spawn(
      "bun",
      ["run", "next", "dev", ...turbo, "--port", port.toString()],
      {
        stdio: "inherit", // Pass output directly to stdout/stderr
        // Keep in same process group (default) so Ctrl+C propagates naturally
        // When terminal sends SIGINT, both parent and child receive it
        detached: false,
      },
    );

    // Store the process for cleanup
    this.runningProcesses.set("next-dev", nextProcess);

    return nextProcess;
  }
}

/**
 * Default repository instance
 */
export const devRepository = new DevRepositoryImpl();
