/**
 * Setup Update Repository
 * Business logic for CLI update (uninstall + reinstall)
 * Following migration guide: Repository-only logic pattern
 */

import "server-only";

import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type {
  UpdateRequestOutput,
  UpdateResponseOutput,
} from "next-vibe/platforms/cli/setup/update/definition";
import type { SetupUpdateT } from "next-vibe/platforms/cli/setup/update/i18n";

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
