/**
 * Guard Stop Repository
 * Handles stopping guard environments
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  fail,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type guardStopEndpoints from "./definition";

type GuardStopRequestType = typeof guardStopEndpoints.POST.types.RequestOutput;
type GuardStopResponseType =
  typeof guardStopEndpoints.POST.types.ResponseOutput;

/**
 * Guard Stop Repository Interface
 */
export interface GuardStopRepository {
  stopGuard(
    data: GuardStopRequestType,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): ResponseType<GuardStopResponseType>;
}

/**
 * Guard Stop Repository Implementation
 */
export class GuardStopRepositoryImpl implements GuardStopRepository {
  stopGuard(
    data: GuardStopRequestType,
    _user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): ResponseType<GuardStopResponseType> {
    try {
      logger.info("Stopping guard environment");
      logger.debug("Guard stop request data", { data });

      if (data.guardId) {
        return this.stopByGuardId(data.guardId, data.force || false, logger);
      }

      if (data.projectPath) {
        return this.stopByProject(
          data.projectPath,
          data.force || false,
          logger,
        );
      }

      if (data.stopAll) {
        return this.stopAllGuards(data.force || false, logger);
      }

      return fail({
        message: "app.api.v1.core.system.guard.stop.errors.validation.title",
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
        message: "app.api.v1.core.system.guard.stop.errors.internal.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  private stopByGuardId(
    guardId: string,
    force: boolean,
    logger: EndpointLogger,
  ): ResponseType<GuardStopResponseType> {
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
    const response: GuardStopResponseType = {
      success: true,
      output: `⏹️ Guard '${guardId}'${forceText} stopped successfully`, // eslint-disable-line i18next/no-literal-string
      stoppedGuards: [mockGuard],
      totalStopped: 1,
    };

    return success(response);
  }

  private stopByProject(
    projectPath: string,
    force: boolean,
    logger: EndpointLogger,
  ): ResponseType<GuardStopResponseType> {
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
    const response: GuardStopResponseType = {
      success: true,
      output: `⏹️ Guard${forceText} stopped successfully for project '${projectName}'`, // eslint-disable-line i18next/no-literal-string
      stoppedGuards: [mockGuard],
      totalStopped: 1,
    };

    return success(response);
  }

  private stopAllGuards(
    force: boolean,
    logger: EndpointLogger,
  ): ResponseType<GuardStopResponseType> {
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
    const response: GuardStopResponseType = {
      success: true,
      output: `⏹️${forceText} Stopped ${mockGuards.length} guard environment${mockGuards.length === 1 ? "" : "s"}`, // eslint-disable-line i18next/no-literal-string
      stoppedGuards: mockGuards,
      totalStopped: mockGuards.length,
    };

    return success(response);
  }
}

export const guardStopRepository = new GuardStopRepositoryImpl();
