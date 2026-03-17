/**
 * Rebuild & Restart Repository
 * Handles rebuild + hot-restart of Next.js via SIGUSR1 to the running vibe start process
 *
 * Always runs all 6 steps in sequence:
 * 1. Code generation
 * 2. Vibe check (code quality gate — blocks build if errors > 0)
 * 3. Next.js production build (atomic swap)
 * 4. Database migrations
 * 5. Database seeding
 * 6. Hot-restart via SIGUSR1
 */

/* eslint-disable i18next/no-literal-string */

import { execSync } from "node:child_process";
import { existsSync, readFileSync, renameSync, rmSync } from "node:fs";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { VibeCheckRepository } from "@/app/api/[locale]/system/check/vibe-check/repository";
import { seedDatabase } from "@/app/api/[locale]/system/db/seed/seed-manager";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation as checkScopedTranslation } from "../../check/vibe-check/i18n";
import { scopedTranslation as migrateScopedTranslation } from "../../db/migrate/i18n";
import { databaseMigrationRepository } from "../../db/migrate/repository";
import { VIBE_START_PID_FILE } from "../pid";
import type { scopedTranslation } from "./i18n";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

interface RebuildStep {
  label: string;
  ok: boolean;
  skipped: boolean;
  durationMs: number;
}

interface RebuildResponse {
  success: string;
  duration: number;
  steps: RebuildStep[];
  errors?: string[];
}

/**
 * Rebuild Repository Interface
 */
export interface RebuildRepositoryInterface {
  execute(
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: ModuleT,
  ): Promise<ResponseType<RebuildResponse>>;
}

/**
 * Rebuild Repository Implementation
 */
export class RebuildRepositoryImpl implements RebuildRepositoryInterface {
  async execute(
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: ModuleT,
  ): Promise<ResponseType<RebuildResponse>> {
    const errors: string[] = [];
    const steps: RebuildStep[] = [];
    const totalStart = Date.now();

    // fn returns null on success, or an error string on failure
    const runStep = async (
      label: string,
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

    try {
      // Step 1: Code generation
      // IMPORTANT: Generators use dynamic import(variable) to scan definition.ts files.
      // This MUST run in a separate Bun subprocess — not inside the Next.js server process,
      // where the bundler intercepts import() and fails with "expression is too dynamic".
      const codegenOk = await runStep(t("post.steps.codegen"), () => {
        const generatorScript = `${process.cwd()}/src/app/api/[locale]/system/generators/generate-all/repository.ts`;
        try {
          execSync(`bun run ${generatorScript}`, {
            stdio: "inherit",
            cwd: process.cwd(),
            env: { ...process.env },
          });
          return null;
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
        const { t: checkT } = checkScopedTranslation.scopedT(locale);
        const checkResult = await VibeCheckRepository.execute(
          { summaryOnly: true, page: 1 },
          logger,
          Platform.CLI,
          checkT,
          locale,
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

        try {
          execSync("bunx next build", {
            stdio: "inherit",
            cwd,
            env: {
              ...process.env,
              NODE_ENV: "production",
              NEXT_DIST_DIR: stagingDir,
            },
          });
        } catch (error) {
          return t("post.steps.buildFailed", {
            error: parseError(error).message,
          });
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
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: { error: errors[errors.length - 1] ?? "" },
        });
      }

      // Step 4: Database migrations
      const migrateOk = await runStep(t("post.steps.migrate"), async () => {
        const { t: migrateT } = migrateScopedTranslation.scopedT(locale);
        const migrateResult = await databaseMigrationRepository.runMigrations(
          { generate: false, dryRun: false, redo: false, schema: "public" },
          migrateT,
          logger,
        );
        return migrateResult.success
          ? null
          : (migrateResult.message ?? "Migrations failed");
      });
      if (!migrateOk) {
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.DATABASE_ERROR,
          messageParams: { error: errors[errors.length - 1] ?? "" },
        });
      }

      // Step 5: Database seeding
      const seedOk = await runStep(t("post.steps.seed"), async () => {
        try {
          await seedDatabase("prod", logger, locale);
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
      const restartResult = this.signalRestart(logger);
      steps.push({
        label: t("post.steps.restart"),
        ok: restartResult.success,
        skipped: false,
        durationMs: 0,
      });
      if (!restartResult.success) {
        errors.push(
          t("post.steps.restartFailed", { error: restartResult.reason }),
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
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Read PID from .vibe-pid and send SIGUSR1 to the running vibe start process
   */
  private signalRestart(
    logger: EndpointLogger,
  ): { success: true; pid: number } | { success: false; reason: string } {
    if (!existsSync(VIBE_START_PID_FILE)) {
      return {
        success: false,
        reason: "No .vibe-pid file found — is vibe start running?",
      };
    }

    const pidStr = readFileSync(VIBE_START_PID_FILE, "utf-8").trim();
    const pid = parseInt(pidStr, 10);

    if (isNaN(pid) || pid <= 0) {
      return {
        success: false,
        reason: `Invalid PID in .vibe-pid: ${pidStr}`,
      };
    }

    try {
      process.kill(pid, 0);
    } catch {
      return {
        success: false,
        reason: `Process ${pid} is not running`,
      };
    }

    try {
      process.kill(pid, "SIGUSR1");
      logger.info(`🔄 Server restart signal sent (pid: ${pid})`);
      return { success: true, pid };
    } catch (error) {
      return {
        success: false,
        reason: `Failed to send SIGUSR1: ${parseError(error).message}`,
      };
    }
  }
}

/**
 * Default repository instance
 */
export const rebuildRepository = new RebuildRepositoryImpl();
