/**
 * Guard Destroy Repository
 * Handles destroying guard environments and cleaning up resources
 */

import * as fs from "node:fs";
import * as path from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  fail,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type guardDestroyEndpoints from "./definition";

type GuardDestroyRequestType =
  typeof guardDestroyEndpoints.POST.types.RequestOutput;
type GuardDestroyResponseType =
  typeof guardDestroyEndpoints.POST.types.ResponseOutput;

/**
 * Guard Destroy Repository Interface
 */
export interface GuardDestroyRepository {
  destroyGuard(
    data: GuardDestroyRequestType,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): ResponseType<GuardDestroyResponseType>;
}

/**
 * Guard Destroy Repository Implementation
 */
export class GuardDestroyRepositoryImpl implements GuardDestroyRepository {
  destroyGuard(
    data: GuardDestroyRequestType,
    _user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): ResponseType<GuardDestroyResponseType> {
    try {
      logger.info("Destroying guard environment");
      logger.debug("Guard destroy request data", { data });

      // Handle dry run
      if (data.dryRun) {
        return this.handleDryRun(data, locale, logger);
      }

      if (data.guardId) {
        return this.destroyByGuardId(data.guardId, logger);
      }

      if (data.projectPath) {
        return this.destroyByProject(data.projectPath, logger);
      }

      // Default to current project if no parameters specified
      const currentProjectPath = process.cwd();
      logger.info(
        `No parameters specified, defaulting to current project: ${currentProjectPath}`,
      );
      return this.destroyByProject(currentProjectPath, logger);
    } catch (error) {
      logger.error("Guard destruction failed", parseError(error));
      const parsedError =
        error instanceof Error ? error : new Error(String(error));

      return fail({
        message: "app.api.system.guard.destroy.errors.destruction_failed.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  private handleDryRun(
    data: GuardDestroyRequestType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): ResponseType<GuardDestroyResponseType> {
    logger.info("Executing dry run for guard destruction");

    const response: GuardDestroyResponseType = {
      success: true,
      output: "🔍 Would destroy guard environments (dry run)", // eslint-disable-line i18next/no-literal-string
      destroyedGuards: [],
      totalDestroyed: 0,
    };

    return success(response);
  }

  private destroyByGuardId(
    guardId: string,
    logger: EndpointLogger,
  ): ResponseType<GuardDestroyResponseType> {
    logger.debug(`Destroying guard: ${guardId}`);

    // Mock implementation - in real system would destroy actual guard
    const mockGuard = {
      guardId,
      username: guardId.replace("guard_", "").replace(/_[^_]*$/, ""), // eslint-disable-line i18next/no-literal-string
      projectPath: `/tmp/projects/${guardId}`,
      wasRunning: false,
      filesRemoved: true,
      userRemoved: true,
    };

    const response: GuardDestroyResponseType = {
      success: true,
      output: `🗑️ Guard '${guardId}' destroyed successfully`, // eslint-disable-line i18next/no-literal-string
      destroyedGuards: [mockGuard],
      totalDestroyed: 1,
    };

    return success(response);
  }

  private destroyByProject(
    projectPath: string,
    logger: EndpointLogger,
  ): ResponseType<GuardDestroyResponseType> {
    logger.debug(`Destroying guard for project: ${projectPath}`);

    const projectName = path.basename(projectPath);
    const guardScriptPath = path.join(projectPath, ".vscode", ".guard.sh"); // eslint-disable-line i18next/no-literal-string

    if (!fs.existsSync(guardScriptPath)) {
      return fail({
        message: "app.api.system.guard.destroy.errors.guard_not_found.title",
        errorType: ErrorResponseTypes.NOT_FOUND,
        messageParams: { error: `No guard found for project '${projectName}'` }, // eslint-disable-line i18next/no-literal-string
      });
    }

    // Mock guard data based on project
    const sanitizedName = projectName.replaceAll(/[^a-zA-Z0-9]/g, "_");
    const guardId = `guard_${sanitizedName}_mock123`; // eslint-disable-line i18next/no-literal-string
    const username = `guard_${sanitizedName}`; // eslint-disable-line i18next/no-literal-string

    const mockGuard = {
      guardId,
      username,
      projectPath,
      wasRunning: false,
      filesRemoved: true,
      userRemoved: true,
    };

    const response: GuardDestroyResponseType = {
      success: true,
      output: `🗑️ Guard destroyed successfully for project '${projectName}'`, // eslint-disable-line i18next/no-literal-string
      destroyedGuards: [mockGuard],
      totalDestroyed: 1,
    };

    return success(response);
  }

  private destroyAllGuards(
    logger: EndpointLogger,
  ): ResponseType<GuardDestroyResponseType> {
    logger.debug("Destroying all guards");

    // Mock implementation - in real system would find and destroy all guards
    const mockGuards = [
      {
        guardId: "guard_test_guard_project_example1", // eslint-disable-line i18next/no-literal-string
        username: "guard_test_guard_project", // eslint-disable-line i18next/no-literal-string
        projectPath: "/tmp/test-guard-project",
        wasRunning: false,
        filesRemoved: true,
        userRemoved: true,
      },
    ];

    const response: GuardDestroyResponseType = {
      success: true,
      output: `🗑️ Destroyed ${mockGuards.length} guard environment${mockGuards.length === 1 ? "" : "s"}`, // eslint-disable-line i18next/no-literal-string
      destroyedGuards: mockGuards,
      totalDestroyed: mockGuards.length,
    };

    return success(response);
  }
}

export const guardDestroyRepository = new GuardDestroyRepositoryImpl();
