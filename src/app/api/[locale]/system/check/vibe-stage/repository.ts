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

const SUPPRESSION_PATTERN =
  /eslint-disable|oxlint-disable|@ts-expect-error|@ts-ignore|@ts-nocheck/;

function isBoilerplateCandidate(filePath: string): boolean {
  return (
    ROUTE_PATTERN.test(filePath) ||
    I18N_LANG_PATTERN.test(filePath) ||
    I18N_INDEX_PATTERN.test(filePath)
  );
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

      // Filter to boilerplate candidates
      const rawPaths = data.paths;
      const pathFilters: string[] = rawPaths
        ? Array.isArray(rawPaths)
          ? rawPaths
          : [rawPaths]
        : [];

      let candidates = unstagedFiles.filter(isBoilerplateCandidate);

      if (pathFilters.length > 0) {
        candidates = candidates.filter((f) =>
          pathFilters.some((p) => f.startsWith(p)),
        );
      }

      // Filter out files with suppression comments — banned from auto-staging
      const suppressionChecks = await Promise.all(
        candidates.map(async (f) => ({
          file: f,
          suppressed: await hasSuppression(f, cwd),
        })),
      );
      const suppressedFiles = new Set<string>(
        suppressionChecks.filter((r) => r.suppressed).map((r) => r.file),
      );
      candidates = candidates.filter((f) => !suppressedFiles.has(f));

      logger.debug(
        `[VIBE-STAGE] ${String(suppressedFiles.size)} candidates skipped (suppression comments)`,
      );
      logger.debug(
        `[VIBE-STAGE] ${String(candidates.length)} boilerplate candidates`,
      );

      if (candidates.length === 0) {
        return success({
          staged: [],
          skipped: [],
          message: t("response.noChanges"),
        });
      }

      // Ensure config is ready so the boilerplate plugin can resolve
      await ConfigRepositoryImpl.ensureConfigReady(logger, locale, false);

      // Check compliance
      const cleanFiles = await checkBoilerplateCompliance(
        candidates,
        cwd,
        logger,
      );

      const staged: string[] = [];
      // Suppressed files go straight to skipped
      const skipped: string[] = [...suppressedFiles];

      for (const candidate of candidates) {
        if (cleanFiles.has(candidate)) {
          staged.push(candidate);
        } else {
          skipped.push(candidate);
        }
      }

      // git add clean files unless dry run
      if (!data.dryRun && staged.length > 0) {
        await runCommand("git", ["add", "--", ...staged], cwd);
        logger.info(`[VIBE-STAGE] Staged ${String(staged.length)} files`);
      }

      const message =
        data.dryRun && staged.length > 0 ? t("response.dryRunNote") : undefined;

      return success({ staged, skipped, message });
    } catch (err) {
      logger.error(`[VIBE-STAGE] Error: ${parseError(err)}`);
      return fail({
        message: t("errors.internal.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
