/**
 * Vibe Check Repository
 * Orchestrates comprehensive code quality checks by running lint and typecheck in parallel
 * No duplicate check logic - imports from lint and typecheck repositories
 */

import "server-only";

import type { ResponseType as BaseResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { CountryLanguage } from "@/i18n/core/config";

import { lintRepository } from "../lint/repository";
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
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<BaseResponseType<VibeCheckResponseOutput>>;
}

/**
 * Vibe Check Repository Implementation
 */
export class VibeCheckRepositoryImpl implements VibeCheckRepository {
  async execute(
    data: VibeCheckRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<BaseResponseType<VibeCheckResponseOutput>> {
    try {
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

      // Run lint and typecheck in parallel for each path
      const allResults = await Promise.allSettled(
        pathsToCheck.map(async (path) => {
          const promises = [];

          // Run lint if not skipped
          if (!data.skipLint && path) {
            // Only run lint if we have a specific path - lint doesn't support no-path mode
            promises.push(
              lintRepository.execute(
                {
                  path,
                  verbose: logger.isDebugEnabled,
                  fix: data.fix || false,
                  timeout: data.timeout,
                  cacheDir: "./.tmp",
                },
                locale,
                logger,
              ),
            );
          }

          // Run typecheck if not skipped
          if (!data.skipTypecheck) {
            promises.push(
              typecheckRepository.execute(
                {
                  path, // This can be undefined for full project check
                  disableFilter: false,
                },
                logger,
              ),
            );
          }

          return await Promise.allSettled(promises);
        }),
      );

      // Combine all issues from all checks
      const allIssues: Array<{
        file: string;
        line?: number;
        column?: number;
        rule?: string;
        code?: string;
        severity: "error" | "warning" | "info";
        message: string;
        type: "lint" | "type";
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

      return createSuccessResponse(response);
    } catch (error) {
      logger.error("Vibe check failed", error);
      return createErrorResponse(
        "app.api.v1.core.system.check.vibeCheck.errors.internal.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: String(error) },
      );
    }
  }
}

/**
 * Default repository instance
 */
export const vibeCheckRepository = new VibeCheckRepositoryImpl();
