/**
 * Development Server Repository
 * Orchestrates the dev session: ports, PID file, tty, logging capture,
 * shutdown — and delegates the seams:
 *   - database setup      → ./db-setup                 (omitted in DB-less forks)
 *   - Next.js dev server  → ../frameworks/next-app/dev-server  (omitted in TanStack-only forks)
 *   - TanStack dev server → ../frameworks/tanstack-start/dev-server
 * Implements task system specification requirements
 */

// CLI output messages don't need internationalization

import type { ChildProcess } from "node:child_process";
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeSync } from "node:fs";

import { coreEnv } from "../../../core/env";
import type { CountryLanguage } from "../../../core/i18n/core/config";
import { parseError } from "../../../core/utils/parse-error";
import { formatLogPrefix } from "../../../logger/create-logger";
import { loggerEnv } from "../../../logger/env";
import {
  appendRawToServerLog,
  truncateClientLogs,
  truncateServerLog,
  writeServerLogOfflineHint,
} from "../../../logger/file";
import {
  formatConfig,
  formatHint,
  formatSkip,
  formatStartup,
  formatTask,
  formatWarning,
} from "../../../logger/formatters";
import type { EndpointLogger, LoggerMetadata } from "../../../logger/types";
import { DEV_WATCHER_TASK_NAME } from "../../../tasks/dev-watcher/constants";
import { UnifiedTaskRunnerRepository } from "../../../tasks/unified-runner/repository";
import type { Task } from "../../../tasks/unified-runner/types";
import { ServerFramework } from "../enum";
import {
  ATLAS_PID_FILE,
  cleanupPidFile,
  getPidOnPort,
  HERMES_DEV_PID_FILE,
  killPreviousInstance,
  LOCAL_BASE_PORT,
  writePidFile,
} from "../pid";
import type { DevRequestOutput } from "./definition";

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

  private static shuttingDown = false;
  /** Active PID file — set by execute() to support vibe --hermes dev (HERMES_DEV_PID_FILE) */
  private static activePidFile: string = ATLAS_PID_FILE;

  static async execute(
    data: DevRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<never> {
    // vibe --hermes dev uses IS_PREVIEW_MODE=true to signal it targets the preview DB
    const isLocalDev = coreEnv.IS_PREVIEW_MODE;
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
    if (loggerEnv.VIBE_LOG_TARGET === "file") {
      try {
        const logPath = loggerEnv.VIBE_LOG_FILE;
        const logDir = loggerEnv.VIBE_LOG_PATH;
        if (logDir) {
          const { isAbsolute, join: pathJoin } = await import("node:path");
          const { spawn } = await import("node:child_process");
          const absDir = isAbsolute(logDir)
            ? logDir
            : pathJoin(coreEnv.PROJECT_ROOT ?? process.cwd(), logDir);
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
      DevRepository.portFromUrl(coreEnv.NEXT_PUBLIC_APP_URL) ??
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

    // Setup database if not skipped. The import is conditional on purpose —
    // this is the DB seam: a build without a database ships no ./db-setup
    // module and defaults skipDbSetup on, so the import never evaluates.
    let dbSetupSuccess = true;
    if (data.skipDbSetup) {
      logger.vibe(formatSkip("Database setup skipped"));
    } else {
      const { DevDatabaseSetup } = await import("./db-setup");
      dbSetupSuccess = await DevDatabaseSetup.setup(
        data,
        locale,
        logger,
        isLocalDev,
        DevRepository.activePidFile,
      );
    }
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
      `  ${formatHint("💡 Edit src/vibe/platforms/web/dev/definition.ts to change defaults")}`,
    );
    DevRepository.log("");
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
   * Start Next.js (or Vite for TanStack) dev server + WebSocket sidecar and wait forever.
   * Framework-specific startup lives behind the seams:
   * ../frameworks/next-app/dev-server and ../frameworks/tanstack-start/dev-server.
   */
  private static async startNextJsAndWait(
    port: number,
    logger: EndpointLogger,
    earlyExitHandler?: () => void,
    profile = false,
    tanstack = false,
    shutdownController?: AbortController,
  ): Promise<never> {
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

    const { serverSystemEnv } = await import("../env");
    const disableProxy = serverSystemEnv.VIBE_DISABLE_PROXY;

    // Import WS module to get NEXT_PORT_OFFSET
    const { startWebSocketServer, NEXT_PORT_OFFSET } =
      await import("../../../realtime/server/server");

    // In proxy mode (default): app server on port+NEXT_PORT_OFFSET, Bun proxy on main port.
    // In direct mode (VIBE_DISABLE_PROXY=true): app server on main port, WS sidecar on port+1000.
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

    // Controller over the Next.js child process - set in Next.js mode only
    let nextController: { current: () => ChildProcess | undefined } | undefined;

    // Vite server close function - set after startTanstackDev resolves
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
      const currentNext = nextController?.current();
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
          if (key === "") {
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
            const currentNext = nextController?.current();
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
            // (profiling artefacts are Next-specific — see next-app/dev-server)
            setTimeout((): void => {
              void import("../frameworks/next-app/dev-server").then((m) =>
                m.openNextProfiles(),
              );
            }, 1500);
          }
        });
      }
    }

    // TanStack Start mode: start Nitro SSR dev server via the tanstack seam.
    if (tanstack) {
      const { startTanstackDev } =
        await import("../frameworks/tanstack-start/dev-server");
      // TanStack Vite runs on nextPort (internal); WS proxy on wsPort forwards to it.
      // Pass wsPort as hmrPublicPort so Vite's HMR client points to the proxy, not the internal port.
      // IMPORTANT: Start Vite BEFORE the proxy so early browser requests don't interfere with
      // Nitro's startup (requests arriving on the proxy while Vite is still initializing can
      // cause Nitro to hang mid-startup, resulting in the server never becoming ready).
      const tanstackHandle = await startTanstackDev({
        internalPort: nextPort,
        hmrPublicPort: disableProxy ? undefined : wsPort,
        logger,
      });
      viteClose = tanstackHandle.close;

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

    // --- Next.js mode: spawn via the next-app seam ---
    const { startNextDev } = await import("../frameworks/next-app/dev-server");
    nextController = startNextDev({
      internalPort: nextPort,
      publicPort: port,
      disableProxy,
      profile,
      activePidFile: DevRepository.activePidFile,
      isShuttingDown: (): boolean => DevRepository.shuttingDown,
      onExit: (code): void => {
        shutdown(code === 0 ? 0 : 1);
      },
      logger,
    });

    // Keep the process alive indefinitely
    return await new Promise<never>(() => {
      // This promise never resolves
      // The only way out is through signal handlers
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
