/**
 * Rebuild & Restart Repository
 * Handles rebuild + hot-restart of Next.js via SIGUSR1 to the running vibe start process
 */

/* eslint-disable i18next/no-literal-string */

import { execSync } from "node:child_process";
import { existsSync, readFileSync, renameSync, rmSync } from "node:fs";
import { join } from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { seedDatabase } from "@/app/api/[locale]/system/db/seed/seed-manager";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation as migrateScopedTranslation } from "../../db/migrate/i18n";
import { databaseMigrationRepository } from "../../db/migrate/repository";
import { VIBE_START_PID_FILE } from "../pid";
import type { scopedTranslation } from "./i18n";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

interface RebuildRequest {
  generate: boolean;
  nextBuild: boolean;
  migrate: boolean;
  seed: boolean;
  restart: boolean;
  force: boolean;
}

interface RebuildResponse {
  success: boolean;
  output: string;
  duration: number;
  restarted: boolean;
  errors?: string[];
}

/**
 * Rebuild Repository Interface
 */
export interface RebuildRepositoryInterface {
  execute(
    data: RebuildRequest,
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
    data: RebuildRequest,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: ModuleT,
  ): Promise<ResponseType<RebuildResponse>> {
    const startTime = Date.now();
    const output: string[] = [];
    const errors: string[] = [];
    let restarted = false;

    try {
      output.push("🔄 Starting rebuild...");

      // Step 1: Code generation
      // IMPORTANT: Generators use dynamic import(variable) to scan definition.ts files.
      // This MUST run in a separate Bun subprocess — not inside the Next.js server process,
      // where the bundler intercepts import() and fails with "expression is too dynamic".
      if (data.generate) {
        output.push("📝 Generating code...");
        try {
          const generatorScript = join(
            process.cwd(),
            "src/app/api/[locale]/system/generators/generate-all/repository.ts",
          );
          execSync(`bun run ${generatorScript}`, {
            stdio: "inherit",
            cwd: process.cwd(),
            env: { ...process.env },
          });
          output.push("✅ Code generation completed");
        } catch (error) {
          const msg = `Code generation failed: ${parseError(error).message}`;
          errors.push(msg);
          if (!data.force) {
            return this.buildResponse(output, errors, startTime, restarted);
          }
        }
      } else {
        output.push("⏭️ Code generation skipped");
      }

      // Step 2: Next.js build to staging dir, then atomic swap
      if (data.nextBuild) {
        const cwd = process.cwd();
        const stagingDir = ".next-rebuild";
        // Use runtime concatenation to prevent Turbopack from statically tracing these paths
        const prodDir = [".next"].join("");
        const oldDir = ".next-old";

        output.push("🏗️ Building Next.js to staging directory...");
        try {
          // Clean up any leftover staging dir from a previous failed rebuild
          const stagingPath = join(cwd, stagingDir);
          if (existsSync(stagingPath)) {
            rmSync(stagingPath, { recursive: true, force: true });
          }

          // Build to staging dir via NEXT_DIST_DIR env var (read by next.config.ts)
          execSync("bunx next build", {
            stdio: "inherit",
            cwd,
            env: {
              ...process.env,
              NODE_ENV: "production",
              NEXT_DIST_DIR: stagingDir,
            },
          });
          output.push("✅ Next.js build completed in staging directory");

          // Atomic swap: .next → .next-old, .next-rebuild → .next
          output.push("🔄 Swapping build directories...");
          const prodPath = join(cwd, prodDir);
          const oldPath = join(cwd, oldDir);

          // Clean up any leftover old dir
          if (existsSync(oldPath)) {
            rmSync(oldPath, { recursive: true, force: true });
          }

          // Move current .next out of the way (if it exists)
          if (existsSync(prodPath)) {
            renameSync(prodPath, oldPath);
          }

          // Move staging into place
          renameSync(stagingPath, prodPath);
          output.push("✅ Build directories swapped");

          // Clean up old dir in background (non-blocking)
          if (existsSync(oldPath)) {
            try {
              rmSync(oldPath, { recursive: true, force: true });
              output.push("🗑️ Old build directory cleaned up");
            } catch {
              output.push(
                "⚠️ Could not clean up old build directory (.next-old)",
              );
            }
          }
        } catch (error) {
          const msg = `Next.js build failed: ${parseError(error).message}`;
          errors.push(msg);

          // Clean up staging dir on failure
          const stagingPath = join(cwd, stagingDir);
          if (existsSync(stagingPath)) {
            try {
              rmSync(stagingPath, { recursive: true, force: true });
            } catch {
              // Ignore cleanup errors
            }
          }

          if (!data.force) {
            return fail({
              message: t("post.errors.server.title"),
              errorType: ErrorResponseTypes.INTERNAL_ERROR,
              messageParams: { error: msg },
            });
          }
        }
      } else {
        output.push("⏭️ Next.js build skipped");
      }

      // Step 3: Database migrations
      if (data.migrate) {
        output.push("🔄 Running migrations...");
        try {
          const { t: migrateT } = migrateScopedTranslation.scopedT(locale);
          const migrateResult = await databaseMigrationRepository.runMigrations(
            {
              generate: false,
              dryRun: false,
              redo: false,
              schema: "public",
            },
            migrateT,
            logger,
          );

          if (migrateResult.success) {
            output.push("✅ Migrations completed");
          } else {
            errors.push("Migrations failed");
            if (!data.force) {
              return fail({
                message: t("post.errors.server.title"),
                errorType: ErrorResponseTypes.DATABASE_ERROR,
                messageParams: { error: "Migrations failed" },
                cause: migrateResult,
              });
            }
          }
        } catch (error) {
          const msg = `Migration failed: ${parseError(error).message}`;
          errors.push(msg);
          if (!data.force) {
            return fail({
              message: t("post.errors.server.title"),
              errorType: ErrorResponseTypes.DATABASE_ERROR,
              messageParams: { error: msg },
            });
          }
        }
      } else {
        output.push("⏭️ Migrations skipped");
      }

      // Step 4: Database seeding
      if (data.seed) {
        output.push("🌱 Seeding database...");
        try {
          await seedDatabase("prod", logger, locale);
          output.push("✅ Seeding completed");
        } catch (error) {
          const msg = `Seeding failed: ${parseError(error).message}`;
          errors.push(msg);
          if (!data.force) {
            return this.buildResponse(output, errors, startTime, restarted);
          }
        }
      } else {
        output.push("⏭️ Seeding skipped");
      }

      // Step 5: Signal vibe start to restart Next.js
      if (data.restart) {
        output.push("🔄 Signaling server restart...");
        const restartResult = this.signalRestart(logger);
        if (restartResult.success) {
          restarted = true;
          output.push(`✅ SIGUSR1 sent to PID ${restartResult.pid}`);
          output.push(
            "   Next.js server will restart momentarily (1-5 seconds)",
          );
        } else {
          const msg = `Server restart failed: ${restartResult.reason}`;
          errors.push(msg);
          output.push(`⚠️ ${msg}`);
        }
      } else {
        output.push("⏭️ Server restart skipped");
      }

      return this.buildResponse(output, errors, startTime, restarted);
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
      // Check if process exists (signal 0 = check only)
      process.kill(pid, 0);
    } catch {
      return {
        success: false,
        reason: `Process ${pid} is not running`,
      };
    }

    try {
      process.kill(pid, "SIGUSR1");
      logger.info("Sent SIGUSR1 to vibe start", { pid });
      return { success: true, pid };
    } catch (error) {
      return {
        success: false,
        reason: `Failed to send SIGUSR1: ${parseError(error).message}`,
      };
    }
  }

  private buildResponse(
    output: string[],
    errors: string[],
    startTime: number,
    restarted: boolean,
  ): ResponseType<RebuildResponse> {
    const duration = Date.now() - startTime;
    return success({
      success: errors.length === 0,
      output: output.join("\n"),
      duration,
      restarted,
      errors: errors.length > 0 ? errors : undefined,
    });
  }
}

/**
 * Default repository instance
 */
export const rebuildRepository = new RebuildRepositoryImpl();
