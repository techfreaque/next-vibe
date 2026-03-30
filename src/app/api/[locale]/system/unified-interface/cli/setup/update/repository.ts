/**
 * Setup Update Repository
 * Business logic for CLI update (uninstall + reinstall)
 * Following migration guide: Repository-only logic pattern
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { JwtPayloadType } from "../../../../../user/auth/types";
import type { UpdateRequestOutput, UpdateResponseOutput } from "./definition";
import type { SetupUpdateT } from "./i18n";

/**
 * Setup Update Repository Implementation
 * Uses other repositories to perform uninstall + install
 */
export class SetupUpdateRepository {
  static async updateCli(
    data: UpdateRequestOutput,
    user: JwtPayloadType,
    t: SetupUpdateT,
  ): Promise<ResponseType<UpdateResponseOutput>> {
    try {
      const { SetupUninstallRepository } = await import(
        /* turbopackIgnore: true */ "../uninstall/repository"
      );
      const { SetupInstallRepository } = await import(
        /* turbopackIgnore: true */ "../install/repository"
      );

      // First uninstall existing CLI
      const uninstallResult = await SetupUninstallRepository.uninstallCli(
        { verbose: data.verbose },
        user,
        t,
      );

      if (!uninstallResult.success) {
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: {
            error: t("post.errors.server.description"),
          },
          cause: uninstallResult,
        });
      }

      // Then install CLI with force
      const installResult = await SetupInstallRepository.installCli(
        { force: true, verbose: data.verbose },
        user,
        t,
      );

      if (installResult.success && installResult.data) {
        return success({
          success: true,
          installed: true,
          version: installResult.data.version,
          path: installResult.data.path,
          message: t("post.success.description"),
          output: installResult.data.output,
        });
      }
      return success({
        success: false,
        installed: false,
        message: t("post.errors.server.description"),
      });
    } catch (err) {
      const parsedError = parseError(err);
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: parsedError.message,
        },
      });
    }
  }
}
