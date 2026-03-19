/**
 * Database Migration Repository
 * Handles database migration operations
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
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  formatActionCommand,
  formatDatabase,
  formatDuration,
} from "@/app/api/[locale]/system/unified-interface/shared/logger/formatters";

// Import types from the endpoint definition
import type { MigrateRequestOutput, MigrateResponseOutput } from "./definition";
import type { MigrateT } from "./i18n";

/**
 * Database Migration Repository
 * Extended with merged functionality from floating migration files
 */
export class DatabaseMigrationRepository {
  static async runMigrations(
    data: MigrateRequestOutput,
    t: MigrateT,
    logger: EndpointLogger,
  ): Promise<ResponseType<MigrateResponseOutput>> {
    const startTime = Date.now();

    try {
      // Generate migrations if requested
      if (data.generate) {
        const generateStartTime = Date.now();
        logger.debug(
          `⚙️  ${formatActionCommand("Generating migrations using:", "bunx drizzle-kit generate")}`,
        );
        const generateResult = spawnSync("bunx", ["drizzle-kit", "generate"], {
          encoding: "utf8",
          cwd: process.cwd(),
          stdio: "pipe",
          env: { ...process.env, DATABASE_URL: env.DATABASE_URL },
        });
        const generateDuration = Date.now() - generateStartTime;

        if (generateResult.error) {
          return fail({
            message: t("post.errors.network.title"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
            messageParams: {
              error: generateResult.error.message,
            },
          });
        }

        if (generateResult.status !== 0) {
          const rawGenerateOutput = [
            generateResult.stdout,
            generateResult.stderr,
          ]
            .filter(Boolean)
            .join("\n");
          return fail({
            message: t("post.errors.network.title"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
            messageParams: {
              error:
                rawGenerateOutput ||
                `drizzle-kit generate exited with code ${String(generateResult.status ?? "unknown")}`,
            },
          });
        }

        logger.info(
          formatDatabase(
            `${formatActionCommand("Generated migrations using:", "bunx drizzle-kit generate")} in ${formatDuration(generateDuration)}`,
            "⚙️ ",
          ),
        );
      }

      // Run migrations
      if (data.dryRun) {
        const duration = Date.now() - startTime;
        return success({
          success: true,
          migrationsRun: 0,
          migrationsGenerated: 0,
          output: "Dry run - migrations not executed",
          duration,
        });
      }

      // Use drizzle-kit migrate for tracked migrations
      logger.debug(
        `🔄 ${formatActionCommand("Running migrations using:", "bunx drizzle-kit migrate")}`,
      );
      const pushResult = spawnSync("bunx", ["drizzle-kit", "migrate"], {
        encoding: "utf8",
        cwd: process.cwd(),
        env: { ...process.env, DATABASE_URL: env.DATABASE_URL },
      });

      if (pushResult.error) {
        return fail({
          message: t("post.errors.network.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: {
            error: pushResult.error.message,
          },
        });
      }

      const rawOutput = [pushResult.stdout, pushResult.stderr]
        .filter(Boolean)
        .join("\n");

      if (pushResult.status !== 0) {
        logger.error(
          `Migration failed with exit code ${String(pushResult.status)}`,
        );
        return fail({
          message: t("post.errors.network.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: {
            error:
              rawOutput ||
              `drizzle-kit migrate exited with code ${String(pushResult.status)}`,
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

      return success({
        success: true,
        migrationsRun: 1,
        migrationsGenerated: data.generate ? 1 : 0,
        output: "",
        duration,
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      const parsedError = parseError(error);

      logger.error("Migration error", { error: parsedError.message });

      return fail({
        message: t("post.errors.network.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: parsedError.message,
          duration,
        },
      });
    }
  }
}
