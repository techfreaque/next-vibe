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
  generateIssueSummary,
  sortIssuesByLocation,
} from "../config/shared";
import { getSystemResources } from "../config/utils";
import type { LintRequestOutput, LintResponseOutput } from "./definition";

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
    severity: "error" | "warning" | "info";
    message: string;
    type: "lint";
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
  ): Promise<ApiResponseType<LintResponseOutput>>;
}

/**
 * Run ESLint Repository Implementation (Parallel)
 */
export class LintRepositoryImpl implements LintRepositoryInterface {
  async execute(
    data: LintRequestOutput,
    logger: EndpointLogger,
  ): Promise<ApiResponseType<LintResponseOutput>> {
    const startTime = Date.now();
    try {
      // Use unified config management - checks, creates if needed, and regenerates
      const configResult = await ensureConfigReady(logger, data.createConfig);

      if (!configResult.ready) {
        return success({
          success: false,
          issues: [
            {
              file: configResult.configPath,
              severity: "error" as const,
              message: configResult.message,
              type: "lint" as const,
            },
          ],
          duration: Date.now() - startTime,
          totalIssues: 1,
          totalErrors: 1,
          totalWarnings: 0,
          totalFiles: 0,
          summary: {
            totalIssues: 1,
            totalErrors: 1,
            totalWarnings: 0,
            totalFiles: 0,
          },
        });
      }

      const checkConfig = configResult.config;

      // Check if ESLint is enabled in config
      if (!(checkConfig.eslint?.enabled ?? true)) {
        // eslint-disable-next-line i18next/no-literal-string
        logger.info(
          "ESLint is disabled in check.config.ts (eslint.enabled: false)",
        );

        return success({
          success: true,
          issues: [],
          duration: Date.now() - startTime,
          totalIssues: 0,
          totalErrors: 0,
          totalWarnings: 0,
          totalFiles: 0,
          summary: {
            totalIssues: 0,
            totalErrors: 0,
            totalWarnings: 0,
            totalFiles: 0,
          },
        });
      }

      // Check if ESLint is enabled
      if (!checkConfig.eslint.enabled) {
        logger.info("ESLint is disabled in check.config.ts");
        return success({
          success: true,
          issues: [],
        });
      }

      logger.debug("ESLint configuration loaded");

      logger.debug("Starting parallel ESLint execution", {
        path: data.path,
        fix: data.fix,
        verbose: data.verbose,
      });

      // Get system resources and determine optimal worker count
      const resources = getSystemResources();
      logger.debug("System resources detected", {
        cpus: resources.cpuCores,
        memory: resources.availableMemoryMB,
      });

      // Discover files to lint using config's ignored directories
      const filesToLint = await discoverFiles(data.path || "./", logger, {
        extensions: checkConfig.eslint.lintableExtensions,
        ignores: checkConfig.eslint.ignores || [],
      });
      logger.debug(`Found ${filesToLint.length} files to lint`);

      if (filesToLint.length === 0) {
        return success({
          success: true,
          issues: [],
          duration: Date.now() - startTime,
          totalIssues: 0,
          totalErrors: 0,
          totalWarnings: 0,
          totalFiles: 0,
          summary: {
            totalIssues: 0,
            totalErrors: 0,
            totalWarnings: 0,
            totalFiles: 0,
          },
        });
      }

      // Distribute files across workers
      const eslintConfigPath = checkConfig.eslint.enabled
        ? resolve(process.cwd(), checkConfig.eslint.configPath)
        : "";
      const workerTasks = this.distributeFiles(
        filesToLint,
        resources.maxWorkers,
        data,
        eslintConfigPath,
      );
      logger.debug(`Distributing work across ${workerTasks.length} workers`);

      // Pre-create all cache directories in parallel
      await this.createCacheDirectories(workerTasks, logger);

      // Execute workers in parallel
      const workerResults = await this.executeWorkersInParallel(
        workerTasks,
        logger,
      );

      // Merge results from all workers
      const mergedResult = this.mergeWorkerResults(workerResults, logger);

      logger.debug("Parallel ESLint execution completed", {
        totalIssues: mergedResult.issues.length,
        success: mergedResult.success,
      });

      return success(mergedResult);
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = parseError(error).message;
      logger.error("Parallel ESLint execution failed", { error: errorMessage });

      const errorIssues = [
        {
          file: "unknown",
          severity: "error" as const,
          message: errorMessage,
          type: "lint" as const,
        },
      ];

      const errorSummary = generateIssueSummary(errorIssues);

      return success({
        success: false,
        issues: errorIssues,
        duration,
        totalIssues: errorSummary.total,
        totalErrors: errorSummary.errors,
        totalWarnings: errorSummary.warnings,
        totalFiles: 1,
        summary: {
          totalIssues: errorSummary.total,
          totalErrors: errorSummary.errors,
          totalWarnings: errorSummary.warnings,
          totalFiles: 1,
        },
      });
    }
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
  private async createCacheDirectories(
    tasks: WorkerTask[],
    logger: EndpointLogger,
  ): Promise<void> {
    if (tasks.length === 0) {
      return;
    }

    // All workers use the same cache directory now
    const globalCacheDir = tasks[0].cacheDir;

    try {
      await fs.mkdir(dirname(globalCacheDir), { recursive: true });
    } catch (error) {
      logger.warn(
        `Failed to create global cache directory: ${globalCacheDir}`,
        {
          error: parseError(error).message,
        },
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
    const workerPromises = tasks.map((task) =>
      this.executeWorker(task, logger),
    );

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
              message: createWorkerFailedMessage(
                tasks[i].id,
                String(result.reason),
              ),
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
  private async executeWorker(
    task: WorkerTask,
    logger: EndpointLogger,
  ): Promise<WorkerResult> {
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
      logger.error(`Worker ${task.id} failed`, { error: errorMessage });

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
   * Merge results from all workers
   */
  private mergeWorkerResults(
    workerResults: WorkerResult[],
    logger: EndpointLogger,
  ): LintResponseOutput {
    const allIssues: Array<{
      file: string;
      line?: number;
      column?: number;
      rule?: string;
      severity: "error" | "warning" | "info";
      message: string;
      type: "lint";
    }> = [];

    let hasWorkerErrors = false;

    // Collect all issues from workers
    for (const result of workerResults) {
      allIssues.push(...result.issues);

      if (!result.success) {
        hasWorkerErrors = true;
      }
    }

    // Sort issues by file, then by line number
    const sortedIssues = sortIssuesByLocation(allIssues);

    const hasErrors =
      sortedIssues.some((i) => i.severity === "error") || hasWorkerErrors;

    logger.debug("Merged worker results", {
      totalWorkers: workerResults.length,
      totalIssues: sortedIssues.length,
      hasErrors,
    });

    return {
      success: !hasErrors,
      issues: sortedIssues,
    };
  }

  /**
   * Run ESLint command and return results with fixable issue detection
   */
  private async runEslintCommand(
    args: string[],
    task: WorkerTask,
    logger: EndpointLogger,
  ): Promise<{
    issues: Array<{
      file: string;
      line?: number;
      column?: number;
      rule?: string;
      severity: "error" | "warning" | "info";
      message: string;
      type: "lint";
    }>;
    hasFixableIssues: boolean;
  }> {
    logger.debug(`Worker ${task.id} starting with ${task.files.length} files`);

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
        reject(
          new Error(createWorkerTimeoutMessage(task.id, task.timeout)),
        );
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
      `Worker ${task.id} completed with ${result.issues.length} issues, ${result.hasFixableIssues ? "has" : "no"} fixable issues`,
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
    issues: Array<{
      file: string;
      line?: number;
      column?: number;
      rule?: string;
      severity: "error" | "warning" | "info";
      message: string;
      type: "lint";
    }>;
    hasFixableIssues: boolean;
  }> {
    const issues: Array<{
      file: string;
      line?: number;
      column?: number;
      rule?: string;
      severity: "error" | "warning" | "info";
      message: string;
      type: "lint";
    }> = [];

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
        logger.warn("Failed to parse ESLint JSON output", {
          error:
            parseError instanceof Error
              ? parseError.message
              : String(parseError),
          stdoutPreview: stdout.slice(0, 200),
        });
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
              logger.warn(`Failed to write fixed file: ${result.filePath}`, {
                error: parseError(error).message,
              });
            }
          });

        // Execute all file writes in parallel
        await Promise.allSettled(writePromises);
      }

      // Convert results to issues and detect fixable ones in parallel
      const processedResults = parsedResults.map((result) => {
        const relativePath = relative(process.cwd(), result.filePath);
        const resultIssues: Array<{
          file: string;
          line?: number;
          column?: number;
          rule?: string;
          severity: "error" | "warning" | "info";
          message: string;
          type: "lint";
        }> = [];
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
      logger.error("Unexpected error processing ESLint results", {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return { issues, hasFixableIssues };
  }

}

/**
 * Default repository instance
 */
export const lintRepository = new LintRepositoryImpl();
