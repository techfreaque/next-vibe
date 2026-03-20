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
import type { WebSocketServerHandle } from "@/app/api/[locale]/system/unified-interface/websocket/server";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation as dockerOperationsScopedTranslation } from "../../db/utils/docker-operations/i18n";
import { scopedTranslation as dbUtilsScopedTranslation } from "../../db/utils/i18n";
import {
  cleanupPidFile,
  killPreviousInstance,
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
export class ServerStartRepository {
  private static taskRunnerStarted = false;
  private static nextServerProcess: ChildProcess | null = null;
  private static wsServerHandle: WebSocketServerHandle | null = null;
  private static runningProcesses: Map<string, ChildProcess> = new Map();

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
   * Only patches localhost URLs — production URLs are left untouched.
   * Child processes inherit process.env so they automatically get the correct URL.
   */
  private static patchPublicUrlPort(port: number): void {
    const current = process.env["NEXT_PUBLIC_APP_URL"];
    if (!current) {
      process.env["NEXT_PUBLIC_APP_URL"] = `http://localhost:${String(port)}`;
      return;
    }
    try {
      const parsed = new URL(current);
      if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
        parsed.port = String(port);
        process.env["NEXT_PUBLIC_APP_URL"] = parsed.toString();
      }
    } catch {
      // Not a valid URL — leave it as-is
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
    logger.vibe(
      formatStartup(
        data.tanstack
          ? "Starting TanStack/Vite Production Server"
          : "Starting Production Server",
        "🚀",
      ),
    );
    ServerStartRepository.log("");
    ServerStartRepository.log(
      `  ${formatConfig("Port", port)}  ${formatHint("(--port=N)")}`,
    );
    ServerStartRepository.log(`  ${formatConfig("Env", currentEnv)}`);
    ServerStartRepository.log(
      `  ${formatConfig("Mode", mode)}  ${formatHint("(--mode=all|web|tasks)")}`,
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
      const migrateStart = Date.now();
      try {
        const migrateResult = execSync("bunx drizzle-kit migrate", {
          encoding: "utf-8",
          cwd: process.cwd(),
          env: { ...process.env },
        });
        logger.debug("Migrations completed", { output: migrateResult.trim() });
        logger.info(
          formatDatabase(
            `Migrations done in ${formatDuration(Date.now() - migrateStart)}`,
            "🗄️ ",
          ),
        );
      } catch (migrateError) {
        const migrateMsg = parseError(migrateError).message;
        logger.vibe(formatError(`Migration failed: ${migrateMsg}`));
        logger.error("Migration failed during start", { error: migrateMsg });
      }

      // Deploy db-functions (idempotent — runs after every migration)
      const { deployDbFunctions } =
        await import("@/app/api/[locale]/system/db/db-functions/deploy");
      await deployDbFunctions(logger);

      // Seed database if enabled
      if (runSeed) {
        const { seedDatabase } =
          await import("@/app/api/[locale]/system/db/seed/seed-manager");
        await seedDatabase("prod", logger, locale);
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
  ): Promise<void> {
    try {
      logger.debug(formatTask("Starting task runner"));
      const { UnifiedTaskRunnerRepository } =
        await import("../../unified-interface/tasks/unified-runner/repository");

      UnifiedTaskRunnerRepository.environment = "production";

      // manageRunner("start") blocks forever — must NOT await
      void UnifiedTaskRunnerRepository.manageRunner(
        { action: "start", taskFilter: "cron", dryRun: false },
        user,
        locale,
        logger,
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

    // Kill any previous vibe start instance, then write our PID
    killPreviousInstance(VIBE_START_PID_FILE, logger);
    writePidFile(VIBE_START_PID_FILE, logger);

    // Register early SIGINT/SIGTERM so Ctrl+C during setup exits immediately
    const earlyExitHandler = (): void => {
      cleanupPidFile(VIBE_START_PID_FILE);
      process.exit(0);
    };
    process.on("SIGINT", earlyExitHandler);
    process.on("SIGTERM", earlyExitHandler);

    // Setup database if enabled
    if (runDb) {
      await ServerStartRepository.setupDatabase(locale, logger, runSeed);
    } else {
      logger.vibe(formatSkip("Database setup skipped"));
    }

    // Start task runner if enabled (non-blocking — fires before Next.js)
    if (runTasks) {
      void ServerStartRepository.startTaskRunnerIfEnabled(user, locale, logger);
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
        /* runs forever — only signal handlers exit */
      });
    }

    if (data.tanstack) {
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

    const handleShutdown = (): void => {
      cleanupPidFile(VIBE_START_PID_FILE);
      ServerStartRepository.stopAllProcesses();
      process.exit(0);
    };

    process.on("SIGINT", handleShutdown);
    process.on("SIGTERM", handleShutdown);

    // SIGUSR1: hot-restart Next.js (triggered by `vibe rebuild`)
    process.on("SIGUSR1", () => {
      logger.info("🔄 Received SIGUSR1 — restarting server...");

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

      ServerStartRepository.startNextServer(port, logger, t, data.profile)
        .then((result) => {
          if (result.success) {
            logger.info("Server restarted via SIGUSR1");
          } else {
            logger.error("Server restart failed", { message: result.message });
          }
          return result;
        })
        .catch((error) => {
          logger.error("Server restart error after SIGUSR1", {
            error: parseError(error).message,
          });
        });
    });

    // Profiling keypress: 'p' → stop server and open CPU profile
    if (data.profile && process.stdin.isTTY) {
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.setEncoding("utf8");
      process.stdin.on("data", (key: string) => {
        if (key === "\u0003") {
          handleShutdown();
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
                  "⚠️  No .cpuprofile found — try running with --profile again\n",
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

    // Keep the process alive indefinitely — only signal handlers exit
    return await new Promise<never>(() => {
      /* runs forever — only signal handlers exit */
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
          logger.warn("Database connection timeout — continuing anyway");
          return;
        }
      }
    }
  }

  /**
   * Start TanStack Start production server (.output/server/index.mjs).
   * Spawns the Nitro server output produced by `vibe build --tanstack`.
   */
  private static async startTanstackServer(
    port: number,
    logger: EndpointLogger,
    t: ServerStartT,
  ): Promise<ResponseType<void>> {
    ServerStartRepository.killProcessOnPort(port, logger);

    const { existsSync: fsExistsSync } = await import("node:fs");
    // Use join to prevent Turbopack from statically analyzing this as a module import
    const outputFile = [".output", "server", "index.mjs"].join("/");
    if (!fsExistsSync(outputFile)) {
      return fail({
        message: t("post.errors.tanstackBuildNotFound"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    const tanstackProcess = spawn("node", [outputFile], {
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

    tanstackProcess.on("exit", (code) => {
      logger.info(`TanStack Start server exited with code ${String(code)}`);
      ServerStartRepository.runningProcesses.delete("tanstack");
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
   * Kill any process occupying the given port
   */
  private static killProcessOnPort(port: number, logger: EndpointLogger): void {
    try {
      // fuser is more reliable than lsof for finding processes on a port
      execSync(`fuser -k ${port}/tcp 2>/dev/null`, { encoding: "utf-8" });
      logger.debug(`Killed stale process on port ${port}`);
      // Brief wait for process to exit
      execSync("sleep 0.5");
    } catch {
      // No process on port or kill failed — both are fine
    }
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
          "No .next-prod build found — did 'vibe build' run during Docker build?",
        );
        return fail({
          message: t("post.errors.nextBuildNotFound"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
      const nextProcess = spawn(
        "bun",
        ["run", "next", "start", "--port", String(nextPort)],
        {
          stdio: "pipe",
          env: {
            ...process.env,
            NODE_ENV: "production",
            NEXT_DIST_DIR: ".next-prod",
            PORT: String(nextPort),
            ...profilingEnv,
          } as NodeJS.ProcessEnv,
        },
      );
      ServerStartRepository.nextServerProcess = nextProcess;

      // Pipe Next.js output so crashes are never silent
      // Replace internal nextPort with public port in output (proxy mode)
      const formatNextjs = createNextjsFormatter(nextPort, port);
      nextProcess.stdout?.on("data", (chunk: Buffer) => {
        process.stdout.write(formatNextjs(chunk.toString()));
      });
      nextProcess.stderr?.on("data", (chunk: Buffer) => {
        process.stderr.write(formatNextjs(chunk.toString()));
      });
      nextProcess.on("exit", (code, signal) => {
        if (code !== 0 && code !== null) {
          logger.error(
            `Next.js exited unexpectedly with code ${code} — shutting down`,
          );
          process.exit(1);
        } else if (signal && signal !== "SIGTERM") {
          logger.error(`Next.js killed by signal ${signal} — shutting down`);
          process.exit(1);
        }
      });

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
        // Connection refused — server not ready yet
      }

      await new Promise<void>((resolve) => {
        setTimeout(resolve, pollInterval);
      });

      if ((Date.now() - start) % 5000 < pollInterval) {
        logger.debug(`Still waiting for Next.js on ${url}...`);
      }
    }

    logger.warn(
      `Next.js did not respond within ${timeoutMs}ms — continuing anyway`,
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
