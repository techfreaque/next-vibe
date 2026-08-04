/**
 * Database Generate Repository
 * Runs drizzle-kit generate to create migration files from schema changes
 */

import { spawn, spawnSync } from "node:child_process";

import { buildPackageRunnerCommand, coreEnv } from "../../core/env";
import { defaultLocale } from "../../core/i18n/core/config";
import type { ResponseType } from "../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../core/route/response.schema";
import { parseError } from "../../core/utils/parse-error";
import {
  formatActionCommand,
  formatDatabase,
  formatDuration,
} from "../../logger/formatters";
import type { EndpointLogger } from "../../logger/types";
import { databaseEnv } from "../env";
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
    const runner = buildPackageRunnerCommand(
      coreEnv.PACKAGE_MANAGER,
      "drizzle-kit",
      ["generate"],
    );
    const invocation = `${runner.command} ${runner.args.join(" ")}`;

    try {
      logger.debug(
        `⚙️  ${formatActionCommand("Generating migrations using:", invocation)}`,
      );

      const spawnEnv = {
        ...process.env,
        DATABASE_URL: databaseEnv.DATABASE_URL,
      };

      if (silent) {
        // Silent mode (vibe dev): capture and discard all output
        const result = spawnSync(runner.command, runner.args, {
          encoding: "utf8",
          cwd: process.cwd(),
          env: spawnEnv,
          shell: runner.shell,
        });

        const duration = Date.now() - startTime;

        if (result.error) {
          // `post.errors.network.title` is the definition's declared
          // NETWORK_ERROR label and renders param-free there, so the cause
          // goes in its own key.
          return fail({
            message: t("post.errors.network.detail", {
              error: result.error.message,
            }),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }

        if (result.status !== 0) {
          return fail({
            message: t("post.errors.network.exitCode", {
              code: String(result.status),
            }),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }

        logger.info(
          formatDatabase(
            `${formatActionCommand("Generated migrations using:", invocation)} in ${formatDuration(duration)}`,
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
        const child = spawn(runner.command, runner.args, {
          stdio: ["inherit", "pipe", "pipe"],
          cwd: process.cwd(),
          env: { ...spawnEnv, FORCE_COLOR: "1", FORCE_TTY: "1" },
          shell: runner.shell,
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
          message: t("post.errors.network.exitCode", {
            code: String(exitCode),
          }),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      logger.info(
        formatDatabase(
          `${formatActionCommand("Generated migrations using:", invocation)} in ${formatDuration(duration)}`,
          "⚙️ ",
        ),
      );

      return success({ success: true, output: "", duration });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Generate error", { error: parsedError.message });
      return fail({
        message: t("post.errors.network.detail", {
          error: parsedError.message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
