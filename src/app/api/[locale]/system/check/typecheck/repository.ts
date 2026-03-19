/**
 * Run TypeScript type checking Repository
 * Handles run typescript type checking operations
 *
 * This repository supports both tsc and tsgo type checkers.
 * The choice is controlled by the `useTsgo` config option.
 */

import { exec } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { promisify } from "node:util";

import { z } from "zod";

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
import { parseJsonWithComments } from "../../../shared/utils/parse-json";
import { ConfigRepositoryImpl } from "../config/repository";
import type { CheckConfig } from "../config/types";
import { calculateFilteredSummary, filterIssues } from "../shared/filter-utils";
import type {
  TypecheckIssue,
  TypecheckRequestOutput,
  TypecheckResponseOutput,
} from "./definition";
import type { CheckTypecheckT } from "./i18n";
import {
  createTypecheckConfig,
  getDisplayPath,
  PathType,
  resolvePathsToIncludes,
  shouldIncludeFile,
  type TypecheckConfig,
} from "./utils";

// ============================================================
// Internal Types
// ============================================================

interface TsConfig {
  compilerOptions?: {
    rootDir?: string;
    paths?: Record<string, string[]>;
    baseUrl?: string;
    typeRoots?: string[];
    [key: string]:
      | string
      | string[]
      | Record<string, string[]>
      | boolean
      | undefined;
  };
  include?: string[];
  exclude?: string[];
}

/** Parsed issue from typecheck output */
interface ParsedIssue {
  file: string;
  line?: number;
  column?: number;
  code?: string;
  severity: "error" | "warning" | "info";
  message: string;
}

/**
 * Run TypeScript type checking Repository
 */
export class TypecheckRepository {
  /** Wildcard include patterns to remove (we specify explicit files instead) */
  private static readonly WILDCARD_INCLUDE_PATTERNS: readonly string[] = [
    "**/*.ts",
    "**/*.tsx",
  ];

  /** TypeScript configuration Zod schema for runtime validation */
  private static readonly TsConfigSchema = z.object({
    compilerOptions: z
      .object({
        rootDir: z.string().optional(),
        paths: z.record(z.string(), z.array(z.string())).optional(),
        baseUrl: z.string().optional(),
        typeRoots: z.array(z.string()).optional(),
      })
      .passthrough()
      .optional(),
    include: z.array(z.string()).optional(),
    exclude: z.array(z.string()).optional(),
  });

  private static readonly execAsync = promisify(exec);
  // --------------------------------------------------------
  // Static Private Helpers - Command Configuration
  // --------------------------------------------------------

  /**
   * Get the base command for type checking.
   * @param useTsgo - Whether to use tsgo instead of tsc
   * @returns The base command string
   */
  private static getBaseCommand(useTsgo: boolean): string {
    if (useTsgo) {
      return "bunx tsgo";
    }
    // tsc needs increased memory for large projects

    return 'NODE_OPTIONS="--max-old-space-size=32768" bunx tsc';
  }

  /**
   * Build the full typecheck command with all flags.
   */
  private static buildTypecheckCommand(
    baseCommand: string,
    buildInfoFile: string,
    projectConfig: string,
  ): string {
    return `${baseCommand} --noEmit --incremental --tsBuildInfoFile ${buildInfoFile} --skipLibCheck --project ${projectConfig}`;
  }

  // --------------------------------------------------------
  // Static Private Helpers - Error Patterns
  // --------------------------------------------------------

  /**
   * Get the error pattern regex for tsc output.
   * Format: file.ts(line,column): error TS1234: message
   */
  private static getTscErrorPattern(): RegExp {
    return /^(.+?)\((\d+),(\d+)\):\s+(error|warning)\s+(TS\d+):\s*(.+)$/;
  }

  /**
   * Get the error pattern regex for tsgo output.
   * Format: file.ts:line:column - error TS1234: message
   */
  private static getTsgoErrorPattern(): RegExp {
    return /^(.+?):(\d+):(\d+)\s+-\s+(error|warning)\s+(TS\d+):\s*(.+)$/;
  }

  // --------------------------------------------------------
  // Static Private Helpers - Output Parsing
  // --------------------------------------------------------

  /**
   * Strip ANSI color codes from output.
   * tsgo adds color codes to its output which need to be removed for parsing.
   */
  private static stripAnsiCodes(text: string): string {
    const ESC = String.fromCodePoint(0x1b);
    const ansiPattern = new RegExp(`${ESC}\\[[0-9;]*m`, "g");
    return text.replaceAll(ansiPattern, "");
  }

  /**
   * Parse a single output line for TypeScript errors/warnings.
   * Tries both tsc and tsgo patterns.
   */
  private static parseOutputLine(
    line: string,
    useTsgo: boolean,
  ): ParsedIssue | null {
    // Try patterns in order based on which tool is being used
    const primaryPattern = useTsgo
      ? TypecheckRepository.getTsgoErrorPattern()
      : TypecheckRepository.getTscErrorPattern();
    const fallbackPattern = useTsgo
      ? TypecheckRepository.getTscErrorPattern()
      : TypecheckRepository.getTsgoErrorPattern();

    let match = line.match(primaryPattern);
    if (!match) {
      match = line.match(fallbackPattern);
    }

    if (!match) {
      return null;
    }

    const [, file, lineNum, colNum, severity, code, message] = match;
    const ruleCode = code.trim();

    return {
      file: file.trim(),
      line: parseInt(lineNum, 10),
      column: parseInt(colNum, 10),
      ...(ruleCode && { rule: ruleCode }),
      severity: severity === "error" ? "error" : "warning",
      message: message.trim(),
    };
  }

  /**
   * Parse typecheck output into structured issues.
   */
  private static parseTypecheckOutput(
    output: string,
    useTsgo: boolean,
    targetPath: string | string[] | undefined,
    disableFilter: boolean,
  ): { errors: ParsedIssue[]; warnings: ParsedIssue[] } {
    const errors: ParsedIssue[] = [];
    const warnings: ParsedIssue[] = [];

    const cleanOutput = TypecheckRepository.stripAnsiCodes(output);
    const lines = cleanOutput.split("\n");

    for (const line of lines) {
      const issue = TypecheckRepository.parseOutputLine(line, useTsgo);

      if (issue) {
        // Apply filtering based on target path and disableFilter setting
        const included = Array.isArray(targetPath)
          ? targetPath.some((p) =>
              shouldIncludeFile(issue.file, p, disableFilter),
            )
          : shouldIncludeFile(issue.file, targetPath, disableFilter);
        if (!included) {
          continue;
        }

        // Convert file path to display format
        issue.file = getDisplayPath(issue.file);

        if (issue.severity === "error") {
          errors.push(issue);
        } else {
          warnings.push(issue);
        }
      } else if (line.includes("error TS") && line.trim()) {
        // Fallback for simpler error formats - only when filtering is disabled
        if (targetPath && !disableFilter) {
          continue;
        }
        errors.push({
          file: "unknown",
          severity: "error",
          message: line.trim(),
        });
      } else if (
        line.includes("warning") &&
        [".ts", ".tsx"].some((ext) => line.includes(ext)) &&
        line.trim()
      ) {
        // Fallback warning format - only when filtering is disabled
        if (targetPath && !disableFilter) {
          continue;
        }
        warnings.push({
          file: "unknown",
          severity: "warning",
          message: line.trim(),
        });
      }
    }

    return { errors, warnings };
  }

  // --------------------------------------------------------
  // Static Private Helpers - Temp TSConfig Management
  // --------------------------------------------------------

  /**
   * Adjust a single path to be relative to temp config location.
   * @param path - The path to adjust
   * @param prefix - The relative prefix (e.g., "../../")
   */
  private static adjustPath(path: string, prefix: string): string {
    if (path.startsWith("/")) {
      return path; // Absolute paths don't need adjustment
    }
    if (path.startsWith("./")) {
      return `${prefix}${path.slice(2)}`;
    }
    if (path.startsWith("../")) {
      return path; // Already relative, don't double-adjust
    }
    return `${prefix}${path}`;
  }

  /**
   * Adjust file paths to be relative to temp config location.
   */
  private static adjustFilePaths(files: string[], prefix: string): string[] {
    return files.map((file) => TypecheckRepository.adjustPath(file, prefix));
  }

  /**
   * Adjust path mappings to account for temp config location.
   */
  private static adjustPathMappings(
    paths: Record<string, string[]> | undefined,
    prefix: string,
  ): Record<string, string[]> {
    const adjustedPaths: Record<string, string[]> = {};
    if (!paths) {
      return adjustedPaths;
    }

    for (const [key, pathArray] of Object.entries(paths)) {
      adjustedPaths[key] = pathArray.map((path) =>
        TypecheckRepository.adjustPath(path, prefix),
      );
    }

    return adjustedPaths;
  }

  /**
   * Adjust typeRoots to account for temp config location.
   */
  private static adjustTypeRoots(
    typeRoots: string[] | undefined,
    prefix: string,
  ): string[] | undefined {
    if (!typeRoots) {
      return undefined;
    }

    return typeRoots.map((root) =>
      TypecheckRepository.adjustPath(root, prefix),
    );
  }

  /**
   * Adjust general include patterns to account for temp config location.
   */
  private static adjustIncludePatterns(
    patterns: string[],
    prefix: string,
  ): string[] {
    return patterns.map((pattern) =>
      TypecheckRepository.adjustPath(pattern, prefix),
    );
  }

  /**
   * Calculate the relative path prefix needed to reach project root from the cache directory.
   * e.g., ".tmp/typecheck-cache" -> "../../"
   */
  private static getRelativePrefix(cachePath: string): string {
    // Count directory depth by splitting on path separator
    const depth = cachePath.split("/").filter((p) => p && p !== ".").length;

    return "../".repeat(depth);
  }

  /**
   * Adjust exclude patterns to account for temp config location.
   */
  private static adjustExcludePatterns(
    excludes: string[] | undefined,
    prefix: string,
  ): string[] {
    if (!excludes) {
      return [];
    }

    return excludes.map((excludePattern) =>
      TypecheckRepository.adjustPath(excludePattern, prefix),
    );
  }

  /**
   * Create a temporary tsconfig.json for specific files.
   * Preserves compiler options and path mappings from main tsconfig
   * but limits files to improve performance.
   */
  private static createTempTsConfig(
    filesToCheck: string[],
    tempConfigPath: string,
    cachePath: string,
    locale: CountryLanguage,
    t: CheckTypecheckT,
    extraExcludePatterns?: string[],
  ): ApiResponseType<void> {
    // Calculate the relative prefix based on cache directory depth
    const prefix = TypecheckRepository.getRelativePrefix(cachePath);

    // Read and validate the main tsconfig.json
    const tsConfigContent = readFileSync("tsconfig.json", "utf8");
    const parsedJsonResult = parseJsonWithComments(tsConfigContent, locale);
    if (!parsedJsonResult.success) {
      return fail({
        message: t("errors.parseTsconfig.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
    const mainTsConfig = TypecheckRepository.TsConfigSchema.parse(
      parsedJsonResult.data,
    ) as TsConfig;

    // Filter out wildcard patterns and adjust paths for temp config location
    const generalFilesToInclude = (mainTsConfig.include || []).filter(
      (includePattern) =>
        TypecheckRepository.WILDCARD_INCLUDE_PATTERNS.includes(includePattern)
          ? undefined
          : includePattern,
    );
    const adjustedGeneralIncludes = TypecheckRepository.adjustIncludePatterns(
      generalFilesToInclude,
      prefix,
    );

    // Adjust paths for temp config location
    const adjustedFiles = TypecheckRepository.adjustFilePaths(
      filesToCheck,
      prefix,
    );
    const adjustedPaths = TypecheckRepository.adjustPathMappings(
      mainTsConfig.compilerOptions?.paths,
      prefix,
    );
    const adjustedExcludes = [
      ...TypecheckRepository.adjustExcludePatterns(
        mainTsConfig.exclude,
        prefix,
      ),
      // Extra excludes from non-extensive mode — passed as-is (relative to project root,
      // adjusted with prefix so they resolve correctly from the temp config location)
      ...(extraExcludePatterns ?? []).map((p) =>
        TypecheckRepository.adjustPath(p, prefix),
      ),
    ];
    const adjustedTypeRoots = TypecheckRepository.adjustTypeRoots(
      mainTsConfig.compilerOptions?.typeRoots,
      prefix,
    );
    // Ensure node_modules root is in typeRoots so packages like "bun-types"
    // (which live at node_modules/bun-types, not node_modules/@types/bun-types)
    // can be resolved when listed in compilerOptions.types.
    const nodeModulesRoot = `${prefix}node_modules`;
    if (adjustedTypeRoots && !adjustedTypeRoots.includes(nodeModulesRoot)) {
      adjustedTypeRoots.push(nodeModulesRoot);
    }

    // Create temporary tsconfig
    const tempTsConfig: TsConfig = {
      ...mainTsConfig,
      compilerOptions: {
        ...mainTsConfig.compilerOptions,
        rootDir: prefix.slice(0, -1), // Remove trailing slash for rootDir (e.g., "../..")
        baseUrl: undefined, // Remove baseUrl as tsgo doesn't support it
        typeRoots: adjustedTypeRoots,
        paths: {
          ...adjustedPaths,

          "*": [`${prefix}*`], // Replace baseUrl functionality for tsgo compatibility (resolve from project root)
        },
      },
      include: [...adjustedGeneralIncludes, ...adjustedFiles],
      exclude: adjustedExcludes,
    };

    writeFileSync(tempConfigPath, JSON.stringify(tempTsConfig, null, 2));
    return success(undefined);
  }

  // --------------------------------------------------------
  // Public Methods
  // --------------------------------------------------------

  /**
   * Execute TypeScript type checking.
   */
  static async execute(
    data: TypecheckRequestOutput,
    logger: EndpointLogger,
    platform: Platform,
    t: CheckTypecheckT,
    locale: CountryLanguage,
    providedConfig: CheckConfig | undefined,
    signal: AbortSignal,
  ): Promise<ApiResponseType<TypecheckResponseOutput>> {
    const isMCP = platform === Platform.MCP;
    const startTime = Date.now();
    let output = "";
    let config: TypecheckConfig | undefined;

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
          });
        }
        checkConfig = configResult.config;
      }

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
        !isExtensive && checkConfig.typecheck.enabled
          ? checkConfig.typecheck.nonExtensiveIgnorePatterns
          : undefined;

      // Check if typecheck is enabled
      if (!checkConfig.typecheck.enabled) {
        logger.info("Typecheck is disabled in check.config.ts");
        return success({
          items: [],
          files: [],
          totalIssues: 0,
        });
      }

      const typecheckConfig = checkConfig.typecheck;
      const useTsgo = typecheckConfig.useTsgo ?? false;

      // Get the appropriate base command
      const baseCommand = TypecheckRepository.getBaseCommand(useTsgo);

      logger.debug(
        `[TYPESCRIPT] Using ${useTsgo ? "tsgo" : "tsc"} for type checking`,
      );

      // Create TypeScript checking configuration
      config = createTypecheckConfig(data.path, typecheckConfig.cachePath);

      // Build the command based on path type
      const buildResult = TypecheckRepository.buildCommand(
        baseCommand,
        config,
        typecheckConfig.cachePath,
        logger,
        locale,
        t,
        activeIgnorePatterns,
      );

      if (!buildResult.success) {
        return buildResult;
      }

      if (!buildResult.data) {
        return fail({
          message: t("errors.noTsFiles.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: {
            message: t("errors.noTsFiles.message"),
          },
        });
      }

      const command = buildResult.data;

      logger.debug(`[TYPESCRIPT] Executing command: ${command}`);

      // Execute the typecheck command
      const execResult = await TypecheckRepository.executeCommand(
        command,
        data.timeout,
        logger,
        t,
        signal,
      );

      if (!execResult.success) {
        return fail({
          message: t("errors.internal.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: {
            error: execResult.message || "Unknown error",
          },
        });
      }

      output = execResult.data.output;

      // Parse the output into structured issues
      // For multiple paths use targetPaths array for filtering, otherwise single targetPath
      const filterTarget = config.targetPaths ?? config.targetPath;
      const { errors, warnings } = TypecheckRepository.parseTypecheckOutput(
        output,
        useTsgo,
        filterTarget,
        effectiveData.disableFilter,
      );

      // Files excluded via tsconfig (extra excludes are handled at compiler level in buildCommand)
      const allIssues = [...errors, ...warnings];

      // Skip sorting if requested (when vibe-check already sorted)
      const issues = effectiveData.skipSorting
        ? allIssues
        : allIssues.toSorted((a, b) => {
            const fileCompare = a.file.localeCompare(b.file);
            if (fileCompare !== 0) {
              return fileCompare;
            }
            const lineA = a.line || 0;
            const lineB = b.line || 0;
            return lineA - lineB;
          });

      return success(
        TypecheckRepository.buildResponse(issues, effectiveData, isMCP),
      );
    } catch (error) {
      return TypecheckRepository.handleError(
        error as Error,
        output,
        config,
        data,
        startTime,
        logger,
        isMCP,
        t,
      );
    }
  }

  // --------------------------------------------------------
  // Private Methods
  // --------------------------------------------------------

  /**
   * Build file statistics from issues
   */
  private static buildFileStats(
    issues: TypecheckIssue[],
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
    allIssues: TypecheckIssue[],
    data: TypecheckRequestOutput,
    skipFiles = false,
  ): TypecheckResponseOutput {
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
        const fileStats = TypecheckRepository.buildFileStats(allIssues);
        files = TypecheckRepository.formatFileStats(fileStats);
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
      const fileStats = TypecheckRepository.buildFileStats(filteredIssues);
      files = TypecheckRepository.formatFileStats(fileStats);
    }

    return {
      items: data.summaryOnly ? undefined : paginatedIssues,
      files,
      ...summary,
    };
  }

  /**
   * Build the typecheck command based on path type.
   */
  private static buildCommand(
    baseCommand: string,
    config: TypecheckConfig,
    cachePath: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
    t: CheckTypecheckT,
    extraIgnorePatterns?: string[],
  ): ApiResponseType<string | null> {
    if (config.pathType === PathType.NO_PATH) {
      // No specific path provided, check entire project.
      // When extra ignore patterns are present we need a temp config to carry the excludes —
      // tsconfig.json itself is never modified.
      if (extraIgnorePatterns && extraIgnorePatterns.length > 0) {
        /* eslint-disable i18next/no-literal-string */
        const tempConfigFile = join(
          cachePath,
          `tsconfig.${config.cacheKey}.json`,
        );
        const tempBuildInfoFile = join(
          cachePath,
          `tsconfig.${config.cacheKey}.tsbuildinfo`,
        );
        /* eslint-enable i18next/no-literal-string */
        logger.debug(
          "[TYPESCRIPT] Creating temp tsconfig for full project with extra excludes",
        );
        // Empty filesToCheck — original tsconfig includes already cover the full project.
        // The temp config just carries the extra excludes on top of those.
        const createResult = TypecheckRepository.createTempTsConfig(
          [],
          tempConfigFile,
          cachePath,
          locale,
          t,
          extraIgnorePatterns,
        );
        if (!createResult.success) {
          return createResult;
        }
        return success(
          TypecheckRepository.buildTypecheckCommand(
            baseCommand,
            tempBuildInfoFile,
            tempConfigFile,
          ),
        );
      }

      logger.debug("[TYPESCRIPT] Running check on entire project");
      return success(
        TypecheckRepository.buildTypecheckCommand(
          baseCommand,
          config.buildInfoFile,
          "tsconfig.json",
        ),
      );
    }

    if (!config.tempConfigFile) {
      return success(null);
    }

    let createResult: ApiResponseType<void>;
    if (config.pathType === PathType.SINGLE_FILE) {
      // Single file - create temporary tsconfig for this file
      createResult = TypecheckRepository.createTempTsConfig(
        [config.targetPath!],
        config.tempConfigFile,
        cachePath,
        locale,
        t,
        extraIgnorePatterns,
      );
    } else if (config.pathType === PathType.MULTIPLE_PATHS) {
      // Multiple paths - combine all into one tsconfig
      const includes = resolvePathsToIncludes(config.targetPaths ?? []);
      createResult = TypecheckRepository.createTempTsConfig(
        includes,
        config.tempConfigFile,
        cachePath,
        locale,
        t,
        extraIgnorePatterns,
      );
    } else {
      // Folder - create temporary tsconfig with folder glob pattern
      const folderPath = config.targetPath || ".";
      createResult = TypecheckRepository.createTempTsConfig(
        [`${folderPath}/**/*`],
        config.tempConfigFile,
        cachePath,
        locale,
        t,
        extraIgnorePatterns,
      );
    }

    if (!createResult.success) {
      return createResult;
    }

    return success(
      TypecheckRepository.buildTypecheckCommand(
        baseCommand,
        config.buildInfoFile,
        config.tempConfigFile,
      ),
    );
  }

  /**
   * Execute the typecheck command.
   */
  private static async executeCommand(
    command: string,
    timeout: number | undefined,
    logger: EndpointLogger,
    t: CheckTypecheckT,
    signal?: AbortSignal,
  ): Promise<ApiResponseType<{ output: string }>> {
    try {
      if (signal?.aborted) {
        return fail({
          message: t("errors.aborted.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
      const result = await TypecheckRepository.execAsync(command, {
        cwd: process.cwd(),
        timeout: (timeout ?? 900) * 1000,
        maxBuffer: 1024 * 1024 * 10, // 10MB buffer
        signal,
      });

      logger.debug("[TYPESCRIPT] Command executed successfully");
      return success({
        output: [result.stdout, result.stderr].filter(Boolean).join("\n"),
      });
    } catch (execError) {
      // TSC exit codes 1 and 2 mean TypeScript errors were found
      const hasTypeErrors =
        execError &&
        typeof execError === "object" &&
        "code" in execError &&
        (execError.code === 1 || execError.code === 2);

      if (hasTypeErrors && "stdout" in execError && "stderr" in execError) {
        const stdout =
          typeof execError.stdout === "string" ? execError.stdout : "";
        const stderr =
          typeof execError.stderr === "string" ? execError.stderr : "";
        return success({
          output: [stdout, stderr].filter(Boolean).join("\n"),
        });
      }

      // Other errors are unexpected
      const parsedError = parseError(execError);

      logger.error(
        `[TYPESCRIPT] Unexpected error executing command: ${parsedError.message}`,
      );
      return fail({
        message: t("errors.internal.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  /**
   * Handle errors during execution.
   */
  private static handleError(
    error: Error,
    output: string,
    config: TypecheckConfig | undefined,
    data: TypecheckRequestOutput,
    startTime: number,
    logger: EndpointLogger,
    skipFiles = false,
    t: CheckTypecheckT,
  ): ApiResponseType<TypecheckResponseOutput> {
    const duration = Date.now() - startTime;
    const parsedError = parseError(error);
    const targetPath = config?.targetPaths ?? config?.targetPath ?? data.path;

    logger.warn(
      `[TYPESCRIPT] Execution error: ${parsedError.message} (duration: ${duration}ms)`,
    );

    // Try to extract issues from error output
    const hasStderr = error && typeof error === "object" && "stderr" in error;
    const hasStdout = error && typeof error === "object" && "stdout" in error;
    const hasCode = error && typeof error === "object" && "code" in error;

    const issues: Array<{
      file: string;
      line?: number;
      column?: number;
      rule?: string;
      severity: "error" | "warning" | "info";
      message: string;
    }> = [];

    if (hasStderr && typeof error.stderr === "string") {
      output += error.stderr;
      issues.push({
        file: "unknown",
        severity: "error",
        message: error.stderr.trim(),
      });
    }

    if (hasStdout && typeof error.stdout === "string") {
      output += error.stdout;

      // Parse TypeScript errors from stdout
      const { errors } = TypecheckRepository.parseTypecheckOutput(
        error.stdout,
        false, // Try both patterns
        targetPath,
        data.disableFilter,
      );

      for (const err of errors) {
        issues.push(err);
      }
    }

    // If no specific errors found, add the general error message
    if (issues.length === 0) {
      issues.push({
        file: "unknown",
        severity: "error",
        message: parsedError.message,
      });
    }

    // For TypeScript errors (exit code 2) or when we have parsed errors,
    // return success with error details for UI display
    const errorCode =
      hasCode && typeof error.code === "number" ? error.code : 0;
    if (errorCode === 2 || issues.length > 0) {
      return success(
        TypecheckRepository.buildResponse(issues, data, skipFiles),
      );
    }

    return fail({
      message: t("errors.internal.title"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      messageParams: {
        error: parsedError.message,
        output: output.trim(),
        duration: duration.toString(),
      },
    });
  }
}
