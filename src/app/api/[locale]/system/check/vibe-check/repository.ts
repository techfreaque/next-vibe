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
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { env } from "@/config/env";
import type { TranslationKey } from "@/i18n/core/static-types";

import { ensureConfigReady } from "../config/repository";
import type { CheckConfig } from "../config/types";
import type { LintResponseOutput } from "../lint/definition";
import { lintRepository } from "../lint/repository";
import type { OxlintResponseOutput } from "../oxlint/definition";
import { oxlintRepository } from "../oxlint/repository";
import { calculateFilteredSummary, filterIssues } from "../shared/filter-utils";
import type { TypecheckResponseOutput } from "../typecheck/definition";
import { typecheckRepository } from "../typecheck/repository";
import type {
  VibeCheckRequestOutput,
  VibeCheckResponseOutput,
} from "./definition";

type CheckType = "oxlint" | "eslint" | "typecheck";

interface CheckResult {
  type: CheckType;
  result:
    | ResponseType<OxlintResponseOutput>
    | ResponseType<LintResponseOutput>
    | ResponseType<TypecheckResponseOutput>;
  duration: number;
}

interface CheckIssue {
  file: string;
  line?: number;
  column?: number;
  rule?: string;
  severity: "error" | "warning" | "info";
  message: string;
}

export class VibeCheckRepository {
  private static getPerformanceKey(type: CheckType): TranslationKey {
    const keyMap: Record<CheckType, TranslationKey> = {
      oxlint: "app.api.system.check.vibeCheck.performance.oxlint",
      eslint: "app.api.system.check.vibeCheck.performance.eslint",
      typecheck: "app.api.system.check.vibeCheck.performance.typecheck",
    };
    return keyMap[type];
  }

  private static async runOxlintCheck(
    paths: string[],
    fix: boolean,
    timeout: number,
    config: CheckConfig,
    logger: EndpointLogger,
    platform: Platform,
  ): Promise<CheckResult> {
    const startTime = Date.now();
    const result = await oxlintRepository.execute(
      {
        path: paths.length === 1 ? paths[0] : paths,
        fix,
        timeout,
        skipSorting: true,
        limit: 999999,
        page: 1,
        summaryOnly: false,
      },
      logger,
      platform,
      config,
    );
    logger.info(
      `✓ Oxlint check completed with ${result.success ? result.data.items?.length : 0} issues`,
    );
    return {
      type: "oxlint",
      result,
      duration: Date.now() - startTime,
    };
  }

  private static async runEslintCheck(
    path: string,
    fix: boolean,
    timeout: number,
    config: CheckConfig,
    logger: EndpointLogger,
    platform: Platform,
  ): Promise<CheckResult> {
    const startTime = Date.now();
    const result = await lintRepository.execute(
      {
        path,
        fix,
        timeout,
        cacheDir: config.eslint.enabled ? config.eslint.cachePath : "./.tmp",
        skipSorting: true,
        limit: 999999,
        page: 1,
        summaryOnly: false,
      },
      logger,
      platform,
      config,
    );
    logger.info(
      `✓ ESLint check completed with ${result.success ? result.data.items?.length : 0} issues`,
    );
    return {
      type: "eslint",
      result,
      duration: Date.now() - startTime,
    };
  }

  private static async runTypecheckCheck(
    path: string,
    timeout: number,
    config: CheckConfig,
    logger: EndpointLogger,
    platform: Platform,
  ): Promise<CheckResult> {
    const startTime = Date.now();
    const result = await typecheckRepository.execute(
      {
        path,
        timeout,
        skipSorting: true,
        disableFilter: false,
        limit: 999999,
        page: 1,
        summaryOnly: false,
      },
      logger,
      platform,
      config,
    );

    logger.info(
      `✓ TypeScript check completed with ${result.success ? result.data.items?.length : 0} issues`,
    );
    return {
      type: "typecheck",
      result,
      duration: Date.now() - startTime,
    };
  }

  private static extractIssuesFromResult(
    result: CheckResult["result"],
  ): CheckIssue[] {
    if (!result.success) {
      if (
        "data" in result &&
        result.data &&
        typeof result.data === "object" &&
        "items" in result.data &&
        Array.isArray(result.data.items)
      ) {
        return result.data.items as CheckIssue[];
      }
      return [];
    }

    const data = result.data;
    if (
      typeof data === "object" &&
      data !== null &&
      "items" in data &&
      Array.isArray(data.items)
    ) {
      return data.items as CheckIssue[];
    }
    return [];
  }

  private static hasErrorSeverity(issues: CheckIssue[]): boolean {
    return issues.some((issue) => issue.severity === "error");
  }

  static async execute(
    data: VibeCheckRequestOutput,
    logger: EndpointLogger,
    platform: Platform,
  ): Promise<ResponseType<VibeCheckResponseOutput>> {
    const isMCP = platform === Platform.MCP;
    try {
      const configResult = await ensureConfigReady(logger, false);

      if (!configResult.ready) {
        return success(
          {
            editorUriSchema: isMCP ? undefined : "vscode://file/", // Default or skip for MCP
            items: [
              {
                file: configResult.configPath,
                severity: "error" as const,
                message: configResult.message,
              },
            ],
            files: isMCP
              ? undefined
              : [
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
          {
            isErrorResponse: true,
            performance: {
              "app.api.system.check.vibeCheck.performance.total": 0,
            },
          },
        );
      }

      // Apply defaults from check.config.ts
      const defaults = configResult.config.vibeCheck || {};

      // Use mcpLimit when platform is MCP, otherwise use regular limit
      const defaultLimit = isMCP
        ? (defaults.mcpLimit ?? defaults.limit ?? 20)
        : (defaults.limit ?? 20000);

      const effectiveData = {
        ...data,
        fix: data.fix ?? defaults.fix ?? false,
        skipEslint: defaults.skipEslint ?? false,
        skipOxlint: defaults.skipOxlint ?? false,
        skipTypecheck: defaults.skipTypecheck ?? false,
        timeout: data.timeout ?? defaults.timeout ?? 3600,
        limit: data.limit ?? defaultLimit,
        page: data.page ?? 1,
      };

      const pathsToCheck = this.normalizePaths(effectiveData.paths);
      const baseDir = env.PROJECT_ROOT || "./";
      const performanceTimings: Partial<Record<TranslationKey, number>> = {};
      let firstCheckStart = 0;
      let lastCheckEnd = 0;

      // Run checkers for all paths in parallel
      // Oxlint supports multiple paths natively, but TypeScript and ESLint need separate runs per path
      const promises: Promise<CheckResult>[] = [];

      // Oxlint can handle multiple paths efficiently in a single run
      if (!effectiveData.skipOxlint && configResult.config.oxlint.enabled) {
        const oxlintPaths =
          pathsToCheck.length === 0
            ? baseDir
            : pathsToCheck.map((p) => p || baseDir);
        logger.info("Starting Oxlint check...");
        promises.push(
          this.runOxlintCheck(
            Array.isArray(oxlintPaths) ? oxlintPaths : [oxlintPaths],
            effectiveData.fix,
            effectiveData.timeout,
            configResult.config,
            logger,
            platform,
          ).then((result) => {
            if (firstCheckStart === 0) {
              firstCheckStart = Date.now();
            }
            lastCheckEnd = Date.now();
            return result;
          }),
        );
      }

      // ESLint and TypeScript: run separately for each path (required for proper file handling)
      for (const path of pathsToCheck) {
        if (!effectiveData.skipEslint && configResult.config.eslint.enabled) {
          logger.info("Starting ESLint check...");
          promises.push(
            this.runEslintCheck(
              path || baseDir,
              effectiveData.fix,
              effectiveData.timeout,
              configResult.config,
              logger,
              platform,
            ).then((result) => {
              if (firstCheckStart === 0) {
                firstCheckStart = Date.now();
              }
              lastCheckEnd = Date.now();
              return result;
            }),
          );
        }

        if (
          !effectiveData.skipTypecheck &&
          configResult.config.typecheck.enabled
        ) {
          logger.info("Starting TypeScript check...");
          promises.push(
            this.runTypecheckCheck(
              path || baseDir,
              effectiveData.timeout,
              configResult.config,
              logger,
              platform,
            ).then((result) => {
              if (firstCheckStart === 0) {
                firstCheckStart = Date.now();
              }
              lastCheckEnd = Date.now();
              return result;
            }),
          );
        }
      }

      const checkResults = await Promise.allSettled(promises);

      logger.debug("All checks completed");

      if (firstCheckStart > 0 && lastCheckEnd > 0) {
        performanceTimings["app.api.system.check.vibeCheck.performance.total"] =
          lastCheckEnd - firstCheckStart;
      }

      const { allIssues, hasErrors } = this.processCheckResults(
        checkResults,
        performanceTimings,
      );

      const sortedIssues = this.sortIssues(allIssues);
      const response = this.buildResponse(
        sortedIssues,
        effectiveData.limit,
        effectiveData.page,
        isMCP, // Skip files for MCP only
        data.filter, // Apply filter
        configResult.config.vibeCheck?.editorUriScheme, // Pass from config
        data.summaryOnly, // Pass summaryOnly flag
      );

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

  private static normalizePaths(
    paths: string | string[] | undefined,
  ): (string | undefined)[] {
    if (!paths) {
      return [undefined];
    }
    if (typeof paths === "string") {
      return [paths];
    }
    return paths.length > 0 ? paths : [undefined];
  }

  private static processCheckResults(
    checkResults: PromiseSettledResult<CheckResult>[],
    performanceTimings: Partial<Record<TranslationKey, number>>,
  ): { allIssues: CheckIssue[]; hasErrors: boolean } {
    const allIssues: CheckIssue[] = [];
    let hasErrors = false;

    for (const checkResult of checkResults) {
      if (checkResult.status === "rejected") {
        hasErrors = true;
        allIssues.push({
          file: "check-error",
          severity: "error",
          message: String(checkResult.reason),
        });
        continue;
      }

      const { type, result, duration } = checkResult.value;

      // Accumulate performance timing
      const key = this.getPerformanceKey(type);
      performanceTimings[key] = (performanceTimings[key] || 0) + duration;

      // Extract issues
      const issues = this.extractIssuesFromResult(result);
      if (issues.length > 0) {
        allIssues.push(...issues);
        if (this.hasErrorSeverity(issues)) {
          hasErrors = true;
        }
      }

      if (!result.success) {
        hasErrors = true;
      }
    }

    return { allIssues, hasErrors };
  }

  private static sortIssues(issues: CheckIssue[]): CheckIssue[] {
    const severityOrder: Record<string, number> = {
      error: 0,
      warning: 1,
      info: 2,
    };

    return issues.toSorted((a, b) => {
      const fileCompare = a.file.localeCompare(b.file);
      if (fileCompare !== 0) {
        return fileCompare;
      }

      const lineA = a.line || 0;
      const lineB = b.line || 0;
      if (lineA !== lineB) {
        return lineA - lineB;
      }

      const severityA = severityOrder[a.severity] ?? 3;
      const severityB = severityOrder[b.severity] ?? 3;
      return severityA - severityB;
    });
  }

  private static buildResponse(
    allIssues: CheckIssue[],
    limit: number,
    page: number,
    skipFiles = false,
    filter?: string | string[],
    editorUriScheme?: string,
    summaryOnly = false,
  ): VibeCheckResponseOutput {
    // When summaryOnly is true, skip filtering and pagination to show total counts
    if (summaryOnly) {
      const summary = calculateFilteredSummary(
        allIssues,
        allIssues,
        allIssues,
        1,
        allIssues.length,
      );

      let files:
        | Array<{
            file: string;
            errors: number;
            warnings: number;
            total: number;
          }>
        | undefined;

      if (!skipFiles) {
        const fileStats = this.buildFileStats(allIssues);
        files = this.formatFileStats(fileStats);
      }

      return {
        editorUriSchema: skipFiles ? undefined : editorUriScheme,
        items: undefined,
        files,
        summary,
      };
    }

    // Apply filtering
    const filteredIssues = filterIssues(allIssues, filter);

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedIssues = filteredIssues.slice(startIndex, endIndex);

    // Calculate summary with filter awareness
    const summary = calculateFilteredSummary(
      allIssues,
      filteredIssues,
      paginatedIssues,
      page,
      limit,
    );

    // Build files list unless skipped (for compact MCP responses)
    let files:
      | Array<{
          file: string;
          errors: number;
          warnings: number;
          total: number;
        }>
      | undefined;

    if (!skipFiles) {
      const fileStats = this.buildFileStats(filteredIssues);
      files = this.formatFileStats(fileStats);
    }

    return {
      editorUriSchema: skipFiles ? undefined : editorUriScheme,
      items: summaryOnly ? undefined : paginatedIssues,
      files,
      summary,
    };
  }

  private static buildFileStats(
    issues: CheckIssue[],
  ): Map<string, { errors: number; warnings: number; total: number }> {
    const fileStats = new Map<
      string,
      { errors: number; warnings: number; total: number }
    >();

    for (const issue of issues) {
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

    return fileStats;
  }

  private static formatFileStats(
    fileStats: Map<string, { errors: number; warnings: number; total: number }>,
  ): Array<{
    file: string;
    errors: number;
    warnings: number;
    total: number;
  }> {
    return [...fileStats.entries()]
      .map(([file, stats]) => ({
        file,
        errors: stats.errors,
        warnings: stats.warnings,
        total: stats.total,
      }))
      .toSorted((a, b) => a.file.localeCompare(b.file));
  }
}
