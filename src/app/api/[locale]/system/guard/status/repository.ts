/**
 * Guard Status Repository
 * Handles checking status and listing guard environments
 */

import * as fs from "node:fs";
import * as path from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type guardStatusEndpoints from "./definition";

type GuardStatusRequestType =
  typeof guardStatusEndpoints.POST.types.RequestOutput;
type GuardStatusResponseType =
  typeof guardStatusEndpoints.POST.types.ResponseOutput;

/**
 * Guard Status Repository Interface
 */
export interface GuardStatusRepository {
  getStatus(
    data: GuardStatusRequestType,
    logger: EndpointLogger,
  ): ResponseType<GuardStatusResponseType>;
}

/**
 * Guard Status Repository Implementation
 */
export class GuardStatusRepositoryImpl implements GuardStatusRepository {
  getStatus(
    data: GuardStatusRequestType,
    logger: EndpointLogger,
  ): ResponseType<GuardStatusResponseType> {
    try {
      logger.info("Checking guard status");
      logger.debug("Guard status request data", { data });

      if (data.guardId) {
        return this.getStatusByGuardId(data.guardId, logger);
      }

      if (data.projectPath) {
        return this.getStatusByProject(data.projectPath, logger);
      }

      if (data.listAll) {
        return this.getAllGuardStatus(logger);
      }

      // Default: list all guards
      return this.getAllGuardStatus(logger);
    } catch (error) {
      logger.error("Guard status check failed", parseError(error));
      const parsedError =
        error instanceof Error ? error : new Error(String(error));

      return fail({
        message: "app.api.system.guard.status.post.errors.internal.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  private getStatusByGuardId(
    guardId: string,
    logger: EndpointLogger,
  ): ResponseType<GuardStatusResponseType> {
    logger.debug(`Checking status for guard: ${guardId}`);

    // Mock implementation - in real system would check actual guard status
    const mockGuard = {
      guardId,
      username: guardId.replace("guard_", "").replace(/_[^_]*$/, ""), // eslint-disable-line i18next/no-literal-string
      projectPath: `/tmp/projects/${guardId}`,
      status: "running",
      createdAt: new Date().toISOString(),
      securityLevel: "standard",
      isolationMethod: "rbash",
      isRunning: true,
      userHome: `/tmp/projects/${guardId}/.guard_home_${guardId}`,
    };

    const response: GuardStatusResponseType = {
      success: true,
      output: `📊 Guard '${guardId}' status: ${mockGuard.status}`, // eslint-disable-line i18next/no-literal-string
      guards: [mockGuard],
      totalGuards: 1,
      activeGuards: mockGuard.isRunning ? 1 : 0,
    };

    return success(response);
  }

  private getStatusByProject(
    projectPath: string,
    logger: EndpointLogger,
  ): ResponseType<GuardStatusResponseType> {
    logger.debug(`Checking status for project: ${projectPath}`);

    const projectName = path.basename(projectPath);
    const guardScriptPath = path.join(projectPath, ".vscode", ".guard.sh"); // eslint-disable-line i18next/no-literal-string

    if (!fs.existsSync(guardScriptPath)) {
      const response: GuardStatusResponseType = {
        success: true,
        output: `❌ No guard found for project '${projectName}'`, // eslint-disable-line i18next/no-literal-string
        guards: [],
        totalGuards: 0,
        activeGuards: 0,
      };

      return success(response);
    }

    // Mock guard data based on project
    const sanitizedName = projectName.replaceAll(/[^a-zA-Z0-9]/g, "_");
    const guardId = `guard_${sanitizedName}_mock123`; // eslint-disable-line i18next/no-literal-string
    const username = `guard_${sanitizedName}`; // eslint-disable-line i18next/no-literal-string

    const mockGuard = {
      guardId,
      username,
      projectPath,
      status: "created",
      createdAt: new Date().toISOString(),
      securityLevel: "standard",
      isolationMethod: "rbash",
      isRunning: false,
      userHome: `${projectPath}/.guard_home_${username}`,
    };

    const response: GuardStatusResponseType = {
      success: true,
      output: `📊 Guard status for project '${projectName}': ${mockGuard.status}`, // eslint-disable-line i18next/no-literal-string
      guards: [mockGuard],
      totalGuards: 1,
      activeGuards: 0,
    };

    return success(response);
  }

  private getAllGuardStatus(
    logger: EndpointLogger,
  ): ResponseType<GuardStatusResponseType> {
    logger.debug("Getting status for all guards");

    // Mock implementation - in real system would scan for all guards
    const mockGuards = [
      {
        guardId: "guard_test_guard_project_example1", // eslint-disable-line i18next/no-literal-string
        username: "guard_test_guard_project", // eslint-disable-line i18next/no-literal-string
        projectPath: "/tmp/test-guard-project",
        status: "created",
        createdAt: new Date().toISOString(),
        securityLevel: "standard",
        isolationMethod: "rbash",
        isRunning: false,
        userHome:
          "/tmp/test-guard-project/.guard_home_guard_test_guard_project",
      },
    ];

    const activeCount = mockGuards.filter((guard) => guard.isRunning).length;

    const response: GuardStatusResponseType = {
      success: true,
      output: `📋 Found ${mockGuards.length} guard environment${mockGuards.length === 1 ? "" : "s"} (${activeCount} active)`, // eslint-disable-line i18next/no-literal-string
      guards: mockGuards,
      totalGuards: mockGuards.length,
      activeGuards: activeCount,
    };

    return success(response);
  }
}

export const guardStatusRepository = new GuardStatusRepositoryImpl();
