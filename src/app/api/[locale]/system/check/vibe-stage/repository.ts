/**
 * Vibe Stage Repository
 *
 * Finds unstaged boilerplate candidates (route.ts, i18n/{en,de,pl}/index.ts),
 * runs the boilerplate oxlint plugin on them, and git-adds files with 0 violations.
 */

import "server-only";

import { spawn } from "node:child_process";
import { existsSync, promises as fsp } from "node:fs";
import { resolve as resolvePath } from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { hasCustomDirective } from "@/app/api/[locale]/system/unified-interface/shared/utils/custom-directive";
import type { CountryLanguage } from "@/i18n/core/config";

import { parseError } from "../../../shared/utils/parse-error";
import { ConfigRepositoryImpl } from "../config/repository";
import type {
  VibeStageRequestOutput,
  VibeStageResponseOutput,
} from "./definition";
import type { CheckVibeStageT } from "./i18n";

// ============================================================
// Helpers
// ============================================================

/** Run a shell command and resolve with stdout. Rejects on non-zero exit. */
function runCommand(cmd: string, args: string[], cwd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { cwd, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    proc.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    proc.on("close", (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(
          new Error(
            stderr.trim() || stdout.trim() || `exit code ${String(code)}`,
          ),
        );
      }
    });
    proc.on("error", reject);
  });
}

/** Run a shell command and return stdout regardless of exit code (oxlint exits non-zero on violations). */
function runCommandCapture(
  cmd: string,
  args: string[],
  cwd: string,
): Promise<string> {
  return new Promise((resolve) => {
    const proc = spawn(cmd, args, { cwd, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    proc.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    proc.on("close", () => resolve(stdout));
    proc.on("error", () => resolve(""));
  });
}

const ROUTE_PATTERN = /(?:^|\/)route\.ts$/;
const I18N_LANG_PATTERN = /\/i18n\/(?:en|de|pl)\/index\.ts$/;
const I18N_INDEX_PATTERN = /\/i18n\/index\.ts$/;
const GENERATED_PATTERN = /\/system\/generated\//;
const FIXTURES_PATTERN =
  /^src\/app\/api\/\[locale\]\/agent\/ai-stream\/testing\/fixtures\//;
const APP_TANSTACK_PATTERN = /^src\/app-tanstack\//;
const APP_NATIVE_PATTERN = /^src\/app-native\//;

const SUPPRESSION_PATTERN =
  /eslint-disable|oxlint-disable|@ts-expect-error|@ts-ignore|@ts-nocheck/;

// Matches any import statement opener, including `import type`, `import * as`, side-effects, etc.
// Must match the raw (non-trimmed) diff line content (after stripping the +/- sigil).
const IMPORT_START_PATTERN =
  /^import\s*(?:type\s+)?(?:\{|"[^"]*"|'[^']*'|\*|\w)/;

// Matches the closing line of a multi-line import: `} from "..."` or `} from '...'`
// Also handles `} from "..."` with optional trailing semicolon/comment.
const IMPORT_CLOSE_PATTERN = /^}\s*from\s+["'`]/;

/**
 * Returns true if a raw diff content line (sigil already stripped, NOT trimmed)
 * belongs to an import statement. Tracks open-brace state across lines via `state`.
 *
 * Key design decisions:
 *  - Lines are NOT trimStart()'d — indentation is used by IMPORT_CLOSE_PATTERN and
 *    is present in real diff output.
 *  - When inside a multi-line `import { ... }` block, every line is accepted until
 *    `} from "..."` closes it — this covers identifiers, `type Foo,`, blank lines,
 *    trailing commas, and inline comments safely.
 *  - `inside` only becomes true after a confirmed `import {` opener that has no
 *    closing `}` on the same line — so false-positives require the unusual pattern
 *    of `} from "..."` appearing as a changed line in non-import code.
 */
function isImportLine(line: string, state: { inside: boolean }): boolean {
  // Blank lines between imports are always acceptable — formatters insert them
  // between import groups and they appear as changed lines in reorder diffs.
  if (line.trim() === "") {
    return true;
  }

  if (state.inside) {
    if (IMPORT_CLOSE_PATTERN.test(line.trimStart())) {
      state.inside = false;
      return true;
    }
    // Any line inside a `import { ... }` block is a valid import member line.
    return true;
  }

  // `} from "..."` can appear as the start of a hunk when the `import {` opener
  // didn't change — treat it as an import line without entering `inside` state.
  if (IMPORT_CLOSE_PATTERN.test(line.trimStart())) {
    return true;
  }

  if (IMPORT_START_PATTERN.test(line)) {
    // Enter multi-line state when `{` is opened but not yet closed on this line.
    const afterImport = line.replace(/^import\s*(?:type\s+)?/, "");
    if (afterImport.includes("{") && !afterImport.includes("}")) {
      state.inside = true;
    }
    return true;
  }

  return false;
}

/**
 * Returns true if every changed line in the diff hunk belongs to an import statement.
 * `+` and `-` lines are evaluated with independent state so replacements work correctly.
 *
 * Mid-block hunks (where `import {` opener wasn't changed, only members/closer were):
 * If all changed lines of a given sigil end with `} from "..."` as the final changed line
 * of that sigil, we treat the whole group as import lines. This is safe because
 * `} from "..."` is unambiguous — it only appears as an import closer.
 */
function allLinesAreImports(changedLines: string[]): boolean {
  // Separate + and - lines for independent evaluation
  const removed = changedLines
    .filter((l) => l.startsWith("-"))
    .map((l) => l.slice(1));
  const added = changedLines
    .filter((l) => l.startsWith("+"))
    .map((l) => l.slice(1));

  return isLineGroupAllImports(removed) && isLineGroupAllImports(added);
}

/**
 * Evaluate a group of same-sigil lines (already stripped of their sigil).
 * Returns true if all lines in the group belong to import statements.
 */
function isLineGroupAllImports(lines: string[]): boolean {
  if (lines.length === 0) {
    return true;
  }

  const state = { inside: false };

  const lastNonEmpty = [...lines].toReversed().find((l) => l.trim() !== "");

  // Mid-block detection (with closer): if the last non-empty line is `} from "..."`,
  // the entire group is a partial view into a multi-line import block.
  if (
    lastNonEmpty !== undefined &&
    IMPORT_CLOSE_PATTERN.test(lastNonEmpty.trimStart())
  ) {
    return lines.every((l) => isMidBlockImportLine(l));
  }

  // Mid-block detection (no closer): a group of pure import-member lines where
  // the closing `} from` line wasn't changed (e.g. removing a named export member).
  // Safe to accept if every line is blank or matches the strict import-member pattern.
  if (lines.every((l) => isStrictImportMemberLine(l))) {
    return true;
  }

  for (const line of lines) {
    if (!isImportLine(line, state)) {
      return false;
    }
  }

  return true;
}

/**
 * Permissive check for lines inside a known import block (mid-block hunk with closer).
 * Accepts indented lines, blank lines, `} from "..."`, and `import` openers.
 */
function isMidBlockImportLine(line: string): boolean {
  const trimmed = line.trimStart();
  if (trimmed === "") {
    return true;
  }
  if (IMPORT_CLOSE_PATTERN.test(trimmed)) {
    return true;
  }
  if (IMPORT_START_PATTERN.test(line)) {
    return true;
  }
  if (/^\s/.test(line)) {
    return true;
  }
  // Bare identifier / `type Foo` without indentation (some formatters omit it)
  if (/^(?:type\s+)?[\w$][\w$,\s]*,?\s*$/.test(trimmed)) {
    return true;
  }
  return false;
}

/**
 * Strict check for a line that is an import block member with no surrounding closer.
 * Only accepts: blank lines, indented lines that look like `Identifier,` or `type Foo,`.
 * Rejects anything containing `=`, `(`, `;` outside a string, etc.
 */
function isStrictImportMemberLine(line: string): boolean {
  const trimmed = line.trimStart();
  if (trimmed === "") {
    return true;
  }
  // Must be indented (import members are always indented in multi-line imports)
  if (!/^\s/.test(line)) {
    return false;
  }
  // Reject lines with assignment, function call, or statement terminators
  if (/[=(;]/.test(trimmed)) {
    return false;
  }
  // Accept: optional `type ` prefix, then identifier(s) with optional comma
  if (/^(?:type\s+)?[\w$][\w$\s,]*,?\s*$/.test(trimmed)) {
    return true;
  }
  return false;
}

function isBoilerplateCandidate(filePath: string): boolean {
  return (
    ROUTE_PATTERN.test(filePath) ||
    I18N_LANG_PATTERN.test(filePath) ||
    I18N_INDEX_PATTERN.test(filePath) ||
    GENERATED_PATTERN.test(filePath) ||
    FIXTURES_PATTERN.test(filePath)
  );
}

/**
 * Returns true if the file is in a generated-output directory (app-tanstack, app-native)
 * and does NOT have a "use custom" directive — meaning it is safe to auto-stage.
 */
function isAutoStagedGeneratedOutput(filePath: string, cwd: string): boolean {
  if (
    !APP_TANSTACK_PATTERN.test(filePath) &&
    !APP_NATIVE_PATTERN.test(filePath)
  ) {
    return false;
  }
  return !hasCustomDirective(resolvePath(cwd, filePath));
}

/** Parse a unified diff into header lines and hunk arrays. */
function parseDiff(
  diff: string,
): { headerLines: string[]; hunks: string[][] } | null {
  const lines = diff.split("\n");
  const headerLines: string[] = [];
  let bodyStart = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    if (
      line.startsWith("diff ") ||
      line.startsWith("index ") ||
      line.startsWith("--- ") ||
      line.startsWith("+++ ")
    ) {
      headerLines.push(line);
      bodyStart = i + 1;
    } else if (line.startsWith("@@")) {
      break;
    }
  }

  const hunks: string[][] = [];
  let currentHunk: string[] | null = null;

  for (let i = bodyStart; i < lines.length; i++) {
    const line = lines[i] ?? "";
    if (line.startsWith("@@")) {
      if (currentHunk) {
        hunks.push(currentHunk);
      }
      currentHunk = [line];
    } else if (currentHunk) {
      currentHunk.push(line);
    }
  }
  if (currentHunk) {
    hunks.push(currentHunk);
  }

  return { headerLines, hunks };
}

/** Extract the @@ line target range start from a hunk header. */
function hunkNewStart(hunkHeader: string): number {
  // @@ -a,b +c,d @@ ...  →  c
  const m = /^@@ -\d+(?:,\d+)? \+(\d+)/.exec(hunkHeader);
  return m ? parseInt(m[1] ?? "0", 10) : -1;
}

/**
 * Net line delta a hunk introduces to the target file.
 * +N lines added, -M lines removed → delta = N - M.
 * Used to adjust subsequent hunk headers when building a partial patch.
 */
function hunkDelta(hunk: string[]): number {
  let added = 0;
  let removed = 0;
  for (const line of hunk.slice(1)) {
    if (line.startsWith("+") && !line.startsWith("+++")) {
      added++;
    } else if (line.startsWith("-") && !line.startsWith("---")) {
      removed++;
    }
  }
  return added - removed;
}

/**
 * Rewrite the @@ header of a hunk to use a new target start line.
 * Preserves the old-file side (-a,b) and the trailing context label unchanged.
 */
function rewriteHunkNewStart(hunkHeader: string, newStart: number): string {
  // @@ -a,b +c,d @@ label  →  @@ -a,b +newStart,d @@ label
  return hunkHeader.replace(
    /^(@@ -\d+(?:,\d+)? \+)\d+/,
    `$1${String(newStart)}`,
  );
}

/**
 * Parse unified diff output for a single file and classify unstaged changes.
 *
 * Strategy:
 *  1. u0Unstaged = `git diff --unified=0 -- file` (WC vs index) — the true unstaged
 *     hunks with line numbers relative to the current index. This is what we apply.
 *  2. Classify each unstaged hunk: import-only or mixed.
 *  3. If all hunks are import-only → importOnly=true, full-file stage.
 *  4. If some are import-only → build patch from u0Unstaged import hunks for partial stage.
 *
 * Using WC-vs-index (not WC-vs-HEAD) for the patch eliminates line-number mismatches
 * when `git apply --cached` is used — the index IS the base, so hunks apply cleanly.
 */
async function analyzeFileDiff(
  filePath: string,
  cwd: string,
): Promise<{
  importOnly: boolean;
  importHunksPatch: string | null;
} | null> {
  // WC vs index: exactly the unstaged changes, with line numbers relative to the index.
  // This is the correct base for `git apply --cached`.
  const u0Unstaged = await runCommandCapture(
    "git",
    ["diff", "--unified=0", "--", filePath],
    cwd,
  );

  if (!u0Unstaged.trim()) {
    return null;
  }

  // Reject diffs that add or remove suppression comment lines — those must be reviewed.
  if (diffHasSuppression(u0Unstaged)) {
    return null;
  }

  const u0Parsed = parseDiff(u0Unstaged);
  if (!u0Parsed || u0Parsed.hunks.length === 0) {
    return null;
  }

  // Classify each unstaged hunk: import-only vs mixed
  const importOnlyStarts = new Set<number>();
  let hasNonImportHunk = false;

  for (const hunk of u0Parsed.hunks) {
    const start = hunkNewStart(hunk[0] ?? "");
    const changedLines = hunk
      .slice(1)
      .filter((l) => l.startsWith("+") || l.startsWith("-"));
    if (allLinesAreImports(changedLines) && changedLines.length > 0) {
      importOnlyStarts.add(start);
    } else {
      hasNonImportHunk = true;
    }
  }

  const importOnly = !hasNonImportHunk && importOnlyStarts.size > 0;

  if (importOnly) {
    return { importOnly: true, importHunksPatch: null };
  }

  if (importOnlyStarts.size === 0) {
    return { importOnly: false, importHunksPatch: null };
  }

  // Build patch from import-only unstaged hunks.
  // Applied with --unidiff-zero (zero-context hunks ok) and without --3way
  // since the patch base IS the index — no drift to resolve.
  //
  // Line-number adjustment: skipped (non-import) hunks shift subsequent hunk
  // positions. For each excluded hunk that precedes an included hunk, subtract
  // its net delta from the included hunk's target start so the patch applies
  // cleanly against the unmodified index.
  const adjustedHunks: string[][] = [];
  let skippedDelta = 0;

  for (const hunk of u0Parsed.hunks) {
    const start = hunkNewStart(hunk[0] ?? "");
    if (importOnlyStarts.has(start)) {
      const adjustedStart = start - skippedDelta;
      const header = rewriteHunkNewStart(hunk[0] ?? "", adjustedStart);
      adjustedHunks.push([header, ...hunk.slice(1)]);
    } else {
      // Accumulate delta from excluded hunks so subsequent import hunks are adjusted.
      skippedDelta += hunkDelta(hunk);
    }
  }

  const patchLines = [...u0Parsed.headerLines, ...adjustedHunks.flat(), ""];
  return { importOnly: false, importHunksPatch: patchLines.join("\n") };
}

/**
 * Apply a patch string to the index (staging area) via `git apply --cached`.
 * Returns true on success.
 */
async function applyPatchToIndex(
  patch: string,
  cwd: string,
): Promise<{ ok: boolean; error: string }> {
  return new Promise((resolve) => {
    const proc = spawn(
      "git",
      ["apply", "--cached", "--unidiff-zero", "--whitespace=nowarn", "-"],
      { cwd, stdio: ["pipe", "pipe", "pipe"] },
    );
    let stderr = "";
    proc.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    proc.stdin.write(patch);
    proc.stdin.end();
    proc.on("close", (code) =>
      resolve({ ok: code === 0, error: stderr.trim() }),
    );
    proc.on("error", (err: Error) =>
      resolve({ ok: false, error: err.message }),
    );
  });
}

/**
 * Returns true if the diff itself adds or removes suppression comment lines.
 * Suppressions in unchanged file context don't affect staging safety.
 */
function diffHasSuppression(diff: string): boolean {
  for (const line of diff.split("\n")) {
    if (
      (line.startsWith("+") || line.startsWith("-")) &&
      !line.startsWith("+++") &&
      !line.startsWith("---")
    ) {
      if (SUPPRESSION_PATTERN.test(line.slice(1))) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Get unstaged/untracked files from git status --porcelain.
 * Returns relative paths from project root.
 */
async function getUnstagedFiles(cwd: string): Promise<string[]> {
  const output = await runCommand("git", ["status", "--porcelain", "-u"], cwd);
  const files: string[] = [];

  for (const line of output.split("\n")) {
    if (!line) {
      continue;
    }
    const unstagedStatus = line[1];
    const rawPath = line.slice(3).trim();

    // Renames appear as "old -> new" — extract just the destination path
    const filePath = rawPath.includes(" -> ")
      ? (rawPath.split(" -> ")[1] ?? rawPath)
      : rawPath;

    // Include modified unstaged (M), untracked (?), added unstaged (A), or renamed (R)
    if (
      unstagedStatus === "M" ||
      unstagedStatus === "A" ||
      unstagedStatus === "?" ||
      unstagedStatus === "R"
    ) {
      files.push(filePath);
    }
  }

  return files;
}

interface OxlintDiagnostic {
  filename?: string;
}

/**
 * Run oxlint boilerplate plugin on candidate files.
 * Returns the set of file paths (relative) that have zero violations.
 */
async function checkBoilerplateCompliance(
  files: string[],
  cwd: string,
  logger: EndpointLogger,
): Promise<Set<string>> {
  if (files.length === 0) {
    return new Set<string>();
  }

  const tmpConfigPath = resolvePath(cwd, ".tmp", ".oxlintrc-boilerplate.json");
  const minimalConfig = JSON.stringify({
    plugins: [],
    jsPlugins: ["@next-vibe/checker/oxlint-plugins/boilerplate.ts"],
    rules: {
      "oxlint-plugin-boilerplate/route-pattern": "error",
      "oxlint-plugin-boilerplate/i18n-pattern": "error",
    },
  });

  await fsp.writeFile(tmpConfigPath, minimalConfig, "utf8");

  const cleanFiles = new Set<string>();

  try {
    const args = ["--format", "json", "--config", tmpConfigPath, ...files];
    // oxlint exits non-zero when violations found - capture regardless
    const output = await runCommandCapture("oxlint", args, cwd);

    if (!output.trim()) {
      // No output = no violations
      for (const f of files) {
        cleanFiles.add(f);
      }
      return cleanFiles;
    }

    let diagnostics: OxlintDiagnostic[] = [];
    try {
      diagnostics = JSON.parse(output) as OxlintDiagnostic[];
    } catch {
      logger.warn(
        `[VIBE-STAGE] Could not parse oxlint output: ${output.slice(0, 200)}`,
      );
      return cleanFiles;
    }

    const filesWithViolations = new Set<string>();
    for (const diag of diagnostics) {
      if (diag.filename) {
        const rel = diag.filename.startsWith(cwd)
          ? diag.filename.slice(cwd.length + 1)
          : diag.filename;
        filesWithViolations.add(rel);
      }
    }

    for (const f of files) {
      if (!filesWithViolations.has(f)) {
        cleanFiles.add(f);
      }
    }
  } finally {
    try {
      await fsp.unlink(tmpConfigPath);
    } catch {
      // best-effort cleanup
    }
  }

  return cleanFiles;
}

// ============================================================
// Repository
// ============================================================

export class VibeStageRepository {
  static async execute(
    data: VibeStageRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
    t: CheckVibeStageT,
  ): Promise<ResponseType<VibeStageResponseOutput>> {
    const cwd = process.cwd();

    try {
      // Verify this is a git repo
      try {
        await runCommand("git", ["rev-parse", "--git-dir"], cwd);
      } catch {
        return fail({
          message: t("errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Ensure .tmp dir exists
      const tmpDir = resolvePath(cwd, ".tmp");
      if (!existsSync(tmpDir)) {
        await fsp.mkdir(tmpDir, { recursive: true });
      }

      // Get unstaged files
      const unstagedFiles = await getUnstagedFiles(cwd);
      logger.debug(
        `[VIBE-STAGE] ${String(unstagedFiles.length)} unstaged files total`,
      );

      // Filter candidates by optional path filters
      const rawPaths = data.paths;
      const pathFilters: string[] = rawPaths
        ? Array.isArray(rawPaths)
          ? rawPaths
          : [rawPaths]
        : [];

      let allFiles = unstagedFiles;
      if (pathFilters.length > 0) {
        allFiles = allFiles.filter((f) =>
          pathFilters.some((p) => f.startsWith(p)),
        );
      }

      if (allFiles.length === 0) {
        return success({
          staged: [],
          partiallyStaged: [],
          skipped: [],
          message: t("response.noChanges"),
        });
      }

      // Analyze all files for import-only diffs
      const diffAnalyses = await Promise.all(
        allFiles.map(async (f) => ({
          file: f,
          analysis: await analyzeFileDiff(f, cwd),
        })),
      );

      // Separate into: boilerplate candidates, import-only full files, partial import files
      const boilerplateCandidates: string[] = [];
      const importOnlyFiles: string[] = []; // non-boilerplate, all changes are imports
      const partialImportPatches: Map<string, string> = new Map(); // file → patch

      for (const { file, analysis } of diffAnalyses) {
        if (isBoilerplateCandidate(file)) {
          boilerplateCandidates.push(file);
        } else if (isAutoStagedGeneratedOutput(file, cwd)) {
          // app-tanstack / app-native without "use custom" → stage unconditionally
          importOnlyFiles.push(file);
        } else if (analysis?.importOnly) {
          importOnlyFiles.push(file);
        } else if (analysis?.importHunksPatch) {
          partialImportPatches.set(file, analysis.importHunksPatch);
        }
      }

      logger.debug(
        `[VIBE-STAGE] ${String(boilerplateCandidates.length)} boilerplate candidates, ` +
          `${String(importOnlyFiles.length)} import-only files, ` +
          `${String(partialImportPatches.size)} partial-import files`,
      );

      // Ensure config is ready so the boilerplate plugin can resolve
      if (boilerplateCandidates.length > 0) {
        await ConfigRepositoryImpl.ensureConfigReady(logger, locale, false);
      }

      // Check boilerplate compliance
      const cleanBoilerplate =
        boilerplateCandidates.length > 0
          ? await checkBoilerplateCompliance(boilerplateCandidates, cwd, logger)
          : new Set<string>();

      const staged: string[] = [];
      const partiallyStaged: string[] = [];
      const skipped: string[] = [];

      // Full-file staging: clean boilerplate + import-only files
      for (const candidate of boilerplateCandidates) {
        if (cleanBoilerplate.has(candidate)) {
          staged.push(candidate);
        } else {
          skipped.push(candidate);
        }
      }
      for (const f of importOnlyFiles) {
        staged.push(f);
      }

      // Partial staging: apply import-only hunks to index
      for (const [file, patch] of partialImportPatches) {
        if (!data.dryRun) {
          const { ok, error } = await applyPatchToIndex(patch, cwd);
          if (ok) {
            partiallyStaged.push(file);
            logger.debug(`[VIBE-STAGE] Partially staged (imports) ${file}`);
          } else {
            logger.warn(
              `[VIBE-STAGE] Failed to apply import patch for ${file}: ${error}`,
            );
            skipped.push(file);
          }
        } else {
          // dry run: just report what would be partially staged
          partiallyStaged.push(file);
        }
      }

      // git add full files unless dry run
      if (!data.dryRun && staged.length > 0) {
        await runCommand("git", ["add", "--", ...staged], cwd);
        logger.debug(`[VIBE-STAGE] Staged ${String(staged.length)} files`);
      }

      const message =
        data.dryRun && (staged.length > 0 || partiallyStaged.length > 0)
          ? t("response.dryRunNote")
          : undefined;

      return success({ staged, partiallyStaged, skipped, message });
    } catch (err) {
      logger.error(`[VIBE-STAGE] Error: ${parseError(err)}`);
      return fail({
        message: t("errors.internal.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
