/**
 * Server Start Repository
 * Handles production server startup operations with parallel task runner and Next.js server startup
 * Implements task system specification requirements for production environment
 */

// CLI output messages don't need internationalization
// Process environment access is required for server configuration

import type { ChildProcess } from "node:child_process";
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { monitorEventLoopDelay } from "node:perf_hooks";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { scopedTranslation as dockerOperationsScopedTranslation } from "next-vibe/database/utils/docker-operations/i18n";
import { scopedTranslation as dbUtilsScopedTranslation } from "next-vibe/database/utils/i18n";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { formatLogPrefix } from "next-vibe/logger/create-logger";
import {
  appendRawToServerLog,
  truncateClientLogs,
  truncateServerLog,
  writeServerLogOfflineHint,
} from "next-vibe/logger/file";
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
} from "next-vibe/logger/formatters";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { WebSocketServerHandle } from "next-vibe/realtime/server";
import type { ServerStartT } from "next-vibe/server/server/start/i18n";
import { scopedTranslation as serverStartScopedTranslation } from "next-vibe/server/server/start/i18n";

import { env } from "@/config/env";
import { readProcMeminfo } from "@/app/api/[locale]/system/database/health/repository";

import { ServerFramework } from "../enum";
import { patchRuntimeEnvPlaceholders } from "./runtime-env-patch";
import {
  addPidToFile,
  cleanupPidFile,
  getPidOnPort,
  isPortOwnedByUs,
  killPreviousInstance,
  removePidFromFile,
  VIBE_START_PID_FILE,
  VIBE_SUPERVISOR_PID_FILE,
  writePidFile,
} from "../pid";
import type {
  ServerStartRequestOutput,
  ServerStartResponseOutput,
} from "./definition";

/**
 * Server Start Repository
 */
/** Restart backoff delays in ms (doubles each attempt, capped at 30s) */
const NEXT_RESTART_DELAYS = [2000, 4000, 8000, 16000, 30000];

/** Health snapshot file written every 60s so the supervisor can read pre-crash memory on OOM */
const HEALTH_SNAPSHOT_FILE = ".tmp/.vibe-health.json";

/** Supervisor restart backoff: 2s → 5s → 10s → 30s (stays at 30s) */
const SUPERVISOR_RESTART_DELAYS_MS = [2000, 5000, 10000, 30000];

/**
 * OOM-specific backoff: longer delays to let the OS reclaim memory before restarting.
 * Used when consecutive OOM kills are detected (signal === "SIGKILL").
 * 10s → 30s → 60s → 120s (stays at 120s)
 */
const SUPERVISOR_OOM_RESTART_DELAYS_MS = [10000, 30000, 60000, 120000];

/** How many consecutive OOMs before we switch to the longer OOM backoff */
const OOM_CONSECUTIVE_THRESHOLD = 2;

/** Task runner restart backoff: 5s → 10s → 30s → 60s (stays at 60s) */
const TASK_RESTART_DELAYS_MS = [5000, 10000, 30000, 60000];

/**
 * Supervisor watchdog: max age of the health snapshot file in ms before we
 * consider the child frozen and force-kill it. 150s = 2.5x the 60s write interval.
 * Gives one full miss + half buffer to avoid false positives from slow I/O.
 */
const FREEZE_WATCHDOG_THRESHOLD_MS = 150_000;

/** How often the supervisor checks the health snapshot file for staleness */
const FREEZE_WATCHDOG_INTERVAL_MS = 30_000;

/** Event loop lag thresholds for the child process (microseconds → ms conversion) */
const EL_LAG_WARN_MS = 100;
const EL_LAG_ERROR_MS = 500;
const EL_LAG_CRITICAL_MS = 2000;

/**
 * Supervisor heap cap in MB. The supervisor only runs the watch loop — no app code.
 * Capping it low ensures it can never OOM even if the child is thrashing memory.
 * Strips any large --max-old-space-size inherited from the parent environment.
 */
const SUPERVISOR_MAX_HEAP_MB = 256;

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
  private static taskRunnerRestartCount = 0;
  /** The supervised child process (only set in supervisor mode) */
  private static supervisedChild: ChildProcess | null = null;
  /** Handle for the health-snapshot interval (only set in the child/server process) */
  private static healthSnapshotInterval: ReturnType<typeof setInterval> | null =
    null;

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
    appendRawToServerLog(msg);
  }

  /**
   * Supervisor mode: spawn this process as a supervised child and restart it on any crash.
   * OOM kills (SIGKILL) are detected; the last known memory from the health snapshot file
   * is logged so there is always a record even when the child can't log itself.
   *
   * Called when VIBE_SUPERVISED is not set. The child inherits VIBE_SUPERVISED=1 and
   * skips this path, proceeding with normal server startup.
   */
  private static async runSupervisor(logger: EndpointLogger): Promise<never> {
    // Cap the supervisor's own heap so it can never OOM even if the child is
    // thrashing memory. Strips any large --max-old-space-size inherited from the
    // parent environment, replacing it with the supervisor-specific cap.
    const existingNodeOptions = process.env["NODE_OPTIONS"] ?? "";
    const strippedNodeOptions = existingNodeOptions
      .replace(/--max-old-space-size=\d+/g, "")
      .trim();
    Object.assign(process.env, {
      NODE_OPTIONS:
        `${strippedNodeOptions} --max-old-space-size=${SUPERVISOR_MAX_HEAP_MB}`.trim(),
    });

    // Kill any existing supervisor, then register our own PID.
    killPreviousInstance(VIBE_SUPERVISOR_PID_FILE, logger);
    writePidFile(VIBE_SUPERVISOR_PID_FILE, logger);

    // Remove supervisor PID file on any exit (best-effort - SIGKILL won't trigger this).
    process.on("exit", () => {
      cleanupPidFile(VIBE_SUPERVISOR_PID_FILE);
    });

    // Supervisor-level crash guard: any unhandled error in supervisor code must be
    // logged and cause the supervisor itself to exit so Docker restarts the whole stack.
    process.on("uncaughtException", (err) => {
      logger.error("[Supervisor] Uncaught exception in supervisor - exiting", {
        error: err.message,
        stack: err.stack,
      });
      void writeServerLogOfflineHint();
      process.exit(2);
    });
    process.on("unhandledRejection", (reason) => {
      const message = reason instanceof Error ? reason.message : String(reason);
      const stack = reason instanceof Error ? reason.stack : undefined;
      logger.error(
        "[Supervisor] Unhandled rejection in supervisor - continuing",
        { error: message, stack },
      );
    });

    let supervisorShuttingDown = false;
    let restartCount = 0;
    let consecutiveOoms = 0;

    const spawnChild = (): ChildProcess => {
      // Restore full heap cap for the child - it runs the actual application.
      // NODE_OPTIONS was already modified above for the supervisor; the child
      // inherits the stripped version and startNextServer re-applies 8GB via
      // NODE_OPTIONS on the Next.js spawn. This env entry ensures the Bun child
      // (the server process wrapper itself) also gets the full cap back.
      const childEnv = {
        ...process.env,
        VIBE_SUPERVISED: "1",
        // Remove the supervisor's small cap so the child isn't artificially limited
        NODE_OPTIONS: (process.env["NODE_OPTIONS"] ?? "")
          .replace(/--max-old-space-size=\d+/g, "")
          .trim(),
      };

      const child = spawn(process.execPath, process.argv.slice(1), {
        // inherit: child stdout/stderr flow directly to terminal/log files
        stdio: "inherit",
        env: childEnv,
      });

      logger.debug(
        `[Supervisor] Child started (PID ${String(child.pid)}, restart #${restartCount})`,
      );

      child.on("exit", (code, signal) => {
        ServerStartRepository.supervisedChild = null;

        if (supervisorShuttingDown) {
          // Intentional shutdown - exit the supervisor with the same code
          process.exit(code ?? 0);
          return;
        }

        // Read last health snapshot - provides pre-crash memory even on SIGKILL.
        // Stored as a raw string to stay within LoggerMetadata bounds.
        let lastHealth: string | undefined;
        try {
          lastHealth = readFileSync(HEALTH_SNAPSHOT_FILE, "utf-8");
        } catch {
          // No snapshot yet (crashed before first write)
        }

        const likelyOom = signal === "SIGKILL";

        // Track consecutive OOMs to detect a server that can't stay up due to
        // memory pressure. After OOM_CONSECUTIVE_THRESHOLD in a row, switch to
        // longer backoff and log a distinct critical alert.
        if (likelyOom) {
          consecutiveOoms++;
        } else {
          consecutiveOoms = 0;
        }

        const crashInfo = {
          timestamp: new Date().toISOString(),
          code,
          signal,
          restartCount,
          likelyOom,
          consecutiveOoms,
          lastHealth,
        };

        if (likelyOom && consecutiveOoms >= OOM_CONSECUTIVE_THRESHOLD) {
          logger.error(
            `[Supervisor] CRITICAL: ${consecutiveOoms} consecutive OOM kills - server cannot stay up. Waiting longer before restart.`,
            crashInfo,
          );
        } else {
          const crashMessage = likelyOom
            ? "[Supervisor] Server OOM-killed (SIGKILL) - will restart"
            : signal !== null
              ? `[Supervisor] Server killed by signal ${signal} - will restart`
              : `[Supervisor] Server crashed (exit code ${String(code)}) - will restart`;
          logger.error(crashMessage, crashInfo);
        }

        // Crash info already persisted via logger.error above (routes to VIBE_LOG_FILE)

        // OOM crashes use a longer backoff to let the OS reclaim memory.
        const delayTable =
          likelyOom && consecutiveOoms >= OOM_CONSECUTIVE_THRESHOLD
            ? SUPERVISOR_OOM_RESTART_DELAYS_MS
            : SUPERVISOR_RESTART_DELAYS_MS;
        const delay =
          delayTable[Math.min(restartCount, delayTable.length - 1)] ?? 30000;
        restartCount++;

        logger.warn(
          `[Supervisor] Restart #${restartCount} scheduled in ${Math.round(delay / 1000)}s`,
        );

        setTimeout(() => {
          if (supervisorShuttingDown) {
            return;
          }
          ServerStartRepository.supervisedChild = spawnChild();
        }, delay);
      });

      return child;
    };

    ServerStartRepository.supervisedChild = spawnChild();

    // Watchdog: detect frozen child (alive but event loop blocked, no health snapshot update).
    // The child writes .tmp/.vibe-health.json every 60s. If the file goes stale for
    // FREEZE_WATCHDOG_THRESHOLD_MS, we assume the child is frozen and force-kill it so the
    // supervisor can restart it. This catches hangs that don't trigger an exit event.
    const freezeWatchdog = setInterval(() => {
      if (supervisorShuttingDown || !ServerStartRepository.supervisedChild) {
        return;
      }
      try {
        const stat = statSync(HEALTH_SNAPSHOT_FILE);
        const ageMs = Date.now() - stat.mtimeMs;
        if (ageMs > FREEZE_WATCHDOG_THRESHOLD_MS) {
          let lastHealth: string | undefined;
          try {
            lastHealth = readFileSync(HEALTH_SNAPSHOT_FILE, "utf-8");
          } catch {
            // ignore
          }
          logger.error(
            `[Supervisor] Child appears frozen: health snapshot is ${Math.round(ageMs / 1000)}s stale (threshold: ${FREEZE_WATCHDOG_THRESHOLD_MS / 1000}s). Force-killing.`,
            {
              snapshotAgeMs: Math.round(ageMs),
              thresholdMs: FREEZE_WATCHDOG_THRESHOLD_MS,
              lastHealth,
              childPid: ServerStartRepository.supervisedChild?.pid,
            },
          );
          // Freeze info already logged via logger.error above (routes to VIBE_LOG_FILE)
          if (
            ServerStartRepository.supervisedChild &&
            !ServerStartRepository.supervisedChild.killed
          ) {
            ServerStartRepository.supervisedChild.kill("SIGKILL");
          }
        }
      } catch {
        // Health snapshot doesn't exist yet (child still starting) - not a freeze
      }
    }, FREEZE_WATCHDOG_INTERVAL_MS);
    // Supervisor exits only via signal handlers (process.exit) - no need to unref.
    // The freezeWatchdog variable is intentionally unused after this point.
    void freezeWatchdog;

    // SIGINT arrives at the whole process group (child gets it too) - just set the flag.
    process.on("SIGINT", () => {
      supervisorShuttingDown = true;
      // Child handles its own graceful shutdown; supervisor exits when child exits.
    });

    // SIGTERM is sent to a specific PID - forward it to the child.
    process.on("SIGTERM", () => {
      supervisorShuttingDown = true;
      if (
        ServerStartRepository.supervisedChild &&
        !ServerStartRepository.supervisedChild.killed
      ) {
        ServerStartRepository.supervisedChild.kill("SIGTERM");
      }
    });

    // SIGUSR1 (vibe rebuild) - forward directly; child handles the hot-restart.
    process.on("SIGUSR1", () => {
      if (
        ServerStartRepository.supervisedChild &&
        !ServerStartRepository.supervisedChild.killed
      ) {
        ServerStartRepository.supervisedChild.kill("SIGUSR1");
      }
    });

    return new Promise<never>(() => {
      /* Supervisor runs forever - exits only via signal handlers above */
    });
  }

  /**
   * Write a memory snapshot to HEALTH_SNAPSHOT_FILE every 60 seconds and log
   * memory pressure warnings as heap approaches the --max-old-space-size limit.
   *
   * Thresholds (% of heapTotal):
   *   ≥ 90% → error  (imminent OOM - log loudly)
   *   ≥ 80% → warn
   *   ≥ 70% → info
   *
   * The supervisor reads the snapshot on crash to report pre-OOM memory even
   * when the child process was SIGKILL-ed and could not log itself.
   */
  private static startHealthSnapshot(logger: EndpointLogger): void {
    if (ServerStartRepository.healthSnapshotInterval !== null) {
      return;
    }

    // Track which pressure level we last logged to avoid repeating the same
    // message on every tick when the server is consistently under pressure.
    let lastPressureLevel = 0;

    const writeSnapshot = (): void => {
      try {
        const mem = process.memoryUsage();
        const heapUsedMb = Math.round(mem.heapUsed / 1024 / 1024);
        const rssMb = Math.round(mem.rss / 1024 / 1024);
        const heapTotalMb = Math.round(mem.heapTotal / 1024 / 1024);
        // Bun runs on JavaScriptCore, not V8 - heapTotal does not carry V8's
        // "current heap capacity" meaning there, and heapUsed can legitimately
        // exceed it (observed: heapUsed=101MB, heapTotal=60MB in production).
        // A heapUsed/heapTotal ratio is therefore not a reliable OOM predictor
        // on this runtime. What actually predicts an OOM-kill is RSS against
        // the container's real memory ceiling, so read /proc/meminfo (same
        // proven approach as the db-health-check task) instead.
        const procMem = readProcMeminfo();
        const systemUsedPct = procMem
          ? Math.round(
              ((procMem.totalKb - procMem.availableKb) / procMem.totalKb) * 100,
            )
          : null;

        mkdirSync(".tmp", { recursive: true });
        writeFileSync(
          HEALTH_SNAPSHOT_FILE,
          JSON.stringify({
            heapUsedMb,
            rssMb,
            heapTotalMb,
            systemUsedPct,
            timestamp: new Date().toISOString(),
            uptime: Math.floor(process.uptime()),
            nextRestartCount: ServerStartRepository.nextRestartCount,
            taskRunnerRestartCount:
              ServerStartRepository.taskRunnerRestartCount,
            taskRunnerRunning: ServerStartRepository.taskRunnerStarted,
          }),
          "utf-8",
        );

        // Memory pressure warnings - only log when crossing a new threshold.
        // Skip the first 30s: memory metrics are unreliable during startup.
        const uptime = Math.floor(process.uptime());
        if (uptime < 30 || systemUsedPct === null) {
          // Suppress pressure warnings during startup, or when /proc/meminfo
          // is unavailable (non-Linux) - no reliable signal to act on.
        } else if (systemUsedPct >= 90 && lastPressureLevel < 3) {
          lastPressureLevel = 3;
          logger.error(
            `[Memory] CRITICAL system=${systemUsedPct}% heapUsed=${heapUsedMb}MB rss=${rssMb}MB uptime=${uptime}s — OOM imminent`,
          );
        } else if (systemUsedPct >= 80 && lastPressureLevel < 2) {
          lastPressureLevel = 2;
          logger.warn(
            `[Memory] High pressure system=${systemUsedPct}% heapUsed=${heapUsedMb}MB rss=${rssMb}MB uptime=${uptime}s`,
          );
        } else if (systemUsedPct >= 70 && lastPressureLevel < 1) {
          lastPressureLevel = 1;
          logger.info(
            `[Memory] Elevated system=${systemUsedPct}% heapUsed=${heapUsedMb}MB rss=${rssMb}MB uptime=${uptime}s`,
          );
        } else if (systemUsedPct < 60) {
          // Reset so warnings fire again if pressure rises
          lastPressureLevel = 0;
        }
      } catch {
        // Ignore fs errors (read-only fs, etc.)
      }
    };

    // Store handle only to guard against double-initialization.
    // No unref() needed: all shutdown paths call process.exit() explicitly.
    ServerStartRepository.healthSnapshotInterval = setInterval(
      writeSnapshot,
      60_000,
    );

    // Write immediately so there is data even if the process crashes before 60s
    writeSnapshot();

    // Event loop lag monitoring: detect when the event loop is blocked.
    // Uses perf_hooks histogram which samples lag every 20ms.
    // Thresholds: ≥100ms warn, ≥500ms error, ≥2000ms critical.
    // Critical lag is what causes server "freezes" from the user's perspective.
    try {
      const histogram = monitorEventLoopDelay({ resolution: 20 });
      histogram.enable();

      let lastLagLevel = 0;
      const lagInterval = setInterval(() => {
        try {
          // histogram.mean is in nanoseconds
          const meanMs = histogram.mean / 1e6;
          const maxMs = histogram.max / 1e6;
          histogram.reset();

          const uptime2 = Math.floor(process.uptime());
          const heapMb = Math.round(
            process.memoryUsage().heapUsed / 1024 / 1024,
          );
          if (maxMs >= EL_LAG_CRITICAL_MS && lastLagLevel < 3) {
            lastLagLevel = 3;
            logger.error(
              `[EventLoop] CRITICAL lag max=${Math.round(maxMs)}ms mean=${Math.round(meanMs)}ms heap=${heapMb}MB uptime=${uptime2}s — server may appear frozen`,
            );
          } else if (maxMs >= EL_LAG_ERROR_MS && lastLagLevel < 2) {
            lastLagLevel = 2;
            logger.error(
              `[EventLoop] High lag max=${Math.round(maxMs)}ms mean=${Math.round(meanMs)}ms uptime=${uptime2}s — requests may be timing out`,
            );
          } else if (maxMs >= EL_LAG_WARN_MS && lastLagLevel < 1) {
            lastLagLevel = 1;
            logger.warn(
              `[EventLoop] Elevated lag max=${Math.round(maxMs)}ms mean=${Math.round(meanMs)}ms`,
            );
          } else if (maxMs < EL_LAG_WARN_MS / 2) {
            lastLagLevel = 0;
          }
        } catch {
          // ignore
        }
      }, 5_000);
      // Child exits only via process.exit() in signal handlers - no need to unref.
      void lagInterval;
    } catch {
      // perf_hooks.monitorEventLoopDelay may not be available in all runtimes
      logger.debug(
        "[EventLoop] monitorEventLoopDelay not available in this runtime",
      );
    }
  }

  private static logStartupInfo(
    port: number,
    data: ServerStartRequestOutput,
    runDb: boolean,
    runTasks: boolean,
    runSeed: boolean,
    runNext: boolean,
  ): void {
    const currentEnv = process.env["NODE_ENV"] || "production";
    const mode = data.mode ?? "all";
    ServerStartRepository.log(
      `${formatLogPrefix()}${formatStartup("Starting Production Server", "🚀")}`,
    );
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
      const { DbUtilsRepository } =
        await import("next-vibe/database/utils/repository");
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
          await import("next-vibe/database/utils/docker-operations/repository");
        const { t: dockerOpsT } =
          dockerOperationsScopedTranslation.scopedT(locale);
        const { basename } = await import("node:path");
        const projectSlug = basename(
          process.env["PROJECT_ROOT"] ?? process.cwd(),
        );
        const dbStartResult = await DockerOperationsRepository.dockerComposeUp(
          logger,
          dockerOpsT,
          "docker-compose.preview.yml",
          60000,
          `${projectSlug}-hermes`,
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
        await import("next-vibe/database/migrate/repository");
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
        await import("next-vibe/database/db-functions/deploy");
      await deployDbFunctions(logger);

      // Seed database if enabled
      if (runSeed) {
        const { SeedRepository } =
          await import("next-vibe/database/seed/repository");
        await SeedRepository.seed("prod", logger);
      } else {
        logger.vibe(formatSkip("Database seeding skipped"));
      }

      logger.info(formatDatabase("Database ready", "🗄️ "));

      // Auto-open all active reverse-ws connectors so cross-instance sync works
      // after server restart without requiring the user to reconnect manually.
      void ServerStartRepository.openReverseWsConnectors(logger);
    } catch (error) {
      const parsedError = parseError(error);
      logger.vibe(formatError("Database setup failed (continuing anyway)"));
      logger.error("Database setup error details", parsedError);
    }
  }

  private static async openReverseWsConnectors(
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      const { RemoteConnectionRepository } =
        await import("@/app/api/[locale]/remote-connection/repository");
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

  private static async startTaskRunnerIfEnabled(
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    skipTanstack: boolean,
  ): Promise<void> {
    try {
      logger.debug(formatTask("Starting task runner"));
      const { UnifiedTaskRunnerRepository } =
        await import("next-vibe/tasks/unified-runner/repository");

      UnifiedTaskRunnerRepository.environment = "production";

      // Closure so the restart loop can call itself recursively with backoff.
      const runRunner = (): void => {
        void UnifiedTaskRunnerRepository.manageRunner(
          { action: "start", taskFilter: "cron", dryRun: false },
          user,
          locale,
          logger,
          skipTanstack,
        ).catch((catchError) => {
          if (ServerStartRepository.nextServerShuttingDown) {
            return; // Intentional shutdown - do not restart
          }

          ServerStartRepository.taskRunnerStarted = false;

          const delay =
            TASK_RESTART_DELAYS_MS[
              Math.min(
                ServerStartRepository.taskRunnerRestartCount,
                TASK_RESTART_DELAYS_MS.length - 1,
              )
            ] ?? 60000;
          ServerStartRepository.taskRunnerRestartCount++;

          logger.error(
            `[TaskRunner] Exited unexpectedly - restart #${ServerStartRepository.taskRunnerRestartCount} in ${Math.round(delay / 1000)}s`,
            { error: parseError(catchError).message },
          );

          setTimeout(() => {
            if (ServerStartRepository.nextServerShuttingDown) {
              return;
            }
            logger.info(
              `[TaskRunner] Restarting (attempt #${ServerStartRepository.taskRunnerRestartCount})...`,
            );
            runRunner();
          }, delay);
        });
      };

      runRunner();

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
    // Enter supervisor mode unless we are already the supervised child.
    // The supervisor is a thin wrapper that restarts this process on any crash,
    // including OOM kills (SIGKILL) where the process itself cannot log anything.
    if (!process.env["VIBE_SUPERVISED"]) {
      return ServerStartRepository.runSupervisor(logger);
    }

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

    // Write offline hint on behalf of the previous instance BEFORE truncating —
    // prevents the old process's own shutdown handler from appending the hint
    // after the new session has already cleared the log.
    writeServerLogOfflineHint();
    // Truncate log files at session start (VIBE_LOG_PATH controls whether file logging is active)
    truncateServerLog();
    truncateClientLogs();

    // Print config summary immediately, before any async work
    ServerStartRepository.logStartupInfo(
      port,
      data,
      runDb,
      runTasks,
      runSeed,
      runNext,
    );

    // Kill any previous vibe start instance, then write our PID (including resolved port)
    killPreviousInstance(VIBE_START_PID_FILE, logger);
    writePidFile(VIBE_START_PID_FILE, logger, [], port);

    // Register early SIGINT/SIGTERM so Ctrl+C during setup exits immediately.
    // Use stable named functions so process.off() can remove them precisely.
    const earlyExitOnInt = (): void => {
      cleanupPidFile(VIBE_START_PID_FILE);
      writeServerLogOfflineHint();
      process.exit(0);
    };
    const earlyExitOnTerm = (): void => {
      cleanupPidFile(VIBE_START_PID_FILE);
      process.exit(0);
    };
    process.on("SIGINT", earlyExitOnInt);
    process.on("SIGTERM", earlyExitOnTerm);

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
      process.off("SIGINT", earlyExitOnInt);
      process.off("SIGTERM", earlyExitOnTerm);
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

    // Patch Docker-build runtime-env placeholders with real values before
    // Next.js starts serving. TanStack inlines NEXT_PUBLIC_APP_URL via
    // Vite's `define` at build time instead - no sentinel involved there.
    if (data.framework !== ServerFramework.TANSTACK) {
      patchRuntimeEnvPlaceholders(logger);
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
    process.off("SIGINT", earlyExitOnInt);
    process.off("SIGTERM", earlyExitOnTerm);

    const handleShutdownOnInt = (): void => {
      // Signal auto-restart loop not to re-spawn after we kill Next.js
      ServerStartRepository.nextServerShuttingDown = true;
      cleanupPidFile(VIBE_START_PID_FILE);
      ServerStartRepository.stopAllProcesses();
      writeServerLogOfflineHint();
      process.exit(0);
    };
    const handleShutdownOnTerm = (): void => {
      // Signal auto-restart loop not to re-spawn after we kill Next.js
      ServerStartRepository.nextServerShuttingDown = true;
      cleanupPidFile(VIBE_START_PID_FILE);
      ServerStartRepository.stopAllProcesses();
      // On SIGTERM the new vibe start process already wrote the offline hint.
      process.exit(0);
    };

    process.on("SIGINT", handleShutdownOnInt);
    process.on("SIGTERM", handleShutdownOnTerm);

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
          handleShutdownOnInt();
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
      const formatted = data.toString();
      process.stdout.write(formatted);
      appendRawToServerLog(formatted);
    });
    tanstackProcess.stderr?.on("data", (data: Buffer) => {
      const formatted = data.toString();
      process.stderr.write(formatted);
      appendRawToServerLog(formatted);
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
    const pidOnPort = getPidOnPort(port);
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
      if (getPidOnPort(port) === undefined) {
        return;
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
        await import("next-vibe/realtime/server");

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
        const profilingBanner = `
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
`;
        process.stdout.write(profilingBanner);
        appendRawToServerLog(profilingBanner);
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
          const formatted = formatNextjs(chunk.toString());
          process.stdout.write(formatted);
          void appendRawToServerLog(formatted);
        });
        proc.stderr?.on("data", (chunk: Buffer) => {
          const formatted = formatNextjs(chunk.toString());
          process.stderr.write(formatted);
          void appendRawToServerLog(formatted);
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
          const likelyOom = signal === "SIGKILL";
          if (isCleanExit) {
            // clean exit without shuttingDown flag = unexpected (e.g. Next.js self-exited 0)
            logger.warn(
              "Next.js exited cleanly but unexpectedly - restarting",
              diag,
            );
          } else {
            logger.error(
              likelyOom
                ? "Next.js killed by SIGKILL (likely OOM) - restarting"
                : signal !== null
                  ? `Next.js killed by signal ${signal} - restarting`
                  : `Next.js exited with code ${String(code)} - restarting`,
              { ...diag, likelyOom },
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

      // Start writing periodic health snapshots so the supervisor has pre-crash memory data
      ServerStartRepository.startHealthSnapshot(logger);

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
        // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- server-liveness probe (waits for the just-started server to accept requests)
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
    // Stop the health snapshot interval
    if (ServerStartRepository.healthSnapshotInterval !== null) {
      clearInterval(ServerStartRepository.healthSnapshotInterval);
      ServerStartRepository.healthSnapshotInterval = null;
    }

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
          // SIGKILL fallback after 5s if SIGTERM didn't work.
          // All callers invoke process.exit() immediately after stopAllProcesses(),
          // so this timer only fires if the process stays alive (e.g. tasks-only mode).
          setTimeout(() => {
            try {
              if (!process.killed) {
                process.kill("SIGKILL");
              }
            } catch {
              // Already dead
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
