/**
 * Guard Stop Repository
 * Handles stopping guard environments
 */

import type { ResponseType } from "../../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../../core/route/response.schema";
import { parseError } from "../../../core/utils/parse-error";
import type { EndpointLogger } from "../../../logger/types";
import type { GuardStopT } from "./i18n";

import type {
  GuardStopRequestOutput,
  GuardStopResponseOutput,
} from "./definition";

/**
 * Guard Stop Repository
 */
export class GuardStopRepository {
  static stopGuard(
    data: GuardStopRequestOutput,
    logger: EndpointLogger,
    t: GuardStopT,
  ): ResponseType<GuardStopResponseOutput> {
    try {
      logger.info("Stopping guard environment");
      logger.debug("Guard stop request data", { data });

      if (data.guardId) {
        return GuardStopRepository.stopByGuardId(
          data.guardId,
          data.force || false,
          logger,
        );
      }

      if (data.projectPath) {
        return GuardStopRepository.stopByProject(
          data.projectPath,
          data.force || false,
          logger,
        );
      }

      if (data.stopAll) {
        return GuardStopRepository.stopAllGuards(data.force || false, logger);
      }

      return fail({
        message: t("errors.missingTarget"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    } catch (error) {
      logger.error("Guard stop failed", parseError(error));

      return fail({
        message: t("errors.stopFailed", {
          detail: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  private static stopByGuardId(
    guardId: string,
    force: boolean,
    logger: EndpointLogger,
  ): ResponseType<GuardStopResponseOutput> {
    logger.debug(`Stopping guard: ${guardId} (force: ${force})`);

    // Mock implementation - in real system would stop actual guard process
    const mockGuard = {
      guardId,
      username: guardId.replace("guard_", "").replace(/_[^_]*$/, ""), // eslint-disable-line i18next/no-literal-string
      projectPath: `/tmp/projects/${guardId}`,
      wasRunning: true,
      nowRunning: false,
      pid: Math.floor(Math.random() * 90000) + 10000, // Mock PID
      forceStopped: force,
    };

    const forceText = force ? " force" : "";
    const response: GuardStopResponseOutput = {
      success: true,
      output: `⏹️ Guard '${guardId}'${forceText} stopped successfully`, // eslint-disable-line i18next/no-literal-string
      stoppedGuards: [mockGuard],
      totalStopped: 1,
    };

    return success(response);
  }

  private static stopByProject(
    projectPath: string,
    force: boolean,
    logger: EndpointLogger,
  ): ResponseType<GuardStopResponseOutput> {
    logger.debug(
      `Stopping guard for project: ${projectPath} (force: ${force})`,
    );

    const projectName = projectPath.split("/").pop() || "unknown";

    // Mock guard data based on project
    const sanitizedName = projectName.replaceAll(/[^a-zA-Z0-9]/g, "_");
    const guardId = `guard_${sanitizedName}_mock123`; // eslint-disable-line i18next/no-literal-string
    const username = `guard_${sanitizedName}`; // eslint-disable-line i18next/no-literal-string

    const mockGuard = {
      guardId,
      username,
      projectPath,
      wasRunning: true,
      nowRunning: false,
      pid: Math.floor(Math.random() * 90000) + 10000, // Mock PID
      forceStopped: force,
    };

    const forceText = force ? " force" : "";
    const response: GuardStopResponseOutput = {
      success: true,
      output: `⏹️ Guard${forceText} stopped successfully for project '${projectName}'`, // eslint-disable-line i18next/no-literal-string
      stoppedGuards: [mockGuard],
      totalStopped: 1,
    };

    return success(response);
  }

  private static stopAllGuards(
    force: boolean,
    logger: EndpointLogger,
  ): ResponseType<GuardStopResponseOutput> {
    logger.debug(`Stopping all guards (force: ${force})`);

    // Mock implementation - in real system would find and stop all guards
    const mockGuards = [
      {
        guardId: "guard_test_guard_project_example1", // eslint-disable-line i18next/no-literal-string
        username: "guard_test_guard_project", // eslint-disable-line i18next/no-literal-string
        projectPath: "/tmp/test-guard-project",
        wasRunning: true,
        nowRunning: false,
        pid: Math.floor(Math.random() * 90000) + 10000,
        forceStopped: force,
      },
    ];

    const forceText = force ? " force" : "";
    const response: GuardStopResponseOutput = {
      success: true,
      output: `⏹️${forceText} Stopped ${mockGuards.length} guard environment${mockGuards.length === 1 ? "" : "s"}`, // eslint-disable-line i18next/no-literal-string
      stoppedGuards: mockGuards,
      totalStopped: mockGuards.length,
    };

    return success(response);
  }
}
