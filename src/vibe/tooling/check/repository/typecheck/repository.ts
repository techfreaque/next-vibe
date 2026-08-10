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
  /** `--strict`: force the repo's strict compilerOptions on any path. */
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

/**
 * Find the real tsc binary by walking up from startDir, same as findTsgoFrom.
 */
function findTscFrom(startDir: string): string | undefined {
  const binaryNames =
    process.platform === "win32" ? ["tsc.cmd", "tsc"] : ["tsc"];
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

/**
 * Locate the real tsc binary directly, the same way findTsgo locates tsgo —
 * NOT through `bunx`/`npx`. `bunx tsc` was measured to be non-deterministic
 * under this checker's concurrent (4-at-once) command execution: the exact
 * same generated config produced anywhere from 2 to 352 diagnostics across
 * back-to-back runs, while `node_modules/.bin/tsc.cmd` invoked directly on
 * the same config was stable at 2 every time. `bunx` re-resolves/re-verifies
 * the package on each invocation, and that resolution isn't safe to run
 * concurrently against a large node_modules tree — calling the installed
 * binary directly sidesteps it entirely, same as tsgo already does.
 */
function findTsc(startDir: string): string | undefined {
  const projectBinary = findTscFrom(startDir);
  if (projectBinary) {
    return projectBinary;
  }
  return findTscFrom(dirname(fileURLToPath(import.meta.url)));
}

function findProjectRoot(): string {
  // Every app has its own tsconfig.json, so walking up looking for THAT stops
  // at the nearest app instead of the repo root when invoked from inside one
  // (e.g. cwd = a nested app). check.config.ts exists exactly once, at the
  // true root — the same marker ConfigRepositoryImpl.getConfigFilePath uses.
  let dir = process.cwd();
  for (let i = 0; i < 10; i++) {
    if (existsSync(resolve(dir, "check.config.ts"))) {
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

/**
 * The tsconfig.json that OWNS `target` — the nearest one at or above it, never
 * above the project root. Null when nothing does.
 */
/**
 * Reduce a tsconfig include/target glob to its directory (POSIX, no trailing
 * slash). The project root is "" — the empty string is a real answer here, not
 * a failure.
 *
 * The `lastIndexOf("/", star)` has to be checked for -1. A root-anchored
 * include like `**\/*.ts` puts its first wildcard at index 0, so there is no
 * "/" before it and lastIndexOf returns -1 — and `slice(0, -1)` does NOT mean
 * "empty", it means "everything but the last character". `**\/*.ts` became the
 * literal string `**\/*.t`, which matches no directory at all.
 *
 * That single off-by-one silently disabled directory-scoped typechecking on any
 * project whose tsconfig includes from its own root: clampGlobsToIncludes
 * intersected the real target against `**\/*.t`, found no overlap, emitted an
 * EMPTY `include`, and tsgo dutifully compiled nothing in 0.1s and reported
 * zero errors. File-scoped checks were unaffected because exact files bypass
 * the intersection entirely — which is exactly the "passes at file scope, green
 * at directory scope" signature that exposed it.
 */
function globToDir(glob: string): string {
  const posix = glob.replaceAll("\\", "/");
  const star = posix.search(/[*?]/);
  if (star === -1) {
    return posix.replace(/\/+$/, "");
  }
  const lastSlash = posix.lastIndexOf("/", star);
  const cut = lastSlash === -1 ? "" : posix.slice(0, lastSlash);
  return cut.replace(/\/+$/, "");
}

/**
 * Whether `child` is the same directory as `parent` or nested under it.
 *
 * `parent === ""` is the project root, and everything is under the project
 * root. Without that case the `${parent}/` template builds the absolute-looking
 * prefix "/", which no project-relative path ever starts with, so a root-level
 * include root matched nothing.
 */
function isPathUnderOrEqual(child: string, parent: string): boolean {
  return parent === "" || child === parent || child.startsWith(`${parent}/`);
}

/**
 * Crash signatures that mean the typechecker DIED rather than finished.
 *
 * The distinction is the whole point: a typechecker that finds no errors and a
 * typechecker that never got far enough to look both produce empty diagnostics,
 * and the second one must never be reported as a pass. This has happened — an
 * out-of-memory abort printed `✓ TypeScript 0 issues`, which is the most
 * dangerous output this tool can produce, because a green check is exactly when
 * nobody looks closer.
 *
 * Both runtimes are represented. tsgo is Go, so it aborts with `fatal error:` /
 * `panic:` and a goroutine dump; tsc is Node, which dies with
 * `FATAL ERROR: ... heap out of memory`.
 */
const CRASH_SIGNATURES = [
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
 * Exit codes are NOT sufficient on their own. tsc and tsgo use exit 1 and 2 for
 * "I found type errors" — a SUCCESSFUL run whose diagnostics are sitting in
 * stdout — so classifying by exit code alone would throw away every real result
 * the checker exists to report. This looks at HOW the process died instead:
 * a crash banner in the output, a kill signal, or an exit status outside the
 * 0/1/2 the typecheckers actually define.
 *
 * Module-level and exported so the classifier can be unit-tested directly; the
 * must-not-trip cases (clean pass, errors found) matter more than the crash
 * cases, because a false crash report is a broken gate too.
 */
export function diagnoseCrash(result: {
  stdout: string;
  stderr: string;
  code: number | null;
  signal: NodeJS.Signals | null;
}): string | null {
  const combined = `${result.stderr}\n${result.stdout}`;
  const hit = CRASH_SIGNATURES.find((re) => re.test(combined));
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

  // 0 = clean, 1/2 = diagnostics emitted. Anything else is the process failing
  // to run at all: a missing binary, a bad tsconfig, a native abort.
  if (result.code !== null && result.code > 2) {
    return `the typechecker exited with status ${result.code}, which means it failed to run rather than found errors`;
  }

  return null;
}

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
 * Disagreement means the run spans projects (`vibe check apps/a apps/b`) and
 * no one config can describe both, so the caller falls back to the root — the
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

  /**
   * Discover independent nested TypeScript projects in a workspace.
   *
   * A directory with its own `.git` (a submodule's gitlink file, or a nested
   * clone) is a FOREIGN repository: it has its own toolchain, its own
   * node_modules layout, and checks itself — compiling it with this repo's
   * configs invents errors its own checker does not have (a vendored sub-repo's
   * deps resolved through the parent can produce hundreds of them). Its projects are
   * not visited; the directory is returned in `foreignRoots` so the caller
   * excludes it from the root sweep as well.
   */
  private static discoverNestedProjects(root: string): {
    projects: string[];
    foreignRoots: string[];
  } {
    const projects: string[] = [];
    const foreignRoots: string[] = [];
    const visit = (directory: string): void => {
      const entries = readdirSync(directory, { withFileTypes: true });
      if (directory !== root && entries.some((e) => e.name === ".git")) {
        foreignRoots.push(relative(root, directory).replaceAll("\\", "/"));
        return;
      }
      for (const entry of entries) {
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
    return {
      projects: projects.toSorted(),
      foreignRoots: foreignRoots.toSorted(),
    };
  }

  /** TypeScript configuration Zod schema for runtime validation */
  private static readonly TsConfigSchema = z.object({
    extends: z.union([z.string(), z.array(z.string())]).optional(),
    files: z.array(z.string()).optional(),
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
      env?: Record<string, string | undefined>;
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
        ...(options.env ? { env: { ...process.env, ...options.env } } : {}),
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

  // --------------------------------------------------------
  // Static Private Helpers - Command Configuration
  // --------------------------------------------------------

  /**
   * Get the base command for type checking.
   * @param useTsgo - Whether to use tsgo instead of tsc
   * @param searchDir - Directory to start the binary search from. Must be the
   * checked project's own directory (not the checker process's cwd) so a
   * project with its own locally-installed typescript version resolves that
   * version's tsc/tsgo instead of always finding the repo root's.
   * @returns The base command string
   */
  private static getBaseCommand(useTsgo: boolean, searchDir: string): string {
    if (useTsgo) {
      return JSON.stringify(findTsgo(searchDir));
    }
    // This string is handed to `spawn(..., { shell: true })`, so the runner is
    // spelled out rather than passed as an argv array.
    //
    // The increased memory tsc needs for large projects is set via `env` on
    // the spawn call (see executeCommand), NOT an inline `NODE_OPTIONS=...`
    // prefix here: that's POSIX shell syntax, and `shell: true` on Windows
    // runs through cmd.exe, which doesn't understand it and fails the spawn
    // outright — every tsc invocation died before reaching TypeScript at all.
    //
    // Call the installed tsc binary directly rather than through
    // `bunx`/`npx` — measured non-deterministic under this checker's
    // concurrent command execution (see findTsc), the same class of problem
    // tsgo already avoids by never going through a package-runner wrapper.
    const directTsc = findTsc(searchDir);
    if (directTsc) {
      return JSON.stringify(directTsc);
    }
    const runner = getPackageRunner(coreEnv.PACKAGE_MANAGER);
    return [runner.command, ...runner.args, "tsc"].join(" ");
  }

  /**
   * Build the full typecheck command with all flags.
   *
   * NO `--incremental`. tsgo does not re-emit cached diagnostics for files the
   * .tsbuildinfo says are unchanged (tsc does), so a second identical run
   * reported only the files touched since the first — 40 issues, then 5, for
   * the same command. A checker that under-reports on re-run is worse than a
   * slower one; tsgo is fast enough without the cache.
   */
  private static buildTypecheckCommand(
    baseCommand: string,
    projectConfig: string,
  ): string {
    return `${baseCommand} --noEmit --skipLibCheck --project ${projectConfig}`;
  }

  /**
   * Recover the `--project <path>` argument from a command built by
   * `buildTypecheckCommand` — always its last token, since projectConfig is
   * never quoted (temp config paths are our own, never contain spaces).
   * Used to look up which real tsconfig THIS command's own output belongs
   * to, so a workspace run's 20+ concurrent commands can each attribute
   * their pathless diagnostics correctly instead of collapsing into one
   * shared bucket.
   */
  private static extractProjectPath(command: string): string | undefined {
    const marker = " --project ";
    const idx = command.lastIndexOf(marker);
    if (idx === -1) {
      return undefined;
    }
    return command.slice(idx + marker.length).trim();
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
    tempConfigOwners: Map<string, string> = new Map(),
    /**
     * The real tsconfig this SPECIFIC output came from, when the caller
     * already knows it (one command's output, parsed on its own) — used for
     * pathless global diagnostics (TS2688 "cannot find type definition",
     * etc.) instead of the generic "tsconfig.json" literal.
     *
     * Matters because a workspace run executes 20+ commands concurrently and
     * concatenates all their output into one blob before ever calling this;
     * every one of THOSE commands' pathless diagnostics then collapses into
     * the exact same hardcoded "tsconfig.json" bucket, indistinguishable from
     * each other — a flood of errors from project A reads as if they came
     * from the (possibly innocent) project B, C, and D too. Passing each
     * command's own output through separately, with its own defaultOwner,
     * is what keeps them apart.
     */
    defaultOwner?: string,
  ): { errors: ParsedIssue[]; warnings: ParsedIssue[] } {
    const errors: ParsedIssue[] = [];
    const warnings: ParsedIssue[] = [];

    const cleanOutput = TypecheckRepository.stripAnsiCodes(output);
    // tsc emits CRLF line endings under `bunx`/Windows; splitting on "\n"
    // alone leaves a trailing "\r" on every line. JS regex `.` treats "\r" as
    // a line terminator it can never match, so the `$` anchor in both
    // per-file patterns below then fails on EVERY line — every diagnostic,
    // regardless of how well-formed, fell through to the pathless global
    // bucket as a result, discarding its real file/line/column entirely.
    const lines = cleanOutput.split(/\r?\n/);

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

        // A config-level diagnostic (bad/removed option) is reported against
        // whatever file was passed via `--project` — always one of OUR
        // generated temp configs, never the real project tsconfig the user
        // would need to go fix. Swap it back before formatting for display.
        issue.file = getDisplayPath(
          TypecheckRepository.rewriteTempConfigFile(
            issue.file,
            tempConfigOwners,
          ),
        );

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
          file: defaultOwner ? getDisplayPath(defaultOwner) : "tsconfig.json",
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
    rootPrefix: string,
  ): string[] | undefined {
    if (!types) {
      return undefined;
    }

    // Whether `basePrefix + node_modules/<typeName>` ships declarations for
    // the entry. Existence of the directory is not enough: `types: ["mocha"]`
    // with a local node_modules/mocha (no index.d.ts, no `types` field)
    // resolves through @types/mocha in the typeRoots — rewriting it to the
    // bare package produced a TS2688 for a name that was never broken.
    const resolvesFrom = (typeName: string, basePrefix: string): boolean => {
      const segments = typeName.split("/");
      const packageName = typeName.startsWith("@")
        ? segments.slice(0, 2).join("/")
        : segments[0];
      const entryAbs = resolve(
        cachePath,
        `${basePrefix}node_modules/${typeName}`,
      );
      // A subpath entry ("vite-plugin-svgr/client") is a .d.ts next to it; a
      // package entry is an index.d.ts or a package.json types/typings field.
      if (
        existsSync(`${entryAbs}.d.ts`) ||
        existsSync(join(entryAbs, "index.d.ts"))
      ) {
        return true;
      }
      if (typeName !== packageName) {
        return false;
      }
      const packageJsonPath = resolve(
        cachePath,
        `${basePrefix}node_modules/${packageName}/package.json`,
      );
      if (!existsSync(packageJsonPath)) {
        return false;
      }
      const parsed = parseJsonWithComments(
        readFileSync(packageJsonPath, "utf8"),
      );
      if (!parsed.success) {
        return false;
      }
      const pkg = parsed.data as { types?: string; typings?: string };
      return Boolean(pkg.types ?? pkg.typings);
    };

    return types.map((typeName) => {
      if (typeName.startsWith(".") || typeName.startsWith("/")) {
        return TypecheckRepository.adjustPath(typeName, prefix);
      }

      // A bare name like "vite-plugin-svgr/client" is resolved by walking
      // node_modules up from the config that DECLARED it. This config lives in
      // the cache dir, so that walk starts at the repo root and never reaches
      // the owning project's node_modules — the entry then fails with TS2688. It is the
      // one value `prefix` alone cannot fix, because the anchor is the file's
      // location rather than anything written inside it.
      //
      // So resolve it here instead and write the answer as a path. The
      // alternative — listing the owner's (or the root's) bare node_modules in
      // typeRoots — makes every package in that directory an auto-included
      // type package and silently masks real module errors: it also produces
      // a TS2688 for every OTHER package hoisted alongside it that has no
      // valid main .d.ts/types field, which is what happened when the root's
      // bare node_modules was listed unconditionally for every project (see
      // the removed `adjustedTypeRoots.push(nodeModulesRoot)` below).
      //
      // Try the owning project's own node_modules first, then fall back to
      // the repo root's — hoisted bare-package types (e.g. "bun-types" that
      // only exists at the root's node_modules/bun-types, not under any
      // project's own node_modules) still resolve, without ever adding a
      // whole node_modules directory as a typeRoot.
      if (resolvesFrom(typeName, prefix)) {
        return `${prefix}node_modules/${typeName}`;
      }
      if (prefix !== rootPrefix && resolvesFrom(typeName, rootPrefix)) {
        return `${rootPrefix}node_modules/${typeName}`;
      }
      return typeName;
    });
  }

  /**
   * Whether an @types-style package directory ships a usable declaration:
   * either an `index.d.ts`, or a package.json `types`/`typings` field
   * pointing at a file that exists. DefinitelyTyped "stub" packages
   * (published for packages that now ship their own types — chalk,
   * json-stable-stringify, ...) have neither: `package.json` with
   * `"main": ""` and no `.d.ts` anywhere, deliberately inert. See
   * `collectImplicitTypes` for why this matters.
   */
  private static hasUsableDeclaration(entryDir: string): boolean {
    if (existsSync(join(entryDir, "index.d.ts"))) {
      return true;
    }
    const packageJsonPath = join(entryDir, "package.json");
    if (!existsSync(packageJsonPath)) {
      return false;
    }
    const parsed = parseJsonWithComments(readFileSync(packageJsonPath, "utf8"));
    if (!parsed.success) {
      return false;
    }
    const pkg = parsed.data as { types?: string; typings?: string };
    const entry = pkg.types ?? pkg.typings;
    return Boolean(entry) && existsSync(join(entryDir, entry as string));
  }

  /**
   * Replicate TypeScript's own implicit type-library discovery under
   * `typeRoots` (every directory entry becomes an auto-included ambient type
   * package when `types` is unset) — minus the "stub" packages that only
   * TypeScript's DEFAULT (unset) typeRoots silently tolerates. Used whenever
   * the owning project does not declare its own `types`: this temp config
   * always sets `typeRoots` explicitly (it lives outside the project
   * directory, so the default relative lookup would resolve nothing), and an
   * explicit `typeRoots` with no `types` filter would otherwise fail on every
   * stub package hoisted anywhere under those directories. See the
   * `adjustedTypes` call site for the measured proof this is a real
   * default-vs-explicit behavior split, not a config mistake.
   */
  private static collectImplicitTypes(
    typeRootDirs: string[],
    cachePath: string,
  ): string[] {
    const names = new Set<string>();
    for (const root of typeRootDirs) {
      const absRoot = resolve(cachePath, root);
      let entries: Dirent[];
      try {
        entries = readdirSync(absRoot, { withFileTypes: true });
      } catch {
        continue;
      }
      for (const entry of entries) {
        if (!entry.isDirectory() || entry.name.startsWith(".")) {
          continue;
        }
        if (names.has(entry.name)) {
          continue;
        }
        if (
          TypecheckRepository.hasUsableDeclaration(join(absRoot, entry.name))
        ) {
          names.add(entry.name);
        }
      }
    }
    return [...names].toSorted();
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
   * Whether a filesToCheck entry is a glob/folder pattern rather than an exact
   * file. Globs contain "*" or "?"; exact paths do not.
   */
  private static isGlobPattern(path: string): boolean {
    return path.includes("*") || path.includes("?");
  }

  /**
   * Intersect folder/glob targets with the owning project's `include`, so a
   * scoped check compiles the same file set `tsgo -p <project>` would.
   *
   * Both sides reduce to directories (globs stripped of their `*` suffix); the
   * result is the narrower of each overlapping pair, re-expanded to a `**\/*`
   * glob. A target under an include root stays as the target; the project root
   * as a target expands to the include roots; disjoint pairs drop out (a folder
   * the project does not include yields nothing, exactly as `tsgo -p` sees it).
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
   * .next/types/routes.d.ts, which names every route → the entire source tree).
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
   * also discards the ambient declarations the base listed there — and those are
   * not optional. A root config that includes an env/augmentation `.d.ts` (the
   * kind that adds a prop to every component of a UI library) is invisible to a
   * scoped check without this, and the check then reports dozens of errors that
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
   * Deepest directory containing all `targets`, project-root-relative and POSIX.
   * Glob suffixes ("foo/bar/**\/*") are reduced to their directory, exact files
   * to their dirname. Used to bound the ambient-declaration search on the root
   * fallback so a single-file check never walks the whole repo.
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
   * shims for asset imports, `declare global`, framework globals) the target
   * may depend on, so they are added back to `files`. Bounded by skipping heavy
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
   * Read and parse a tsconfig.json file in isolation — no `extends` chain
   * resolution, just this file's own declared `compilerOptions`. Returns null
   * on any read/parse failure rather than throwing: callers use this for a
   * best-effort compatibility check, not as the source of truth for the
   * actual compile (that's `createTempTsConfig`, which already handles
   * `extends` properly for the real run).
   */
  private static tryReadOwnTsConfig(tsconfigPath: string): TsConfig | null {
    if (!existsSync(tsconfigPath)) {
      return null;
    }
    try {
      const parsed = parseJsonWithComments(readFileSync(tsconfigPath, "utf8"));
      if (!parsed.success) {
        return null;
      }
      return TypecheckRepository.TsConfigSchema.parse(parsed.data) as TsConfig;
    } catch {
      return null;
    }
  }

  /**
   * Resolve a single `extends` entry to the tsconfig file it points at,
   * relative to the file that declared it — the same anchor TypeScript
   * itself uses. Only relative/absolute paths are handled (this repo never
   * extends a package-name config); anything else, or a target that doesn't
   * exist even with `.json` appended, returns null.
   */
  private static resolveExtendsTarget(
    fromTsconfigPath: string,
    ext: string,
  ): string | null {
    if (!ext.startsWith(".") && !isAbsolute(ext)) {
      return null;
    }
    const resolved = resolve(dirname(fromTsconfigPath), ext);
    if (existsSync(resolved)) {
      return resolved;
    }
    const withJson = `${resolved}.json`;
    return existsSync(withJson) ? withJson : null;
  }

  /**
   * The EFFECTIVE `module`/`moduleResolution` a tsconfig compiles with —
   * its own declared values if present, otherwise whatever the nearest
   * `extends` ancestor that declares them has. Reading only the file's own
   * keys is not enough: most nested tsconfigs declare
   * neither and inherit both from a shared base config, so a shallow read
   * always saw "nothing declared" and never triggered the tsc fallback.
   */
  private static resolveEffectiveModuleSettings(
    tsconfigPath: string,
    depth = 0,
  ): {
    module?: string;
    moduleResolution?: string;
    target?: string;
    baseUrl?: string;
  } {
    if (depth > 10) {
      return {};
    }
    const tsconfig = TypecheckRepository.tryReadOwnTsConfig(tsconfigPath);
    if (!tsconfig) {
      return {};
    }
    const own: {
      module?: string;
      moduleResolution?: string;
      target?: string;
      baseUrl?: string;
    } = {};
    if (typeof tsconfig.compilerOptions?.module === "string") {
      own.module = tsconfig.compilerOptions.module;
    }
    if (typeof tsconfig.compilerOptions?.moduleResolution === "string") {
      own.moduleResolution = tsconfig.compilerOptions.moduleResolution;
    }
    if (typeof tsconfig.compilerOptions?.target === "string") {
      own.target = tsconfig.compilerOptions.target;
    }
    if (typeof tsconfig.compilerOptions?.baseUrl === "string") {
      own.baseUrl = tsconfig.compilerOptions.baseUrl;
    }
    if (
      own.module !== undefined &&
      own.moduleResolution !== undefined &&
      own.target !== undefined &&
      own.baseUrl !== undefined
    ) {
      return own;
    }
    const extendsList = tsconfig.extends
      ? Array.isArray(tsconfig.extends)
        ? tsconfig.extends
        : [tsconfig.extends]
      : [];
    for (const ext of extendsList) {
      const target = TypecheckRepository.resolveExtendsTarget(
        tsconfigPath,
        ext,
      );
      if (!target) {
        continue;
      }
      const inherited = TypecheckRepository.resolveEffectiveModuleSettings(
        target,
        depth + 1,
      );
      own.module ??= inherited.module;
      own.moduleResolution ??= inherited.moduleResolution;
      own.target ??= inherited.target;
      own.baseUrl ??= inherited.baseUrl;
    }
    return own;
  }

  /**
   * Whether tsgo can compile a config as declared, given its EFFECTIVE
   * (inherited-through-`extends`) `module`/`moduleResolution`. tsgo hard-
   * rejects the legacy "node"/"node10" moduleResolution some projects still
   * carry (tsc accepts it fine — it was never a problem before tsgo
   * existed).
   *
   * - "compatible": nothing legacy declared, tsgo runs as-is.
   * - "needs-bundler": legacy moduleResolution, but `module` is already
   *   esnext/preserve-family — safe to bump moduleResolution to "bundler"
   *   for the ephemeral compile-only config, no observable behavior change.
   * - "needs-tsc": legacy moduleResolution with a commonjs-family (or
   *   undeclared) `module`. Node16/NodeNext looks like the fallback here,
   *   but measured against this repo's own commonjs projects it introduces
   *   unrelated false positives (paths-mapped bare specifiers stop
   *   resolving, every relative import needs an explicit `.js` extension) —
   *   tsgo simply cannot compile these projects as they're written. Falling
   *   back to tsc, which never removed classic "node" resolution, is the
   *   only option that doesn't trade a hard failure for wrong results.
   *
   *   Also "needs-tsc" whenever `target` is "es5": tsgo/TS7 removed ES5 as a
   *   compile target outright (there's no override that brings it back, unlike
   *   the moduleResolution "bundler" swap above), so any project still
   *   targeting es5 can only be checked by a real tsc.
   *
   *   Also "needs-tsc" whenever `baseUrl` is declared at all: tsgo/TS7 removed
   *   `baseUrl` as a compilerOption outright too, and unlike moduleResolution
   *   there is no rewrite that keeps the ephemeral config semantically
   *   equivalent — `paths` entries that relied on `baseUrl` resolve
   *   differently once it's gone, and rewriting every entry to inline the
   *   base is not something that can be done as a blind per-project text
   *   transform without risking silently wrong resolution. Measured directly:
   *   `tsgo -p` on a config with BOTH `baseUrl` and `paths` set (the case
   *   TS7's own migration guidance describes as supported) still hard-fails
   *   with `TS5102 Option 'baseUrl' has been removed` — this is not
   *   conditional on `paths`, so presence alone is disqualifying. Projects that
   *   inherit legacy `moduleResolution`+commonjs `module` from a shared base
   *   config are already routed to "needs-tsc" above before baseUrl is ever
   *   considered.
   */
  private static classifyTsgoCompatibility(settings: {
    module?: string;
    moduleResolution?: string;
    target?: string;
    baseUrl?: string;
  }): "compatible" | "needs-bundler" | "needs-tsc" {
    const {
      moduleResolution,
      module: moduleKind,
      target: compileTarget,
      baseUrl,
    } = settings;
    if (
      typeof compileTarget === "string" &&
      compileTarget.toLowerCase() === "es5"
    ) {
      return "needs-tsc";
    }
    if (typeof baseUrl === "string") {
      return "needs-tsc";
    }
    const isLegacy =
      typeof moduleResolution === "string" &&
      ["node", "node10"].includes(moduleResolution.toLowerCase());
    if (!isLegacy) {
      return "compatible";
    }
    const moduleSupportsBundler =
      typeof moduleKind === "string" &&
      [
        "esnext",
        "es2015",
        "es2020",
        "es2022",
        "preserve",
        "node16",
        "nodenext",
      ].includes(moduleKind.toLowerCase());
    return moduleSupportsBundler ? "needs-bundler" : "needs-tsc";
  }

  /**
   * The command to actually run for a given owning tsconfig — tsgo unless
   * that config's own moduleResolution needs the "needs-tsc" fallback (see
   * `classifyTsgoCompatibility`), in which case tsc runs instead. The real
   * tsconfig.json is only ever READ here, never written — the fallback is a
   * choice of which binary to invoke, not a config edit.
   */
  private static selectEngineCommand(
    owningTsconfigPath: string,
    useTsgo: boolean,
  ): string {
    const searchDir = dirname(owningTsconfigPath);
    if (!useTsgo) {
      return TypecheckRepository.getBaseCommand(false, searchDir);
    }
    const settings =
      TypecheckRepository.resolveEffectiveModuleSettings(owningTsconfigPath);
    const compatibility =
      TypecheckRepository.classifyTsgoCompatibility(settings);
    return TypecheckRepository.getBaseCommand(
      compatibility !== "needs-tsc",
      searchDir,
    );
  }

  /**
   * Normalize a path for use as a temp-config-owner map key/value: forward
   * slashes only. tsc/tsgo echo the `--project` path back verbatim in
   * config-level diagnostics, and that path was built with `join`/`resolve`
   * (backslashes on Windows), so the raw diagnostic text and our stored key
   * would otherwise mismatch on this platform alone.
   */
  private static normalizeForOwnerLookup(path: string): string {
    return path.replaceAll("\\", "/");
  }

  /** Record which real tsconfig an ephemeral temp config extends, keyed for `rewriteTempConfigFile` to look up later. */
  private static recordTempConfigOwner(
    tempConfigOwners: Map<string, string>,
    tempConfigPath: string,
    owningTsconfigPath: string,
  ): void {
    tempConfigOwners.set(
      TypecheckRepository.normalizeForOwnerLookup(tempConfigPath),
      owningTsconfigPath,
    );
  }

  /**
   * If `file` is one of our own generated temp configs, return the real
   * tsconfig it extends instead (still raw — caller applies `getDisplayPath`
   * same as any other file) — a config-level error (bad option, removed
   * setting) is always reported against whatever file was passed via
   * `--project`, which is never something the user can act on by itself.
   */
  private static rewriteTempConfigFile(
    file: string,
    tempConfigOwners: Map<string, string>,
  ): string {
    return (
      tempConfigOwners.get(TypecheckRepository.normalizeForOwnerLookup(file)) ??
      file
    );
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
    /**
     * Whether this run compiles with tsgo. tsgo hard-rejects the legacy
     * `moduleResolution: "node"`/`"Node"` values ("Option 'moduleResolution=
     * node10' has been removed") that several project tsconfigs still declare
     * for their real build tooling (tsc, and tsc still accepts them fine).
     * Only the ephemeral temp config generated here gets bumped to "bundler"
     * so tsgo can run at all — the owning tsconfig.json is never touched, so
     * the project's actual build/editor tooling is unaffected.
     */
    useTsgo = false,
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

    // Strip source-sweeping patterns only when we have explicit targets.
    // When filesToCheck is empty (full-project NO_PATH case), we must keep
    // src/**/*.ts etc. — stripping them would leave nothing to check.
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
    // rootDir is location-anchored like typeRoots, with one extra trap: it also
    // has a location-anchored DEFAULT. When `composite` is in play (inherited
    // from a shared base config), an unset rootDir
    // defaults to the directory containing THIS temp config — .tmp/typecheck-
    // cache — and every project file then fails TS6059 ("is not under
    // 'rootDir'"). Pin it to what `tsgo -p <owner>` would use: the owner's
    // declared rootDir rebased, or the owner's own directory.
    const ownerRootDir = mainTsConfig.compilerOptions?.rootDir;
    const adjustedRootDir = ownerRootDir
      ? TypecheckRepository.adjustPath(ownerRootDir, prefix)
      : prefix.replace(/\/+$/, "") || ".";
    // typeRoots must always be spelled out, and must point at the OWNING
    // project's node_modules.
    //
    // The temp config lives in the cache dir, so TypeScript's default lookup
    // ("./node_modules/@types" upward from the config) starts in the wrong place
    // — and a config whose `types` cannot resolve does not merely warn: tsgo
    // reports the one TS2688 and type-checks NOTHING, which reads as a clean
    // pass. This was previously only appended when the base config already had
    // typeRoots — so defaulting is what makes a nested project without its own
    // typeRoots checkable at all.
    //
    // The default mirrors TypeScript's own lookup, which walks `node_modules/
    // @types` UPWARD from the containing directory — so a nested project sees
    // both its own deps and the hoisted ones at the root. Listing only the
    // owner's would be narrower than stock tsc: it would make the checker
    // disagree with `tsgo -p <project>` about which errors exist.
    // The owning project contributes its `@types` ONLY — never its bare
    // node_modules. A bare node_modules typeRoot makes TypeScript treat every
    // package inside it as an auto-included type package, which pulls their
    // declarations in globally and *masks* real module errors (a genuine
    // TS2307 for a missing module disappears). Measured against
    // `tsgo -p <project>`: @types-only reports a false TS2688, adding the
    // owner's bare node_modules reports nothing, and this shape reports
    // exactly what the project's own config does.
    const adjustedTypeRoots = existingTypeRoots ?? [
      ...(prefix === rootPrefix ? [] : [`${prefix}node_modules/@types`]),
      `${rootPrefix}node_modules/@types`,
    ];
    // Bare package types (e.g. "bun-types" at node_modules/bun-types rather
    // than node_modules/@types/bun-types) are resolved per-entry above, in
    // `adjustTypes`, which now falls back to the ROOT's node_modules for
    // exactly the entries that need it and rewrites them to an explicit path.
    //
    // Do NOT also add the root's bare node_modules here as a typeRoot: that
    // was tried and made TypeScript auto-include EVERY package under it as a
    // global type package, which for a normal repo root — full of ordinary
    // hoisted deps with no `types`/`typings` field (e.g. "argparse",
    // "array-back", "balanced-match", ...) — produced a TS2688 "Cannot find
    // type definition file" for each of them, on every project checked. That
    // is the class of regression this comment is here to prevent from coming
    // back.

    // `types` must also always be spelled out, for a reason distinct from
    // typeRoots above: TypeScript's DEFAULT (unset) typeRoots silently skips
    // "stub" @types packages when building its implicit type-library list —
    // DefinitelyTyped publishes these for packages that now ship their own
    // types (chalk, json-stable-stringify, ...): a package.json with
    // `"main": ""` and no .d.ts anywhere, deliberately inert. The instant
    // typeRoots is set EXPLICITLY — which this temp config always does, since
    // it lives in the cache dir rather than the project's own directory —
    // that same silent skip stops happening, and TypeScript reports
    // `TS2688: Cannot find type definition file` for every stub package
    // hoisted anywhere under those directories, even though nothing about the
    // directories or their contents changed. Verified directly: an explicit
    // `typeRoots` naming the exact single directory `tsgo -p <owner>` already
    // walks by default reproduces the error; omitting `typeRoots` entirely
    // (real default) does not — so this is a TypeScript allowance tied to the
    // unset/default code path specifically, not a property of the directory
    // list, and there is no compilerOption that restores it once typeRoots is
    // explicit.
    //
    // The only way to keep the project's real ambient types working while
    // dropping the stub-triggered false errors is to enumerate the same
    // implicit set TypeScript's default would have built — every directory
    // under the resolved typeRoots — and explicitly filter out exactly the
    // entries that have no usable declaration, the same class already
    // excluded from the root sweep (see `resolvesFrom` above; this repeats
    // the same "does this actually ship a .d.ts" check against typeRoots
    // directory listings instead of a `types` array).
    const adjustedTypes =
      mainTsConfig.compilerOptions?.types !== undefined
        ? TypecheckRepository.adjustTypes(
            mainTsConfig.compilerOptions.types as string[] | undefined,
            prefix,
            cachePath,
            rootPrefix,
          )
        : TypecheckRepository.collectImplicitTypes(
            adjustedTypeRoots,
            cachePath,
          );

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
    // globals project-wide (its src/*.d.ts sits above any single target), so search from its directory. On the root fallback there is no
    // project-global concept — search only the targets' common ancestor, and if
    // that resolves to the repo root, skip ambient entirely rather than walk the
    // whole monorepo (which would drag in every app's compiled bin/*.d.ts).
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
    // never has. The intersection keeps the
    // narrower of the two, so a sub-folder stays scoped and the project root
    // expands to the project's own include.
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

    // An empty program is not a clean program.
    //
    // With explicit targets, `files` and `include` below OVERRIDE the base's
    // include — so if both come back empty, the generated config describes a
    // compilation of nothing. tsgo runs it happily, finishes in ~0.1s and
    // reports zero diagnostics, and the check prints a green TypeScript row over
    // source it never opened. That is the same false-green class as a crashed
    // checker: silence read as success.
    //
    // Reaching here means the targets did not survive the intersection with the
    // owning project's `include` (or reduced to nothing), which is a bug in the
    // scoping — never something the user asked for. Say so instead of passing.
    if (
      hasExplicitTargets &&
      scopedFiles.length === 0 &&
      scopedIncludes.length === 0
    ) {
      return failInline({
        message:
          `TypeScript scoping produced an EMPTY file set for ${filesToCheck.join(", ")} — nothing would have been compiled, ` +
          `so a "0 issues" result would be meaningless. This is NOT a pass. The targets did not intersect the include roots of ` +
          `${owningTsconfig}; check that config's "include".`,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    // EXTEND the owning tsconfig; do not copy it.
    //
    // Copying meant rebasing every relative value by hand, and one of them
    // cannot be rebased at all: a bare `types: ["vite-plugin-svgr/client"]`
    // entry resolves through node resolution anchored at the config file that
    // DECLARED it. From this temp config in the cache dir that walk starts at
    // the repo root and never sees the project's own node_modules, so the
    // entry failed with TS2688 — and the only way to satisfy it, listing the
    // owner's bare node_modules in typeRoots, made every package there an
    // auto-included type package and silently masked real errors (a genuine
    // TS2307 for a missing module disappeared).
    //
    // `extends` sidesteps the whole class: TypeScript resolves the base's
    // `paths`, `baseUrl` and `types` relative to the BASE file, which is exactly
    // what the project's own tsconfig means. Verified against
    // `tsgo -p <project>`: identical output.
    //
    // moduleResolution is inherited via `extends` like everything else, but
    // tsgo hard-rejects the legacy "node"/"Node" value some projects still
    // carry (tsc accepts it fine, so it was never a problem before tsgo).
    // Bump it here, in the ephemeral temp config only — never in the owning
    // tsconfig.json, which real build/editor tooling still reads as-is.
    //
    // "bundler" resolution requires `module` to be esnext/preserve-family, not
    // commonjs — so it's only safe when the owning config's OWN `module`
    // already qualifies. The Node16/NodeNext pair looked like the obvious
    // fallback for commonjs projects, but measured against this very file it
    // introduces its own false positives that have nothing to do with real
    // bugs: `paths`-mapped bare specifiers stop resolving (TS2307) and every
    // relative import needs an explicit `.js` extension (TS2835) — Node16
    // enforces ECMAScript-style resolution rules this codebase was never
    // written for. Trading "fails to run" for "reports the wrong errors" is
    // worse, so commonjs projects are left alone here; they keep failing
    // under tsgo until they get a real moduleResolution migration.
    const compatibility = TypecheckRepository.classifyTsgoCompatibility(
      TypecheckRepository.resolveEffectiveModuleSettings(owningTsconfig),
    );
    const moduleResolutionOverride =
      useTsgo && compatibility === "needs-bundler"
        ? { moduleResolution: "bundler" }
        : {};
    const tempTsConfig: TsConfig = {
      extends: relative(dirname(tempConfigPath), owningTsconfig).replaceAll(
        "\\",
        "/",
      ),
      compilerOptions: {
        // All of these are location-anchored, so `extends` cannot carry them:
        // an inherited default is still resolved from THIS file's directory.
        typeRoots: adjustedTypeRoots,
        rootDir: adjustedRootDir,
        ...(adjustedTypes ? { types: adjustedTypes } : {}),
        ...moduleResolutionOverride,
        // This config only type-checks (--noEmit); it never takes part in a
        // project-reference build. Inherited `composite` (a shared base config
        // may set it) would impose build-mode constraints anyway: every input must
        // be listed explicitly — TS6307 for each transitive import of a scoped
        // target — and rootDir defaults to this file's own directory (TS6059).
        composite: false,
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
        : // A base with neither `include` nor `files` relies on TypeScript's
          // DEFAULT include — "**/*" relative to the final config file, which
          // here is the cache dir: the project's own sources vanish and the
          // check dies with TS18003 "No inputs were found". Materialize the
          // default the base actually meant: everything under ITS directory.
          !mainTsConfig.include && !mainTsConfig.files
          ? { include: [`${prefix}**/*`] }
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
    /** Driven only by the LSP-daemon fast path — the only leg with a per-file loop. */
    onProgress?: (checked: number, total: number) => void,
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
          const { configPath, message } = configResult;
          return success({
            items: [
              {
                file: configPath,
                severity: "error" as const,
                message,
              },
            ],
            files: [
              {
                file: configPath,
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
          onProgress,
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

      logger.debug(
        `[TYPESCRIPT] Using ${useTsgo ? "tsgo" : "tsc"} for type checking`,
      );

      // Create TypeScript checking configuration
      config = createTypecheckConfig(data.path, typecheckConfig.cachePath);

      // Full workspace checks run each nested tsconfig independently. Targeted
      // checks continue to use a single temporary config. Neither takes a
      // single shared base command any more — each owning tsconfig picks its
      // own engine (see selectEngineCommand), since some nested projects
      // can't compile under tsgo as declared.
      //
      // tempConfigOwners is populated as a side effect of building the
      // commands below — every ephemeral temp config maps back to the real
      // tsconfig.json it extends, so a config-level diagnostic (which tsc/
      // tsgo always reports against whatever file was passed via --project)
      // can be attributed back to the project the user actually needs to fix.
      const tempConfigOwners = new Map<string, string>();
      const workspaceResult = TypecheckRepository.buildWorkspaceCommands(
        config,
        typecheckConfig.cachePath,
        logger,
        checkConfig,
        data.strict ?? false,
        activeIgnorePatterns,
        useTsgo,
        tempConfigOwners,
      );
      if (!workspaceResult.success) {
        return workspaceResult;
      }
      const buildResult = workspaceResult.data
        ? success(workspaceResult.data)
        : TypecheckRepository.buildCommand(
            config,
            typecheckConfig.cachePath,
            logger,
            checkConfig,
            typecheckConfig,
            data.strict ?? false,
            activeIgnorePatterns,
            useTsgo,
            tempConfigOwners,
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
      // For multiple paths use targetPaths array for filtering, otherwise single targetPath
      const filterTarget = config.targetPaths ?? config.targetPath;
      let combinedExitCode = 0;
      const allErrors: ParsedIssue[] = [];
      const allWarnings: ParsedIssue[] = [];
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
        for (const [i, execResult] of results.entries()) {
          if (!execResult.success) {
            return failInline({
              message: `TypeScript check failed: ${execResult.message || "Unknown error"}`,
              errorType: ErrorResponseTypes.INTERNAL_ERROR,
            });
          }
          // A workspace run executes 20+ of these concurrently, one per
          // nested project. Parsing each command's output separately — with
          // ITS OWN project as the default owner for pathless diagnostics —
          // is what keeps one project's config-level errors (or floods of
          // them) from being misattributed to, or mixed in with, another's.
          // Concatenating everything first and parsing once, as this used
          // to do, collapsed every command's pathless diagnostics into one
          // indistinguishable "tsconfig.json" bucket.
          const projectPath = TypecheckRepository.extractProjectPath(batch[i]);
          const owner =
            projectPath &&
            TypecheckRepository.rewriteTempConfigFile(
              projectPath,
              tempConfigOwners,
            );
          const parsed = TypecheckRepository.parseTypecheckOutput(
            execResult.data.output,
            useTsgo,
            filterTarget,
            effectiveData.disableFilter,
            tempConfigOwners,
            owner || undefined,
          );
          allErrors.push(...parsed.errors);
          allWarnings.push(...parsed.warnings);
          output += `${execResult.data.output}\n`;
          if (execResult.data.exitCode !== 0) {
            combinedExitCode = execResult.data.exitCode ?? 1;
          }
        }
      }

      const errors = allErrors;
      const warnings = allWarnings;

      // Files excluded via tsconfig (extra excludes are handled at compiler level in buildCommand)
      const allIssues = [...errors, ...warnings];

      if (allIssues.length === 0) {
        // The compiler always sees more than the requested path: transitive
        // imports get compiled too, so a dependency's own errors exit non-zero
        // while the target itself is clean.
        //
        // Neither obvious answer is right. Adopting those diagnostics blames
        // this path for code it does not own and makes a scoped check unusable;
        // dropping them turns a failed compile into a green "0 issues". So do
        // neither — fail the run explicitly, and name the files that actually
        // hold the errors so the next check can be aimed at them.
        //
        // Keyed on the DIAGNOSTICS, not on the exit code: tsgo has been observed
        // emitting hundreds of errors and still exiting 0. Gating this on a
        // non-zero exit meant a compile full of errors, every one of them
        // outside the target, was filtered down to "0 issues" and printed as a
        // green pass. Silence is only a pass when the compiler was actually
        // silent.
        const unfiltered = TypecheckRepository.parseTypecheckOutput(
          output,
          useTsgo,
          undefined,
          true,
          tempConfigOwners,
        );
        const outOfScope = [...unfiltered.errors, ...unfiltered.warnings];
        if (outOfScope.length > 0) {
          // Global/config diagnostics (bad tsconfig, unresolvable "types"
          // entry, missing project file, ...) are parsed with a placeholder
          // file of "tsconfig.json" — they do not belong to any real
          // dependency, so "re-run against these files" is nonsense for them.
          // Their MESSAGE is the only useful thing to show.
          const globalDiagnostics = outOfScope.filter(
            (issue) => issue.file === "tsconfig.json",
          );
          const fileDiagnostics = outOfScope.filter(
            (issue) => issue.file !== "tsconfig.json",
          );

          const files = [
            ...new Set(fileDiagnostics.map((issue) => issue.file)),
          ];
          // Cap the list: a broken shared dependency can implicate hundreds of
          // files, and the first few already identify where to look.
          const shown = files.slice(0, 10);
          const remainder =
            files.length > shown.length
              ? ` and ${files.length - shown.length} more`
              : "";

          logger.error(
            `[TYPESCRIPT] ${outOfScope.length} diagnostic(s) outside the requested path: ${outOfScope.map((issue) => issue.message).join(" | ")}`,
          );

          if (fileDiagnostics.length === 0) {
            // Nothing but config-level diagnostics — show their actual text.
            const messages = globalDiagnostics.map((issue) => issue.message);
            return failInline({
              message: `TypeScript failed to compile the project: ${messages.join(" | ")}`,
              errorType: ErrorResponseTypes.INTERNAL_ERROR,
            });
          }

          const globalNote =
            globalDiagnostics.length > 0
              ? ` Additionally: ${globalDiagnostics.map((issue) => issue.message).join(" | ")}`
              : "";
          return failInline({
            message: `TypeScript compilation failed outside the checked path. The requested path is clean, but ${fileDiagnostics.length} diagnostic(s) in its dependencies stopped the compile — they belong to those files, not this one. Re-run the check against: ${shown.join(", ")}${remainder}${globalNote}`,
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }

        // No diagnostics anywhere. Only a non-zero exit still means failure —
        // the compiler died without saying why. A zero exit here is the one
        // genuine clean pass, and falls through to the normal empty result.
        if (combinedExitCode !== 0) {
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
   * Three tiers, matching the lint side:
   *   `compilerOptions`      always
   *   `midCompilerOptions`   inside midPaths OR strictPaths (tier 3 ⊇ tier 2)
   *   `strictCompilerOptions` inside strictPaths
   * and `--strict` applies all of them everywhere.
   *
   * A compilerOption is a property of the whole program, so unlike a lint rule
   * it cannot be filtered per file after the fact — the decision has to happen
   * here, from the paths being checked.
   */
  private static resolveEnforcedOptions(
    targets: string[],
    typecheckConfig: {
      compilerOptions?: Record<string, boolean | string | string[]>;
      midCompilerOptions?: Record<string, boolean | string | string[]>;
      strictCompilerOptions?: Record<string, boolean | string | string[]>;
    },
    checkConfig: CheckConfig,
    strict: boolean,
  ): Record<string, boolean | string | string[]> {
    const base = typecheckConfig.compilerOptions ?? {};
    const midOnly = typecheckConfig.midCompilerOptions ?? {};
    const strictOnly = typecheckConfig.strictCompilerOptions ?? {};
    if (strict) {
      return { ...base, ...midOnly, ...strictOnly };
    }
    if (targets.length === 0 || !checkConfig.oxlint.enabled) {
      return base;
    }

    const strictPaths = checkConfig.oxlint.strictPaths;
    const midPaths = checkConfig.oxlint.midPaths ?? { include: [] };

    // Every target must qualify, not just one of them. A single program gets a
    // single answer, so a mixed target list has to take the lenient one — else
    // checking a strict tree alongside a lenient one would hold the lenient one
    // to rules it never opted into.
    const allIn = (paths: { include: string[]; exclude?: string[] }): boolean =>
      targets.every(
        (target) =>
          matchesAnyGlob(target, paths.include) &&
          !matchesAnyGlob(target, paths.exclude ?? []),
      );

    const inStrict = strictPaths !== undefined && allIn(strictPaths);
    // Tier 3 includes tier 2, so a strict path gets the mid options without
    // being listed in midPaths.
    const inMid = inStrict || allIn(midPaths);

    return {
      ...base,
      ...(inMid ? midOnly : {}),
      ...(inStrict ? strictOnly : {}),
    };
  }

  /**
   * Build the typecheck command(s) based on path type.
   */
  private static buildCommand(
    config: TypecheckConfig,
    cachePath: string,
    logger: EndpointLogger,
    checkConfig: CheckConfig,
    typecheckConfig: {
      compilerOptions?: Record<string, boolean | string | string[]>;
      strictCompilerOptions?: Record<string, boolean | string | string[]>;
    },
    strict: boolean,
    extraIgnorePatterns?: string[],
    useTsgo = false,
    /**
     * Populated as commands are built: ephemeral temp config path → the real
     * tsconfig.json it extends. A config-level diagnostic (bad option, removed
     * setting) is reported by tsc/tsgo against whatever file was passed via
     * `--project` — which is always OUR generated cache file, never the real
     * project config, so on its own it tells the user nothing about which
     * project to actually go fix. This map lets the parser rewrite it back.
     */
    tempConfigOwners: Map<string, string> = new Map(),
  ): ApiResponseType<string | string[] | null> {
    const enforcedOptions = TypecheckRepository.resolveEnforcedOptions(
      [
        ...(config.targetPath ? [config.targetPath] : []),
        ...(config.targetPaths ?? []),
      ],
      typecheckConfig,
      checkConfig,
      strict,
    );
    if (config.pathType === PathType.NO_PATH) {
      // No specific path provided, check entire project.
      // When extra ignore patterns are present we need a temp config to carry the excludes —
      // tsconfig.json itself is never modified.
      if (extraIgnorePatterns && extraIgnorePatterns.length > 0) {
        const tempConfigFile = join(
          cachePath,
          `tsconfig.${config.cacheKey}.json`,
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
          undefined,
          useTsgo,
        );
        if (!createResult.success) {
          return createResult;
        }
        const rootOwner = resolve(findProjectRoot(), "tsconfig.json");
        TypecheckRepository.recordTempConfigOwner(
          tempConfigOwners,
          tempConfigFile,
          rootOwner,
        );
        return success(
          TypecheckRepository.buildTypecheckCommand(
            TypecheckRepository.selectEngineCommand(rootOwner, useTsgo),
            tempConfigFile,
          ),
        );
      }

      logger.debug("[TYPESCRIPT] Running check on entire project");
      const rootTsconfig = resolve(findProjectRoot(), "tsconfig.json");
      return success(
        TypecheckRepository.buildTypecheckCommand(
          TypecheckRepository.selectEngineCommand(rootTsconfig, useTsgo),
          rootTsconfig,
        ),
      );
    }

    if (!config.tempConfigFile) {
      return success(null);
    }

    // One temp config per OWNING tsconfig, not one for all targets. A single
    // shared config can only extend one owner, so targets spanning projects
    // fell back to the root config and produced different diagnostics than
    // checking each project alone (measured: 56 issues combined vs 40 + 20
    // separately). Grouping by owner makes a multi-target run
    // exactly the union of the single-target runs.
    // Explicit targets are always checked — including targets inside a nested
    // repository (submodule). Only the WORKSPACE sweep skips foreign roots:
    // there the skip prevents compiling another repo's projects with this
    // repo's anchoring by default, but someone naming a path (or standing in
    // that directory) asked for it, and gets the same scoped check any other
    // folder gets.
    const targets =
      config.pathType === PathType.SINGLE_FILE
        ? [config.targetPath!]
        : config.pathType === PathType.MULTIPLE_PATHS
          ? (config.targetPaths ?? [])
          : [config.targetPath || "."];

    const projectRoot = findProjectRoot();
    const groups = new Map<string, string[]>();
    for (const target of targets) {
      const owner =
        findOwningTsconfig(target) ?? resolve(projectRoot, "tsconfig.json");
      const group = groups.get(owner);
      if (group) {
        group.push(target);
      } else {
        groups.set(owner, [target]);
      }
    }

    const commands: string[] = [];
    let groupIndex = 0;
    for (const [owner, groupTargets] of groups.entries()) {
      const tempConfigFile =
        groups.size === 1
          ? config.tempConfigFile
          : join(cachePath, `tsconfig.${config.cacheKey}.${groupIndex}.json`);
      // Per GROUP, not per run: strict compilerOptions apply when the group's
      // targets are all inside strictPaths, matching what checking that group
      // alone would do.
      const createResult = TypecheckRepository.createTempTsConfig(
        resolvePathsToIncludes(groupTargets),
        tempConfigFile,
        cachePath,
        extraIgnorePatterns,
        TypecheckRepository.resolveEnforcedOptions(
          groupTargets,
          typecheckConfig,
          checkConfig,
          strict,
        ),
        undefined,
        useTsgo,
      );
      if (!createResult.success) {
        return createResult;
      }
      TypecheckRepository.recordTempConfigOwner(
        tempConfigOwners,
        tempConfigFile,
        owner,
      );
      commands.push(
        TypecheckRepository.buildTypecheckCommand(
          TypecheckRepository.selectEngineCommand(owner, useTsgo),
          tempConfigFile,
        ),
      );
      groupIndex++;
    }
    return success(commands.length === 1 ? commands[0] : commands);
  }

  /**
   * Build independent commands for a workspace with nested tsconfig projects.
   * The root command excludes directories owned by nested projects, preventing
   * their files from being interpreted with unrelated root compiler options.
   */
  private static buildWorkspaceCommands(
    config: TypecheckConfig,
    cachePath: string,
    logger: EndpointLogger,
    checkConfig: CheckConfig,
    strict: boolean,
    extraIgnorePatterns?: string[],
    useTsgo = false,
    tempConfigOwners: Map<string, string> = new Map(),
  ): ApiResponseType<string[] | null> {
    if (config.pathType !== PathType.NO_PATH) {
      return success(null);
    }

    const { projects: allProjects, foreignRoots } =
      TypecheckRepository.discoverNestedProjects(findProjectRoot());
    // Filter out nested projects that match any of the active ignore patterns
    // (e.g. "**/test-project/**" from the shared ignore list).
    const ignoreRegexes = parseFilters(extraIgnorePatterns);
    const projects =
      ignoreRegexes.length === 0
        ? allProjects
        : allProjects.filter((p) => !ignoreRegexes.some((rx) => rx.test(p)));

    // ALL discovered project dirs must be excluded from the root tsconfig —
    // even projects filtered from independent runs must not be picked up by
    // root. Foreign repositories (submodules) likewise: they were not visited,
    // so their configs are not in `allProjects`, but their FILES would still be
    // swept up by the root include without an exclude.
    const allProjectDirectories = [
      ...allProjects.map((project) => dirname(project).replaceAll("\\", "/")),
      ...foreignRoots,
    ];

    // If no projects remain after filtering (e.g. only test-projects exist),
    // still create a root tsconfig that excludes those directories, then stop.
    if (projects.length === 0) {
      if (allProjectDirectories.length === 0) {
        return success(null);
      }
      const rootTempConfig = join(cachePath, "tsconfig.workspace-root.json");
      const createRootResult = TypecheckRepository.createTempTsConfig(
        [],
        rootTempConfig,
        cachePath,
        [...allProjectDirectories, ...(extraIgnorePatterns ?? [])],
        undefined,
        undefined,
        useTsgo,
      );
      if (!createRootResult.success) {
        return createRootResult;
      }
      const rootTsconfig = resolve(findProjectRoot(), "tsconfig.json");
      TypecheckRepository.recordTempConfigOwner(
        tempConfigOwners,
        rootTempConfig,
        rootTsconfig,
      );
      return success([
        TypecheckRepository.buildTypecheckCommand(
          TypecheckRepository.selectEngineCommand(rootTsconfig, useTsgo),
          rootTempConfig,
        ),
      ]);
    }

    const rootTempConfig = join(cachePath, "tsconfig.workspace-root.json");
    const createRootResult = TypecheckRepository.createTempTsConfig(
      [],
      rootTempConfig,
      cachePath,
      [...allProjectDirectories, ...(extraIgnorePatterns ?? [])],
      undefined,
      undefined,
      useTsgo,
    );
    if (!createRootResult.success) {
      return createRootResult;
    }

    logger.debug(
      `[TYPESCRIPT] Discovered ${projects.length} nested tsconfig projects`,
    );
    const rootTsconfig = resolve(findProjectRoot(), "tsconfig.json");
    TypecheckRepository.recordTempConfigOwner(
      tempConfigOwners,
      rootTempConfig,
      rootTsconfig,
    );
    const commands = [
      TypecheckRepository.buildTypecheckCommand(
        TypecheckRepository.selectEngineCommand(rootTsconfig, useTsgo),
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
        useTsgo,
      );
      if (!createResult.success) {
        return createResult;
      }
      TypecheckRepository.recordTempConfigOwner(
        tempConfigOwners,
        projectTempConfig,
        project,
      );
      commands.push(
        TypecheckRepository.buildTypecheckCommand(
          TypecheckRepository.selectEngineCommand(project, useTsgo),
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
      //
      // NODE_OPTIONS only matters to tsc (a Node process); tsgo is a native Go
      // binary that ignores it. Setting it unconditionally is harmless either
      // way, and simpler than threading "which engine is this" down here.
      const result = await TypecheckRepository.runStreaming(command, {
        cwd: findProjectRoot(),
        timeoutMs: (timeout ?? 900) * 1000,
        signal,
        env: { NODE_OPTIONS: "--max-old-space-size=32768" },
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
      const crash = diagnoseCrash(result);
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
