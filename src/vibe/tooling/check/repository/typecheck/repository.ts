/**
 * Run TypeScript type checking Repository
 * Handles run typescript type checking operations
 *
 * This repository supports both tsc and tsgo type checkers.
 * The choice is controlled by the `useTsgo` config option.
 */

import { spawn } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { Platform } from "next-vibe/core/definition/platform";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType as ApiResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";
import { ConfigRepositoryImpl } from "next-vibe/tooling/check/config/repository";
import type { CheckConfig } from "next-vibe/tooling/check/config/types";
import {
  calculateFilteredSummary,
  filterIssues,
} from "next-vibe/tooling/check/shared/filter-utils";
import type { CheckTypecheckT } from "next-vibe/tooling/check/typecheck/i18n";
import { z } from "zod";

import { parseJsonWithComments } from "../parse-json";
import type {
  TypecheckIssue,
  TypecheckRequestOutput,
  TypecheckResponseOutput,
} from "./definition";
import { TsgoDaemon } from "./lsp-daemon";
import { type TypecheckConfig } from "./utils";
import {
  createTypecheckConfig,
  getDisplayPath,
  PathType,
  resolvePathsToIncludes,
  shouldIncludeFile,
} from "./utils";
// ============================================================
// Internal Types
// ============================================================

interface TsConfig {
  extends?: string | string[];
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
  files?: string[];
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
 * Find tsgo binary by walking up from startDir.
 * Handles nested projects (e.g. test-project) that don't have their own tsgo.
 */
function findTsgoFrom(startDir: string): string | undefined {
  const binaryNames =
    process.platform === "win32" ? ["tsgo.exe", "tsgo"] : ["tsgo"];
  let dir = startDir;
  while (true) {
    for (const binaryName of binaryNames) {
      const candidate = join(dir, "node_modules/.bin", binaryName);
      if (existsSync(candidate)) {
        return candidate;
      }
    }
    const parent = dirname(dir);
    if (parent === dir) {
      return undefined;
    }
    dir = parent;
  }
}

function findTsgo(startDir: string): string {
  if (process.env["TSGO_PATH"]) {
    return process.env["TSGO_PATH"];
  }

  const projectBinary = findTsgoFrom(startDir);
  if (projectBinary) {
    return projectBinary;
  }

  const checkerBinary = findTsgoFrom(dirname(fileURLToPath(import.meta.url)));
  if (checkerBinary) {
    return checkerBinary;
  }

  const binaryName = process.platform === "win32" ? "tsgo.exe" : "tsgo";
  return join(startDir, "node_modules/.bin", binaryName);
}

/**
 * Run TypeScript type checking Repository
 */
export class TypecheckRepository {
  private static readonly PROJECT_SCAN_IGNORES = new Set([
    ".git",
    ".tmp",
    "bin",
    "build",
    "coverage",
    "dist",
    "lib",
    "node_modules",
  ]);

  /** Discover independent nested TypeScript projects in a workspace. */
  private static discoverNestedProjects(root: string): string[] {
    const projects: string[] = [];
    const visit = (directory: string): void => {
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        if (
          entry.isDirectory() &&
          !TypecheckRepository.PROJECT_SCAN_IGNORES.has(entry.name)
        ) {
          visit(join(directory, entry.name));
          continue;
        }
        if (!entry.isFile() || entry.name !== "tsconfig.json") {
          continue;
        }
        const configPath = relative(
          root,
          join(directory, entry.name),
        ).replaceAll("\\", "/");
        if (configPath !== "tsconfig.json") {
          projects.push(configPath);
        }
      }
    };

    visit(root);
    return projects.toSorted();
  }
  /**
   * next-env.d.ts imports .next-prod/types/routes.d.ts, which is a generated
   * file that references every route in the project → loads the entire source
   * tree when included. Strip it from targeted temp tsconfigs.
   */
  private static readonly HEAVY_DECLARATION_FILES: readonly string[] = [
    "next-env.d.ts",
  ];

  /**
   * Returns true for any include pattern that would pull in TypeScript source
   * files — either a glob sweep (e.g. "src/**\/*.ts") or an exact .ts/.tsx
   * filename (e.g. "check.config.ts") — or known heavy .d.ts files that
   * transitively import the entire project (e.g. next-env.d.ts → routes.d.ts).
   * We strip these from the temp tsconfig include list and put only the
   * requested targets in "files" instead.
   *
   * Kept: patterns ending in "*.d.ts" (ambient declaration globs — cheap)
   *       and exact .d.ts filenames that are NOT in the heavy list.
   */
  private static isSweepingSourcePattern(pattern: string): boolean {
    const normalized = pattern.replace(/\\/g, "/");
    const basename = normalized.split("/").at(-1) ?? normalized;

    // Known heavy declaration files that expand to the whole project
    if (TypecheckRepository.HEAVY_DECLARATION_FILES.includes(basename)) {
      return true;
    }
    // Declaration glob patterns are safe to keep (e.g. "types/**/*.d.ts")
    if (normalized.endsWith("*.d.ts")) {
      return false;
    }
    // Exact .d.ts filenames are safe (ambient type declarations, no impl)
    if (normalized.endsWith(".d.ts")) {
      return false;
    }
    // Glob patterns that end in *.ts or *.tsx sweep source files
    if (normalized.endsWith("*.ts") || normalized.endsWith("*.tsx")) {
      return true;
    }
    // Exact filenames ending in .ts or .tsx (e.g. "check.config.ts") also
    // pull in their full transitive dep graph — strip them too.
    if (normalized.endsWith(".ts") || normalized.endsWith(".tsx")) {
      return true;
    }
    return false;
  }

  /** TypeScript configuration Zod schema for runtime validation */
  private static readonly TsConfigSchema = z.object({
    extends: z.union([z.string(), z.array(z.string())]).optional(),
    compilerOptions: z
      .object({
        rootDir: z.string().optional(),
        paths: z.record(z.string(), z.array(z.string())).optional(),
        baseUrl: z.string().optional(),
        typeRoots: z.array(z.string()).optional(),
      })
      .catchall(z.unknown())
      .optional(),
    include: z.array(z.string()).optional(),
    exclude: z.array(z.string()).optional(),
  });

  /**
   * Run a shell command, streaming stdout/stderr into memory with NO fixed
   * buffer cap.
   *
   * `exec`/`execFile` allocate a single `maxBuffer` and throw
   * ERR_CHILD_PROCESS_STDIO_MAXBUFFER the instant output exceeds it — and the
   * thrown error carries only TRUNCATED output. tsgo/tsc emit far more than a
   * few MB on a large error cascade, so the old `maxBuffer: 10MB` exec silently
   * truncated, was misclassified as an "unexpected" error (its code is a string,
   * not exit code 1/2), and surfaced as a false "0 issues" pass. Streaming via
   * spawn accumulates the full output and reports the real exit code.
   */
  private static runStreaming(
    command: string,
    options: {
      cwd: string;
      timeoutMs: number;
      signal?: AbortSignal;
    },
  ): Promise<{
    stdout: string;
    stderr: string;
    code: number | null;
    timedOut: boolean;
  }> {
    return new Promise((resolve, reject) => {
      const child = spawn(command, {
        cwd: options.cwd,
        shell: true,
        signal: options.signal,
      });

      const stdoutChunks: Buffer[] = [];
      const stderrChunks: Buffer[] = [];
      let timedOut = false;

      const timer = setTimeout(() => {
        timedOut = true;
        child.kill("SIGTERM");
      }, options.timeoutMs);

      child.stdout?.on("data", (chunk: Buffer) => stdoutChunks.push(chunk));
      child.stderr?.on("data", (chunk: Buffer) => stderrChunks.push(chunk));

      child.on("error", (error) => {
        clearTimeout(timer);
        reject(error);
      });

      child.on("close", (code) => {
        clearTimeout(timer);
        resolve({
          stdout: Buffer.concat(stdoutChunks).toString("utf8"),
          stderr: Buffer.concat(stderrChunks).toString("utf8"),
          code,
          timedOut,
        });
      });
    });
  }
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
      return JSON.stringify(findTsgo(process.cwd()));
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
        // Global compiler/configuration diagnostics have no source path, but
        // they still apply to targeted checks and must never become a false
        // "0 issues" result.
        const globalMatch = line.trim().match(/^error\s+(TS\d+):\s*(.+)$/);
        errors.push({
          file: "tsconfig.json",
          ...(globalMatch?.[1] && { rule: globalMatch[1] }),
          severity: "error",
          message: globalMatch?.[2] ?? line.trim(),
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
    if (isAbsolute(path)) {
      return path; // Absolute paths don't need adjustment
    }
    if (path.startsWith("./")) {
      return `${prefix}${path.slice(2)}`;
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
   * Rebase path-like entries in compilerOptions.types for temporary configs.
   * Package names (for example "bun-types") remain unchanged, while explicit
   * paths must stay relative to the original project root.
   */
  private static adjustTypes(
    types: string[] | undefined,
    prefix: string,
  ): string[] | undefined {
    if (!types) {
      return undefined;
    }

    return types.map((typeName) =>
      typeName.startsWith(".") || typeName.startsWith("/")
        ? TypecheckRepository.adjustPath(typeName, prefix)
        : typeName,
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
   * Determine whether a filesToCheck entry is an exact file path or a glob.
   * Globs contain "*" or "?" characters; exact paths do not.
   */
  private static isGlobPattern(path: string): boolean {
    return path.includes("*") || path.includes("?");
  }

  /**
   * Create a temporary tsconfig.json for specific files.
   * Preserves compiler options and path mappings from main tsconfig
   * but limits files to improve performance.
   *
   * Key optimisation: source-sweeping patterns (src/**\/*.ts etc.) are stripped
   * from the base "include" list. Exact-path targets go into "files" (which tsgo
   * loads in isolation), while glob/folder targets stay in "include". This means
   * checking a leaf file no longer loads the entire project.
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

    // Strip source-sweeping patterns only when we have explicit targets.
    // When filesToCheck is empty (full-project NO_PATH case), we must keep
    // src/**/*.ts etc. — stripping them would leave nothing to check.
    const hasExplicitTargets = filesToCheck.length > 0;
    const declarationOnlyIncludes = (mainTsConfig.include ?? []).filter((p) =>
      hasExplicitTargets
        ? !TypecheckRepository.isSweepingSourcePattern(p)
        : true,
    );
    const adjustedDeclarationIncludes =
      TypecheckRepository.adjustIncludePatterns(
        declarationOnlyIncludes,
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
      // Extra excludes from non-extensive mode - passed as-is (relative to project root,
      // adjusted with prefix so they resolve correctly from the temp config location)
      ...(extraExcludePatterns ?? []).map((p) =>
        TypecheckRepository.adjustPath(p, prefix),
      ),
    ];
    const adjustedTypeRoots = TypecheckRepository.adjustTypeRoots(
      mainTsConfig.compilerOptions?.typeRoots,
      prefix,
    );
    const adjustedTypes = TypecheckRepository.adjustTypes(
      mainTsConfig.compilerOptions?.types as string[] | undefined,
      prefix,
    );
    const adjustedExtends = Array.isArray(mainTsConfig.extends)
      ? mainTsConfig.extends.map((configPath) =>
          TypecheckRepository.adjustPath(configPath, prefix),
        )
      : mainTsConfig.extends
        ? TypecheckRepository.adjustPath(mainTsConfig.extends, prefix)
        : undefined;
    // Ensure node_modules root is in typeRoots so packages like "bun-types"
    // (which live at node_modules/bun-types, not node_modules/@types/bun-types)
    // can be resolved when listed in compilerOptions.types.
    const nodeModulesRoot = `${prefix}node_modules`;
    if (adjustedTypeRoots && !adjustedTypeRoots.includes(nodeModulesRoot)) {
      adjustedTypeRoots.push(nodeModulesRoot);
    }

    // Split targets: exact file paths → "files" array (tsgo only loads those);
    // globs/folder patterns → "include" array (required for wildcards).
    const exactFiles = filesToCheck.filter(
      (p) => !TypecheckRepository.isGlobPattern(p),
    );
    const globIncludes = filesToCheck.filter((p) =>
      TypecheckRepository.isGlobPattern(p),
    );

    const adjustedExactFiles = TypecheckRepository.adjustFilePaths(
      exactFiles,
      prefix,
    );
    const adjustedGlobIncludes = TypecheckRepository.adjustIncludePatterns(
      globIncludes,
      prefix,
    );

    // Create temporary tsconfig
    const tempTsConfig: TsConfig = {
      ...mainTsConfig,
      extends: adjustedExtends,
      compilerOptions: {
        ...mainTsConfig.compilerOptions,
        rootDir: prefix.slice(0, -1), // Remove trailing slash for rootDir (e.g., "../..")
        baseUrl: undefined, // Remove baseUrl as tsgo doesn't support it
        typeRoots: adjustedTypeRoots,
        types: adjustedTypes,
        // Drop explicit "types" list when we have exact-file targets. The list (e.g.
        // ["bun-types"]) forces tsgo to look up named packages in typeRoots, but
        // node_modules is excluded so it fails. Without "types", tsgo auto-discovers
        // ambient declarations from typeRoots — bun-types is still found that way.
        ...(adjustedExactFiles.length > 0 && { types: undefined }),
        // Do not replace paths inherited through "extends" when the root
        // wrapper has no mappings of its own. Only synthesize the wildcard
        // when this config actually used baseUrl/path mappings.
        ...((mainTsConfig.compilerOptions?.baseUrl ||
          Object.keys(adjustedPaths).length > 0) && {
          paths: {
            ...adjustedPaths,
            "*": [`${prefix}*`],
          },
        }),
      },
      // "files" pins exact paths; tsgo won't expand them to the whole project.
      // Only set when there are exact paths to avoid an empty "files: []" which
      // tsgo treats as "no files at all".
      ...(adjustedExactFiles.length > 0 && {
        files: adjustedExactFiles,
      }),
      include: [...adjustedDeclarationIncludes, ...adjustedGlobIncludes],
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
      const useLspDaemon = useTsgo && (typecheckConfig.useLspDaemon ?? false);

      // ── LSP daemon fast-path ─────────────────────────────────────────
      if (useLspDaemon) {
        const tsgoPath = findTsgo(process.cwd());
        const pidPath = `${process.cwd()}/.tmp/tsgo-lsp.pid`;
        const daemon = TsgoDaemon.get(pidPath, tsgoPath, process.cwd());

        logger.debug("[TYPESCRIPT] Using LSP daemon for diagnostics");

        const filterTarget = Array.isArray(data.path) ? data.path : data.path;

        const lspIssues = await daemon.getDiagnostics(
          filterTarget,
          activeIgnorePatterns,
        );

        // Map LspIssue → TypecheckIssue (same shape, compatible)
        const issues: TypecheckIssue[] = lspIssues.map((i) => ({
          file: i.file,
          line: i.line,
          column: i.column,
          rule: i.rule,
          severity: i.severity,
          message: i.message,
        }));

        return success(
          TypecheckRepository.buildResponse(issues, effectiveData, isMCP),
        );
      }
      // ── end LSP daemon fast-path ─────────────────────────────────────

      // Get the appropriate base command
      const baseCommand = TypecheckRepository.getBaseCommand(useTsgo);

      logger.debug(
        `[TYPESCRIPT] Using ${useTsgo ? "tsgo" : "tsc"} for type checking`,
      );

      // Create TypeScript checking configuration
      config = createTypecheckConfig(data.path, typecheckConfig.cachePath);

      // Full workspace checks run each nested tsconfig independently. Targeted
      // checks continue to use a single temporary config.
      const workspaceResult = TypecheckRepository.buildWorkspaceCommands(
        baseCommand,
        config,
        typecheckConfig.cachePath,
        logger,
        locale,
        t,
        activeIgnorePatterns,
      );
      if (!workspaceResult.success) {
        return workspaceResult;
      }
      const buildResult = workspaceResult.data
        ? success(workspaceResult.data)
        : TypecheckRepository.buildCommand(
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

      const commands = Array.isArray(buildResult.data)
        ? buildResult.data
        : [buildResult.data];
      let combinedExitCode = 0;
      const concurrency = 4;
      for (let offset = 0; offset < commands.length; offset += concurrency) {
        const batch = commands.slice(offset, offset + concurrency);
        const results = await Promise.all(
          batch.map((command) => {
            logger.debug(`[TYPESCRIPT] Executing command: ${command}`);
            return TypecheckRepository.executeCommand(
              command,
              data.timeout,
              logger,
              t,
              signal,
            );
          }),
        );
        for (const execResult of results) {
          if (!execResult.success) {
            return fail({
              message: t("errors.internal.title"),
              errorType: ErrorResponseTypes.INTERNAL_ERROR,
              messageParams: {
                error: execResult.message || "Unknown error",
              },
            });
          }
          output += `${execResult.data.output}\n`;
          if (execResult.data.exitCode !== 0) {
            combinedExitCode = execResult.data.exitCode ?? 1;
          }
        }
      }

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

      if (combinedExitCode !== 0 && allIssues.length === 0) {
        // Target filtering can hide diagnostics from transitive dependencies.
        // A non-zero compiler exit must never render as a successful 0-issue
        // check, so surface those dependency diagnostics when they are the
        // reason the requested target could not be checked cleanly.
        const unfiltered = TypecheckRepository.parseTypecheckOutput(
          output,
          useTsgo,
          undefined,
          true,
        );
        const compilerIssues = [...unfiltered.errors, ...unfiltered.warnings];
        if (compilerIssues.length > 0) {
          return success(
            TypecheckRepository.buildResponse(
              compilerIssues,
              effectiveData,
              isMCP,
            ),
          );
        }

        const commandError =
          output.trim().split("\n")[0] ||
          "TypeScript exited without diagnostics";
        logger.error(`[TYPESCRIPT] Compiler failed: ${commandError}`);
        return success(
          TypecheckRepository.buildResponse(
            [
              {
                file: "tsconfig.json",
                severity: "error",
                message: commandError,
              },
            ],
            effectiveData,
            isMCP,
          ),
        );
      }

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
      const displayedFileNames = new Set(
        paginatedIssues.map((issue) => issue.file),
      );
      const fileStats = TypecheckRepository.buildFileStats(
        filteredIssues.filter((issue) => displayedFileNames.has(issue.file)),
      );
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
        // Empty filesToCheck - original tsconfig includes already cover the full project.
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
   * Build independent commands for a workspace with nested tsconfig projects.
   * The root command excludes directories owned by nested projects, preventing
   * their files from being interpreted with unrelated root compiler options.
   */
  private static buildWorkspaceCommands(
    baseCommand: string,
    config: TypecheckConfig,
    cachePath: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
    t: CheckTypecheckT,
    extraIgnorePatterns?: string[],
  ): ApiResponseType<string[] | null> {
    if (config.pathType !== PathType.NO_PATH) {
      return success(null);
    }

    const projects = TypecheckRepository.discoverNestedProjects(process.cwd());
    if (projects.length === 0) {
      return success(null);
    }

    const rootTempConfig = join(cachePath, "tsconfig.workspace-root.json");
    const rootBuildInfo = join(
      cachePath,
      "tsconfig.workspace-root.tsbuildinfo",
    );
    const nestedProjectDirectories = projects.map((project) =>
      dirname(project).replaceAll("\\", "/"),
    );
    const createRootResult = TypecheckRepository.createTempTsConfig(
      [],
      rootTempConfig,
      cachePath,
      locale,
      t,
      [...nestedProjectDirectories, ...(extraIgnorePatterns ?? [])],
    );
    if (!createRootResult.success) {
      return createRootResult;
    }

    logger.debug(
      `[TYPESCRIPT] Discovered ${projects.length} nested tsconfig projects`,
    );
    const commands = [
      TypecheckRepository.buildTypecheckCommand(
        baseCommand,
        rootBuildInfo,
        rootTempConfig,
      ),
      ...projects.map((project, index) =>
        TypecheckRepository.buildTypecheckCommand(
          baseCommand,
          join(cachePath, `tsconfig.workspace-${index}.tsbuildinfo`),
          project,
        ),
      ),
    ];
    return success(commands);
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
  ): Promise<ApiResponseType<{ output: string; exitCode: number | null }>> {
    try {
      if (signal?.aborted) {
        return fail({
          message: t("errors.aborted.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Stream output instead of buffering it (see runStreaming): tsc/tsgo can
      // emit far more than any fixed maxBuffer on a large error cascade.
      const result = await TypecheckRepository.runStreaming(command, {
        cwd: process.cwd(),
        timeoutMs: (timeout ?? 900) * 1000,
        signal,
      });

      const output = [result.stdout, result.stderr].filter(Boolean).join("\n");

      if (result.timedOut) {
        logger.error("[TYPESCRIPT] Command timed out");
        return fail({
          message: t("errors.internal.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: { error: "TypeScript check timed out" },
        });
      }

      // Exit code 0 = clean. 1/2 = type errors found, with diagnostics in
      // stdout. Either way the full output is parsed by the caller — no error
      // path swallows it (which is what produced the false "0 issues" pass).
      logger.debug(
        `[TYPESCRIPT] Command finished with exit code ${result.code ?? "null"}`,
      );
      return success({ output, exitCode: result.code });
    } catch (execError) {
      // Reaches here only for spawn-level failures (binary missing, aborted).
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
