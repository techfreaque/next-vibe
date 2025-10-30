/**
 * Pulse Task Runner
 * Dedicated task runner that calls the pulse repository once per minute
 * Designed for environments like Vercel that don't support persistent runners
 */
import "server-only";

import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import { TaskCategory } from "@/app/api/[locale]/v1/core/system/unified-interface/tasks/enum";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { TaskRunner } from "../types/repository";

/**
 * Pulse Task Runner Implementation
 * Calls the pulse repository every minute to trigger scheduled tasks
 */
const pulseTaskRunner: TaskRunner = {
  type: "task-runner",
  name: "pulse-runner",
  description:
    "app.api.v1.core.system.unifiedInterface.tasks.pulseRunner.description",
  category: TaskCategory.SYSTEM,
  enabled: true,
  priority: "HIGH",

  async run(props: {
    signal: AbortSignal;
    logger: EndpointLogger;
    locale: CountryLanguage;
    cronUser: JwtPrivatePayloadType;
  }): Promise<void> {
    const { signal, logger } = props;
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
        let resolved = false;
        const safeResolve = () => {
          if (!resolved) {
            resolved = true;
            resolve();
          }
        };

        const timeout = setTimeout(safeResolve, PULSE_INTERVAL);

        signal.addEventListener("abort", () => {
          clearTimeout(timeout);
          safeResolve();
        });
      });
    }

    logger.info("Pulse task runner stopped");
  },

  async onError(props: {
    error: Error;
    logger: EndpointLogger;
    locale: CountryLanguage;
    cronUser: JwtPrivatePayloadType;
  }): Promise<void> {
    const { error, logger } = props;
    logger.error("Pulse task runner error", parseError(error));
    // Could send alerts or notifications here
    await Promise.resolve();
  },

  async onShutdown(props: {
    logger: EndpointLogger;
    locale: CountryLanguage;
    cronUser: JwtPrivatePayloadType;
  }): Promise<void> {
    const { logger } = props;
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
