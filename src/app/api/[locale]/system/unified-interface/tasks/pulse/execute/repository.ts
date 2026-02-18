/**
 * Pulse Execute Repository
 * Delegates to the real pulseHealthRepository.executePulse()
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { pulseHealthRepository } from "../repository";
import type {
  PulseExecuteRequestOutput,
  PulseExecuteResponseOutput,
} from "./definition";

/**
 * Pulse Execute Repository Implementation
 */
export class PulseExecuteRepository {
  /**
   * Execute pulse health check cycle via the real task runner
   */
  static async executePulse(
    data: PulseExecuteRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<PulseExecuteResponseOutput>> {
    void locale;
    try {
      logger.debug("Executing pulse health check cycle", {
        dryRun: data.dryRun,
        force: data.force,
        taskNames: data.taskNames,
      });

      const result = await pulseHealthRepository.executePulse(
        {
          dryRun: data.dryRun ?? false,
          taskNames: data.taskNames,
          force: data.force ?? false,
        },
        logger,
      );

      if (!result.success) {
        return fail({
          message:
            "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.internal.title",
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
        message: isDryRun
          ? "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.response.dryRunSuccess"
          : "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.response.executionSuccess",
        executedAt: summary.executedAt,
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
        message:
          "app.api.system.unifiedInterface.tasks.pulseSystem.execute.post.errors.internal.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
