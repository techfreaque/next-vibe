/**
 * Database Migration Repository
 * Runs drizzle-kit migrate to apply pending migrations
 */

import { spawnSync } from "node:child_process";

import { buildPackageRunnerCommand, coreEnv } from "../../core/env";
import { defaultLocale } from "../../core/i18n/core/config";
import type { ResponseType } from "../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../core/route/response.schema";
import { parseError } from "../../core/utils/parse-error";
import { databaseEnv } from "../env";
import type { MigrateT } from "./i18n";
import { scopedTranslation } from "./i18n";
import {
  formatActionCommand,
  formatDatabase,
  formatDuration,
} from "../../logger/formatters";
import type { EndpointLogger } from "../../logger/types";

import type { MigrateResponseOutput } from "./definition";

export class DatabaseMigrationRepository {
  static async runMigrations(
    t: MigrateT,
    logger: EndpointLogger,
  ): Promise<ResponseType<MigrateResponseOutput>> {
    const startTime = Date.now();
    const runner = buildPackageRunnerCommand(
      coreEnv.PACKAGE_MANAGER,
      "drizzle-kit",
      ["migrate"],
    );
    const invocation = [runner.command, ...runner.args].join(" ");

    try {
      logger.debug(
        `🔄 ${formatActionCommand("Running migrations using:", invocation)}`,
      );

      const result = spawnSync(runner.command, runner.args, {
        encoding: "utf8",
        cwd: process.cwd(),
        env: { ...process.env, DATABASE_URL: databaseEnv.DATABASE_URL },
        timeout: 60_000,
        shell: runner.shell,
      });

      if (result.error) {
        // `post.errors.network.title` is the definition's declared
        // NETWORK_ERROR label and renders param-free there, so the cause goes
        // in its own key.
        return fail({
          message: t("post.errors.network.detail", {
            error: result.error.message,
          }),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      const rawOutput = [result.stdout, result.stderr]
        .filter(Boolean)
        .join("\n");

      if (result.status !== 0) {
        logger.error(
          `Migration failed with exit code ${String(result.status)}: ${rawOutput}`,
        );
        // drizzle-kit is silent on some failures, so fall back to the exit code.
        return fail({
          message: rawOutput
            ? t("post.errors.network.detail", { error: rawOutput })
            : t("post.errors.network.exitCode", {
                code: String(result.status),
              }),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      const duration = Date.now() - startTime;
      logger.info(
        formatDatabase(
          `${formatActionCommand("Migrations completed using:", invocation)} in ${formatDuration(duration)}`,
          "✅",
        ),
      );

      return success({ success: true, migrationsRun: 1, output: "", duration });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Migration error", { error: parsedError.message });
      return fail({
        message: t("post.errors.network.detail", {
          error: parsedError.message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Convenience wrapper for dev/start/build/rebuild repositories.
   */
  static async migrate(
    logger: EndpointLogger,
  ): Promise<ResponseType<MigrateResponseOutput>> {
    const { t } = scopedTranslation.scopedT(defaultLocale);
    return DatabaseMigrationRepository.runMigrations(t, logger);
  }
}
