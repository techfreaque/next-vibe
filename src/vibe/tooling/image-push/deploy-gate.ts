/**
 * Pre-build deploy safety gate for `vibe image-push`.
 *
 * Runs inside the exported commit directory (`.tmp/image-build/<fullsha>/`)
 * BEFORE `docker buildx` starts:
 *   1. Verifies generated output is not stale (`vibe gen --force=true` + git diff).
 *   2. Runs the repo-wide `vibe check` and fails on any error OR incomplete run
 *      (signal kill / OOM SIGKILL / `FAILED TO RUN` in output).
 *
 * On pass, writes a sibling `<fullsha>.checked` marker outside the build
 * context so subsequent builds of the exact same commit skip the gate.
 * `--skipCheck=<reason>` bypasses the gate with an explicit logged warning and
 * never writes the `.checked` marker.
 *
 * Every temporary gate artifact (`node_modules` symlink, `.git`, `.tmp`,
 * temporary `.env`, untracked generated files) is restored/parked to
 * `.tmp/todelete/image-build-gate/` in a `finally` block (never `rm`ed) so the
 * Docker build context always matches the exact committed tree.
 */

import "server-only";

import { spawn } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  renameSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve as resolvePath } from "node:path";

import type { ResponseType } from "../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../core/route/response.schema";
import { parseError } from "../../core/utils/parse-error";
import type { EndpointLogger } from "../../logger/types";
import type { ImagePushT } from "./i18n";

export const CHECKED_MARKER_SUFFIX = ".checked" as const;
export const GATE_DIRTY_MARKER_SUFFIX = ".gate-dirty" as const;

const VIBE_RUNTIME_REL = join(
  "src",
  "vibe",
  "platforms",
  "cli",
  "vibe-runtime.ts",
);
const MAX_STALE_FILES_IN_MESSAGE = 20;
const MAX_CAPTURED_OUTPUT_BYTES = 10 * 1024 * 1024;

const ESC = String.fromCharCode(27);
const BEL = String.fromCharCode(7);
const ANSI_OSC_PATTERN = new RegExp(
  `${ESC}\\][^${BEL}]*(?:${BEL}|${ESC}\\\\)`,
  "g",
);
const ANSI_CSI_PATTERN = new RegExp(`${ESC}\\[[0-9;?]*[ -/]*[@-~]`, "g");

export interface GateCommandResult {
  exitCode: number | null;
  signal: NodeJS.Signals | null;
  output: string;
  error?: string;
}

export type GateVerdict =
  | { ok: true }
  | {
      ok: false;
      kind: "incomplete" | "errors" | "stale";
      detail: string;
      staleFiles?: string[];
    };

export type DeployGateDecision =
  | { action: "skip"; reason: string }
  | { action: "cached" }
  | { action: "run" };

export interface DeployGateResult {
  status: "passed" | "cached" | "skipped";
  reason?: string;
}

export interface RunDeployGateParams {
  sha: string;
  shortSha: string;
  contextDir: string;
  buildRoot: string;
  repoRoot: string;
  skipCheck: string | undefined;
}

export interface GateCommandOptions {
  cwd: string;
  env?: NodeJS.ProcessEnv;
  streamOutput?: boolean;
}

export interface DeployGateDeps {
  runCommand: (
    command: string,
    args: string[],
    options: GateCommandOptions,
  ) => Promise<GateCommandResult>;
  exists: (path: string) => boolean;
  lstatExists: (path: string) => boolean;
  mkdir: (path: string) => void;
  writeFile: (path: string, content: string) => void;
  copyFile: (src: string, dest: string) => void;
  symlink: (target: string, path: string) => void;
  rename: (oldPath: string, newPath: string) => void;
  now: () => number;
  isoNow: () => string;
  bunExecutable: string;
}

/** Sibling cache marker written outside `.tmp/image-build/<fullsha>/` on pass. */
export function checkedMarkerPath(buildRoot: string, sha: string): string {
  return join(buildRoot, `${sha}${CHECKED_MARKER_SUFFIX}`);
}

/**
 * Sibling marker held while the gate is mutating `.tmp/image-build/<fullsha>/`.
 * If the process dies before `finally` restores the export, the next run sees
 * this marker and re-exports a clean tree from `git archive`.
 */
export function gateDirtyMarkerPath(buildRoot: string, sha: string): string {
  return join(buildRoot, `${sha}${GATE_DIRTY_MARKER_SUFFIX}`);
}

/** Strips ANSI color/cursor CSI sequences and OSC-8 hyperlink sequences. */
export function stripAnsi(text: string): string {
  return text.replace(ANSI_OSC_PATTERN, "").replace(ANSI_CSI_PATTERN, "");
}

/**
 * Parses `git status --porcelain` lines into file paths without stripping
 * leading status-column spaces.
 */
export function parsePorcelainPaths(statusOutput: string): string[] {
  const paths: string[] = [];
  for (const rawLine of statusOutput.split(/\r?\n/)) {
    if (rawLine.length < 4) {
      continue;
    }
    const payload = rawLine.slice(3).trim();
    if (!payload) {
      continue;
    }
    const arrowIdx = payload.indexOf(" -> ");
    const filePath = arrowIdx >= 0 ? payload.slice(arrowIdx + 4) : payload;
    const unquoted =
      filePath.startsWith('"') && filePath.endsWith('"')
        ? filePath.slice(1, -1)
        : filePath;
    if (unquoted) {
      paths.push(unquoted);
    }
  }
  return paths;
}

/**
 * Decides whether the deploy gate should skip (`--skipCheck`), reuse a passing
 * `<fullsha>.checked` cache marker, or run the full checks.
 */
export function decideDeployGateAction(params: {
  skipCheck: string | undefined;
  hasCheckedMarker: boolean;
}): DeployGateDecision {
  const trimmedReason = params.skipCheck?.trim();
  if (trimmedReason) {
    return { action: "skip", reason: trimmedReason };
  }
  if (params.hasCheckedMarker) {
    return { action: "cached" };
  }
  return { action: "run" };
}

/**
 * Builds the environment for child `vibe` invocations inside the exported tree.
 * Clears parent-process root/mode overrides so the child anchors on `cwd`
 * (the exported commit dir) instead of the live working tree.
 */
export function buildGateChildEnv(
  baseEnv: NodeJS.ProcessEnv,
): NodeJS.ProcessEnv {
  const childEnv: NodeJS.ProcessEnv = { ...baseEnv };
  delete childEnv.PROJECT_ROOT;
  delete childEnv.VIBE_START_TIME;
  delete childEnv.IS_PREVIEW_MODE;
  delete childEnv.VIBE_BUILD_PLACEHOLDER_ENV;
  return childEnv;
}

/**
 * Evaluates a repo-wide `vibe check` run.
 * Fails on:
 * - spawn error
 * - signal termination (e.g. OOM SIGKILL)
 * - `FAILED TO RUN` anywhere in stdout/stderr (even if exit code was 0)
 * - `No files found to lint` (silently skipped lint pass)
 * - non-zero exit code
 * - non-zero error count reported in output
 * - exit 0 with no confirmation that checkers actually ran
 */
export function evaluateVibeCheckResult(run: GateCommandResult): GateVerdict {
  if (run.error) {
    return {
      ok: false,
      kind: "incomplete",
      detail: `failed to spawn vibe check: ${run.error}`,
    };
  }
  if (run.signal !== null) {
    return {
      ok: false,
      kind: "incomplete",
      detail: `vibe check terminated by signal ${run.signal}`,
    };
  }

  const clean = stripAnsi(run.output);

  if (/FAILED TO RUN/i.test(clean)) {
    return {
      ok: false,
      kind: "incomplete",
      detail:
        "vibe check output contains FAILED TO RUN (checker did not complete)",
    };
  }

  if (clean.includes("No files found to lint")) {
    return {
      ok: false,
      kind: "incomplete",
      detail: "oxlint reported 'No files found to lint' in exported commit",
    };
  }

  if (run.exitCode === 137) {
    return {
      ok: false,
      kind: "incomplete",
      detail: "vibe check exited with code 137 (likely OOM SIGKILL)",
    };
  }

  const errorsMatch = /Errors:\s*([1-9]\d*)/.exec(clean);
  if (run.exitCode !== 0) {
    const countNote = errorsMatch ? ` (${errorsMatch[1]} error(s))` : "";
    return {
      ok: false,
      kind: "errors",
      detail: `vibe check exited with code ${String(run.exitCode ?? -1)}${countNote}`,
    };
  }

  if (errorsMatch) {
    return {
      ok: false,
      kind: "errors",
      detail: `vibe check reported ${errorsMatch[1]} error(s)`,
    };
  }

  const confirmedClean =
    clean.includes("No issues found") ||
    /(?:Oxlint|TypeScript|ESLint)\s+\d+\s+issues?/.test(clean);
  if (!confirmedClean) {
    return {
      ok: false,
      kind: "incomplete",
      detail: "vibe check exited 0 without reporting completed checker results",
    };
  }

  return { ok: true };
}

/**
 * Evaluates `vibe gen --force=true` followed by `git status --porcelain`.
 * Fails if generation crashed/failed OR produced any diff against the exported commit.
 */
export function evaluateVibeGenResult(
  run: GateCommandResult,
  statusOutput: string,
): GateVerdict {
  if (run.error) {
    return {
      ok: false,
      kind: "incomplete",
      detail: `failed to spawn vibe gen: ${run.error}`,
    };
  }
  if (run.signal !== null) {
    return {
      ok: false,
      kind: "incomplete",
      detail: `vibe gen terminated by signal ${run.signal}`,
    };
  }
  const clean = stripAnsi(run.output);
  if (run.exitCode !== 0) {
    return {
      ok: false,
      kind: "errors",
      detail: `vibe gen exited with code ${String(run.exitCode ?? -1)}`,
    };
  }
  if (
    clean.includes("Generators failed") ||
    clean.includes("Generation failed")
  ) {
    return {
      ok: false,
      kind: "errors",
      detail: "vibe gen reported generator failures",
    };
  }

  const staleFiles = parsePorcelainPaths(statusOutput);
  if (staleFiles.length > 0) {
    const shown = staleFiles.slice(0, MAX_STALE_FILES_IN_MESSAGE);
    const extra = staleFiles.length - shown.length;
    const fileList =
      extra > 0
        ? `${shown.join(", ")} (+${String(extra)} more)`
        : shown.join(", ");
    return {
      ok: false,
      kind: "stale",
      detail: fileList,
      staleFiles,
    };
  }

  return { ok: true };
}

function lstatExistsDefault(path: string): boolean {
  try {
    lstatSync(path);
    return true;
  } catch {
    return false;
  }
}

async function runCommandDefault(
  command: string,
  args: string[],
  options: GateCommandOptions,
): Promise<GateCommandResult> {
  return await new Promise<GateCommandResult>((resolve) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: options.env ?? process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let output = "";
    const appendOutput = (chunk: Buffer): void => {
      const text = chunk.toString("utf-8");
      if (output.length < MAX_CAPTURED_OUTPUT_BYTES) {
        output += text;
      } else {
        // Keep tail so final summary / FAILED TO RUN lines are never truncated away.
        output = `${output.slice(output.length - MAX_CAPTURED_OUTPUT_BYTES / 2)}${text}`;
      }
    };

    child.stdout?.on("data", (chunk: Buffer) => {
      appendOutput(chunk);
      if (options.streamOutput) {
        process.stdout.write(chunk);
      }
    });

    child.stderr?.on("data", (chunk: Buffer) => {
      appendOutput(chunk);
      if (options.streamOutput) {
        process.stderr.write(chunk);
      }
    });

    child.on("error", (err) => {
      resolve({
        exitCode: null,
        signal: null,
        output,
        error: err.message,
      });
    });

    child.on("close", (code, signal) => {
      resolve({
        exitCode: code,
        signal,
        output,
      });
    });
  });
}

function defaultDeps(): DeployGateDeps {
  return {
    runCommand: runCommandDefault,
    exists: (path: string): boolean => existsSync(path),
    lstatExists: lstatExistsDefault,
    mkdir: (path: string): void => {
      mkdirSync(path, { recursive: true });
    },
    writeFile: (path: string, content: string): void => {
      writeFileSync(path, content, "utf-8");
    },
    copyFile: (src: string, dest: string): void => {
      copyFileSync(src, dest);
    },
    symlink: (target: string, path: string): void => {
      symlinkSync(target, path);
    },
    rename: (oldPath: string, newPath: string): void => {
      renameSync(oldPath, newPath);
    },
    now: (): number => Date.now(),
    isoNow: (): string => new Date().toISOString(),
    bunExecutable: process.execPath.endsWith("bun") ? process.execPath : "bun",
  };
}

function parkIfPresent(
  sourcePath: string,
  parkDestPath: string,
  deps: DeployGateDeps,
): void {
  if (!deps.lstatExists(sourcePath)) {
    return;
  }
  deps.mkdir(dirname(parkDestPath));
  deps.rename(sourcePath, parkDestPath);
}

/**
 * Runs the mandatory pre-build deploy safety gate inside `.tmp/image-build/<fullsha>/`.
 */
export async function runDeployGate(
  params: RunDeployGateParams,
  logger: EndpointLogger,
  t: ImagePushT,
  depOverrides?: Partial<DeployGateDeps>,
): Promise<ResponseType<DeployGateResult>> {
  const deps: DeployGateDeps = { ...defaultDeps(), ...depOverrides };
  const { sha, shortSha, contextDir, buildRoot, repoRoot, skipCheck } = params;
  const checkedMarker = checkedMarkerPath(buildRoot, sha);
  const dirtyMarker = gateDirtyMarkerPath(buildRoot, sha);

  const decision = decideDeployGateAction({
    skipCheck,
    hasCheckedMarker: deps.exists(checkedMarker),
  });

  if (decision.action === "skip") {
    logger.warn(
      t("post.repository.messages.gateSkipped", {
        sha: shortSha,
        reason: decision.reason,
      }),
    );
    return success({ status: "skipped", reason: decision.reason });
  }

  if (decision.action === "cached") {
    logger.info(
      t("post.repository.messages.gateCached", {
        sha: shortSha,
        marker: checkedMarker,
      }),
    );
    return success({ status: "cached" });
  }

  const setupFail = (error: string): ResponseType<DeployGateResult> => {
    logger.error("Deploy safety gate setup failed", {
      sha,
      contextDir,
      error,
    });
    return fail({
      message: t("post.repository.messages.gateSetupFailed", {
        sha: shortSha,
        error,
      }),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  };

  const repoNodeModules = join(repoRoot, "node_modules");
  if (!deps.exists(repoNodeModules)) {
    return setupFail(`node_modules not found at ${repoNodeModules}`);
  }

  const vibeRuntimePath = join(contextDir, VIBE_RUNTIME_REL);
  if (!deps.exists(vibeRuntimePath)) {
    return setupFail(`${VIBE_RUNTIME_REL} missing from exported commit`);
  }

  const parkRoot = join(
    repoRoot,
    ".tmp",
    "todelete",
    "image-build-gate",
    `${sha}-${String(deps.now())}`,
  );
  const exportNodeModules = join(contextDir, "node_modules");
  const exportEnv = join(contextDir, ".env");
  const exportEnvExample = join(contextDir, ".env.example");
  const exportGit = join(contextDir, ".git");
  const exportTmp = join(contextDir, ".tmp");

  let createdNodeModulesSymlink = false;
  let createdEnvFile = false;
  let initializedGit = false;

  try {
    deps.mkdir(buildRoot);
    deps.writeFile(dirtyMarker, `${deps.isoNow()}\n`);
  } catch (error) {
    return setupFail(parseError(error).message);
  }

  let gateResult: ResponseType<DeployGateResult>;

  try {
    // 1. Symlink node_modules from the live repo (same strategy as headcheck.sh).
    if (deps.lstatExists(exportNodeModules)) {
      parkIfPresent(
        exportNodeModules,
        join(parkRoot, "pre-existing", "node_modules"),
        deps,
      );
    }
    deps.symlink(repoNodeModules, exportNodeModules);
    createdNodeModulesSymlink = true;

    // 2. Anchor vibe CLI's loadEnvironment() to contextDir so it never walks up
    //    to the parent repo's .env and chdirs out of the exported tree.
    if (!deps.lstatExists(exportEnv)) {
      if (deps.exists(exportEnvExample)) {
        deps.copyFile(exportEnvExample, exportEnv);
      } else {
        deps.writeFile(exportEnv, "");
      }
      createdEnvFile = true;
    }

    // 3. Initialize a scratch git baseline inside contextDir:
    //    - Stops oxlint/oxfmt from inheriting the parent repo's `/.tmp` gitignore.
    //    - Gives an exact baseline to detect generated-file drift from `vibe gen`
    //      and restore any mutations before Docker builds contextDir.
    if (deps.lstatExists(exportGit)) {
      parkIfPresent(exportGit, join(parkRoot, "pre-existing", ".git"), deps);
    }
    const gitInit = await deps.runCommand("git", ["init", "-q"], {
      cwd: contextDir,
    });
    if (gitInit.error || gitInit.exitCode !== 0) {
      gateResult = setupFail(
        gitInit.error ??
          `git init exited with code ${String(gitInit.exitCode ?? -1)}`,
      );
      return gateResult;
    }
    initializedGit = true;

    const gitAdd = await deps.runCommand("git", ["add", "-A"], {
      cwd: contextDir,
    });
    if (gitAdd.error || gitAdd.exitCode !== 0) {
      gateResult = setupFail(
        gitAdd.error ??
          `git add exited with code ${String(gitAdd.exitCode ?? -1)}`,
      );
      return gateResult;
    }

    const gitCommit = await deps.runCommand(
      "git",
      [
        "-c",
        "user.name=vibe-gate",
        "-c",
        "user.email=gate@vibe.local",
        "-c",
        "commit.gpgsign=false",
        "commit",
        "-q",
        "--no-verify",
        "-m",
        "export",
      ],
      { cwd: contextDir },
    );
    if (gitCommit.error || gitCommit.exitCode !== 0) {
      gateResult = setupFail(
        gitCommit.error ??
          `git commit baseline exited with code ${String(gitCommit.exitCode ?? -1)}`,
      );
      return gateResult;
    }

    const childEnv = buildGateChildEnv(process.env);

    // 4. Verify generated output is not stale: run `vibe gen --force=true` in the
    //    exported tree before `vibe check` (so check --fix cannot cloud the diff).
    logger.info(t("post.repository.messages.gateGenStart", { sha: shortSha }));
    const genRun = await deps.runCommand(
      deps.bunExecutable,
      [vibeRuntimePath, "gen", "--force=true"],
      { cwd: contextDir, env: childEnv, streamOutput: true },
    );

    const statusRun = await deps.runCommand(
      "git",
      ["status", "--porcelain", "-uall"],
      { cwd: contextDir },
    );
    if (statusRun.error || statusRun.exitCode !== 0) {
      gateResult = fail({
        message: t("post.repository.messages.gateGenFailed", {
          sha: shortSha,
          error:
            statusRun.error ??
            `git status exited with code ${String(statusRun.exitCode ?? -1)}`,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
      return gateResult;
    }

    const genVerdict = evaluateVibeGenResult(genRun, statusRun.output);
    if (!genVerdict.ok) {
      if (genVerdict.kind === "stale") {
        const staleFiles = genVerdict.staleFiles ?? [];
        logger.error("Deploy blocked: generated files are stale", {
          sha,
          count: staleFiles.length,
          files: staleFiles,
        });
        gateResult = fail({
          message: t("post.repository.messages.gateGenStale", {
            sha: shortSha,
            count: staleFiles.length,
            files: genVerdict.detail,
          }),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
        return gateResult;
      }
      logger.error("Deploy blocked: vibe gen failed", {
        sha,
        detail: genVerdict.detail,
      });
      gateResult = fail({
        message: t("post.repository.messages.gateGenFailed", {
          sha: shortSha,
          error: genVerdict.detail,
        }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
      return gateResult;
    }
    logger.info(t("post.repository.messages.gateGenPassed", { sha: shortSha }));

    // 5. Run repo-wide `vibe check` inside the exported commit tree.
    logger.info(
      t("post.repository.messages.gateCheckStart", { sha: shortSha }),
    );
    const checkRun = await deps.runCommand(
      deps.bunExecutable,
      [vibeRuntimePath, "check"],
      { cwd: contextDir, env: childEnv, streamOutput: true },
    );

    const checkVerdict = evaluateVibeCheckResult(checkRun);
    if (!checkVerdict.ok) {
      logger.error("Deploy blocked: vibe check did not pass", {
        sha,
        kind: checkVerdict.kind,
        detail: checkVerdict.detail,
        exitCode: checkRun.exitCode,
        signal: checkRun.signal,
      });
      gateResult = fail({
        message:
          checkVerdict.kind === "incomplete"
            ? t("post.repository.messages.gateCheckIncomplete", {
                sha: shortSha,
                error: checkVerdict.detail,
              })
            : t("post.repository.messages.gateCheckFailed", {
                sha: shortSha,
                error: checkVerdict.detail,
              }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
      return gateResult;
    }

    logger.info(
      t("post.repository.messages.gateCheckPassed", { sha: shortSha }),
    );
    gateResult = success({ status: "passed" });
  } catch (error) {
    gateResult = setupFail(parseError(error).message);
  } finally {
    // Always restore contextDir back to the untouched git-archive tree and park
    // gate artifacts under .tmp/todelete/image-build-gate/ (never `rm`).
    let cleanedUp = true;
    try {
      const safeExportDir =
        resolvePath(contextDir) !== resolvePath(repoRoot) &&
        deps.lstatExists(exportGit);
      if (initializedGit && safeExportDir) {
        const restore = await deps.runCommand("git", ["checkout", "--", "."], {
          cwd: contextDir,
        });
        if (restore.error || restore.exitCode !== 0) {
          cleanedUp = false;
          logger.warn(
            t("post.repository.messages.gateCleanupWarn", {
              dir: contextDir,
              error:
                restore.error ??
                `git checkout exited with code ${String(restore.exitCode ?? -1)}`,
            }),
          );
        }

        const untracked = await deps.runCommand(
          "git",
          ["status", "--porcelain", "-uall"],
          { cwd: contextDir },
        );
        if (!untracked.error && untracked.exitCode === 0) {
          for (const relPath of parsePorcelainPaths(untracked.output)) {
            parkIfPresent(
              join(contextDir, relPath),
              join(parkRoot, "untracked", relPath),
              deps,
            );
          }
        } else {
          cleanedUp = false;
        }
      }

      if (createdNodeModulesSymlink) {
        parkIfPresent(exportNodeModules, join(parkRoot, "node_modules"), deps);
      }
      if (createdEnvFile) {
        parkIfPresent(exportEnv, join(parkRoot, ".env"), deps);
      }
      if (initializedGit) {
        parkIfPresent(exportGit, join(parkRoot, ".git"), deps);
      }
      parkIfPresent(exportTmp, join(parkRoot, ".tmp"), deps);

      if (cleanedUp) {
        parkIfPresent(
          dirtyMarker,
          join(parkRoot, `${sha}${GATE_DIRTY_MARKER_SUFFIX}`),
          deps,
        );
      }
    } catch (cleanupError) {
      cleanedUp = false;
      logger.warn(
        t("post.repository.messages.gateCleanupWarn", {
          dir: contextDir,
          error: parseError(cleanupError).message,
        }),
      );
    }
  }

  if (gateResult.success) {
    try {
      deps.writeFile(checkedMarker, `${deps.isoNow()}\n`);
    } catch (error) {
      logger.warn(
        t("post.repository.messages.gateMarkerWarn", {
          sha: shortSha,
          path: checkedMarker,
          error: parseError(error).message,
        }),
      );
    }
    logger.info(t("post.repository.messages.gatePassed", { sha: shortSha }));
  }

  return gateResult;
}
