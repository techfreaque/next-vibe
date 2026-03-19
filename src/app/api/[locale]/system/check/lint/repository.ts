/**
 * Run ESLint Repository
 * Runs ESLint with all target paths in a single process invocation
 */

import { promises as fs } from "node:fs";
import { dirname, relative } from "node:path";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { CountryLanguage } from "@/i18n/core/config";

import type { ResponseType as ApiResponseType } from "../../../shared/types/response.schema";
import { success } from "../../../shared/types/response.schema";
import { parseError } from "../../../shared/utils/parse-error";
import { ConfigRepositoryImpl } from "../config/repository";
import { sortIssuesByLocation } from "../config/shared";
import type { CheckConfig } from "../config/types";
import { calculateFilteredSummary, filterIssues } from "../shared/filter-utils";
import type {
  LintIssue,
  LintRequestOutput,
  LintResponseOutput,
} from "./definition";

/**
 * Run ESLint Repository
 */
export class LintRepository {
  static async execute(
    data: LintRequestOutput,
    logger: EndpointLogger,
    platform: Platform,
    providedConfig: CheckConfig | undefined,
    signal: AbortSignal,
    locale: CountryLanguage,
  ): Promise<ApiResponseType<LintResponseOutput>> {
    const isMCP = platform === Platform.MCP;
    try {
      // Use provided config or load it
      let checkConfig: CheckConfig;
      if (providedConfig) {
        checkConfig = providedConfig;
      } else {
        const configResult = await ConfigRepositoryImpl.ensureConfigReady(
          logger,
          locale,
          false,
        );

        if (!configResult.ready) {
          return success({
            items: [
              {
                file: configResult.configPath,
                severity: "error" as const,
                message: configResult.message,
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
            totalIssues: 1,
            totalFiles: 1,
            totalErrors: 1,
            displayedIssues: 1,
            displayedFiles: 1,
            currentPage: 1,
            totalPages: 1,
          });
        }
        checkConfig = configResult.config;
      }

      // Check if ESLint is enabled in config
      if (!(checkConfig.eslint?.enabled ?? true)) {
        logger.info(
          "ESLint is disabled in check.config.ts (eslint.enabled: false)",
        );

        return success({
          items: [],
          files: [],
          totalIssues: 0,
          totalFiles: 0,
        });
      }

      if (!checkConfig.eslint.enabled) {
        logger.info("ESLint is disabled in check.config.ts");
        return success({
          items: [],
          files: [],
          totalIssues: 0,
          totalFiles: 0,
        });
      }

      logger.debug("[ESLINT] Configuration loaded");

      // Apply mcpLimit when platform is MCP
      const defaults = checkConfig.vibeCheck || {};
      const defaultLimit = isMCP
        ? (defaults.mcpLimit ?? defaults.limit ?? 100)
        : (defaults.limit ?? 200);

      const effectiveData = {
        ...data,
        limit: data.limit ?? defaultLimit,
      };

      // Compute active ignore patterns from extensive flag
      const isExtensive = data.extensive ?? defaults.extensive ?? false;
      const activeIgnorePatterns =
        !isExtensive && checkConfig.eslint.enabled
          ? checkConfig.eslint.nonExtensiveIgnorePatterns
          : undefined;

      const enabledConfig = checkConfig as CheckConfig & {
        eslint: { enabled: true; configPath: string; cachePath: string };
      };

      const pathDisplay = Array.isArray(effectiveData.path)
        ? effectiveData.path.join(", ")
        : effectiveData.path || "./";
      logger.debug(
        `[ESLINT] Starting execution (path: ${pathDisplay}, fix: ${effectiveData.fix})`,
      );

      const result = await LintRepository.executeEslint(
        effectiveData,
        enabledConfig,
        logger,
        isMCP,
        activeIgnorePatterns,
        signal,
      );

      logger.debug(
        `[ESLINT] Completed (${result.displayedIssues ?? result.totalIssues} issues found)`,
      );

      return success(result);
    } catch (error) {
      const errorMessage = parseError(error).message;

      logger.error(`[ESLINT] Execution failed: ${errorMessage}`);

      return success({
        items: [
          {
            file: "unknown",
            severity: "error" as const,
            message: errorMessage,
          },
        ],
        files: [
          {
            file: "unknown",
            errors: 1,
            warnings: 0,
            total: 1,
          },
        ],
        totalIssues: 1,
        totalFiles: 1,
        totalErrors: 1,
        displayedIssues: 1,
        displayedFiles: 1,
        currentPage: 1,
        totalPages: 1,
      });
    }
  }

  /**
   * Run ESLint once with all target paths (files and/or directories).
   * ESLint handles directory traversal natively — no manual file discovery needed.
   */
  private static async executeEslint(
    data: LintRequestOutput,
    checkConfig: {
      eslint: { enabled: true; configPath: string; cachePath: string };
    },
    logger: EndpointLogger,
    skipFiles = false,
    extraIgnorePatterns?: string[],
    signal?: AbortSignal,
  ): Promise<LintResponseOutput> {
    const cacheDir = checkConfig.eslint.cachePath;
    await fs.mkdir(dirname(cacheDir), { recursive: true });

    const targetPaths = data.path
      ? Array.isArray(data.path)
        ? data.path
        : [data.path]
      : ["./"];

    logger.debug(
      `[ESLINT] Running on ${targetPaths.length} path(s): ${targetPaths.join(", ")}`,
    );

    const eslintConfigPath = `${process.cwd()}/${checkConfig.eslint.configPath}`;

    // Build extra --ignore-pattern flags for non-extensive mode
    const ignorePatternArgs =
      extraIgnorePatterns && extraIgnorePatterns.length > 0
        ? extraIgnorePatterns.flatMap((p) => ["--ignore-pattern", p])
        : [];

    const args = [
      "eslint",
      "--format=json",
      "--cache",
      "--cache-location",
      cacheDir,
      "--cache-strategy",
      "metadata",
      "--config",
      eslintConfigPath,
      ...ignorePatternArgs,
      ...targetPaths,
    ];

    if (data.fix) {
      args.push("--fix");
    }

    logger.debug(`[ESLINT] Executing command: bunx ${args.join(" ")}`);

    const { spawn } = await import("node:child_process");
    const stdout = await new Promise<string>((resolve, reject) => {
      if (signal?.aborted) {
        reject(new Error("Aborted"));
        return;
      }
      const child = spawn("bunx", args, {
        cwd: process.cwd(),
        stdio: ["ignore", "pipe", "pipe"],
        shell: false,
        signal,
      });

      let output = "";

      child.stdout?.on("data", (chunk: Buffer) => {
        output += chunk.toString();
      });

      child.stderr?.on("data", () => {
        // Ignore stderr
      });

      child.on("close", (code) => {
        // ESLint exit codes: 0=success, 1=lint errors found, 2=config/internal error
        if (code !== null && code > 2) {
          reject(new Error(`ESLint failed with exit code ${code}`));
        } else {
          resolve(output);
        }
      });

      child.on("error", (error) => {
        reject(error);
      });

      const timeoutId = setTimeout(() => {
        child.kill("SIGTERM");
        setTimeout(() => {
          child.kill("SIGKILL");
        }, 5000);
        reject(new Error(`ESLint timed out after ${data.timeout}s`));
      }, data.timeout * 1000);

      child.on("close", () => {
        clearTimeout(timeoutId);
      });
    });

    const result = await LintRepository.parseEslintOutput(
      stdout,
      data.fix,
      logger,
    );

    const sortedIssues = data.skipSorting
      ? result.issues
      : sortIssuesByLocation(result.issues);

    return LintRepository.buildResponse(sortedIssues, data, skipFiles);
  }

  /**
   * Build file statistics from issues
   */
  private static buildFileStats(
    issues: LintIssue[],
  ): Map<string, { errors: number; warnings: number; total: number }> {
    const fileStats = new Map<
      string,
      { errors: number; warnings: number; total: number }
    >();

    for (const issue of issues) {
      const stats = fileStats.get(issue.file) ?? {
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

  /**
   * Format file statistics for response
   */
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

  /**
   * Build response with pagination and statistics
   */
  private static buildResponse(
    allIssues: LintIssue[],
    data: LintRequestOutput,
    skipFiles = false,
  ): LintResponseOutput {
    if (data.summaryOnly) {
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
        const fileStats = LintRepository.buildFileStats(allIssues);
        files = LintRepository.formatFileStats(fileStats);
      }

      return { items: undefined, files, ...summary };
    }

    const filteredIssues = filterIssues(allIssues, data.filter);

    const limit = data.limit;
    const currentPage = data.page;
    const startIndex = (currentPage - 1) * limit;
    const paginatedIssues = filteredIssues.slice(
      startIndex,
      startIndex + limit,
    );

    const summary = calculateFilteredSummary(
      allIssues,
      filteredIssues,
      paginatedIssues,
      currentPage,
      limit,
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
      const fileStats = LintRepository.buildFileStats(filteredIssues);
      files = LintRepository.formatFileStats(fileStats);
    }

    return {
      items: data.summaryOnly ? undefined : paginatedIssues,
      files,
      ...summary,
    };
  }

  /**
   * Parse ESLint JSON output
   */
  private static async parseEslintOutput(
    stdout: string,
    shouldFix: boolean,
    logger: EndpointLogger,
  ): Promise<{
    issues: LintIssue[];
    hasFixableIssues: boolean;
  }> {
    const issues: LintIssue[] = [];
    let hasFixableIssues = false;

    if (!stdout.trim()) {
      return { issues, hasFixableIssues };
    }

    type EslintResult = Array<{
      filePath: string;
      messages: Array<{
        line: number;
        column: number;
        ruleId: string | null;
        severity: 1 | 2;
        message: string;
        fix?: { range: [number, number]; text: string };
      }>;
      output?: string;
    }>;

    try {
      let parsedResults: EslintResult;
      try {
        parsedResults = JSON.parse(stdout) as EslintResult;
      } catch (parseErr) {
        logger.warn(
          `[ESLINT] Failed to parse JSON output: ${parseErr instanceof Error ? parseErr.message : String(parseErr)} (preview: ${stdout.slice(0, 100)}...)`,
        );
        return { issues, hasFixableIssues };
      }

      if (shouldFix) {
        const writePromises = parsedResults
          .filter((result) => result.output)
          .map(async (result) => {
            try {
              await fs.writeFile(result.filePath, result.output!, "utf8");
            } catch (error) {
              logger.warn(
                `[ESLINT] Failed to write fixed file: ${result.filePath} - ${parseError(error).message}`,
              );
            }
          });

        await Promise.allSettled(writePromises);
      }

      for (const result of parsedResults) {
        const relativePath = relative(process.cwd(), result.filePath);

        for (const msg of result.messages) {
          if (msg.fix && !shouldFix) {
            hasFixableIssues = true;
          }

          const ruleId = msg.ruleId;
          issues.push({
            file: relativePath,
            line: msg.line,
            column: msg.column,
            ...(ruleId && { rule: ruleId }),
            severity: msg.severity === 2 ? "error" : "warning",
            message: msg.message,
          });
        }
      }
    } catch (error) {
      logger.error(
        `[ESLINT] Unexpected error processing results: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    return { issues, hasFixableIssues };
  }
}
