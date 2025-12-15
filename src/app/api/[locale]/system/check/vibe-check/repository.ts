/**
 * Vibe Check Repository
 * Orchestrates comprehensive code quality checks by running oxlint, eslint, and typecheck in parallel
 * No duplicate check logic - imports from oxlint, lint, and typecheck repositories
 */

import "server-only";

import type { ResponseType as BaseResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { ensureConfigReady } from "../config/repository";
import { lintRepository } from "../lint/repository";
import { oxlintRepository } from "../oxlint/repository";
import { typecheckRepository } from "../typecheck/repository";
import type {
  VibeCheckRequestOutput,
  VibeCheckResponseOutput,
} from "./definition";

/**
 * Vibe Check Repository Interface
 */
export interface VibeCheckRepository {
  execute(
    data: VibeCheckRequestOutput,
    logger: EndpointLogger,
  ): Promise<BaseResponseType<VibeCheckResponseOutput>>;
}

/**
 * Vibe Check Repository Implementation
 */
export class VibeCheckRepositoryImpl implements VibeCheckRepository {
  async execute(
    data: VibeCheckRequestOutput,
    logger: EndpointLogger,
  ): Promise<BaseResponseType<VibeCheckResponseOutput>> {
    try {
      // Use unified config management - checks, creates if needed, and regenerates
      // This handles everything at the top level for all sub-checks
      const configResult = await ensureConfigReady(logger, data.createConfig);

      if (!configResult.ready) {
        return success({
          success: false,
          issues: [{
            file: configResult.configPath,
            severity: "error" as const,
            message: configResult.message,
            type: "oxlint" as const,
          }],
        }, { isErrorResponse: true });
      }

      // Config is ready and all generated files are up-to-date
      // Sub-repositories will also call ensureConfigReady but config will already exist
      // so they will just verify it's up-to-date (fast check)

      // Prepare paths for checking - handle both string and array inputs
      let pathsToCheck: (string | undefined)[];
      if (data.paths) {
        if (typeof data.paths === "string") {
          pathsToCheck = [data.paths];
        } else {
          pathsToCheck = data.paths.length > 0 ? data.paths : [undefined];
        }
      } else {
        pathsToCheck = [undefined]; // Default to no path (entire project with regular tsconfig) if no paths specified
      }

      // Run oxlint, eslint, and typecheck in parallel for each path
      const allResults = await Promise.allSettled(
        pathsToCheck.map(async (path) => {
          const promises = [];

          // Run oxlint if not skipped (fast Rust linter)
          if (!data.skipLint && configResult.config.oxlint.enabled) {
            logger.info("Starting Oxlint check...");
            promises.push(
              oxlintRepository
                .execute(
                  {
                    path: path || "./",
                    verbose: logger.isDebugEnabled,
                    fix: data.fix || false,
                    timeout: data.timeout,
                    createConfig: false, // Config handled at vibe-check level
                  },
                  logger,
                )
                .then((result) => {
                  logger.info("✓ Oxlint check completed");
                  return result;
                }),
            );
          }

          // Run ESLint if not skipped (i18n + custom AST rules)
          if (!data.skipLint && configResult.config.eslint.enabled) {
            logger.info("Starting ESLint check...");
            promises.push(
              lintRepository
                .execute(
                  {
                    path: path || "./",
                    verbose: logger.isDebugEnabled,
                    fix: data.fix || false,
                    timeout: data.timeout,
                    cacheDir: configResult.config.eslint.cachePath,
                    createConfig: false, // Config handled at vibe-check level
                  },
                  logger,
                )
                .then((result) => {
                  logger.info("✓ ESLint check completed");
                  return result;
                }),
            );
          }

          // Run typecheck if not skipped
          if (!data.skipTypecheck && configResult.config.typecheck.enabled) {
            logger.info("Starting TypeScript check...");
            promises.push(
              typecheckRepository
                .execute(
                  {
                    path, // This can be undefined for full project check
                    disableFilter: false,
                    createConfig: false, // Config handled at vibe-check level
                    timeout: data.timeout, // Pass timeout from vibe-check
                  },
                  logger,
                )
                .then((result) => {
                  logger.info("✓ TypeScript check completed");
                  return result;
                }),
            );
          }

          return await Promise.allSettled(promises);
        }),
      );
      logger.info("All checks completed");

      // Combine all issues from all checks
      const allIssues: Array<{
        file: string;
        line?: number;
        column?: number;
        rule?: string;
        code?: string;
        severity: "error" | "warning" | "info";
        message: string;
        type: "oxlint" | "lint" | "type";
      }> = [];

      let hasErrors = false;

      // Process results from all paths and checks
      for (const pathResult of allResults) {
        if (pathResult.status === "fulfilled") {
          for (const checkResult of pathResult.value) {
            if (
              checkResult.status === "fulfilled" &&
              checkResult.value.success
            ) {
              const result = checkResult.value.data;
              if (result.issues) {
                allIssues.push(...result.issues);
                if (result.issues.some((issue) => issue.severity === "error")) {
                  hasErrors = true;
                }
              }
            }
          }
        }
      }

      const response: VibeCheckResponseOutput = {
        success: !hasErrors,
        issues: allIssues,
      };

      // Return with isErrorResponse: true if there are errors so CLI exits with non-zero code
      return success(response, hasErrors ? { isErrorResponse: true } : undefined);
    } catch (error) {
      logger.error("Vibe check failed", parseError(error));
      return fail({
        message: "app.api.system.check.vibeCheck.errors.internal.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: String(error) },
      });
    }
  }
}

/**
 * Default repository instance
 */
export const vibeCheckRepository = new VibeCheckRepositoryImpl();
