/**
 * Development File Watcher Task Runner
 * Watches for file changes and triggers generators in development mode
 */

import "server-only";

import type { FSWatcher } from "fs";

import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";

import type { TaskRunner } from "../types/repository";

/**
 * Helper to safely access environment variables
 */
const getEnvVar = (key: string): string | undefined => {
  try {
    return process.env[key];
  } catch {
    return undefined;
  }
};

/**
 * Determine if a file change should trigger generator execution
 */
const shouldTriggerGeneration = (filename: string): boolean => {
  // Skip temporary files, node_modules, and generated files
  if (
    // FOR NOW WE SKIP ALL EXCEPT:
    !filename.includes("definition.ts") ||
    !filename.includes("route.ts") ||
    // JUST FOR NOW
    // eslint-disable-next-line i18next/no-literal-string
    filename.includes("node_modules") ||
    // eslint-disable-next-line i18next/no-literal-string
    filename.includes(".git") ||
    // eslint-disable-next-line i18next/no-literal-string
    filename.includes(".next") ||
    filename.includes("generated") ||
    filename.startsWith(".") ||
    // eslint-disable-next-line i18next/no-literal-string
    filename.includes("~") ||
    // eslint-disable-next-line i18next/no-literal-string
    filename.includes(".tmp")
  ) {
    return false;
  }

  // Only trigger for relevant file types
  // eslint-disable-next-line i18next/no-literal-string
  const relevantExtensions = [".ts", ".tsx", ".js", ".jsx", ".json"];
  const hasRelevantExtension = relevantExtensions.some((ext) =>
    filename.toLowerCase().endsWith(ext),
  );

  return hasRelevantExtension;
};

/**
 * Development File Watcher Task Runner
 * Only runs in development mode
 */
const devWatcherTaskRunner: TaskRunner = {
  type: "task-runner",
  name: "dev-file-watcher",
  description: "app.api.v1.core.system.tasks.devWatcher.description",
  category: "development",
  enabled: getEnvVar("NODE_ENV") === "development",
  priority: "MEDIUM",

  async run(logger: EndpointLogger, signal: AbortSignal): Promise<void> {
    // Only run in development
    if (getEnvVar("NODE_ENV") !== "development") {
      logger.debug("Dev watcher skipped (not in development mode)");
      return;
    }

    logger.debug("Starting smart development file watcher...");

    try {
      // Use actual file system watching instead of polling
      await startSmartFileWatcher(signal);
    } catch (error) {
      const errorMsg = parseError(error).message;
      logger.error(
        "Smart file watcher failed, falling back to polling",
        new Error(errorMsg),
      );

      // Fallback to polling if file watching fails
      await startPollingWatcher(signal);
    }
  },

  async onError(error: Error, logger: EndpointLogger): Promise<void> {
    logger.error("Dev watcher error", error);
    await Promise.resolve();
  },

  async onShutdown(logger: EndpointLogger): Promise<void> {
    logger.debug("Development file watcher shutting down...");
    await Promise.resolve();
  },
};

/**
 * Smart file watcher using fs.watch for real-time file changes
 */
const startSmartFileWatcher = async (
  signal: AbortSignal,
  logger: EndpointLogger,
): Promise<void> => {
  const fs = await import("node:fs");

  // Directories to watch for changes that require generator runs
  const watchPaths = [
    "src/app/api/[locale]/v1", // API routes
    "src/i18n", // Translation files
  ];

  // Debounce settings
  const DEBOUNCE_MS = 1000; // 1 second
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let changeCount = 0;

  const runGenerators = async (): Promise<void> => {
    try {
      changeCount++;
      logger.debug(
        `📁 File changes detected - Running generators (change #${changeCount})...`,
      );

      // Import generators dynamically
      const { generateAllRepository } = await import(
        "../../generators/generate-all/repository"
      );

      // Run generators with change detection
      const mockUser = {
        id: "00000000-0000-0000-0000-000000000000",
        isPublic: false,
      } as const;

      await generateAllRepository.generateAll(
        {
          outputDir: "src/app/api/[locale]/v1/core/system/generated",
          verbose: false,
          skipEndpoints: false,
          skipSeeds: true, // Seeds don't need frequent regeneration
          skipTaskIndex: false, // Keep task index updated
        },
        mockUser,
        "en-GLOBAL",
        logger,
      );

      logger.debug(`✅ Generators completed for change #${changeCount}`);
    } catch (error) {
      const errorMsg = parseError(error).message;
      logger.error("Generator execution failed", new Error(errorMsg));
    }
  };

  const debouncedRunGenerators = (): void => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
      void runGenerators();
    }, DEBOUNCE_MS);
  };

  const watchers: FSWatcher[] = [];

  // Set up file watchers for each path
  for (const watchPath of watchPaths) {
    try {
      if (fs.existsSync(watchPath)) {
        const watcher = fs.watch(
          watchPath,
          { recursive: true },
          (eventType, filename) => {
            if (filename && shouldTriggerGeneration(filename)) {
              logger.debug(`📝 File changed: ${filename} (${eventType})`);
              debouncedRunGenerators();
            }
          },
        );

        watchers.push(watcher);
        logger.debug(`👀 Watching ${watchPath} for changes...`);
      } else {
        logger.warn(`Watch path does not exist: ${watchPath}`);
      }
    } catch (error) {
      const errorMsg = parseError(error).message;
      logger.error(`Failed to watch ${watchPath}`, new Error(errorMsg));
    }
  }

  // Run generators once on startup
  logger.debug("🚀 Running initial generator scan...");
  await runGenerators();

  // Wait for abort signal
  return await new Promise<void>((resolve) => {
    signal.addEventListener("abort", () => {
      logger.debug("🛑 Stopping file watchers...");

      // Clean up debounce timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      // Close all watchers
      watchers.forEach((watcher) => {
        try {
          watcher.close();
        } catch (error) {
          logger.debug("Error closing watcher:", { error: String(error) });
        }
      });

      logger.debug("✅ File watchers stopped");
      resolve();
    });
  });
};

/**
 * Fallback polling watcher (original implementation)
 */
const startPollingWatcher = async (
  signal: AbortSignal,
  logger: EndpointLogger,
): Promise<void> => {
  logger.info("Using fallback polling watcher...");

  const WATCH_INTERVAL = 10000; // 10 seconds (less frequent than before)
  let watchCount = 0;

  while (!signal.aborted) {
    try {
      watchCount++;

      // Import generators dynamically
      const { generateAllRepository } = await import(
        "../../generators/generate-all/repository"
      );

      logger.info(`⏰ Polling cycle #${watchCount} - Running generators...`);

      // Run generators
      const mockUser = {
        id: "00000000-0000-0000-0000-000000000000",
        isPublic: false,
      } as const;

      await generateAllRepository.generateAll(
        {
          outputDir: "src/app/api/[locale]/v1/core/system/generated",
          verbose: false,
          skipEndpoints: false,
          skipSeeds: true,
          skipTaskIndex: false,
        },
        mockUser,
        "en-GLOBAL",
        logger,
      );

      logger.info(`✅ Polling cycle #${watchCount} completed`);
    } catch (error) {
      const errorMsg = parseError(error).message;
      logger.error("Polling watcher error", new Error(errorMsg));
    }

    // Wait for next cycle or abort signal
    await new Promise<void>((resolve) => {
      const timeout = setTimeout(() => resolve(), WATCH_INTERVAL);

      signal.addEventListener("abort", () => {
        clearTimeout(timeout);
        resolve();
      });
    });
  }

  logger.info("Polling watcher stopped");
};

/**
 * Database Health Monitor Task Runner
 * Monitors database connection and health
 */
const dbHealthMonitorTaskRunner: TaskRunner = {
  type: "task-runner",
  name: "db-health-monitor",
  description: "app.api.v1.core.system.tasks.dbHealthMonitor.description",
  category: "monitoring",
  enabled: true,
  priority: "LOW",

  async run(signal: AbortSignal, logger: EndpointLogger): Promise<void> {
    logger.info("Starting database health monitor...");

    const HEALTH_CHECK_INTERVAL = 30000; // 30 seconds
    let checkCount = 0;

    while (!signal.aborted) {
      try {
        checkCount++;

        // Import database dynamically
        const { db } = await import("../../db");
        const { sql } = await import("drizzle-orm");

        // Simple health check
        await db.execute(sql`SELECT 1`);

        if (checkCount % 10 === 0) {
          // Log every 10th check (5 minutes)
          logger.info(`Database health check #${checkCount} - OK`);
        }
      } catch (error) {
        const errorMsg = parseError(error).message;
        logger.error("Database health check failed", new Error(errorMsg));
      }

      // Wait for next check or abort signal
      await new Promise<void>((resolve) => {
        const timeout = setTimeout(() => resolve(), HEALTH_CHECK_INTERVAL);

        signal.addEventListener("abort", () => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }

    logger.info("Database health monitor stopped");
  },

  async onError(error: Error, logger: EndpointLogger): Promise<void> {
    logger.error("Database health monitor error", error);
    await Promise.resolve();
  },

  async onShutdown(logger: EndpointLogger): Promise<void> {
    logger.info("Database health monitor shutting down...");
    await Promise.resolve();
  },
};

/**
 * Export task runners for discovery
 */
export const taskRunners: TaskRunner[] = [
  devWatcherTaskRunner,
  dbHealthMonitorTaskRunner,
];

export default taskRunners;
