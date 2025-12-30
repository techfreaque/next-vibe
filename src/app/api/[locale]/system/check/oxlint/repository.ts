/**
 * Run Oxlint Repository (Parallel)
 * Handles parallel oxlint operations using child_process.spawn with resource management
 */

import { existsSync, promises as fs } from "node:fs";
import { relative, resolve } from "node:path";

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
import type { CheckConfig, PrettierConfig } from "../config/types";
import { getSystemResources } from "../config/utils";
import type {
  OxlintIssue,
  OxlintRequestOutput,
  OxlintResponseOutput,
} from "./definition";

/**
 * Worker task for parallel processing
 */
interface WorkerTask {
  id: number;
  files: string[];
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
 * Run Oxlint Repository Interface
 */
export interface OxlintRepositoryInterface {
  execute(
    data: OxlintRequestOutput,
    logger: EndpointLogger,
  ): Promise<ApiResponseType<OxlintResponseOutput>>;
}

/**
 * Run Oxlint Repository Implementation (Parallel)
 */
export class OxlintRepositoryImpl implements OxlintRepositoryInterface {
  private config: CheckConfig | null = null;

  async execute(
    data: OxlintRequestOutput,
    logger: EndpointLogger,
  ): Promise<ApiResponseType<OxlintResponseOutput>> {
    try {
      logger.debug("Starting parallel Oxlint execution", {
        path: data.path,
        fix: data.fix,
      });

      // Use unified config management - checks, creates if needed, and regenerates
      const configResult = await ensureConfigReady(logger, data.createConfig);

      if (!configResult.ready) {
        return success({
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
        });
      }

      // Config is ready - store it for use in methods
      this.config = configResult.config;

      // Check if oxlint is enabled
      if (!this.config.oxlint.enabled) {
        logger.info("Oxlint is disabled in check.config.ts");
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

      // Ensure cache directory exists
      const cacheDir = this.config.oxlint.cachePath;
      await fs.mkdir(cacheDir, { recursive: true });

      // Get system resources and determine optimal worker count
      const resources = getSystemResources();
      logger.debug("System resources detected", {
        cpus: resources.cpuCores,
        memory: resources.availableMemoryMB,
      });

      // Handle multiple paths
      const targetPaths = data.path
        ? Array.isArray(data.path)
          ? data.path
          : [data.path]
        : ["./"];

      logger.debug("Resolving target paths", { targetPaths });

      // Discover files to lint from all paths
      const filesToLint: string[] = [];
      for (const targetPath of targetPaths) {
        const pathFiles = await discoverFiles(targetPath, logger, {
          extensions: this.config.oxlint.lintableExtensions,
          ignores: this.config.oxlint.ignorePatterns || [],
        });
        filesToLint.push(...pathFiles);
      }

      logger.debug(`Found ${filesToLint.length} files to lint`);

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
      const workerTasks = this.distributeFiles(
        filesToLint,
        resources.maxWorkers,
        data,
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
      const mergedResult = this.mergeWorkerResults(workerResults, data, logger);

      logger.debug("Parallel Oxlint execution completed", {
        totalIssues: mergedResult.issues.items.length,
      });

      return success(mergedResult);
    } catch (error) {
      const errorMessage = parseError(error).message;
      logger.error("Parallel Oxlint execution failed", { error: errorMessage });

      return success({
        issues: {
          items: [
            {
              file: "unknown",
              severity: "error" as const,
              message: errorMessage,
              type: "oxlint" as const,
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
   * Distribute files across workers evenly
   */
  private distributeFiles(
    files: string[],
    workerCount: number,
    data: OxlintRequestOutput,
  ): WorkerTask[] {
    const distributed = distributeFilesAcrossWorkers(files, workerCount);

    return distributed.map((workerFiles, index) => ({
      id: index,
      files: workerFiles,
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

    try {
      // oxlint is guaranteed to be enabled when this method is called
      // (this method is only invoked after config validation in execute())
      if (this.config?.oxlint.enabled) {
        await fs.mkdir(this.config.oxlint.cachePath, { recursive: true });
      }
    } catch (error) {
      logger.warn("Failed to create global cache directory", {
        error: parseError(error).message,
      });
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
              type: "oxlint" as const,
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

      // Build oxlint command arguments
      // oxlint is guaranteed to be enabled when this method is called
      // (this method is only invoked after config validation in execute())
      if (!this.config?.oxlint.enabled) {
        // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax
        throw new Error("Oxlint config not available");
      }
      const oxlintConfigPath = resolve(this.config.oxlint.configPath);

      // Check if config exists, if not use default settings
      const configExists = existsSync(oxlintConfigPath);

      /* eslint-disable i18next/no-literal-string */
      const baseArgs = configExists
        ? [
            "oxlint",
            "--format=json",
            "--config",
            oxlintConfigPath,
            "--tsconfig",
            "./tsconfig.json",
            ...task.files,
          ]
        : [
            "oxlint",
            "--format=json",
            // Fallback: Enable plugins manually if no config
            "--tsconfig",
            "./tsconfig.json",
            "--react-plugin",
            "--jsx-a11y-plugin",
            "--nextjs-plugin",
            "-D",
            "all",
            ...task.files,
          ];
      /* eslint-enable i18next/no-literal-string */

      // If fix is requested, run oxlint --fix and prettier in parallel
      if (task.fix) {
        const fixArgs = [...baseArgs, "--fix"];

        // Run both oxlint --fix and prettier in parallel
        const [fixResult, prettierResult] = await Promise.allSettled([
          this.runOxlintCommand(fixArgs, task, logger),
          this.runPrettierFix(task.files, logger),
        ]);

        // Handle oxlint result
        let issues: OxlintIssue[] = [];

        if (fixResult.status === "fulfilled") {
          issues = fixResult.value.issues;
        } else {
          logger.error("Oxlint fix failed", {
            error: String(fixResult.reason),
          });
          issues = [
            {
              file: "oxlint-error",
              severity: "error" as const,
              // eslint-disable-next-line i18next/no-literal-string
              message: `Oxlint failed: ${String(fixResult.reason)}`,
              type: "oxlint" as const,
            },
          ];
        }

        // Handle prettier result
        if (prettierResult.status === "rejected") {
          logger.warn("Prettier formatting failed", {
            error: String(prettierResult.reason),
          });
        }

        return {
          id: task.id,
          success: fixResult.status === "fulfilled",
          issues,
          duration: Date.now() - startTime,
        };
      }

      // Just run normal check
      const result = await this.runOxlintCommand(baseArgs, task, logger);
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
            type: "oxlint" as const,
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
    issues: OxlintIssue[],
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
  private buildResponse(
    allIssues: OxlintIssue[],
    data: OxlintRequestOutput,
  ): OxlintResponseOutput {
    const totalIssues = allIssues.length;
    const totalFiles = new Set(allIssues.map((issue) => issue.file)).size;
    const totalErrors = allIssues.filter(
      (issue) => issue.severity === "error",
    ).length;

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
    const displayedFiles = new Set(limitedIssues.map((issue) => issue.file))
      .size;

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
    data: OxlintRequestOutput,
    logger: EndpointLogger,
  ): OxlintResponseOutput {
    const allIssues: OxlintIssue[] = [];

    // Collect all issues from workers
    for (const result of workerResults) {
      allIssues.push(...result.issues);
    }

    // Sort issues by file, then by line number (unless skipSorting is true)
    const issues = data.skipSorting
      ? allIssues
      : sortIssuesByLocation(allIssues);

    logger.debug("Merged worker results", {
      totalWorkers: workerResults.length,
      totalIssues: issues.length,
    });

    return this.buildResponse(issues, data);
  }

  /**
   * Run oxlint command and return results
   */
  private async runOxlintCommand(
    args: string[],
    task: WorkerTask,
    logger: EndpointLogger,
  ): Promise<{
    issues: OxlintIssue[];
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
      let stderrOutput = "";

      child.stdout?.on("data", (data: Buffer) => {
        output += data.toString();
      });

      child.stderr?.on("data", (data: Buffer) => {
        stderrOutput += data.toString();
      });

      child.on("close", (code) => {
        // Oxlint exit codes: 0=no issues, 1=lint issues found, 2=fatal/config error
        // Unlike ESLint, oxlint doesn't output valid results on fatal errors
        // So we only accept 0 and 1, reject on code >= 2
        if (code !== null && code >= 2) {
          const errorMsg =
            stderrOutput.trim() || createWorkerExitCodeMessage(task.id, code);
          reject(new Error(errorMsg));
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

    // Parse oxlint output
    const result = await this.parseOxlintOutput(stdout, logger);

    logger.debug(
      `Worker ${task.id} completed with ${result.issues.length} issues`,
    );

    return result;
  }

  /**
   * Parse oxlint JSON output
   */
  private async parseOxlintOutput(
    stdout: string,
    logger: EndpointLogger,
  ): Promise<{
    issues: OxlintIssue[];
  }> {
    const issues: OxlintIssue[] = [];

    if (!stdout.trim()) {
      return { issues };
    }

    // Oxlint JSON output structure
    interface OxlintLabel {
      span: {
        offset: number;
        length: number;
        line: number;
        column: number;
      };
      message?: string;
    }

    interface OxlintDiagnostic {
      message: string;
      code: string; // Rule ID like "eslint(func-style)"
      severity: "error" | "warning" | "advice";
      filename: string;
      labels?: OxlintLabel[];
      help?: string;
      url?: string;
    }

    interface OxlintOutput {
      diagnostics: OxlintDiagnostic[];
      number_of_files: number;
      number_of_rules: number;
      threads_count: number;
      start_time: number;
    }

    try {
      let parsedOutput: OxlintOutput;
      try {
        parsedOutput = JSON.parse(stdout) as OxlintOutput;
      } catch (parseError) {
        // JSON parse failed - log the error and return empty results
        logger.warn("Failed to parse oxlint JSON output", {
          error:
            parseError instanceof Error
              ? parseError.message
              : String(parseError),
          stdoutPreview: stdout.slice(0, 200),
        });
        return { issues };
      }

      // Convert oxlint diagnostics to our issue format
      for (const diagnostic of parsedOutput.diagnostics) {
        // Map oxlint severity to our format
        let severity: "error" | "warning" | "info" = "error";
        if (diagnostic.severity === "warning") {
          severity = "warning";
        } else if (diagnostic.severity === "advice") {
          severity = "info";
        }

        // Extract file path
        const relativePath = relative(process.cwd(), diagnostic.filename);

        // Extract line and column from labels if available
        let line: number | undefined;
        let column: number | undefined;

        if (diagnostic.labels && diagnostic.labels.length > 0) {
          const label = diagnostic.labels[0];
          line = label.span.line;
          column = label.span.column;
        }

        // Custom message for no-unused-vars
        let message = diagnostic.message;
        if (diagnostic.code?.includes("no-unused-vars")) {
          const match = diagnostic.message.match(/'([^']+)'/);
          const name = match ? match[1] : "Variable";
          message = `'${name}' is unused. Either use it or remove it.`;
        }

        issues.push({
          file: relativePath,
          line,
          column,
          rule: diagnostic.code,
          code: diagnostic.code,
          severity,
          message,
          type: "oxlint",
        });
      }
    } catch (error) {
      // Unexpected error during processing
      logger.error("Unexpected error processing oxlint results", {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return { issues };
  }

  /**
   * Get prettier config from centralized config
   */
  private getPrettierConfig(): PrettierConfig {
    if (this.config?.prettier.enabled) {
      return this.config.prettier;
    }
    // Return default enabled config
    return {
      enabled: true,
      configPath: ".tmp/.oxfmtrc.json",
      semi: true,
      singleQuote: false,
      trailingComma: "all",
      tabWidth: 2,
      printWidth: 80,
    };
  }

  /**
   * Check if files need prettier formatting using --list-different
   */
  private async checkPrettierNeeded(
    files: string[],
    prettierConfig: PrettierConfig,
    logger: EndpointLogger,
  ): Promise<string[]> {
    logger.debug(`Checking which files need prettier formatting`);

    const { spawn } = await import("node:child_process");

    return await new Promise((resolve) => {
      /* eslint-disable i18next/no-literal-string */
      const configArgs = Object.entries(prettierConfig)
        .filter(
          ([key]) =>
            key !== "enabled" &&
            key !== "configPath" &&
            key !== "jsxBracketSameLine",
        )
        .flatMap(([key, value]) => {
          // Convert camelCase to kebab-case for CLI flags
          const flagName = key.replaceAll(/([A-Z])/g, "-$1").toLowerCase();
          if (typeof value === "boolean") {
            return value ? [`--${flagName}`] : [`--no-${flagName}`];
          }
          return [`--${flagName}`, String(value)];
        });
      /* eslint-enable i18next/no-literal-string */

      const child = spawn(
        "bunx",
        ["prettier", "--list-different", ...configArgs, ...files],
        {
          cwd: process.cwd(),
          stdio: ["ignore", "pipe", "pipe"],
          shell: false,
        },
      );

      let stdout = "";

      child.stdout?.on("data", (data: Buffer) => {
        stdout += data.toString();
      });

      child.stderr?.on("data", () => {
        // Ignore stderr
      });

      child.on("close", () => {
        // Parse list of files that need formatting from stdout
        const needsFormatting = stdout
          .trim()
          .split("\n")
          .filter((line) => line.length > 0);

        logger.debug(
          `${needsFormatting.length} files need prettier formatting`,
        );
        resolve(needsFormatting);
      });

      child.on("error", (error) => {
        logger.warn("Prettier check failed, will skip formatting", {
          error: error.message,
        });
        resolve([]); // Don't fail, just skip formatting
      });
    });
  }

  /**
   * Run prettier on files for formatting (only files that need it)
   */
  private async runPrettierFix(
    files: string[],
    logger: EndpointLogger,
  ): Promise<void> {
    // Get prettier config from check.config.ts
    const prettierConfig = this.getPrettierConfig();

    if (!prettierConfig.enabled) {
      logger.debug("Prettier is disabled, skipping formatting");
      return;
    }

    // First check which files actually need formatting
    const filesToFormat = await this.checkPrettierNeeded(
      files,
      prettierConfig,
      logger,
    );

    if (filesToFormat.length === 0) {
      logger.debug("No files need prettier formatting, skipping");
      return;
    }

    logger.debug(`Running prettier on ${filesToFormat.length} files`);

    const { spawn } = await import("node:child_process");

    // Convert prettier config to CLI flags (exclude internal config properties)
    /* eslint-disable i18next/no-literal-string */
    const configArgs = Object.entries(prettierConfig)
      .filter(
        ([key]) =>
          key !== "enabled" &&
          key !== "configPath" &&
          key !== "jsxBracketSameLine",
      )
      .flatMap(([key, value]) => {
        // Convert camelCase to kebab-case for CLI flags
        const flagName = key.replaceAll(/([A-Z])/g, "-$1").toLowerCase();
        if (typeof value === "boolean") {
          return value ? [`--${flagName}`] : [`--no-${flagName}`];
        }
        return [`--${flagName}`, String(value)];
      });
    /* eslint-enable i18next/no-literal-string */

    return await new Promise((resolve, reject) => {
      const child = spawn(
        "bunx",
        ["prettier", "--write", ...configArgs, ...filesToFormat],
        {
          cwd: process.cwd(),
          stdio: ["ignore", "pipe", "pipe"],
          shell: false,
        },
      );

      let stderr = "";

      child.stderr?.on("data", (data: Buffer) => {
        stderr += data.toString();
      });

      child.on("close", (code) => {
        if (code === 0) {
          logger.debug(`Prettier formatted ${filesToFormat.length} files`);
          resolve();
        } else {
          // eslint-disable-next-line i18next/no-literal-string
          reject(
            new Error(`Prettier failed with exit code ${code}: ${stderr}`),
          );
        }
      });

      child.on("error", (error) => {
        reject(error);
      });
    });
  }
}

/**
 * Default repository instance
 */
export const oxlintRepository = new OxlintRepositoryImpl();
