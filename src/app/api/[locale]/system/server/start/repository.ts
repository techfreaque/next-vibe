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
import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  ServerStartRequestOutput,
  ServerStartResponseOutput,
} from "./definition";

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

/**
 * Server Start Repository Interface
 */
export interface ServerStartRepository {
  startServer(
    data: ServerStartRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ServerStartResponseOutput>>;
}

/**
 * Server Start Repository Implementation
 */
export class ServerStartRepositoryImpl implements ServerStartRepository {
  private taskRunnerStarted = false;
  private nextServerProcess: ChildProcess | null = null;
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

      // Database setup FIRST — must happen before task runner so all DB
      // connections (migrations, seeds, pulse) use the preview postgres.
      if (!data.skipDbSetup) {
        output.push("");
        output.push("🗄️  Database Setup");

        // DATABASE_URL was already set to LOCAL_MODE_DATABASE_URL by the CLI
        // environment loader (runtime/environment.ts) before any module loaded.
        output.push(
          `   🔗 Using LOCAL_MODE_DATABASE_URL: ${process.env["DATABASE_URL"]}`,
        );

        try {
          // Dynamic import: must happen AFTER DATABASE_URL is set
          const { dbUtilsRepository } =
            await import("../../db/utils/repository");
          const dockerCheckResult =
            await dbUtilsRepository.isDockerAvailable(logger);

          if (dockerCheckResult.success && dockerCheckResult.data) {
            output.push(
              "   🐘 Starting preview PostgreSQL (docker-compose.preview.yml)...",
            );

            const { dockerOperationsRepository } =
              await import("../../db/utils/docker-operations/repository");
            const dbStartResult =
              await dockerOperationsRepository.dockerComposeUp(
                logger,
                locale,
                "docker-compose.preview.yml",
                60000,
                "vibe-preview",
              );

            if (dbStartResult.success) {
              output.push("   ✅ Preview PostgreSQL started (port 5433)");
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
        output.push("   ⏭️ Database setup skipped (--skip-db-setup flag used)");
      }

      output.push("");
      output.push("📋 Task Runner Setup");

      // Initialize single unified task runner for production environment
      if (!data.skipTaskRunner) {
        logger.info("Starting unified task runner for production");
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

          // Give the task runner a moment to initialize before proceeding
          await new Promise<void>((resolve) => {
            setTimeout(resolve, 500);
          });

          const status = unifiedTaskRunnerRepository.getStatus();
          if (status.running) {
            this.taskRunnerStarted = true;
            output.push("   ✅ Unified task runner started successfully");
            output.push(
              "   📊 Environment: production | Side tasks: disabled (cron only)",
            );
            logger.info("Task runner started successfully", {
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
        output.push("   ⏭️ Task runner skipped (--skip-task-runner flag used)");
      }

      if (!data.skipPre) {
        output.push("");
        output.push("🔄 Pre-Start Tasks");
        output.push("   🚀 Running production pre-start tasks...");

        // Run migrations (dynamic import — DB modules must load after DATABASE_URL is set)
        output.push("   📊 Running database migrations...");
        try {
          const { databaseMigrationRepository } =
            await import("../../db/migrate/repository");
          const migrateResult = await databaseMigrationRepository.runMigrations(
            {
              generate: false,
              dryRun: false,
              redo: false,
              schema: "public",
            },
            locale,
            logger,
          );

          if (migrateResult.success) {
            output.push("   ✅ Database migrations completed");
          } else {
            const errorMsg = `Failed to run migrations: ${migrateResult.messageParams?.error || "Unknown error"}`;
            errors.push(errorMsg);
            output.push(`   ❌ ${errorMsg}`);
            logger.error("Migration failed, cannot start server", {
              error: migrateResult.messageParams,
            });
            return fail({
              message: "app.api.system.server.start.post.errors.server.title",
              errorType: ErrorResponseTypes.INTERNAL_ERROR,
              messageParams: {
                error: errorMsg,
              },
            });
          }
        } catch (error) {
          const errorMsg = `Failed to run migrations: ${parseError(error).message}`;
          errors.push(errorMsg);
          output.push(`   ❌ ${errorMsg}`);
          logger.error("Migration error, cannot start server", {
            error: errorMsg,
          });
          return fail({
            message: "app.api.system.server.start.post.errors.server.title",
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
            messageParams: {
              error: errorMsg,
            },
          });
        }

        // Seed database (dynamic import — DB modules must load after DATABASE_URL is set)
        output.push("   🌱 Seeding production database...");
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

        output.push("   🎯 Pre-start tasks completed");
      } else {
        output.push("");
        output.push("🔄 Pre-Start Tasks");
        output.push("   ⏭️ Pre-start tasks skipped (--skip-pre flag used)");
      }

      // Load task registry and verify task runner system
      if (!data.skipTaskRunner && this.taskRunnerStarted) {
        output.push("");
        output.push("📋 Task Registry & Runner System");

        try {
          output.push("   🔍 Loading production task registry...");

          try {
            // Import task registry (this will auto-generate if needed)
            const { taskRegistry } =
              await import("../../generated/tasks-index");

            logger.info("Task registry loaded successfully", {
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

            logger.info("Task runner system operational", {
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
      } else if (data.skipTaskRunner) {
        output.push("");
        output.push("📋 Task Registry & Runner System");
        output.push("   ⏭️ Task runner skipped (--skip-task-runner flag used)");
      } else {
        output.push("");
        output.push("📋 Task Registry & Runner System");
        output.push("   ❌ Task runner not initialized (startup failed)");
      }

      output.push("");
      output.push("⚡ Next.js Production Server");

      // Check if we should skip running Next.js commands
      if (data.skipNextCommand) {
        output.push(
          "   ⏭️ Next.js server startup skipped (--skip-next-command flag used)",
        );
      } else {
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
      if (!data.skipNextCommand && this.nextServerProcess) {
        runningServices.push(`next-start (PID: ${this.nextServerProcess.pid})`);
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

      // Set up signal handlers for graceful shutdown
      const handleShutdown = (signal: string): void => {
        process.stdout.write(
          `\n🛑 Received ${signal}, shutting down gracefully...\n`,
        );
        this.stopAllProcesses();
        process.stdout.write("✅ All processes stopped. Goodbye! 👋\n");
        process.exit(0);
      };

      process.on("SIGINT", () => handleShutdown("SIGINT"));
      process.on("SIGTERM", () => handleShutdown("SIGTERM"));

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

          // Check if processes are still alive
          if (this.nextServerProcess?.killed) {
            logger.warn("Next.js server process died, attempting restart...");
            this.startNextServer(port, logger).catch((error) => {
              logger.error(
                "Failed to restart Next.js server",
                parseError(error),
              );
            });
          }
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
      logger.info(`Killed stale process on port ${port}`);
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
    return await new Promise((resolve) => {
      try {
        logger.info("Starting Next.js production server", { port });

        // Kill any stale process on the target port
        this.killProcessOnPort(port, logger);

        // Spawn Next.js production server using bun
        const nextProcess = spawn(
          "bun",
          ["run", "next", "start", "--port", port.toString()],
          {
            stdio: ["pipe", "pipe", "pipe"],
            env: {
              ...process.env,
              NODE_ENV: "production",
            },
          },
        );

        this.nextServerProcess = nextProcess;
        this.runningProcesses.set("next-start", nextProcess);

        let serverStarted = false;
        let startupTimeout: ReturnType<typeof setTimeout>;

        // Set up timeout for server startup
        startupTimeout = setTimeout(() => {
          if (!serverStarted) {
            serverStarted = true;
            logger.warn("Next.js server startup timeout");
            // eslint-disable-next-line @typescript-eslint/no-floating-promises, eslint-plugin-promise/no-multiple-resolved
            resolve({ success: false, message: "Server startup timeout" });
          }
        }, 30000); // 30 second timeout

        // Handle stdout to detect when server is ready
        nextProcess.stdout?.on("data", (data: Buffer) => {
          const output = data.toString();
          logger.debug("Next.js stdout", { output: output.trim() });

          // Check for server ready indicators
          if (
            output.includes("Ready") ||
            output.includes("started server") ||
            output.includes(`http://localhost:${port}`)
          ) {
            if (!serverStarted) {
              serverStarted = true;
              clearTimeout(startupTimeout);
              logger.info("Next.js production server is ready", { port });
              // eslint-disable-next-line @typescript-eslint/no-floating-promises, eslint-plugin-promise/no-multiple-resolved
              resolve({ success: true });
            }
          }
        });

        // Handle stderr
        nextProcess.stderr?.on("data", (data: Buffer) => {
          const error = data.toString();
          logger.warn("Next.js stderr", { error: error.trim() });
        });

        // Handle process exit
        nextProcess.on("exit", (code, signal) => {
          logger.info("Next.js process exited", { code, signal });
          this.runningProcesses.delete("next-start");
          this.nextServerProcess = null;

          if (!serverStarted) {
            serverStarted = true;
            clearTimeout(startupTimeout);
            // eslint-disable-next-line @typescript-eslint/no-floating-promises, eslint-plugin-promise/no-multiple-resolved
            resolve({
              success: false,
              message: `Process exited with code ${code}`,
            });
          }
        });

        // Handle process errors
        nextProcess.on("error", (error) => {
          logger.error("Next.js process error", { error: error.message });

          if (!serverStarted) {
            serverStarted = true;
            clearTimeout(startupTimeout);
            // eslint-disable-next-line @typescript-eslint/no-floating-promises, eslint-plugin-promise/no-multiple-resolved
            resolve({ success: false, message: error.message });
          }
        });

        // Give the process a moment to start
        // eslint-disable-next-line eslint-plugin-promise/no-multiple-resolved
        setTimeout(() => {
          if (!serverStarted && nextProcess.pid) {
            // Process started but not ready yet, that's normal
            logger.debug("Next.js process started, waiting for ready signal", {
              pid: nextProcess.pid,
            });
          }
        }, 1000);
      } catch (error) {
        logger.error("Failed to spawn Next.js process", {
          error: parseError(error).message,
        });
        resolve({ success: false, message: parseError(error).message });
      }
    });
  }

  /**
   * Stop all running processes
   */
  private stopAllProcesses(): void {
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
    this.nextServerProcess = null;
  }
}

/**
 * Default repository instance
 */
export const serverStartRepository = new ServerStartRepositoryImpl();
