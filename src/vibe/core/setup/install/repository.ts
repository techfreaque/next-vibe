/**
 * Setup Install Repository — runs every registered `install()`.
 *
 * Owns no artifacts of its own. What gets installed is whatever declared a
 * `setup.ts`; this only sequences them and shapes the response. The CLI shim and
 * the MCP configs are both just entries in the registry.
 */

import "server-only";

import chalk from "chalk";

import type { JwtPayloadType } from "../../../identity/auth/types";
import type { EndpointLogger } from "../../../logger/types";
import { CLI_BINARY_NAME } from "../../../platforms/cli/types/cli-target";
import type { ResponseType } from "../../route/response.schema";
import {
  ErrorResponseTypes,
  failInline,
  success,
} from "../../route/response.schema";
import { parseError } from "../../utils/parse-error";
import { runSetups } from "../run-setups";
import type { InstallResponseOutput } from "./definition";

export class SetupInstallRepository {
  static async installCli(
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<InstallResponseOutput>> {
    if (!user?.id) {
      return failInline({
        message: `Sign in before installing the ${CLI_BINARY_NAME} command.`,
        errorType: ErrorResponseTypes.UNAUTHORIZED,
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
            ? "Operation completed successfully"
            : "Internal server error occurred",
      });
    } catch (error) {
      const parsedError = parseError(error);
      return failInline({
        message: `Install failed: ${parsedError.message}\n${parsedError.stack ?? "No stack trace available."}`,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
