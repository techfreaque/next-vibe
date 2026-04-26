/**
 * Database Migration Repository
 * Runs drizzle-kit migrate to apply pending migrations
 */

import { spawnSync } from "node:child_process";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { env } from "@/config/env";
import { defaultLocale } from "@/i18n/core/config";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  formatActionCommand,
  formatDatabase,
  formatDuration,
} from "@/app/api/[locale]/system/unified-interface/shared/logger/formatters";

import type { MigrateResponseOutput } from "./definition";
import { scopedTranslation } from "./i18n";
import type { MigrateT } from "./i18n";

export class DatabaseMigrationRepository {
  static async runMigrations(
    t: MigrateT,
    logger: EndpointLogger,
  ): Promise<ResponseType<MigrateResponseOutput>> {
    const startTime = Date.now();

    try {
      logger.debug(
        `🔄 ${formatActionCommand("Running migrations using:", "bunx drizzle-kit migrate")}`,
      );

      // Use the same bun binary that is running this process — works in Docker (/usr/local/bin/bun)
      // and locally (~/.bun/bin/bun) without depending on PATH.
      const result = spawnSync(
        process.execPath,
        ["x", "drizzle-kit", "migrate"],
        {
          encoding: "utf8",
          cwd: process.cwd(),
          env: { ...process.env, DATABASE_URL: env.DATABASE_URL },
        },
      );

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
          `${formatActionCommand("Migrations completed using:", "bunx drizzle-kit migrate")} in ${formatDuration(duration)}`,
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
