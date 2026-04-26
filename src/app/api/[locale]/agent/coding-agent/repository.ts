/**
 * Coding Agent Shared Repository
 *
 * All terminal detection, spawning, batch execution, and interactive session
 * management lives here. Providers supply a ProviderConfig that describes only
 * what differs between them (binary name, how to build CLI args, env overrides).
 *
 * Two modes controlled by `interactiveMode`:
 *
 * BATCH MODE (interactiveMode:false, DEFAULT)
 *   Runs `<bin> <batchArgs>` synchronously and returns output directly.
 *
 * INTERACTIVE MODE (interactiveMode:true)
 *   Opens a terminal window. Three paths:
 *   1. streamContext.escalateToTask present → tracking task + wakeUp revival
 *   2. cronTaskId present (goroutine) → reuse parent task ID for revival (exists on both instances)
 *   3. CLI/cron → detached spawn, no revival
 */

import "server-only";

import { execSync, spawn } from "node:child_process";
import { once } from "node:events";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { ToolExecutionContext } from "@/app/api/[locale]/agent/chat/config";
import { CallbackMode } from "@/app/api/[locale]/system/unified-interface/ai/execute-tool/constants";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { CodingAgentT } from "./i18n";
import type { CodingAgentRequest, CodingAgentResponse } from "./types";

// ── Provider config ────────────────────────────────────────────────────────────

export interface ProviderConfig {
  /** CLI binary name (e.g. "claude", "opencode") */
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

interface TerminalEmulator {
  bin: string;
  buildArgs: (cliArgs: string[]) => string[];
}

function commandExists(cmd: string): boolean {
  try {
    execSync(`command -v ${cmd}`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function buildShellCommand(bin: string, args: string[], cwd: string): string {
  const escaped = args.map((a) => `'${a.replace(/'/g, "'\\''")}'`);
  return `cd '${cwd.replace(/'/g, "'\\''")}' && ${bin} ${escaped.join(" ")}`;
}

function detectTerminal(logger: EndpointLogger): TerminalEmulator | undefined {
  if (process.platform === "darwin") {
    if (commandExists("osascript")) {
      return {
        bin: "osascript",
        buildArgs: (args) => {
          // bin is embedded in the shell command via the caller
          const shellCmd = args[0] ?? "";
          return [
            "-e",
            `tell application "Terminal" to do script "${shellCmd.replace(/"/g, '\\"')}"`,
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
  // Pre-build the shell command string so terminal wrappers get a single string arg
  const shellCmd = buildShellCommand(provider.bin, cliArgs, cwd);
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

// ── Batch execution (shared) ───────────────────────────────────────────────────

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
      message: t("codingAgent.run.post.errors.internalExitCode.title"),
      messageParams: { exitCode: String(exitCode) },
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }

  const output = stderr ? `${stdout}\n\n--- stderr ---\n${stderr}` : stdout;
  return success({ output: output || "", durationMs });
}

// ── Helpers ────────────────────────────────────────────────────────────────────

async function getMcpInstanceName(userId: string): Promise<string> {
  const { RemoteConnectionRepository } =
    await import("@/app/api/[locale]/user/remote-connection/repository");
  return RemoteConnectionRepository.getLocalInstanceId(userId);
}

// ── Main entry point ───────────────────────────────────────────────────────────

export async function runCodingAgent(
  provider: ProviderConfig,
  data: CodingAgentRequest,
  userId: string,
  logger: EndpointLogger,
  t: CodingAgentT,
  cronTaskId: string | undefined,
  streamContext: ToolExecutionContext,
): Promise<ResponseType<CodingAgentResponse>> {
  const timeoutMs = 30 * 60 * 1000;
  const start = Date.now();
  const isInteractive = data.interactiveMode ?? false;
  const cwd = process.cwd();

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
  const title = data.taskTitle || data.prompt.slice(0, 80).replace(/\n/g, " ");

  // Path 1: streaming context → escalateToTask
  if (streamContext.escalateToTask) {
    const callbackMode = streamContext.callerCallbackMode ?? CallbackMode.WAIT;
    const { taskId: trackingTaskId } = await streamContext.escalateToTask({
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

    // WAIT / END_LOOP: pause the stream - complete-task will revive it.
    // Mirror the remote queue WAIT path: set waitingForRemoteResult, omit taskId.
    if (
      (callbackMode === CallbackMode.WAIT ||
        callbackMode === CallbackMode.END_LOOP) &&
      streamContext
    ) {
      streamContext.waitingForRemoteResult = true;
      // No timeout - interactive sessions can take arbitrarily long.
      streamContext.pendingTimeoutMs = 0;
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
      hint: "Result will be injected automatically as a deferred message when complete. Do NOT call wait-for-task.",
    });
  }

  // Path 2: goroutine / cron context - reuse the parent task ID directly.
  // The parent cron task (cronTaskId) already has all wakeUp revival columns and
  // exists on both Thea and Hermes. When Claude calls complete-task with cronTaskId,
  // Hermes pushes the result to Thea using that same ID, Thea's /report finds the
  // task and triggers handleTaskCompletion correctly.
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
      // terminalPending signals triggerLocalPulse to skip handleTaskCompletion and wait
      // for the real terminal to call complete-task with the actual output.
      terminalPending: true,
      hint: "Result will be injected automatically as a deferred message when complete. Do NOT call wait-for-task.",
    });
  }

  // Path 3: CLI/cron - no revival.
  // If the provider supports task context injection (e.g. claude-code), reaching here
  // means we have no taskId to inject - the spawned process can't call complete-task.
  // Return an error so the caller knows the session can't be tracked.
  if (provider.injectTaskContext) {
    logger.error(
      "Interactive mode requires a taskId (escalateToTask or cronTaskId) but none was provided",
      { bin: provider.bin },
    );
    return fail({
      message: t("codingAgent.run.post.errors.internal.title"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
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
