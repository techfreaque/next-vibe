/**
 * Pulse Execute Repository
 * Delegates to the real pulseHealthRepository.executePulse()
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";
import type {
  PulseExecuteRequestOutput,
  PulseExecuteResponseOutput,
} from "next-vibe/tasks/pulse/execute/definition";
import type { PulseExecuteT } from "next-vibe/tasks/pulse/execute/i18n";

import { PulseHealthRepository } from "../repository";

/**
 * Pulse Execute Repository Implementation
 */
export class PulseExecuteRepository {
  /**
   * Execute pulse health check cycle via the real task runner
   */
  static async executePulse(
    data: PulseExecuteRequestOutput,
    systemLocale: CountryLanguage,
    logger: EndpointLogger,
    t: PulseExecuteT,
  ): Promise<ResponseType<PulseExecuteResponseOutput>> {
    try {
      logger.debug("Executing pulse health check cycle", {
        dryRun: data.dryRun,
        force: data.force,
        taskNames: data.taskNames,
      });

      const result = await PulseHealthRepository.executePulse(
        {
          dryRun: data.dryRun ?? false,
          taskNames: data.taskNames,
          force: data.force ?? false,
          systemLocale,
        },
        logger,
        systemLocale,
      );

      if (!result.success) {
        return fail({
          message: t("errors.executePulse"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      const { summary, isDryRun } = result.data;

      // Build per-task results from the summary arrays
      const results: PulseExecuteResponseOutput["results"] = [
        ...summary.tasksSucceeded.map((taskName) => ({
          taskName,
          success: true,
          duration: 0,
        })),
        ...summary.tasksFailed.map((taskName) => ({
          taskName,
          success: false,
          duration: 0,
        })),
      ];

      const response: PulseExecuteResponseOutput = {
        success: summary.tasksFailed.length === 0,
        message: isDryRun ? "Dry run completed" : "Pulse execution completed",
        executedAt: new Date(summary.executedAt),
        tasksExecuted: summary.tasksExecuted.length,
        results,
      };

      logger.vibe("Pulse execution completed", {
        success: response.success,
        tasksExecuted: response.tasksExecuted,
        dryRun: isDryRun,
      });

      return success(response);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to execute pulse cycle", {
        error: parsedError.message,
        dryRun: data.dryRun,
      });

      return fail({
        message: t("errors.executePulse"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
