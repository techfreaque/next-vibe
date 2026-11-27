/**
 * Coding Agent Shared Repository
 *
 * Unifies:
 * 1. One-shot batch & interactive terminal execution (Claude Code, OpenCode, Codex, Antigravity)
 * 2. Named persistent sub-agents with resume, mid-turn steering (say), interrupt,
 *    and status/transcript inspection (list) for Codex (`codex app-server`) and
 *    Antigravity (`agy acp`).
 */
import "server-only";

import { execSync, spawn } from "node:child_process";
import { once } from "node:events";
import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { eq } from "drizzle-orm";
import type { ToolExecutionContext } from "next-vibe/core/execution-context";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { CallbackMode } from "next-vibe/execute-tool/constants";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { z } from "zod";

import { chatSettings } from "../chat/settings/db";
import type { RunRequestOutput, RunResponseOutput } from "./definition";
import { AgentStatus, CodingAgentProvider, Sandbox } from "./enum";
import type { CodingAgentT } from "./i18n";
import type { CodingAgentInterruptRequest } from "./interrupt/definition";
import type {
  CodingAgentListRequest,
  CodingAgentListResponse,
} from "./list/definition";
import { antigravityConfig } from "./providers/antigravity/repository";
import {
  AntigravityRun,
  DEFAULT_ANTIGRAVITY_MODEL,
} from "./providers/antigravity/run";
import { claudeCodeConfig } from "./providers/claude-code/repository";
import { spawnCodexAppServer } from "./providers/codex/process";
import type { JsonObject } from "./providers/codex/protocol";
import { codexConfig } from "./providers/codex/repository";
import type { RpcTransport } from "./providers/codex/rpc";
import { AgentRun, type RunInput } from "./providers/codex/run";
import { openCodeConfig } from "./providers/open-code/repository";
import {
  callAgent,
  findRunning,
  listRunning,
  serveControl,
} from "./runtime/control";
import { type AgentMeta, readMeta, writeMeta } from "./runtime/meta";
import {
  agentDir,
  isValidName,
  stateDir,
  transcriptTail,
} from "./runtime/paths";
import type { CodingAgentSayRequest } from "./say/definition";
import {
  AgentError,
  type CodingAgentRequest,
  type CodingAgentResponse,
  type RunResult,
} from "./types";

// ── Provider config ────────────────────────────────────────────────────────────

export interface ProviderConfig {
  /** CLI binary name (e.g. "claude", "opencode", "codex", "agy") */
  bin: string;
  /** Routing tag stored on the tracking task row */
  routeId: string;
  /** Build batch-mode CLI args from the request */
  batchArgs: (data: CodingAgentRequest) => string[];
  /** Build interactive-mode CLI args from the request (before task context injection) */
  interactiveArgs: (data: CodingAgentRequest) => string[];
  /**
   * Inject task context into the first arg (interactive mode, path 1 + 2).
   * Return the modified args array. Default: no injection (for providers that
   * launch a TUI and can't receive a system prompt via args).
   */
  injectTaskContext?: (
    args: string[],
    taskId: string,
    mcpInstanceName: string,
  ) => string[];
  /** Extra env vars to merge/unset when spawning the process */
  spawnEnv?: Record<string, string | undefined>;
}

// ── Terminal detection (shared) ────────────────────────────────────────────────

function commandExists(cmd: string): boolean {
  try {
    execSync(`command -v ${cmd}`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function buildShellCommand(bin: string, args: string[], cwd: string): string {
  const escaped = args.map((a) => `'${a.replaceAll("'", "'\\''")}'`);
  return `cd '${cwd.replaceAll("'", "'\\''")}' && ${bin} ${escaped.join(" ")}`;
}

/**
 * Windows: a PowerShell script file run by a fresh console window. A script
 * file sidesteps cmd/PowerShell argument re-quoting of prompts that contain
 * quotes, braces or newlines.
 */
function psQuote(v: string): string {
  return `'${v.replaceAll("'", "''")}'`;
}

function buildWindowsScript(bin: string, args: string[], cwd: string): string {
  const scriptPath = join(
    tmpdir(),
    `vibe-${bin}-${Date.now().toString(36)}.ps1`,
  );
  writeFileSync(
    scriptPath,
    `Set-Location -LiteralPath ${psQuote(cwd)}
& ${psQuote(bin)} ${args.map(psQuote).join(" ")}
`,
    "utf8",
  );
  return scriptPath;
}

export interface TerminalEmulator {
  bin: string;
  buildArgs: (cliArgs: string[]) => string[];
}

function detectTerminal(logger: EndpointLogger): TerminalEmulator | undefined {
  if (process.platform === "win32") {
    return {
      bin: "cmd.exe",
      buildArgs: (args) => [
        "/c",
        "start",
        "",
        "powershell.exe",
        "-NoExit",
        "-ExecutionPolicy",
        "Bypass",
        "-File",
        args[0] ?? "",
      ],
    };
  }
  if (process.platform === "darwin") {
    if (commandExists("osascript")) {
      return {
        bin: "osascript",
        buildArgs: (args) => {
          const shellCmd = args[0] ?? "";
          return [
            "-e",
            `tell application "Terminal" to do script "${shellCmd.replaceAll('"', '\\"')}"`,
          ];
        },
      };
    }
    return undefined;
  }

  const envTerminal = process.env["TERMINAL"];
  if (envTerminal && commandExists(envTerminal)) {
    logger.info("Using $TERMINAL", { terminal: envTerminal });
    return {
      bin: envTerminal,
      buildArgs: (args) => ["-e", args[0] ?? ""],
    };
  }

  const candidates: Array<{ bin: string; execFlag: string[] }> = [
    { bin: "x-terminal-emulator", execFlag: ["-e"] },
    { bin: "kitty", execFlag: ["--"] },
    { bin: "alacritty", execFlag: ["-e"] },
    { bin: "wezterm", execFlag: ["start", "--"] },
    { bin: "gnome-terminal", execFlag: ["--"] },
    { bin: "konsole", execFlag: ["-e"] },
    { bin: "xfce4-terminal", execFlag: ["-e"] },
    { bin: "mate-terminal", execFlag: ["-e"] },
    { bin: "xterm", execFlag: ["-e"] },
  ];

  for (const candidate of candidates) {
    if (commandExists(candidate.bin)) {
      logger.info("Detected terminal emulator", { terminal: candidate.bin });
      return {
        bin: candidate.bin,
        buildArgs: (args) => [...candidate.execFlag, "sh", "-c", args[0] ?? ""],
      };
    }
  }

  return undefined;
}

function spawnInTerminal(
  provider: ProviderConfig,
  terminal: TerminalEmulator,
  cliArgs: string[],
  cwd: string,
  logger: EndpointLogger,
): void {
  const shellCmd =
    process.platform === "win32"
      ? buildWindowsScript(provider.bin, cliArgs, cwd)
      : buildShellCommand(provider.bin, cliArgs, cwd);
  const termArgs = terminal.buildArgs([shellCmd]);

  logger.info("Spawning terminal", { bin: terminal.bin, args: termArgs });

  spawn(terminal.bin, termArgs, {
    cwd,
    env: { ...process.env, ...provider.spawnEnv },
    stdio: "ignore",
    detached: true,
  }).unref();
}

function spawnDetached(
  provider: ProviderConfig,
  cliArgs: string[],
  cwd: string,
): void {
  spawn(provider.bin, cliArgs, {
    cwd,
    env: { ...process.env, ...provider.spawnEnv },
    stdio: "ignore",
    detached: true,
  }).unref();
}

// ── Batch execution (Claude Code / OpenCode) ───────────────────────────────────

async function runBatch(
  provider: ProviderConfig,
  args: string[],
  cwd: string,
  timeoutMs: number,
  logger: EndpointLogger,
  t: CodingAgentT,
): Promise<ResponseType<CodingAgentResponse>> {
  const start = Date.now();
  const stdoutChunks: Buffer[] = [];
  const stderrChunks: Buffer[] = [];

  const child = spawn(provider.bin, args, {
    cwd,
    env: { ...process.env, ...provider.spawnEnv },
    stdio: ["ignore", "pipe", "pipe"],
  });

  child.stdout?.on("data", (chunk: Buffer) => {
    stdoutChunks.push(chunk);
  });
  child.stderr?.on("data", (chunk: Buffer) => {
    stderrChunks.push(chunk);
  });

  const timer = setTimeout(() => {
    child.kill("SIGTERM");
  }, timeoutMs);

  try {
    await once(child, "close");
  } catch (err) {
    clearTimeout(timer);
    const isMissingBinary =
      err instanceof Error && "code" in err && err.code === "ENOENT";
    if (isMissingBinary) {
      logger.warn(`${provider.bin} CLI not installed`, { bin: provider.bin });
      return fail({
        message: t("codingAgent.run.post.errors.binaryMissing.title", {
          bin: provider.bin,
        }),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }
    logger.error(`${provider.bin} CLI failed to spawn`, parseError(err));
    return fail({
      message: t("codingAgent.run.post.errors.internal.title"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }

  clearTimeout(timer);
  const durationMs = Date.now() - start;
  const exitCode = child.exitCode ?? 1;
  const stdout = Buffer.concat(stdoutChunks).toString("utf8");
  const stderr = Buffer.concat(stderrChunks).toString("utf8");

  logger.debug(`${provider.bin} batch finished`, {
    exitCode,
    durationMs,
    stdoutLength: stdout.length,
    stderrLength: stderr.length,
  });

  if (exitCode !== 0) {
    const errOutput = stderr
      ? `${stdout}\n\n--- stderr ---\n${stderr}`
      : stdout;
    logger.warn(`${provider.bin} exited with non-zero code`, {
      exitCode,
      errOutput: errOutput.slice(0, 200),
    });
    return fail({
      message: t("codingAgent.run.post.errors.internalExitCode.title", {
        exitCode: String(exitCode),
      }),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }

  const output = stderr ? `${stdout}\n\n--- stderr ---\n${stderr}` : stdout;
  // Keep exact {output, durationMs} shape for batch mode callers and integration tests.
  return success({ output: output || "", durationMs });
}

// ── Helpers ────────────────────────────────────────────────────────────────────

async function getMcpInstanceName(userId: string): Promise<string> {
  const { RemoteConnectionRepository } =
    await import("next-vibe/remote-connection/repository");
  return RemoteConnectionRepository.getLocalInstanceId(userId);
}

// ── Batch / Interactive Runner ─────────────────────────────────────────────────

export async function runCodingAgent(
  provider: ProviderConfig,
  data: CodingAgentRequest,
  userId: string,
  logger: EndpointLogger,
  t: CodingAgentT,
  cronTaskId: string | undefined,
  toolExecutionContext: ToolExecutionContext,
): Promise<ResponseType<CodingAgentResponse>> {
  const timeoutMs = 30 * 60 * 1000;
  const start = Date.now();
  const isInteractive = data.interactiveMode ?? false;
  const cwd = data.cwd ? resolve(data.cwd) : process.cwd();

  if (!statSync(cwd, { throwIfNoEntry: false })?.isDirectory()) {
    return fail({
      message: t("codingAgent.run.post.errors.detail", {
        detail: `Working directory ${cwd} does not exist.`,
      }),
      errorType: ErrorResponseTypes.NOT_FOUND,
    });
  }

  const args = isInteractive
    ? provider.interactiveArgs(data)
    : provider.batchArgs(data);

  logger.debug(`Running ${provider.bin}`, {
    mode: isInteractive ? "interactive" : "batch",
    prompt: data.prompt.slice(0, 200),
    model: data.model,
    timeoutMs,
    taskId: cronTaskId,
  });

  // ── Batch mode ──────────────────────────────────────────────────────────────
  if (!isInteractive) {
    return runBatch(provider, args, cwd, timeoutMs, logger, t);
  }

  // ── Interactive mode ────────────────────────────────────────────────────────
  const title =
    data.taskTitle || data.prompt.slice(0, 80).replaceAll("\n", " ");

  // Path 1: streaming context → escalateToTask
  if (toolExecutionContext.escalateToTask) {
    const callbackMode =
      toolExecutionContext.callerCallbackMode ?? CallbackMode.WAIT;
    const { taskId: trackingTaskId } =
      await toolExecutionContext.escalateToTask({
        callbackMode,
        displayName: title,
      });

    const finalArgs = provider.injectTaskContext
      ? provider.injectTaskContext(
          args,
          trackingTaskId,
          await getMcpInstanceName(userId),
        )
      : args;

    const terminal = detectTerminal(logger);
    if (terminal) {
      try {
        spawnInTerminal(provider, terminal, finalArgs, cwd, logger);
        logger.info("Interactive: launched in terminal via escalateToTask", {
          terminal: terminal.bin,
          trackingTaskId,
          callbackMode,
        });
      } catch (err) {
        logger.error("Failed to spawn terminal", parseError(err));
        return fail({
          message: t("codingAgent.run.post.errors.internal.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
    } else {
      logger.warn("No terminal found, spawning detached via escalateToTask");
      spawnDetached(provider, finalArgs, cwd);
      logger.info("Interactive: launched detached via escalateToTask", {
        trackingTaskId,
        callbackMode,
      });
    }

    if (
      (callbackMode === CallbackMode.WAIT ||
        callbackMode === CallbackMode.END_LOOP) &&
      toolExecutionContext
    ) {
      toolExecutionContext.waitingForRemoteResult = true;
      toolExecutionContext.pendingTimeoutMs = 0;
      return success({
        output: `Interactive ${provider.bin} session launched. Waiting for completion.`,
        durationMs: Date.now() - start,
      });
    }

    return success({
      output: `Interactive ${provider.bin} session launched. Task ID: ${trackingTaskId}.`,
      durationMs: Date.now() - start,
      taskId: trackingTaskId,
      terminalPending: true,
      hint: "Result will be injected automatically as a deferred message when complete. Do NOT call await-task.",
    });
  }

  // Path 2: goroutine / cron context - reuse the parent task ID directly.
  if (cronTaskId) {
    const finalArgs = provider.injectTaskContext
      ? provider.injectTaskContext(
          args,
          cronTaskId,
          await getMcpInstanceName(userId),
        )
      : args;

    const terminal = detectTerminal(logger);
    if (terminal) {
      try {
        spawnInTerminal(provider, terminal, finalArgs, cwd, logger);
      } catch (err) {
        logger.error("Failed to spawn terminal (goroutine)", parseError(err));
        return fail({
          message: t("codingAgent.run.post.errors.internal.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }
    } else {
      spawnDetached(provider, finalArgs, cwd);
    }

    logger.info("Interactive (goroutine): session launched", {
      cronTaskId,
      durationMs: Date.now() - start,
    });

    return success({
      output: `Interactive ${provider.bin} session launched. Task ID: ${cronTaskId}.`,
      durationMs: Date.now() - start,
      taskId: cronTaskId,
      terminalPending: true,
      hint: "Result will be injected automatically as a deferred message when complete. Do NOT call await-task.",
    });
  }

  // Path 3: Headless fallback - no escalateToTask, no cronTaskId.
  if (provider.injectTaskContext) {
    logger.info(
      "Interactive mode: no escalateToTask or cronTaskId - falling back to batch",
      { bin: provider.bin },
    );
    return runBatch(
      provider,
      provider.batchArgs(data),
      cwd,
      timeoutMs,
      logger,
      t,
    );
  }

  // Provider doesn't support task context (e.g. TUI tools) - spawn without revival.
  logger.info("Interactive (CLI/cron): spawning detached, no revival");
  const terminal = detectTerminal(logger);
  if (terminal) {
    try {
      spawnInTerminal(provider, terminal, args, cwd, logger);
    } catch (err) {
      logger.error("Failed to spawn terminal (CLI)", parseError(err));
      return fail({
        message: t("codingAgent.run.post.errors.internal.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  } else {
    spawnDetached(provider, args, cwd);
  }

  return success({
    output: `Interactive ${provider.bin} session launched.`,
    durationMs: Date.now() - start,
  });
}

// ── Persistent Named Sub-agents (Codex / Antigravity) ──────────────────────────

const PREAMBLE = join(dirname(fileURLToPath(import.meta.url)), "preamble.md");

const ERROR_TYPES = {
  invalid: ErrorResponseTypes.VALIDATION_ERROR,
  conflict: ErrorResponseTypes.CONFLICT,
  not_found: ErrorResponseTypes.NOT_FOUND,
  unavailable: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
};

function agentFailure(t: CodingAgentT, error: Error): ResponseType<never> {
  return fail({
    message: t("codingAgent.run.post.errors.detail", { detail: error.message }),
    errorType:
      error instanceof AgentError
        ? ERROR_TYPES[error.code]
        : ErrorResponseTypes.UNKNOWN_ERROR,
  });
}

async function guard<T>(
  t: CodingAgentT,
  work: () => Promise<T | AgentError>,
): Promise<ResponseType<T>> {
  try {
    const value = await work();
    return value instanceof AgentError
      ? agentFailure(t, value)
      : success(value);
  } catch (error) {
    return agentFailure(
      t,
      error instanceof Error ? error : new Error(String(error)),
    );
  }
}

/** A file can hold a brief too large to pass via a shell argument. */
function textOf(
  inline: string | undefined,
  file: string | undefined,
  what: "task" | "message",
): string | AgentError {
  const filePath = file?.trim() ? file : undefined;
  if (inline?.trim() && filePath) {
    return new AgentError("invalid", "Choose either inline text or a file.");
  }
  let text = inline;
  if (filePath !== undefined) {
    try {
      text = readFileSync(resolve(process.cwd(), filePath), "utf-8");
    } catch {
      return new AgentError(
        "not_found",
        `Cannot read ${what} file ${filePath}.`,
      );
    }
  }
  return !text?.trim()
    ? new AgentError("invalid", `The ${what} is empty.`)
    : text;
}

/**
 * The MCP servers of the project's `.codex/config.toml` files (written by `vibe setup`), set to run their tools without
 * an approval: a sub-agent has nobody to ask, so without this every MCP call would fail. Like Codex, it reads the
 * files from the working directory up to the git root (only the working directory outside a repository).
 */
export function mcpConfig(cwd: string): JsonObject | undefined {
  const dirs: string[] = [];
  for (let dir = cwd; ; dir = dirname(dir)) {
    dirs.push(dir);
    if (existsSync(join(dir, ".git"))) {
      break;
    }
    if (dirname(dir) === dir) {
      dirs.splice(1);
      break;
    }
  }
  const servers: JsonObject = {};
  for (const dir of dirs) {
    const file = join(dir, ".codex", "config.toml");
    if (!existsSync(file)) {
      continue;
    }
    for (const match of readFileSync(file, "utf-8").matchAll(
      /^\[mcp_servers\.(?:"([^"]+)"|([\w-]+))\]\s*$/gm,
    )) {
      const name = match[1] ?? match[2];
      if (name !== undefined) {
        servers[name] = { default_tools_approval_mode: "approve" };
      }
    }
  }
  return Object.keys(servers).length === 0
    ? undefined
    : { mcp_servers: servers };
}

const emptySchema = z.object({});
const interruptedSchema = z.object({ interrupted: z.boolean() });

function missingAgent(name: string): AgentError {
  return new AgentError("not_found", `No agent named "${name}".`);
}

interface PersistentRunOptions {
  name: string;
  provider?: RunRequestOutput["provider"];
  model?: string;
  effort?: string;
  sandbox?: RunRequestOutput["sandbox"];
  cwd?: string;
  fresh?: boolean;
}

async function runPersistentTurn(
  dir: string,
  options: PersistentRunOptions,
  prompt: string,
  signal: AbortSignal,
): Promise<RunResponseOutput | AgentError> {
  const { name } = options;
  const start = Date.now();
  const invoked = process.cwd();
  const active = await findRunning(dir, name);
  if (active) {
    return new AgentError(
      "conflict",
      `Agent "${name}" is running. Use coding-agent-say to steer it or choose another name.`,
    );
  }
  // Claim the name before loading saved settings or launching a process.
  let run: AgentRun | AntigravityRun | undefined;
  let cancelled = signal.aborted;
  const stop = (): void => {
    cancelled = true;
    run?.cancel();
  };
  const control = await serveControl(
    dir,
    { name, cwd: invoked, threadId: "" },
    {
      say: (message) =>
        run?.say(message) ??
        Promise.reject(
          new AgentError("conflict", `Agent "${name}" is starting.`),
        ),
      interrupt: () => run?.interrupt() ?? Promise.resolve(false),
      tail: (lines) => transcriptTail(dir, name, lines),
    },
  );
  signal.addEventListener("abort", stop, { once: true });
  process.once("SIGTERM", stop);
  let log: number | undefined;
  try {
    const saved = readMeta(dir, name);
    const savedProvider =
      saved && (saved.provider ?? CodingAgentProvider.CODEX);
    const provider =
      options.provider ?? savedProvider ?? CodingAgentProvider.CODEX;
    if (!options.fresh && savedProvider && savedProvider !== provider) {
      return new AgentError(
        "conflict",
        "The saved conversation uses another provider. Pass --fresh to start a new one.",
      );
    }
    if (
      provider === CodingAgentProvider.ANTIGRAVITY &&
      options.sandbox &&
      options.sandbox !== Sandbox.FULL_ACCESS
    ) {
      return new AgentError("invalid", "The sandbox option applies to Codex.");
    }
    if (cancelled || signal.aborted) {
      return new AgentError("unavailable", "The agent command was cancelled.");
    }

    const ongoing = options.fresh ? undefined : saved;
    const cwd = resolve(options.cwd ?? ongoing?.cwd ?? invoked);
    if (!statSync(cwd, { throwIfNoEntry: false })?.isDirectory()) {
      return new AgentError(
        "not_found",
        `Working directory ${cwd} does not exist.`,
      );
    }

    const codex = provider === CodingAgentProvider.CODEX;
    const input: RunInput = {
      name,
      prompt,
      cwd,
      model:
        options.model ||
        ongoing?.model ||
        (codex
          ? process.env.CODEX_MODEL || "gpt-6.2-sol"
          : DEFAULT_ANTIGRAVITY_MODEL),
      effort:
        options.effort ||
        ongoing?.effort ||
        (codex ? process.env.CODEX_EFFORT || "high" : undefined),
      sandbox:
        options.sandbox ??
        ongoing?.sandbox ??
        (codex ? Sandbox.WORKSPACE_WRITE : Sandbox.FULL_ACCESS),
      resume: ongoing?.threadId || undefined,
    };
    const meta: AgentMeta = {
      threadId: input.resume ?? "",
      provider,
      cwd,
      model: input.model,
      effort: input.effort,
      sandbox: input.sandbox,
      startedAt: new Date().toISOString(),
      last: saved?.last,
    };
    control.update(meta.threadId, cwd, provider);
    const onThread = (threadId: string): void => {
      writeMeta(dir, name, { ...meta, threadId });
      control.update(threadId, cwd, provider);
    };

    mkdirSync(agentDir(dir, name), { recursive: true, mode: 0o700 });
    let result: RunResult;
    try {
      if (codex) {
        const logFd = openSync(
          join(agentDir(dir, name), "codex.log"),
          "a",
          0o600,
        );
        log = logFd;
        run = new AgentRun(
          {
            dir,
            connect: (): RpcTransport | AgentError =>
              spawnCodexAppServer(logFd, process.env, cwd),
            preamble: (): string => readFileSync(PREAMBLE, "utf8"),
            config: (): JsonObject | undefined => mcpConfig(cwd),
            onThread,
          },
          input,
        );
      } else {
        run = new AntigravityRun(
          dir,
          input,
          onThread,
          input.resume ? "" : readFileSync(PREAMBLE, "utf8"),
        );
      }
      if (cancelled || signal.aborted) {
        run.cancel();
      }
      await run.start();
      result = await run.result();
    } catch (error) {
      result = {
        name,
        threadId: run?.thread || meta.threadId,
        status: AgentStatus.FAILED,
        message: "",
        error: error instanceof Error ? error.message : String(error),
      };
    } finally {
      await run?.close();
    }

    // A failed fresh start can leave the previous conversation available to resume.
    const session = result.threadId || !saved ? meta : saved;
    writeMeta(dir, name, {
      ...session,
      threadId: result.threadId || session.threadId,
      last: {
        status: result.status,
        message: result.message,
        finishedAt: new Date().toISOString(),
        error: result.error,
      },
    });
    if (result.status === AgentStatus.FAILED) {
      return new AgentError(
        "unavailable",
        `Agent "${name}" failed: ${result.error ?? "unknown error"} (thread ${result.threadId || "not opened"})`,
      );
    }
    return {
      output: result.message,
      durationMs: Date.now() - start,
      nameOut: name,
      threadId: result.threadId,
      status: result.status,
    };
  } finally {
    try {
      if (log !== undefined) {
        closeSync(log);
      }
    } finally {
      signal.removeEventListener("abort", stop);
      process.removeListener("SIGTERM", stop);
      control.close();
    }
  }
}

type AgentSummary = CodingAgentListResponse["agents"][number];

function savedNames(dir: string): string[] {
  const agents = join(dir, "agents");
  if (!existsSync(agents)) {
    return [];
  }
  return readdirSync(agents, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && isValidName(entry.name))
    .map((entry) => entry.name);
}

async function listAgents(
  dir: string,
  data: CodingAgentListRequest,
): Promise<CodingAgentListResponse | AgentError> {
  const { name } = data;
  if (name !== undefined && !isValidName(name)) {
    return new AgentError("invalid", "Invalid agent name.");
  }
  const matching =
    name === undefined ? undefined : await findRunning(dir, name);
  const running =
    name === undefined ? await listRunning(dir) : matching ? [matching] : [];
  const active = new Map(running.map((info) => [info.name, info]));
  const names =
    name === undefined
      ? new Set([...savedNames(dir), ...active.keys()])
      : [name];
  const agents: AgentSummary[] = [];
  for (const agentName of [...names].toSorted()) {
    const live = active.get(agentName);
    const saved = readMeta(dir, agentName);
    if (live) {
      agents.push({
        name: agentName,
        threadId: live.threadId,
        provider: live.provider ?? saved?.provider ?? CodingAgentProvider.CODEX,
        status: AgentStatus.RUNNING,
        cwd: live.cwd,
        startedAt: live.startedAt,
      });
    } else if (saved) {
      agents.push({
        name: agentName,
        threadId: saved.threadId,
        provider: saved.provider ?? CodingAgentProvider.CODEX,
        status: saved.last?.status ?? AgentStatus.IDLE,
        cwd: saved.cwd,
        startedAt: saved.startedAt,
        finishedAt: saved.last?.finishedAt,
      });
    }
  }
  if (name === undefined) {
    return { agents };
  }
  if (!agents.length) {
    return missingAgent(name);
  }
  const saved = readMeta(dir, name);
  return {
    agents,
    tail: transcriptTail(dir, name, data.lines ?? 20),
    ...(saved?.last?.message ? { lastMessage: saved.last.message } : {}),
    ...(saved?.last?.error ? { lastError: saved.last.error } : {}),
  };
}

// ── Unified Verbs Repository ───────────────────────────────────────────────────

export const CodingAgentRepository = {
  runPersistent: (
    data: Omit<RunRequestOutput, "interactiveMode"> & { name: string },
    signal: AbortSignal,
    t: CodingAgentT,
  ): Promise<ResponseType<RunResponseOutput>> =>
    guard<RunResponseOutput>(t, async () => {
      const prompt = textOf(data.prompt, data.promptFile, "task");
      if (prompt instanceof AgentError) {
        return prompt;
      }
      return isValidName(data.name)
        ? runPersistentTurn(stateDir(), data, prompt, signal)
        : new AgentError("invalid", "Invalid agent name.");
    }),

  say: (
    data: CodingAgentSayRequest,
    t: CodingAgentT,
  ): Promise<ResponseType<{ delivered: boolean }>> =>
    guard(t, async () => {
      const message = textOf(data.message, data.messageFile, "message");
      if (message instanceof AgentError) {
        return message;
      }
      await callAgent(stateDir(), data.name, "say", { message }, emptySchema);
      return { delivered: true };
    }),

  interrupt: (
    data: CodingAgentInterruptRequest,
    t: CodingAgentT,
  ): Promise<ResponseType<{ interrupted: boolean }>> =>
    guard(t, async () => {
      const dir = stateDir();
      try {
        return await callAgent(
          dir,
          data.name,
          "interrupt",
          {},
          interruptedSchema,
        );
      } catch (error) {
        if (
          error instanceof AgentError &&
          error.code === "not_found" &&
          readMeta(dir, data.name)
        ) {
          return { interrupted: false };
        }
        return Promise.reject(error);
      }
    }),

  list: (
    data: CodingAgentListRequest,
    t: CodingAgentT,
  ): Promise<ResponseType<CodingAgentListResponse>> =>
    guard(t, () => listAgents(stateDir(), data)),
};

// ── Main Dispatcher ────────────────────────────────────────────────────────────

function normalizeRequest(data: RunRequestOutput): RunRequestOutput {
  // Support `vibe coding-agent "Fix the login bug"` alongside
  // `vibe coding-agent fix-login --prompt="Fix the login bug"`:
  // when only the first positional arg (`name`) is passed and it is not a valid
  // short agent name (e.g. a prompt sentence with spaces), treat it as `prompt`.
  if (
    data.name &&
    !data.prompt?.trim() &&
    !data.promptFile?.trim() &&
    !isValidName(data.name)
  ) {
    return {
      ...data,
      name: undefined,
      prompt: data.name,
    };
  }
  return data;
}

export async function dispatchCodingAgent(
  rawData: RunRequestOutput,
  user: JwtPayloadType,
  logger: EndpointLogger,
  t: CodingAgentT,
  cronTaskId: string | undefined,
  toolExecutionContext: ToolExecutionContext,
): Promise<ResponseType<RunResponseOutput>> {
  if (user.isPublic || !user.id) {
    return fail({
      message: t("codingAgent.run.post.errors.unauthorized.title"),
      errorType: ErrorResponseTypes.UNAUTHORIZED,
    });
  }

  const data = normalizeRequest(rawData);

  if (data.name !== undefined && !isValidName(data.name)) {
    return agentFailure(t, new AgentError("invalid", "Invalid agent name."));
  }

  const prompt = textOf(data.prompt, data.promptFile, "task");
  if (prompt instanceof AgentError) {
    return agentFailure(t, prompt);
  }

  const saved = data.name ? readMeta(stateDir(), data.name) : undefined;
  const savedProvider = saved && (saved.provider ?? CodingAgentProvider.CODEX);
  const provider =
    data.provider ??
    savedProvider ??
    (data.name ? CodingAgentProvider.CODEX : CodingAgentProvider.CLAUDE_CODE);

  // Batch or interactive Claude Code / OpenCode
  if (
    provider === CodingAgentProvider.CLAUDE_CODE ||
    provider === CodingAgentProvider.OPEN_CODE
  ) {
    const rows = await db
      .select({ codingAgent: chatSettings.codingAgent })
      .from(chatSettings)
      .where(eq(chatSettings.userId, user.id))
      .limit(1);

    if (rows[0]?.codingAgent === "next-vibe-coder") {
      return fail({
        message: t("codingAgent.run.post.errors.vibeCoderRedirect.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    return runCodingAgent(
      provider === CodingAgentProvider.OPEN_CODE
        ? openCodeConfig
        : claudeCodeConfig,
      {
        prompt,
        model: data.model,
        interactiveMode: data.interactiveMode,
        taskTitle: data.taskTitle,
        cwd: data.cwd,
      },
      user.id,
      logger,
      t,
      cronTaskId,
      toolExecutionContext,
    );
  }

  // Interactive terminal mode for Codex or Antigravity
  if (data.interactiveMode) {
    return runCodingAgent(
      provider === CodingAgentProvider.ANTIGRAVITY
        ? antigravityConfig
        : codexConfig,
      {
        prompt,
        model: data.model,
        interactiveMode: true,
        taskTitle: data.taskTitle,
        cwd: data.cwd,
      },
      user.id,
      logger,
      t,
      cronTaskId,
      toolExecutionContext,
    );
  }

  // Persistent named turn for Codex or Antigravity (auto-name if called unnamed from web UI)
  const agentName = data.name ?? `${provider}-${Date.now().toString(36)}`;
  return guard<RunResponseOutput>(t, () =>
    runPersistentTurn(
      stateDir(),
      {
        name: agentName,
        provider: data.provider,
        model: data.model,
        effort: data.effort,
        sandbox: data.sandbox,
        cwd: data.cwd,
        fresh: data.fresh,
      },
      prompt,
      toolExecutionContext.abortSignal,
    ),
  );
}
