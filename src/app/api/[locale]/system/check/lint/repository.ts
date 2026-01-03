/**
 * Run ESLint Repository (Parallel)
 * Handles parallel eslint operations using Bun.spawn with resource management
 */

import { promises as fs } from "node:fs";
import { dirname, relative, resolve } from "node:path";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { ResponseType as ApiResponseType } from "../../../shared/types/response.schema";
import { success } from "../../../shared/types/response.schema";
import { parseError } from "../../../shared/utils/parse-error";
import { ensureConfigReady } from "../config/repository";
import {
  createWorkerExitCodeMessage,
  createWorkerFailedMessage,
  createWorkerTimeoutMessage,
  discoverFiles,
  distributeFilesAcrossWorkers,
  sortIssuesByLocation,
} from "../config/shared";
import type { CheckConfig } from "../config/types";
import { getSystemResources } from "../config/utils";
import type { LintIssue, LintRequestOutput, LintResponseOutput } from "./definition";

/**
 * Worker task for parallel processing
 */
interface WorkerTask {
  id: number;
  files: string[];
  cacheDir: string;
  eslintConfigPath: string;
  fix: boolean;
  timeout: number;
}

/**
 * Worker result from parallel processing
 */
interface WorkerResult {
  id: number;
  success: boolean;
  issues: Array<{
    file: string;
    line?: number;
    column?: number;
    rule?: string;
    code?: string;
    severity: "error" | "warning" | "info";
    message: string;
    type: "oxlint" | "lint" | "type";
  }>;
  duration: number;
  error?: string;
}

/**
 * Run ESLint Repository Interface
 */
export interface LintRepositoryInterface {
  execute(
    data: LintRequestOutput,
    logger: EndpointLogger,
    providedConfig?: CheckConfig,
  ): Promise<ApiResponseType<LintResponseOutput>>;
}

/**
 * Run ESLint Repository Implementation (Parallel)
 */
export class LintRepositoryImpl implements LintRepositoryInterface {
  async execute(
    data: LintRequestOutput,
    logger: EndpointLogger,
    providedConfig?: CheckConfig,
  ): Promise<ApiResponseType<LintResponseOutput>> {
    try {
      // Use provided config or load it
      let checkConfig: CheckConfig;
      if (providedConfig) {
        checkConfig = providedConfig;
      } else {
        const configResult = await ensureConfigReady(logger, false);

        if (!configResult.ready) {
          return success({
            issues: {
              items: [
                {
                  file: configResult.configPath,
                  severity: "error" as const,
                  message: configResult.message,
                  type: "lint" as const,
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
          });
        }
        checkConfig = configResult.config;
      }

      // Check if ESLint is enabled in config
      if (!(checkConfig.eslint?.enabled ?? true)) {
        logger.info("ESLint is disabled in check.config.ts (eslint.enabled: false)");

        return success({
          issues: {
            items: [],
            files: [],
            summary: {
              totalIssues: 0,
              totalFiles: 0,
              totalErrors: 0,
              displayedIssues: 0,
              displayedFiles: 0,
              currentPage: 1,
              totalPages: 1,
            },
          },
        });
      }

      // Check if ESLint is enabled
      if (!checkConfig.eslint.enabled) {
        logger.info("ESLint is disabled in check.config.ts");
        return success({
          issues: {
            items: [],
            files: [],
            summary: {
              totalIssues: 0,
              totalFiles: 0,
              totalErrors: 0,
              displayedIssues: 0,
              displayedFiles: 0,
              currentPage: 1,
              totalPages: 1,
            },
          },
        });
      }

      logger.debug("[ESLINT] Configuration loaded");

      // At this point, we know eslint is enabled (checked above)
      const enabledConfig = checkConfig as CheckConfig & {
        eslint: { enabled: true; configPath: string; cachePath: string };
      };

      // Check if parallel mode is enabled
      const useParallel = enabledConfig.eslint.parallel ?? true;

      if (!useParallel) {
        // Non-parallel mode: pass paths directly to eslint

        logger.debug(
          `[ESLINT] Starting sequential execution (path: ${data.path || "./"}, fix: ${data.fix})`,
        );

        const result = await this.executeSequential(data, enabledConfig, logger);

        logger.debug(
          `[ESLINT] Sequential execution completed (${result.issues.items.length} issues found)`,
        );

        return success(result);
      }

      // Parallel mode: discover files and distribute across workers

      logger.debug(
        `[ESLINT] Starting parallel execution (path: ${data.path || "./"}, fix: ${data.fix})`,
      );

      // Get system resources and determine optimal worker count
      const resources = getSystemResources();

      logger.debug(
        `[ESLINT] System resources detected (CPUs: ${resources.cpuCores}, Memory: ${resources.availableMemoryMB}MB)`,
      );

      // Discover files to lint using config's ignored directories
      const filesToLint = await discoverFiles(data.path || "./", logger, {
        extensions: enabledConfig.eslint.lintableExtensions,
        ignores: enabledConfig.eslint.ignores || [],
      });

      logger.debug(`[ESLINT] Found ${filesToLint.length} files to lint`);

      if (filesToLint.length === 0) {
        return success({
          issues: {
            items: [],
            files: [],
            summary: {
              totalIssues: 0,
              totalFiles: 0,
              totalErrors: 0,
              displayedIssues: 0,
              displayedFiles: 0,
              currentPage: 1,
              totalPages: 1,
            },
          },
        });
      }

      // Distribute files across workers
      const eslintConfigPath = resolve(process.cwd(), enabledConfig.eslint.configPath);
      const workerTasks = this.distributeFiles(
        filesToLint,
        resources.maxWorkers,
        data,
        eslintConfigPath,
      );

      logger.debug(`[ESLINT] Distributing work across ${workerTasks.length} workers`);

      // Pre-create all cache directories in parallel
      await this.createCacheDirectories(workerTasks, logger);

      // Execute workers in parallel
      const workerResults = await this.executeWorkersInParallel(workerTasks, logger);

      // Merge results from all workers
      const mergedResult = this.mergeWorkerResults(workerResults, data, logger);

      logger.debug(
        `[ESLINT] Parallel execution completed (${mergedResult.issues.items.length} issues found)`,
      );

      return success(mergedResult);
    } catch (error) {
      const errorMessage = parseError(error).message;

      logger.error(`[ESLINT] Parallel execution failed: ${errorMessage}`);

      return success({
        issues: {
          items: [
            {
              file: "unknown",
              severity: "error" as const,
              message: errorMessage,
              type: "lint" as const,
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
      });
    }
  }

  /**
   * Execute ESLint sequentially (non-parallel mode)
   * Passes paths directly to eslint instead of discovering all files
   */
  private async executeSequential(
    data: LintRequestOutput,
    checkConfig: {
      eslint: { enabled: true; configPath: string; cachePath: string };
    },
    logger: EndpointLogger,
  ): Promise<LintResponseOutput> {
    // Ensure cache directory exists
    const cacheDir = checkConfig.eslint.cachePath;
    await fs.mkdir(dirname(cacheDir), { recursive: true });

    // Handle multiple paths - support files, folders, or mixed
    const targetPaths = data.path ? (Array.isArray(data.path) ? data.path : [data.path]) : ["./"];

    logger.debug(`[ESLINT] Running on ${targetPaths.length} path(s): ${targetPaths.join(", ")}`);

    // Build ESLint command
    const eslintConfigPath = resolve(process.cwd(), checkConfig.eslint.configPath);
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
      ...targetPaths,
    ];

    if (data.fix) {
      args.push("--fix");
    }

    // Execute ESLint

    logger.debug(`[ESLINT] Executing command: bunx ${args.join(" ")}`);

    const { spawn } = await import("node:child_process");
    const stdout = await new Promise<string>((resolve, reject) => {
      const child = spawn("bunx", args, {
        cwd: process.cwd(),
        stdio: ["ignore", "pipe", "pipe"],
        shell: false,
      });

      let output = "";

      child.stdout?.on("data", (data: Buffer) => {
        output += data.toString();
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

      // Set timeout
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

    // Parse ESLint output
    const result = await this.parseEslintOutputWithFixableDetection(stdout, data.fix, logger);

    // Build response
    const sortedIssues = data.skipSorting ? result.issues : sortIssuesByLocation(result.issues);

    return this.buildResponse(sortedIssues, data);
  }

  /**
   * Distribute files across workers evenly
   * Note: Only called when eslint is enabled
   */
  private distributeFiles(
    files: string[],
    workerCount: number,
    data: LintRequestOutput,
    eslintConfigPath: string,
  ): WorkerTask[] {
    const distributed = distributeFilesAcrossWorkers(files, workerCount);

    return distributed.map((workerFiles, index) => ({
      id: index,
      files: workerFiles,
      cacheDir: data.cacheDir,
      eslintConfigPath,
      fix: data.fix,
      timeout: data.timeout,
    }));
  }

  /**
   * Create global cache directory
   */
  private async createCacheDirectories(tasks: WorkerTask[], logger: EndpointLogger): Promise<void> {
    if (tasks.length === 0) {
      return;
    }

    // All workers use the same cache directory now
    const globalCacheDir = tasks[0].cacheDir;

    try {
      await fs.mkdir(dirname(globalCacheDir), { recursive: true });
    } catch (error) {
      logger.warn(
        `[ESLINT] Failed to create global cache directory: ${globalCacheDir} - ${parseError(error).message}`,
      );
    }
  }

  /**
   * Execute workers in parallel using Bun.spawn
   */
  private async executeWorkersInParallel(
    tasks: WorkerTask[],
    logger: EndpointLogger,
  ): Promise<WorkerResult[]> {
    const results: WorkerResult[] = [];

    // Execute all workers in parallel
    const workerPromises = tasks.map((task) => this.executeWorker(task, logger));

    const workerResults = await Promise.allSettled(workerPromises);

    for (let i = 0; i < workerResults.length; i++) {
      const result = workerResults[i];
      if (result.status === "fulfilled") {
        results.push(result.value);
      } else {
        // Handle failed worker
        results.push({
          id: tasks[i].id,
          success: false,
          issues: [
            {
              file: "worker-error",
              severity: "error" as const,
              message: createWorkerFailedMessage(tasks[i].id, String(result.reason)),
              type: "lint" as const,
            },
          ],
          duration: 0,
          error: String(result.reason),
        });
      }
    }

    return results;
  }

  /**
   * Execute a single worker using Bun.spawn
   */
  private async executeWorker(task: WorkerTask, logger: EndpointLogger): Promise<WorkerResult> {
    const startTime = Date.now();

    try {
      // Cache directory already created in parallel during setup

      const baseArgs = [
        "eslint",
        "--format=json",
        "--cache",
        "--cache-location",
        task.cacheDir,
        "--cache-strategy",
        "metadata",
        // Use ESLint config path from check.config.ts
        "--config",
        task.eslintConfigPath,
        ...task.files,
      ];

      // If fix is requested, first check if there are any fixable issues
      if (task.fix) {
        const checkResult = await this.runEslintCommand(baseArgs, task, logger);
        if (!checkResult.hasFixableIssues) {
          // No fixable issues, return the check result
          return {
            id: task.id,
            success: true,
            issues: checkResult.issues,
            duration: Date.now() - startTime,
          };
        }

        // There are fixable issues, run with --fix
        const fixArgs = [...baseArgs, "--fix"];
        const fixResult = await this.runEslintCommand(fixArgs, task, logger);
        return {
          id: task.id,
          success: true,
          issues: fixResult.issues,
          duration: Date.now() - startTime,
        };
      }

      // Just run normal check
      const result = await this.runEslintCommand(baseArgs, task, logger);
      return {
        id: task.id,
        success: true,
        issues: result.issues,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      const errorMessage = parseError(error).message;

      logger.error(`[ESLINT:Worker${task.id}] Execution failed: ${errorMessage}`);

      return {
        id: task.id,
        success: false,
        issues: [
          {
            file: "worker-error",
            severity: "error" as const,
            message: errorMessage,
            type: "lint" as const,
          },
        ],
        duration: Date.now() - startTime,
        error: errorMessage,
      };
    }
  }

  /**
   * Build file statistics from issues
   */
  private buildFileStats(
    issues: LintIssue[],
  ): Map<string, { errors: number; warnings: number; total: number }> {
    const fileStats = new Map<string, { errors: number; warnings: number; total: number }>();

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

  /**
   * Format file statistics for response
   */
  private formatFileStats(
    fileStats: Map<string, { errors: number; warnings: number; total: number }>,
  ): Array<{ file: string; errors: number; warnings: number; total: number }> {
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
  private buildResponse(allIssues: LintIssue[], data: LintRequestOutput): LintResponseOutput {
    const totalIssues = allIssues.length;
    const totalFiles = new Set(allIssues.map((issue) => issue.file)).size;
    const totalErrors = allIssues.filter((issue) => issue.severity === "error").length;

    const fileStats = this.buildFileStats(allIssues);
    const allFiles = this.formatFileStats(fileStats);
    const limitedFiles = data.maxFilesInSummary
      ? allFiles.slice(0, data.maxFilesInSummary)
      : allFiles;

    const limit = data.limit;
    const currentPage = data.page;
    const totalPages = Math.ceil(totalIssues / limit);
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    const limitedIssues = allIssues.slice(startIndex, endIndex);

    const displayedIssues = limitedIssues.length;
    const displayedFiles = new Set(limitedIssues.map((issue) => issue.file)).size;

    return {
      issues: {
        items: limitedIssues,
        files: limitedFiles,
        summary: {
          totalIssues,
          totalFiles,
          totalErrors,
          displayedIssues,
          displayedFiles,
          truncatedMessage:
            displayedIssues < totalIssues || displayedFiles < totalFiles
              ? `Showing ${displayedIssues} of ${totalIssues} issues from ${displayedFiles} of ${totalFiles} files`
              : "",
          currentPage,
          totalPages,
        },
      },
    };
  }

  /**
   * Merge results from all workers
   */
  private mergeWorkerResults(
    workerResults: WorkerResult[],
    data: LintRequestOutput,
    logger: EndpointLogger,
  ): LintResponseOutput {
    const allIssues: LintIssue[] = [];

    // Collect all issues from workers
    for (const result of workerResults) {
      allIssues.push(...result.issues);
    }

    // Sort issues by file, then by line number (unless skipSorting is true)
    const issues = data.skipSorting ? allIssues : sortIssuesByLocation(allIssues);

    logger.debug(
      `[ESLINT] Merged results from ${workerResults.length} workers (${issues.length} total issues)`,
    );

    return this.buildResponse(issues, data);
  }

  /**
   * Run ESLint command and return results with fixable issue detection
   */
  private async runEslintCommand(
    args: string[],
    task: WorkerTask,
    logger: EndpointLogger,
  ): Promise<{
    issues: LintIssue[];
    hasFixableIssues: boolean;
  }> {
    logger.debug(`[ESLINT:Worker${task.id}] Executing command: bunx ${args.join(" ")}`);

    // Use spawn for parallel execution
    const { spawn } = await import("node:child_process");
    const stdout = await new Promise<string>((resolve, reject) => {
      const child = spawn("bunx", args, {
        cwd: process.cwd(),
        stdio: ["ignore", "pipe", "pipe"],
        shell: false,
      });

      let output = "";

      child.stdout?.on("data", (data: Buffer) => {
        output += data.toString();
      });

      child.stderr?.on("data", () => {
        // Ignore stderr for ESLint output
      });

      child.on("close", (code) => {
        // ESLint exit codes: 0=success, 1=lint errors found, 2=config/internal error
        // ESLint with JSON format outputs valid JSON even on code 2, so we accept 0-2
        // Only reject on unexpected errors (code > 2)
        if (code !== null && code > 2) {
          reject(new Error(createWorkerExitCodeMessage(task.id, code)));
        } else {
          resolve(output);
        }
      });

      child.on("error", (error) => {
        reject(error);
      });

      // Set timeout
      const timeoutId = setTimeout(() => {
        child.kill("SIGTERM");
        setTimeout(() => {
          child.kill("SIGKILL");
        }, 5000);
        reject(new Error(createWorkerTimeoutMessage(task.id, task.timeout)));
      }, task.timeout * 1000);

      // Clear timeout when process completes
      child.on("close", () => {
        clearTimeout(timeoutId);
      });
    });

    // Parse ESLint output and detect fixable issues
    const result = await this.parseEslintOutputWithFixableDetection(
      stdout,
      args.includes("--fix"),
      logger,
    );

    logger.debug(
      `[ESLINT:Worker${task.id}] Completed with ${result.issues.length} issues (${result.hasFixableIssues ? "has" : "no"} fixable)`,
    );

    return result;
  }

  /**
   * Parse ESLint JSON output and detect fixable issues
   */
  private async parseEslintOutputWithFixableDetection(
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

    // Define ESLint result structure for type safety
    type EslintResult = Array<{
      filePath: string;
      messages: Array<{
        line: number;
        column: number;
        ruleId: string | null;
        severity: 1 | 2;
        message: string;
        fix?: { range: [number, number]; text: string }; // ESLint provides fix info for fixable issues
      }>;
      output?: string; // Fixed content when --fix is used
    }>;

    try {
      let parsedResults: EslintResult;
      try {
        parsedResults = JSON.parse(stdout) as EslintResult;
      } catch (parseError) {
        // JSON parse failed - log the error and return empty results

        logger.warn(
          `[ESLINT] Failed to parse JSON output: ${parseError instanceof Error ? parseError.message : String(parseError)} (preview: ${stdout.slice(0, 100)}...)`,
        );
        return { issues, hasFixableIssues };
      }

      // If --fix was used, write the fixed content back to files in parallel
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

        // Execute all file writes in parallel
        await Promise.allSettled(writePromises);
      }

      // Convert results to issues and detect fixable ones in parallel
      const processedResults = parsedResults.map((result) => {
        const relativePath = relative(process.cwd(), result.filePath);
        const resultIssues: LintIssue[] = [];
        let hasFixableInResult = false;

        for (const msg of result.messages) {
          // Check if this issue is fixable
          if (msg.fix && !shouldFix) {
            hasFixableInResult = true;
          }

          resultIssues.push({
            file: relativePath,
            line: msg.line,
            column: msg.column,
            rule: msg.ruleId || "unknown",
            code: msg.ruleId || "unknown",
            severity: msg.severity === 2 ? "error" : "warning",
            message: msg.message,
            type: "lint",
          });
        }

        return { issues: resultIssues, hasFixable: hasFixableInResult };
      });

      // Combine all issues and fixable flags
      for (const processed of processedResults) {
        issues.push(...processed.issues);
        if (processed.hasFixable) {
          hasFixableIssues = true;
        }
      }
    } catch (error) {
      // Unexpected error during processing

      logger.error(
        `[ESLINT] Unexpected error processing results: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    return { issues, hasFixableIssues };
  }
}

/**
 * Default repository instance
 */
export const lintRepository = new LintRepositoryImpl();
