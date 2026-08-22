/**
 * Development File Watcher Task Runner
 *
 * Maintains a live in-memory index of all generator-relevant files.
 * On each file change, surgically updates the index and runs only the
 * generators whose slice is actually dirty - not everything every time.
 */

import "server-only";

import { coreEnv } from "../../core/env";
import { GeneratorRunner } from "../../core/generators/repository";
import type { LiveIndex } from "../../core/generators/shared/live-index";
import {
  buildLiveIndex,
  classifyFile,
  clearDirtyFlags,
  updateLiveIndex,
} from "../../core/generators/shared/live-index";
import { parseError } from "../../core/utils/parse-error";
import { Environment } from "../../env/env-util";
import type { EndpointLogger } from "../../logger/types";
import { CronTaskPriority, TaskCategory } from "../enum";
import { tasksEnv } from "../env";
import type { TasksTranslationKey } from "../i18n";
import type { TaskRunner } from "../unified-runner/types";
import { DEV_WATCHER_TASK_NAME } from "./constants";

export { DEV_WATCHER_TASK_NAME } from "./constants";

/**
 * Development File Watcher Task Runner
 * Only runs in development mode.
 */
const devWatcherTaskRunner: TaskRunner<TasksTranslationKey> = {
  type: "task-runner",
  name: DEV_WATCHER_TASK_NAME,
  description: "devWatcher.description",
  category: TaskCategory.DEVELOPMENT,
  enabled: coreEnv.NODE_ENV === Environment.DEVELOPMENT,
  priority: CronTaskPriority.MEDIUM,

  async run({ logger, signal, skipTanstack }) {
    if (coreEnv.NODE_ENV !== Environment.DEVELOPMENT) {
      logger.debug("Dev watcher skipped (not in development mode)");
      return;
    }

    logger.debug("Starting smart development file watcher...");

    try {
      await startSmartFileWatcher(signal, logger, skipTanstack);
    } catch (error) {
      const errorMsg = parseError(error).message;
      logger.error(
        "Smart file watcher failed, falling back to polling",
        new Error(errorMsg),
      );
      await startPollingWatcher(signal, logger);
    }
  },

  async onError({
    error,
    logger,
  }: {
    error: Error;
    logger: EndpointLogger;
  }): Promise<void> {
    logger.error("Dev watcher error", parseError(error));
    await Promise.resolve();
  },

  async onShutdown({ logger }: { logger: EndpointLogger }): Promise<void> {
    logger.debug("Development file watcher shutting down...");
    await Promise.resolve();
  },
};

// ---------------------------------------------------------------------------
// Smart watcher - live index + surgical generator dispatch
// ---------------------------------------------------------------------------

const startSmartFileWatcher = async (
  signal: AbortSignal,
  logger: EndpointLogger,
  skipTanstack: boolean,
): Promise<void> => {
  const fs = await import("node:fs");

  // Build the initial live index (full scan, runs once)
  logger.debug("📂 Building live index (initial full scan)...");
  const liveIndex: LiveIndex = buildLiveIndex();
  logger.debug(
    `Live index built: ${liveIndex.definitionFiles.size} definitions, ` +
      `${liveIndex.routeFiles.size} routes, ${liveIndex.taskFiles.size} tasks`,
  );

  // Debounce settings - shorter than before since we're doing less work per run
  const DEBOUNCE_MS = 300;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let changeCount = 0;

  const runDirtyGenerators = async (): Promise<void> => {
    const { dirty } = liveIndex;
    const dirtyNames: string[] = [];
    if (dirty.endpoints) {
      dirtyNames.push("endpoints");
    }
    if (dirty.clientRoutes) {
      dirtyNames.push("clientRoutes");
    }
    if (dirty.taskIndex) {
      dirtyNames.push("taskIndex");
    }
    if (dirty.emailTemplates) {
      dirtyNames.push("emailTemplates");
    }
    if (dirty.seeds) {
      dirtyNames.push("seeds");
    }
    if (dirty.promptFragments) {
      dirtyNames.push("promptFragments");
    }
    if (dirty.skillsIndex) {
      dirtyNames.push("skillsIndex");
    }
    if (dirty.graphSeedsIndex) {
      dirtyNames.push("graphSeedsIndex");
    }
    if (dirty.platformRoutes || (!skipTanstack && dirty.endpoints)) {
      dirtyNames.push("platformRoutes");
    }

    if (dirtyNames.length === 0) {
      logger.debug("⏭️  No dirty generators - skipping run");
      return;
    }

    changeCount++;
    logger.debug(
      `📁 Running dirty generators [${dirtyNames.join(", ")}] (change #${changeCount})...`,
    );

    // Snapshot dirty flags before clearing (clearing resets for next cycle)
    const dirtySnapshot = { ...dirty };
    clearDirtyFlags(liveIndex);

    // Map dirty flags → the generator keys they affect.
    const dirtyKeys = new Set<string>();
    if (dirtySnapshot.endpoints || dirtySnapshot.clientRoutes) {
      dirtyKeys.add("endpoint-framework");
      dirtyKeys.add("remote-capabilities");
    }
    if (dirtySnapshot.taskIndex) {
      dirtyKeys.add("tasks");
    }
    if (dirtySnapshot.emailTemplates) {
      dirtyKeys.add("email");
    }
    if (dirtySnapshot.seeds) {
      dirtyKeys.add("seeds");
    }
    if (dirtySnapshot.promptFragments) {
      dirtyKeys.add("prompt-fragments");
    }
    if (dirtySnapshot.skillsIndex) {
      dirtyKeys.add("skills");
    }
    if (dirtySnapshot.graphSeedsIndex) {
      dirtyKeys.add("dataflow");
    }
    if (
      dirtySnapshot.platformRoutes ||
      (!skipTanstack && dirtySnapshot.endpoints)
    ) {
      dirtyKeys.add("tanstack-routes");
      dirtyKeys.add("next-app");
      dirtyKeys.add("native-indexes");
    }

    try {
      await GeneratorRunner.runGenerators({
        logger,
        live: liveIndex,
        only: dirtyKeys,
        noCache: true,
      });
      logger.debug(`✅ Generators completed for change #${changeCount}`);
    } catch (error) {
      const errorMsg = parseError(error).message;
      logger.error("Generator execution failed", new Error(errorMsg));
    }
  };

  const debouncedRun = (): void => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
      void runDirtyGenerators();
    }, DEBOUNCE_MS);
  };

  // Base directory for resolving absolute paths from fs.watch relative filenames.
  // Use process.env.PWD (opaque to Turbopack's static analysis) instead of
  // process.cwd() so the bundler doesn't try to match the path as a file glob.
  // eslint-disable-next-line i18next/no-literal-string
  const cwd = process.env["PWD"] ?? process.cwd();
  // Use template string to prevent Turbopack from statically tracing paths
  // eslint-disable-next-line i18next/no-literal-string
  const apiWatchRoot = `${cwd}/src`;
  // eslint-disable-next-line i18next/no-literal-string, no-useless-concat
  const uiWatchRoot = `${cwd}/src/_pages`;

  const watchRoots = [apiWatchRoot, uiWatchRoot];
  const watchers: ReturnType<typeof fs.watch>[] = [];

  for (const watchRoot of watchRoots) {
    try {
      if (fs.existsSync(watchRoot)) {
        const watcher = fs.watch(
          watchRoot,
          { recursive: true },
          (eventType: string, filename: string | null) => {
            if (!filename) {
              return;
            }

            // classifyFile filters irrelevant files (node_modules, generated, etc.)
            const fileClass = classifyFile(filename);
            if (!fileClass) {
              return;
            }

            // Resolve to absolute path.
            // Use string concat instead of join() - Turbopack's static analysis
            // treats join(watchRoot, ...) as a broad glob over src/_pages/.
            const sep = watchRoot.endsWith("/") ? "" : "/";
            const absPath = watchRoot + sep + filename;

            logger.debug(`📝 File changed: ${filename} (${eventType})`);

            // Surgically update the live index
            updateLiveIndex(
              liveIndex,
              eventType as "rename" | "change",
              absPath,
            );

            // Schedule a debounced run of dirty generators
            debouncedRun();
          },
        );

        watchers.push(watcher);
        logger.debug(`👀 Watching ${watchRoot} for changes...`);
      } else {
        logger.warn(`Watch path does not exist: ${watchRoot}`);
      }
    } catch (error) {
      const errorMsg = parseError(error).message;
      logger.error(`Failed to watch ${watchRoot}`, new Error(errorMsg));
    }
  }

  // Run all generators once on startup (all dirty = true from buildLiveIndex)
  logger.debug("🚀 Running initial generator scan...");
  // Startup: skip seeds (they're run separately by the dev server db setup)
  liveIndex.dirty.seeds = false;
  await runDirtyGenerators();

  // In non-continuous mode: only run once on startup, then listen for 'r' to re-run
  if (!tasksEnv.DEV_WATCHER_CONTINUOUS) {
    logger.debug(
      "📌 One-shot mode (DEV_WATCHER_CONTINUOUS=false). Press 'r' to regenerate.",
    );

    // Close all fs.watch watchers - we don't need them in one-shot mode
    for (const watcher of watchers) {
      try {
        watcher.close();
      } catch (error) {
        logger.debug("Error closing watcher:", { error: String(error) });
      }
    }
    watchers.length = 0;

    // Listen for 'r' keypress to trigger a full regeneration
    await new Promise<void>((resolve) => {
      let done = false;
      const finish = (): void => {
        if (done) {
          return;
        }
        done = true;
        resolve();
      };

      const onData = (chunk: Buffer): void => {
        const key = chunk.toString();
        // Ctrl+C - restore terminal and re-raise SIGINT
        if (key === "\u0003") {
          if (process.stdin.isTTY) {
            process.stdin.setRawMode(false);
          }
          process.kill(process.pid, "SIGINT");
          return;
        }
        if (key === "r" || key === "R") {
          logger.debug("🔄 'r' pressed - re-running generators...");
          liveIndex.dirty.endpoints = true;
          liveIndex.dirty.clientRoutes = true;
          liveIndex.dirty.taskIndex = true;
          liveIndex.dirty.emailTemplates = true;
          liveIndex.dirty.seeds = false;
          liveIndex.dirty.promptFragments = true;
          liveIndex.dirty.skillsIndex = true;
          liveIndex.dirty.graphSeedsIndex = true;
          liveIndex.dirty.platformRoutes = true;
          void runDirtyGenerators();
        }
      };

      if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
      }
      process.stdin.resume();
      process.stdin.on("data", onData);

      signal.addEventListener(
        "abort",
        () => {
          if (debounceTimer) {
            clearTimeout(debounceTimer);
          }
          process.stdin.off("data", onData);
          if (process.stdin.isTTY) {
            process.stdin.setRawMode(false);
          }
          process.stdin.pause();
          logger.debug("✅ One-shot watcher stopped");
          finish();
        },
        { once: true },
      );
    });

    return;
  }

  // Wait for abort signal (continuous mode)
  await new Promise<void>((resolve) => {
    let done = false;
    const finish = (): void => {
      if (done) {
        return;
      }
      done = true;
      resolve();
    };

    signal.addEventListener(
      "abort",
      () => {
        logger.debug("🛑 Stopping file watchers...");

        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }

        for (const watcher of watchers) {
          try {
            watcher.close();
          } catch (error) {
            logger.debug("Error closing watcher:", { error: String(error) });
          }
        }

        logger.debug("✅ File watchers stopped");
        finish();
      },
      { once: true },
    );
  });
};

// ---------------------------------------------------------------------------
// Fallback polling watcher (no live index - rescans each cycle)
// ---------------------------------------------------------------------------

const startPollingWatcher = async (
  signal: AbortSignal,
  logger: EndpointLogger,
): Promise<void> => {
  logger.info("Using fallback polling watcher...");

  const WATCH_INTERVAL = 10000;
  let watchCount = 0;

  while (!signal.aborted) {
    try {
      watchCount++;
      const action = watchCount === 1 ? "Initial startup" : "Polling cycle";
      logger.info(`⏰ ${action} #${watchCount} - Running generators...`);

      await GeneratorRunner.runGenerators({ logger });

      logger.info(`✅ ${action} #${watchCount} completed`);
    } catch (error) {
      const errorMsg = parseError(error).message;
      logger.error("Polling watcher error", new Error(errorMsg));
    }

    await new Promise<void>((resolve) => {
      let done = false;
      const finish = (): void => {
        if (done) {
          return;
        }
        done = true;
        resolve();
      };
      const timeout = setTimeout(finish, WATCH_INTERVAL);
      signal.addEventListener(
        "abort",
        () => {
          clearTimeout(timeout);
          finish();
        },
        { once: true },
      );
    });
  }

  logger.info("Polling watcher stopped");
};

/**
 * Export task runners for discovery
 */
export const taskRunners: TaskRunner<string>[] = [devWatcherTaskRunner];

export default taskRunners;
