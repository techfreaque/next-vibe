/**
 * Development Server Repository
 * Handles starting the development server with task runner and Next.js
 * Implements task system specification requirements
 */

// CLI output messages don't need internationalization

import type { ChildProcess } from "node:child_process";
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { parseError } from "next-vibe/shared/utils/parse-error";

import { SeedRepository } from "@/app/api/[locale]/system/db/seed/repository";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  createNextjsFormatter,
  formatActionCommand,
  formatCommand,
  formatConfig,
  formatDatabase,
  formatDuration,
  formatError,
  formatHint,
  formatSkip,
  formatStartup,
  formatTask,
  formatWarning,
} from "@/app/api/[locale]/system/unified-interface/shared/logger/formatters";
import { UnifiedTaskRunnerRepository } from "@/app/api/[locale]/system/unified-interface/tasks/unified-runner/repository";
import type { Task } from "@/app/api/[locale]/system/unified-interface/tasks/unified-runner/types";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";

import { DatabaseGenerateRepository } from "../../db/generate/repository";
import { DatabaseMigrationRepository } from "../../db/migrate/repository";
import { scopedTranslation as dockerScopedTranslation } from "../../db/utils/docker-operations/i18n";
import { DockerOperationsRepository } from "../../db/utils/docker-operations/repository";
import { scopedTranslation as dbUtilsScopedTranslation } from "../../db/utils/i18n";
import { DbUtilsRepository } from "../../db/utils/repository";
import { DEV_WATCHER_TASK_NAME } from "../../unified-interface/tasks/dev-watcher/task-runner";
import {
  addPidToFile,
  cleanupPidFile,
  killPreviousInstance,
  removePidFromFile,
  VIBE_DEV_PID_FILE,
  writePidFile,
} from "../pid";
import { ServerFramework } from "../enum";
import type { DevRequestOutput } from "./definition";

/**
 * Dev Repository Interface
 */
/**
 * Dev Repository
 */
export class DevRepository {
  private static log(msg: string): void {
    // eslint-disable-next-line no-console
    console.log(msg);
  }

  /** Extract port number from a URL string, returns undefined if not parseable */
  private static portFromUrl(url: string | undefined): number | undefined {
    if (!url) {
      return undefined;
    }
    try {
      const parsed = new URL(url);
      return parsed.port ? parseInt(parsed.port, 10) : undefined;
    } catch {
      return undefined;
    }
  }

  /**
   * Patch NEXT_PUBLIC_APP_URL in process.env so the running port is reflected.
   * Only patches localhost URLs - production URLs are left untouched.
   * Child processes inherit process.env so they automatically get the correct URL.
   */
  private static patchPublicUrlPort(port: number): void {
    const current = process.env["NEXT_PUBLIC_APP_URL"];
    // Use Object.assign to avoid Next.js inlining NEXT_PUBLIC_* vars at build time,
    // which would turn the assignment into `"literal string" = value` (invalid JS).
    if (!current) {
      Object.assign(process.env, {
        NEXT_PUBLIC_APP_URL: `http://localhost:${String(port)}`,
      });
      return;
    }
    try {
      const parsed = new URL(current);
      if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
        parsed.port = String(port);
        Object.assign(process.env, { NEXT_PUBLIC_APP_URL: parsed.toString() });
      }
    } catch {
      // Not a valid URL - leave it as-is
    }
  }

  private static runningProcesses: Map<string, ChildProcess> = new Map();
  private static shuttingDown = false;

  static {
    // Set up clean exit handlers for crashes only
    DevRepository.setupExitHandlers();
  }

  private static setupExitHandlers(): void {
    // Swallow crashes in dev - log and continue rather than killing the whole server

    // Handle uncaught exceptions
    process.on("uncaughtException", (error) => {
      // eslint-disable-next-line i18next/no-literal-string
      process.stderr.write(
        `\n⚠️  Uncaught exception (dev server continuing): ${error.message}\n${error.stack || ""}\n`,
      );
      // Do NOT exit - dev server should survive transient errors
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (reason) => {
      const errorMsg =
        reason instanceof Error ? reason.message : String(reason);
      const stack = reason instanceof Error ? reason.stack : "";
      // eslint-disable-next-line i18next/no-literal-string
      process.stderr.write(
        `\n⚠️  Unhandled promise rejection (dev server continuing): ${errorMsg}\n${stack || ""}\n`,
      );
      // Do NOT exit - dev server should survive transient errors
    });
  }

  /**
   * Perform hard database reset: stop containers, delete data, restart
   */
  private static async performHardDatabaseReset(
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<void> {
    const { exec } = await import("node:child_process");
    const { promisify } = await import("node:util");
    const execAsync = promisify(exec);

    // 1. Stop Docker containers
    logger.debug("Stopping Docker containers...");
    const { t: dockerT } = dockerScopedTranslation.scopedT(locale);
    const downResult = await DockerOperationsRepository.dockerComposeDown(
      logger,
      dockerT,
      "docker-compose-dev.yml",
      30000,
      "vibe-dev",
    );

    if (!downResult.success) {
      logger.warn("Failed to stop Docker containers, continuing anyway");
    }

    // 2. Force-remove the container (hardcoded container_name in compose
    //    means `docker compose down` may not clean it up properly)
    try {
      await execAsync("docker rm -f dev-postgres 2>/dev/null || true", {
        timeout: 10000,
      });
      logger.debug("Removed dev-postgres container");
    } catch {
      logger.debug("No dev-postgres container to remove");
    }

    // 3. Delete postgres data volume
    await DevRepository.deletePostgresDataVolume(logger);

    // 4. Start Docker containers
    logger.debug("Starting Docker containers...");
    const upResult = await DockerOperationsRepository.dockerComposeUp(
      logger,
      dockerT,
      "docker-compose-dev.yml",
      60000,
      "vibe-dev",
    );

    if (!upResult.success) {
      logger.error("Failed to start Docker containers", {
        error: upResult.message || "Unknown error",
      });
      // Continue execution - don't throw, let the process continue
      logger.vibe(
        formatError("Database startup failed, continuing without database"),
      );
    }
    // 5. Wait for database to be ready
    await DevRepository.waitForDatabaseConnection(logger);
  }

  /**
   * Delete postgres data volume for clean reset
   */
  private static async deletePostgresDataVolume(
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      const { exec } = await import("node:child_process");
      const { promisify } = await import("node:util");
      const execAsync = promisify(exec);

      const volumeName = "vibe-dev_postgres_data";
      logger.debug(`Deleting postgres data volume: ${volumeName}...`);

      try {
        // Remove the Docker volume (this is much cleaner than dealing with file permissions)
        await execAsync(`docker volume rm ${volumeName} 2>/dev/null || true`, {
          timeout: 10000,
        });
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
  private static async waitForDatabaseConnection(
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
          await pool.query("SELECT 1");
          await pool.end();

          logger.debug(
            `✅ Database connection ready after ${attempt} attempts (${(attempt * delayMs) / 1000}s)`,
          );
          return;
        } catch {
          // Intentionally suppress pool.end() errors - pool might already be closed
          // oxlint-disable-next-line no-empty-function
          await pool.end().catch(() => {});
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
          // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- CLI fatal error requires throw to halt execution
          throw new Error(
            `Database connection timeout after ${maxAttempts} attempts (${(maxAttempts * delayMs) / 1000}s)`,
          );
        }

        if (attempt % 10 === 0) {
          logger.debug(
            `⏳ Database not ready yet, retrying (${attempt}/${maxAttempts})...`,
          );
        }
      }
    }
  }

  static async execute(
    data: DevRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<never> {
    // Derive port: explicit --port > NEXT_PUBLIC_APP_URL port > default 3000
    const port =
      data.port ?? DevRepository.portFromUrl(env.NEXT_PUBLIC_APP_URL) ?? 3000;

    // Patch NEXT_PUBLIC_APP_URL to reflect the actual port.
    // This ensures runtime env reads (and all child processes) see the correct URL.
    DevRepository.patchPublicUrlPort(port);

    DevRepository.logStartupInfo(port, logger, data);

    // Kill any previous dev instance, then write our PID (including resolved port)
    killPreviousInstance(VIBE_DEV_PID_FILE, logger);
    writePidFile(VIBE_DEV_PID_FILE, logger, [], port);

    // Register early SIGINT/SIGTERM so Ctrl+C during setup exits immediately
    const earlyExitHandler = (): void => {
      cleanupPidFile(VIBE_DEV_PID_FILE);
      process.exit(0);
    };
    process.on("SIGINT", earlyExitHandler);
    process.on("SIGTERM", earlyExitHandler);

    // Setup database if not skipped
    const dbSetupSuccess = await DevRepository.setupDatabase(
      data,
      locale,
      logger,
    );
    if (!dbSetupSuccess) {
      // Database setup failed critically, start server anyway
      return await DevRepository.startNextJsAndWait(
        port,
        logger,
        earlyExitHandler,
        data.profile,
        data.framework === ServerFramework.TANSTACK,
      );
    }

    // Shared abort controller: aborted by shutdown() so task runners stop cleanly
    const shutdownController = new AbortController();

    // Start task runner if not skipped
    void DevRepository.startTaskRunnerIfEnabled(
      data,
      locale,
      logger,
      shutdownController.signal,
    );

    // Start Next.js (or Vite for TanStack) and keep process alive
    return await DevRepository.startNextJsAndWait(
      port,
      logger,
      earlyExitHandler,
      data.profile,
      data.framework === ServerFramework.TANSTACK,
      shutdownController,
    );
  }

  /**
   * Log startup information
   */
  private static logStartupInfo(
    port: number,
    logger: EndpointLogger,
    data: DevRequestOutput,
  ): void {
    logger.vibe(formatStartup("Starting Development Server", "⚡"));
    DevRepository.log("");
    DevRepository.log(
      `  ${formatConfig("Port", port)}  ${formatHint("(--port=N)")}`,
    );
    DevRepository.log(
      `  ${formatConfig("Framework", data.framework === ServerFramework.TANSTACK ? "TanStack/Vite" : "Next.js")}  ${formatHint("(--framework=next|tanstack)")}`,
    );
    DevRepository.log(
      `  ${formatConfig("Debug", logger.isDebugEnabled ? "ON" : "OFF")}  ${formatHint(logger.isDebugEnabled ? "(remove -v or --verbose to disable)" : "(-v or --verbose to enable)")}`,
    );
    DevRepository.log("");

    if (data.skipDbSetup) {
      DevRepository.log(
        `  ${formatConfig("Database", "DISABLED")} ${formatHint("(remove --skip-db-setup to enable)")}`,
      );
    } else {
      DevRepository.log(
        `  ${formatConfig("Database", "ENABLED")} ${formatHint("(--skip-db-setup to disable)")}`,
      );
      DevRepository.log(
        `    ${formatConfig("Reset", data.dbReset || data.r ? "YES" : "NO")} ${formatHint(data.dbReset || data.r ? "(remove -r to skip)" : "(-r to reset)")}`,
      );
      DevRepository.log(
        `    ${formatConfig("Migrations", data.skipMigrations ? "NO" : "YES")} ${formatHint(data.skipMigrations ? "(remove --skip-migrations)" : "(--skip-migrations)")}`,
      );
      if (!data.skipMigrations) {
        DevRepository.log(
          `    ${formatConfig("Generation", data.skipMigrationGeneration ? "NO" : "YES")} ${formatHint(data.skipMigrationGeneration ? "(remove --skip-migration-generation)" : "(--skip-migration-generation)")}`,
        );
      }
      DevRepository.log(
        `    ${formatConfig("Seeding", data.skipSeeding ? "NO" : "YES")} ${formatHint(data.skipSeeding ? "(remove --skip-seeding to enable)" : "(--skip-seeding to disable)")}`,
      );
    }

    DevRepository.log("");
    DevRepository.log(
      `  ${formatConfig("Background Tasks", data.skipTaskRunner ? "DISABLED" : "ENABLED")} ${formatHint(data.skipTaskRunner ? "(remove --skip-task-runner)" : "(--skip-task-runner)")}`,
    );
    DevRepository.log(
      `  ${formatConfig("Code Generators", data.skipGeneratorWatcher ? "DISABLED" : "ENABLED")} ${formatHint(data.skipGeneratorWatcher ? "(remove --skip-generator-watcher)" : "(--skip-generator-watcher)")}`,
    );
    DevRepository.log("");
    DevRepository.log(
      `  ${formatHint("💡 Edit src/app/api/[locale]/system/server/dev/definition.ts to change defaults")}`,
    );
    DevRepository.log("");
  }

  /**
   * Setup database based on configuration
   * Returns false if setup failed critically and Next.js should start immediately
   */
  private static async setupDatabase(
    data: DevRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<boolean> {
    if (data.skipDbSetup) {
      logger.vibe(formatSkip("Database setup skipped"));
      return true;
    }

    try {
      const { t: dbUtilsT } = dbUtilsScopedTranslation.scopedT(locale);
      const dockerCheckResult = await DbUtilsRepository.isDockerAvailable(
        dbUtilsT,
        logger,
      );

      if (!dockerCheckResult.success || !dockerCheckResult.data) {
        logger.vibe(formatWarning("Docker unavailable (continuing anyway)"));
        logger.vibe(
          `🐳 ${formatCommand("Install Docker")} to enable database functionality`,
        );
        return true;
      }

      // Perform database operations based on reset flag
      const dbOperationSuccess = await DevRepository.performDatabaseOperations(
        data,
        locale,
        logger,
      );

      if (!dbOperationSuccess) {
        return false; // Critical failure, start Next.js immediately
      }

      logger.info(formatDatabase("Database ready", "🗄️ "));
      return true;
    } catch (error) {
      const parsedError = parseError(error);
      logger.vibe(formatError("Database setup failed (continuing anyway)"));
      logger.error("Database setup error details", parsedError);
      logger.vibe(`💡 Error: ${parsedError.message}`);
      return true;
    }
  }

  /**
   * Perform database operations (reset or start) and migrations
   * Returns false if critical failure occurred
   */
  private static async performDatabaseOperations(
    data: DevRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<boolean> {
    try {
      if (data.dbReset || data.r) {
        // Reset includes migrations, so we pass the migration flags
        await DevRepository.resetDatabase(locale, logger, data);
      } else {
        await DevRepository.startDatabaseWithoutReset(locale, logger);

        // Run migrations if not skipped (only when not resetting)
        if (data.skipMigrations) {
          logger.vibe(formatSkip("Migrations skipped"));
        } else {
          if (!data.skipMigrationGeneration) {
            const generateResult = await DatabaseGenerateRepository.runGenerate(
              logger,
              true,
            );
            if (!generateResult.success) {
              DevRepository.logDatabaseError(
                new Error(generateResult.message ?? "Generation failed"),
                logger,
              );
              cleanupPidFile(VIBE_DEV_PID_FILE);
              process.exit(1);
            }
          }
          const migrateResult =
            await DatabaseMigrationRepository.migrate(logger);
          if (!migrateResult.success) {
            DevRepository.logDatabaseError(
              new Error(migrateResult.message ?? "Migration failed"),
              logger,
            );
            cleanupPidFile(VIBE_DEV_PID_FILE);
            process.exit(1);
          }
        }
      }

      // Deploy db-functions (idempotent - runs after every migration)
      const { deployDbFunctions } =
        await import("@/app/api/[locale]/system/db/db-functions/deploy");
      await deployDbFunctions(logger);

      // Seed database if not skipped
      if (data.skipSeeding) {
        logger.vibe(formatSkip("Database seeding skipped"));
      } else {
        await SeedRepository.seed("dev", logger);
      }

      return true;
    } catch (error) {
      DevRepository.logDatabaseError(
        error instanceof Error ? error : new Error(String(error)),
        logger,
      );
      cleanupPidFile(VIBE_DEV_PID_FILE);
      process.exit(1);
    }
  }

  /**
   * Reset database with hard reset
   */
  private static async resetDatabase(
    locale: CountryLanguage,
    logger: EndpointLogger,
    data: DevRequestOutput,
  ): Promise<void> {
    const startTime = Date.now();
    logger.debug(
      `🔄 ${formatActionCommand("Resetting database using:", "docker compose down && docker volume rm")}`,
    );
    await DevRepository.performHardDatabaseReset(logger, locale);
    const duration = Date.now() - startTime;
    logger.info(`✓  Reset completed in ${formatDuration(duration)}`);

    // Run migrations if not skipped
    if (data.skipMigrations) {
      logger.vibe(formatSkip("Migrations skipped"));
    } else {
      if (!data.skipMigrationGeneration) {
        const generateResult = await DatabaseGenerateRepository.runGenerate(
          logger,
          true,
        );
        if (!generateResult.success) {
          DevRepository.logDatabaseError(
            new Error(generateResult.message ?? "Generation failed"),
            logger,
          );
          cleanupPidFile(VIBE_DEV_PID_FILE);
          process.exit(1);
        }
      }
      const migrateResult = await DatabaseMigrationRepository.migrate(logger);
      if (!migrateResult.success) {
        DevRepository.logDatabaseError(
          new Error(migrateResult.message ?? "Migration failed"),
          logger,
        );
        cleanupPidFile(VIBE_DEV_PID_FILE);
        process.exit(1);
      }
    }
  }

  /**
   * Start database without reset
   */
  private static async startDatabaseWithoutReset(
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<void> {
    const startTime = Date.now();
    logger.debug(
      `🐘 ${formatActionCommand("Starting PostgreSQL using:", "docker compose -f docker-compose-dev.yml up -d")}`,
    );
    const { t: dockerT } = dockerScopedTranslation.scopedT(locale);
    const dbStartResult = await DockerOperationsRepository.dockerComposeUp(
      logger,
      dockerT,
      "docker-compose-dev.yml",
      60000,
      "vibe-dev",
    );

    if (!dbStartResult.success) {
      logger.error("Failed to start database", {
        error: dbStartResult.message,
      });
      logger.vibe(formatError("Database startup failed"));
      logger.vibe(
        `   Try: ${formatCommand("docker compose -f docker-compose-dev.yml up -d")}`,
      );
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- CLI fatal error requires throw to halt execution
      throw new Error("Failed to start database");
    }

    const duration = Date.now() - startTime;
    logger.info(
      formatDatabase(
        `${formatActionCommand("Started PostgreSQL using:", "docker compose -f docker-compose-dev.yml up -d")} in ${formatDuration(duration)}`,
        "🐘",
      ),
    );
  }

  /**
   * Log database error with helpful suggestions
   */
  private static logDatabaseError(error: Error, logger: EndpointLogger): void {
    const parsedError = parseError(error);
    logger.vibe(
      formatError(`Database operation failed: ${parsedError.message}`),
    );
    logger.vibe(`💡 Try running: ${formatCommand("vibe dev -r")}`);
  }

  /**
   * Start task runner if enabled
   */
  private static async startTaskRunnerIfEnabled(
    data: DevRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
    signal: AbortSignal,
  ): Promise<void> {
    if (data.skipTaskRunner) {
      logger.vibe(formatSkip("Task runner disabled"));
      return;
    }

    try {
      logger.debug(formatTask("Starting task runner"));
      await DevRepository.startUnifiedTaskRunner(locale, logger, data, signal);
      logger.debug(formatTask("Task runner started"));
    } catch (error) {
      const parsedError = parseError(error);
      logger.vibe(
        formatWarning("Task runner startup failed (continuing anyway)"),
      );
      logger.error("Task runner startup error details", parsedError);
      if (logger.isDebugEnabled) {
        logger.vibe(`💡 Error: ${parsedError.message}`);
      }
    }
  }

  /**
   * Start Next.js (or Vite for TanStack) dev server + WebSocket sidecar and wait forever
   */
  private static async startNextJsAndWait(
    port: number,
    logger: EndpointLogger,
    earlyExitHandler?: () => void,
    profile = false,
    tanstack = false,
    shutdownController?: AbortController,
  ): Promise<never> {
    const { spawn } = await import("node:child_process");

    // Save tty state now (before anything touches it) so we can restore on exit
    let savedTtyState: string | null = null;
    try {
      savedTtyState = execSync("stty -g </dev/tty 2>/dev/null", {
        shell: "/bin/sh",
      })
        .toString()
        .trim();
    } catch {
      /* not a tty */
    }

    const { env: serverEnv } = await import("@/config/env");
    const disableProxy = serverEnv.VIBE_DISABLE_PROXY;

    // Import WS module to get NEXT_PORT_OFFSET
    const { startWebSocketServer, NEXT_PORT_OFFSET } =
      await import("@/app/api/[locale]/system/unified-interface/websocket/server");

    // In proxy mode (default): Next.js on port+NEXT_PORT_OFFSET, Bun proxy on main port.
    // In direct mode (VIBE_DISABLE_PROXY=true): Next.js on main port, WS sidecar on port+1000.
    const WS_SIDECAR_OFFSET = 1000;
    const nextPort = disableProxy ? port : port + NEXT_PORT_OFFSET;
    const wsPort = disableProxy ? port + WS_SIDECAR_OFFSET : port;

    // Kill stale processes on all used ports.
    // TanStack mode: Vite runs on nextPort (internal), proxy on wsPort (public) - same offsets as Next.js.
    DevRepository.killProcessOnPort(nextPort, logger);
    DevRepository.killProcessOnPort(wsPort, logger);

    // WS proxy handle - started immediately for Next.js mode, but deferred
    // until AFTER Vite is ready for TanStack mode (early requests to the proxy
    // before Vite is listening on nextPort can interfere with Nitro's startup).
    let wsHandle: ReturnType<typeof startWebSocketServer> | undefined;

    // For Next.js mode, start the proxy immediately so it's ready to accept connections.
    // For TanStack mode, we start Vite first and only then start the proxy.
    if (!tanstack) {
      wsHandle = startWebSocketServer({ port: wsPort, logger });
    }

    // Vite server close function - set after startTanstackDevServer resolves
    let viteClose: (() => Promise<void>) | undefined;

    const restoreTty = (): void => {
      try {
        if (savedTtyState) {
          execSync(`stty ${savedTtyState} </dev/tty 2>/dev/null`, {
            shell: "/bin/sh",
          });
        }
      } catch {
        /* not a tty */
      }
    };

    const shutdown = (code: number, message?: string): void => {
      DevRepository.shuttingDown = true;
      restoreTty();
      if (message) {
        process.stdout.write(`\n${message}\n`);
      }
      // Signal task runners to stop cleanly
      shutdownController?.abort();
      // Stop Bun WS server (may be undefined if still in Vite startup for TanStack mode)
      wsHandle?.stop();
      // Kill Next.js child process (current one tracked in runningProcesses)
      const currentNext = DevRepository.runningProcesses.get("next");
      if (currentNext && !currentNext.killed) {
        currentNext.stdout?.unpipe();
        currentNext.stderr?.unpipe();
        currentNext.stdout?.destroy();
        currentNext.stderr?.destroy();
        currentNext.kill("SIGTERM");
      }
      cleanupPidFile(VIBE_DEV_PID_FILE);
      // Close Vite dev server (TanStack mode) then exit.
      // We await it so Vite can flush its cleanup before process.exit —
      // skipping the await causes the OS to SIGKILL the process mid-cleanup.
      // A 2s timeout prevents hanging if Vite's shutdown stalls.
      if (viteClose) {
        const timer = setTimeout(() => {
          process.exit(code);
        }, 2000);
        void viteClose()
          .catch(() => {
            /* ignore vite close errors */
          })
          .finally(() => {
            clearTimeout(timer);
            process.exit(code);
          });
      } else {
        // Use setImmediate so synchronous cleanup above finishes before exit,
        // preventing Bun from seeing live handles and sending SIGKILL.
        setImmediate(() => process.exit(code));
      }
    };

    // Replace early exit handler with full graceful shutdown handler
    if (earlyExitHandler) {
      process.off("SIGINT", earlyExitHandler);
      process.off("SIGTERM", earlyExitHandler);
    }
    const SHUTDOWN_MESSAGES = [
      "👋 Peace out! The vibes have left the building",
      "🌙 Server has left the chat",
      "🌙 Going dark... catch you on the flip side",
      "🎬 And... scene! That's a wrap folks",
      "🚪 Server has stopped responding (just kidding, it's fine)",
      "☕ Taking a coffee break... indefinitely",
      "🎮 Game over! Insert coin to continue",
      "🛌 Server is going to bed. Sweet dreams!",
      "🎪 The circus has left town",
      "🦖 Server went extinct (but it'll be back)",
    ];
    const sigintHandler = (): void => {
      const msg =
        SHUTDOWN_MESSAGES[Math.floor(Math.random() * SHUTDOWN_MESSAGES.length)];
      shutdown(0, msg);
    };
    process.on("SIGINT", sigintHandler);
    process.on("SIGTERM", sigintHandler);

    logger.debug(
      tanstack
        ? `⚡ TanStack/Vite dev server available at http://localhost:${port}`
        : `⚡ Next.js dev server available at http://localhost:${port}`,
    );
    if (profile) {
      // eslint-disable-next-line i18next/no-literal-string
      process.stdout.write(`
┌─────────────────────────────────────────────────────────────────┐
│  🔬  PROFILING MODE ACTIVE                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Use the app, trigger slow paths, then press:                   │
│                                                                 │
│    p  →  stop server, collect profiles, open results            │
│    Ctrl+C  →  stop server normally (no auto-open)               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
`);

      // Listen for 'p' keypress to stop and open profiles
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.setEncoding("utf8");
        process.stdin.on("data", (key: string) => {
          // Ctrl+C in raw mode - honour it
          if (key === "\u0003") {
            sigintHandler();
            return;
          }
          if (key === "p" || key === "P") {
            process.stdout.write(
              // eslint-disable-next-line i18next/no-literal-string
              "\n⏹  Stopping server to collect profiles…\n",
            );
            // Kill Next.js so it flushes NEXT_CPU_PROF output
            DevRepository.shuttingDown = true;
            restoreTty();
            wsHandle?.stop();
            const currentNext = DevRepository.runningProcesses.get("next");
            if (currentNext && !currentNext.killed) {
              currentNext.stdout?.unpipe();
              currentNext.stderr?.unpipe();
              currentNext.stdout?.destroy();
              currentNext.stderr?.destroy();
              currentNext.kill("SIGTERM");
            }
            DevRepository.killProcessOnPort(nextPort, logger);
            DevRepository.killProcessOnPort(wsPort, logger);
            cleanupPidFile(VIBE_DEV_PID_FILE);

            // Give the process a moment to flush files, then open results
            setTimeout((): void => {
              void (async (): Promise<void> => {
                const { default: open } = await import("open");
                const { resolve } = await import("node:path");

                // 1. CPU profile → open directly (VS Code opens it natively on ctrl+click)
                const cpuProfiles = (await import("node:fs"))
                  .readdirSync(process.cwd())
                  .filter((f: string) => f.endsWith(".cpuprofile"));
                if (cpuProfiles.length > 0) {
                  const latest = cpuProfiles.toSorted().at(-1)!;
                  const latestPath = resolve(latest);
                  // eslint-disable-next-line i18next/no-literal-string
                  process.stdout.write(`🔥 Opening CPU profile: ${latest}\n`);
                  await open(latestPath);
                } else {
                  process.stdout.write(
                    // eslint-disable-next-line i18next/no-literal-string
                    "⚠️  No .cpuprofile found - try running with --profile again\n",
                  );
                }

                // 2. Turbopack trace → open trace viewer (user drops file in)
                const tracePath = resolve(".next/dev/trace-turbopack");
                if (existsSync(tracePath)) {
                  // eslint-disable-next-line i18next/no-literal-string
                  process.stdout.write(`📊 Opening Turbopack trace viewer\n`);
                  await open("https://trace.nextjs.org/");
                }

                // eslint-disable-next-line i18next/no-literal-string
                process.stdout.write("\n✅ Done. Goodbye!\n");
                process.exit(0);
              })();
            }, 1500);
          }
        });
      }
    }

    // TanStack Start mode: start Nitro SSR dev server via viteCompiler.
    // Uses @tanstack/react-start/plugin/vite + nitro plugins.
    if (tanstack) {
      const { viteCompiler } =
        await import("@/app/api/[locale]/system/builder/repository/vite-compiler");
      const { ViteBuildTypeEnum } =
        await import("@/app/api/[locale]/system/builder/enum");
      const { configLoader } =
        await import("@/app/api/[locale]/system/builder/repository/config-loader");
      const { scopedTranslation: builderScopedTranslation } =
        await import("@/app/api/[locale]/system/builder/i18n");
      const { defaultLocale } = await import("@/i18n/core/config");
      const { t: builderT } = builderScopedTranslation.scopedT(defaultLocale);
      const configResult = await configLoader.load(
        "build.config.ts",
        undefined,
        [],
        logger,
        builderT,
      );
      if (!configResult.success) {
        logger.error("Failed to load build.config.ts for TanStack Start");
        process.exit(1);
      }
      const tanstackEntry = configResult.data.filesToCompile?.find(
        (f) => f.type === ViteBuildTypeEnum.TANSTACK_START,
      );
      if (!tanstackEntry) {
        logger.error("No tanstack-start entry found in build.config.ts");
        process.exit(1);
      }
      // Ensure the routes directory exists before the TanStack router-generator
      // plugin scans it - it will throw ENOENT if the folder is missing.
      const routesDir = join(process.cwd(), "src/app-tanstack/routes");
      if (!existsSync(routesDir)) {
        mkdirSync(routesDir, { recursive: true });
      }

      // TanStack Vite runs on nextPort (internal); WS proxy on wsPort forwards to it.
      // Pass wsPort as publicPort so Vite's HMR client points to the proxy, not the internal port.
      // IMPORTANT: Start Vite BEFORE the proxy so early browser requests don't interfere with
      // Nitro's startup (requests arriving on the proxy while Vite is still initializing can
      // cause Nitro to hang mid-startup, resulting in the server never becoming ready).
      const devResult = await viteCompiler.startTanstackDevServer(
        tanstackEntry,
        nextPort,
        disableProxy ? undefined : wsPort,
      );
      if (!devResult.success) {
        logger.error(devResult.message ?? "TanStack Start dev server failed");
        process.exit(1);
      }
      viteClose = devResult.close;

      // Vite is now ready - start the proxy so it can forward requests to Vite
      if (!disableProxy) {
        wsHandle = startWebSocketServer({ port: wsPort, logger });
      }

      // Keep the process alive - the Vite/Nitro server runs until SIGINT/SIGTERM
      // oxlint-disable-next-line no-empty-function -- intentional infinite wait; server runs until SIGINT/SIGTERM
      return new Promise<never>(() => {
        /* intentional: keep alive until signal */
      });
    }

    // --- Spawn Next.js with auto-restart on crash ---
    const MAX_RESTARTS = 10;
    const RESTART_BACKOFF_MS = [1000, 2000, 4000, 8000, 15000]; // exponential, capped
    let restartCount = 0;

    const spawnNext = (): void => {
      if (DevRepository.shuttingDown) {
        return;
      }

      // Drop stale reference from previous run to allow GC
      DevRepository.runningProcesses.delete("next");

      const profilingEnv = profile
        ? {
            NEXT_TURBOPACK_TRACING: "1",
            NEXT_CPU_PROF: "1",
          }
        : {};

      const nextProcess = spawn("bun", ["run", "next", "dev", "--port", String(nextPort)], {
        stdio: ["ignore", "pipe", "pipe"],
        env: {
          ...process.env,
          ...profilingEnv,
          // Cap V8 heap to force GC before memory balloons unboundedly.
          // 8GB is enough for dev; without this Node grows until OOM.
          NODE_OPTIONS: [
            process.env.NODE_OPTIONS,
            "--max-old-space-size=8192",
          ]
            .filter(Boolean)
            .join(" "),
        },
        cwd: process.cwd(),
      });
      DevRepository.runningProcesses.set("next", nextProcess);

      // Track child PID in PID file so it gets killed on next startup too
      if (nextProcess.pid) {
        addPidToFile(VIBE_DEV_PID_FILE, nextProcess.pid);
      }

      const formatNextjs = createNextjsFormatter(nextPort, port);
      if (!disableProxy) {
        const rewritePort = (chunk: Buffer): void => {
          process.stdout.write(
            formatNextjs(
              chunk.toString().replaceAll(String(nextPort), String(port)),
            ),
          );
        };
        nextProcess.stdout?.on("data", rewritePort);
        nextProcess.stderr?.on("data", rewritePort);
      } else {
        nextProcess.stdout?.on("data", (chunk: Buffer) => {
          process.stdout.write(formatNextjs(chunk.toString()));
        });
        nextProcess.stderr?.on("data", (chunk: Buffer) => {
          process.stderr.write(formatNextjs(chunk.toString()));
        });
      }

      nextProcess.on("exit", (code) => {
        // Remove child PID from PID file immediately on exit
        if (nextProcess.pid) {
          removePidFromFile(VIBE_DEV_PID_FILE, nextProcess.pid);
        }
        // Free streams to allow GC
        nextProcess.stdout?.destroy();
        nextProcess.stderr?.destroy();
        DevRepository.runningProcesses.delete("next");

        if (DevRepository.shuttingDown) {
          return; // Intentional shutdown - don't restart
        }

        if (code === 0) {
          // Clean exit (e.g. intentional stop) - don't restart
          logger.info("Next.js exited cleanly");
          return;
        }

        restartCount++;
        if (restartCount > MAX_RESTARTS) {
          process.stderr.write(
            // eslint-disable-next-line i18next/no-literal-string
            `\n❌ Next.js crashed ${String(MAX_RESTARTS)} times - giving up\n`,
          );
          shutdown(1);
          return;
        }

        const backoffMs =
          RESTART_BACKOFF_MS[
            Math.min(restartCount - 1, RESTART_BACKOFF_MS.length - 1)
          ] ?? 15000;
        process.stderr.write(
          // eslint-disable-next-line i18next/no-literal-string
          `\n⚠️  Next.js exited (code ${String(code)}), restarting in ${String(backoffMs / 1000)}s… (attempt ${String(restartCount)}/${String(MAX_RESTARTS)})\n`,
        );

        // Kill anything still on the port before restarting
        DevRepository.killProcessOnPort(nextPort, logger);

        setTimeout(spawnNext, backoffMs);
      });
    };

    spawnNext();

    // Keep the process alive indefinitely
    return await new Promise<never>(() => {
      // This promise never resolves
      // The only way out is through signal handlers or MAX_RESTARTS exceeded
    });
  }

  /**
   * Start the unified task runner with filtered tasks for development
   */
  private static async startUnifiedTaskRunner(
    locale: CountryLanguage,
    logger: EndpointLogger,
    data: DevRequestOutput,
    signal: AbortSignal,
  ): Promise<void> {
    try {
      // Load the task registry
      const { taskRegistry } =
        await import("@/app/api/[locale]/system/generated/tasks-index");

      // Filter tasks for development environment
      const devTasks = DevRepository.filterTasksForDevelopment(
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
      UnifiedTaskRunnerRepository.environment = "development";

      // Start the task runner with filtered tasks
      const startResult = UnifiedTaskRunnerRepository.start(
        devTasks,
        signal,
        locale,
        logger,
        data.framework !== ServerFramework.TANSTACK,
      );

      if (startResult.success) {
        logger.debug("Unified task runner started successfully", {
          environment: "development",
          supportsTaskRunners: true,
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
  private static filterTasksForDevelopment(
    allTasks: Task[],
    data: DevRequestOutput,
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
   * Kill a process occupying the given port ONLY if its PID is in our PID file.
   * This prevents killing processes from other project instances running on the same port.
   */
  private static killProcessOnPort(port: number, logger: EndpointLogger): void {
    // Get PIDs on this port
    let pidOnPort: number | undefined;
    try {
      const output = execSync(`fuser ${port}/tcp 2>/dev/null`, {
        encoding: "utf-8",
      }).trim();
      const parsed = parseInt(output.split(/\s+/)[0] ?? "", 10);
      if (!isNaN(parsed) && parsed > 0) {
        pidOnPort = parsed;
      }
    } catch {
      // No process on port - nothing to do
      return;
    }

    if (!pidOnPort) {
      return;
    }

    // Only kill if this PID belongs to our project (recorded in our PID file)
    let ourPids: Set<number> = new Set();
    if (existsSync(VIBE_DEV_PID_FILE)) {
      try {
        ourPids = new Set(
          readFileSync(VIBE_DEV_PID_FILE, "utf-8")
            .trim()
            .split("\n")
            .map(Number)
            .filter((p) => p > 0),
        );
      } catch {
        // ignore
      }
    }

    if (!ourPids.has(pidOnPort)) {
      logger.debug(
        `Port ${port} in use by PID ${pidOnPort} (not ours - leaving it alone)`,
      );
      return;
    }

    try {
      process.kill(pidOnPort, "SIGTERM");
      logger.debug(`Killed stale process on port ${port}`);
    } catch {
      // Already dead
    }

    // Wait up to 2s for graceful shutdown, then SIGKILL
    const gracePeriod = Date.now() + 2000;
    while (Date.now() < gracePeriod) {
      try {
        execSync(`fuser ${port}/tcp 2>/dev/null`, { encoding: "utf-8" });
        execSync("sleep 0.1");
      } catch {
        return; // port released
      }
    }

    // Still alive — force kill
    try {
      process.kill(pidOnPort, "SIGKILL");
    } catch {
      // Already dead
    }

    // Wait up to 3 more seconds for port release after SIGKILL
    const deadline = Date.now() + 3000;
    while (Date.now() < deadline) {
      try {
        execSync(`fuser ${port}/tcp 2>/dev/null`, { encoding: "utf-8" });
        execSync("sleep 0.1");
      } catch {
        return;
      }
    }

    logger.warn(`Port ${port} did not free up within 5 seconds`);
  }
}
