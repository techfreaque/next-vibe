/**
 * Development Server Repository
 * Handles starting the development server with task runner and Next.js
 * Implements task system specification requirements
 */

// CLI output messages don't need internationalization

import type { ChildProcess } from "node:child_process";
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeSync } from "node:fs";
import { basename, join } from "node:path";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { parseError } from "next-vibe/core/utils/parse-error";
import { DatabaseGenerateRepository } from "next-vibe/database/generate/repository";
import { closeDatabase, reopenDatabase } from "next-vibe/database/index";
import { DatabaseMigrationRepository } from "next-vibe/database/migrate/repository";
import { SeedRepository } from "next-vibe/database/seed/repository";
import { scopedTranslation as dockerScopedTranslation } from "next-vibe/database/utils/docker-operations/i18n";
import { DockerOperationsRepository } from "next-vibe/database/utils/docker-operations/repository";
import { scopedTranslation as dbUtilsScopedTranslation } from "next-vibe/database/utils/i18n";
import { DbUtilsRepository } from "next-vibe/database/utils/repository";
import { formatLogPrefix } from "next-vibe/logger/create-logger";
import {
  appendRawToServerLog,
  truncateClientLogs,
  truncateServerLog,
  writeServerLogOfflineHint,
} from "next-vibe/logger/file";
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
} from "next-vibe/logger/formatters";
import type { EndpointLogger, LoggerMetadata } from "next-vibe/logger/types";
import { DEV_WATCHER_TASK_NAME } from "next-vibe/tasks/dev-watcher/constants";
import { UnifiedTaskRunnerRepository } from "next-vibe/tasks/unified-runner/repository";
import type { Task } from "next-vibe/tasks/unified-runner/types";

import { env } from "@/_old/config/env";

import { ServerFramework } from "../enum";
import {
  addPidToFile,
  ATLAS_PID_FILE,
  cleanupPidFile,
  getPidOnPort,
  HERMES_DEV_PID_FILE,
  killPreviousInstance,
  LOCAL_BASE_PORT,
  removePidFromFile,
  writePidFile,
} from "../pid";
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
    appendRawToServerLog(msg);
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
  /** Active PID file — set by execute() to support vibe --hermes dev (HERMES_DEV_PID_FILE) */
  private static activePidFile: string = ATLAS_PID_FILE;

  /**
   * Perform hard database reset: stop containers, delete data, restart
   */
  private static async performHardDatabaseReset(
    logger: EndpointLogger,
    locale: CountryLanguage,
    isPreview: boolean,
  ): Promise<void> {
    const { exec } = await import("node:child_process");
    const { promisify } = await import("node:util");
    const execAsync = promisify(exec);

    const composeFile = isPreview
      ? DevRepository.PREVIEW_COMPOSE_FILE
      : DevRepository.ATLAS_COMPOSE_FILE;
    const projectName = isPreview
      ? DevRepository.PREVIEW_PROJECT_NAME
      : DevRepository.ATLAS_PROJECT_NAME;
    const containerName = isPreview
      ? `${DevRepository.projectSlug}-hermes-postgres`
      : `${DevRepository.projectSlug}-atlas-postgres`;

    // 0. Close any open DB pool connections so docker compose down doesn't
    //    produce "Connection terminated unexpectedly" errors.
    await closeDatabase(logger);

    // 1. Stop Docker containers
    logger.debug("Stopping Docker containers...");
    const { t: dockerT } = dockerScopedTranslation.scopedT(locale);
    const downResult = await DockerOperationsRepository.dockerComposeDown(
      logger,
      dockerT,
      composeFile,
      30000,
      projectName,
    );

    if (!downResult.success) {
      logger.warn("Failed to stop Docker containers, continuing anyway");
    }

    // 2. Force-remove the container (hardcoded container_name in compose
    //    means `docker compose down` may not clean it up properly)
    try {
      await execAsync(`docker rm -f ${containerName}`, { timeout: 10000 });
      logger.debug(`Removed ${containerName} container`);
    } catch {
      logger.debug(`No ${containerName} container to remove`);
    }

    // 3. Delete postgres data volume
    await DevRepository.deletePostgresDataVolume(logger, isPreview);

    // 4. Start Docker containers
    logger.debug("Starting Docker containers...");
    const upResult = await DockerOperationsRepository.dockerComposeUp(
      logger,
      dockerT,
      composeFile,
      60000,
      projectName,
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

    // 6. Reopen the shared pool/db client (closed in step 0 above)
    reopenDatabase();
  }

  /**
   * Delete postgres data volume for clean reset
   */
  private static async deletePostgresDataVolume(
    logger: EndpointLogger,
    isPreview = false,
  ): Promise<void> {
    try {
      const { exec } = await import("node:child_process");
      const { promisify } = await import("node:util");
      const execAsync = promisify(exec);

      const slug = DevRepository.projectSlug;
      const volumeName = isPreview
        ? `${slug}-hermes_hermes_data`
        : `${slug}-atlas_atlas_data`;
      logger.debug(`Deleting postgres data volume: ${volumeName}...`);

      try {
        // Remove the Docker volume (this is much cleaner than dealing with file permissions)
        await execAsync(`docker volume rm ${volumeName}`, { timeout: 10000 });
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

  private static readonly ATLAS_COMPOSE_FILE = "docker-compose-dev.yml";
  private static readonly PREVIEW_COMPOSE_FILE = "docker-compose.preview.yml";

  private static get projectSlug(): string {
    return basename(process.env["PROJECT_ROOT"] ?? process.cwd());
  }

  private static get ATLAS_PROJECT_NAME(): string {
    return `${DevRepository.projectSlug}-atlas`;
  }

  private static get PREVIEW_PROJECT_NAME(): string {
    return `${DevRepository.projectSlug}-hermes`;
  }

  static async execute(
    data: DevRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<never> {
    // vibe --hermes dev uses IS_PREVIEW_MODE=true to signal it targets the preview DB
    const isLocalDev = process.env["IS_PREVIEW_MODE"] === "true";
    DevRepository.activePidFile = isLocalDev
      ? HERMES_DEV_PID_FILE
      : ATLAS_PID_FILE;

    // Truncate log files at session start (VIBE_LOG_PATH controls whether active)
    void truncateServerLog();
    void truncateClientLogs();
    // Guaranteed last-resort offline hint - process.on("exit") always fires, even on crash.
    // Skip if we're being replaced: the new instance already owns (or deleted) the PID file.
    process.on("exit", () => {
      const pidFile = DevRepository.activePidFile;
      if (pidFile) {
        try {
          if (!existsSync(pidFile)) {
            return; // PID file gone — new instance cleaned up ours before writing its own
          }
          const firstLine =
            readFileSync(pidFile, "utf-8").trim().split("\n")[0] ?? "";
          const ownerPid = parseInt(firstLine, 10);
          if (!isNaN(ownerPid) && ownerPid !== process.pid) {
            return; // New instance took ownership — don't pollute its log
          }
        } catch {
          // Ignore read errors; fall through to write the hint
        }
      }
      writeServerLogOfflineHint();
    });

    // Capture native fd-2 writes (Bun internals, worker threads) into both the
    // terminal and the log file.
    //
    // Design:
    //   - fd 2 is redirected to a pipe whose read end feeds a `tee` subprocess.
    //   - tee writes every byte to both the original terminal fd and the log file.
    //   - Native/worker writes to fd 2 automatically flow through tee → both outputs.
    //   - console.warn/error is overridden to bypass the pipe and write directly to
    //     termFd only — logger already calls onFileLog for the file side, so going
    //     through tee would double-write to the log file.
    //   - process.stderr.write → termFd only for the same reason.
    if (process.env["VIBE_LOG_TARGET"] === "file") {
      try {
        const logPath = process.env["VIBE_LOG_FILE"] ?? ".atlas.log";
        const logDir = process.env["VIBE_LOG_PATH"];
        if (logDir) {
          const { isAbsolute, join: pathJoin } = await import("node:path");
          const { spawn } = await import("node:child_process");
          const absDir = isAbsolute(logDir)
            ? logDir
            : pathJoin(process.env["PROJECT_ROOT"] ?? process.cwd(), logDir);
          if (!existsSync(absDir)) {
            mkdirSync(absDir, { recursive: true });
          }
          const { dlopen, ptr } = await import("bun:ffi");
          const lib = dlopen("libc.so.6", {
            dup: { args: ["i32" as const], returns: "i32" as const },
            dup2: {
              args: ["i32" as const, "i32" as const],
              returns: "i32" as const,
            },
            pipe: { args: ["ptr" as const], returns: "i32" as const },
          });

          // Save a copy of the original terminal fd before we touch fd 2.
          const termFd = lib.symbols.dup(2);
          const fullLogPath = pathJoin(absDir, logPath);

          // Create an explicit OS pipe and spawn `tee -a <logfile>` reading
          // from its read end, writing to termFd (terminal) and the log file.
          // Then point fd 2 at the pipe's write end so native runtime writes
          // ([Bun.serve] timeouts, Bun error reports, worker output) flow
          // through tee into BOTH sinks.
          //
          // Why an explicit libc pipe(): the previous approach spawned tee
          // with stdio "pipe" and read `teeProc.stdin.fd` — but Bun's
          // child_process streams expose no .fd, so pipeWriteFd was always -1
          // and the dup2 silently never happened. fd 2 stayed on the
          // terminal, and every native stderr write was console-only —
          // the file log was missing [Bun.serve]/ECONNRESET lines entirely.
          const pipeFds = new Int32Array(2);
          if (lib.symbols.pipe(ptr(pipeFds)) === 0) {
            spawn("tee", ["-a", fullLogPath], {
              stdio: [pipeFds[0]!, termFd, "ignore"],
            });
            lib.symbols.dup2(pipeFds[1]!, 2);
          }

          // Logger calls console.warn/error then separately calls onFileLog.
          // If we let console.* go through fd 2 → tee → file, onFileLog would
          // add a second copy. So override to write only to termFd (terminal),
          // trusting logger's onFileLog for the file side.
          const toTerminal = (args: LoggerMetadata[]): void => {
            const text = args
              .map((a) =>
                typeof a === "string"
                  ? a
                  : a instanceof Error
                    ? `${a.message}${a.stack ? `\n${a.stack}` : ""}`
                    : JSON.stringify(a, null, 2),
              )
              .join(" ");
            writeSync(termFd, `${text}\n`);
          };
          // eslint-disable-next-line no-console
          console.error = (...args: LoggerMetadata[]): void => {
            toTerminal(args);
          };
          // eslint-disable-next-line no-console
          console.warn = (...args: LoggerMetadata[]): void => {
            toTerminal(args);
          };

          // JS-layer process.stderr.write → terminal only.
          // Logger handles its own file writes; this prevents double-writing.
          process.stderr.write = (
            chunk: string | Uint8Array,
            encodingOrCb?: BufferEncoding | ((err?: Error | null) => void),
            cb?: (err?: Error | null) => void,
          ): boolean => {
            writeSync(
              termFd,
              typeof chunk === "string"
                ? chunk
                : Buffer.from(chunk).toString("utf-8"),
            );
            const done = typeof encodingOrCb === "function" ? encodingOrCb : cb;
            done?.(undefined);
            return true;
          };
        }
      } catch {
        // bun:ffi or tee unavailable — stderr capture skipped
      }
    }

    // Derive port: explicit --port > LOCAL_BASE_PORT for Hermes dev > NEXT_PUBLIC_APP_URL port > default 3000
    const port =
      data.port ??
      (isLocalDev ? LOCAL_BASE_PORT : undefined) ??
      DevRepository.portFromUrl(env.NEXT_PUBLIC_APP_URL) ??
      3000;

    // Patch NEXT_PUBLIC_APP_URL to reflect the actual port.
    // This ensures runtime env reads (and all child processes) see the correct URL.
    DevRepository.patchPublicUrlPort(port);

    DevRepository.logStartupInfo(port, logger, data);

    // Kill any previous dev instance, then write our PID (including resolved port)
    killPreviousInstance(DevRepository.activePidFile, logger);
    writePidFile(DevRepository.activePidFile, logger, [], port);

    // Register early SIGINT/SIGTERM so Ctrl+C during setup exits immediately
    const earlyExitHandler = (): void => {
      cleanupPidFile(DevRepository.activePidFile);
      process.exit(0);
    };
    process.on("SIGINT", earlyExitHandler);
    process.on("SIGTERM", earlyExitHandler);

    // Catch unhandled errors so crashes (including in-process Vite/Nitro worker threads)
    // are always written to the log file, not just terminal stderr.
    process.on("uncaughtException", (err) => {
      const mem = process.memoryUsage();
      logger.error("[Dev] Uncaught exception - shutting down", {
        error: err.message,
        stack: err.stack,
        uptime: Math.floor(process.uptime()),
        heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
        rssMb: Math.round(mem.rss / 1024 / 1024),
      });
      cleanupPidFile(DevRepository.activePidFile);
      writeServerLogOfflineHint();
      process.exit(1);
    });
    process.on("unhandledRejection", (reason) => {
      const mem = process.memoryUsage();
      const message = reason instanceof Error ? reason.message : String(reason);
      const stack = reason instanceof Error ? reason.stack : undefined;
      logger.error("[Dev] Unhandled promise rejection", {
        error: message,
        stack,
        uptime: Math.floor(process.uptime()),
        heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
        rssMb: Math.round(mem.rss / 1024 / 1024),
      });
    });

    // Setup database if not skipped
    const dbSetupSuccess = await DevRepository.setupDatabase(
      data,
      locale,
      logger,
      isLocalDev,
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
    DevRepository.log(
      `${formatLogPrefix()}${formatStartup("Starting Development Server", "⚡")}`,
    );
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
      `  ${formatHint("💡 Edit src/vibe/server/dev/definition.ts to change defaults")}`,
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
    isPreview: boolean,
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
        isPreview,
      );

      if (!dbOperationSuccess) {
        return false; // Critical failure, start Next.js immediately
      }

      logger.info(formatDatabase("Database ready", "🗄️ "));

      // Re-run pull-on-connect for all active connections (and re-open reverse-ws
      // sockets) so cross-instance sync converges after a server restart without
      // requiring the user to reconnect manually.
      void DevRepository.openReverseWsConnectors(logger);

      return true;
    } catch (error) {
      const parsedError = parseError(error);
      logger.vibe(formatError("Database setup failed (continuing anyway)"));
      logger.error("Database setup error details", parsedError);
      logger.vibe(`💡 Error: ${parsedError.message}`);
      return true;
    }
  }

  private static async openReverseWsConnectors(
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      const { RemoteConnectionRepository } =
        await import("next-vibe/remote-connection/repository");
      const { openConnection } = await import("next-vibe/realtime/connector");
      const connections =
        await RemoteConnectionRepository.getAllActiveConnectionsForSync();
      let opened = 0;
      for (const conn of connections) {
        // openConnection runs the ONE HTTP pull-on-connect for EVERY transport
        // and opens a persistent socket only for a reverse-ws leg — so every
        // active connection re-syncs on boot, direct-http included, and only
        // reverse-ws legs get a socket.
        openConnection({
          id: conn.id,
          instanceId: conn.instanceId,
          remoteUrl: conn.remoteUrl,
          token: conn.token,
          leadId: conn.leadId,
          userId: conn.userId,
          remoteUserId: conn.remoteUserId,
          capabilitiesVersion: conn.capabilitiesVersion,
          sentCapabilitiesVersion: conn.sentCapabilitiesVersion,
          syncScope: conn.syncScope,
          syncCursors: conn.syncCursors,
          pushCursors: null,
          transportMode: conn.transportMode,
          remoteTransportMode: conn.remoteTransportMode,
        });
        opened++;
      }
      if (opened > 0) {
        logger.info(
          `[Connector] Re-synced ${String(opened)} connection(s) on startup`,
        );
      }
    } catch (err) {
      logger.warn("[Connector] Failed to auto-open reverse-ws connectors", {
        error: err instanceof Error ? err.message : String(err),
      });
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
    isPreview: boolean,
  ): Promise<boolean> {
    try {
      if (data.dbReset || data.r) {
        if (isPreview) {
          logger.vibe(
            formatError(
              "Preview DB reset refused — resetting the preview database requires explicit user consent. Remove -r or run without --hermes to reset Atlas instead.",
            ),
          );
          cleanupPidFile(DevRepository.activePidFile);
          process.exit(1);
        }
        // Reset includes migrations, so we pass the migration flags
        await DevRepository.resetDatabase(locale, logger, data);
      } else {
        await DevRepository.startDatabaseWithoutReset(
          locale,
          logger,
          isPreview,
        );

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
              cleanupPidFile(DevRepository.activePidFile);
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
            cleanupPidFile(DevRepository.activePidFile);
            process.exit(1);
          }
        }
      }

      // Deploy db-functions (idempotent - runs after every migration)
      const { deployDbFunctions } =
        await import("next-vibe/database/db-functions/deploy");
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
      cleanupPidFile(DevRepository.activePidFile);
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
    isPreview = false,
  ): Promise<void> {
    const startTime = Date.now();
    logger.debug(
      `🔄 ${formatActionCommand("Resetting database using:", "docker compose down && docker volume rm")}`,
    );
    await DevRepository.performHardDatabaseReset(logger, locale, isPreview);
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
          cleanupPidFile(DevRepository.activePidFile);
          process.exit(1);
        }
      }
      const migrateResult = await DatabaseMigrationRepository.migrate(logger);
      if (!migrateResult.success) {
        DevRepository.logDatabaseError(
          new Error(migrateResult.message ?? "Migration failed"),
          logger,
        );
        cleanupPidFile(DevRepository.activePidFile);
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
    isPreview = false,
  ): Promise<void> {
    const composeFile = isPreview
      ? DevRepository.PREVIEW_COMPOSE_FILE
      : DevRepository.ATLAS_COMPOSE_FILE;
    const projectName = isPreview
      ? DevRepository.PREVIEW_PROJECT_NAME
      : DevRepository.ATLAS_PROJECT_NAME;

    const startTime = Date.now();
    logger.debug(
      `🐘 ${formatActionCommand("Starting PostgreSQL using:", `docker compose -f ${composeFile} up -d`)}`,
    );
    const { t: dockerT } = dockerScopedTranslation.scopedT(locale);
    const dbStartResult = await DockerOperationsRepository.dockerComposeUp(
      logger,
      dockerT,
      composeFile,
      60000,
      projectName,
    );

    if (!dbStartResult.success) {
      logger.error("Failed to start database", {
        error: dbStartResult.message,
      });
      logger.vibe(formatError("Database startup failed"));
      logger.vibe(
        `   Try: ${formatCommand(`docker compose -f ${composeFile} up -d`)}`,
      );
      // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- CLI fatal error requires throw to halt execution
      throw new Error("Failed to start database");
    }

    const duration = Date.now() - startTime;
    logger.info(
      formatDatabase(
        `${formatActionCommand("Started PostgreSQL using:", `docker compose -f ${composeFile} up -d`)} in ${formatDuration(duration)}`,
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

    // Save tty state now (before anything touches it) so we can restore on exit.
    // stty is POSIX-only; skip on Windows where it doesn't exist.
    // Guard with [ -e /dev/tty ] first: when there is no controlling terminal
    // (e.g. nohup / setsid / CI), the shell itself prints an error to stderr
    // when it tries to open /dev/tty as an input redirect, even with 2>/dev/null.
    let savedTtyState: string | null = null;
    if (process.platform !== "win32") {
      try {
        savedTtyState =
          execSync("[ -e /dev/tty ] && stty -g </dev/tty 2>/dev/null || true", {
            shell: "/bin/sh",
          })
            .toString()
            .trim() || null;
      } catch {
        /* not a tty */
      }
    }

    const { env: serverEnv } = await import("@/_old/config/env");
    const disableProxy = serverEnv.VIBE_DISABLE_PROXY;

    // Import WS module to get NEXT_PORT_OFFSET
    const { startWebSocketServer, NEXT_PORT_OFFSET } =
      await import("next-vibe/realtime/server");

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
      if (process.platform === "win32") {
        return;
      }
      try {
        if (savedTtyState) {
          execSync(
            `[ -e /dev/tty ] && stty ${savedTtyState} </dev/tty 2>/dev/null || true`,
            { shell: "/bin/sh" },
          );
        }
      } catch {
        /* not a tty */
      }
    };

    let shutdownCalled = false;
    const shutdown = (code: number, message?: string): void => {
      if (shutdownCalled) {
        return;
      }
      shutdownCalled = true;
      DevRepository.shuttingDown = true;
      restoreTty();
      if (message) {
        process.stdout.write(`\n${message}\n`);
      }
      // Signal task runners to stop cleanly
      shutdownController?.abort();
      // Stop Bun WS server (may be undefined if still in Vite startup for TanStack mode)
      wsHandle?.stop();
      // Send SIGINT to Next.js so it does its own graceful cleanup (same signal as Ctrl+C).
      // The child may have already received SIGINT from the OS (same process group) - that's fine.
      const currentNext = DevRepository.runningProcesses.get("next");
      if (currentNext && !currentNext.killed) {
        currentNext.stdout?.unpipe();
        currentNext.stderr?.unpipe();
        currentNext.stdout?.destroy();
        currentNext.stderr?.destroy();
        currentNext.kill("SIGINT");
      }
      // Keep PID file alive until the process is about to exit so the next
      // `vibe dev` can identify us as the owner of ports 3000/3100 and kill us.
      // cleanupPidFile is called just before each process.exit() below.
      if (viteClose) {
        const timer = setTimeout(() => {
          cleanupPidFile(DevRepository.activePidFile);
          process.exit(code);
        }, 2000);
        void viteClose()
          .catch(() => {
            /* ignore vite close errors */
          })
          .finally(() => {
            clearTimeout(timer);
            cleanupPidFile(DevRepository.activePidFile);
            process.exit(code);
          });
      } else if (currentNext && !currentNext.killed) {
        // Wait for Next.js to exit before we do — otherwise it becomes an orphan
        // holding port 3100, causing "port already in use" on the next `vibe dev`.
        const exitTimer = setTimeout(() => {
          cleanupPidFile(DevRepository.activePidFile);
          process.exit(code);
        }, 5000);
        currentNext.once("exit", () => {
          clearTimeout(exitTimer);
          cleanupPidFile(DevRepository.activePidFile);
          setImmediate(() => process.exit(code));
        });
      } else {
        cleanupPidFile(DevRepository.activePidFile);
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
            cleanupPidFile(DevRepository.activePidFile);

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
        await import("next-vibe/tooling/builder/repository/vite-compiler");
      const { ViteBuildTypeEnum } =
        await import("next-vibe/tooling/builder/enum");
      const { configLoader } =
        await import("next-vibe/tooling/builder/repository/config-loader");
      const { scopedTranslation: builderScopedTranslation } =
        await import("next-vibe/tooling/builder/i18n");
      const { defaultLocale } = await import("next-vibe/core/i18n/core/config");
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
      const routesDir = join(
        process.cwd(),
        "src/generated/app-tanstack/routes",
      );
      if (!existsSync(routesDir)) {
        mkdirSync(routesDir, { recursive: true });
      }

      // TanStack Vite runs on nextPort (internal); WS proxy on wsPort forwards to it.
      // Pass wsPort as publicPort so Vite's HMR client points to the proxy, not the internal port.
      // IMPORTANT: Start Vite BEFORE the proxy so early browser requests don't interfere with
      // Nitro's startup (requests arriving on the proxy while Vite is still initializing can
      // cause Nitro to hang mid-startup, resulting in the server never becoming ready).
      // Mutable ref so the restart plugin can update the close fn after each restart.
      // The shutdown handler always calls the current server's close, not the initial one.
      const viteCloseRef: { fn: (() => Promise<void>) | undefined } = {
        fn: undefined,
      };
      const devResult = await viteCompiler.startTanstackDevServer(
        tanstackEntry,
        nextPort,
        disableProxy ? undefined : wsPort,
        viteCloseRef,
      );
      if (!devResult.success) {
        logger.error(devResult.message ?? "TanStack Start dev server failed");
        process.exit(1);
      }
      viteClose = (): Promise<void> => viteCloseRef.fn?.() ?? Promise.resolve();

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

    // --- Spawn Next.js ---
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
      DevRepository.runningProcesses.set("next", nextProcess);

      // Track child PID in PID file so it gets killed on next startup too
      if (nextProcess.pid) {
        addPidToFile(DevRepository.activePidFile, nextProcess.pid);
      }

      const formatNextjs = createNextjsFormatter(nextPort, port);
      if (!disableProxy) {
        const rewritePort = (chunk: Buffer): void => {
          const formatted = formatNextjs(
            chunk.toString().replaceAll(String(nextPort), String(port)),
          );
          process.stdout.write(formatted);
          void appendRawToServerLog(formatted);
        };
        nextProcess.stdout?.on("data", rewritePort);
        nextProcess.stderr?.on("data", rewritePort);
      } else {
        nextProcess.stdout?.on("data", (chunk: Buffer) => {
          const formatted = formatNextjs(chunk.toString());
          process.stdout.write(formatted);
          void appendRawToServerLog(formatted);
        });
        nextProcess.stderr?.on("data", (chunk: Buffer) => {
          const formatted = formatNextjs(chunk.toString());
          process.stderr.write(formatted);
          void appendRawToServerLog(formatted);
        });
      }

      nextProcess.on("exit", (code) => {
        // Remove child PID from PID file immediately on exit
        if (nextProcess.pid) {
          removePidFromFile(DevRepository.activePidFile, nextProcess.pid);
        }
        // Free streams to allow GC
        nextProcess.stdout?.destroy();
        nextProcess.stderr?.destroy();
        DevRepository.runningProcesses.delete("next");

        if (DevRepository.shuttingDown) {
          return; // Intentional shutdown
        }

        if (code === 0) {
          logger.info("Next.js exited cleanly");
          shutdown(0);
          return;
        }

        process.stderr.write(
          // eslint-disable-next-line i18next/no-literal-string
          `\n❌ Next.js exited (code ${String(code)})\n`,
        );
        shutdown(1);
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
      const { taskRegistry } = await import("@/generated/tasks/index");

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
    const pidOnPort = getPidOnPort(port);
    if (!pidOnPort) {
      return;
    }

    // Only kill if this PID belongs to our project (recorded in our PID file)
    let ourPids: Set<number> = new Set();
    if (existsSync(DevRepository.activePidFile)) {
      try {
        ourPids = new Set(
          readFileSync(DevRepository.activePidFile, "utf-8")
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
      if (getPidOnPort(port) === undefined) {
        return; // port released
      }
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100);
    }

    // Still alive - force kill
    try {
      process.kill(pidOnPort, "SIGKILL");
    } catch {
      // Already dead
    }

    // Wait up to 3 more seconds for port release after SIGKILL
    const deadline = Date.now() + 3000;
    while (Date.now() < deadline) {
      if (getPidOnPort(port) === undefined) {
        return;
      }
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100);
    }

    logger.warn(`Port ${port} did not free up within 5 seconds`);
  }
}
