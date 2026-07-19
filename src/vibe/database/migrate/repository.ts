/**
 * Database Migration Repository
 * Runs drizzle-kit migrate to apply pending migrations
 */

import { spawnSync } from "node:child_process";

import { buildPackageRunnerCommand, coreEnv } from "next-vibe/core/env";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { databaseEnv } from "next-vibe/database/env";
import type { MigrateT } from "next-vibe/database/migrate/i18n";
import { scopedTranslation } from "next-vibe/database/migrate/i18n";
import {
  formatActionCommand,
  formatDatabase,
  formatDuration,
} from "next-vibe/logger/formatters";
import type { EndpointLogger } from "next-vibe/logger/types";

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
        return fail({
          message: t("post.errors.network.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: { error: result.error.message },
        });
      }

      const rawOutput = [result.stdout, result.stderr]
        .filter(Boolean)
        .join("\n");

      if (result.status !== 0) {
        logger.error(
          `Migration failed with exit code ${String(result.status)}: ${rawOutput}`,
        );
        return fail({
          message: t("post.errors.network.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: {
            error:
              rawOutput ||
              `drizzle-kit migrate exited with code ${String(result.status)}`,
          },
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
        message: t("post.errors.network.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
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
