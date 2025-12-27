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
            success: false,
            issues: [
              {
                file: configResult.configPath,
                severity: "error" as const,
                message: configResult.message,
                type: "oxlint" as const,
              },
            ],
            summary: {
              totalIssues: 1,
              totalFiles: 1,
              totalErrors: 1,
              displayedIssues: 1,
              displayedFiles: 1,
            },
          },
          { isErrorResponse: true },
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

      // Run oxlint, eslint, and typecheck in parallel for each path
      const allResults = await Promise.allSettled(
        pathsToCheck.map(async (path) => {
          const promises = [];

          // Run oxlint if not skipped (fast Rust linter)
          if (
            !data.skipLint &&
            !data.skipOxlint &&
            configResult.config.oxlint.enabled
          ) {
            logger.info("Starting Oxlint check...");
            promises.push(
              oxlintRepository
                .execute(
                  {
                    path: path || baseDir,
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
          if (
            !data.skipLint &&
            !data.skipEslint &&
            configResult.config.eslint.enabled
          ) {
            logger.info("Starting ESLint check...");
            promises.push(
              lintRepository
                .execute(
                  {
                    path: path || baseDir,
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
                    path: path || baseDir, // Use baseDir when no specific path provided
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
                if (
                  result.issues.some(
                    (issue: { severity: string }) => issue.severity === "error",
                  )
                ) {
                  hasErrors = true;
                }
              }
            } else if (
              checkResult.status === "fulfilled" &&
              !checkResult.value.success
            ) {
              // Check failed - still process issues if available
              hasErrors = true;
              const failedResult = checkResult.value;
              if (
                failedResult.success === false &&
                "data" in failedResult &&
                failedResult.data &&
                typeof failedResult.data === "object" &&
                "issues" in failedResult.data &&
                Array.isArray(failedResult.data.issues)
              ) {
                allIssues.push(...failedResult.data.issues);
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

      // Calculate totals before limiting
      const totalIssues = allIssues.length;
      const totalFiles = new Set(allIssues.map((issue) => issue.file)).size;
      const totalErrors = allIssues.filter(
        (issue) => issue.severity === "error",
      ).length;

      // Apply limits for MCP-friendly output
      let limitedIssues = allIssues;

      // Limit by maxFiles - group by file and limit number of files
      if (data.maxFiles && data.maxFiles > 0) {
        const issuesByFile = new Map<
          string,
          Array<(typeof allIssues)[number]>
        >();
        for (const issue of allIssues) {
          const fileIssues = issuesByFile.get(issue.file) || [];
          fileIssues.push(issue);
          issuesByFile.set(issue.file, fileIssues);
        }

        // Take only first maxFiles files
        const limitedFilesList = [...issuesByFile.entries()].slice(
          0,
          data.maxFiles,
        );
        limitedIssues = limitedFilesList.flatMap(([, issues]) => issues);
      }

      // Limit by maxIssues - limit total number of issues
      if (data.maxIssues && data.maxIssues > 0) {
        limitedIssues = limitedIssues.slice(0, data.maxIssues);
      }

      const displayedIssues = limitedIssues.length;
      const displayedFiles = new Set(limitedIssues.map((issue) => issue.file))
        .size;

      // Generate truncation message and add summary issue entry
      const isTruncated =
        displayedIssues < totalIssues || displayedFiles < totalFiles;
      const truncatedMessage = isTruncated
        ? `Showing ${displayedIssues} of ${totalIssues} issues from ${displayedFiles} of ${totalFiles} files`
        : "";

      // Add a summary issue entry when truncated
      const issuesWithSummary = [...limitedIssues];
      if (isTruncated) {
        const hiddenIssues = totalIssues - displayedIssues;
        const hiddenFiles = totalFiles - displayedFiles;
        const hiddenErrors =
          totalErrors -
          limitedIssues.filter((issue) => issue.severity === "error").length;

        issuesWithSummary.push({
          file: "... (truncated)",
          severity: "info" as const,
          message: `... and ${hiddenIssues} more issue${hiddenIssues === 1 ? "" : "s"} from ${hiddenFiles} more file${hiddenFiles === 1 ? "" : "s"} (${hiddenErrors} error${hiddenErrors === 1 ? "" : "s"}) hidden to fit display limits`,
          type: "lint" as const,
        });
      }

      const response: VibeCheckResponseOutput = {
        success: !hasErrors,
        issues: issuesWithSummary,
        summary: {
          totalIssues,
          totalFiles,
          totalErrors,
          displayedIssues,
          displayedFiles,
          truncatedMessage,
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

      // Return with isErrorResponse: true if there are errors so CLI exits with non-zero code
      return success(
        response,
        hasErrors ? { isErrorResponse: true } : undefined,
      );
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
