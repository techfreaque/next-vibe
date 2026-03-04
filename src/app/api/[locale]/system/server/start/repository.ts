/**
 * Server Start Repository
 * Handles production server startup operations with parallel task runner and Next.js server startup
 * Implements task system specification requirements for production environment
 */

/* eslint-disable i18next/no-literal-string */
// CLI output messages don't need internationalization
// Process environment access is required for server configuration

import type { ChildProcess } from "node:child_process";
import { execSync, spawn } from "node:child_process";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
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
import type { scopedTranslation } from "./i18n";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

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

/** Mask credentials in a database URL: postgres://u***:p***@host:5432/db */
function maskDatabaseUrl(url: string | undefined): string {
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

/**
 * Server Start Repository Interface
 */
export interface ServerStartRepository {
  startServer(
    data: ServerStartRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: ModuleT,
  ): Promise<ResponseType<ServerStartResponseOutput>>;
}

/**
 * Server Start Repository Implementation
 */
export class ServerStartRepositoryImpl implements ServerStartRepository {
  private taskRunnerStarted = false;
  private nextServerProcess: ChildProcess | null = null;
  private wsServerHandle: WebSocketServerHandle | null = null;
  private runningProcesses: Map<string, ChildProcess> = new Map();

  async startServer(
    data: ServerStartRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ServerStartResponseOutput>> {
    const startTime = Date.now();
    const output: string[] = [];
    const errors: string[] = [];

    // Derive port: explicit --port > NEXT_PUBLIC_APP_URL port > default 3000
    const port = data.port ?? portFromUrl(env.NEXT_PUBLIC_APP_URL) ?? 3000;

    // Mode-based process splitting: "all" (default), "web", "tasks"
    const mode = data.mode ?? "all";
    const runDb = data.dbSetup && (mode === "all" || mode === "tasks");
    const runTasks = data.taskRunner && (mode === "all" || mode === "tasks");
    const runSeed = data.seed && (mode === "all" || mode === "tasks");
    const runNext = data.nextServer && (mode === "all" || mode === "web");

    try {
      output.push("🚀 Starting Vibe Production Server");
      output.push(
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      );

      // Ensure production environment (NODE_ENV should be set externally)
      const currentEnv = process.env["NODE_ENV"] || "production";
      output.push("🌍 Environment Setup");
      output.push(`   ✅ Environment: ${currentEnv}`);
      output.push(`   🌐 Target port: ${port}`);

      output.push(`   🔀 Mode: ${mode}`);

      // Database setup FIRST — must happen before task runner so all DB
      // connections (seeds, pulse) use the preview postgres.
      if (runDb) {
        output.push("");
        output.push("🗄️  Database Setup");

        // DATABASE_URL port was already swapped to PREVIEW_DB_PORT by the CLI
        // environment loader (runtime/environment.ts) before any module loaded.
        output.push(
          `   🔗 Using preview DATABASE_URL: ${maskDatabaseUrl(process.env["DATABASE_URL"])}`,
        );

        try {
          // Dynamic import: must happen AFTER DATABASE_URL is set
          const { dbUtilsRepository } =
            await import("../../db/utils/repository");
          const { t: dbUtilsT } = dbUtilsScopedTranslation.scopedT(locale);
          const dockerCheckResult = await dbUtilsRepository.isDockerAvailable(
            dbUtilsT,
            logger,
          );

          if (dockerCheckResult.success && dockerCheckResult.data) {
            output.push(
              "   🐘 Starting preview PostgreSQL (docker-compose.preview.yml)...",
            );

            const { dockerOperationsRepository } =
              await import("../../db/utils/docker-operations/repository");
            const { t: dockerOpsT } =
              dockerOperationsScopedTranslation.scopedT(locale);
            const dbStartResult =
              await dockerOperationsRepository.dockerComposeUp(
                logger,
                dockerOpsT,
                "docker-compose.preview.yml",
                60000,
                "vibe-preview",
              );

            if (dbStartResult.success) {
              output.push(
                `   ✅ Preview PostgreSQL started (port ${process.env["PREVIEW_DB_PORT"] || "5433"})`,
              );
            } else {
              output.push(
                "   ⚠️ Failed to start preview PostgreSQL, continuing anyway",
              );
              logger.warn("Failed to start preview postgres", {
                error: dbStartResult.message,
              });
            }

            // Wait for database to be ready
            await this.waitForDatabaseConnection(logger);
          } else {
            output.push(
              "   ⚠️ Docker unavailable (continuing without managed DB)",
            );
          }

          // Run migrations against the preview database
          output.push("   🔄 Running database migrations...");
          try {
            const migrateResult = execSync("bunx drizzle-kit migrate", {
              encoding: "utf-8",
              cwd: process.cwd(),
              env: { ...process.env },
            });
            logger.debug("Migrations completed", {
              output: migrateResult.trim(),
            });
            output.push("   ✅ Database migrations completed");
          } catch (migrateError) {
            const migrateMsg = parseError(migrateError).message;
            errors.push(`Migration failed: ${migrateMsg}`);
            output.push(`   ❌ Migration failed: ${migrateMsg}`);
            logger.error("Migration failed during start", {
              error: migrateMsg,
            });
          }
        } catch (error) {
          const errorMsg = parseError(error).message;
          output.push(`   ⚠️ Database setup failed: ${errorMsg}`);
          logger.warn("Database setup failed, continuing anyway", {
            error: errorMsg,
          });
        }
      } else {
        output.push("");
        output.push("🗄️  Database Setup");
        output.push(
          `   ⏭️ Database setup skipped (${mode !== "all" ? `--mode=${mode}` : "--db-setup=false"})`,
        );
      }

      // Deploy db-functions (idempotent — runs after every migration)
      try {
        const { deployDbFunctions } =
          await import("@/app/api/[locale]/system/db/db-functions/deploy");
        await deployDbFunctions(logger);
      } catch (error) {
        const errorMsg = parseError(error).message;
        output.push(
          `   \u26A0\uFE0F DB functions deployment failed: ${errorMsg}`,
        );
        logger.warn("DB functions deployment failed, continuing anyway", {
          error: errorMsg,
        });
      }

      output.push("");
      output.push("📋 Task Runner Setup");

      // Initialize single unified task runner for production environment
      if (runTasks) {
        logger.debug("Starting unified task runner for production");
        output.push(
          "   🔄 Initializing unified task runner for production environment...",
        );

        try {
          // Import and start the unified task runner
          const { unifiedTaskRunnerRepository } =
            await import("../../unified-interface/tasks/unified-runner/repository");

          // Set environment to production
          unifiedTaskRunnerRepository.environment = "production";

          // Start the task runner in the background - manageRunner("start") blocks forever,
          // so we must NOT await it or Next.js will never start.
          void unifiedTaskRunnerRepository
            .manageRunner(
              { action: "start", taskFilter: "cron", dryRun: false },
              user,
              locale,
              logger,
            )
            .catch((error) => {
              logger.error("Task runner exited unexpectedly", {
                error: parseError(error).message,
              });
            });

          // Poll until running or timeout (imports + seed can take several seconds)
          const pollStart = Date.now();
          const POLL_TIMEOUT_MS = 10_000;
          const POLL_INTERVAL_MS = 200;
          while (
            !unifiedTaskRunnerRepository.isRunning &&
            Date.now() - pollStart < POLL_TIMEOUT_MS
          ) {
            await new Promise<void>((resolve) => {
              setTimeout(resolve, POLL_INTERVAL_MS);
            });
          }

          const status = unifiedTaskRunnerRepository.getStatus();
          if (status.running) {
            this.taskRunnerStarted = true;
            output.push("   ✅ Unified task runner started successfully");
            output.push(
              "   📊 Environment: production | Side tasks: disabled (cron only)",
            );
            logger.debug("Task runner started successfully", {
              environment: "production",
              supportsTaskRunners: false,
            });
          } else {
            errors.push("Failed to start unified task runner");
            output.push("   ❌ Failed to start unified task runner");
            logger.error("Failed to start task runner", {
              message: "Task runner did not reach running state",
            });
          }
        } catch (error) {
          const errorMsg = `Failed to initialize task runner: ${parseError(error).message}`;
          errors.push(errorMsg);
          output.push(`   ❌ Task runner initialization failed: ${errorMsg}`);
          logger.error("Task runner initialization failed", {
            error: errorMsg,
          });
        }
      } else {
        output.push(
          `   ⏭️ Task runner skipped (${mode !== "all" ? `--mode=${mode}` : "--task-runner=false"})`,
        );
      }

      if (runSeed) {
        output.push("");
        output.push("🌱 Database Seeding");

        try {
          const { seedDatabase } =
            await import("@/app/api/[locale]/system/db/seed/seed-manager");
          await seedDatabase("prod", logger, locale);
          output.push("   ✅ Database seeding completed");
        } catch (error) {
          const errorMsg = `Failed to seed database: ${parseError(error).message}`;
          errors.push(errorMsg);
          output.push(`   ❌ ${errorMsg}`);
        }
      } else {
        output.push("");
        output.push("🌱 Database Seeding");
        output.push("   ⏭️ Seeding skipped (--seed=false)");
      }

      // Load task registry and verify task runner system
      if (runTasks && this.taskRunnerStarted) {
        output.push("");
        output.push("📋 Task Registry & Runner System");

        try {
          output.push("   🔍 Loading production task registry...");

          try {
            // Import task registry (this will auto-generate if needed)
            const { taskRegistry } =
              await import("../../generated/tasks-index");

            logger.debug("Task registry loaded successfully", {
              cronTasks: taskRegistry.cronTasks.length,
              taskRunners: taskRegistry.taskRunners.length,
              totalTasks: taskRegistry.allTasks.length,
            });

            output.push(`   ✅ Task registry loaded successfully`);
            output.push(
              `   📊 Found ${taskRegistry.cronTasks.length} cron tasks (side tasks disabled in production)`,
            );
            output.push(
              `   🎯 Total tasks available: ${taskRegistry.allTasks.length}`,
            );

            // Get task runner status
            const { unifiedTaskRunnerRepository } =
              await import("../../unified-interface/tasks/unified-runner/repository");
            const status = unifiedTaskRunnerRepository.getStatus();

            logger.debug("Task runner system operational", {
              environment: "production",
              running: status.running,
              activeTasks: status.activeTasks.length,
              supportsTaskRunners: false,
            });

            output.push("   ✅ Production task runner system is operational");
            output.push(
              `   🔄 Active cron tasks: ${status.activeTasks.length}`,
            );
          } catch (registryError) {
            logger.warn(
              "Task registry not available, task runner will start without tasks",
              {
                error: parseError(registryError).message,
              },
            );
            output.push("   ⚠️ Task registry not available");
            output.push("   🔄 Task runner starting without predefined tasks");
          }
        } catch (error) {
          const errorMsg = `Failed to start production task runner: ${parseError(error).message}`;
          errors.push(errorMsg);
          output.push(`   ❌ Task runner system failed: ${errorMsg}`);
        }
      } else if (!runTasks) {
        output.push("");
        output.push("📋 Task Registry & Runner System");
        output.push(
          `   ⏭️ Task runner skipped (${mode !== "all" ? `--mode=${mode}` : "--task-runner=false"})`,
        );
      } else {
        output.push("");
        output.push("📋 Task Registry & Runner System");
        output.push("   ❌ Task runner not initialized (startup failed)");
      }

      output.push("");
      output.push("⚡ Next.js Production Server");

      if (runNext) {
        output.push("   🚀 Starting Next.js production server in parallel...");
        output.push(`   🌐 Target port: ${port}`);

        try {
          // Start Next.js production server as a child process
          const nextServerResult = await this.startNextServer(port, logger);

          if (nextServerResult.success) {
            output.push("   ✅ Next.js production server started successfully");
            output.push(`   🌍 Server is live at http://localhost:${port}`);
            output.push("   🏭 Production mode enabled");
          } else {
            errors.push("Failed to start Next.js production server");
            output.push("   ❌ Failed to start Next.js production server");
            if (nextServerResult.message) {
              output.push(`   💡 Reason: ${nextServerResult.message}`);
            }
          }
        } catch (error) {
          const errorMsg = `Failed to start Next.js server: ${parseError(error).message}`;
          errors.push(errorMsg);
          output.push(`   ❌ Next.js server startup failed: ${errorMsg}`);
          logger.error("Next.js server startup failed", { error: errorMsg });
        }
      } else {
        output.push(
          `   ⏭️ Next.js server skipped (${mode !== "all" ? `--mode=${mode}` : "--next-server=false"})`,
        );
      }

      const duration = Date.now() - startTime;
      const serverUrl = `http://localhost:${port}`;

      // Add summary section
      output.push("");
      output.push(
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      );
      output.push("🎉 Production Server Setup Complete");
      output.push("");

      const runningServices = [];
      if (this.taskRunnerStarted) {
        runningServices.push("unified-task-runner");
      }
      if (runNext && this.nextServerProcess) {
        runningServices.push(`next-server (HTTP on port ${port})`);
      }
      if (this.wsServerHandle) {
        runningServices.push(`ws-proxy (WebSocket on port ${port} at /ws)`);
      }

      if (runningServices.length > 0) {
        output.push("✅ Running Services:");
        runningServices.forEach((service) => {
          output.push(`   • ${service}`);
        });
      }

      if (errors.length > 0) {
        output.push("");
        output.push("❌ Issues:");
        errors.forEach((error) => {
          output.push(`   • ${error}`);
        });
      }

      output.push("");
      output.push(`🌐 Server URL: ${serverUrl}`);
      output.push(`🏭 Environment: production`);
      output.push(`⏱️  Setup time: ${(duration / 1000).toFixed(2)}s`);

      if (errors.length === 0) {
        output.push("");
        output.push("🚀 Production server ready! 🎯");
      } else {
        output.push("");
        output.push(`⚠️  Setup completed with ${errors.length} warning(s)`);
      }

      output.push(
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      );
      output.push("");
      output.push("🔄 Production server is running...");
      output.push("💡 Press Ctrl+C to stop");
      output.push("");

      // Log the initial output using stdout for CLI display
      process.stdout.write(`${output.join("\n")}\n`);

      // Kill any previous vibe start instance, then write our PID
      killPreviousInstance(VIBE_START_PID_FILE, logger);
      writePidFile(VIBE_START_PID_FILE, logger);

      // Set up signal handlers for graceful shutdown
      const handleShutdown = (signal: string): void => {
        process.stdout.write(
          `\n🛑 Received ${signal}, shutting down gracefully...\n`,
        );
        cleanupPidFile(VIBE_START_PID_FILE);
        this.stopAllProcesses();
        process.stdout.write("✅ All processes stopped. Goodbye! 👋\n");
        process.exit(0);
      };

      process.on("SIGINT", () => handleShutdown("SIGINT"));
      process.on("SIGTERM", () => handleShutdown("SIGTERM"));

      // SIGUSR1: hot-restart server (triggered by `vibe rebuild`) — only when running Next.js
      if (!runNext) {
        logger.debug(
          "SIGUSR1 handler not registered (Next.js not running in this mode)",
        );
      }
      if (runNext) {
        process.on("SIGUSR1", () => {
          logger.info("Received SIGUSR1 — restarting server...");
          process.stdout.write(
            "\n🔄 SIGUSR1 received — restarting server...\n",
          );

          // Stop old servers, then start new ones
          if (this.wsServerHandle) {
            this.wsServerHandle.stop();
            this.wsServerHandle = null;
          }
          if (this.nextServerProcess && !this.nextServerProcess.killed) {
            this.nextServerProcess.kill("SIGTERM");
            this.nextServerProcess = null;
          }

          this.startNextServer(port, logger)
            .then((result) => {
              if (result.success) {
                process.stdout.write("✅ Server restarted successfully\n");
                logger.info("Server restarted via SIGUSR1");
              } else {
                process.stdout.write(
                  `❌ Server restart failed: ${result.message}\n`,
                );
                logger.error("Server restart failed", {
                  message: result.message,
                });
              }
              return result;
            })
            .catch((error) => {
              logger.error("Server restart error after SIGUSR1", {
                error: parseError(error).message,
              });
            });
        });
      }

      // Keep the process alive and log periodic status
      let logCounter = 0;
      setInterval(() => {
        logCounter++;

        // Log status every 60 seconds (production is less chatty)
        if (logCounter % 60 === 0) {
          const uptime = Math.floor((Date.now() - startTime) / 1000);
          const minutes = Math.floor(uptime / 60);
          const seconds = uptime % 60;

          logger.info(
            `Status: ${runningServices.length} services running | Uptime: ${minutes}m ${seconds}s`,
          );

          // The Bun server runs in-process, so it doesn't "die" like a child process.
          // No restart watchdog needed — Bun.serve() is stable within the process.
        }
      }, 1000);

      // Never return - keep the process alive indefinitely
      return await new Promise<never>(() => {
        // This promise never resolves, keeping the API call alive
        // The only way out is through signal handlers
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      const parsedError = parseError(error);

      errors.push(
        `❌ Failed to start production server: ${parsedError.message}`,
      );

      logger.error("Production server startup failed", {
        output: output.join("\n"),
        error: parsedError.message,
        duration: `${(duration / 1000).toFixed(2)}s`,
      });

      process.exit(1);
    }
  }

  /**
   * Wait for database connection to be ready
   */
  private async waitForDatabaseConnection(
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
   * Start Next.js production server as a child process
   */
  /**
   * Kill any process occupying the given port
   */
  private killProcessOnPort(port: number, logger: EndpointLogger): void {
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

  private async startNextServer(
    port: number,
    logger: EndpointLogger,
  ): Promise<{ success: boolean; message?: string }> {
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
      this.killProcessOnPort(nextPort, logger);
      if (disableProxy) {
        this.killProcessOnPort(wsPort, logger);
      }

      // --- Start Next.js ---
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
          } as NodeJS.ProcessEnv,
        },
      );
      this.nextServerProcess = nextProcess;

      // --- Start WS server (proxy or sidecar depending on mode) ---
      const wsHandle = startWebSocketServer({ port: wsPort, logger });
      this.wsServerHandle = wsHandle;

      // Wait for Next.js to be ready on its port
      await this.waitForNextServer(
        `http://127.0.0.1:${nextPort}`,
        30000,
        logger,
      );

      logger.info(`Next.js production server ready on port ${port}`);
      return { success: true };
    } catch (error) {
      logger.error("Failed to start server", {
        error: parseError(error).message,
      });
      return { success: false, message: parseError(error).message };
    }
  }

  /**
   * Wait for Next.js to respond on the given URL.
   */
  private async waitForNextServer(
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
  private stopAllProcesses(): void {
    // Stop the WS sidecar
    if (this.wsServerHandle) {
      try {
        this.wsServerHandle.stop();
      } catch {
        // Ignore errors when stopping WS server
      }
      this.wsServerHandle = null;
    }

    // Stop Next.js child process
    if (this.nextServerProcess && !this.nextServerProcess.killed) {
      try {
        this.nextServerProcess.kill("SIGTERM");
      } catch {
        // Ignore
      }
    }
    this.nextServerProcess = null;

    // Stop any remaining child processes (task runner etc.)
    for (const [, process] of this.runningProcesses) {
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
    this.runningProcesses.clear();
  }
}

/**
 * Default repository instance
 */
export const serverStartRepository = new ServerStartRepositoryImpl();
