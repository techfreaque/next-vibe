/**
 * Rebuild & Restart Repository
 * Handles rebuild + hot-restart of Next.js via SIGUSR1 to the running vibe start process
 *
 * Always runs all 6 steps in sequence:
 * 1. Code generation
 * 2. Vibe check (code quality gate - blocks build if errors > 0)
 * 3. Next.js production build (atomic swap)
 * 4. Database migrations
 * 5. Database seeding
 * 6. Hot-restart via SIGUSR1
 */

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, renameSync, rmSync } from "node:fs";

import { buildPackageRunnerCommand, coreEnv } from "../../../core/env";
import { GenerateAllRepository } from "../../../core/generators/repository";
import type { TranslatedKeyType } from "../../../core/i18n/core/scoped-translation";
import type { ResponseType } from "../../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../../core/route/response.schema";
import { parseError } from "../../../core/utils/parse-error";
import { DatabaseMigrationRepository } from "../../../database/migrate/repository";
import { SeedRepository } from "../../../database/seed/repository";
import type { JwtPayloadType } from "../../../identity/auth/types";
import type { EndpointLogger } from "../../../logger/types";
import { VibeCheckRepository } from "../../../tooling/check/repository/repository";
import { Platform } from "../../platforms";
import { readPidFilePort, VIBE_START_PID_FILE } from "../pid";
import type {
  RebuildRequestOutput,
  RebuildResponseOutput,
  RebuildStep,
} from "./definition";
import type { RebuildT } from "./i18n";

/**
 * Rebuild Repository
 */
export class RebuildRepository {
  static async execute(
    data: RebuildRequestOutput,
    logger: EndpointLogger,
    t: RebuildT,
    user: JwtPayloadType,
    signal: AbortSignal,
  ): Promise<ResponseType<RebuildResponseOutput>> {
    const errors: string[] = [];
    const steps: RebuildStep[] = [];
    const totalStart = Date.now();

    // fn returns null on success, or an error string on failure
    const runStep = async (
      label: TranslatedKeyType,
      fn: () => Promise<string | null> | string | null,
    ): Promise<boolean> => {
      const t0 = Date.now();
      const errorMsg = await fn();
      const ok = errorMsg === null;
      steps.push({ label, ok, skipped: false, durationMs: Date.now() - t0 });
      if (!ok) {
        errors.push(errorMsg);
      }
      return ok;
    };

    // If the running vibe start server is on a non-standard port (due to collision),
    // patch NEXT_PUBLIC_APP_URL before building so the bundle bakes in the correct port.
    const runningPort = readPidFilePort(VIBE_START_PID_FILE);
    if (runningPort !== null) {
      const currentUrl = process.env["NEXT_PUBLIC_APP_URL"];
      if (currentUrl) {
        try {
          const parsed = new URL(currentUrl);
          if (
            parsed.hostname === "localhost" ||
            parsed.hostname === "127.0.0.1"
          ) {
            parsed.port = String(runningPort);
            Object.assign(process.env, {
              NEXT_PUBLIC_APP_URL: parsed.toString(),
            });
          }
        } catch {
          // Not a valid URL - leave unchanged
        }
      }
    }

    try {
      // Step 1: Code generation
      const codegenOk = await runStep(t("post.steps.codegen"), async () => {
        try {
          const generateResult = await GenerateAllRepository.generateAll(
            { force: false },
            logger,
            user,
          );
          return generateResult.success
            ? null
            : t("post.steps.codegenFailed", {
                error: generateResult.message ?? t("post.steps.unknownError"),
              });
        } catch (error) {
          return t("post.steps.codegenFailed", {
            error: parseError(error).message,
          });
        }
      });
      if (!codegenOk) {
        return success({
          success: t("post.errors.server.title"),
          duration: Date.now() - totalStart,
          steps,
          errors,
        });
      }

      // Step 2: Vibe check (code quality gate)
      const vibeOk = await runStep(t("post.steps.vibeCheck"), async () => {
        const checkResult = await VibeCheckRepository.execute(
          { summaryOnly: true, page: 1 },
          logger,
          Platform.CLI,
          user,
          signal,
        );
        if (checkResult.success) {
          const { totalIssues, totalErrors } = checkResult.data;
          const errCount = totalErrors ?? totalIssues;
          const warnCount = totalIssues - errCount;
          if (errCount > 0) {
            return t("post.steps.vibeCheckFailed", {
              errors: String(errCount),
              warnings: String(warnCount),
            });
          }
        }
        return null;
      });
      if (!vibeOk) {
        return success({
          success: t("post.errors.server.title"),
          duration: Date.now() - totalStart,
          steps,
          errors,
        });
      }

      // Step 3: Next.js build to staging dir, then atomic swap
      const cwd = process.cwd();
      const stagingDir = ".next-rebuild";
      const prodDir = ".next-prod";
      const oldDir = ".next-old";

      const buildOk = await runStep(t("post.steps.nextBuild"), () => {
        const stagingPath = `${cwd}/${stagingDir}`;
        if (existsSync(stagingPath)) {
          rmSync(stagingPath, { recursive: true, force: true });
        }

        const buildArgs =
          data.webpack !== false ? ["build", "--webpack"] : ["build"];
        const runner = buildPackageRunnerCommand(
          coreEnv.PACKAGE_MANAGER,
          "next",
          buildArgs,
        );
        const buildResult = spawnSync(runner.command, runner.args, {
          stdio: "inherit",
          cwd,
          shell: runner.shell,
          env: {
            ...process.env,
            NODE_ENV: "production",
            NEXT_DIST_DIR: stagingDir,
            NODE_OPTIONS: "--max-old-space-size=16144",
          },
        });
        if (buildResult.status !== 0) {
          const exitCode = buildResult.status ?? null;
          const exitSignal = buildResult.signal ?? null;
          const isOom =
            exitSignal === "SIGKILL" || exitCode === 137 || exitCode === 134;
          const detail = isOom
            ? t("post.steps.buildOom", {
                signal: String(exitSignal ?? exitCode ?? -1),
              })
            : t("post.steps.buildExitCode", { code: String(exitCode ?? -1) });
          logger.error("Next.js rebuild failed", {
            exitCode,
            exitSignal,
            isOom,
          });
          return t("post.steps.buildFailed", { error: detail });
        }

        // Atomic swap: .next-prod → .next-old, .next-rebuild → .next-prod
        const prodPath = `${cwd}/${prodDir}`;
        const oldPath = `${cwd}/${oldDir}`;

        if (existsSync(oldPath)) {
          rmSync(oldPath, { recursive: true, force: true });
        }
        if (existsSync(prodPath)) {
          renameSync(prodPath, oldPath);
        }
        renameSync(stagingPath, prodPath);

        if (existsSync(oldPath)) {
          try {
            rmSync(oldPath, { recursive: true, force: true });
          } catch {
            // Non-critical cleanup
          }
        }
        return null;
      });
      if (!buildOk) {
        // Clean up staging dir on failure
        const stagingPath = `${cwd}/${stagingDir}`;
        if (existsSync(stagingPath)) {
          try {
            rmSync(stagingPath, { recursive: true, force: true });
          } catch {
            // Ignore cleanup errors
          }
        }
        // `post.errors.server.title` is the definition's declared SERVER_ERROR
        // label and renders param-free there, so each cause gets its own key.
        return fail({
          message: t("post.errors.server.buildFailed", {
            error: errors[errors.length - 1] ?? t("post.steps.unknownError"),
          }),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Step 4: Database migrations
      const migrateOk = await runStep(t("post.steps.migrate"), async () => {
        const migrateResult = await DatabaseMigrationRepository.migrate(logger);
        return migrateResult.success
          ? null
          : t("post.steps.migrationFailed", {
              error: migrateResult.message ?? t("post.steps.unknownError"),
            });
      });
      if (!migrateOk) {
        return fail({
          message: t("post.errors.server.migrationsFailed", {
            error: errors[errors.length - 1] ?? t("post.steps.unknownError"),
          }),
          errorType: ErrorResponseTypes.DATABASE_ERROR,
        });
      }

      // Step 5: Database seeding
      const seedOk = await runStep(t("post.steps.seed"), async () => {
        try {
          await SeedRepository.seed("prod", logger);
          return null;
        } catch (error) {
          return t("post.steps.seedingFailed", {
            error: parseError(error).message,
          });
        }
      });
      if (!seedOk) {
        return success({
          success: t("post.errors.server.title"),
          duration: Date.now() - totalStart,
          steps,
          errors,
        });
      }

      // Step 6: Signal vibe start to restart Next.js
      const restartResult = RebuildRepository.signalRestart(logger, t);
      steps.push({
        label: t("post.steps.restart"),
        ok: restartResult.success,
        skipped: false,
        durationMs: 0,
      });
      if (!restartResult.success) {
        errors.push(
          t("post.steps.restartFailed", { error: restartResult.message }),
        );
        return success({
          success: t("post.errors.server.title"),
          duration: Date.now() - totalStart,
          steps,
          errors,
        });
      }

      return success({
        success: t("post.success.title"),
        duration: Date.now() - totalStart,
        steps,
        errors: errors.length > 0 ? errors : undefined,
      });
    } catch (error) {
      return fail({
        message: t("post.errors.server.rebuildFailed", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Read PID from .vibe-pid and send SIGUSR1 to the running vibe start process
   */
  private static signalRestart(
    logger: EndpointLogger,
    t: RebuildT,
  ): ResponseType<{ pid: number }> {
    if (!existsSync(VIBE_START_PID_FILE)) {
      return fail({
        message: t("post.steps.noPidFile"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    const pidStr = readFileSync(VIBE_START_PID_FILE, "utf-8").trim();
    const pid = parseInt(pidStr, 10);

    if (isNaN(pid) || pid <= 0) {
      return fail({
        message: t("post.steps.invalidPid", { pid: pidStr }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    try {
      process.kill(pid, 0);
    } catch {
      return fail({
        message: t("post.steps.processNotRunning", { pid: String(pid) }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    try {
      process.kill(pid, "SIGUSR1");
      logger.info(`Server restart signal sent (pid: ${pid})`);
      return success({ pid });
    } catch (error) {
      return fail({
        message: t("post.steps.signalFailed", {
          error: parseError(error).message,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
