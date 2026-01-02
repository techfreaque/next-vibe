/**
 * Setup Update Repository
 * Business logic for CLI update (uninstall + reinstall)
 * Following migration guide: Repository-only logic pattern
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes, fail, success } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { JwtPayloadType } from "../../../../../user/auth/types";
import { setupInstallRepository } from "../install/repository";
import { setupUninstallRepository } from "../uninstall/repository";
import type { UpdateRequestOutput, UpdateResponseOutput } from "./definition";

/**
 * Setup Update Repository Interface
 */
export interface SetupUpdateRepository {
  updateCli(
    data: UpdateRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
  ): Promise<ResponseType<UpdateResponseOutput>>;
}

/**
 * Setup Update Repository Implementation
 * Uses other repositories to perform uninstall + install
 */
class SetupUpdateRepositoryImpl implements SetupUpdateRepository {
  async updateCli(
    data: UpdateRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
  ): Promise<ResponseType<UpdateResponseOutput>> {
    const { t } = simpleT(locale);

    try {
      // First uninstall existing CLI
      const uninstallResult = await setupUninstallRepository.uninstallCli(
        { verbose: data.verbose },
        user,
        locale,
      );

      if (!uninstallResult.success) {
        return fail({
          message: "app.api.system.unifiedInterface.cli.setup.update.post.errors.server.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: {
            error: t(
              "app.api.system.unifiedInterface.cli.setup.update.post.errors.server.description",
            ),
          },
          cause: uninstallResult,
        });
      }

      // Then install CLI with force
      const installResult = await setupInstallRepository.installCli(
        { force: true, verbose: data.verbose },
        user,
        locale,
      );

      if (installResult.success && installResult.data) {
        return success({
          success: true,
          installed: true,
          version: installResult.data.version,
          path: installResult.data.path,
          message: t("app.api.system.unifiedInterface.cli.setup.update.post.success.description"),
          output: installResult.data.output,
        });
      }
      return success({
        success: false,
        installed: false,
        message: t(
          "app.api.system.unifiedInterface.cli.setup.update.post.errors.server.description",
        ),
      });
    } catch (err) {
      const parsedError = parseError(err);
      return fail({
        message: "app.api.system.unifiedInterface.cli.setup.update.post.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: parsedError.message,
        },
      });
    }
  }
}

/**
 * Default repository instance
 */
export const setupUpdateRepository = new SetupUpdateRepositoryImpl();
