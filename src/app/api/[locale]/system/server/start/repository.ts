/**
 * Server Start Repository
 * Handles production server startup operations with parallel task runner and Next.js server startup
 * Implements task system specification requirements for production environment
 */

// CLI output messages don't need internationalization
// Process environment access is required for server configuration

import type { ChildProcess } from "node:child_process";
import { execSync, spawn } from "node:child_process";

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  createNextjsFormatter,
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
import {
  truncateClientLogs,
  truncateStartLog,
  writeStartLogOfflineHint,
} from "@/app/api/[locale]/system/unified-interface/shared/logger/file-logger";
import type { WebSocketServerHandle } from "@/app/api/[locale]/system/unified-interface/websocket/server";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation as dockerOperationsScopedTranslation } from "../../db/utils/docker-operations/i18n";
import { scopedTranslation as dbUtilsScopedTranslation } from "../../db/utils/i18n";
import { ServerFramework } from "../enum";
import {
  addPidToFile,
  cleanupPidFile,
  isPortOwnedByUs,
  killPreviousInstance,
  removePidFromFile,
  VIBE_START_PID_FILE,
  writePidFile,
} from "../pid";
import type {
  ServerStartRequestOutput,
  ServerStartResponseOutput,
} from "./definition";
import type { ServerStartT } from "./i18n";
import { scopedTranslation as serverStartScopedTranslation } from "./i18n";

/**
 * Server Start Repository
 */
/** Restart backoff delays in ms (doubles each attempt, capped at 30s) */
const NEXT_RESTART_DELAYS = [2000, 4000, 8000, 16000, 30000];

export class ServerStartRepository {
  private static taskRunnerStarted = false;
  private static nextServerProcess: ChildProcess | null = null;
  private static wsServerHandle: WebSocketServerHandle | null = null;
  private static runningProcesses: Map<string, ChildProcess> = new Map();
  /** Set to true when we intentionally stop Next.js (shutdown / SIGUSR1) - suppresses auto-restart */
  private static nextServerShuttingDown = false;
  /** Set to true during SIGUSR1-triggered restart to suppress the exit→restart handler */
  private static nextServerRestarting = false;
  private static nextRestartCount = 0;

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

  /** Mask credentials in a database URL: postgres://u***:p***@host:5432/db */
  private static maskDatabaseUrl(url: string | undefined): string {
    if (!url) {
      return "(not set)";
    }
    try {
      const parsed = new URL(url);
      const maskedUser = parsed.username
        ? `${parsed.username[0]}${"*".repeat(Math.max(2, parsed.username.length - 1))}`
        : "";
      const maskedPass = parsed.password
        ? `${parsed.password[0]}${"*".repeat(Math.max(2, parsed.password.length - 1))}`
        : "";
      const credentials =
        maskedUser && maskedPass
          ? `${maskedUser}:${maskedPass}@`
          : maskedUser
            ? `${maskedUser}@`
            : "";
      return `${parsed.protocol}//${credentials}${parsed.host}${parsed.pathname}${parsed.search}`;
    } catch {
      return "(invalid URL)";
    }
  }

  private static log(msg: string): void {
    // eslint-disable-next-line no-console
    console.log(msg);
  }

  private static logStartupInfo(
    port: number,
    logger: EndpointLogger,
    data: ServerStartRequestOutput,
    runDb: boolean,
    runTasks: boolean,
    runSeed: boolean,
    runNext: boolean,
  ): void {
    const currentEnv = process.env["NODE_ENV"] || "production";
    const mode = data.mode ?? "all";
    logger.vibe(formatStartup("Starting Production Server", "🚀"));
    ServerStartRepository.log("");
    ServerStartRepository.log(
      `  ${formatConfig("Port", port)}  ${formatHint("(--port=N)")}`,
    );
    ServerStartRepository.log(`  ${formatConfig("Env", currentEnv)}`);
    ServerStartRepository.log(
      `  ${formatConfig("Mode", mode)}  ${formatHint("(--mode=all|web|tasks)")}`,
    );
    ServerStartRepository.log(
      `  ${formatConfig("Framework", data.framework === ServerFramework.TANSTACK ? "TanStack/Vite" : "Next.js")}  ${formatHint("(--framework=next|tanstack)")}`,
    );
    ServerStartRepository.log("");
    if (runDb) {
      ServerStartRepository.log(
        `  ${formatConfig("Database", "ENABLED")}  ${formatHint(`(${ServerStartRepository.maskDatabaseUrl(process.env["DATABASE_URL"])})`)}`,
      );
      ServerStartRepository.log(`    ${formatConfig("Migrations", "YES")}`);
      ServerStartRepository.log(
        `    ${formatConfig("Seeding", runSeed ? "YES" : "NO")}`,
      );
    } else {
      ServerStartRepository.log(
        `  ${formatConfig("Database", "DISABLED")}  ${formatHint(`(--mode=${mode})`)}`,
      );
    }
    ServerStartRepository.log(
      `  ${formatConfig("Task Runner", runTasks ? "ENABLED" : "DISABLED")}`,
    );
    ServerStartRepository.log(
      `  ${formatConfig("Next.js", runNext ? "ENABLED" : "DISABLED")}`,
    );
    ServerStartRepository.log("");
  }

  private static async setupDatabase(
    locale: CountryLanguage,
    logger: EndpointLogger,
    runSeed: boolean,
  ): Promise<void> {
    try {
      const { t: dbUtilsT } = dbUtilsScopedTranslation.scopedT(locale);
      const { DbUtilsRepository } = await import("../../db/utils/repository");
      const dockerCheckResult = await DbUtilsRepository.isDockerAvailable(
        dbUtilsT,
        logger,
      );

      if (!dockerCheckResult.success || !dockerCheckResult.data) {
        logger.vibe(
          formatWarning("Docker unavailable (continuing without managed DB)"),
        );
      } else {
        const dbStart = Date.now();
        const { DockerOperationsRepository } =
          await import("../../db/utils/docker-operations/repository");
        const { t: dockerOpsT } =
          dockerOperationsScopedTranslation.scopedT(locale);
        const dbStartResult = await DockerOperationsRepository.dockerComposeUp(
          logger,
          dockerOpsT,
          "docker-compose.preview.yml",
          60000,
          "vibe-preview",
        );

        if (dbStartResult.success) {
          logger.info(
            formatDatabase(
              `Started PostgreSQL using: 'docker-compose.preview.yml' (port ${process.env["PREVIEW_DB_PORT"] || "5433"}) in ${formatDuration(Date.now() - dbStart)}`,
              "🐘",
            ),
          );
        } else {
          logger.vibe(formatWarning("PostgreSQL start failed, continuing"));
          logger.warn("Failed to start preview postgres", {
            error: dbStartResult.message,
          });
        }

        await ServerStartRepository.waitForDatabaseConnection(logger);
      }

      // Run migrations
      const { DatabaseMigrationRepository } =
        await import("../../db/migrate/repository");
      const migrateResult = await DatabaseMigrationRepository.migrate(logger);
      if (!migrateResult.success) {
        logger.vibe(
          formatError(
            `Migration failed: ${migrateResult.message ?? "unknown error"}`,
          ),
        );
        logger.error("Migration failed during start", {
          error: migrateResult.message,
        });
      }

      // Deploy db-functions (idempotent - runs after every migration)
      const { deployDbFunctions } =
        await import("@/app/api/[locale]/system/db/db-functions/deploy");
      await deployDbFunctions(logger);

      // Seed database if enabled
      if (runSeed) {
        const { SeedRepository } =
          await import("@/app/api/[locale]/system/db/seed/repository");
        await SeedRepository.seed("prod", logger);
      } else {
        logger.vibe(formatSkip("Database seeding skipped"));
      }

      logger.info(formatDatabase("Database ready", "🗄️ "));
    } catch (error) {
      const parsedError = parseError(error);
      logger.vibe(formatError("Database setup failed (continuing anyway)"));
      logger.error("Database setup error details", parsedError);
    }
  }

  private static async startTaskRunnerIfEnabled(
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    skipTanstack: boolean,
  ): Promise<void> {
    try {
      logger.debug(formatTask("Starting task runner"));
      const { UnifiedTaskRunnerRepository } =
        await import("../../unified-interface/tasks/unified-runner/repository");

      UnifiedTaskRunnerRepository.environment = "production";

      // manageRunner("start") blocks forever - must NOT await
      void UnifiedTaskRunnerRepository.manageRunner(
        { action: "start", taskFilter: "cron", dryRun: false },
        user,
        locale,
        logger,
        skipTanstack,
      ).catch((catchError) => {
        logger.error("Task runner exited unexpectedly", {
          error: parseError(catchError).message,
        });
      });

      // Poll until running or timeout
      const pollStart = Date.now();
      const POLL_TIMEOUT_MS = 10_000;
      const POLL_INTERVAL_MS = 200;
      while (
        !UnifiedTaskRunnerRepository.isRunning &&
        Date.now() - pollStart < POLL_TIMEOUT_MS
      ) {
        await new Promise<void>((resolve) => {
          setTimeout(resolve, POLL_INTERVAL_MS);
        });
      }

      const status = UnifiedTaskRunnerRepository.getStatus();
      if (status.running) {
        ServerStartRepository.taskRunnerStarted = true;
        logger.debug(formatTask("Task runner started"));
      } else {
        logger.vibe(
          formatWarning("Task runner startup failed (continuing anyway)"),
        );
        logger.error("Task runner did not reach running state", {});
      }
    } catch (error) {
      const parsedError = parseError(error);
      logger.vibe(
        formatWarning("Task runner startup failed (continuing anyway)"),
      );
      logger.error("Task runner startup error details", parsedError);
    }
  }

  static async startServer(
    data: ServerStartRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ServerStartResponseOutput>> {
    const { t } = serverStartScopedTranslation.scopedT(locale);

    // Derive port: explicit --port > NEXT_PUBLIC_APP_URL port > default 3000
    const port =
      data.port ??
      ServerStartRepository.portFromUrl(env.NEXT_PUBLIC_APP_URL) ??
      3000;

    // Patch NEXT_PUBLIC_APP_URL to reflect the actual port so child processes see the right URL.
    ServerStartRepository.patchPublicUrlPort(port);

    // Mode-based process splitting: "all" (default), "web", "tasks"
    const mode = data.mode ?? "all";
    const runDb = data.dbSetup && (mode === "all" || mode === "tasks");
    const runTasks = data.taskRunner && (mode === "all" || mode === "tasks");
    const runSeed = data.seed && (mode === "all" || mode === "tasks");
    const runNext = data.nextServer && (mode === "all" || mode === "web");

    // Print config summary immediately, before any async work
    ServerStartRepository.logStartupInfo(
      port,
      logger,
      data,
      runDb,
      runTasks,
      runSeed,
      runNext,
    );

    // Write offline hint on behalf of the previous instance BEFORE truncating —
    // prevents the old process's own shutdown handler from appending the hint
    // after the new session has already cleared the log.
    writeStartLogOfflineHint();
    // Truncate log files at session start (VIBE_LOG_PATH controls whether file logging is active)
    void truncateStartLog();
    void truncateClientLogs();

    // Kill any previous vibe start instance, then write our PID (including resolved port)
    killPreviousInstance(VIBE_START_PID_FILE, logger);
    writePidFile(VIBE_START_PID_FILE, logger, [], port);

    // Register early SIGINT/SIGTERM so Ctrl+C during setup exits immediately
    const earlyExitHandler = (writeHint: boolean): void => {
      cleanupPidFile(VIBE_START_PID_FILE);
      if (writeHint) {
        writeStartLogOfflineHint();
      }
      process.exit(0);
    };
    process.on("SIGINT", () => earlyExitHandler(true));
    process.on("SIGTERM", () => earlyExitHandler(false));

    // Setup database if enabled
    if (runDb) {
      await ServerStartRepository.setupDatabase(locale, logger, runSeed);
    } else {
      logger.vibe(formatSkip("Database setup skipped"));
    }

    // Start task runner if enabled (non-blocking - fires before Next.js)
    if (runTasks) {
      void ServerStartRepository.startTaskRunnerIfEnabled(
        user,
        locale,
        logger,
        data.framework !== ServerFramework.TANSTACK,
      );
    } else {
      logger.vibe(formatSkip("Task runner skipped"));
    }

    // Start Next.js / TanStack and wait forever
    if (!runNext) {
      logger.vibe(formatSkip("Next.js server skipped"));
      // Replace early exit handler with graceful shutdown
      process.off("SIGINT", earlyExitHandler);
      process.off("SIGTERM", earlyExitHandler);
      const handleShutdown = (): void => {
        cleanupPidFile(VIBE_START_PID_FILE);
        ServerStartRepository.stopAllProcesses();
        process.exit(0);
      };
      process.on("SIGINT", handleShutdown);
      process.on("SIGTERM", handleShutdown);
      return await new Promise<never>(() => {
        /* runs forever - only signal handlers exit */
      });
    }

    if (data.framework === ServerFramework.TANSTACK) {
      try {
        const tanstackResult = await ServerStartRepository.startTanstackServer(
          port,
          logger,
          t,
        );
        if (!tanstackResult.success) {
          logger.vibe(
            formatError(
              `TanStack start failed: ${tanstackResult.message ?? "unknown error"}`,
            ),
          );
        }
      } catch (error) {
        const parsedError = parseError(error);
        logger.vibe(
          formatError(`TanStack startup failed: ${parsedError.message}`),
        );
        logger.error("TanStack server startup failed", parsedError);
      }
    } else {
      try {
        const nextServerResult = await ServerStartRepository.startNextServer(
          port,
          logger,
          t,
          data.profile,
        );
        if (!nextServerResult.success) {
          logger.vibe(
            formatError(
              `Next.js start failed: ${nextServerResult.message ?? "unknown error"}`,
            ),
          );
        }
      } catch (error) {
        const parsedError = parseError(error);
        logger.vibe(
          formatError(`Next.js startup failed: ${parsedError.message}`),
        );
        logger.error("Next.js server startup failed", parsedError);
      }
    }

    // Replace early exit handler with full graceful shutdown
    process.off("SIGINT", earlyExitHandler);
    process.off("SIGTERM", earlyExitHandler);

    const handleShutdown = (writeHint: boolean): void => {
      // Signal auto-restart loop not to re-spawn after we kill Next.js
      ServerStartRepository.nextServerShuttingDown = true;
      cleanupPidFile(VIBE_START_PID_FILE);
      ServerStartRepository.stopAllProcesses();
      // Only write the offline hint on user-initiated shutdown (SIGINT/Ctrl+C).
      // On SIGTERM the new vibe start process already wrote it before truncating.
      if (writeHint) {
        writeStartLogOfflineHint();
      }
      process.exit(0);
    };

    process.on("SIGINT", () => handleShutdown(true));
    process.on("SIGTERM", () => handleShutdown(false));

    // SIGUSR1: hot-restart Next.js (triggered by `vibe rebuild`)
    process.on("SIGUSR1", () => {
      logger.info("🔄 Received SIGUSR1 - restarting server...");

      // Suppress auto-restart while we intentionally kill the old process.
      // nextServerRestarting stays true until the new process is spawned so the
      // exit handler (which fires asynchronously after the kill) doesn't queue
      // a second restart that would race with ours and hit EADDRINUSE.
      ServerStartRepository.nextServerRestarting = true;

      if (ServerStartRepository.wsServerHandle) {
        ServerStartRepository.wsServerHandle.stop();
        ServerStartRepository.wsServerHandle = null;
      }
      if (
        ServerStartRepository.nextServerProcess &&
        !ServerStartRepository.nextServerProcess.killed
      ) {
        ServerStartRepository.nextServerProcess.kill("SIGTERM");
        ServerStartRepository.nextServerProcess = null;
      }

      ServerStartRepository.nextRestartCount = 0;

      ServerStartRepository.startNextServer(port, logger, t, data.profile)
        .then((result) => {
          // New process is up - allow auto-restart to work again if it crashes
          ServerStartRepository.nextServerRestarting = false;
          if (result.success) {
            logger.info("Server restarted via SIGUSR1");
          } else {
            ServerStartRepository.nextServerRestarting = false;
            logger.error("Server restart failed", { message: result.message });
          }
          return result;
        })
        .catch((error) => {
          ServerStartRepository.nextServerRestarting = false;
          logger.error("Server restart error after SIGUSR1", {
            error: parseError(error).message,
          });
        });
    });

    // Catch unhandled errors so crashes are never silent
    process.on("uncaughtException", (err) => {
      const mem = process.memoryUsage();
      logger.error("[Start] Uncaught exception - shutting down", {
        error: err.message,
        stack: err.stack,
        uptime: Math.floor(process.uptime()),
        heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
        rssMb: Math.round(mem.rss / 1024 / 1024),
      });
      process.exit(1);
    });
    process.on("unhandledRejection", (reason) => {
      const mem = process.memoryUsage();
      const message = reason instanceof Error ? reason.message : String(reason);
      const stack = reason instanceof Error ? reason.stack : undefined;
      logger.error("[Start] Unhandled promise rejection", {
        error: message,
        stack,
        uptime: Math.floor(process.uptime()),
        heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
        rssMb: Math.round(mem.rss / 1024 / 1024),
      });
    });

    // Profiling keypress: 'p' → stop server and open CPU profile
    if (data.profile && process.stdin.isTTY) {
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.setEncoding("utf8");
      process.stdin.on("data", (key: string) => {
        if (key === "\u0003") {
          handleShutdown(true);
          return;
        }
        if (key === "p" || key === "P") {
          process.stdout.write(
            // eslint-disable-next-line i18next/no-literal-string
            "\n⏹  Stopping server to collect CPU profile…\n",
          );
          cleanupPidFile(VIBE_START_PID_FILE);
          ServerStartRepository.stopAllProcesses();

          setTimeout((): void => {
            void (async (): Promise<void> => {
              const { default: open } = await import("open");
              const { readdirSync } = await import("node:fs");
              const { resolve } = await import("node:path");

              const cpuProfiles = readdirSync(process.cwd()).filter(
                (f: string) => f.endsWith(".cpuprofile"),
              );
              if (cpuProfiles.length > 0) {
                const latest = cpuProfiles.toSorted().at(-1)!;
                // eslint-disable-next-line i18next/no-literal-string
                process.stdout.write(`🔥 Opening CPU profile: ${latest}\n`);
                await open(resolve(latest));
              } else {
                process.stdout.write(
                  // eslint-disable-next-line i18next/no-literal-string
                  "⚠️  No .cpuprofile found - try running with --profile again\n",
                );
              }

              // eslint-disable-next-line i18next/no-literal-string
              process.stdout.write("\n✅ Done. Goodbye!\n");
              process.exit(0);
            })();
          }, 1500);
        }
      });
    }

    // Keep the process alive indefinitely - only signal handlers exit
    return await new Promise<never>(() => {
      /* runs forever - only signal handlers exit */
    });
  }

  /**
   * Wait for database connection to be ready
   */
  private static async waitForDatabaseConnection(
    logger: EndpointLogger,
  ): Promise<void> {
    const maxAttempts = 60;
    const delayMs = 500;

    logger.debug("Waiting for database to be ready...");

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, delayMs);
      });

      try {
        const { Pool } = await import("pg");
        const pool = new Pool({
          connectionString: process.env["DATABASE_URL"],
          connectionTimeoutMillis: 5000,
        });

        try {
          await pool.query("SELECT 1");
          await pool.end();
          logger.debug(
            `Database connection ready after ${attempt} attempts (${(attempt * delayMs) / 1000}s)`,
          );
          return;
        } catch {
          // oxlint-disable-next-line no-empty-function
          await pool.end().catch(() => {});
          if (attempt % 10 === 0) {
            logger.debug(
              `Still waiting for database... (${attempt}/${maxAttempts})`,
            );
          }
        }
      } catch {
        if (attempt === maxAttempts) {
          logger.warn("Database connection timeout - continuing anyway");
          return;
        }
      }
    }
  }

  /**
   * Start TanStack Start production server (.dist-tanstack/server/index.mjs).
   * Spawns the Nitro server output produced by `vibe build --tanstack`.
   * NEXT_PUBLIC_APP_URL is inlined at build time via Vite's `define` config,
   * so no runtime patching is needed here.
   */
  private static async startTanstackServer(
    port: number,
    logger: EndpointLogger,
    t: ServerStartT,
  ): Promise<ResponseType<void>> {
    ServerStartRepository.killProcessOnPort(port, logger);

    const { existsSync: fsExistsSync } = await import("node:fs");
    // Use join to prevent Turbopack from statically analyzing this as a module import
    const distDir = [".dist-tanstack"].join("");
    const outputFile = [distDir, "server", "index.mjs"].join("/");
    if (!fsExistsSync(outputFile)) {
      return fail({
        message: t("post.errors.tanstackBuildNotFound"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    const tanstackProcess = spawn("bun", [outputFile], {
      stdio: "pipe",
      env: {
        ...process.env,
        PORT: String(port),
        NODE_ENV: "production",
      },
    });

    ServerStartRepository.runningProcesses.set("tanstack", tanstackProcess);

    tanstackProcess.stdout?.on("data", (data: Buffer) => {
      process.stdout.write(data);
    });
    tanstackProcess.stderr?.on("data", (data: Buffer) => {
      process.stderr.write(data);
    });

    tanstackProcess.on("exit", (code, signal) => {
      ServerStartRepository.runningProcesses.delete("tanstack");
      if (code !== 0 && code !== null) {
        logger.error(
          `TanStack Start server exited unexpectedly with code ${String(code)} - shutting down`,
        );
        process.exit(1);
      } else if (signal && signal !== "SIGTERM") {
        logger.error(
          `TanStack Start server killed by signal ${signal} - shutting down`,
        );
        process.exit(1);
      } else {
        logger.info(`TanStack Start server exited with code ${String(code)}`);
      }
    });

    // Give it a moment to start
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 1500);
    });

    if (tanstackProcess.exitCode !== null) {
      return fail({
        message: t("post.errors.tanstackServerExited"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    logger.info(`TanStack Start production server started on port ${port}`);
    return success(undefined);
  }

  /**
   * Kill any process occupying the given port ONLY if its PID is in our PID file.
   * This prevents killing processes from other project instances running on the same port.
   */
  private static killProcessOnPort(port: number, logger: EndpointLogger): void {
    // Get PID on this port
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

    if (!isPortOwnedByUs(port, VIBE_START_PID_FILE)) {
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

    // Still alive - force kill
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

  /**
   * Start Next.js production server as a child process
   */
  private static async startNextServer(
    port: number,
    logger: EndpointLogger,
    t: ServerStartT,
    profile = false,
  ): Promise<ResponseType<void>> {
    try {
      // Import WS module to get NEXT_PORT_OFFSET
      const { startWebSocketServer, NEXT_PORT_OFFSET } =
        await import("@/app/api/[locale]/system/unified-interface/websocket/server");

      const disableProxy = env.VIBE_DISABLE_PROXY;
      // In proxy mode (default): Next.js on port+NEXT_PORT_OFFSET, Bun proxy on main port.
      // In direct mode (VIBE_DISABLE_PROXY=true): Next.js on main port, WS sidecar on port+1000.
      const WS_SIDECAR_OFFSET = 1000;
      const nextPort = disableProxy ? port : port + NEXT_PORT_OFFSET;
      const wsPort = disableProxy ? port + WS_SIDECAR_OFFSET : port;

      // Kill any stale processes on both ports
      ServerStartRepository.killProcessOnPort(nextPort, logger);
      if (disableProxy) {
        ServerStartRepository.killProcessOnPort(wsPort, logger);
      }

      const profilingEnv = profile ? { NEXT_CPU_PROF: "1" } : {};
      if (profile) {
        // eslint-disable-next-line i18next/no-literal-string
        process.stdout.write(`
┌─────────────────────────────────────────────────────────────────┐
│  🔬  PROFILING MODE ACTIVE                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Use the app, exercise the slow paths, then press:             │
│                                                                 │
│    p  →  stop server, collect CPU profile, open it             │
│    Ctrl+C  →  stop server normally (no auto-open)              │
│                                                                 │
│  For compile-time traces, use:  vibe dev --profile             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
`);
      }

      // --- Start Next.js ---
      const { existsSync: fsExistsSync } = await import("node:fs");
      const distExists = fsExistsSync(".next-prod");
      logger.debug(
        `Next.js dist dir: .next-prod (exists: ${String(distExists)})`,
      );
      if (!distExists) {
        logger.error(
          "No .next-prod build found - did 'vibe build' run during Docker build?",
        );
        return fail({
          message: t("post.errors.nextBuildNotFound"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
      const formatNextjs = createNextjsFormatter(nextPort, port);

      /** Spawn Next.js, wire stdio, register exit→restart handler. Returns the child process. */
      const spawnNextProcess = (): ChildProcess => {
        const proc = spawn(
          "bun",
          ["run", "next", "start", "--port", String(nextPort)],
          {
            stdio: "pipe",
            env: {
              ...process.env,
              NODE_ENV: "production",
              NEXT_DIST_DIR: ".next-prod",
              PORT: String(nextPort),
              // 8 GB heap for Next.js - leaves headroom for Bun proxy + OS + Postgres on 16 GB server.
              // Without this Node defaults to ~4 GB and gets OOM-killed under load.
              NODE_OPTIONS:
                `${process.env["NODE_OPTIONS"] ?? ""} --max-old-space-size=8192`.trim(),
              ...profilingEnv,
            } as NodeJS.ProcessEnv,
          },
        );

        proc.stdout?.on("data", (chunk: Buffer) => {
          process.stdout.write(formatNextjs(chunk.toString()));
        });
        proc.stderr?.on("data", (chunk: Buffer) => {
          process.stderr.write(formatNextjs(chunk.toString()));
        });

        proc.on("exit", (code, signal) => {
          ServerStartRepository.nextServerProcess = null;
          removePidFromFile(VIBE_START_PID_FILE, proc.pid ?? 0);

          // Intentional shutdown or SIGUSR1-triggered restart - do not queue a second restart
          if (
            ServerStartRepository.nextServerShuttingDown ||
            ServerStartRepository.nextServerRestarting
          ) {
            return;
          }

          const mem = process.memoryUsage();
          const diag = {
            code,
            signal,
            restartCount: ServerStartRepository.nextRestartCount,
            uptime: Math.floor(process.uptime()),
            heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
            rssMb: Math.round(mem.rss / 1024 / 1024),
            nextPort,
          };

          const isCleanExit = code === 0 || signal === "SIGTERM";
          if (isCleanExit) {
            // clean exit without shuttingDown flag = unexpected (e.g. Next.js self-exited 0)
            logger.warn(
              "Next.js exited cleanly but unexpectedly - restarting",
              diag,
            );
          } else {
            logger.error(
              signal
                ? `Next.js killed by signal ${signal} - restarting`
                : `Next.js exited with code ${String(code)} - restarting`,
              diag,
            );
          }

          const attempt = ServerStartRepository.nextRestartCount;
          const delay =
            NEXT_RESTART_DELAYS[
              Math.min(attempt, NEXT_RESTART_DELAYS.length - 1)
            ] ?? 30000;
          ServerStartRepository.nextRestartCount++;

          logger.warn(
            `Next.js restart #${ServerStartRepository.nextRestartCount} in ${delay}ms`,
          );

          setTimeout(() => {
            if (ServerStartRepository.nextServerShuttingDown) {
              return;
            }
            logger.info(
              `Restarting Next.js (attempt #${ServerStartRepository.nextRestartCount})...`,
            );
            const newProc = spawnNextProcess();
            ServerStartRepository.nextServerProcess = newProc;
            addPidToFile(VIBE_START_PID_FILE, newProc.pid ?? 0);
            // Wait for it to be ready so proxy stops returning 503
            ServerStartRepository.waitForNextServer(
              `http://127.0.0.1:${nextPort}`,
              60000,
              logger,
            )
              .then(() => {
                // Reset restart counter on successful recovery
                ServerStartRepository.nextRestartCount = 0;
                logger.info("Next.js recovered successfully");
                return;
              })
              .catch(() => {
                logger.warn(
                  "Next.js did not respond after restart within timeout",
                );
              });
          }, delay);
        });

        return proc;
      };

      const nextProcess = spawnNextProcess();
      ServerStartRepository.nextServerProcess = nextProcess;
      addPidToFile(VIBE_START_PID_FILE, nextProcess.pid ?? 0);

      // --- Start WS server (proxy or sidecar depending on mode) ---
      const wsHandle = startWebSocketServer({ port: wsPort, logger });
      ServerStartRepository.wsServerHandle = wsHandle;

      // Wait for Next.js to be ready on its port
      await ServerStartRepository.waitForNextServer(
        `http://127.0.0.1:${nextPort}`,
        30000,
        logger,
      );

      return success(undefined);
    } catch (error) {
      logger.error("Failed to start server", {
        error: parseError(error).message,
      });
      return fail({
        message: t("post.errors.startFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Wait for Next.js to respond on the given URL.
   */
  private static async waitForNextServer(
    url: string,
    timeoutMs: number,
    logger: EndpointLogger,
  ): Promise<void> {
    const start = Date.now();
    const pollInterval = 500;

    while (Date.now() - start < timeoutMs) {
      try {
        const response = await fetch(url, { method: "HEAD" });
        if (response.ok || response.status === 404) {
          return;
        }
      } catch {
        // Connection refused - server not ready yet
      }

      await new Promise<void>((resolve) => {
        setTimeout(resolve, pollInterval);
      });

      if ((Date.now() - start) % 5000 < pollInterval) {
        logger.debug(`Still waiting for Next.js on ${url}...`);
      }
    }

    logger.warn(
      `Next.js did not respond within ${timeoutMs}ms - continuing anyway`,
    );
  }

  /**
   * Stop all running processes
   */
  private static stopAllProcesses(): void {
    // Stop the WS sidecar
    if (ServerStartRepository.wsServerHandle) {
      try {
        ServerStartRepository.wsServerHandle.stop();
      } catch {
        // Ignore errors when stopping WS server
      }
      ServerStartRepository.wsServerHandle = null;
    }

    // Stop Next.js child process
    if (
      ServerStartRepository.nextServerProcess &&
      !ServerStartRepository.nextServerProcess.killed
    ) {
      try {
        ServerStartRepository.nextServerProcess.kill("SIGTERM");
      } catch {
        // Ignore
      }
    }
    ServerStartRepository.nextServerProcess = null;

    // Stop any remaining child processes (task runner etc.)
    for (const [, process] of ServerStartRepository.runningProcesses) {
      try {
        if (process && !process.killed) {
          process.kill("SIGTERM");
          setTimeout(() => {
            if (!process.killed) {
              process.kill("SIGKILL");
            }
          }, 5000);
        }
      } catch {
        // Ignore errors when stopping processes
      }
    }
    ServerStartRepository.runningProcesses.clear();
  }
}
