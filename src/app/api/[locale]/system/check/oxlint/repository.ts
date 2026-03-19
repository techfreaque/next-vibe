/**
 * Run Oxlint Repository
 * Handles oxlint operations using child_process.spawn
 */

import { existsSync, promises as fs } from "node:fs";
import { relative, resolve as resolvePath } from "node:path";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { CountryLanguage } from "@/i18n/core/config";

import type { ResponseType as ApiResponseType } from "../../../shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../../shared/types/response.schema";
import { parseError } from "../../../shared/utils/parse-error";
import { ConfigRepositoryImpl } from "../config/repository";
import { sortIssuesByLocation } from "../config/shared";
import type { CheckConfig } from "../config/types";
import { calculateFilteredSummary, filterIssues } from "../shared/filter-utils";
import type {
  OxlintIssue,
  OxlintRequestOutput,
  OxlintResponseOutput,
} from "./definition";
import type { CheckOxlintT } from "./i18n";

/**
 * Run Oxlint Repository
 */
export class OxlintRepository {
  static async execute(
    data: OxlintRequestOutput,
    logger: EndpointLogger,
    platform: Platform,
    t: CheckOxlintT,
    signal: AbortSignal,
    locale: CountryLanguage,
    providedConfig: CheckConfig | undefined,
  ): Promise<ApiResponseType<OxlintResponseOutput>> {
    const isMCP = platform === Platform.MCP;
    try {
      logger.debug(
        `[OXLINT] Starting execution (path: ${data.path || "./"}, fix: ${data.fix})`,
      );

      // Use provided config or load it
      let config: CheckConfig;
      if (providedConfig) {
        config = providedConfig;
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
        config = configResult.config;
      }

      // Apply mcpLimit when platform is MCP
      const defaults = config.vibeCheck || {};
      const defaultLimit = isMCP
        ? (defaults.mcpLimit ?? defaults.limit ?? 100)
        : (defaults.limit ?? 200);

      // Compute active ignore patterns from extensive flag
      const isExtensive = data.extensive ?? defaults.extensive ?? false;
      const activeIgnorePatterns =
        !isExtensive && config.oxlint.enabled
          ? config.oxlint.nonExtensiveIgnorePatterns
          : undefined;

      const effectiveData = {
        ...data,
        limit: data.limit ?? defaultLimit,
      };

      // Check if oxlint is enabled
      if (!config.oxlint.enabled) {
        logger.info("Oxlint is disabled in check.config.ts");
        return success({
          items: [],
          files: [],
          totalIssues: 0,
          totalFiles: 0,
        });
      }

      // Ensure cache directory exists
      const cacheDir = config.oxlint.enabled
        ? config.oxlint.cachePath
        : "./.tmp";
      await fs.mkdir(cacheDir, { recursive: true });

      // Handle multiple paths - support files, folders, or mixed
      const targetPaths = effectiveData.path
        ? Array.isArray(effectiveData.path)
          ? effectiveData.path
          : [effectiveData.path]
        : ["./"];

      logger.debug(
        `[OXLINT] Running on ${targetPaths.length} path(s): ${targetPaths.join(", ")}`,
      );

      // Run oxlint on paths (folders and/or files)
      // Oxlint will handle file discovery based on ignore patterns in config
      const runResult = await OxlintRepository.runOxlint(
        targetPaths,
        effectiveData.fix,
        effectiveData.timeout,
        logger,
        config,
        t,
        activeIgnorePatterns,
        signal,
      );

      if (!runResult.success) {
        return runResult;
      }

      const result = runResult.data;

      // Build response with pagination
      const response = OxlintRepository.buildResponse(
        effectiveData.skipSorting
          ? result.issues
          : sortIssuesByLocation(result.issues),
        effectiveData,
        isMCP,
      );

      logger.debug(
        `[OXLINT] Execution completed (${response.displayedIssues ?? response.totalIssues} issues found)`,
      );

      return success(response);
    } catch (error) {
      const errorMessage = parseError(error).message;
      // eslint-disable-next-line i18next/no-literal-string
      logger.error(`[OXLINT] Execution failed: ${errorMessage}`);

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
   * Run oxlint on paths (files and/or folders)
   */
  private static async runOxlint(
    paths: string[],
    fix: boolean,
    timeout: number,
    logger: EndpointLogger,
    config: CheckConfig,
    t: CheckOxlintT,
    extraIgnorePatterns?: string[],
    signal?: AbortSignal,
  ): Promise<ApiResponseType<{ issues: OxlintIssue[] }>> {
    logger.debug(`[OXLINT] Running on ${paths.length} path(s)`);

    // Build oxlint command arguments
    if (!config.oxlint.enabled) {
      return fail({
        message: t("errors.oxlintDisabled"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
    const oxlintConfigPath = resolvePath(config.oxlint.configPath);

    // Check if config exists, if not use default settings
    const configExists = existsSync(oxlintConfigPath);

    // Build extra --ignore-pattern flags for non-extensive mode
    /* eslint-disable i18next/no-literal-string */
    const ignorePatternArgs =
      extraIgnorePatterns && extraIgnorePatterns.length > 0
        ? extraIgnorePatterns.flatMap((p) => ["--ignore-pattern", p])
        : [];

    const baseArgs = configExists
      ? [
          "oxlint",
          "--format=json",
          "--config",
          oxlintConfigPath,
          "--tsconfig",
          "./tsconfig.json",
          ...ignorePatternArgs,
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
          ...ignorePatternArgs,
          ...paths,
        ];
    /* eslint-enable i18next/no-literal-string */

    // If fix is requested, run oxlint --fix and oxfmt in parallel
    if (fix && config.prettier.enabled) {
      const fixArgs = [...baseArgs, "--fix"];

      // Run both oxlint --fix and oxfmt in parallel
      const [oxlintResult, oxfmtResult] = await Promise.allSettled([
        OxlintRepository.runOxlintCommand(fixArgs, timeout, logger, signal),
        OxlintRepository.runOxfmt(
          paths,
          logger,
          config.prettier.configPath,
          config.prettier.ignoreFilePath,
        ),
      ]);

      // Handle oxlint result
      if (oxlintResult.status === "fulfilled") {
        // Log oxfmt result if it failed
        if (oxfmtResult.status === "rejected") {
          logger.warn(
            `[OXLINT] Oxfmt formatting failed: ${String(oxfmtResult.reason)}`,
          );
        }
        return success(oxlintResult.value);
      } else {
        // eslint-disable-next-line i18next/no-literal-string
        logger.error(`[OXLINT] Fix failed: ${String(oxlintResult.reason)}`);
        return fail({
          message: t("errors.oxlintFailed"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: { error: parseError(oxlintResult.reason).message },
        });
      }
    }

    // Just run normal check
    return success(
      await OxlintRepository.runOxlintCommand(
        baseArgs,
        timeout,
        logger,
        signal,
      ),
    );
  }

  /**
   * Run oxfmt on paths (files and/or folders) for formatting
   */
  private static async runOxfmt(
    paths: string[],
    logger: EndpointLogger,
    configPath: string,
    ignoreFilePath?: string,
  ): Promise<void> {
    if (paths.length === 0) {
      return;
    }
    /* eslint-disable i18next/no-literal-string */
    const ignoreArgs =
      ignoreFilePath && existsSync(`${process.cwd()}/${ignoreFilePath}`)
        ? ["--ignore-path", `${process.cwd()}/${ignoreFilePath}`]
        : [];
    /* eslint-enable i18next/no-literal-string */
    const command = ["oxfmt", "--config", configPath, ...ignoreArgs, ...paths];

    logger.debug(`[OXLINT] Executing Oxfmt command: bunx ${command.join(" ")}`);

    const { spawn } = await import("node:child_process");

    return await new Promise((resolve, reject) => {
      /* eslint-disable i18next/no-literal-string */
      const child = spawn("bunx", command, {
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
  private static buildFileStats(
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
    allIssues: OxlintIssue[],
    data: OxlintRequestOutput,
    skipFiles = false,
  ): OxlintResponseOutput {
    // When summaryOnly is true, skip filtering and pagination to show total counts
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
        const fileStats = OxlintRepository.buildFileStats(allIssues);
        files = OxlintRepository.formatFileStats(fileStats);
      }

      return {
        items: undefined,
        files,
        ...summary,
      };
    }

    // Apply filtering
    const filteredIssues = filterIssues(allIssues, data.filter);

    // Pagination
    const limit = data.limit;
    const currentPage = data.page;
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedIssues = filteredIssues.slice(startIndex, endIndex);

    // Calculate summary with filter awareness
    const summary = calculateFilteredSummary(
      allIssues,
      filteredIssues,
      paginatedIssues,
      currentPage,
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
      const fileStats = OxlintRepository.buildFileStats(filteredIssues);
      files = OxlintRepository.formatFileStats(fileStats);
    }

    return {
      items: data.summaryOnly ? undefined : paginatedIssues,
      files,
      ...summary,
    };
  }

  /**
   * Run oxlint command and return results
   */
  private static async runOxlintCommand(
    args: string[],
    timeout: number,
    logger: EndpointLogger,
    signal?: AbortSignal,
  ): Promise<{
    issues: OxlintIssue[];
  }> {
    // eslint-disable-next-line i18next/no-literal-string
    logger.debug(`[OXLINT] Executing command: bunx ${args.join(" ")}`);

    // Use spawn for execution
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
            stderrOutput.trim() || `Oxlint failed with exit code ${code}`;
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
    const result = await OxlintRepository.parseOxlintOutput(stdout, logger);

    // eslint-disable-next-line i18next/no-literal-string
    logger.debug(`[OXLINT] Completed with ${result.issues.length} issues`);

    return result;
  }

  /**
   * Parse oxlint JSON output
   */
  private static async parseOxlintOutput(
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
      } catch (parseJsonError) {
        // JSON parse failed - log the error and return empty results
        // eslint-disable-next-line i18next/no-literal-string
        logger.warn(
          `[OXLINT] Failed to parse JSON output: ${parseJsonError instanceof Error ? parseJsonError.message : String(parseJsonError)} (preview: ${stdout.slice(0, 100)}...)`,
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

        const ruleCode = diagnostic.code;
        issues.push({
          file: relativePath,
          line,
          column,
          ...(ruleCode && { rule: ruleCode }),
          severity,
          message,
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
