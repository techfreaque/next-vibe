/**
 * Pulse Task Runner
 * Dedicated task runner that calls the pulse repository once per minute
 * Designed for environments like Vercel that don't support persistent runners
 */
import "server-only";

import { coreEnv } from "../../core/env";
import type { CountryLanguage } from "../../core/i18n/core/config";
import { parseError } from "../../core/utils/parse-error";
import type { JwtPrivatePayloadType } from "../../identity/auth/types";
import { formatDuration, formatTask } from "../../logger/formatters";
import type { EndpointLogger } from "../../logger/types";
import { tasksEnv } from "../env";
import type { TasksTranslationKey } from "../i18n";
import type { TaskRunner } from "../unified-runner/types";

import { CronTaskPriority, TaskCategory } from "../enum";

/**
 * Pulse Task Runner Implementation
 * Calls the pulse repository every minute to trigger scheduled tasks
 */
const pulseTaskRunner: TaskRunner<TasksTranslationKey> = {
  type: "task-runner",
  name: "pulseRunner.name",
  description: "pulseRunner.description",
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
    const PULSE_INTERVAL = (tasksEnv.PULSE_INTERVAL_MINUTES ?? 1) * 60 * 1000;
    logger.info(
      formatTask(
        `Started task runner with pulse of ${tasksEnv.PULSE_INTERVAL_MINUTES === 1 ? "1 minute" : `${tasksEnv.PULSE_INTERVAL_MINUTES} minutes`}`,
        "💓",
      ),
    );

    // Import once outside the loop - dynamic to avoid circular dependencies at module load time
    const { PulseHealthRepository } = await import("./repository");

    let pulseCount = 0;

    while (!signal.aborted) {
      try {
        pulseCount++;
        logger.debug(`Pulse #${pulseCount} - Triggering task execution...`);

        // Execute pulse with minimal configuration
        const pulseResult = await PulseHealthRepository.executePulse(
          {
            dryRun: false,
            force: false,
            systemLocale,
          },
          logger,
          props.systemLocale,
        );

        if (pulseResult.success) {
          const summary = pulseResult.data.summary;
          const successCount = summary.tasksSucceeded.length;
          const failureCount = summary.tasksFailed.length;
          const duration = summary.totalExecutionTimeMs;

          if (coreEnv.NODE_ENV !== "production") {
            logger.info(
              formatTask(
                `Pulse #${pulseCount}: ${successCount} tasks succeeded, ${failureCount} tasks failed in ${formatDuration(duration)}`,
                "💓",
              ),
            );
          }
        } else {
          // `pulseResult.message` now carries the specific cause appended to the
          // generic label, so no separate params channel is needed to tell one
          // pulse failure from another.
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
export const taskRunners: TaskRunner<string>[] = [pulseTaskRunner];

export default taskRunners;
