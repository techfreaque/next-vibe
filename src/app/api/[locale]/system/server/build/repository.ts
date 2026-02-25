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

import { seedDatabase } from "@/app/api/[locale]/system/db/seed/seed-manager";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { scopedTranslation } from "./i18n";
import { databaseMigrationRepository } from "../../db/migrate/repository";
import { scopedTranslation as migrateScopedTranslation } from "../../db/migrate/i18n";
import { scopedTranslation as builderScopedTranslation } from "../../builder/i18n";
import { scopedTranslation as dockerOperationsScopedTranslation } from "../../db/utils/docker-operations/i18n";
import { scopedTranslation as dbUtilsScopedTranslation } from "../../db/utils/i18n";
import { generateAllRepository } from "../../generators/generate-all/repository";
import type endpoints from "./definition";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

type RequestType = typeof endpoints.POST.types.RequestOutput;
type BuildResponseType = typeof endpoints.POST.types.ResponseOutput;

// Repository messages
const MESSAGES = {
  BUILD_START: "🚀 Starting application build...",
  PACKAGE_BUILD_START: "Building package...",
  PACKAGE_BUILD_SUCCESS: "✅ Package build completed successfully",
  PACKAGE_BUILD_FAILED: "Package build failed",
  BUILD_PREREQUISITES: "Running build prerequisites...",
  SKIP_GENERATION: "Skipping API endpoint generation (--skip-generation)",
  GENERATING_ENDPOINTS: "Generating API endpoints...",
  GENERATION_SUCCESS: "✅ Code generation completed successfully",
  GENERATION_FAILED: "Code generation failed",
  SKIP_NEXT_BUILD: "Skipping Next.js build (will be handled by package.json)",
  BUILDING_NEXTJS: "Building Next.js application...",
  NEXTJS_BUILD_SUCCESS: "✅ Next.js build completed successfully",
  NEXTJS_BUILD_FAILED: "Next.js build failed",
  SKIP_PROD_DB:
    "Skipping production database operations (--run-prod-database=false)",
  BUILD_FAILED: "❌ Build failed",
  SCHEMA_GENERATION_START: "Generating database schema...",
  SCHEMA_GENERATION_SUCCESS: "✅ Database schema generation completed",
  SCHEMA_GENERATION_FAILED: "Database schema generation failed",
  SKIP_SCHEMA_GENERATION:
    "Skipping database schema generation (--run-prod-database=false)",
  REPORTS_GENERATION_START: "Generating all reports...",
  REPORTS_GENERATION_SUCCESS: "✅ Reports generation completed",
  REPORTS_GENERATION_FAILED: "Reports generation failed",
  PROD_DB_START: "Running production database operations...",
  PROD_DB_SUCCESS: "✅ Production database operations completed successfully",
  PROD_DB_FAILED: "Production database operations failed",
  PROD_DB_NOT_READY: "Production database is not ready",
  DEPLOYMENT_READY: "✅ Application is ready for deployment",
  DB_CONNECTION_ERROR:
    "Database connection failed. Please ensure the database is running and accessible.",
  DB_START_SUGGESTION:
    "Try running 'docker compose -f docker-compose-dev.yml up -d' to start the database",
  FAILED_PROD_MIGRATIONS: "Failed to run production migrations",
} as const;

/**
 * Build the application Repository Interface
 */
export interface BuildRepositoryInterface {
  execute(
    data: RequestType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: ModuleT,
  ): Promise<ResponseType<BuildResponseType>>;
}

/**
 * Build the application Repository Implementation
 */
export class BuildRepositoryImpl implements BuildRepositoryInterface {
  async execute(
    data: RequestType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: ModuleT,
  ): Promise<ResponseType<BuildResponseType>> {
    const startTime = Date.now();
    const output: string[] = [];
    const errors: string[] = [];

    try {
      output.push(MESSAGES.BUILD_START);

      if (data.package) {
        // Build package using the builder with build.config.ts
        output.push(MESSAGES.PACKAGE_BUILD_START);
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
          output.push(MESSAGES.PACKAGE_BUILD_SUCCESS);
        } else {
          errors.push(MESSAGES.PACKAGE_BUILD_FAILED);
          if (!data.force) {
            const response: BuildResponseType = {
              success: false,
              output: output.join("\n"),
              duration: Date.now() - startTime,
              errors,
            };
            return success(response);
          }
        }
      }

      // Generate API endpoints
      if (!data.generate) {
        output.push(MESSAGES.SKIP_GENERATION);
      } else {
        output.push(MESSAGES.GENERATING_ENDPOINTS);
        try {
          const generateResult = await generateAllRepository.generateAll(
            {
              outputDir: "src/app/api/[locale]/v1",
              verbose: false,
              skipEndpoints: !data.generateEndpoints,
              skipSeeds: !data.generateSeeds,
              skipTaskIndex: false,
              skipTrpc: false,
            },
            logger,
            locale,
          );

          if (generateResult.success) {
            output.push(MESSAGES.GENERATION_SUCCESS);
          } else {
            errors.push(MESSAGES.GENERATION_FAILED);
            if (!data.force) {
              const response: BuildResponseType = {
                success: false,
                output: output.join("\n"),
                duration: Date.now() - startTime,
                errors,
              };
              return success(response);
            }
          }
        } catch (generatorError) {
          const errorMsg = `${MESSAGES.GENERATION_FAILED}: ${parseError(generatorError).message}`;
          errors.push(errorMsg);
          if (!data.force) {
            const response: BuildResponseType = {
              success: false,
              output: output.join("\n"),
              duration: Date.now() - startTime,
              errors,
            };
            return success(response);
          }
        }
      }

      if (!data.nextBuild) {
        output.push(MESSAGES.SKIP_NEXT_BUILD);
      } else {
        // Build Next.js application with proper NODE_ENV
        output.push(MESSAGES.BUILDING_NEXTJS);

        // Run Next.js build command using bun (works in both dev and Docker)
        const { execSync } = await import("node:child_process");
        try {
          execSync("bunx next build", {
            stdio: "inherit",
            cwd: process.cwd(),
            env: {
              ...process.env,
              NODE_ENV: "production",
            },
          });
          output.push(MESSAGES.NEXTJS_BUILD_SUCCESS);
        } catch (buildError) {
          const parsedError = parseError(buildError);
          const errorMsg = `${MESSAGES.NEXTJS_BUILD_FAILED}: ${parsedError.message}`;
          errors.push(errorMsg);

          if (!data.force) {
            return fail({
              message: t("post.errors.server.title"),
              errorType: ErrorResponseTypes.INTERNAL_ERROR,
              messageParams: {
                error: parsedError.message,
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
          const { dbUtilsRepository } =
            await import("../../db/utils/repository");
          const { t: dbUtilsT } = dbUtilsScopedTranslation.scopedT(locale);
          const dockerCheckResult = await dbUtilsRepository.isDockerAvailable(
            dbUtilsT,
            logger,
          );

          if (dockerCheckResult.success && dockerCheckResult.data) {
            output.push(MESSAGES.PROD_DB_START);
            output.push(
              "🐘 Starting preview PostgreSQL (docker-compose.preview.yml)...",
            );

            const { dockerOperationsRepository } =
              await import("../../db/utils/docker-operations/repository");
            const { t: dockerOpsT } =
              dockerOperationsScopedTranslation.scopedT(locale);
            const dbStartResult =
              await dockerOperationsRepository.dockerComposeUp(
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
            await this.waitForPreviewDb(logger);
          }
        } catch (error) {
          logger.warn("Preview DB setup failed, continuing anyway", {
            error: parseError(error).message,
          });
        }
      }

      // Run production database operations after successful build
      if (data.migrate || data.seed) {
        output.push(MESSAGES.PROD_DB_START);
        try {
          if (data.migrate) {
            const { t: migrateT } = migrateScopedTranslation.scopedT(locale);
            const migrateResult =
              await databaseMigrationRepository.runMigrations(
                {
                  generate: false,
                  dryRun: false,
                  redo: false,
                  schema: "public",
                },
                migrateT,
                logger,
              );

            if (!migrateResult.success) {
              errors.push(MESSAGES.FAILED_PROD_MIGRATIONS);
              if (!data.force) {
                return fail({
                  message: t("post.errors.server.title"),
                  errorType: ErrorResponseTypes.DATABASE_ERROR,
                  messageParams: { error: MESSAGES.FAILED_PROD_MIGRATIONS },
                  cause: migrateResult,
                });
              }
            }
          }

          if (data.seed) {
            await seedDatabase("prod", logger, locale);
          }

          output.push(MESSAGES.PROD_DB_SUCCESS);
        } catch (dbError) {
          const parsedError = parseError(dbError);
          let errorMsg = `${MESSAGES.PROD_DB_FAILED}: ${parsedError.message}`;

          if (
            parsedError.message.includes("ECONNREFUSED") ||
            parsedError.message.includes("connect")
          ) {
            errorMsg = `${MESSAGES.PROD_DB_FAILED}: ${MESSAGES.DB_CONNECTION_ERROR}`;
          }

          errors.push(errorMsg);
          if (!data.force) {
            return fail({
              message: t("post.errors.server.title"),
              errorType: ErrorResponseTypes.DATABASE_ERROR,
              messageParams: {
                error: errorMsg,
                details: parsedError.message,
                suggestion: MESSAGES.DB_START_SUGGESTION,
              },
            });
          }
        }
      } else {
        output.push(MESSAGES.SKIP_PROD_DB);
      }

      const duration = Date.now() - startTime;

      const response: BuildResponseType = {
        success: errors.length === 0,
        output: output.join("\n"),
        duration,
        errors: errors.length > 0 ? errors : undefined,
      };

      return success(response);
    } catch (error) {
      const parsedError = parseError(error);

      errors.push(`${MESSAGES.BUILD_FAILED}: ${parsedError.message}`);

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
  private async waitForPreviewDb(logger: EndpointLogger): Promise<void> {
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
          logger.warn("Preview DB connection timeout — continuing anyway");
        }
      }
    }
  }
}

/**
 * Default repository instance
 */
export const buildRepository = new BuildRepositoryImpl();
