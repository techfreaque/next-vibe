/**
 * Build the application Repository
 * Handles build the application operations
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { SeedRepository } from "@/app/api/[locale]/system/db/seed/repository";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation as builderScopedTranslation } from "../../builder/i18n";
import { DatabaseMigrationRepository } from "../../db/migrate/repository";
import { scopedTranslation as dockerOperationsScopedTranslation } from "../../db/utils/docker-operations/i18n";
import { scopedTranslation as dbUtilsScopedTranslation } from "../../db/utils/i18n";
import { GenerateAllRepository } from "../../generators/generate-all/repository";
import type { BuildRequestOutput, BuildResponseOutput } from "./definition";
import type { ServerBuildT } from "./i18n";

/**
 * Build Repository
 */
export class BuildRepository {
  static async execute(
    data: BuildRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: ServerBuildT,
  ): Promise<ResponseType<BuildResponseOutput>> {
    type BuildResponseType = BuildResponseOutput;
    const startTime = Date.now();
    const output: string[] = [];
    const errors: string[] = [];
    const steps: Array<{ label: string; ok: boolean; skipped: boolean }> = [];

    try {
      output.push(t("post.repository.messages.buildStart"));

      // Generate API endpoints first - package build (vibe-runtime) bundles
      // interactive.cli.tsx which statically imports generated/endpoints-meta/en,
      // so generated files must exist before the package build runs.
      if (!data.generate) {
        output.push(t("post.repository.messages.skipGeneration"));
        steps.push({ label: "Generate", ok: true, skipped: true });
      } else {
        output.push(t("post.repository.messages.generatingEndpoints"));
        try {
          const generateResult = await GenerateAllRepository.generateAll(
            {
              outputDir: "src/app/api/[locale]/v1",
              verbose: false,
              skipEndpoints: !data.generateEndpoints,
              skipSeeds: !data.generateSeeds,
              skipTaskIndex: false,
              enableTrpc: false,
              skipTanstack: !data.tanstack,
            },
            logger,
            locale,
          );

          if (generateResult.success) {
            output.push(t("post.repository.messages.generationSuccess"));
            steps.push({ label: "Generate", ok: true, skipped: false });
          } else {
            steps.push({ label: "Generate", ok: false, skipped: false });
            errors.push(t("post.repository.messages.generationFailed"));
            if (!data.force) {
              const response: BuildResponseType = {
                success: false,
                output: output.join("\n"),
                duration: Date.now() - startTime,
                errors,
                steps,
              };
              return success(response);
            }
          }
        } catch (generatorError) {
          const errorMsg = `${t("post.repository.messages.generationFailed")}: ${parseError(generatorError).message}`;
          steps.push({ label: "Generate", ok: false, skipped: false });
          errors.push(errorMsg);
          if (!data.force) {
            const response: BuildResponseType = {
              success: false,
              output: output.join("\n"),
              duration: Date.now() - startTime,
              errors,
              steps,
            };
            return success(response);
          }
        }
      }

      if (data.package) {
        // Build package using the builder with build.config.ts
        output.push(t("post.repository.messages.packageBuildStart"));
        const { builderRepository } = await import("../../builder/repository");
        const { t: builderT } = builderScopedTranslation.scopedT(locale);
        const builderResult = await builderRepository.execute(
          {
            configPath: "build.config.ts",
          },
          logger,
          builderT,
        );
        if (builderResult.success && builderResult.data) {
          output.push(builderResult.data.output);
          output.push(t("post.repository.messages.packageBuildSuccess"));
          steps.push({ label: "Package", ok: true, skipped: false });
        } else {
          steps.push({ label: "Package", ok: false, skipped: false });
          errors.push(t("post.repository.messages.packageBuildFailed"));
          if (!builderResult.success) {
            const detail =
              builderResult.messageParams &&
              typeof builderResult.messageParams["error"] === "string"
                ? builderResult.messageParams["error"]
                : builderResult.message;
            if (detail) {
              errors.push(detail);
            }
          }
          if (!data.force) {
            const response: BuildResponseType = {
              success: false,
              output: output.join("\n"),
              duration: Date.now() - startTime,
              errors,
              steps,
            };
            return success(response);
          }
        }
      }

      if (!data.nextBuild) {
        output.push(t("post.repository.messages.skipNextBuild"));
        steps.push({ label: "Next.js", ok: true, skipped: true });
      } else if (data.tanstack) {
        // Build TanStack Start (SSR) via vibe builder (uses build.config.ts)
        output.push("Building TanStack Start (SSR)...");
        try {
          const { builderRepository } =
            await import("../../builder/repository");
          const { t: builderT } = builderScopedTranslation.scopedT(locale);
          const tanstackBuildResult = await builderRepository.execute(
            { configPath: "build.config.ts" },
            logger,
            builderT,
          );
          if (tanstackBuildResult.success && tanstackBuildResult.data) {
            output.push(tanstackBuildResult.data.output);
            output.push("✅ TanStack Start (SSR) build completed successfully");
            steps.push({ label: "TanStack", ok: true, skipped: false });
          } else {
            steps.push({ label: "TanStack", ok: false, skipped: false });
            errors.push("TanStack Start build failed");
            if (!data.force) {
              return fail({
                message: t("post.errors.server.title"),
                errorType: ErrorResponseTypes.INTERNAL_ERROR,
                messageParams: { error: "TanStack Start build failed" },
              });
            }
          }
        } catch (buildError) {
          const parsedError = parseError(buildError);
          const errorMsg = `TanStack Start build failed: ${parsedError.message}`;
          steps.push({ label: "TanStack", ok: false, skipped: false });
          errors.push(errorMsg);
          if (!data.force) {
            return fail({
              message: t("post.errors.server.title"),
              errorType: ErrorResponseTypes.INTERNAL_ERROR,
              messageParams: { error: parsedError.message },
            });
          }
        }
      } else {
        // Build Next.js application with proper NODE_ENV
        output.push(t("post.repository.messages.buildingNextjs"));

        // Run Next.js build command using bun (works in both dev and Docker)
        const { spawnSync } = await import("node:child_process");
        const buildArgs =
          data.webpack === true
            ? ["next", "build", "--webpack"]
            : ["next", "build"];
        const buildResult = spawnSync("bunx", buildArgs, {
          stdio: "inherit",
          cwd: process.cwd(),
          env: {
            ...process.env,
            NODE_ENV: "production",
            NEXT_DIST_DIR: ".next-prod",
            NODE_OPTIONS: "--max-old-space-size=10000",
          },
        });
        if (buildResult.status === 0) {
          output.push(t("post.repository.messages.nextjsBuildSuccess"));
          steps.push({ label: "Next.js", ok: true, skipped: false });
        } else {
          const exitCode = buildResult.status ?? null;
          const exitSignal = buildResult.signal ?? null;
          const isOom =
            exitSignal === "SIGKILL" || exitCode === 137 || exitCode === 134;
          const detail = isOom
            ? `Next.js build killed by OS (likely OOM) - signal: ${exitSignal ?? exitCode}`
            : `Next.js build exited with code ${exitCode ?? "unknown"}`;
          const errorMsg = `${t("post.repository.messages.nextjsBuildFailed")}: ${detail}`;
          steps.push({ label: "Next.js", ok: false, skipped: false });
          errors.push(errorMsg);
          logger.error("Next.js build failed", {
            exitCode,
            exitSignal,
            isOom,
          });

          if (!data.force) {
            return fail({
              message: t("post.errors.server.title"),
              errorType: ErrorResponseTypes.INTERNAL_ERROR,
              messageParams: {
                error: detail,
              },
            });
          }
        }
      }

      // Ensure preview database is running when in local/preview mode
      // (environment.ts swaps DATABASE_URL port for build/start)
      if (
        (data.migrate || data.seed) &&
        process.env["NEXT_PUBLIC_LOCAL_MODE"] === "true"
      ) {
        try {
          const { DbUtilsRepository } =
            await import("../../db/utils/repository");
          const { t: dbUtilsT } = dbUtilsScopedTranslation.scopedT(locale);
          const dockerCheckResult = await DbUtilsRepository.isDockerAvailable(
            dbUtilsT,
            logger,
          );

          if (dockerCheckResult.success && dockerCheckResult.data) {
            output.push(t("post.repository.messages.prodDbStart"));
            output.push(
              "🐘 Starting preview PostgreSQL (docker-compose.preview.yml)...",
            );

            const { DockerOperationsRepository } =
              await import("../../db/utils/docker-operations/repository");
            const { t: dockerOpsT } =
              dockerOperationsScopedTranslation.scopedT(locale);
            const dbStartResult =
              await DockerOperationsRepository.dockerComposeUp(
                logger,
                dockerOpsT,
                "docker-compose.preview.yml",
                60000,
                "vibe-preview",
              );

            if (dbStartResult.success) {
              output.push(
                `✅ Preview PostgreSQL started (port ${process.env["PREVIEW_DB_PORT"] || "5433"})`,
              );
            } else {
              output.push(
                "⚠️ Failed to start preview PostgreSQL, continuing anyway",
              );
              logger.warn("Failed to start preview postgres", {
                error: dbStartResult.message,
              });
            }

            // Wait for database to be ready
            await BuildRepository.waitForPreviewDb(logger);
          }
        } catch (error) {
          logger.warn("Preview DB setup failed, continuing anyway", {
            error: parseError(error).message,
          });
        }
      }

      // Run production database operations after successful build
      if (data.migrate || data.seed) {
        output.push(t("post.repository.messages.prodDbStart"));
        try {
          if (data.migrate) {
            const migrateResult =
              await DatabaseMigrationRepository.migrate(logger);

            if (!migrateResult.success) {
              steps.push({ label: "Migrate", ok: false, skipped: false });
              errors.push(t("post.repository.messages.failedProdMigrations"));
              if (!data.force) {
                return fail({
                  message: t("post.errors.server.title"),
                  errorType: ErrorResponseTypes.DATABASE_ERROR,
                  messageParams: {
                    error: t("post.repository.messages.failedProdMigrations"),
                  },
                  cause: migrateResult,
                });
              }
            } else {
              steps.push({ label: "Migrate", ok: true, skipped: false });
            }
          }

          if (data.seed) {
            await SeedRepository.seed("prod", logger);
            steps.push({ label: "Seed", ok: true, skipped: false });
          }

          output.push(t("post.repository.messages.prodDbSuccess"));
        } catch (dbError) {
          const parsedError = parseError(dbError);
          let errorMsg = `${t("post.repository.messages.prodDbFailed")}: ${parsedError.message}`;

          if (
            parsedError.message.includes("ECONNREFUSED") ||
            parsedError.message.includes("connect")
          ) {
            errorMsg = `${t("post.repository.messages.prodDbFailed")}: ${t("post.repository.messages.dbConnectionError")}`;
          }

          steps.push({ label: "DB", ok: false, skipped: false });
          errors.push(errorMsg);
          if (!data.force) {
            return fail({
              message: t("post.errors.server.title"),
              errorType: ErrorResponseTypes.DATABASE_ERROR,
              messageParams: {
                error: errorMsg,
                details: parsedError.message,
                suggestion: t("post.repository.messages.dbStartSuggestion"),
              },
            });
          }
        }
      } else {
        output.push(t("post.repository.messages.skipProdDb"));
        if (data.migrate === false) {
          steps.push({ label: "Migrate", ok: true, skipped: true });
        }
        if (data.seed === false) {
          steps.push({ label: "Seed", ok: true, skipped: true });
        }
      }

      const duration = Date.now() - startTime;

      const response: BuildResponseType = {
        success: errors.length === 0,
        output: output.join("\n"),
        duration,
        errors: errors.length > 0 ? errors : undefined,
        steps,
      };

      return success(response);
    } catch (error) {
      const parsedError = parseError(error);

      errors.push(
        `${t("post.repository.messages.buildFailed")}: ${parsedError.message}`,
      );

      // Return error response with proper structure
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: parsedError.message,
        },
      });
    }
  }

  /**
   * Wait for preview database connection to be ready
   */
  private static async waitForPreviewDb(logger: EndpointLogger): Promise<void> {
    const maxAttempts = 60;
    const delayMs = 500;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, delayMs);
      });

      try {
        const { Pool } = await import("pg");
        const pool = new Pool({
          connectionString: process.env["DATABASE_URL"],
          connectionTimeoutMillis: 5000,
        });

        try {
          await pool.query("SELECT 1");
          await pool.end();
          logger.debug(
            `Preview DB ready after ${attempt} attempts (${(attempt * delayMs) / 1000}s)`,
          );
          return;
        } catch {
          // oxlint-disable-next-line no-empty-function
          await pool.end().catch(() => {});
          if (attempt % 10 === 0) {
            logger.debug(
              `Still waiting for preview DB... (${attempt}/${maxAttempts})`,
            );
          }
        }
      } catch {
        if (attempt === maxAttempts) {
          logger.warn("Preview DB connection timeout - continuing anyway");
        }
      }
    }
  }
}
