/**
 * Database Migration Repository
 * Runs drizzle-kit migrate to apply pending migrations
 */

import { spawnSync } from "node:child_process";
import { join } from "node:path";

import { buildPackageRunnerCommand, coreEnv } from "../../core/env";
import { defaultLocale } from "../../core/i18n/core/config";
import type { ResponseType } from "../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../core/route/response.schema";
import { parseError } from "../../core/utils/parse-error";
import { isPglite, pgliteClient } from "../client";
import {
  formatActionCommand,
  formatDatabase,
  formatDuration,
} from "../../logger/formatters";
import type { EndpointLogger } from "../../logger/types";
import { databaseEnv } from "../env";
import type { MigrateResponseOutput } from "./definition";
import type { MigrateT } from "./i18n";
import { scopedTranslation } from "./i18n";

export class DatabaseMigrationRepository {
  static async runMigrations(
    t: MigrateT,
    logger: EndpointLogger,
  ): Promise<ResponseType<MigrateResponseOutput>> {
    const startTime = Date.now();

    if (isPglite) {
      try {
        logger.debug("🔄 Running PGlite migrations");
        const { readdir, readFile } = await import("node:fs/promises");
        const client = pgliteClient!;

        // Ensure migration tracking table exists
        await client.exec(`
          CREATE TABLE IF NOT EXISTS __drizzle_migrations__ (
            id SERIAL PRIMARY KEY,
            hash TEXT NOT NULL,
            created_at BIGINT
          )
        `);

        const migrationsDir = join(process.cwd(), "drizzle");
        const files = (await readdir(migrationsDir))
          .filter((f) => f.endsWith(".sql"))
          .toSorted();

        const applied = await client.query<{ hash: string }>(
          "SELECT hash FROM __drizzle_migrations__",
        );
        const appliedSet = new Set(applied.rows.map((r) => r.hash));

        let ran = 0;
        for (const file of files) {
          if (appliedSet.has(file)) {
            continue;
          }
          const raw = await readFile(join(migrationsDir, file), "utf8");
          // PGlite doesn't support pgvector, GIN/GiST/BRIN/SP-GiST indexes,
          // or full-text search index expressions — strip those lines.
          // Two-pass: first collect names of GIN/GiST indexes we'll strip, then
          // also strip their corresponding DROP INDEX lines (which would fail on a
          // fresh DB where those indexes were never created).
          const lines = raw.split("\n");
          const unsupportedIndexNames = new Set<string>();
          for (const line of lines) {
            const m =
              /CREATE\s+(?:UNIQUE\s+)?INDEX\b.*?\b"?(\w+)"?\s+ON\b[^;]*\bUSING\s+(gin|gist|brin|spgist)\b/i.exec(
                line,
              );
            if (m) {
              unsupportedIndexNames.add(m[1]);
            }
          }
          const sql = lines
            .filter((l) => !/^\s*CREATE EXTENSION/i.test(l))
            .filter(
              (l) =>
                !/CREATE\s+INDEX\b[^;]*\bUSING\s+(gin|gist|brin|spgist)\b/i.test(
                  l,
                ),
            )
            .filter((l) => {
              if (unsupportedIndexNames.size === 0) {return true;}
              const m = /DROP\s+INDEX\b.*?"?(\w+)"?/i.exec(l);
              return !(m && unsupportedIndexNames.has(m[1]));
            })
            .join("\n")
            .replace(/\bvector\(\d+\)/gi, "text")
            .replace(/SET DATA TYPE vector\(\d+\)/gi, "SET DATA TYPE text");
          await client.exec(sql);
          await client.query(
            "INSERT INTO __drizzle_migrations__ (hash, created_at) VALUES ($1, $2)",
            [file, Date.now()],
          );
          ran++;
        }

        const duration = Date.now() - startTime;
        logger.info(
          formatDatabase(
            `Migrations completed (${String(ran)} applied) in ${formatDuration(duration)}`,
            "✅",
          ),
        );
        return success({
          success: true,
          migrationsRun: ran,
          output: "",
          duration,
        });
      } catch (error) {
        const parsedError = parseError(error);
        logger.error("PGlite migration error", { error: parsedError.message });
        return fail({
          message: t("post.errors.network.detail", {
            error: parsedError.message,
          }),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
    }

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
