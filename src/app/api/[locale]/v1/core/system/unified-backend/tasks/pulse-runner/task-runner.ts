/**
 * Pulse Task Runner
 * Dedicated task runner that calls the pulse repository once per minute
 * Designed for environments like Vercel that don't support persistent runners
 */
import "server-only";

import { parseError } from "next-vibe/shared/utils/parse-error";

import { TaskCategory } from "@/app/api/[locale]/v1/core/system/unified-backend/tasks/enum";

import type { TaskRunner } from "../types/repository";

/**
 * Simple console logger for task runners
 * Task runners don't have access to EndpointLogger, so we use console
 */
const logger = {
  info: (message: string, meta?: unknown): void => {
    // eslint-disable-next-line no-console, i18next/no-literal-string
    console.log(`ℹ️ [PULSE-RUNNER] ${message}`, meta ? meta : "");
  },
  error: (message: string, error?: Error | unknown): void => {
    // eslint-disable-next-line no-console, i18next/no-literal-string
    console.error(`❌ [PULSE-RUNNER] ${message}`, error || "");
  },
  warn: (message: string, meta?: unknown): void => {
    // eslint-disable-next-line no-console, i18next/no-literal-string
    console.warn(`⚠️ [PULSE-RUNNER] ${message}`, meta ? meta : "");
  },
  debug: (message: string, meta?: unknown): void => {
    // eslint-disable-next-line no-console, i18next/no-literal-string
    console.debug(`🐛 [PULSE-RUNNER] ${message}`, meta ? meta : "");
  },
};

/**
 * Pulse Task Runner Implementation
 * Calls the pulse repository every minute to trigger scheduled tasks
 */
const pulseTaskRunner: TaskRunner = {
  type: "task-runner",
  name: "pulse-runner",
  description:
    "app.api.v1.core.system.unifiedBackend.tasks.pulseRunner.description",
  category: TaskCategory.SYSTEM,
  enabled: true,
  priority: "HIGH",

  async run(signal: AbortSignal): Promise<void> {
    logger.info("Starting pulse task runner...");

    const PULSE_INTERVAL = 60 * 1000; // 1 minute
    let pulseCount = 0;

    while (!signal.aborted) {
      try {
        pulseCount++;
        logger.info(`Pulse #${pulseCount} - Triggering task execution...`);

        // Import pulse repository dynamically to avoid circular dependencies
        const { pulseHealthRepository } = await import("../pulse/repository");

        // Execute pulse with minimal configuration
        const pulseResult = await pulseHealthRepository.executePulse({
          dryRun: false,
          force: false,
        });

        if (pulseResult.success) {
          const summary = pulseResult.data.summary;
          logger.info(`Pulse #${pulseCount} completed`, {
            tasksExecuted: summary.tasksExecuted.length,
            tasksSucceeded: summary.tasksSucceeded.length,
            tasksFailed: summary.tasksFailed.length,
            executionTime: `${summary.totalExecutionTimeMs}ms`,
          });
        } else {
          logger.error(
            `Pulse #${pulseCount} failed`,
            new Error(pulseResult.message),
          );
        }
      } catch (error) {
        const errorMsg = parseError(error).message;
        logger.error("Pulse runner error", new Error(errorMsg));
      }

      // Wait for next pulse or abort signal
      await new Promise<void>((resolve) => {
        const timeout = setTimeout(() => resolve(), PULSE_INTERVAL);

        signal.addEventListener("abort", () => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }

    logger.info("Pulse task runner stopped");
  },

  async onError(error: Error): Promise<void> {
    logger.error("Pulse task runner error", parseError(error));
    // Could send alerts or notifications here
    await Promise.resolve();
  },

  async onShutdown(): Promise<void> {
    logger.info("Pulse task runner shutting down gracefully...");
    // Perform any cleanup if needed
    await Promise.resolve();
  },
};

/**
 * Export task runners for discovery
 */
export const taskRunners: TaskRunner[] = [pulseTaskRunner];

export default taskRunners;
