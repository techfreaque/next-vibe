/**
 * Run ESLint Repository (Parallel)
 * Handles parallel eslint operations using Bun.spawn with resource management
 */

import { existsSync, promises as fs } from "node:fs";
import { cpus, freemem, totalmem } from "node:os";
import { dirname, extname, join, relative, resolve } from "node:path";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { CountryLanguage } from "@/i18n/core/config";

import type { ResponseType as ApiResponseType } from "../../../shared/types/response.schema";
import { createSuccessResponse } from "../../../shared/types/response.schema";
import { parseError } from "../../../shared/utils/parse-error";
import type { LintRequestOutput, LintResponseOutput } from "./definition";

/**
 * Constants for file patterns and ignore rules (based on eslint.config.mjs)
 */
const LINTABLE_EXTENSIONS = [
  ".ts",
  ".tsx",
  ".d.ts",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
] as const;

// Updated to match eslint.config.mjs ignores exactly
const IGNORED_DIRECTORIES = [
  "dist",
  ".next",
  ".tmp",
  "node_modules",
  ".git",
  "coverage",
  "public",
  "drizzle",
  ".vscode",
  ".vibe-guard-instance",
  ".github",
  ".claude",
  "postgres_data",
  "to_migrate",
  // Additional common ignores
  ".nyc_output",
  "build",
] as const;

const IGNORED_FILES = [
  ".DS_Store",
  "thumbs.db",
  "postcss.config.mjs",
  // Additional common files
  ".gitignore",
  ".env",
  ".env.local",
  ".env.development",
  ".env.production",
] as const;

const IGNORED_PATHS = [] as const;

/**
 * Error message constants
 */
const PERMISSION_ERROR_CODES = ["EACCES", "permission denied"] as const;

/**
 * System resource information
 */
interface SystemResources {
  cpuCores: number;
  availableMemoryMB: number;
  maxWorkers: number;
}

/**
 * Worker task for parallel processing
 */
interface WorkerTask {
  id: number;
  files: string[];
  cacheDir: string;
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
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ApiResponseType<LintResponseOutput>>;
}

/**
 * Run ESLint Repository Implementation (Parallel)
 */
export class LintRepositoryImpl implements LintRepositoryInterface {
  async execute(
    data: LintRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ApiResponseType<LintResponseOutput>> {
    const startTime = Date.now();
    try {
      logger.debug("Starting parallel ESLint execution", {
        path: data.path,
        fix: data.fix,
        verbose: data.verbose,
      });

      // Get system resources and determine optimal worker count
      const resources = this.getSystemResources();
      logger.debug("System resources detected", {
        cpus: resources.cpuCores,
        memory: resources.availableMemoryMB,
      });

      // Discover files to lint
      const filesToLint = await this.discoverFiles(data.path || "./", logger);
      logger.debug(`Found ${filesToLint.length} files to lint`);

      if (filesToLint.length === 0) {
        return createSuccessResponse({
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
        locale,
        logger,
      );

      // Merge results from all workers
      const mergedResult = this.mergeWorkerResults(workerResults, logger);

      logger.debug("Parallel ESLint execution completed", {
        totalIssues: mergedResult.issues.length,
        success: mergedResult.success,
      });

      return createSuccessResponse(mergedResult);
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

      const errorSummary = this.generateSummary(errorIssues);

      return createSuccessResponse({
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
   * Get system resources and calculate optimal worker count
   */
  private getSystemResources(): SystemResources {
    const cpuCores = cpus().length;
    const totalMemoryBytes = totalmem();
    const freeMemoryBytes = freemem();

    // Use actual available memory, but leave some buffer for the system
    const systemBufferBytes = Math.max(
      totalMemoryBytes * 0.1,
      512 * 1024 * 1024,
    ); // 10% or 512MB buffer, whichever is larger
    const availableMemoryBytes = Math.max(
      0,
      freeMemoryBytes - systemBufferBytes,
    );

    // Dynamic memory per worker based on total system memory
    const memoryPerWorkerBytes =
      this.calculateMemoryPerWorker(totalMemoryBytes);

    // Calculate optimal worker count based on CPU cores and memory
    const memoryBasedWorkers = Math.floor(
      availableMemoryBytes / memoryPerWorkerBytes,
    );
    const cpuBasedWorkers = Math.max(1, cpuCores - 1); // Leave one core for main process

    // Dynamic worker cap based on system capabilities
    const maxWorkerCap = this.calculateMaxWorkerCap(cpuCores, totalMemoryBytes);
    const maxWorkers = Math.min(
      memoryBasedWorkers,
      cpuBasedWorkers,
      maxWorkerCap,
    );

    return {
      cpuCores,
      availableMemoryMB: Math.floor(availableMemoryBytes / (1024 * 1024)),
      maxWorkers: Math.max(1, maxWorkers), // Ensure at least 1 worker
    };
  }

  /**
   * Calculate memory per worker based on system total memory
   */
  private calculateMemoryPerWorker(totalMemoryBytes: number): number {
    const totalMemoryGB = totalMemoryBytes / (1024 * 1024 * 1024);

    // Scale memory per worker based on total system memory
    if (totalMemoryGB >= 32) {
      return 400 * 1024 * 1024;
    } // 32GB+ systems: 400MB per worker
    if (totalMemoryGB >= 16) {
      return 300 * 1024 * 1024;
    } // 16GB+ systems: 300MB per worker
    if (totalMemoryGB >= 8) {
      return 250 * 1024 * 1024;
    } // 8GB+ systems: 250MB per worker
    if (totalMemoryGB >= 4) {
      return 200 * 1024 * 1024;
    } // 4GB+ systems: 200MB per worker
    return 150 * 1024 * 1024; // <4GB systems: 150MB per worker
  }

  /**
   * Calculate maximum worker cap based on system capabilities
   */
  private calculateMaxWorkerCap(
    cpuCores: number,
    totalMemoryBytes: number,
  ): number {
    const hardCap = 4;
    const totalMemoryGB = totalMemoryBytes / (1024 * 1024 * 1024);

    // Base cap on CPU cores, but consider memory constraints
    const cpuBasedCap = Math.max(2, cpuCores); // At least 2, up to CPU cores
    const memoryBasedCap = Math.floor(totalMemoryGB / 2); // 1 worker per 2GB of RAM

    // Use the minimum, but cap at reasonable limits
    const dynamicCap = Math.min(cpuBasedCap, memoryBasedCap);
    return Math.max(1, Math.min(dynamicCap, hardCap, cpuCores * 2)); // Between 1 and 2x CPU cores
  }

  /**
   * Discover files to lint based on path input
   */
  private async discoverFiles(
    inputPath: string,
    logger: EndpointLogger,
  ): Promise<string[]> {
    const files: string[] = [];
    const resolvedPath = resolve(inputPath);

    if (!existsSync(resolvedPath)) {
      logger.warn(`Path does not exist: ${inputPath}`);
      return files;
    }

    const stats = await fs.stat(resolvedPath);

    if (stats.isFile()) {
      // Single file provided
      if (this.isLintableFile(resolvedPath)) {
        files.push(resolvedPath);
      }
    } else if (stats.isDirectory()) {
      // Directory provided - scan recursively
      await this.scanDirectory(resolvedPath, files, logger);
    }

    // Convert to relative paths for consistent display
    return files.map((file) => relative(process.cwd(), file));
  }

  /**
   * Recursively scan directory for lintable files
   */
  private async scanDirectory(
    dirPath: string,
    files: string[],
    logger: EndpointLogger,
  ): Promise<void> {
    try {
      // Check if directory should be ignored before trying to read it
      const dirName = dirPath.split("/").pop() || "";
      if (this.shouldIgnorePath(dirName, dirPath)) {
        return;
      }

      const entries = await fs.readdir(dirPath);

      for (const entry of entries) {
        const fullPath = join(dirPath, entry);

        // Skip ignored directories and files
        if (this.shouldIgnorePath(entry, fullPath)) {
          continue;
        }

        try {
          const stats = await fs.stat(fullPath);

          if (stats.isDirectory()) {
            await this.scanDirectory(fullPath, files, logger);
          } else if (stats.isFile() && this.isLintableFile(fullPath)) {
            files.push(fullPath);
          }
        } catch (statError) {
          const error = parseError(statError);
          // Only warn for permission errors, skip silently for other errors
          if (
            PERMISSION_ERROR_CODES.some((code) => error.message.includes(code))
          ) {
            logger.debug(`Permission denied accessing: ${fullPath}`);
          } else {
            logger.warn(`Failed to stat path: ${fullPath}`, {
              error: error.message,
            });
          }
        }
      }
    } catch (error) {
      const parsedError = parseError(error);
      // Handle permission errors more gracefully
      if (
        PERMISSION_ERROR_CODES.some((code) =>
          parsedError.message.includes(code),
        )
      ) {
        logger.debug(`Permission denied scanning directory: ${dirPath}`);
      } else {
        logger.warn(`Failed to scan directory: ${dirPath}`, {
          error: parsedError.message,
        });
      }
    }
  }

  /**
   * Check if a file should be linted (based on eslint.config.mjs patterns)
   */
  private isLintableFile(filePath: string): boolean {
    const ext = extname(filePath);
    return LINTABLE_EXTENSIONS.includes(
      ext as (typeof LINTABLE_EXTENSIONS)[number],
    );
  }

  /**
   * Check if a path should be ignored (based on eslint.config.mjs ignores)
   */
  private shouldIgnorePath(name: string, fullPath: string): boolean {
    // Check if it's an ignored directory or file
    if (
      IGNORED_DIRECTORIES.includes(
        name as (typeof IGNORED_DIRECTORIES)[number],
      ) ||
      IGNORED_FILES.includes(name as (typeof IGNORED_FILES)[number])
    ) {
      return true;
    }

    // Check specific paths from eslint config
    const relativePath = relative(process.cwd(), fullPath);
    if (IGNORED_PATHS.some((path) => relativePath.startsWith(path))) {
      return true;
    }

    // Check if it starts with a dot (hidden files/directories) except .d.ts files
    if (name.startsWith(".") && !name.endsWith(".d.ts")) {
      return true;
    }

    return false;
  }

  /**
   * Distribute files across workers evenly
   */
  private distributeFiles(
    files: string[],
    workerCount: number,
    data: LintRequestOutput,
  ): WorkerTask[] {
    const tasks: WorkerTask[] = [];
    const filesPerWorker = Math.ceil(files.length / workerCount);

    for (let i = 0; i < workerCount; i++) {
      const startIndex = i * filesPerWorker;
      const endIndex = Math.min(startIndex + filesPerWorker, files.length);
      const workerFiles = files.slice(startIndex, endIndex);

      if (workerFiles.length > 0) {
        tasks.push({
          id: i,
          files: workerFiles,
          cacheDir: data.cacheDir, // Use global cache directory for all workers
          fix: data.fix,
          timeout: data.timeout,
        });
      }
    }

    return tasks;
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
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<WorkerResult[]> {
    const results: WorkerResult[] = [];

    // Execute all workers in parallel
    const workerPromises = tasks.map((task) =>
      this.executeWorker(task, locale, logger),
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
              message: this.createWorkerFailedMessage(
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
    _locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<WorkerResult> {
    const startTime = Date.now();

    try {
      // Cache directory already created in parallel during setup

      // Build ESLint command arguments using existing config
      const projectRoot = process.cwd();
      const eslintConfigPath = resolve(projectRoot, "eslint.config.mjs");

      const baseArgs = [
        "eslint",
        "--format=json",
        "--cache",
        "--cache-location",
        task.cacheDir,
        "--cache-strategy",
        "metadata",
        // Use existing eslint.config.mjs with absolute path
        "--config",
        eslintConfigPath,
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
      } else {
        // Just run normal check
        const result = await this.runEslintCommand(baseArgs, task, logger);
        return {
          id: task.id,
          success: true,
          issues: result.issues,
          duration: Date.now() - startTime,
        };
      }
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
    allIssues.sort((a, b) => {
      if (a.file !== b.file) {
        return a.file.localeCompare(b.file);
      }
      return (a.line || 0) - (b.line || 0);
    });

    const hasErrors =
      allIssues.some((i) => i.severity === "error") || hasWorkerErrors;

    logger.debug("Merged worker results", {
      totalWorkers: workerResults.length,
      totalIssues: allIssues.length,
      hasErrors,
    });

    return {
      success: !hasErrors,
      issues: allIssues,
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
    const { spawn } = await import("child_process");
    const stdout = await new Promise<string>((resolve, reject) => {
      const child = spawn("npx", args, {
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
        // ESLint returns non-zero exit code when there are errors, but that's expected
        // Only reject if there's a real error (not lint issues)
        if (code !== null && code > 2) {
          reject(new Error(this.createWorkerExitCodeMessage(task.id, code)));
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
          new Error(this.createWorkerTimeoutMessage(task.id, task.timeout)),
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
          stdoutPreview: stdout.substring(0, 200),
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

  /**
   * Helper methods for error messages
   */
  private createWorkerFailedMessage(workerId: number, reason: string): string {
    // eslint-disable-next-line i18next/no-literal-string
    return `Worker ${workerId} failed: ${reason}`;
  }

  private createWorkerTimeoutMessage(
    workerId: number,
    timeout: number,
  ): string {
    // eslint-disable-next-line i18next/no-literal-string
    return `Worker ${workerId} timed out after ${timeout}s`;
  }

  private createWorkerExitCodeMessage(
    workerId: number,
    exitCode: number,
  ): string {
    // eslint-disable-next-line i18next/no-literal-string
    return `Worker ${workerId} failed with exit code ${exitCode}`;
  }

  /**
   * Generate summary object based on issues
   */
  private generateSummary(
    issues: Array<{
      severity: "error" | "warning" | "info";
      [key: string]: string | number | boolean;
    }>,
  ): {
    total: number;
    errors: number;
    warnings: number;
    info: number;
    hasIssues: boolean;
  } {
    const errors = issues.filter((i) => i.severity === "error");
    const warnings = issues.filter((i) => i.severity === "warning");
    const info = issues.filter((i) => i.severity === "info");

    return {
      total: issues.length,
      errors: errors.length,
      warnings: warnings.length,
      info: info.length,
      hasIssues: issues.length > 0,
    };
  }
}

/**
 * Default repository instance
 */
export const lintRepository = new LintRepositoryImpl();
