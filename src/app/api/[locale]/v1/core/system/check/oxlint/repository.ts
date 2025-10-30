/**
 * Run Oxlint Repository (Parallel)
 * Handles parallel oxlint operations using child_process.spawn with resource management
 */

import { existsSync, promises as fs } from "node:fs";
import { cpus, freemem, totalmem } from "node:os";
import { dirname, extname, join, relative, resolve } from "node:path";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { CountryLanguage } from "@/i18n/core/config";

import type { ResponseType as ApiResponseType } from "../../../shared/types/response.schema";
import { createSuccessResponse } from "../../../shared/types/response.schema";
import { parseError } from "../../../shared/utils/parse-error";
import type { OxlintRequestOutput, OxlintResponseOutput } from "./definition";
import {
  generateOxlintConfig,
  needsConfigRegeneration,
} from "./config-generator";
import type { PrettierConfig } from "./types";

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
 * Run Oxlint Repository Interface
 */
export interface OxlintRepositoryInterface {
  execute(
    data: OxlintRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ApiResponseType<OxlintResponseOutput>>;
}

/**
 * Run Oxlint Repository Implementation (Parallel)
 */
export class OxlintRepositoryImpl implements OxlintRepositoryInterface {
  async execute(
    data: OxlintRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ApiResponseType<OxlintResponseOutput>> {
    const startTime = Date.now();
    try {
      logger.debug("Starting parallel Oxlint execution", {
        path: data.path,
        fix: data.fix,
        verbose: data.verbose,
      });

      // Ensure cache directory exists
      const cacheDir = data.cacheDir || "./.tmp";
      await fs.mkdir(cacheDir, { recursive: true });

      // Generate/update oxlint config if needed
      const needsRegen = await needsConfigRegeneration(logger, cacheDir);
      if (needsRegen) {
        logger.debug("Regenerating oxlint config from TypeScript");
        const configResult = await generateOxlintConfig(logger, cacheDir);
        if (!configResult.success) {
          logger.warn("Failed to generate oxlint config, using defaults", {
            error: configResult.error,
          });
        }
      }

      // Get system resources and determine optimal worker count
      const resources = this.getSystemResources();
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
        const pathFiles = await this.discoverFiles(targetPath, logger);
        filesToLint.push(...pathFiles);
      }

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

      logger.debug("Parallel Oxlint execution completed", {
        totalIssues: mergedResult.issues.length,
        success: mergedResult.success,
      });

      return createSuccessResponse(mergedResult);
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = parseError(error).message;
      logger.error("Parallel Oxlint execution failed", { error: errorMessage });

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
    data: OxlintRequestOutput,
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

      // Build oxlint command arguments
      const oxlintConfigPath = resolve(task.cacheDir, ".oxlintrc.json");

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
          this.runPrettierFix(task.files, task.cacheDir, logger),
        ]);

        // Handle oxlint result
        let issues: Array<{
          file: string;
          line?: number;
          column?: number;
          rule?: string;
          severity: "error" | "warning" | "info";
          message: string;
          type: "lint";
        }> = [];

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
              type: "lint" as const,
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
  ): OxlintResponseOutput {
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
   * Run oxlint command and return results
   */
  private async runOxlintCommand(
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
  }> {
    logger.debug(`Worker ${task.id} starting with ${task.files.length} files`);

    // Use spawn for parallel execution
    const { spawn } = await import("node:child_process");
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
        // Ignore stderr for oxlint output
      });

      child.on("close", (code) => {
        // Oxlint returns non-zero exit code when there are errors, but that's expected
        // Exit code 0 = no issues, 1 = issues found, 2 = fatal error
        // We accept 0 and 1 as valid, reject only on fatal errors (code >= 2)
        if (code !== null && code >= 2) {
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
    issues: Array<{
      file: string;
      line?: number;
      column?: number;
      rule?: string;
      severity: "error" | "warning" | "info";
      message: string;
      type: "lint";
    }>;
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

        issues.push({
          file: relativePath,
          line,
          column,
          rule: diagnostic.code,
          severity,
          message: diagnostic.message,
          type: "lint",
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
   * Get prettier config from TypeScript config
   */
  private async getPrettierConfig(
    logger: EndpointLogger,
  ): Promise<PrettierConfig> {
    try {
      const projectRoot = process.cwd();
      const tsConfigPath = resolve(projectRoot, "lint.config.ts");

      // Dynamic import of the TypeScript config
      const configModule = await import(`file://${tsConfigPath}`);
      const fullConfig = configModule.config || configModule.default;

      return fullConfig.prettier || {};
    } catch (error) {
      logger.warn("Failed to load prettier config, using defaults", {
        error: parseError(error).message,
      });
      return {
        semi: true,
        singleQuote: false,
        trailingComma: "all",
        tabWidth: 2,
        useTabs: false,
        printWidth: 80,
        arrowParens: "always",
        endOfLine: "lf",
        bracketSpacing: true,
        jsxSingleQuote: false,
        jsxBracketSameLine: false,
        proseWrap: "preserve",
      };
    }
  }

  /**
   * Check if files need prettier formatting (like ESLint does)
   */
  private async checkPrettierNeeded(
    files: string[],
    prettierConfig: PrettierConfig,
    logger: EndpointLogger,
  ): Promise<string[]> {
    logger.debug(`Checking which files need prettier formatting`);

    const { spawn } = await import("node:child_process");

    return await new Promise((resolve, _reject) => {
      /* eslint-disable i18next/no-literal-string */
      const configArgs = Object.entries(prettierConfig).flatMap(([key, value]) => {
        // Convert camelCase to kebab-case for CLI flags
        const flagName = key.replaceAll(/([A-Z])/g, "-$1").toLowerCase();
        if (typeof value === "boolean") {
          return value ? [`--${flagName}`] : [`--no-${flagName}`];
        }
        return [`--${flagName}`, String(value)];
      });
      /* eslint-enable i18next/no-literal-string */

      const child = spawn(
        "npx",
        ["prettier", "--check", "--log-level", "error", ...configArgs, ...files],
        {
          cwd: process.cwd(),
          stdio: ["ignore", "pipe", "pipe"],
          shell: false,
        },
      );

      let stdout = "";
      let stderr = "";

      child.stdout?.on("data", (data: Buffer) => {
        stdout += data.toString();
      });

      child.stderr?.on("data", (data: Buffer) => {
        stderr += data.toString();
      });

      child.on("close", (code) => {
        // Prettier --check returns non-zero if files need formatting
        // Parse output to get list of files that need formatting
        const needsFormatting = files.filter((file) => {
          // If prettier check failed, these files need formatting
          return code !== 0 && (stdout.includes(file) || stderr.includes(file));
        });

        logger.debug(`${needsFormatting.length} files need prettier formatting`);
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
    _cacheDir: string,
    logger: EndpointLogger,
  ): Promise<void> {
    // Get prettier config from oxlint.config.ts
    const prettierConfig = await this.getPrettierConfig(logger);

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

    // Convert prettier config to CLI flags
    /* eslint-disable i18next/no-literal-string */
    const configArgs = Object.entries(prettierConfig).flatMap(([key, value]) => {
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
        "npx",
        [
          "prettier",
          "--write",
          "--log-level",
          "warn",
          ...configArgs,
          ...filesToFormat,
        ],
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
          reject(new Error(`Prettier failed with exit code ${code}: ${stderr}`));
        }
      });

      child.on("error", (error) => {
        reject(error);
      });
    });
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
export const oxlintRepository = new OxlintRepositoryImpl();
