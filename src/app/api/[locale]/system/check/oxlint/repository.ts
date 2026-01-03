/**
 * Run Oxlint Repository
 * Handles oxlint operations using child_process.spawn
 */

import { existsSync, promises as fs } from "node:fs";
import { relative, resolve } from "node:path";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { ResponseType as ApiResponseType } from "../../../shared/types/response.schema";
import { success } from "../../../shared/types/response.schema";
import { parseError } from "../../../shared/utils/parse-error";
import { ensureConfigReady } from "../config/repository";
import { sortIssuesByLocation } from "../config/shared";
import type { CheckConfig } from "../config/types";
import type { OxlintIssue, OxlintRequestOutput, OxlintResponseOutput } from "./definition";

/**
 * Run Oxlint Repository Interface
 */
export interface OxlintRepositoryInterface {
  execute(
    data: OxlintRequestOutput,
    logger: EndpointLogger,
    providedConfig?: CheckConfig,
  ): Promise<ApiResponseType<OxlintResponseOutput>>;
}

/**
 * Run Oxlint Repository Implementation
 */
export class OxlintRepositoryImpl implements OxlintRepositoryInterface {
  private config: CheckConfig | null = null;

  async execute(
    data: OxlintRequestOutput,
    logger: EndpointLogger,
    providedConfig?: CheckConfig,
  ): Promise<ApiResponseType<OxlintResponseOutput>> {
    try {
      // eslint-disable-next-line i18next/no-literal-string
      logger.debug(`[OXLINT] Starting execution (path: ${data.path || "./"}, fix: ${data.fix})`);

      // Use provided config or load it
      let config: CheckConfig;
      if (providedConfig) {
        config = providedConfig;
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
        config = configResult.config;
      }

      // Store config for use in methods
      this.config = config;

      // Check if oxlint is enabled
      if (!config.oxlint.enabled) {
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
      const cacheDir = this.config.oxlint.enabled ? this.config.oxlint.cachePath : "./.tmp";
      await fs.mkdir(cacheDir, { recursive: true });

      // Handle multiple paths - support files, folders, or mixed
      const targetPaths = data.path ? (Array.isArray(data.path) ? data.path : [data.path]) : ["./"];

      // eslint-disable-next-line i18next/no-literal-string
      logger.debug(`[OXLINT] Running on ${targetPaths.length} path(s): ${targetPaths.join(", ")}`);

      // Run oxlint on paths (folders and/or files)
      // Oxlint will handle file discovery based on ignore patterns in config
      const result = await this.runOxlint(targetPaths, data.fix, data.timeout, logger);

      // Build response with pagination
      const response = this.buildResponse(
        data.skipSorting ? result.issues : sortIssuesByLocation(result.issues),
        data,
      );

      // eslint-disable-next-line i18next/no-literal-string
      logger.debug(`[OXLINT] Execution completed (${response.issues.items.length} issues found)`);

      return success(response);
    } catch (error) {
      const errorMessage = parseError(error).message;
      // eslint-disable-next-line i18next/no-literal-string
      logger.error(`[OXLINT] Execution failed: ${errorMessage}`);

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
   * Run oxlint on paths (files and/or folders)
   */
  private async runOxlint(
    paths: string[],
    fix: boolean,
    timeout: number,
    logger: EndpointLogger,
  ): Promise<{ issues: OxlintIssue[] }> {
    // eslint-disable-next-line i18next/no-literal-string
    logger.debug(`[OXLINT] Running on ${paths.length} path(s)`);

    // Build oxlint command arguments
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
          ...paths,
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
          ...paths,
        ];
    /* eslint-enable i18next/no-literal-string */

    // If fix is requested, run oxlint --fix and oxfmt in parallel
    if (fix) {
      const fixArgs = [...baseArgs, "--fix"];

      // Run both oxlint --fix and oxfmt in parallel
      const [oxlintResult, oxfmtResult] = await Promise.allSettled([
        this.runOxlintCommand(fixArgs, timeout, logger),
        this.runOxfmt(paths, logger),
      ]);

      // Handle oxlint result
      if (oxlintResult.status === "fulfilled") {
        // Log oxfmt result if it failed
        if (oxfmtResult.status === "rejected") {
          // eslint-disable-next-line i18next/no-literal-string
          logger.warn(`[OXLINT] Oxfmt formatting failed: ${String(oxfmtResult.reason)}`);
        }
        return oxlintResult.value;
      } else {
        // eslint-disable-next-line i18next/no-literal-string
        logger.error(`[OXLINT] Fix failed: ${String(oxlintResult.reason)}`);
        // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax
        throw oxlintResult.reason;
      }
    }

    // Just run normal check
    return await this.runOxlintCommand(baseArgs, timeout, logger);
  }

  /**
   * Run oxfmt on paths (files and/or folders) for formatting
   */
  private async runOxfmt(paths: string[], logger: EndpointLogger): Promise<void> {
    if (paths.length === 0) {
      return;
    }

    // eslint-disable-next-line i18next/no-literal-string
    logger.debug(`[OXLINT] Executing Oxfmt command: bunx oxfmt ${paths.join(" ")}`);

    const { spawn } = await import("node:child_process");

    return await new Promise((resolve, reject) => {
      /* eslint-disable i18next/no-literal-string */
      const child = spawn("bunx", ["oxfmt", ...paths], {
        cwd: process.cwd(),
        stdio: ["ignore", "pipe", "pipe"],
        shell: false,
      });
      /* eslint-enable i18next/no-literal-string */

      let stderr = "";

      child.stderr?.on("data", (data: Buffer) => {
        stderr += data.toString();
      });

      child.on("close", (code) => {
        if (code === 0) {
          // eslint-disable-next-line i18next/no-literal-string
          logger.debug("[OXLINT] Oxfmt formatting completed");
          resolve();
        } else {
          // eslint-disable-next-line i18next/no-literal-string
          reject(new Error(`Oxfmt failed with exit code ${code}: ${stderr}`));
        }
      });

      child.on("error", (error) => {
        reject(error);
      });
    });
  }

  /**
   * Build file statistics from issues
   */
  private buildFileStats(
    issues: OxlintIssue[],
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
  private buildResponse(allIssues: OxlintIssue[], data: OxlintRequestOutput): OxlintResponseOutput {
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
   * Run oxlint command and return results
   */
  private async runOxlintCommand(
    args: string[],
    timeout: number,
    logger: EndpointLogger,
  ): Promise<{
    issues: OxlintIssue[];
  }> {
    // eslint-disable-next-line i18next/no-literal-string
    logger.debug(`[OXLINT] Executing command: bunx ${args.join(" ")}`);

    // Use spawn for execution
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
          const errorMsg = stderrOutput.trim() || `Oxlint failed with exit code ${code}`;
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
        reject(new Error(`Oxlint timed out after ${timeout}s`));
      }, timeout * 1000);

      // Clear timeout when process completes
      child.on("close", () => {
        clearTimeout(timeoutId);
      });
    });

    // Parse oxlint output
    const result = await this.parseOxlintOutput(stdout, logger);

    // eslint-disable-next-line i18next/no-literal-string
    logger.debug(`[OXLINT] Completed with ${result.issues.length} issues`);

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
        // eslint-disable-next-line i18next/no-literal-string
        logger.warn(
          `[OXLINT] Failed to parse JSON output: ${parseError instanceof Error ? parseError.message : String(parseError)} (preview: ${stdout.slice(0, 100)}...)`,
        );
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
      // eslint-disable-next-line i18next/no-literal-string
      logger.error(
        `[OXLINT] Unexpected error processing results: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    return { issues };
  }
}

/**
 * Default repository instance
 */
export const oxlintRepository = new OxlintRepositoryImpl();
