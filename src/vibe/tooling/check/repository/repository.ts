/**
 * Vibe Check Repository Implementation
 */

import "server-only";

import { existsSync } from "node:fs";
import { isAbsolute, posix, resolve } from "node:path";

import { getInvocationDir } from "@/env/paths";

import { coreEnv } from "../../../core/env";
import type { ResponseType } from "../../../core/route/response.schema";
import {
  ErrorResponseTypes,
  failInline,
  success,
} from "../../../core/route/response.schema";
import { parseError } from "../../../core/utils/parse-error";
import type { JwtPayloadType } from "../../../identity/auth/types";
import type { EndpointLogger } from "../../../logger/types";
import { Platform } from "../../../platforms/platforms";
import { createEndpointEmitter } from "../../../realtime/core/emitter";
import { ConfigRepositoryImpl } from "../config/repository";
import type { CheckConfig } from "../config/types";
import vibeCheckEndpoints from "../definition";
import { calculateFilteredSummary, filterIssues } from "./filter-utils";
import { LintRepository } from "./lint/repository";
import { OxlintRepository } from "./oxlint/repository";
import { TypecheckRepository } from "./typecheck/repository";

// ── Inline types (definitions removed) ──────────────────────

interface CheckItem {
  file: string;
  line?: number;
  column?: number;
  rule?: string;
  severity: "error" | "warning" | "info";
  message: string;
}

interface CheckFileStats {
  file: string;
  errors: number;
  warnings: number;
  total: number;
}

interface SharedResponseOutput {
  editorUriSchema?: string;
  items?: CheckItem[] | null;
  files?: CheckFileStats[] | null;
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
  phases?: CheckPhase[] | null;
  isComplete?: boolean;
}

type CheckPhaseStatus = "pending" | "running" | "done" | "failed" | "skipped";

/**
 * One checker's progress row. `id` is what makes the cache-merger update a
 * single phase in place — id-keyed arrays merge by id, so an emit carrying only
 * the oxlint row leaves eslint/typecheck untouched.
 */
interface CheckPhase {
  id: CheckType;
  tool: string;
  status: CheckPhaseStatus;
  issues?: number;
  errors?: number;
  durationMs?: number;
}

interface VibeCheckRequestOutput {
  paths?: string | string[];
  timeout?: number;
  limit?: number;
  page?: number;
  filter?: string | string[];
  summaryOnly: boolean;
  extensive?: boolean;
  strict?: boolean;
}

type VibeCheckResponseOutput = SharedResponseOutput;
type OxlintResponseOutput = SharedResponseOutput;
type TypecheckResponseOutput = SharedResponseOutput;
type CheckType = "oxlint" | "eslint" | "typecheck";

interface CheckResult {
  type: CheckType;
  result:
    | ResponseType<OxlintResponseOutput>
    | ResponseType<VibeCheckResponseOutput>
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
  private static getPerformanceKey(type: CheckType): string {
    const keyMap: Record<CheckType, string> = {
      oxlint: "Oxlint",
      eslint: "ESLint",
      typecheck: "TypeScript",
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
    extensive: boolean,
    strict: boolean,
    signal: AbortSignal,
  ): Promise<CheckResult> {
    const startTime = Date.now();
    const result = await OxlintRepository.execute(
      {
        path: paths.length === 1 ? paths[0] : paths,
        fix,
        timeout,
        skipSorting: true,
        limit: 999999,
        page: 1,
        summaryOnly: false,
        extensive,
        strict,
      },
      logger,
      platform,
      signal,
      config,
    );
    // Completion is reported through the "check-progress" event (see execute),
    // which renders as a phase row in the widget on every platform. Keeping an
    // info-level stdout write here would tear the repainting live frame.
    logger.debug(
      `✓ Oxlint check completed with ${result.success ? result.data.items?.length : 0} issues`,
    );
    return {
      type: "oxlint",
      result,
      duration: Date.now() - startTime,
    };
  }

  private static async runEslintCheck(
    path: string | string[],
    fix: boolean,
    timeout: number,
    config: CheckConfig,
    logger: EndpointLogger,
    platform: Platform,
    extensive: boolean,
    signal: AbortSignal,
  ): Promise<CheckResult> {
    const startTime = Date.now();
    const result = await LintRepository.execute(
      {
        path,
        fix,
        timeout,
        cacheDir: config.eslint.enabled ? config.eslint.cachePath : "./.tmp",
        skipSorting: true,
        limit: 999999,
        page: 1,
        summaryOnly: false,
        extensive,
      },
      logger,
      platform,
      config,
      signal,
    );
    logger.debug(
      `✓ ESLint check completed with ${result.success ? result.data.items?.length : 0} issues`,
    );
    return {
      type: "eslint",
      result,
      duration: Date.now() - startTime,
    };
  }

  private static async runTypecheckCheck(
    path: string | string[] | undefined,
    timeout: number,
    config: CheckConfig,
    logger: EndpointLogger,
    platform: Platform,
    extensive: boolean,
    // Without this the `--strict` request flag never reached the typechecker:
    // resolveEnforcedOptions read `data.strict`, which was always undefined.
    strict: boolean,
    signal: AbortSignal,
  ): Promise<CheckResult> {
    const startTime = Date.now();

    const result = await TypecheckRepository.execute(
      {
        path,
        timeout,
        skipSorting: true,
        disableFilter: false,
        limit: 999999,
        page: 1,
        summaryOnly: false,
        extensive,
        strict,
      },
      logger,
      platform,
      config,
      signal,
    );

    logger.debug(
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
    user: JwtPayloadType,
    signal: AbortSignal,
  ): Promise<ResponseType<VibeCheckResponseOutput>> {
    const isMCP = platform === Platform.MCP;
    try {
      logger.debug("[VIBE-CHECK] ensureConfigReady start");
      const configResult = await ConfigRepositoryImpl.ensureConfigReady(
        logger,
        false,
      );
      logger.debug("[VIBE-CHECK] ensureConfigReady done");

      if (!configResult.ready) {
        return success(
          {
            editorUriSchema: isMCP ? undefined : "vscode://file/",
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
            totalIssues: 1,
            totalFiles: 1,
            totalErrors: 1,
            displayedIssues: 1,
            displayedFiles: 1,
            currentPage: 1,
            totalPages: 1,
          },
          {
            isErrorResponse: true,
            performance: {
              ["Total"]: 0,
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
        fix: defaults.fix ?? false,
        skipEslint: defaults.skipEslint ?? false,
        skipOxlint: defaults.skipOxlint ?? false,
        skipTypecheck: defaults.skipTypecheck ?? false,
        timeout: data.timeout ?? defaults.timeout ?? 3600,
        limit: data.limit ?? defaultLimit,
        page: data.page ?? 1,
      };

      // Resolve the effective extensive flag (request overrides config default)
      const isExtensive = data.extensive ?? defaults.extensive ?? false;

      // `--strict` reports the strict rules regardless of the strictPaths
      // whitelist. Request-only: there is no config default, because a config
      // that always ignored its own whitelist would just be a whitelist of one.
      const isStrict = data.strict ?? false;

      const pathsToCheck = this.normalizePaths(effectiveData.paths);

      // Fail on a path that isn't there rather than handing it to the checkers.
      // tsc's own complaint for a non-existent include is TS18003, which names
      // the temp config we generated instead of the path the user typed.
      const missingPaths = pathsToCheck
        .filter((p): p is string => Boolean(p))
        .filter((p) => !existsSync(resolve(p)));
      if (missingPaths.length > 0) {
        return failInline({
          message: VibeCheckRepository.missingPathsMessage(missingPaths),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const baseDir = coreEnv.PROJECT_ROOT || "./";
      const performanceTimings: Partial<Record<string, number>> = {};
      let firstCheckStart = 0;
      let lastCheckEnd = 0;

      // ── Progress reporting ──────────────────────────────────────────────
      // The three checkers run concurrently for tens of seconds. Instead of
      // logging to stdout, emit partial response data: the CLI taps these
      // in-process and repaints its frame, the web client merges them into the
      // response cache, and MCP ignores them. Progress is DATA, not output.
      const emitProgress = createEndpointEmitter(
        vibeCheckEndpoints.POST,
        logger,
        user,
      );
      const phases: CheckPhase[] = [];
      const completedIssues: CheckIssue[] = [];

      /**
       * Emit the current progress snapshot: phase rows plus running totals.
       *
       * Deliberately does NOT carry items/files. Results are only meaningful once
       * every checker has reported — a partial list would show issues that a
       * later checker reorders, and would let the widget render a conclusion
       * ("no issues") that is not yet true. The final response is the only thing
       * that renders results, so buildResponse (sort + filter + paginate + file
       * stats) also never runs on the progress path, where it would repeat over
       * the whole issue set on every checker completion.
       */
      const publishProgress = (): void => {
        emitProgress("check-progress", {
          responseData: {
            phases: phases.map((phase) => ({ ...phase })),
            isComplete: false,
            totalIssues: completedIssues.length,
            totalFiles: new Set(completedIssues.map((issue) => issue.file))
              .size,
          },
        });
      };

      /** Mark a checker finished and publish its results into the live frame. */
      const completePhase = (checkResult: CheckResult): void => {
        const issues = this.extractIssuesFromResult(checkResult.result);
        completedIssues.push(...issues);
        const phase = phases.find((entry) => entry.id === checkResult.type);
        if (phase) {
          // "done" means the tool RAN. A tool that died must not render the
          // same "✓ 0 issues" row as one that ran and found nothing — that row
          // is the whole reason a crashed checker read as a clean tree.
          const failed = !checkResult.result.success;
          phase.status = failed ? "failed" : "done";
          phase.issues = issues.length;
          phase.errors = failed
            ? Math.max(issues.length, 1)
            : issues.filter((issue) => issue.severity === "error").length;
          phase.durationMs = checkResult.duration;
        }
        publishProgress();
      };

      // Run checkers for all paths in parallel
      // Oxlint supports multiple paths natively, but TypeScript and ESLint need separate runs per path
      const promises: Promise<CheckResult>[] = [];

      // Oxlint can handle multiple paths efficiently in a single run
      if (!effectiveData.skipOxlint && configResult.config.oxlint.enabled) {
        const oxlintPaths =
          pathsToCheck.length === 0
            ? baseDir
            : pathsToCheck.map((p) => p || baseDir);
        phases.push({ id: "oxlint", tool: "Oxlint", status: "running" });
        promises.push(
          this.runOxlintCheck(
            Array.isArray(oxlintPaths) ? oxlintPaths : [oxlintPaths],
            effectiveData.fix,
            effectiveData.timeout,
            configResult.config,
            logger,
            platform,
            isExtensive,
            isStrict,
            signal,
          ).then((result) => {
            if (firstCheckStart === 0) {
              firstCheckStart = Date.now();
            }
            lastCheckEnd = Date.now();
            completePhase(result);
            return result;
          }),
        );
      }

      // ESLint: single run for all paths
      if (!effectiveData.skipEslint && configResult.config.eslint.enabled) {
        const eslintPaths =
          pathsToCheck.length === 0
            ? baseDir
            : pathsToCheck.map((p) => p || baseDir);
        const eslintPath =
          Array.isArray(eslintPaths) && eslintPaths.length === 1
            ? eslintPaths[0]
            : eslintPaths;
        phases.push({ id: "eslint", tool: "ESLint", status: "running" });
        promises.push(
          this.runEslintCheck(
            eslintPath,
            effectiveData.fix,
            effectiveData.timeout,
            configResult.config,
            logger,
            platform,
            isExtensive,
            signal,
          ).then((result) => {
            if (firstCheckStart === 0) {
              firstCheckStart = Date.now();
            }
            lastCheckEnd = Date.now();
            completePhase(result);
            return result;
          }),
        );
      }

      // TypeScript: single run for all paths combined
      if (
        !effectiveData.skipTypecheck &&
        configResult.config.typecheck.enabled
      ) {
        const nonEmptyPaths = pathsToCheck.filter((p): p is string =>
          Boolean(p),
        );
        const typecheckPath =
          nonEmptyPaths.length === 0
            ? undefined
            : nonEmptyPaths.length === 1
              ? nonEmptyPaths[0]
              : nonEmptyPaths;
        phases.push({ id: "typecheck", tool: "TypeScript", status: "running" });
        promises.push(
          this.runTypecheckCheck(
            typecheckPath,
            effectiveData.timeout,
            configResult.config,
            logger,
            platform,
            isExtensive,
            isStrict,
            signal,
          ).then((result) => {
            if (firstCheckStart === 0) {
              firstCheckStart = Date.now();
            }
            lastCheckEnd = Date.now();
            completePhase(result);
            return result;
          }),
        );
      }

      // Frame 1: every checker shown as running before any of them returns, so
      // the user sees the work start instead of a blank terminal.
      publishProgress();

      const checkResults = await Promise.allSettled(promises);

      // If aborted (Ctrl+C), return empty success - caller suppresses output
      if (signal.aborted) {
        return success({
          editorUriSchema: undefined,
          items: [],
          files: [],
          totalIssues: 0,
          totalFiles: 0,
          totalErrors: 0,
          displayedIssues: 0,
          displayedFiles: 0,
          currentPage: 1,
          totalPages: 1,
        });
      }

      logger.debug("All checks completed");

      if (firstCheckStart > 0 && lastCheckEnd > 0) {
        performanceTimings["Total"] = lastCheckEnd - firstCheckStart;
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

      return success(
        {
          ...response,
          phases: phases.map((phase) => ({ ...phase })),
          isComplete: true,
        },
        {
          isErrorResponse: hasErrors ? true : undefined,
          performance: performanceTimings,
        },
      );
    } catch (error) {
      logger.error("Vibe check failed", parseError(error));
      return failInline({
        message: `Vibe check failed: ${String(error)}`,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Explain a path that isn't on disk.
   *
   * A path with no separator at all, in a repo where nothing matches it, is
   * almost always a POSIX shell eating a Windows backslash: `src\vibe` reaches
   * us as `srcvibe`, because bash treats `\` as an escape long before argv is
   * built. There is nothing to recover at that point, so say so.
   */
  private static missingPathsMessage(missingPaths: string[]): string {
    const list = missingPaths.join(", ");
    const looksEscaped = missingPaths.some(
      (p) => !p.includes("/") && !p.includes("\\"),
    );
    const hint = looksEscaped
      ? " (if you typed a Windows path in bash, quote it or use forward slashes — the backslash was consumed by the shell)"
      : "";
    return `Path not found: ${list}${hint}`;
  }

  /**
   * An explicit path is relative to where the user typed it, not to the project
   * root the runtime chdir'd to. Rebasing it here is what makes `vibe check
   * ./widget.tsx` from inside a feature folder mean that file.
   */
  private static toProjectRelative(
    path: string,
    invocationDir: string,
  ): string {
    if (isAbsolute(path) || invocationDir === ".") {
      return path;
    }
    return posix.join(invocationDir, path.replaceAll("\\", "/"));
  }

  private static normalizePaths(
    paths: string | string[] | undefined,
  ): (string | undefined)[] {
    const invocationDir = getInvocationDir();

    if (typeof paths === "string") {
      return [VibeCheckRepository.toProjectRelative(paths, invocationDir)];
    }
    if (paths && paths.length > 0) {
      return paths.map((path) =>
        VibeCheckRepository.toProjectRelative(path, invocationDir),
      );
    }
    // No path at all: check where the user is standing. The runtime chdirs to
    // the project root before anything runs, so the old `undefined` default
    // silently meant "the entire repo" no matter where the command was typed.
    // "." IS the root - keep the undefined the checkers already read as
    // "everything".
    return invocationDir === "." ? [undefined] : [invocationDir];
  }

  private static processCheckResults(
    checkResults: PromiseSettledResult<CheckResult>[],
    performanceTimings: Partial<Record<string, number>>,
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
      performanceTimings[key] = (performanceTimings[key] ?? 0) + duration;

      // Extract issues
      const issues = this.extractIssuesFromResult(result);
      if (issues.length > 0) {
        allIssues.push(...issues);
        if (this.hasErrorSeverity(issues)) {
          hasErrors = true;
        }
      }

      // A leg that FAILED is not a leg that found nothing, and the difference
      // has to reach the output. `hasErrors` alone did not: the summary counts
      // `allIssues`, so a dead tool contributed zero rows and printed
      // "✓ No issues found" — a tool that crashed on startup looked exactly
      // like a clean codebase. That is the worst possible failure mode for a
      // gate, because green is precisely when nobody investigates.
      //
      // Pushing a real issue makes it visible, counted, and non-zero.
      if (!result.success) {
        hasErrors = true;
        allIssues.push({
          file: `${this.getPerformanceKey(type)} FAILED TO RUN`,
          severity: "error",
          rule: "check/tool-failure",
          message:
            `${this.getPerformanceKey(type)} did not complete, so its result is unknown — this is NOT a pass. ` +
            `${"message" in result && result.message ? result.message : "No further detail was reported."}`,
        });
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
        ...summary,
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
      const displayedFileNames = new Set(
        paginatedIssues.map((issue) => issue.file),
      );
      const fileStats = this.buildFileStats(
        filteredIssues.filter((issue) => displayedFileNames.has(issue.file)),
      );
      files = this.formatFileStats(fileStats);
    }

    return {
      editorUriSchema: skipFiles ? undefined : editorUriScheme,
      items: summaryOnly ? undefined : paginatedIssues,
      files,
      ...summary,
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
