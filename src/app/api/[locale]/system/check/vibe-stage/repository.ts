/**
 * Vibe Stage Repository
 *
 * Finds unstaged boilerplate candidates (route.ts, i18n/{en,de,pl}/index.ts),
 * runs the boilerplate oxlint plugin on them, and git-adds files with 0 violations.
 */

import "server-only";

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { promises as fsp } from "node:fs";
import { resolve as resolvePath } from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
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

const SUPPRESSION_PATTERN =
  /eslint-disable|oxlint-disable|@ts-expect-error|@ts-ignore|@ts-nocheck/;

// Matches the opening line of a TS/JS import statement
const IMPORT_START_PATTERN = /^import[\s{"'*]/;
// Matches the closing line of a multi-line import: } from "..."
const IMPORT_CLOSE_PATTERN = /^}\s*from\s+["'`]/;
// Matches continuation lines inside a multi-line import block (indented or closing brace)
const IMPORT_CONTINUATION_PATTERN = /^[\s}]/;

/**
 * Returns true if a single changed line belongs to an import statement.
 * Tracks state across lines via `insideMultilineImport` (passed by reference via object).
 * Works per-sigil (+ and - lines are evaluated independently so replacements work correctly).
 */
function isImportLine(
  line: string,
  state: { inside: boolean },
): boolean {
  if (state.inside) {
    if (IMPORT_CLOSE_PATTERN.test(line)) {
      state.inside = false;
      return true;
    }
    if (IMPORT_CONTINUATION_PATTERN.test(line)) {
      return true;
    }
    // Unexpected line while inside a multiline block — reset and re-evaluate
    state.inside = false;
  }

  // `} from "..."` can appear as the start of a hunk when the `import {` opener
  // didn't change — always treat it as an import line.
  if (IMPORT_CLOSE_PATTERN.test(line)) {
    return true;
  }

  if (IMPORT_START_PATTERN.test(line)) {
    if (line.includes("{") && !line.includes("}")) {
      state.inside = true;
    }
    return true;
  }

  return false;
}

/**
 * Returns true if every changed line in the array belongs to an import statement.
 * Evaluates + and - lines with independent state so replacements (- old + new) work correctly.
 */
function allLinesAreImports(changedLines: string[]): boolean {
  const removedState = { inside: true }; // start inside=true for mid-block hunks
  const addedState = { inside: true };

  for (const raw of changedLines) {
    const sigil = raw[0];
    const line = raw.slice(1).trimStart();
    const state = sigil === "-" ? removedState : addedState;
    if (!isImportLine(line, state)) {return false;}
  }

  return true;
}

function isBoilerplateCandidate(filePath: string): boolean {
  return (
    ROUTE_PATTERN.test(filePath) ||
    I18N_LANG_PATTERN.test(filePath) ||
    I18N_INDEX_PATTERN.test(filePath) ||
    GENERATED_PATTERN.test(filePath)
  );
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
 * Parse unified diff output for a single file and classify unstaged changes.
 *
 * Strategy:
 *  1. Get full diff (WC vs HEAD) — correct line numbers for `git apply --cached`.
 *  2. Get staged diff (index vs HEAD) — hunks already in the index.
 *  3. Subtract already-staged hunks from the full diff (by target-range start).
 *  4. Classify remaining hunks: import-only → patch; mixed → skip.
 *
 * Returns null if there are no unstaged changes to process.
 */
async function analyzeFileDiff(
  filePath: string,
  cwd: string,
): Promise<{
  importOnly: boolean;
  importHunksPatch: string | null;
} | null> {
  // U0: classify with zero context — each atomic change is its own hunk, so import
  // changes near non-import changes aren't merged into a combined hunk.
  // We apply U0 hunks with --unidiff-zero --3way so git tolerates zero context
  // and handles index/HEAD drift without failing.
  const [u0Full, u0Staged] = await Promise.all([
    runCommandCapture(
      "git",
      ["diff", "HEAD", "--unified=0", "--", filePath],
      cwd,
    ),
    runCommandCapture(
      "git",
      ["diff", "--cached", "HEAD", "--unified=0", "--", filePath],
      cwd,
    ),
  ]);

  if (!u0Full.trim()) {
    return null;
  }

  const u0Parsed = parseDiff(u0Full);
  if (!u0Parsed || u0Parsed.hunks.length === 0) {
    return null;
  }

  // Build set of already-staged hunk starts (U0) so we don't re-classify staged hunks
  const stagedStarts = new Set<number>();
  if (u0Staged.trim()) {
    const stagedParsed = parseDiff(u0Staged);
    if (stagedParsed) {
      for (const hunk of stagedParsed.hunks) {
        const start = hunkNewStart(hunk[0] ?? "");
        if (start >= 0) {
          stagedStarts.add(start);
        }
      }
    }
  }

  // Classify U0 hunks: import-only vs non-import, excluding already-staged
  const importOnlyU0Starts = new Set<number>();
  let hasNonImportHunk = false;
  let hasUnstagedHunk = false;

  for (const hunk of u0Parsed.hunks) {
    const start = hunkNewStart(hunk[0] ?? "");
    if (stagedStarts.has(start)) {
      continue;
    } // already in index
    hasUnstagedHunk = true;

    const changedLines = hunk
      .slice(1)
      .filter((l) => l.startsWith("+") || l.startsWith("-"));
    if (allLinesAreImports(changedLines) && changedLines.length > 0) {
      importOnlyU0Starts.add(start);
    } else {
      hasNonImportHunk = true;
    }
  }

  if (!hasUnstagedHunk) {
    return null;
  }

  const importOnly = !hasNonImportHunk && importOnlyU0Starts.size > 0;

  if (importOnly) {
    return { importOnly: true, importHunksPatch: null };
  }

  if (importOnlyU0Starts.size === 0) {
    return { importOnly: false, importHunksPatch: null };
  }

  // Build patch from the U0 import-only hunks directly.
  // We use --unidiff-zero on the apply side so zero-context hunks are accepted,
  // and --3way so git can handle index/HEAD drift without failing.
  const importOnlyU0Hunks = u0Parsed.hunks.filter((hunk) => {
    const start = hunkNewStart(hunk[0] ?? "");
    return importOnlyU0Starts.has(start);
  });

  const patchLines = [...u0Parsed.headerLines, ...importOnlyU0Hunks.flat(), ""];
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
      [
        "apply",
        "--cached",
        "--3way",
        "--unidiff-zero",
        "--whitespace=nowarn",
        "-",
      ],
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
 * Returns true if the file contains any suppression comments.
 * Files with suppressions are banned from auto-staging.
 */
async function hasSuppression(filePath: string, cwd: string): Promise<boolean> {
  try {
    const content = await fsp.readFile(resolvePath(cwd, filePath), "utf8");
    return SUPPRESSION_PATTERN.test(content);
  } catch {
    return false;
  }
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
    const filePath = line.slice(3).trim();

    // Include modified unstaged (M), untracked (?), or added unstaged (A)
    if (
      unstagedStatus === "M" ||
      unstagedStatus === "A" ||
      unstagedStatus === "?"
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

      // Filter out files with suppression comments — banned from auto-staging
      const suppressionChecks = await Promise.all(
        allFiles.map(async (f) => ({
          file: f,
          suppressed: await hasSuppression(f, cwd),
        })),
      );
      const suppressedFiles = new Set<string>(
        suppressionChecks.filter((r) => r.suppressed).map((r) => r.file),
      );
      allFiles = allFiles.filter((f) => !suppressedFiles.has(f));

      logger.debug(
        `[VIBE-STAGE] ${String(suppressedFiles.size)} candidates skipped (suppression comments)`,
      );

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
      // Suppressed files go straight to skipped
      const skipped: string[] = [...suppressedFiles];

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
            logger.info(`[VIBE-STAGE] Partially staged (imports) ${file}`);
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
        logger.info(`[VIBE-STAGE] Staged ${String(staged.length)} files`);
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
