/**
 * Run TypeScript type checking Repository
 * Handles run typescript type checking operations
 *
 * This repository supports both tsc and tsgo type checkers.
 * The choice is controlled by the `useTsgo` config option.
 */

import { spawn } from "node:child_process";
import type { Dirent } from "node:fs";
import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { z } from "zod";

import { coreEnv, getPackageRunner } from "../../../../core/env";
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
import type { CheckConfig } from "../../config/types";
import { checkEnv } from "../../env";
import {
  calculateFilteredSummary,
  filterIssues,
  matchesAnyGlob,
  parseFilters,
} from "../filter-utils";
import { parseJsonWithComments } from "../parse-json";
import { TsgoDaemon } from "./lsp-daemon";
import {
  createTypecheckConfig,
  getDisplayPath,
  PathType,
  resolvePathsToIncludes,
  shouldIncludeFile,
  type TypecheckConfig,
} from "./utils";
// ── Inline types (definition removed) ───────────────────────

export interface TypecheckIssue {
  file: string;
  line?: number;
  column?: number;
  rule?: string;
  severity: "error" | "warning" | "info";
  message: string;
}

export interface TypecheckRequestOutput {
  path?: string | string[];
  timeout: number;
  skipSorting?: boolean;
  disableFilter?: boolean;
  limit: number;
  page: number;
  summaryOnly: boolean;
  extensive?: boolean;
  filter?: string | string[];
  /** Force the repo's strict compilerOptions on any path, not just strictPaths. */
  strict?: boolean;
}

export interface TypecheckResponseOutput {
  editorUriSchema?: string;
  items?: TypecheckIssue[] | null;
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
  if (checkEnv.TSGO_PATH) {
    return checkEnv.TSGO_PATH;
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

function findProjectRoot(): string {
  let dir = process.cwd();
  for (let i = 0; i < 10; i++) {
    if (existsSync(resolve(dir, "tsconfig.json"))) {
      return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }
  return process.cwd();
}

/** Reduce a tsconfig include/target glob to its directory (POSIX, no trailing slash). */
function globToDir(glob: string): string {
  const posix = glob.replaceAll("\\", "/");
  const star = posix.search(/[*?]/);
  if (star === -1) {
    return posix.replace(/\/+$/, "");
  }
  // Check lastIndexOf for -1. A root-anchored include like `**\/*.ts` puts its
  // first wildcard at index 0, so there is no "/" before it and lastIndexOf
  // returns -1 — and `slice(0, -1)` does NOT mean "empty", it means "everything
  // but the last character", turning `**\/*.ts` into the literal `**\/*.t`.
  // clampGlobsToIncludes then finds no overlap with the real target, emits an
  // EMPTY `include`, and the typechecker compiles nothing and reports zero
  // errors. This repo's own includes are all dir-anchored ("src/**/*.ts"), so
  // it never fired here — but it did downstream, where directory-scoped checks
  // silently passed while the same file failed at file scope.
  const lastSlash = posix.lastIndexOf("/", star);
  const cut = lastSlash === -1 ? "" : posix.slice(0, lastSlash);
  return cut.replace(/\/+$/, "");
}

/**
 * Whether `child` is the same directory as `parent` or nested under it.
 *
 * `parent === ""` is the project root, and everything is under the project
 * root. Without that case the `${parent}/` template builds the prefix "/",
 * which no project-relative path ever starts with.
 */
function isPathUnderOrEqual(child: string, parent: string): boolean {
  return parent === "" || child === parent || child.startsWith(`${parent}/`);
}

/**
 * The tsconfig.json that OWNS `target` — the nearest one at or above it, never
 * above the project root. Null when nothing does.
 */
function findOwningTsconfig(target: string): string | null {
  const root = resolve(findProjectRoot());
  let dir = resolve(target);
  if (existsSync(dir) && statSync(dir).isFile()) {
    dir = dirname(dir);
  }
  for (;;) {
    const candidate = resolve(dir, "tsconfig.json");
    if (existsSync(candidate)) {
      return candidate;
    }
    if (dir === root) {
      return null;
    }
    const parent = dirname(dir);
    if (parent === dir) {
      return null;
    }
    dir = parent;
  }
}

/**
 * The single tsconfig owning ALL of `targets`, or null when they disagree.
 *
 * Disagreement means the run spans projects (`vibe check apps/a apps/b`) and no
 * one config can describe both, so the caller falls back to the root — the
 * behaviour that existed before ownership was considered.
 */
function findSharedOwningTsconfig(targets: string[]): string | null {
  const owners = new Set(
    targets.map((target) => findOwningTsconfig(target) ?? ""),
  );
  if (owners.size !== 1) {
    return null;
  }
  const [only] = [...owners];
  return only === "" ? null : only;
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
    "vibe-minimal-env",
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
    signal: NodeJS.Signals | null;
    timedOut: boolean;
  }> {
    return new Promise((_resolve, reject) => {
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

      // The signal matters as much as the code: an OOM-killed child reports
      // code `null` + SIGKILL, and dropping the signal makes that
      // indistinguishable from a clean finish once the code is normalized away.
      child.on("close", (code, signal) => {
        clearTimeout(timer);
        _resolve({
          stdout: Buffer.concat(stdoutChunks).toString("utf8"),
          stderr: Buffer.concat(stderrChunks).toString("utf8"),
          code,
          signal,
          timedOut,
        });
      });
    });
  }

  /**
   * Crash signatures that mean the typechecker DIED rather than finished.
   *
   * The distinction is the whole point: a typechecker that finds no errors and a
   * typechecker that never got far enough to look both produce empty
   * diagnostics, and the second one must never be reported as a pass. This has
   * happened — an out-of-memory abort printed `✓ TypeScript 0 issues`, which is
   * the most dangerous output this tool can produce, because a green check is
   * exactly when nobody looks closer.
   *
   * Both runtimes are represented. tsgo is Go, so it aborts with `fatal error:`
   * / `panic:` and a goroutine dump; tsc is Node, which dies with
   * `FATAL ERROR: ... heap out of memory`. Windows adds its own OOM exit status.
   */
  private static readonly CRASH_SIGNATURES = [
    // Go (tsgo)
    /fatal error:\s*runtime:/i,
    /runtime:\s*out of memory/i,
    /cannot allocate memory/i,
    /^panic:/im,
    /^fatal error:/im,
    // Node (tsc)
    /JavaScript heap out of memory/i,
    /FATAL ERROR:.*(heap|allocation)/i,
    /Reached heap limit/i,
    // Generic
    /std::bad_alloc/i,
    /Killed process/i,
  ];

  /**
   * Why this run cannot be trusted, or null if it can.
   *
   * Exit codes are NOT sufficient on their own — tsc uses 1 and 2 for "found
   * type errors", which is a successful run — so this looks at how the process
   * died, not just what it returned.
   */
  private static diagnoseCrash(result: {
    stdout: string;
    stderr: string;
    code: number | null;
    signal: NodeJS.Signals | null;
  }): string | null {
    const combined = `${result.stderr}\n${result.stdout}`;
    const hit = TypecheckRepository.CRASH_SIGNATURES.find((re) =>
      re.test(combined),
    );
    if (hit) {
      // The first crash line is the useful one; a goroutine dump is not.
      const line = combined
        .split("\n")
        .find((l) => hit.test(l))
        ?.trim();
      return `the typechecker crashed instead of finishing${line ? `: ${line}` : ""}`;
    }

    if (result.signal !== null) {
      const oom =
        result.signal === "SIGKILL" ? " (typically the OOM killer)" : "";
      return `the typechecker was killed by ${result.signal}${oom} without exiting`;
    }

    // 0 = clean, 1/2 = diagnostics emitted. Anything else is the process
    // failing to run at all: a missing binary, a bad tsconfig, a native abort.
    if (result.code !== null && result.code > 2) {
      return `the typechecker exited with status ${result.code}, which means it failed to run rather than found errors`;
    }

    return null;
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
    const runner = getPackageRunner(coreEnv.PACKAGE_MANAGER);
    const invocation = [runner.command, ...runner.args, "tsc"].join(" ");
    // tsc needs increased memory for large projects
    return `NODE_OPTIONS="--max-old-space-size=32768" ${invocation}`;
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
    cachePath: string,
  ): string[] | undefined {
    if (!types) {
      return undefined;
    }

    return types.map((typeName) => {
      if (typeName.startsWith(".") || typeName.startsWith("/")) {
        return TypecheckRepository.adjustPath(typeName, prefix);
      }

      // A bare name like "vite-plugin-svgr/client" is resolved by walking
      // node_modules up from the config that DECLARED it. This config lives in
      // the cache dir, so that walk starts at the repo root and never reaches a
      // nested project's node_modules — the entry then fails with TS2688. It is
      // the one value `prefix` alone cannot fix, because the anchor is the
      // file's location rather than anything written inside it.
      //
      // So resolve it here instead and write the answer as a path. The
      // alternative — listing the owner's bare node_modules in typeRoots — makes
      // every package there an auto-included type package and silently masks
      // real module errors.
      // Probe the PACKAGE, not the entry: "vite-plugin-svgr/client" names a
      // subpath inside the package, and only "vite-plugin-svgr" is a directory.
      const segments = typeName.split("/");
      const packageName = typeName.startsWith("@")
        ? segments.slice(0, 2).join("/")
        : segments[0];
      const packageDir = `${prefix}node_modules/${packageName}`;
      return existsSync(resolve(cachePath, packageDir))
        ? `${prefix}node_modules/${typeName}`
        : typeName;
    });
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
   * Intersect folder/glob targets with the owning project's `include`, so a
   * scoped check compiles the same file set `tsgo -p <project>` would.
   *
   * Both sides reduce to directories (globs stripped of their `*` suffix); the
   * result is the narrower of each overlapping pair, re-expanded to a glob. A
   * target under an include root stays as the target; the project root as a
   * target expands to the include roots; disjoint pairs drop out (a folder the
   * project does not include yields nothing, exactly as `tsgo -p` sees it).
   *
   * `targets` are project-root-relative; `baseIncludes` are owner-relative and
   * rebased through `ownerDir`. When the project declares no `include`, targets
   * pass through unchanged.
   */
  private static clampGlobsToIncludes(
    targets: string[],
    baseIncludes: string[] | undefined,
    ownerDir: string,
  ): string[] {
    if (!baseIncludes || baseIncludes.length === 0) {
      return targets;
    }
    // Include roots as project-root-relative dirs.
    const includeDirs = baseIncludes.map((inc) => {
      const dir = globToDir(inc);
      const rebased = ownerDir ? `${ownerDir}/${dir}` : dir;
      return rebased.replace(/\/+$/, "");
    });
    const targetDirs = targets.map(globToDir);

    const result = new Set<string>();
    for (const target of targetDirs) {
      for (const inc of includeDirs) {
        if (isPathUnderOrEqual(target, inc)) {
          result.add(target); // target is the narrower (or equal)
        } else if (isPathUnderOrEqual(inc, target)) {
          result.add(inc); // include root is the narrower
        }
      }
    }
    return [...result].map((dir) => (dir === "" ? "**/*" : `${dir}/**/*`));
  }

  /**
   * Directories never worth walking for ambient declarations, and generated
   * .d.ts that transitively reference the whole project (next-env.d.ts pulls in
   * .next-prod/types/routes.d.ts, which names every route, so including it
   * loads the entire source tree).
   */
  private static readonly AMBIENT_SKIP_DIRS = new Set([
    "node_modules",
    ".git",
    ".tmp",
    "dist",
    "build",
    "bin",
    ".next",
    ".next-prod",
    "coverage",
    "out",
  ]);
  private static readonly HEAVY_DECLARATION_FILES = new Set(["next-env.d.ts"]);

  /**
   * The declaration-only entries of a base config's `include`, to be carried
   * into a scoped config's own `include`.
   *
   * Setting `include` overrides the base's rather than merging with it, which
   * also discards the ambient declarations the base listed there — and those
   * are not optional. This repo's root config includes `nativewind-env.d.ts`,
   * which augments every react-native component with `className`; without it a
   * scoped check reported 80 errors in src/vibe/ui/native that
   * `tsgo -p tsconfig.json` does not have. `collectAmbientDeclarations` cannot
   * cover this: it is skipped when the owning config IS the root, precisely the
   * case here.
   *
   * Kept: `*.d.ts` globs and exact `.d.ts` filenames. Dropped: source sweeps
   * (the whole point of scoping) and heavy generated declarations that pull the
   * entire project back in.
   */
  private static declarationOnlyIncludes(
    includes: string[] | undefined,
  ): string[] {
    return (includes ?? []).filter((pattern) => {
      const normalized = pattern.replaceAll("\\", "/");
      const basename = normalized.split("/").at(-1) ?? normalized;
      if (TypecheckRepository.HEAVY_DECLARATION_FILES.has(basename)) {
        return false;
      }
      return normalized.endsWith(".d.ts");
    });
  }

  /**
   * Deepest directory containing all `targets`, POSIX form. Glob suffixes are
   * reduced to their directory, exact files to their dirname. Used to bound the
   * ambient-declaration search on the root fallback so a single-file check never
   * walks the whole repo.
   */
  private static commonAncestorDir(
    targets: string[],
    projectRoot: string,
  ): string {
    const dirOf = (target: string): string => {
      const posix = target.replaceAll("\\", "/");
      const globAt = posix.search(/[*?]/);
      const withoutGlob =
        globAt === -1 ? posix : posix.slice(0, posix.lastIndexOf("/", globAt));
      const abs = resolve(projectRoot, withoutGlob);
      return existsSync(abs) && statSync(abs).isFile() ? dirname(abs) : abs;
    };
    const segmentLists = targets.map((target) =>
      dirOf(target).replaceAll("\\", "/").split("/"),
    );
    if (segmentLists.length === 0) {
      return projectRoot;
    }
    const [first, ...rest] = segmentLists;
    const common: string[] = [];
    for (let index = 0; index < first.length; index++) {
      const segment = first[index];
      if (!rest.every((list) => list[index] === segment)) {
        break;
      }
      common.push(segment);
    }
    return common.join("/") || projectRoot;
  }

  /**
   * Collect the owning project's ambient declaration files (`*.d.ts`), returned
   * project-root-relative in POSIX form.
   *
   * When the program is scoped to explicit targets, the source sweep that would
   * otherwise load these is gone — but they carry global augmentations (module
   * shims for asset imports, `declare global`, framework globals) the target may
   * depend on, so they are added back to `files`. Bounded by skipping heavy
   * generated declarations and non-source directories.
   */
  private static collectAmbientDeclarations(
    projectDir: string,
    projectRoot: string,
  ): string[] {
    const results: string[] = [];
    const walk = (dir: string): void => {
      let entries: Dirent[];
      try {
        entries = readdirSync(dir, { withFileTypes: true });
      } catch {
        // Unreadable directory (permissions, race with a build): ambient
        // declarations are additive, so skipping one is safe.
        return;
      }
      for (const entry of entries) {
        if (entry.isDirectory()) {
          if (!TypecheckRepository.AMBIENT_SKIP_DIRS.has(entry.name)) {
            walk(join(dir, entry.name));
          }
        } else if (
          entry.name.endsWith(".d.ts") &&
          !TypecheckRepository.HEAVY_DECLARATION_FILES.has(entry.name)
        ) {
          results.push(
            relative(projectRoot, join(dir, entry.name)).replaceAll("\\", "/"),
          );
        }
      }
    };
    walk(projectDir);
    return results;
  }

  /**
   * Create a temporary tsconfig.json for specific files.
   *
   * The config EXTENDS whatever tsconfig owns the files (so paths/baseUrl/types
   * resolve against the project, not the cache dir). With explicit targets it
   * sets `files`/`include` to scope the program to those targets plus their
   * transitive imports and the project's ambient .d.ts; with none it inherits
   * the project's own include. Only location-anchored values (typeRoots,
   * path-rebased types) and the repo's enforced compilerOptions are forced on
   * top.
   */
  private static createTempTsConfig(
    filesToCheck: string[],
    tempConfigPath: string,
    cachePath: string,
    extraExcludePatterns?: string[],
    enforcedOptions?: Record<string, boolean | string | string[]>,
    /**
     * The tsconfig to extend, when the caller already knows it. A workspace run
     * checks each nested project as itself — there are no `filesToCheck` to
     * infer an owner from, and inferring would land on the root config.
     */
    owningTsconfigOverride?: string,
  ): ApiResponseType<void> {
    // Read and validate the tsconfig that OWNS these files.
    //
    // Not always the root's. A nested project declares its own `paths`, so
    // checking it against the root config invents TS2307s for imports that
    // resolve perfectly well. Falls back to the root when the targets span
    // projects or none owns them.
    const projectRoot = findProjectRoot();
    // A real sub-project owner, if one exists; null means the targets span
    // projects (or live under a dir with no tsconfig) and we fall back to root.
    const sharedOwner =
      owningTsconfigOverride ?? findSharedOwningTsconfig(filesToCheck);
    const owningTsconfig = sharedOwner ?? resolve(projectRoot, "tsconfig.json");
    const tsConfigContent = readFileSync(owningTsconfig, "utf8");

    // Two prefixes, and the difference is load-bearing.
    //
    // `rootPrefix` reaches the project root; `prefix` reaches the owning config.
    // Everything INHERITED from that config (paths, include, typeRoots) is
    // relative to ITS directory, while the targets the caller passed in are
    // relative to the project root. Rebasing either with the other's prefix
    // silently aims it at a directory that does not exist — and a tsconfig that
    // resolves nothing fails by checking nothing, not by complaining.
    const rootPrefix = TypecheckRepository.getRelativePrefix(cachePath);
    const ownerDir = relative(projectRoot, dirname(owningTsconfig)).replaceAll(
      "\\",
      "/",
    );
    const prefix = `${rootPrefix}${ownerDir ? `${ownerDir}/` : ""}`;
    const parsedJsonResult = parseJsonWithComments(tsConfigContent);
    if (!parsedJsonResult.success) {
      return failInline({
        message: "Failed to parse tsconfig",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
    const mainTsConfig = TypecheckRepository.TsConfigSchema.parse(
      parsedJsonResult.data,
    ) as TsConfig;

    const adjustedExcludes = [
      ...TypecheckRepository.adjustExcludePatterns(
        mainTsConfig.exclude,
        prefix,
      ),
      // Extra excludes from non-extensive mode — project-root relative like the
      // targets, so rootPrefix rather than the owning config's prefix.
      ...(extraExcludePatterns ?? []).map((p) =>
        TypecheckRepository.adjustPath(p, rootPrefix),
      ),
    ];
    const existingTypeRoots = TypecheckRepository.adjustTypeRoots(
      mainTsConfig.compilerOptions?.typeRoots,
      prefix,
    );
    const adjustedTypes = TypecheckRepository.adjustTypes(
      mainTsConfig.compilerOptions?.types as string[] | undefined,
      prefix,
      cachePath,
    );
    // typeRoots must always be spelled out, and must point at the OWNING
    // project's node_modules.
    //
    // The temp config lives in the cache dir, so TypeScript's default lookup
    // ("./node_modules/@types" upward from the config) starts in the wrong place
    // — and a config whose `types` cannot resolve does not merely warn: tsgo
    // reports the one TS2688 and type-checks NOTHING, which reads as a clean
    // pass. This was previously only appended when the base config already had
    // typeRoots, so a nested project without one checked nothing at all.
    //
    // The default mirrors TypeScript's own lookup, which walks
    // `node_modules/@types` UPWARD from the containing directory — so a nested
    // project sees both its own deps and the hoisted ones at the root. Listing
    // only the owner's would be narrower than stock tsc and make the checker
    // disagree with `tsgo -p <project>` about which errors exist.
    //
    // The owning project contributes its `@types` ONLY — never its bare
    // node_modules. A bare node_modules typeRoot makes TypeScript treat every
    // package inside it as an auto-included type package, which pulls their
    // declarations in globally and *masks* real module errors.
    const adjustedTypeRoots = existingTypeRoots ?? [
      ...(prefix === rootPrefix ? [] : [`${prefix}node_modules/@types`]),
      `${rootPrefix}node_modules/@types`,
    ];
    // Bare package types (e.g. "bun-types" at node_modules/bun-types rather than
    // node_modules/@types/bun-types) resolve from the ROOT's node_modules, which
    // is where hoisted deps live — this is what stops the @types-only shape from
    // failing with TS2688.
    const nodeModulesRoot = `${rootPrefix}node_modules`;
    if (!adjustedTypeRoots.includes(nodeModulesRoot)) {
      adjustedTypeRoots.push(nodeModulesRoot);
    }

    // Scope the program to the requested targets instead of the whole project.
    //
    // `extends` alone inherits the owning project's `include`, so checking one
    // file compiled every file the project owns — thousands of diagnostics, all
    // but the target's then thrown away by the result filter. Correct, but it
    // did the whole project's work for one file.
    //
    // Setting `files`/`include` here OVERRIDES the base's `include` (TypeScript
    // does not merge them across `extends`), so the source sweep stops. `files`
    // pulls in exactly the named targets and — via TypeScript — their transitive
    // imports, which is a complete program for those files. Folder/glob targets
    // go to `include`. Ambient declarations are re-added below, because dropping
    // the sweep also drops the project's global .d.ts (module shims for assets,
    // `declare global`, test globals) that the target may rely on.
    const hasExplicitTargets = filesToCheck.length > 0;
    const exactFileTargets = filesToCheck.filter(
      (p) => !TypecheckRepository.isGlobPattern(p),
    );
    const globTargets = filesToCheck.filter((p) =>
      TypecheckRepository.isGlobPattern(p),
    );
    // Where to look for ambient .d.ts. A real sub-project owner defines its
    // globals project-wide (its src/*.d.ts sits above any single target), so
    // search from its directory. On the root fallback there is no project-global
    // concept — search only the targets' common ancestor, and if that resolves
    // to the repo root, skip ambient entirely rather than walk the whole
    // workspace (which would drag in every nested project's compiled .d.ts).
    const ambientRoot = sharedOwner
      ? dirname(sharedOwner)
      : TypecheckRepository.commonAncestorDir(filesToCheck, projectRoot);
    const ambientDeclarations =
      hasExplicitTargets && resolve(ambientRoot) !== resolve(projectRoot)
        ? TypecheckRepository.collectAmbientDeclarations(
            ambientRoot,
            projectRoot,
          )
        : [];
    // rootPrefix, not prefix: targets are already relative to the project root.
    const scopedFiles = hasExplicitTargets
      ? [
          ...exactFileTargets.map((p) =>
            TypecheckRepository.adjustPath(p, rootPrefix),
          ),
          ...ambientDeclarations.map((p) =>
            TypecheckRepository.adjustPath(p, rootPrefix),
          ),
        ]
      : [];
    // Clamp folder/glob targets to the project's own include roots, so checking
    // a whole project dir sees exactly what `tsgo -p <project>` sees. Raw, the
    // glob `<project>/**/*` drags in root-level files the project's own
    // `include` deliberately leaves out and reports errors the project itself
    // never has. The intersection keeps the narrower of the two, so a sub-folder
    // stays scoped and the project root expands to the project's own include.
    const scopedIncludes = [
      ...TypecheckRepository.clampGlobsToIncludes(
        globTargets,
        mainTsConfig.include,
        ownerDir,
      ).map((p) => TypecheckRepository.adjustPath(p, rootPrefix)),
      // The base's own ambient declarations, which overriding `include` would
      // otherwise drop. Owner-relative, so `prefix` rather than `rootPrefix`.
      ...TypecheckRepository.declarationOnlyIncludes(mainTsConfig.include).map(
        (p) => TypecheckRepository.adjustPath(p, prefix),
      ),
    ];

    // EXTEND the owning tsconfig; do not copy it.
    //
    // Copying meant rebasing every relative value by hand, and one of them
    // cannot be rebased at all: a bare `types: ["vite-plugin-svgr/client"]`
    // entry resolves through node resolution anchored at the config file that
    // DECLARED it. From this temp config in the cache dir that walk starts at
    // the repo root and never sees the project's own node_modules, so the entry
    // failed with TS2688 — and the only way to satisfy it, listing the owner's
    // bare node_modules in typeRoots, made every package there an auto-included
    // type package and silently masked real errors (a genuine TS2307 for a
    // missing module disappeared).
    //
    // `extends` sidesteps the whole class: TypeScript resolves the base's
    // `paths`, `baseUrl` and `types` relative to the BASE file, which is exactly
    // what the project's own tsconfig means.
    const tempTsConfig: TsConfig = {
      extends: relative(dirname(tempConfigPath), owningTsconfig).replaceAll(
        "\\",
        "/",
      ),
      compilerOptions: {
        // Both of these are location-anchored, so `extends` cannot carry them:
        // an inherited default is still resolved from THIS file's directory.
        typeRoots: adjustedTypeRoots,
        ...(adjustedTypes ? { types: adjustedTypes } : {}),
        // Last, so a project cannot opt out of what the repo enforces.
        ...enforcedOptions,
      },
      // With explicit targets, scope to them (files + their imports + the
      // project's ambient .d.ts); otherwise inherit the project's own include.
      //
      // `include` must be set explicitly — even to []. `extends` overwrites
      // include only when the derived config declares one; setting `files`
      // alone leaves the base's sweeping `include` in force, and the whole
      // project compiles anyway. An empty include is what turns the sweep off.
      ...(hasExplicitTargets
        ? { files: scopedFiles, include: scopedIncludes }
        : {}),
      ...(adjustedExcludes.length > 0 && { exclude: adjustedExcludes }),
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
        disableFilter: data.disableFilter ?? false,
      };

      // Compute active ignore patterns:
      // - ignorePatterns: always applied (e.g. test-project, generated dirs)
      // - nonExtensiveIgnorePatterns: only in non-extensive mode (e.g. *.test.ts)
      const isExtensive = data.extensive ?? defaults.extensive ?? false;
      const alwaysIgnore = checkConfig.typecheck.enabled
        ? (checkConfig.typecheck.ignorePatterns ?? [])
        : [];
      const conditionalIgnore =
        !isExtensive && checkConfig.typecheck.enabled
          ? (checkConfig.typecheck.nonExtensiveIgnorePatterns ?? [])
          : [];
      const activeIgnorePatterns =
        alwaysIgnore.length > 0 || conditionalIgnore.length > 0
          ? [...alwaysIgnore, ...conditionalIgnore]
          : undefined;

      // Check if typecheck is enabled
      if (!checkConfig.typecheck.enabled) {
        logger.info("Typecheck is disabled in check.config.ts");
        return success({
          items: [],
          files: [],
          totalIssues: 0,
          totalFiles: 0,
        });
      }

      const typecheckConfig = checkConfig.typecheck;
      const useTsgo = typecheckConfig.useTsgo ?? false;
      const useLspDaemon = useTsgo && (typecheckConfig.useLspDaemon ?? false);

      // ── LSP daemon fast-path ─────────────────────────────────────────
      if (useLspDaemon) {
        const projectRoot = findProjectRoot();
        const tsgoPath = findTsgo(projectRoot);
        const pidPath = `${projectRoot}/.tmp/tsgo-lsp.pid`;
        const daemon = TsgoDaemon.get(pidPath, tsgoPath, projectRoot);

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
        checkConfig,
        data.strict ?? false,
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
            activeIgnorePatterns,
            TypecheckRepository.resolveEnforcedOptions(
              [
                ...(config.targetPath ? [config.targetPath] : []),
                ...(config.targetPaths ?? []),
              ],
              typecheckConfig,
              checkConfig,
              data.strict ?? false,
            ),
          );

      if (!buildResult.success) {
        return buildResult;
      }

      if (!buildResult.data) {
        return failInline({
          message: "No TypeScript files found - none match the specified paths",
          errorType: ErrorResponseTypes.NOT_FOUND,
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
              signal,
            );
          }),
        );
        for (const execResult of results) {
          if (!execResult.success) {
            return failInline({
              message: `TypeScript check failed: ${execResult.message || "Unknown error"}`,
              errorType: ErrorResponseTypes.INTERNAL_ERROR,
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
        // The compiler always sees more than the requested path: transitive
        // imports get compiled too, so a dependency's own errors exit non-zero
        // while the target itself is clean.
        //
        // Neither obvious answer is right. Adopting those diagnostics blames
        // this path for code it does not own and makes a scoped check unusable;
        // dropping them turns a failed compile into a green "0 issues". So do
        // neither — fail the run explicitly, and name the files that actually
        // hold the errors so the next check can be aimed at them.
        const unfiltered = TypecheckRepository.parseTypecheckOutput(
          output,
          useTsgo,
          undefined,
          true,
        );
        const outOfScope = [...unfiltered.errors, ...unfiltered.warnings];
        if (outOfScope.length > 0) {
          const files = [...new Set(outOfScope.map((issue) => issue.file))];
          // Cap the list: a broken shared dependency can implicate hundreds of
          // files, and the first few already identify where to look.
          const shown = files.slice(0, 10);
          const remainder =
            files.length > shown.length
              ? ` and ${files.length - shown.length} more`
              : "";
          logger.error(
            `[TYPESCRIPT] ${outOfScope.length} diagnostic(s) outside the requested path: ${files.join(", ")}`,
          );
          return failInline({
            message: `TypeScript compilation failed outside the checked path. The requested path is clean, but ${outOfScope.length} diagnostic(s) in its dependencies stopped the compile — they belong to those files, not this one. Re-run the check against: ${shown.join(", ")}${remainder}`,
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
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
   * The compilerOptions to force for THIS run.
   *
   * `compilerOptions` always; `strictCompilerOptions` only when the target sits
   * inside oxlint.strictPaths, or strict was requested. A compilerOption is a
   * property of the whole program, so unlike a lint rule it cannot be filtered
   * per file after the fact — the decision has to happen here, from the path
   * being checked.
   */
  private static resolveEnforcedOptions(
    targets: string[],
    typecheckConfig: {
      compilerOptions?: Record<string, boolean | string | string[]>;
      strictCompilerOptions?: Record<string, boolean | string | string[]>;
    },
    checkConfig: CheckConfig,
    strict: boolean,
  ): Record<string, boolean | string | string[]> {
    const base = typecheckConfig.compilerOptions ?? {};
    const strictOnly = typecheckConfig.strictCompilerOptions ?? {};
    if (Object.keys(strictOnly).length === 0) {
      return base;
    }
    if (strict) {
      return { ...base, ...strictOnly };
    }

    const strictPaths = checkConfig.oxlint.enabled
      ? checkConfig.oxlint.strictPaths
      : undefined;
    if (!strictPaths || targets.length === 0) {
      return base;
    }

    // Every target must be strict, not just one of them. A single program gets a
    // single answer, so a mixed target list has to take the lenient one — else
    // checking a strict tree alongside a lenient one would hold the lenient one
    // to rules it never opted into.
    const allStrict = targets.every(
      (target) =>
        matchesAnyGlob(target, strictPaths.include) &&
        !matchesAnyGlob(target, strictPaths.exclude ?? []),
    );
    return allStrict ? { ...base, ...strictOnly } : base;
  }

  /**
   * Build the typecheck command based on path type.
   */
  private static buildCommand(
    baseCommand: string,
    config: TypecheckConfig,
    cachePath: string,
    logger: EndpointLogger,
    extraIgnorePatterns?: string[],
    enforcedOptions?: Record<string, boolean | string | string[]>,
  ): ApiResponseType<string | null> {
    if (config.pathType === PathType.NO_PATH) {
      // No specific path provided, check entire project.
      // When extra ignore patterns are present we need a temp config to carry the excludes —
      // tsconfig.json itself is never modified.
      if (extraIgnorePatterns && extraIgnorePatterns.length > 0) {
        const tempConfigFile = join(
          cachePath,
          `tsconfig.${config.cacheKey}.json`,
        );
        const tempBuildInfoFile = join(
          cachePath,
          `tsconfig.${config.cacheKey}.tsbuildinfo`,
        );
        logger.debug(
          "[TYPESCRIPT] Creating temp tsconfig for full project with extra excludes",
        );
        // Empty filesToCheck - original tsconfig includes already cover the full project.
        // The temp config just carries the extra excludes on top of those.
        const createResult = TypecheckRepository.createTempTsConfig(
          [],
          tempConfigFile,
          cachePath,
          extraIgnorePatterns,
          enforcedOptions,
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
          resolve(findProjectRoot(), "tsconfig.json"),
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
        extraIgnorePatterns,
        enforcedOptions,
      );
    } else if (config.pathType === PathType.MULTIPLE_PATHS) {
      // Multiple paths - combine all into one tsconfig
      const includes = resolvePathsToIncludes(config.targetPaths ?? []);
      createResult = TypecheckRepository.createTempTsConfig(
        includes,
        config.tempConfigFile,
        cachePath,
        extraIgnorePatterns,
        enforcedOptions,
      );
    } else {
      // Folder - resolvePathsToIncludes normalises to POSIX; a raw Windows path
      // with backslashes would match nothing and silently widen the check.
      const folderPath = config.targetPath || ".";
      createResult = TypecheckRepository.createTempTsConfig(
        resolvePathsToIncludes([folderPath]),
        config.tempConfigFile,
        cachePath,
        extraIgnorePatterns,
        enforcedOptions,
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
    checkConfig: CheckConfig,
    strict: boolean,
    extraIgnorePatterns?: string[],
  ): ApiResponseType<string[] | null> {
    if (config.pathType !== PathType.NO_PATH) {
      return success(null);
    }

    const allProjects =
      TypecheckRepository.discoverNestedProjects(findProjectRoot());
    // Filter out nested projects that match any of the active ignore patterns
    // (e.g. "**/test-project/**" from the shared ignore list).
    const ignoreRegexes = parseFilters(extraIgnorePatterns);
    const projects =
      ignoreRegexes.length === 0
        ? allProjects
        : allProjects.filter((p) => !ignoreRegexes.some((rx) => rx.test(p)));

    // ALL discovered project dirs must be excluded from the root tsconfig —
    // even projects filtered from independent runs must not be picked up by root.
    const allProjectDirectories = allProjects.map((project) =>
      dirname(project).replaceAll("\\", "/"),
    );

    // If no projects remain after filtering (e.g. only test-projects exist),
    // still create a root tsconfig that excludes those directories, then stop.
    if (projects.length === 0) {
      if (allProjectDirectories.length === 0) {
        return success(null);
      }
      const rootTempConfig = join(cachePath, "tsconfig.workspace-root.json");
      const rootBuildInfo = join(
        cachePath,
        "tsconfig.workspace-root.tsbuildinfo",
      );
      const createRootResult = TypecheckRepository.createTempTsConfig(
        [],
        rootTempConfig,
        cachePath,
        [...allProjectDirectories, ...(extraIgnorePatterns ?? [])],
      );
      if (!createRootResult.success) {
        return createRootResult;
      }
      return success([
        TypecheckRepository.buildTypecheckCommand(
          baseCommand,
          rootBuildInfo,
          rootTempConfig,
        ),
      ]);
    }

    const rootTempConfig = join(cachePath, "tsconfig.workspace-root.json");
    const rootBuildInfo = join(
      cachePath,
      "tsconfig.workspace-root.tsbuildinfo",
    );
    const createRootResult = TypecheckRepository.createTempTsConfig(
      [],
      rootTempConfig,
      cachePath,
      [...allProjectDirectories, ...(extraIgnorePatterns ?? [])],
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
    ];

    // Each nested project is checked through a temp config that extends it,
    // rather than by pointing at it directly. Extending is what lets the repo's
    // enforced compilerOptions sit on top: a project that sets
    // `noImplicitAny: false` would otherwise opt itself out of the very check
    // being run, and a workspace run would report it clean.
    for (const [index, project] of projects.entries()) {
      const projectDir = relative(
        findProjectRoot(),
        dirname(project),
      ).replaceAll("\\", "/");
      const projectTempConfig = join(
        cachePath,
        `tsconfig.workspace-${index}.json`,
      );
      const createResult = TypecheckRepository.createTempTsConfig(
        [],
        projectTempConfig,
        cachePath,
        undefined,
        TypecheckRepository.resolveEnforcedOptions(
          [projectDir],
          checkConfig.typecheck.enabled ? checkConfig.typecheck : {},
          checkConfig,
          strict,
        ),
        project,
      );
      if (!createResult.success) {
        return createResult;
      }
      commands.push(
        TypecheckRepository.buildTypecheckCommand(
          baseCommand,
          join(cachePath, `tsconfig.workspace-${index}.tsbuildinfo`),
          projectTempConfig,
        ),
      );
    }
    return success(commands);
  }

  /**
   * Execute the typecheck command.
   */
  private static async executeCommand(
    command: string,
    timeout: number | undefined,
    logger: EndpointLogger,
    signal?: AbortSignal,
  ): Promise<ApiResponseType<{ output: string; exitCode: number | null }>> {
    try {
      if (signal?.aborted) {
        return failInline({
          message: "Check aborted",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Stream output instead of buffering it (see runStreaming): tsc/tsgo can
      // emit far more than any fixed maxBuffer on a large error cascade.
      const result = await TypecheckRepository.runStreaming(command, {
        cwd: findProjectRoot(),
        timeoutMs: (timeout ?? 900) * 1000,
        signal,
      });

      const output = [result.stdout, result.stderr].filter(Boolean).join("\n");

      if (result.timedOut) {
        logger.error("[TYPESCRIPT] Command timed out");
        return failInline({
          message: `TypeScript check timed out after ${timeout ?? 900}s — no result, NOT a pass`,
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // A crashed run produces the same empty diagnostics as a clean one, so it
      // has to be caught HERE. Returning success() with truncated output lets
      // the caller parse zero errors and print `✓ TypeScript 0 issues` over a
      // process that died — the exact false green this check exists to prevent.
      const crash = TypecheckRepository.diagnoseCrash(result);
      if (crash !== null) {
        logger.error(`[TYPESCRIPT] ${crash}`);
        return failInline({
          message: `TypeScript check FAILED TO COMPLETE — ${crash}. This is not a pass: no file was fully checked, and any "0 issues" would be meaningless. Re-run; if it repeats, the typechecker is running out of memory and needs a narrower path or a larger heap.`,
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
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
      return failInline({
        message: `TypeScript check failed: ${parsedError.message}`,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
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
        data.disableFilter ?? false,
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

    return failInline({
      message: `TypeScript check failed after ${duration}ms: ${parsedError.message}${
        output.trim() ? `\n${output.trim()}` : ""
      }`,
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}
