/**
 * Run Oxlint Repository
 * Handles oxlint operations using child_process.spawn
 */

import { existsSync } from "node:fs";
import { availableParallelism } from "node:os";
import { relative, resolve as resolvePath } from "node:path";

import { buildPackageRunnerCommand, coreEnv } from "../../../../core/env";
import type { ResponseType as ApiResponseType } from "../../../../core/route/response.schema";
import {
  ErrorResponseTypes,
  failInline,
  success,
} from "../../../../core/route/response.schema";
import { parseError } from "../../../../core/utils/parse-error";
import type { EndpointLogger } from "../../../../logger/types";
import { Platform } from "../../../../platforms/platforms";
import { ConfigRepositoryImpl } from "../../config/repository";
import { sortIssuesByLocation } from "../../config/shared";
import type { CheckConfig, StrictPathsConfig } from "../../config/types";
import {
  calculateFilteredSummary,
  filterIssues,
  matchesAnyGlob,
} from "../filter-utils";
// ── Inline types (definition removed) ───────────────────────

export interface OxlintIssue {
  file: string;
  line?: number;
  column?: number;
  rule?: string;
  severity: "error" | "warning" | "info";
  message: string;
}

export interface OxlintRequestOutput {
  path?: string | string[];
  /** true = rule fixes + oxfmt formatting; "lint-only" = rule fixes only. */
  fix: boolean | "lint-only";
  timeout: number;
  skipSorting?: boolean;
  limit: number;
  page: number;
  summaryOnly: boolean;
  extensive?: boolean;
  /** Report strict rules everywhere, ignoring the strictPaths whitelist. */
  strict?: boolean;
  filter?: string | string[];
}

export interface OxlintResponseOutput {
  editorUriSchema?: string;
  items?: OxlintIssue[] | null;
  files?:
    | { file: string; errors: number; warnings: number; total: number }[]
    | null;
  totalIssues: number;
  totalFiles: number;
  totalErrors?: number;
  filteredIssues?: number;
  filteredFiles?: number;
  displayedIssues?: number;
  displayedFiles?: number;
  truncatedMessage?: string;
  currentPage?: number;
  totalPages?: number;
}

/**
 * Run Oxlint Repository
 */
export class OxlintRepository {
  static async execute(
    data: OxlintRequestOutput,
    logger: EndpointLogger,
    platform: Platform,
    signal: AbortSignal,
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
        effectiveData.strict ?? false,
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
    fix: boolean | "lint-only",
    timeout: number,
    logger: EndpointLogger,
    config: CheckConfig,
    strict: boolean,
    extraIgnorePatterns?: string[],
    signal?: AbortSignal,
  ): Promise<ApiResponseType<{ issues: OxlintIssue[] }>> {
    logger.debug(`[OXLINT] Running on ${paths.length} path(s)`);

    // Build oxlint command arguments
    if (!config.oxlint.enabled) {
      return failInline({
        message: "Oxlint is disabled in check.config.ts",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
    const oxlintConfigPath = resolvePath(config.oxlint.configPath);

    // Check if config exists, if not use default settings
    const configExists = existsSync(oxlintConfigPath);

    // Always pass ignore patterns on the CLI so they are rooted at the repo
    // cwd rather than the generated config file directory (.tmp).
    const allIgnorePatterns = [
      ...(config.oxlint.enabled ? (config.oxlint.ignorePatterns ?? []) : []),
      ...(extraIgnorePatterns ?? []),
    ];
    const ignorePatternArgs = allIgnorePatterns.flatMap((pattern) => [
      "--ignore-pattern",
      pattern,
    ]);

    const threadArgs = OxlintRepository.threadArgs(config);

    const baseArgs = configExists
      ? [
          "--format=json",
          "--config",
          oxlintConfigPath,
          "--tsconfig",
          "./tsconfig.json",
          ...threadArgs,
          ...ignorePatternArgs,
          ...paths,
        ]
      : [
          "--format=json",
          // Fallback: Enable plugins manually if no config
          "--tsconfig",
          "./tsconfig.json",
          ...threadArgs,
          "--react-plugin",
          "--jsx-a11y-plugin",
          "--nextjs-plugin",
          "-D",
          "all",
          ...ignorePatternArgs,
          ...paths,
        ];

    // `--fix` applies only oxlint's safe rule fixes; the oxfmt formatting pass
    // rides along only with `fix: true` — `"lint-only"` skips it so a fix run
    // never reformats files it did not need to touch.
    const prettier = config.prettier;
    if (fix === "lint-only" || (fix === true && prettier.enabled)) {
      const fixArgs = [...baseArgs, "--fix"];

      const [oxlintResult, oxfmtResult] = await Promise.allSettled([
        OxlintRepository.runOxlintCommand(fixArgs, timeout, logger, signal),
        fix === true && prettier.enabled
          ? OxlintRepository.runOxfmt(
              paths,
              logger,
              prettier.configPath,
              prettier.ignoreFilePath,
              extraIgnorePatterns,
            )
          : Promise.resolve(),
      ]);

      // Handle oxlint result
      if (oxlintResult.status === "fulfilled") {
        // Log oxfmt result if it failed
        if (oxfmtResult.status === "rejected") {
          logger.warn(
            `[OXLINT] Oxfmt formatting failed: ${String(oxfmtResult.reason)}`,
          );
        }
        return success({
          issues: OxlintRepository.scopeStrictIssues(
            oxlintResult.value.issues,
            config,
            strict,
            logger,
          ),
        });
      } else {
        logger.error(`[OXLINT] Fix failed: ${String(oxlintResult.reason)}`);
        return failInline({
          message: `Oxlint check failed: ${parseError(oxlintResult.reason).message}`,
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
    }

    // Just run normal check
    const checkResult = await OxlintRepository.runOxlintCommand(
      baseArgs,
      timeout,
      logger,
      signal,
    );
    return success({
      issues: OxlintRepository.scopeStrictIssues(
        checkResult.issues,
        config,
        strict,
        logger,
      ),
    });
  }

  /**
   * Above this, extra worker threads cost more than they buy once a JS plugin
   * is loaded. Measured on a 20-core box, a 911-file scoped run: 4 threads
   * 0.55s, 8 threads 1.2s, 16 threads 6.0s, 20 (the default) 5.5s. Repo-wide
   * (4744 files) the same shape holds — 4 threads 4.2s vs 20 threads 9.1s — so
   * this is not an artefact of a small scope.
   */
  private static readonly MAX_JS_PLUGIN_THREADS = 4;

  /**
   * Cap oxlint's worker threads when a JS plugin is configured.
   *
   * oxlint stands up one JavaScript runtime per worker thread to host JS
   * plugins, and that spawn is what dominates a scoped run: a do-nothing
   * plugin costs exactly as much as the real one — the time is the runtimes,
   * not the rules. Defaulting to one per core turns a 0.3s lint into a 5s one.
   *
   * Native-only runs keep every core: without a JS plugin the thread count
   * makes no measurable difference (repo-wide 3.4s at both 4 and 20 threads),
   * so there is nothing to trade away, and no reason to constrain them.
   */
  private static threadArgs(config: CheckConfig): string[] {
    const jsPlugins = config.oxlint.enabled ? config.oxlint.jsPlugins : [];
    if (!jsPlugins || jsPlugins.length === 0) {
      return [];
    }
    const threads = Math.min(
      availableParallelism(),
      OxlintRepository.MAX_JS_PLUGIN_THREADS,
    );
    return [`--threads=${threads}`];
  }

  /**
   * Bare rule name, from either form it appears in.
   *
   * A config key is `unicorn/prefer-node-protocol` or `curly`; the matching
   * diagnostic code is `eslint-plugin-unicorn(prefer-node-protocol)` or
   * `eslint(curly)`. Neither the plugin prefix nor the wrapper is stable between
   * the two, so both collapse to the part that is.
   */
  private static bareRuleName(value: string): string {
    const wrapped = /\(([^()]+)\)\s*$/.exec(value);
    const name = wrapped ? wrapped[1] : value;
    return name.slice(name.lastIndexOf("/") + 1);
  }

  /**
   * The rules that `strictPaths` scopes, by bare name.
   *
   * Both tiers: the untyped-value bans and the style set are scoped the same
   * way. They are separate lists in the config so each can be adopted on its
   * own; from here the question is only "is this rule scoped or repo-wide".
   */
  private static bareNames(rules: string[] | undefined): Set<string> {
    return new Set((rules ?? []).map(OxlintRepository.bareRuleName));
  }

  /** True when a file is inside a tier's include list and not opted back out. */
  private static inPaths(file: string, paths: StrictPathsConfig): boolean {
    return (
      matchesAnyGlob(file, paths.include) &&
      !matchesAnyGlob(file, paths.exclude ?? [])
    );
  }

  /**
   * Drop strict issues for files outside the opted-in paths.
   *
   * Strict means anything this config asked for on top of oxlint's baseline: a
   * rule named in `rules`, or the `pedantic` category (which reports as `warn`).
   * What survives everywhere is `correctness`/`suspicious` — oxlint's own
   * "outright wrong" set, worth failing on in any file.
   *
   * Filtering here rather than in the oxlint config is not a shortcut: oxlint
   * cannot scope a *category* to a path at all. `overrides` accepts `rules`
   * only, and nested configs are ignored under `-c`.
   */
  private static scopeStrictIssues(
    issues: OxlintIssue[],
    config: CheckConfig,
    strict: boolean,
    logger: EndpointLogger,
  ): OxlintIssue[] {
    // `--strict` asks for the whole rule set on whatever was checked, whitelist
    // or not — the point is to see what a path would have to fix before it can
    // be added to one.
    if (strict) {
      return issues;
    }

    const strictPaths = config.oxlint.enabled
      ? config.oxlint.strictPaths
      : undefined;
    // No whitelist configured: strict rules apply everywhere, as before.
    if (!strictPaths) {
      return issues;
    }

    // Two tiers, each with its own path list. The untyped-value bans usually
    // reach further than the style set, so they are scoped separately; a config
    // that omits `midPaths` gets the old single-list behaviour.
    // Additive: omitted means "no extra trees", not "same as strict" — the OR
    // below already gives every strict path the mid rules.
    const midPaths: StrictPathsConfig = (config.oxlint.enabled
      ? config.oxlint.midPaths
      : undefined) ?? { include: [] };
    const typeRules = OxlintRepository.bareNames(
      config.oxlint.enabled ? config.oxlint.midRules : undefined,
    );
    const styleRules = OxlintRepository.bareNames(
      config.oxlint.enabled ? config.oxlint.strictRules : undefined,
    );

    const kept = issues.filter((issue) => {
      const ruleName =
        issue.rule === undefined
          ? undefined
          : OxlintRepository.bareRuleName(issue.rule);

      // Named, or nothing. Severity used to stand in for "strict" here, which
      // quietly swept up anything reported as a warning — the restricted-syntax
      // plugin included, so `unknown`/`object` went silent outside the whitelist
      // without anyone asking for that.
      if (ruleName === undefined) {
        return true;
      }
      // A mid rule reports in EITHER list: strict is cumulative, so a tree that
      // opted into the full set gets the mid rules without listing them twice.
      if (typeRules.has(ruleName)) {
        return (
          OxlintRepository.inPaths(issue.file, midPaths) ||
          OxlintRepository.inPaths(issue.file, strictPaths)
        );
      }
      if (styleRules.has(ruleName)) {
        return OxlintRepository.inPaths(issue.file, strictPaths);
      }
      return true;
    });

    const dropped = issues.length - kept.length;
    if (dropped > 0) {
      logger.debug(
        `[OXLINT] Dropped ${dropped} strict issue(s) outside the opted-in paths`,
      );
    }
    return kept;
  }

  /**
   * Run oxfmt on paths (files and/or folders) for formatting
   */
  private static async runOxfmt(
    paths: string[],
    logger: EndpointLogger,
    configPath: string,
    ignoreFilePath?: string,
    extraIgnorePatterns?: string[],
  ): Promise<void> {
    if (paths.length === 0) {
      return;
    }
    const ignoreArgs =
      ignoreFilePath && existsSync(`${process.cwd()}/${ignoreFilePath}`)
        ? ["--ignore-path", `${process.cwd()}/${ignoreFilePath}`]
        : [];
    // oxfmt supports exclude patterns via "!pattern" positional args
    const excludeArgs =
      extraIgnorePatterns && extraIgnorePatterns.length > 0
        ? extraIgnorePatterns.map((p) => `!${p}`)
        : [];
    const command = [
      "--config",
      configPath,
      ...ignoreArgs,
      ...paths,
      ...excludeArgs,
    ];

    const runner = buildPackageRunnerCommand(
      coreEnv.PACKAGE_MANAGER,
      "oxfmt",
      command,
    );

    logger.debug(
      `[OXLINT] Executing Oxfmt command: ${runner.command} ${runner.args.join(" ")}`,
    );

    const { spawn } = await import("node:child_process");

    return await new Promise((resolve, reject) => {
      const child = spawn(runner.command, runner.args, {
        cwd: process.cwd(),
        stdio: ["ignore", "pipe", "pipe"],
        shell: runner.shell,
      });

      let stderr = "";

      child.stderr?.on("data", (data: Buffer) => {
        stderr += data.toString();
      });

      child.on("close", (code) => {
        if (code === 0) {
          logger.debug("[OXLINT] Oxfmt formatting completed");
          resolve();
        } else {
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
      const displayedFileNames = new Set(
        paginatedIssues.map((issue) => issue.file),
      );
      const fileStats = OxlintRepository.buildFileStats(
        filteredIssues.filter((issue) => displayedFileNames.has(issue.file)),
      );
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
    const runner = buildPackageRunnerCommand(
      coreEnv.PACKAGE_MANAGER,
      "oxlint",
      args,
    );

    logger.debug(
      `[OXLINT] Executing command: ${runner.command} ${runner.args.join(" ")}`,
    );

    // Use spawn for execution
    const { spawn } = await import("node:child_process");
    const stdout = await new Promise<string>((resolve, reject) => {
      if (signal?.aborted) {
        reject(new Error("Aborted"));
        return;
      }
      const child = spawn(runner.command, runner.args, {
        cwd: process.cwd(),
        stdio: ["ignore", "pipe", "pipe"],
        shell: runner.shell,
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

      child.on("close", (code, killedBySignal) => {
        // Oxlint exit codes: 0=no issues, 1=lint issues found, 2=fatal/config error
        // Unlike ESLint, oxlint doesn't output valid results on fatal errors
        // So we only accept 0 and 1, reject on code >= 2
        if (code !== null && code >= 2) {
          const errorMsg =
            stderrOutput.trim() || `Oxlint failed with exit code ${code}`;
          reject(new Error(errorMsg));
          return;
        }
        // A null code means the process was killed by a signal, not that it
        // exited cleanly - oxlint panics (`Insufficient memory to create
        // fixed-size allocator pool`) and OOM kills land here. Falling through
        // to resolve() parsed the empty stdout as zero issues and reported a
        // CLEAN LINT for a checker that never ran. A crashed linter must fail
        // the run, never pass it.
        // A WORKER-thread panic does not change the process exit code: oxlint
        // still exits 0 and emits JSON, just with the panicked worker's files
        // missing. That renders as a clean lint for a run that silently checked
        // less than it claimed - the most dangerous failure this tool has,
        // because it is indistinguishable from success. Exit codes cannot see
        // it; only stderr can.
        const panicked = /panicked at|Insufficient memory|fatal runtime error/i;
        if (panicked.test(stderrOutput)) {
          reject(
            new Error(
              `Oxlint panicked mid-run, so its results are incomplete and cannot be trusted: ${stderrOutput.trim()}`,
            ),
          );
          return;
        }
        if (code === null) {
          const errorMsg =
            stderrOutput.trim() ||
            `Oxlint was killed by signal ${killedBySignal ?? "unknown"} without exiting`;
          reject(new Error(errorMsg));
          return;
        }
        resolve(output);
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
      logger.error(
        `[OXLINT] Unexpected error processing results: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    return { issues };
  }
}
