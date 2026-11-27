/**
 * Visual Installer Repository
 * Merges the resumable installer state file with live local environment probes
 * and handles optional private GitHub repository setup via gh device flow.
 */

import "server-only";

import { type ChildProcess, execFile, spawn } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";

import { z } from "zod";

import { coreEnv } from "../../core/env";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "../../core/route/response.schema";
import { parseError } from "../../core/utils/parse-error";
import type { EndpointLogger } from "../../logger/types";
import { SystemSettingsRepository } from "../settings/repository";
import { SetupStatusRepository } from "../settings/setup-status";
import type {
  InstallerGetResponseOutput,
  InstallerPostRequestOutput,
  InstallerPostResponseOutput,
  InstallerStepId,
} from "./definition";
import {
  InstallerAction,
  InstallerCheckoutMode,
  InstallerStepStatus,
} from "./enum";
import type { InstallerT } from "./i18n";

const UPSTREAM_REPO_URL = "https://github.com/techfreaque/next-vibe.git";
const GITHUB_DEVICE_URL = "https://github.com/login/device";
const DEFAULT_PRIVATE_REPO_NAME = "next-vibe-private";
const REPO_NAME_PATTERN = /^[a-zA-Z0-9._-]{1,100}$/;
const DEVICE_CODE_PATTERN = /\b([A-Z0-9]{4}-[A-Z0-9]{4})\b/;
const DEVICE_LOGIN_TTL_MS = 10 * 60 * 1000;
const COMMAND_TIMEOUT_MS = 12_000;
const PUSH_TIMEOUT_MS = 60_000;

const persistedStateSchema = z.object({
  version: z.number().optional(),
  startedAt: z.string().optional(),
  updatedAt: z.string().optional(),
  os: z.string().optional(),
  arch: z.string().optional(),
  installDir: z.string().optional(),
  repoUrl: z.string().optional(),
  checkoutMode: z.string().optional(),
  port: z.number().optional(),
  url: z.string().optional(),
  steps: z
    .object({
      git: z.string().optional(),
      bun: z.string().optional(),
      clone: z.string().optional(),
      dependencies: z.string().optional(),
      github: z.string().optional(),
      server: z.string().optional(),
    })
    .optional(),
  versions: z
    .object({
      git: z.string().optional(),
      bun: z.string().optional(),
    })
    .optional(),
  github: z
    .object({
      status: z.string().optional(),
      repoUrl: z.string().optional(),
      skipped: z.boolean().optional(),
    })
    .optional(),
  lastError: z.string().optional(),
});

export type PersistedInstallerState = z.infer<typeof persistedStateSchema>;

interface DeviceLoginSession {
  proc: ChildProcess;
  code: string;
  verificationUrl: string;
  startedAt: number;
  finished: boolean;
}

let activeDeviceSession: DeviceLoginSession | null = null;

interface CommandResult {
  ok: boolean;
  stdout: string;
  stderr: string;
  code: number | null;
}

function runExecFile(
  command: string,
  args: readonly string[],
  options?: { cwd?: string; timeoutMs?: number },
): Promise<CommandResult> {
  return new Promise((resolve) => {
    execFile(
      command,
      [...args],
      {
        cwd: options?.cwd,
        timeout: options?.timeoutMs ?? COMMAND_TIMEOUT_MS,
        maxBuffer: 1024 * 1024,
        env: {
          ...process.env,
          GIT_TERMINAL_PROMPT: "0",
        },
      },
      (error, stdout, stderr) => {
        if (!error) {
          resolve({
            ok: true,
            stdout: stdout.trim(),
            stderr: stderr.trim(),
            code: 0,
          });
          return;
        }
        const exitCode = typeof error.code === "number" ? error.code : 1;
        resolve({
          ok: false,
          stdout: stdout.trim(),
          stderr: stderr.trim() || error.message,
          code: exitCode,
        });
      },
    );
  });
}

function getProjectRoot(): string {
  return path.resolve(coreEnv.PROJECT_ROOT ?? process.cwd());
}

export function resolveInstallerStatePath(projectRoot: string): string {
  const fromEnv = process.env["VIBE_INSTALLER_STATE_FILE"];
  if (fromEnv && fromEnv.trim().length > 0) {
    return path.resolve(fromEnv.trim());
  }
  return path.join(projectRoot, ".tmp", "installer-state.json");
}

function resolveOsStatePath(): string {
  if (process.platform === "win32") {
    const base =
      process.env["LOCALAPPDATA"] ??
      path.join(os.homedir(), "AppData", "Local");
    return path.join(base, "next-vibe", "installer-state.json");
  }
  const base =
    process.env["XDG_STATE_HOME"] ?? path.join(os.homedir(), ".local", "state");
  return path.join(base, "next-vibe", "installer-state.json");
}

export function readPersistedState(
  stateFilePath: string,
  projectRoot: string,
): PersistedInstallerState | null {
  const candidates = [stateFilePath];
  const osPath = resolveOsStatePath();
  if (osPath !== stateFilePath) {
    candidates.push(osPath);
  }
  for (const candidate of candidates) {
    if (!existsSync(candidate)) {
      continue;
    }
    try {
      const raw = readFileSync(candidate, "utf-8");
      const parsed = persistedStateSchema.safeParse(JSON.parse(raw));
      if (!parsed.success) {
        continue;
      }
      // Only adopt the OS-wide fallback state if it belongs to this checkout.
      if (
        candidate !== stateFilePath &&
        parsed.data.installDir &&
        path.resolve(parsed.data.installDir) !== path.resolve(projectRoot)
      ) {
        continue;
      }
      return parsed.data;
    } catch {
      continue;
    }
  }
  return null;
}

export function writePersistedState(
  stateFilePath: string,
  state: PersistedInstallerState,
): void {
  const dir = path.dirname(stateFilePath);
  mkdirSync(dir, { recursive: true });
  const tmpFile = `${stateFilePath}.tmp.${process.pid}.${Date.now()}`;
  writeFileSync(tmpFile, `${JSON.stringify(state, null, 2)}\n`, "utf-8");
  renameSync(tmpFile, stateFilePath);
}

function parsePortFromAppUrl(): number {
  try {
    const parsed = new URL(coreEnv.NEXT_PUBLIC_APP_URL);
    if (parsed.port) {
      const num = parseInt(parsed.port, 10);
      if (!Number.isNaN(num) && num > 0) {
        return num;
      }
    }
  } catch {
    // Fallback below
  }
  return 3000;
}

function normalizeGitHubHttpsUrl(remoteUrl: string): string {
  const trimmed = remoteUrl.trim();
  const sshMatch = /^git@github\.com:([^/]+\/[^/]+?)(?:\.git)?$/i.exec(trimmed);
  if (sshMatch && sshMatch[1]) {
    return `https://github.com/${sshMatch[1]}`;
  }
  const httpsMatch =
    /^https?:\/\/github\.com\/([^/]+\/[^/]+?)(?:\.git)?$/i.exec(trimmed);
  if (httpsMatch && httpsMatch[1]) {
    return `https://github.com/${httpsMatch[1]}`;
  }
  return "";
}

export function isUpstreamNextVibeRemote(remoteUrl: string): boolean {
  const normalized = normalizeGitHubHttpsUrl(remoteUrl).toLowerCase();
  return normalized === "https://github.com/techfreaque/next-vibe";
}

function parseGhUsername(output: string): string {
  const patterns = [
    /Logged in to github\.com account\s+([a-zA-Z0-9-]+)/i,
    /Logged in to github\.com as\s+([a-zA-Z0-9-]+)/i,
    /account\s+([a-zA-Z0-9-]+)\s+\(/i,
  ];
  for (const pattern of patterns) {
    const match = pattern.exec(output);
    if (match && match[1]) {
      return match[1];
    }
  }
  return "";
}

function mapCheckoutMode(
  raw: string | undefined,
): InstallerGetResponseOutput["checkoutMode"] {
  if (raw === "cloned") {
    return InstallerCheckoutMode.CLONED;
  }
  if (raw === "existing") {
    return InstallerCheckoutMode.EXISTING;
  }
  return InstallerCheckoutMode.UNKNOWN;
}

function mapOsName(): string {
  if (process.platform === "darwin") {
    return "macos";
  }
  if (process.platform === "win32") {
    return "windows";
  }
  return "linux";
}

function cleanupExpiredDeviceSession(): void {
  if (!activeDeviceSession) {
    return;
  }
  const expired =
    Date.now() - activeDeviceSession.startedAt > DEVICE_LOGIN_TTL_MS;
  if (activeDeviceSession.finished || expired) {
    try {
      activeDeviceSession.proc.kill();
    } catch {
      // Process already exited
    }
    activeDeviceSession = null;
  }
}

export class InstallerRepository {
  static async isLocalInstallerAllowed(): Promise<boolean> {
    if (SystemSettingsRepository.isDevMode()) {
      return true;
    }
    const setupStatus = await SetupStatusRepository.getStatus();
    return setupStatus.writable;
  }

  private static async probeSnapshot(
    t: InstallerT,
    logger: EndpointLogger,
    overrides?: {
      skipped?: boolean;
      privateRepoUrl?: string;
      lastError?: string;
      persist?: boolean;
    },
  ): Promise<InstallerGetResponseOutput> {
    cleanupExpiredDeviceSession();

    const projectRoot = getProjectRoot();
    const stateFilePath = resolveInstallerStatePath(projectRoot);
    const persisted = readPersistedState(stateFilePath, projectRoot);

    const [
      gitVersionRes,
      bunVersionRes,
      branchRes,
      originRes,
      upstreamRes,
      ghVersionRes,
      setupStatus,
    ] = await Promise.all([
      runExecFile("git", ["--version"], { cwd: projectRoot }),
      runExecFile("bun", ["--version"], { cwd: projectRoot }),
      runExecFile("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
        cwd: projectRoot,
      }),
      runExecFile("git", ["remote", "get-url", "origin"], {
        cwd: projectRoot,
      }),
      runExecFile("git", ["remote", "get-url", "upstream"], {
        cwd: projectRoot,
      }),
      runExecFile("gh", ["--version"], { cwd: projectRoot }),
      SetupStatusRepository.getStatus(),
    ]);

    const ghInstalled = ghVersionRes.ok;
    let ghAuthenticated = false;
    let ghUsername = "";
    if (ghInstalled) {
      const ghAuthRes = await runExecFile("gh", ["auth", "status"], {
        cwd: projectRoot,
      });
      const combined = `${ghAuthRes.stdout}\n${ghAuthRes.stderr}`;
      if (ghAuthRes.ok) {
        ghAuthenticated = true;
        ghUsername = parseGhUsername(combined);
        if (activeDeviceSession) {
          activeDeviceSession.finished = true;
          cleanupExpiredDeviceSession();
        }
      }
    }

    const originUrl = originRes.ok ? originRes.stdout : "";
    const upstreamUrl = upstreamRes.ok ? upstreamRes.stdout : "";
    const branch = branchRes.ok ? branchRes.stdout : "";
    const normalizedOrigin = normalizeGitHubHttpsUrl(originUrl);
    const originIsPersonalGitHub =
      normalizedOrigin.length > 0 && !isUpstreamNextVibeRemote(originUrl);

    const persistedPrivateUrl =
      overrides?.privateRepoUrl ?? persisted?.github?.repoUrl ?? "";
    const privateRepoUrl =
      persistedPrivateUrl || (originIsPersonalGitHub ? normalizedOrigin : "");
    const isPrivateForkConfigured = privateRepoUrl.length > 0;
    const skipped =
      overrides?.skipped !== undefined
        ? overrides.skipped
        : (persisted?.github?.skipped ?? false);

    const hasDeps =
      existsSync(path.join(projectRoot, "node_modules", "chalk")) &&
      existsSync(path.join(projectRoot, "node_modules", "zod"));

    const checkoutMode = mapCheckoutMode(persisted?.checkoutMode);
    const port = persisted?.port ?? parsePortFromAppUrl();
    const updatedAt = new Date().toISOString();
    const lastError =
      overrides?.lastError !== undefined
        ? overrides.lastError
        : (persisted?.lastError ?? "");

    const cloneDetail =
      checkoutMode === InstallerCheckoutMode.CLONED
        ? t("widget.steps.clone.clonedDetail", { dir: projectRoot })
        : checkoutMode === InstallerCheckoutMode.EXISTING
          ? t("widget.steps.clone.existingDetail", { dir: projectRoot })
          : t("widget.steps.clone.unknownDetail", { dir: projectRoot });

    const githubStepStatus = isPrivateForkConfigured
      ? InstallerStepStatus.DONE
      : skipped
        ? InstallerStepStatus.SKIPPED
        : activeDeviceSession && !activeDeviceSession.finished
          ? InstallerStepStatus.IN_PROGRESS
          : InstallerStepStatus.PENDING;

    const githubDetail = isPrivateForkConfigured
      ? t("widget.steps.github.connectedDetail", { url: privateRepoUrl })
      : skipped
        ? t("widget.steps.github.skippedDetail")
        : t("widget.steps.github.pendingDetail");

    const steps: Array<{
      id: InstallerStepId;
      status: InstallerGetResponseOutput["steps"][number]["status"];
      detail: string;
      recovery: string;
    }> = [
      {
        id: "git",
        status: gitVersionRes.ok
          ? InstallerStepStatus.DONE
          : InstallerStepStatus.ERROR,
        detail: gitVersionRes.ok
          ? (gitVersionRes.stdout.split("\n")[0] ?? "git")
          : t("widget.steps.git.missingDetail"),
        recovery: gitVersionRes.ok ? "" : t("widget.steps.git.missingRecovery"),
      },
      {
        id: "bun",
        status: bunVersionRes.ok
          ? InstallerStepStatus.DONE
          : InstallerStepStatus.ERROR,
        detail: bunVersionRes.ok
          ? `bun ${bunVersionRes.stdout.split("\n")[0] ?? ""}`.trim()
          : t("widget.steps.bun.missingDetail"),
        recovery: bunVersionRes.ok ? "" : t("widget.steps.bun.missingRecovery"),
      },
      {
        id: "clone",
        status: InstallerStepStatus.DONE,
        detail: cloneDetail,
        recovery: "",
      },
      {
        id: "dependencies",
        status: hasDeps ? InstallerStepStatus.DONE : InstallerStepStatus.ERROR,
        detail: hasDeps
          ? t("widget.steps.dependencies.readyDetail")
          : t("widget.steps.dependencies.missingDetail"),
        recovery: hasDeps ? "" : t("widget.steps.dependencies.missingRecovery"),
      },
      {
        id: "github",
        status: githubStepStatus,
        detail: githubDetail,
        recovery: "",
      },
      {
        id: "server",
        status: InstallerStepStatus.DONE,
        detail: t("widget.steps.server.readyDetail", { port: String(port) }),
        recovery: "",
      },
    ];

    if (overrides?.persist) {
      const nextState: PersistedInstallerState = {
        version: 1,
        startedAt: persisted?.startedAt ?? updatedAt,
        updatedAt,
        os: persisted?.os ?? mapOsName(),
        arch: persisted?.arch ?? process.arch,
        installDir: projectRoot,
        repoUrl: persisted?.repoUrl ?? UPSTREAM_REPO_URL,
        checkoutMode: persisted?.checkoutMode ?? "unknown",
        port,
        url: persisted?.url ?? `http://localhost:${port}/en-US/install`,
        steps: {
          git: gitVersionRes.ok ? "done" : "error",
          bun: bunVersionRes.ok ? "done" : "error",
          clone: "done",
          dependencies: hasDeps ? "done" : "error",
          github: isPrivateForkConfigured
            ? "done"
            : skipped
              ? "skipped"
              : "pending",
          server: "done",
        },
        versions: {
          git: gitVersionRes.ok
            ? (gitVersionRes.stdout.split("\n")[0] ?? "")
            : "",
          bun: bunVersionRes.ok
            ? (bunVersionRes.stdout.split("\n")[0] ?? "")
            : "",
        },
        github: {
          status: isPrivateForkConfigured
            ? "done"
            : skipped
              ? "skipped"
              : "pending",
          repoUrl: privateRepoUrl,
          skipped,
        },
        lastError,
      };
      try {
        writePersistedState(stateFilePath, nextState);
      } catch (err) {
        logger.warn("Failed to persist installer state file", {
          error: parseError(err).message,
          stateFilePath,
        });
      }
    }

    return {
      installDir: projectRoot,
      os: persisted?.os ?? mapOsName(),
      arch: persisted?.arch ?? process.arch,
      checkoutMode,
      branch,
      originUrl,
      upstreamUrl,
      port,
      stateFilePath,
      updatedAt,
      lastError,
      steps,
      github: {
        ghInstalled,
        ghAuthenticated,
        ghUsername,
        isPrivateForkConfigured,
        privateRepoUrl,
        skipped,
        deviceCode: activeDeviceSession?.code ?? "",
        deviceVerificationUrl: activeDeviceSession?.verificationUrl ?? "",
        devicePending: Boolean(
          activeDeviceSession &&
          !activeDeviceSession.finished &&
          !ghAuthenticated,
        ),
      },
      setup: {
        pending: setupStatus.pending,
        complete: setupStatus.complete,
        writable: setupStatus.writable,
      },
    };
  }

  static async getStatus(
    logger: EndpointLogger,
    t: InstallerT,
  ): Promise<ResponseType<InstallerGetResponseOutput>> {
    const allowed = await InstallerRepository.isLocalInstallerAllowed();
    if (!allowed) {
      return fail({
        message: t("errors.localOnly"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }
    const snapshot = await InstallerRepository.probeSnapshot(t, logger);
    return success(snapshot);
  }

  private static async startGhDeviceLogin(
    projectRoot: string,
    logger: EndpointLogger,
  ): Promise<{ ok: boolean; code: string; url: string }> {
    cleanupExpiredDeviceSession();
    if (
      activeDeviceSession &&
      !activeDeviceSession.finished &&
      activeDeviceSession.code
    ) {
      return {
        ok: true,
        code: activeDeviceSession.code,
        url: activeDeviceSession.verificationUrl,
      };
    }

    return new Promise((resolve) => {
      // Suppress automatic browser launch from gh so the user opens the link cleanly from the UI.
      const proc = spawn(
        "gh",
        [
          "auth",
          "login",
          "--hostname",
          "github.com",
          "--git-protocol",
          "https",
          "--web",
        ],
        {
          cwd: projectRoot,
          env: {
            ...process.env,
            BROWSER: "true",
            GH_BROWSER: "true",
          },
          stdio: ["pipe", "pipe", "pipe"],
        },
      );

      // Press Enter when gh prompts "Press Enter to open github.com in your browser..."
      proc.stdin?.write("\n");

      const session: DeviceLoginSession = {
        proc,
        code: "",
        verificationUrl: GITHUB_DEVICE_URL,
        startedAt: Date.now(),
        finished: false,
      };
      activeDeviceSession = session;

      let settled = false;
      const finishResolve = (result: {
        ok: boolean;
        code: string;
        url: string;
      }): void => {
        if (settled) {
          return;
        }
        settled = true;
        resolve(result);
      };

      const onChunk = (chunk: Buffer): void => {
        const text = chunk.toString("utf-8");
        const codeMatch = DEVICE_CODE_PATTERN.exec(text);
        if (codeMatch && codeMatch[1]) {
          session.code = codeMatch[1];
          finishResolve({
            ok: true,
            code: session.code,
            url: session.verificationUrl,
          });
        }
      };

      proc.stdout?.on("data", onChunk);
      proc.stderr?.on("data", onChunk);
      proc.on("error", (err) => {
        logger.warn("gh auth login process error", {
          error: parseError(err).message,
        });
        session.finished = true;
        finishResolve({ ok: false, code: "", url: "" });
      });
      proc.on("exit", () => {
        session.finished = true;
        if (!session.code) {
          finishResolve({ ok: false, code: "", url: "" });
        }
      });

      setTimeout(() => {
        if (!settled) {
          finishResolve({
            ok: Boolean(session.code),
            code: session.code,
            url: session.verificationUrl,
          });
        }
      }, 6000);
    });
  }

  static async runAction(
    data: InstallerPostRequestOutput,
    logger: EndpointLogger,
    t: InstallerT,
  ): Promise<ResponseType<InstallerPostResponseOutput>> {
    const allowed = await InstallerRepository.isLocalInstallerAllowed();
    if (!allowed) {
      return fail({
        message: t("errors.localOnly"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    const projectRoot = getProjectRoot();

    if (data.action === InstallerAction.REFRESH) {
      const snapshot = await InstallerRepository.probeSnapshot(t, logger, {
        lastError: "",
        persist: true,
      });
      return success({
        ...snapshot,
        actionMessage: t("actions.refreshed"),
      });
    }

    if (data.action === InstallerAction.GITHUB_SKIP) {
      if (activeDeviceSession) {
        activeDeviceSession.finished = true;
        cleanupExpiredDeviceSession();
      }
      const snapshot = await InstallerRepository.probeSnapshot(t, logger, {
        skipped: true,
        lastError: "",
        persist: true,
      });
      return success({
        ...snapshot,
        actionMessage: t("actions.githubSkipped"),
      });
    }

    if (data.action === InstallerAction.GITHUB_RESET) {
      const snapshot = await InstallerRepository.probeSnapshot(t, logger, {
        skipped: false,
        lastError: "",
        persist: true,
      });
      return success({
        ...snapshot,
        actionMessage: t("actions.githubReset"),
      });
    }

    if (data.action === InstallerAction.GITHUB_AUTH_START) {
      const ghCheck = await runExecFile("gh", ["--version"], {
        cwd: projectRoot,
      });
      if (!ghCheck.ok) {
        return fail({
          message: t("errors.ghNotInstalled"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const authCheck = await runExecFile("gh", ["auth", "status"], {
        cwd: projectRoot,
      });
      if (authCheck.ok) {
        const snapshot = await InstallerRepository.probeSnapshot(t, logger, {
          skipped: false,
          persist: true,
        });
        return success({
          ...snapshot,
          actionMessage: t("actions.githubAuthReady", {
            username: snapshot.github.ghUsername || "GitHub",
          }),
        });
      }

      const started = await InstallerRepository.startGhDeviceLogin(
        projectRoot,
        logger,
      );
      if (!started.ok || !started.code) {
        return fail({
          message: t("errors.ghAuthStartFailed"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      const snapshot = await InstallerRepository.probeSnapshot(t, logger, {
        skipped: false,
        persist: true,
      });
      return success({
        ...snapshot,
        actionMessage: t("actions.githubAuthPending"),
      });
    }

    if (data.action === InstallerAction.GITHUB_AUTH_CHECK) {
      const snapshot = await InstallerRepository.probeSnapshot(t, logger, {
        persist: true,
      });
      const actionMessage = snapshot.github.ghAuthenticated
        ? t("actions.githubAuthReady", {
            username: snapshot.github.ghUsername || "GitHub",
          })
        : t("actions.githubAuthWaiting");
      return success({
        ...snapshot,
        actionMessage,
      });
    }

    if (data.action === InstallerAction.GITHUB_CREATE_PRIVATE_REPO) {
      const repoName =
        data.repoName && data.repoName.trim().length > 0
          ? data.repoName.trim()
          : DEFAULT_PRIVATE_REPO_NAME;
      if (!REPO_NAME_PATTERN.test(repoName)) {
        return fail({
          message: t("errors.invalidRepoName"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      const ghCheck = await runExecFile("gh", ["--version"], {
        cwd: projectRoot,
      });
      if (!ghCheck.ok) {
        return fail({
          message: t("errors.ghNotInstalled"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const authCheck = await runExecFile("gh", ["auth", "status"], {
        cwd: projectRoot,
      });
      if (!authCheck.ok) {
        return fail({
          message: t("errors.ghNotSignedIn"),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      const usernameRes = await runExecFile(
        "gh",
        ["api", "user", "--jq", ".login"],
        { cwd: projectRoot },
      );
      const username =
        (usernameRes.ok ? usernameRes.stdout.trim() : "") ||
        parseGhUsername(`${authCheck.stdout}\n${authCheck.stderr}`);
      if (!username) {
        return fail({
          message: t("errors.ghNotSignedIn"),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      const fullSlug = `${username}/${repoName}`;
      const repoHttpsUrl = `https://github.com/${fullSlug}`;
      const repoGitUrl = `${repoHttpsUrl}.git`;

      // Check whether the private repository already exists under the user's account
      const viewRes = await runExecFile("gh", ["repo", "view", fullSlug], {
        cwd: projectRoot,
      });
      if (!viewRes.ok) {
        const createRes = await runExecFile(
          "gh",
          [
            "repo",
            "create",
            repoName,
            "--private",
            "--description",
            "My private next-vibe instance",
          ],
          { cwd: projectRoot, timeoutMs: 30_000 },
        );
        if (!createRes.ok) {
          logger.warn("gh repo create failed", { stderr: createRes.stderr });
          return fail({
            message: t("errors.ghCreateFailed"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }
      }

      // Preserve upstream next-vibe remote before repointing origin to the private repo
      const originRes = await runExecFile(
        "git",
        ["remote", "get-url", "origin"],
        {
          cwd: projectRoot,
        },
      );
      const upstreamRes = await runExecFile(
        "git",
        ["remote", "get-url", "upstream"],
        { cwd: projectRoot },
      );

      if (!upstreamRes.ok) {
        const upstreamTarget =
          originRes.ok && isUpstreamNextVibeRemote(originRes.stdout)
            ? originRes.stdout
            : UPSTREAM_REPO_URL;
        await runExecFile(
          "git",
          ["remote", "add", "upstream", upstreamTarget],
          {
            cwd: projectRoot,
          },
        );
      }

      if (originRes.ok) {
        await runExecFile("git", ["remote", "set-url", "origin", repoGitUrl], {
          cwd: projectRoot,
        });
      } else {
        await runExecFile("git", ["remote", "add", "origin", repoGitUrl], {
          cwd: projectRoot,
        });
      }

      // Configure gh git credential helper so HTTPS push works seamlessly
      await runExecFile("gh", ["auth", "setup-git"], { cwd: projectRoot });

      const pushRes = await runExecFile(
        "git",
        ["push", "-u", "origin", "HEAD"],
        {
          cwd: projectRoot,
          timeoutMs: PUSH_TIMEOUT_MS,
        },
      );
      if (!pushRes.ok) {
        logger.warn("git push to private repo failed", {
          stderr: pushRes.stderr,
        });
        return fail({
          message: t("errors.ghCreateFailed"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      const snapshot = await InstallerRepository.probeSnapshot(t, logger, {
        skipped: false,
        privateRepoUrl: repoHttpsUrl,
        lastError: "",
        persist: true,
      });
      return success({
        ...snapshot,
        actionMessage: t("actions.githubRepoCreated"),
      });
    }

    const fallbackSnapshot = await InstallerRepository.probeSnapshot(t, logger);
    return success({
      ...fallbackSnapshot,
      actionMessage: t("actions.refreshed"),
    });
  }
}
