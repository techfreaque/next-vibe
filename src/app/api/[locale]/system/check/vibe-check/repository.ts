/**
 * Vibe Check Repository Implementation
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { TranslationKey } from "@/i18n/core/static-types";
import { env } from "@/config/env";

import { ensureConfigReady } from "../config/repository";
import { lintRepository } from "../lint/repository";
import { oxlintRepository } from "../oxlint/repository";
import { typecheckRepository } from "../typecheck/repository";
import type {
  VibeCheckRequestOutput,
  VibeCheckResponseOutput,
} from "./definition";

export class VibeCheckRepository {
  static async execute(
    data: VibeCheckRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<VibeCheckResponseOutput>> {
    try {
      // Use unified config management - checks, creates if needed, and regenerates
      // This handles everything at the top level for all sub-checks
      const configResult = await ensureConfigReady(logger, data.createConfig);

      if (!configResult.ready) {
        return success(
          {
            issues: {
              items: [
                {
                  file: configResult.configPath,
                  severity: "error" as const,
                  message: configResult.message,
                  type: "oxlint" as const,
                },
              ],
              files: [
                {
                  file: configResult.configPath,
                  errors: 1,
                  warnings: 0,
                  total: 1,
                },
              ],
              summary: {
                totalIssues: 1,
                totalFiles: 1,
                totalErrors: 1,
                displayedIssues: 1,
                displayedFiles: 1,
                currentPage: 1,
                totalPages: 1,
              },
            },
          },
          {
            isErrorResponse: true,
            performance: {
              "app.api.system.check.vibeCheck.performance.total": 0,
            },
          },
        );
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

      // Get base directory from PROJECT_ROOT env var (used by MCP) or default to current directory
      const baseDir = env.PROJECT_ROOT || "./";

      // Track performance for each check (using translation keys as keys)
      const performanceTimings: Partial<Record<TranslationKey, number>> = {};

      // Track when checks actually start and finish
      let firstCheckStart = 0;
      let lastCheckEnd = 0;

      // Run oxlint, eslint, and typecheck in parallel for each path
      const allResults = await Promise.allSettled(
        pathsToCheck.map(async (path) => {
          const promises: Array<
            Promise<{
              type: string;
              result: ResponseType<unknown>;
              duration: number;
            }>
          > = [];

          // Run oxlint if not skipped (fast Rust linter)
          if (
            !data.skipLint &&
            !data.skipOxlint &&
            configResult.config.oxlint.enabled
          ) {
            logger.info("Starting Oxlint check...");
            promises.push(
              (async (): Promise<{
                type: string;
                result: ResponseType<unknown>;
                duration: number;
              }> => {
                const startTime = Date.now();
                if (firstCheckStart === 0) {
                  firstCheckStart = startTime;
                }
                const result = await oxlintRepository.execute(
                  {
                    path: path || baseDir,
                    verbose: logger.isDebugEnabled,
                    fix: data.fix || false,
                    timeout: data.timeout,
                    createConfig: false, // Config handled at vibe-check level
                  },
                  logger,
                );
                const endTime = Date.now();
                const duration = endTime - startTime;
                if (endTime > lastCheckEnd) {
                  lastCheckEnd = endTime;
                }
                logger.info("✓ Oxlint check completed");
                return { type: "oxlint", result, duration };
              })(),
            );
          }

          // Run ESLint if not skipped (i18n + custom AST rules)
          if (
            !data.skipLint &&
            !data.skipEslint &&
            configResult.config.eslint.enabled
          ) {
            logger.info("Starting ESLint check...");
            promises.push(
              (async (): Promise<{
                type: string;
                result: ResponseType<unknown>;
                duration: number;
              }> => {
                const startTime = Date.now();
                if (firstCheckStart === 0) {
                  firstCheckStart = startTime;
                }
                const result = await lintRepository.execute(
                  {
                    path: path || baseDir,
                    verbose: logger.isDebugEnabled,
                    fix: data.fix || false,
                    timeout: data.timeout,
                    cacheDir: configResult.config.eslint.enabled
                      ? configResult.config.eslint.cachePath
                      : undefined,
                    createConfig: false, // Config handled at vibe-check level
                  },
                  logger,
                );
                const endTime = Date.now();
                const duration = endTime - startTime;
                if (endTime > lastCheckEnd) {
                  lastCheckEnd = endTime;
                }
                logger.info("✓ ESLint check completed");
                return { type: "eslint", result, duration };
              })(),
            );
          }

          // Run typecheck if not skipped
          if (!data.skipTypecheck && configResult.config.typecheck.enabled) {
            logger.info("Starting TypeScript check...");
            promises.push(
              (async (): Promise<{
                type: string;
                result: ResponseType<unknown>;
                duration: number;
              }> => {
                const startTime = Date.now();
                if (firstCheckStart === 0) {
                  firstCheckStart = startTime;
                }
                const result = await typecheckRepository.execute(
                  {
                    path: path || baseDir, // Use baseDir when no specific path provided
                    disableFilter: false,
                    createConfig: false, // Config handled at vibe-check level
                    timeout: data.timeout, // Pass timeout from vibe-check
                  },
                  logger,
                );
                const endTime = Date.now();
                const duration = endTime - startTime;
                if (endTime > lastCheckEnd) {
                  lastCheckEnd = endTime;
                }
                logger.info("✓ TypeScript check completed");
                return { type: "typecheck", result, duration };
              })(),
            );
          }

          return await Promise.allSettled(promises);
        }),
      );
      logger.debug("All checks completed");

      // Calculate total execution time (from when first check started to when last check finished)
      // This represents the actual time spent running checks, excluding CLI and config overhead
      if (firstCheckStart > 0 && lastCheckEnd > 0) {
        performanceTimings["app.api.system.check.vibeCheck.performance.total"] =
          lastCheckEnd - firstCheckStart;
      }

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
            if (checkResult.status === "fulfilled" && checkResult.value) {
              const { type, result, duration } = checkResult.value;

              // Accumulate timing for this check type (using translation keys)
              if (type === "oxlint") {
                const key: TranslationKey =
                  "app.api.system.check.vibeCheck.performance.oxlint";
                performanceTimings[key] =
                  (performanceTimings[key] || 0) + duration;
              } else if (type === "eslint") {
                const key: TranslationKey =
                  "app.api.system.check.vibeCheck.performance.eslint";
                performanceTimings[key] =
                  (performanceTimings[key] || 0) + duration;
              } else if (type === "typecheck") {
                const key: TranslationKey =
                  "app.api.system.check.vibeCheck.performance.typecheck";
                performanceTimings[key] =
                  (performanceTimings[key] || 0) + duration;
              }

              if (result.success) {
                const data = result.data;
                if (data.issues) {
                  allIssues.push(...data.issues);
                  if (
                    data.issues.some(
                      (issue: { severity: string }) =>
                        issue.severity === "error",
                    )
                  ) {
                    hasErrors = true;
                  }
                }
              } else {
                // Check failed - still process issues if available
                hasErrors = true;
                if (
                  result.success === false &&
                  "data" in result &&
                  result.data &&
                  typeof result.data === "object" &&
                  "issues" in result.data &&
                  Array.isArray(result.data.issues)
                ) {
                  allIssues.push(...result.data.issues);
                }
              }
            } else if (checkResult.status === "rejected") {
              // Handle rejected promises (unexpected failures)
              hasErrors = true;
              allIssues.push({
                file: "check-error",
                severity: "error" as const,
                message: String(checkResult.reason),
                type: "oxlint" as const,
              });
            }
          }
        }
      }

      // Sort all issues: by file path, then by line number, then by severity
      allIssues.sort((a, b) => {
        // First sort by file path
        const fileCompare = a.file.localeCompare(b.file);
        if (fileCompare !== 0) {
          return fileCompare;
        }

        // Then by line number
        const lineA = a.line || 0;
        const lineB = b.line || 0;
        if (lineA !== lineB) {
          return lineA - lineB;
        }

        // Then by severity (errors first, then warnings, then info)
        const severityOrder: Record<string, number> = {
          error: 0,
          warning: 1,
          info: 2,
        };
        const severityA = severityOrder[a.severity] ?? 3;
        const severityB = severityOrder[b.severity] ?? 3;
        return severityA - severityB;
      });

      // Calculate totals before limiting
      const totalIssues = allIssues.length;
      const totalFiles = new Set(allIssues.map((issue) => issue.file)).size;
      const totalErrors = allIssues.filter(
        (issue) => issue.severity === "error",
      ).length;

      // Group all issues by file to build file summary
      const fileStats = new Map<
        string,
        { errors: number; warnings: number; total: number }
      >();
      for (const issue of allIssues) {
        const stats = fileStats.get(issue.file) || {
          errors: 0,
          warnings: 0,
          total: 0,
        };
        stats.total++;
        if (issue.severity === "error") {
          stats.errors++;
        }
        if (issue.severity === "warning") {
          stats.warnings++;
        }
        fileStats.set(issue.file, stats);
      }

      // Convert to array and limit by maxFilesInSummary
      const maxFilesInSummary = data.maxFilesInSummary;
      const allFiles = [...fileStats.entries()]
        .map(([file, stats]) => ({
          file,
          errors: stats.errors,
          warnings: stats.warnings,
          total: stats.total,
        }))
        .toSorted((a, b) => {
          // Sort by file path alphabetically
          return a.file.localeCompare(b.file);
        });

      const limitedFiles = maxFilesInSummary
        ? allFiles.slice(0, maxFilesInSummary)
        : allFiles;

      // Apply pagination
      const limit = data.limit;
      const currentPage = data.page;
      const totalPages = Math.ceil(totalIssues / limit);
      const startIndex = (currentPage - 1) * limit;
      const endIndex = startIndex + limit;
      const limitedIssues = allIssues.slice(startIndex, endIndex);

      const displayedIssues = limitedIssues.length;
      const displayedFiles = new Set(limitedIssues.map((issue) => issue.file))
        .size;

      // Generate truncation message
      const isTruncated =
        displayedIssues < totalIssues || displayedFiles < totalFiles;
      const truncatedMessage = isTruncated
        ? `Showing ${displayedIssues} of ${totalIssues} issues from ${displayedFiles} of ${totalFiles} files`
        : "";

      const response: VibeCheckResponseOutput = {
        issues: {
          items: limitedIssues,
          files: limitedFiles,
          summary: {
            totalIssues,
            totalFiles,
            totalErrors,
            displayedIssues,
            displayedFiles,
            truncatedMessage,
            currentPage,
            totalPages,
          },
        },
      };

      logger.debug("[Vibe Check] Response summary", {
        totalIssues,
        totalFiles,
        totalErrors,
        displayedIssues,
        displayedFiles,
        isTruncated,
      });

      // Return with isErrorResponse and performance metadata
      return success(response, {
        isErrorResponse: hasErrors ? true : undefined,
        performance: performanceTimings,
      });
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
