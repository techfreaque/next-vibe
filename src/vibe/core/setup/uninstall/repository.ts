/**
 * Setup Uninstall Repository — runs every registered `uninstall()`.
 *
 * The mirror of install: owns nothing, removes nothing directly. Each module
 * drops the artifacts its own `install()` created.
 */

import "server-only";

import chalk from "chalk";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { runSetups } from "next-vibe/core/setup/run-setups";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { UninstallResponseOutput } from "./definition";
import type { SetupUninstallT } from "./i18n";

export class SetupUninstallRepository {
  static async uninstallCli(
    user: JwtPayloadType,
    t: SetupUninstallT,
    logger: EndpointLogger,
  ): Promise<ResponseType<UninstallResponseOutput>> {
    if (!user?.id) {
      return fail({
        message: t("post.errors.unauthorized.title"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
        messageParams: { error: t("post.errors.unauthorized.description") },
      });
    }

    try {
      logger.vibe(chalk.bold("Uninstall"));

      const results = await runSetups("uninstall", logger);
      const failed = results.filter((entry) => !entry.ok);

      return success({
        success: failed.length === 0,
        results: results.map((entry) => ({
          key: entry.key,
          description: entry.description,
          summary: entry.summary,
          ok: entry.ok,
        })),
        message:
          failed.length === 0
            ? t("post.success.description")
            : t("post.errors.server.description"),
      });
    } catch (error) {
      const parsedError = parseError(error);
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          // eslint-disable-next-line i18next/no-literal-string
          error: "Uninstall failed",
          reason: parsedError.message,
          // eslint-disable-next-line i18next/no-literal-string
          stack: parsedError.stack || "No stack trace available",
        },
      });
    }
  }
}
