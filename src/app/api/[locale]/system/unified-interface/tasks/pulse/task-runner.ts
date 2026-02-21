/**
 * Pulse Task Runner
 * Dedicated task runner that calls the pulse repository once per minute
 * Designed for environments like Vercel that don't support persistent runners
 */
import "server-only";

import { parseError } from "next-vibe/shared/utils/parse-error";

import { serverSystemEnv } from "@/app/api/[locale]/system/server/env";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  formatDuration,
  formatTask,
} from "@/app/api/[locale]/system/unified-interface/shared/logger/formatters";
import {
  CronTaskPriority,
  TaskCategory,
} from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { TaskRunner } from "../unified-runner/types";

/**
 * Pulse Task Runner Implementation
 * Calls the pulse repository every minute to trigger scheduled tasks
 */
const pulseTaskRunner: TaskRunner = {
  type: "task-runner",
  name: "pulse-runner",
  description: "app.api.system.unifiedInterface.tasks.pulseRunner.description",
  category: TaskCategory.SYSTEM,
  enabled: true,
  priority: CronTaskPriority.HIGH,

  async run(props: {
    signal: AbortSignal;
    logger: EndpointLogger;
    systemLocale: CountryLanguage;
    userLocale: CountryLanguage;
    cronUser: JwtPrivatePayloadType;
  }): Promise<void> {
    const { signal, logger, systemLocale } = props;
    logger.info(formatTask("Starting pulse task runner...", "💓"));

    const PULSE_INTERVAL =
      (serverSystemEnv.PULSE_INTERVAL_MINUTES ?? 1) * 60 * 1000;
    logger.info(
      formatTask(
        `Pulse interval: ${serverSystemEnv.PULSE_INTERVAL_MINUTES ?? 1}min`,
        "💓",
      ),
    );

    // Import once outside the loop — dynamic to avoid circular dependencies at module load time
    const { pulseHealthRepository } = await import("../pulse/repository");

    let pulseCount = 0;

    while (!signal.aborted) {
      try {
        pulseCount++;
        logger.debug(`Pulse #${pulseCount} - Triggering task execution...`);

        // Execute pulse with minimal configuration
        const pulseResult = await pulseHealthRepository.executePulse(
          {
            dryRun: false,
            force: false,
            systemLocale,
          },
          logger,
        );

        if (pulseResult.success) {
          const summary = pulseResult.data.summary;
          const successCount = summary.tasksSucceeded.length;
          const failureCount = summary.tasksFailed.length;
          const duration = summary.totalExecutionTimeMs;

          logger.info(
            formatTask(
              `Pulse #${pulseCount}: ${successCount} tasks succeeded, ${failureCount} tasks failed in ${formatDuration(duration)}`,
              "💓",
            ),
          );
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

      // Wait for next pulse or abort signal (non-blocking sleep, resolves exactly once)
      await new Promise<void>((resolve) => {
        let done = false;
        const finish = (): void => {
          if (done) {
            return;
          }
          done = true;
          resolve();
        };
        const timeout = setTimeout(finish, PULSE_INTERVAL);
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

    logger.info("Pulse task runner stopped");
  },

  async onError(props: {
    error: Error;
    logger: EndpointLogger;
    systemLocale: CountryLanguage;
    userLocale: CountryLanguage;
    cronUser: JwtPrivatePayloadType;
  }): Promise<void> {
    const { error, logger } = props;
    logger.error("Pulse task runner error", parseError(error));
    // Could send alerts or notifications here
    await Promise.resolve();
  },

  async onShutdown(props: {
    logger: EndpointLogger;
    systemLocale: CountryLanguage;
    userLocale: CountryLanguage;
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
