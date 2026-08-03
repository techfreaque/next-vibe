/**
 * Setup Uninstall Repository — runs every registered `uninstall()`.
 *
 * The mirror of install: owns nothing, removes nothing directly. Each module
 * drops the artifacts its own `install()` created.
 */

import "server-only";

import chalk from "chalk";
import type { ResponseType } from "../../route/response.schema";
import {
  ErrorResponseTypes,
  failInline,
  success,
} from "../../route/response.schema";
import { runSetups } from "../run-setups";
import { parseError } from "../../utils/parse-error";
import type { JwtPayloadType } from "../../../identity/auth/types";
import { CLI_BINARY_NAME } from "../../../platforms/cli/types/cli-target";
import type { EndpointLogger } from "../../../logger/types";

import type { UninstallResponseOutput } from "./definition";

export class SetupUninstallRepository {
  static async uninstallCli(
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<UninstallResponseOutput>> {
    if (!user?.id) {
      // `title`/`description` are the definition's declared error-type labels and
      // render on their own there, so the spoken sentence stands apart from them.
      return failInline({
        message: `Sign in before uninstalling the ${CLI_BINARY_NAME} command.`,
        errorType: ErrorResponseTypes.UNAUTHORIZED,
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
            ? "Operation completed successfully"
            : "Internal server error occurred",
      });
    } catch (error) {
      const parsedError = parseError(error);
      return failInline({
        message: `Uninstall failed: ${parsedError.message}\n${parsedError.stack ?? "No stack trace available."}`,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
