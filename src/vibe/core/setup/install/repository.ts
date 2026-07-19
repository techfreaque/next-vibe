/**
 * Setup Install Repository — runs every registered `install()`.
 *
 * Owns no artifacts of its own. What gets installed is whatever declared a
 * `setup.ts`; this only sequences them and shapes the response. The CLI shim and
 * the MCP configs are both just entries in the registry.
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

import type { InstallResponseOutput } from "./definition";
import type { SetupInstallT } from "./i18n";

export class SetupInstallRepository {
  static async installCli(
    user: JwtPayloadType,
    t: SetupInstallT,
    logger: EndpointLogger,
  ): Promise<ResponseType<InstallResponseOutput>> {
    if (!user?.id) {
      return fail({
        message: t("post.errors.unauthorized.title"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
        messageParams: { error: t("post.errors.unauthorized.description") },
      });
    }

    try {
      // The one general line. Everything after it belongs to a specific setup
      // and is that setup's to print.
      logger.vibe(chalk.bold("Setup"));

      const results = await runSetups("install", logger);
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
          error: "Setup failed",
          reason: parsedError.message,
          // eslint-disable-next-line i18next/no-literal-string
          stack: parsedError.stack || "No stack trace available",
        },
      });
    }
  }
}
