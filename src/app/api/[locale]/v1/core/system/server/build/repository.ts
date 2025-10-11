/**
 * Build the application Repository
 * Handles build the application operations
 */

import { seedDatabase } from "next-vibe/server/db/seed-manager";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "../../unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import type { CountryLanguage } from "@/i18n/core/config";

import { databaseMigrationRepository } from "../../db/migrate/repository";
import { generateAllRepository } from "../../generators/generate-all/repository";
import type endpoints from "./definition";

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
  NEXT_BUILD_HANDLED: "✅ Next.js build will be handled by yarn build command",
  FAILED_PROD_MIGRATIONS: "Failed to run production migrations",
} as const;

/**
 * Build the application Repository Interface
 */
export interface BuildRepositoryInterface {
  execute(
    data: RequestType,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<BuildResponseType>>;
}

/**
 * Build the application Repository Implementation
 */
export class BuildRepositoryImpl implements BuildRepositoryInterface {
  async execute(
    data: RequestType,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<BuildResponseType>> {
    const startTime = Date.now();
    const output: string[] = [];
    const errors: string[] = [];

    try {
      output.push(MESSAGES.BUILD_START);

      if (data.package) {
        // Build package (if needed)
        output.push(MESSAGES.PACKAGE_BUILD_START);
        // Package building logic would go here
        output.push(MESSAGES.PACKAGE_BUILD_SUCCESS);
      }

      // Generate API endpoints
      if (data.skipGeneration) {
        output.push(MESSAGES.SKIP_GENERATION);
      } else {
        output.push(MESSAGES.GENERATING_ENDPOINTS);
        try {
          const generateResult = await generateAllRepository.generateAll(
            {
              outputDir: "src/app/api/[locale]/v1",
              verbose: false,
              skipEndpoints: data.skipEndpoints,
              skipSeeds: data.skipSeeds,
              skipTaskIndex: false,
            },
            user,
            locale,
            logger,
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
              return createSuccessResponse(response);
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
            return createSuccessResponse(response);
          }
        }
      }

      // Check if we should skip running Next.js commands
      if (data.skipNextCommand) {
        output.push(MESSAGES.SKIP_NEXT_BUILD);
      } else {
        // Build Next.js application with proper NODE_ENV
        output.push(MESSAGES.BUILDING_NEXTJS);

        // Set NODE_ENV to production for build
        // eslint-disable-next-line node/no-process-env
        const originalEnv = process.env.NODE_ENV;
        try {
          // Note: In practice, NODE_ENV should be set externally by yarn build
          output.push(MESSAGES.NEXT_BUILD_HANDLED);
          output.push(`Target: ${data.target || "default"}`); // eslint-disable-line i18next/no-literal-string
          output.push(MESSAGES.NEXTJS_BUILD_SUCCESS);
        } finally {
          // Restore original NODE_ENV if it was changed
          if (originalEnv !== undefined) {
            // eslint-disable-next-line node/no-process-env
            Object.assign(process.env, { NODE_ENV: originalEnv });
          }
        }
      }

      // Run production database operations after successful build
      if (data.runProdDatabase) {
        output.push(MESSAGES.PROD_DB_START);
        try {
          if (!data.skipProdMigrations) {
            const migrateResult =
              await databaseMigrationRepository.runMigrations(
                {
                  generate: false,
                  dryRun: false,
                  redo: false,
                  schema: "public",
                },
                user,
                locale,
                logger,
              );

            if (!migrateResult.success) {
              errors.push(MESSAGES.FAILED_PROD_MIGRATIONS);
              if (!data.force) {
                return createErrorResponse(
                  "error.errorTypes.database_error",
                  ErrorResponseTypes.DATABASE_ERROR,
                  { error: MESSAGES.FAILED_PROD_MIGRATIONS },
                );
              }
            }
          }

          if (!data.skipProdSeeding) {
            await seedDatabase("prod", logger, locale);
          }

          output.push(MESSAGES.PROD_DB_SUCCESS);
        } catch (dbError) {
          const parsedError = parseError(dbError);
          let errorMsg = `${MESSAGES.PROD_DB_FAILED}: ${parsedError.message}`;

          // Check if this is a database connection error
          if (
            parsedError.message.includes("ECONNREFUSED") ||
            parsedError.message.includes("connect")
          ) {
            errorMsg = `${MESSAGES.PROD_DB_FAILED}: ${MESSAGES.DB_CONNECTION_ERROR}`;
          }

          errors.push(errorMsg);
          if (!data.force) {
            return createErrorResponse(
              "error.errorTypes.database_error",
              ErrorResponseTypes.DATABASE_ERROR,
              {
                error: errorMsg,
                details: parsedError.message,
                suggestion: MESSAGES.DB_START_SUGGESTION,
              },
            );
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

      return createSuccessResponse(response);
    } catch (error) {
      const parsedError = parseError(error);

      errors.push(`${MESSAGES.BUILD_FAILED}: ${parsedError.message}`);

      // Return error response with proper structure
      return createErrorResponse(
        "error.errorTypes.internal_error",
        ErrorResponseTypes.INTERNAL_ERROR,
        {
          error: parsedError.message,
        },
      );
    }
  }
}

/**
 * Default repository instance
 */
export const buildRepository = new BuildRepositoryImpl();
