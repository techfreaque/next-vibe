/**
 * Development Server Repository
 * Handles starting the development server with task runner and Next.js
 * Implements task system specification requirements
 */

// CLI output messages don't need internationalization

import type { ChildProcess } from "node:child_process";
import { execSync } from "node:child_process";

import { parseError } from "next-vibe/shared/utils/parse-error";

import { seedDatabase } from "@/app/api/[locale]/system/db/seed/seed-manager";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  formatActionCommand,
  formatCommand,
  formatConfig,
  formatDatabase,
  formatDuration,
  formatError,
  formatHint,
  createNextjsFormatter,
  formatSkip,
  formatStartup,
  formatTask,
  formatWarning,
} from "@/app/api/[locale]/system/unified-interface/shared/logger/formatters";
import { unifiedTaskRunnerRepository } from "@/app/api/[locale]/system/unified-interface/tasks/unified-runner/repository";
import type { Task } from "@/app/api/[locale]/system/unified-interface/tasks/unified-runner/types";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation as migrateScopedTranslation } from "../../db/migrate/i18n";
import { databaseMigrationRepository } from "../../db/migrate/repository";
import { scopedTranslation as dockerScopedTranslation } from "../../db/utils/docker-operations/i18n";
import { dockerOperationsRepository } from "../../db/utils/docker-operations/repository";
import { scopedTranslation as dbUtilsScopedTranslation } from "../../db/utils/i18n";
import { dbUtilsRepository } from "../../db/utils/repository";
import { DEV_WATCHER_TASK_NAME } from "../../unified-interface/tasks/dev-watcher/task-runner";
import {
  addPidToFile,
  cleanupPidFile,
  killPreviousInstance,
  removePidFromFile,
  VIBE_DEV_PID_FILE,
  writePidFile,
} from "../pid";
import type endpoints from "./definition";

/** Extract port number from a URL string, returns undefined if not parseable */
function portFromUrl(url: string | undefined): number | undefined {
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

type RequestType = typeof endpoints.POST.types.RequestOutput;

// Constants to avoid literal strings
const DEV_PROJECT_NAME = "vibe-dev";
const DEV_CONTAINER_NAME = "dev-postgres";
const DOCKER_VOLUME_SUFFIX = "postgres_data";
const DATABASE_TEST_QUERY = "SELECT 1";
const DATABASE_TIMEOUT_PREFIX = "Database connection timeout after";
const DATABASE_TIMEOUT_SUFFIX = "attempts";

// Funny shutdown messages - randomly picked when server stops
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
  private shuttingDown = false;

  constructor() {
    // Set up clean exit handlers for crashes only
    this.setupExitHandlers();
  }

  private setupExitHandlers(): void {
    // Swallow crashes in dev — log and continue rather than killing the whole server

    // Handle uncaught exceptions
    process.on("uncaughtException", (error) => {
      // eslint-disable-next-line i18next/no-literal-string
      process.stderr.write(
        `\n⚠️  Uncaught exception (dev server continuing): ${error.message}\n${error.stack || ""}\n`,
      );
      // Do NOT exit — dev server should survive transient errors
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
      // Do NOT exit — dev server should survive transient errors
    });
  }

  /**
   * Perform hard database reset: stop containers, delete data, restart
   */
  private async performHardDatabaseReset(
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<void> {
    const { exec } = await import("node:child_process");
    const { promisify } = await import("node:util");
    const execAsync = promisify(exec);

    // 1. Stop Docker containers
    logger.debug("Stopping Docker containers...");
    const { t: dockerT } = dockerScopedTranslation.scopedT(locale);
    const downResult = await dockerOperationsRepository.dockerComposeDown(
      logger,
      dockerT,
      "docker-compose-dev.yml",
      30000,
      DEV_PROJECT_NAME,
    );

    if (!downResult.success) {
      logger.warn("Failed to stop Docker containers, continuing anyway");
    }

    // 2. Force-remove the container (hardcoded container_name in compose
    //    means `docker compose down` may not clean it up properly)
    try {
      await execAsync(`docker rm -f ${DEV_CONTAINER_NAME} 2>/dev/null || true`);
      logger.debug("Removed dev-postgres container");
    } catch {
      logger.debug("No dev-postgres container to remove");
    }

    // 3. Delete postgres data volume
    await this.deletePostgresDataVolume(logger);

    // 4. Start Docker containers
    logger.debug("Starting Docker containers...");
    const upResult = await dockerOperationsRepository.dockerComposeUp(
      logger,
      dockerT,
      "docker-compose-dev.yml",
      60000,
      DEV_PROJECT_NAME,
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

      const volumeName = `${DEV_PROJECT_NAME}_${DOCKER_VOLUME_SUFFIX}`;
      logger.debug(`Deleting postgres data volume: ${volumeName}...`);

      try {
        // Remove the Docker volume (this is much cleaner than dealing with file permissions)
        await execAsync(`docker volume rm ${volumeName} 2>/dev/null || true`);
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
    // Derive port: explicit --port > NEXT_PUBLIC_APP_URL port > default 3000
    const port = data.port ?? portFromUrl(env.NEXT_PUBLIC_APP_URL) ?? 3000;

    this.logStartupInfo(port, logger, data);

    // Kill any previous dev instance, then write our PID
    killPreviousInstance(VIBE_DEV_PID_FILE, logger);
    writePidFile(VIBE_DEV_PID_FILE, logger);

    // Register early SIGINT/SIGTERM so Ctrl+C during setup exits immediately
    const earlyExitHandler = (): void => {
      cleanupPidFile(VIBE_DEV_PID_FILE);
      process.exit(0);
    };
    process.on("SIGINT", earlyExitHandler);
    process.on("SIGTERM", earlyExitHandler);

    // Setup database if not skipped
    const dbSetupSuccess = await this.setupDatabase(data, locale, logger);
    if (!dbSetupSuccess) {
      // Database setup failed critically, start Next.js anyway
      return await this.startNextJsAndWait(
        port,
        logger,
        earlyExitHandler,
        data.profile,
      );
    }

    // Start task runner if not skipped
    void this.startTaskRunnerIfEnabled(data, locale, logger);

    // Start Next.js and keep process alive (passes early handler so it can be replaced)
    return await this.startNextJsAndWait(
      port,
      logger,
      earlyExitHandler,
      data.profile,
    );
  }

  /**
   * Log startup information
   */
  private logStartupInfo(
    port: number,
    logger: EndpointLogger,
    data: RequestType,
  ): void {
    logger.vibe(formatStartup("Starting Development Server", "⚡"));
    log("");
    log(`  ${formatConfig("Port", port)}  ${formatHint("(--port=N)")}`);
    log(
      `  ${formatConfig("Debug", logger.isDebugEnabled ? "ON" : "OFF")}  ${formatHint(logger.isDebugEnabled ? "(remove -v or --verbose to disable)" : "(-v or --verbose to enable)")}`,
    );
    log("");

    if (data.skipDbSetup) {
      log(
        `  ${formatConfig("Database", "DISABLED")} ${formatHint("(remove --skip-db-setup to enable)")}`,
      );
    } else {
      log(
        `  ${formatConfig("Database", "ENABLED")} ${formatHint("(--skip-db-setup to disable)")}`,
      );
      log(
        `    ${formatConfig("Reset", data.dbReset || data.r ? "YES" : "NO")} ${formatHint(data.dbReset || data.r ? "(remove -r to skip)" : "(-r to reset)")}`,
      );
      log(
        `    ${formatConfig("Migrations", data.skipMigrations ? "NO" : "YES")} ${formatHint(data.skipMigrations ? "(remove --skip-migrations)" : "(--skip-migrations)")}`,
      );
      if (!data.skipMigrations) {
        log(
          `    ${formatConfig("Generation", data.skipMigrationGeneration ? "NO" : "YES")} ${formatHint(data.skipMigrationGeneration ? "(remove --skip-migration-generation)" : "(--skip-migration-generation)")}`,
        );
      }
      log(
        `    ${formatConfig("Seeding", data.skipSeeding ? "NO" : "YES")} ${formatHint(data.skipSeeding ? "(remove --skip-seeding to enable)" : "(--skip-seeding to disable)")}`,
      );
    }

    log("");
    log(
      `  ${formatConfig("Background Tasks", data.skipTaskRunner ? "DISABLED" : "ENABLED")} ${formatHint(data.skipTaskRunner ? "(remove --skip-task-runner)" : "(--skip-task-runner)")}`,
    );
    log(
      `  ${formatConfig("Code Generators", data.skipGeneratorWatcher ? "DISABLED" : "ENABLED")} ${formatHint(data.skipGeneratorWatcher ? "(remove --skip-generator-watcher)" : "(--skip-generator-watcher)")}`,
    );
    log("");
    log(
      `  ${formatHint("💡 Edit src/app/api/[locale]/system/server/dev/definition.ts to change defaults")}`,
    );
    log("");
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
      logger.vibe(formatSkip("Database setup skipped"));
      return true;
    }

    try {
      const { t: dbUtilsT } = dbUtilsScopedTranslation.scopedT(locale);
      const dockerCheckResult = await dbUtilsRepository.isDockerAvailable(
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
      const dbOperationSuccess = await this.performDatabaseOperations(
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
  private async performDatabaseOperations(
    data: RequestType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<boolean> {
    try {
      if (data.dbReset || data.r) {
        // Reset includes migrations, so we pass the migration flags
        await this.resetDatabase(locale, logger, data);
      } else {
        await this.startDatabaseWithoutReset(locale, logger);

        // Run migrations if not skipped (only when not resetting)
        if (data.skipMigrations) {
          logger.vibe(formatSkip("Migrations skipped"));
        } else {
          const { t: migrateT } = migrateScopedTranslation.scopedT(locale);
          const migrateResult = await databaseMigrationRepository.runMigrations(
            {
              generate: !data.skipMigrationGeneration,
              redo: false,
              schema: "public",
              dryRun: false,
            },
            migrateT,
            logger,
          );
          if (!migrateResult.success) {
            this.logDatabaseError(
              new Error(migrateResult.message ?? "Migration failed"),
              logger,
            );
            cleanupPidFile(VIBE_DEV_PID_FILE);
            process.exit(1);
          }
        }
      }

      // Deploy db-functions (idempotent — runs after every migration)
      const { deployDbFunctions } =
        await import("@/app/api/[locale]/system/db/db-functions/deploy");
      await deployDbFunctions(logger);

      // Seed database if not skipped
      if (data.skipSeeding) {
        logger.vibe(formatSkip("Database seeding skipped"));
      } else {
        await seedDatabase("dev", logger, locale);
      }

      return true;
    } catch (error) {
      this.logDatabaseError(error, logger);
      cleanupPidFile(VIBE_DEV_PID_FILE);
      process.exit(1);
    }
  }

  /**
   * Reset database with hard reset
   */
  private async resetDatabase(
    locale: CountryLanguage,
    logger: EndpointLogger,
    data: RequestType,
  ): Promise<void> {
    const startTime = Date.now();
    logger.debug(
      `🔄 ${formatActionCommand("Resetting database using:", "docker compose down && docker volume rm")}`,
    );
    await this.performHardDatabaseReset(logger, locale);
    const duration = Date.now() - startTime;
    logger.info(`✓  Reset completed in ${formatDuration(duration)}`);

    // Run migrations if not skipped
    if (data.skipMigrations) {
      logger.vibe(formatSkip("Migrations skipped"));
    } else {
      const { t: migrateT } = migrateScopedTranslation.scopedT(locale);
      const migrateResult = await databaseMigrationRepository.runMigrations(
        {
          generate: !data.skipMigrationGeneration,
          redo: false,
          schema: "public",
          dryRun: false,
        },
        migrateT,
        logger,
      );
      if (!migrateResult.success) {
        this.logDatabaseError(
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
  private async startDatabaseWithoutReset(
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<void> {
    const startTime = Date.now();
    logger.debug(
      `🐘 ${formatActionCommand("Starting PostgreSQL using:", "docker compose -f docker-compose-dev.yml up -d")}`,
    );
    const { t: dockerT } = dockerScopedTranslation.scopedT(locale);
    const dbStartResult = await dockerOperationsRepository.dockerComposeUp(
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
  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Error handling: Database errors can be any type (Drizzle errors, connection errors, etc), so unknown is correct before narrowing.
  private logDatabaseError(error: unknown, logger: EndpointLogger): void {
    const parsedError = parseError(error);
    logger.vibe(
      formatError(`Database operation failed: ${parsedError.message}`),
    );
    logger.vibe(`💡 Try running: ${formatCommand("vibe dev -r")}`);
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
      logger.vibe(formatSkip("Task runner disabled"));
      return;
    }

    try {
      logger.debug(formatTask("Starting task runner"));
      await this.startUnifiedTaskRunner(locale, logger, data);
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
   * Start Next.js dev server + WebSocket sidecar and wait forever
   */
  private async startNextJsAndWait(
    port: number,
    logger: EndpointLogger,
    earlyExitHandler?: () => void,
    profile = false,
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

    // Kill any stale processes on all used ports
    this.killProcessOnPort(nextPort, logger);
    this.killProcessOnPort(wsPort, logger);

    // --- Start WS server (once — outlives Next.js restarts) ---
    const wsHandle = startWebSocketServer({ port: wsPort, logger });

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
      this.shuttingDown = true;
      restoreTty();
      if (message) {
        process.stdout.write(`\n${message}\n`);
      }
      // Stop Bun WS server
      wsHandle.stop();
      // Kill Next.js child process (current one tracked in runningProcesses)
      const currentNext = this.runningProcesses.get("next");
      if (currentNext && !currentNext.killed) {
        currentNext.stdout?.unpipe();
        currentNext.stderr?.unpipe();
        currentNext.stdout?.destroy();
        currentNext.stderr?.destroy();
        currentNext.kill("SIGTERM");
      }
      // Force-kill anything still on the ports (catches stale processes)
      this.killProcessOnPort(nextPort, logger);
      this.killProcessOnPort(wsPort, logger);
      cleanupPidFile(VIBE_DEV_PID_FILE);
      process.exit(code);
    };

    // Replace early exit handler with full graceful shutdown handler
    if (earlyExitHandler) {
      process.off("SIGINT", earlyExitHandler);
      process.off("SIGTERM", earlyExitHandler);
    }
    const sigintHandler = (): void => {
      const randomMessage =
        SHUTDOWN_MESSAGES[Math.floor(Math.random() * SHUTDOWN_MESSAGES.length)];
      shutdown(0, randomMessage);
    };
    process.on("SIGINT", sigintHandler);
    process.on("SIGTERM", sigintHandler);

    logger.debug(`⚡ Next.js dev server available at http://localhost:${port}`);
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
          // Ctrl+C in raw mode — honour it
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
            this.shuttingDown = true;
            restoreTty();
            wsHandle.stop();
            const currentNext = this.runningProcesses.get("next");
            if (currentNext && !currentNext.killed) {
              currentNext.stdout?.unpipe();
              currentNext.stderr?.unpipe();
              currentNext.stdout?.destroy();
              currentNext.stderr?.destroy();
              currentNext.kill("SIGTERM");
            }
            this.killProcessOnPort(nextPort, logger);
            this.killProcessOnPort(wsPort, logger);
            cleanupPidFile(VIBE_DEV_PID_FILE);

            // Give the process a moment to flush files, then open results
            setTimeout((): void => {
              void (async (): Promise<void> => {
                const { default: open } = await import("open");
                const { existsSync } = await import("node:fs");
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
                    "⚠️  No .cpuprofile found — try running with --profile again\n",
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

    // --- Spawn Next.js with auto-restart on crash ---
    const MAX_RESTARTS = 10;
    const RESTART_BACKOFF_MS = [1000, 2000, 4000, 8000, 15000]; // exponential, capped
    let restartCount = 0;

    const spawnNext = (): void => {
      if (this.shuttingDown) {
        return;
      }

      // Drop stale reference from previous run to allow GC
      this.runningProcesses.delete("next");

      const profilingEnv = profile
        ? {
            NEXT_TURBOPACK_TRACING: "1",
            NEXT_CPU_PROF: "1",
          }
        : {};
      const nextProcess = spawn(
        "bun",
        ["run", "next", "dev", "--port", String(nextPort)],
        {
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
        },
      );
      this.runningProcesses.set("next", nextProcess);

      // Track child PID in PID file so it gets killed on next startup too
      if (nextProcess.pid) {
        addPidToFile(VIBE_DEV_PID_FILE, nextProcess.pid);
      }

      const formatNextjs = createNextjsFormatter();
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
        this.runningProcesses.delete("next");

        if (this.shuttingDown) {
          return; // Intentional shutdown — don't restart
        }

        if (code === 0) {
          // Clean exit (e.g. intentional stop) — don't restart
          logger.info("Next.js exited cleanly");
          return;
        }

        restartCount++;
        if (restartCount > MAX_RESTARTS) {
          process.stderr.write(
            // eslint-disable-next-line i18next/no-literal-string
            `\n❌ Next.js crashed ${String(MAX_RESTARTS)} times — giving up\n`,
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
        this.killProcessOnPort(nextPort, logger);

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

      // Create abort controller so task runners can be stopped on shutdown
      const controller = new AbortController();
      process.once("SIGINT", () => {
        controller.abort();
      });
      process.once("SIGTERM", () => {
        controller.abort();
      });

      // Start the task runner with filtered tasks
      const startResult = unifiedTaskRunnerRepository.start(
        devTasks,
        controller.signal,
        locale,
        logger,
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
   * Kill any process occupying the given port and wait until it's free.
   */
  private killProcessOnPort(port: number, logger: EndpointLogger): void {
    try {
      // fuser is more reliable than lsof for finding processes on a port
      execSync(`fuser -k ${port}/tcp 2>/dev/null`, { encoding: "utf-8" });
      logger.info(`Killed stale process on port ${port}`);
    } catch {
      // No process on port or kill failed — both are fine
    }

    // Wait until the port is actually released (up to 5 seconds)
    const deadline = Date.now() + 5000;
    while (Date.now() < deadline) {
      try {
        execSync(`fuser ${port}/tcp 2>/dev/null`, { encoding: "utf-8" });
        // fuser succeeded → port still occupied, keep waiting
        execSync("sleep 0.1");
      } catch {
        // fuser exited non-zero → port is free
        return;
      }
    }

    logger.warn(`Port ${port} did not free up within 5 seconds`);
  }
}

/**
 * Default repository instance
 */
export const devRepository = new DevRepositoryImpl();

// Use console.log directly to avoid timestamps for the config section
// oxlint-disable-next-line no-console
const log = (msg: string): void => console.log(msg);
