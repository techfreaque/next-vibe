/**
 * Database Generate Repository
 * Runs drizzle-kit generate to create migration files from schema changes
 */

import { spawn, spawnSync } from "node:child_process";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  formatActionCommand,
  formatDatabase,
  formatDuration,
} from "@/app/api/[locale]/system/unified-interface/shared/logger/formatters";
import { env } from "@/config/env";
import { defaultLocale } from "@/i18n/core/config";

import type { GenerateResponseOutput } from "./definition";
import { scopedTranslation } from "./i18n";

const NO_CHANGES = "No schema changes, nothing to migrate";

export class DatabaseGenerateRepository {
  /**
   * @param silent - When true (vibe dev), suppress all output.
   *                 When false (vibe dgen), show output and allow interactive prompts,
   *                 but suppress if "No schema changes".
   */
  static async runGenerate(
    logger: EndpointLogger,
    silent = false,
  ): Promise<ResponseType<GenerateResponseOutput>> {
    const { t } = scopedTranslation.scopedT(defaultLocale);
    const startTime = Date.now();

    try {
      logger.debug(
        `⚙️  ${formatActionCommand("Generating migrations using:", "bunx drizzle-kit generate")}`,
      );

      const spawnEnv = { ...process.env, DATABASE_URL: env.DATABASE_URL };

      if (silent) {
        // Silent mode (vibe dev): capture and discard all output
        const result = spawnSync("bunx", ["drizzle-kit", "generate"], {
          encoding: "utf8",
          cwd: process.cwd(),
          env: spawnEnv,
        });

        const duration = Date.now() - startTime;

        if (result.error) {
          return fail({
            message: t("post.errors.network.title"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
            messageParams: { error: result.error.message },
          });
        }

        if (result.status !== 0) {
          return fail({
            message: t("post.errors.network.title"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
            messageParams: {
              error: `drizzle-kit generate exited with code ${String(result.status)}`,
            },
          });
        }

        logger.info(
          formatDatabase(
            `${formatActionCommand("Generated migrations using:", "bunx drizzle-kit generate")} in ${formatDuration(duration)}`,
            "⚙️ ",
          ),
        );

        return success({ success: true, output: "", duration });
      }

      // Interactive mode (vibe dgen):
      // - stdin: inherit (real terminal - arrow keys, enter work)
      // - stdout/stderr: pipe + FORCE_COLOR so we get colors in buffer
      // - Wait up to 6s for "No schema changes" → suppress entirely
      // - After 6s without it → flush buffer to stdout and pipe live from then on
      // - FORCE_TTY=1 tells drizzle-kit's TTY check to treat stdin as a TTY
      const exitCode = await new Promise<number>((resolve, reject) => {
        const child = spawn("bunx", ["drizzle-kit", "generate"], {
          stdio: ["inherit", "pipe", "pipe"],
          cwd: process.cwd(),
          env: { ...spawnEnv, FORCE_COLOR: "1", FORCE_TTY: "1" },
        });

        const chunks: Buffer[] = [];
        let flushed = false;

        const flush = (): void => {
          if (flushed) {
            return;
          }
          flushed = true;
          const output = Buffer.concat(chunks).toString();
          if (!output.includes(NO_CHANGES)) {
            process.stdout.write(output);
          }
        };

        const timer = setTimeout(flush, 6000);

        const onData = (chunk: Buffer): void => {
          if (flushed) {
            // After initial flush, forward redraws live so input is reflected
            process.stdout.write(chunk);
          } else {
            chunks.push(chunk);
          }
        };

        child.stdout?.on("data", onData);
        child.stderr?.on("data", onData);

        child.on("error", (err) => {
          clearTimeout(timer);
          reject(err);
        });
        child.on("close", (code) => {
          clearTimeout(timer);
          flush();
          resolve(code ?? 0);
        });
      });

      const duration = Date.now() - startTime;

      if (exitCode !== 0) {
        return fail({
          message: t("post.errors.network.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: {
            error: `drizzle-kit generate exited with code ${String(exitCode)}`,
          },
        });
      }

      logger.info(
        formatDatabase(
          `${formatActionCommand("Generated migrations using:", "bunx drizzle-kit generate")} in ${formatDuration(duration)}`,
          "⚙️ ",
        ),
      );

      return success({ success: true, output: "", duration });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Generate error", { error: parsedError.message });
      return fail({
        message: t("post.errors.network.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }
}
