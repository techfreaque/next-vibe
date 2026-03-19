/**
 * Guard Stop Repository
 * Handles stopping guard environments
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type {
  GuardStopRequestOutput,
  GuardStopResponseOutput,
} from "./definition";
import type { GuardStopT } from "./i18n";

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
        message: t("errors.validation.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
        messageParams: {
          error: "Either projectPath, guardId, or stopAll must be specified",
        }, // eslint-disable-line i18next/no-literal-string
      });
    } catch (error) {
      logger.error("Guard stop failed", parseError(error));
      const parsedError =
        error instanceof Error ? error : new Error(String(error));

      return fail({
        message: t("errors.internal.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
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
