/**
 * Claude Code Repository
 * Two modes controlled by the `headless` flag:
 * - headless:false (default): opens a NEW terminal window with `claude` so the
 *   human can interact without log collision from the Next.js dev server.
 * - headless:true: spawns `claude -p` in the same process and pipes output back.
 * Both modes require a prompt.
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

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { scopedTranslation } from "../i18n";
import type { RunRequestOutput, RunResponseOutput } from "./definition";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

// Ain't got time for that
const YOLO_MODE = true;

/**
 * Check if a command exists on the system.
 */
function commandExists(cmd: string): boolean {
  try {
    execSync(`command -v ${cmd}`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

interface TerminalEmulator {
  bin: string;
  /** Build the full argv to run `claude ...args` inside this terminal */
  buildArgs: (claudeArgs: string[], cwd: string) => string[];
}

/**
 * Build a shell command string that cd's into cwd and runs claude with args.
 */
function buildShellCommand(claudeArgs: string[], cwd: string): string {
  const escaped = claudeArgs.map((a) => `'${a.replace(/'/g, "'\\''")}'`);
  return `cd '${cwd.replace(/'/g, "'\\''")}' && claude ${escaped.join(" ")}`;
}

/**
 * Detect the best available terminal emulator.
 * Checks $TERMINAL env var first, then probes common emulators.
 */
function detectTerminal(logger: EndpointLogger): TerminalEmulator | undefined {
  const isMac = process.platform === "darwin";

  // macOS: use open -a Terminal (or iTerm if available)
  if (isMac) {
    // Prefer iTerm2, fall back to Terminal.app
    const macApp = commandExists("osascript") ? "osascript" : undefined;
    if (macApp) {
      return {
        bin: "osascript",
        buildArgs: (claudeArgs, cwd) => {
          const shellCmd = buildShellCommand(claudeArgs, cwd);
          // AppleScript to open Terminal.app with a command
          return [
            "-e",
            `tell application "Terminal" to do script "${shellCmd.replace(/"/g, '\\"')}"`,
          ];
        },
      };
    }
    return undefined;
  }

  // Linux / other Unix: try emulators in priority order

  // 1. $TERMINAL env var (user's explicit preference)
  const envTerminal = process.env["TERMINAL"];
  if (envTerminal && commandExists(envTerminal)) {
    logger.info("Using $TERMINAL", { terminal: envTerminal });
    return {
      bin: envTerminal,
      buildArgs: (claudeArgs, cwd) => [
        "-e",
        buildShellCommand(claudeArgs, cwd),
      ],
    };
  }

  // 2. Common terminal emulators with their specific exec flags
  const candidates: Array<{
    bin: string;
    execFlag: string[];
  }> = [
    // Debian/Ubuntu system default
    { bin: "x-terminal-emulator", execFlag: ["-e"] },
    // Popular modern terminals
    { bin: "kitty", execFlag: ["--"] },
    { bin: "alacritty", execFlag: ["-e"] },
    { bin: "wezterm", execFlag: ["start", "--"] },
    // Desktop environment defaults
    { bin: "gnome-terminal", execFlag: ["--"] },
    { bin: "konsole", execFlag: ["-e"] },
    { bin: "xfce4-terminal", execFlag: ["-e"] },
    { bin: "mate-terminal", execFlag: ["-e"] },
    // Fallback
    { bin: "xterm", execFlag: ["-e"] },
  ];

  for (const candidate of candidates) {
    if (commandExists(candidate.bin)) {
      logger.info("Detected terminal emulator", { terminal: candidate.bin });
      return {
        bin: candidate.bin,
        buildArgs: (claudeArgs, cwd) => {
          const shellCmd = buildShellCommand(claudeArgs, cwd);
          // Most terminals accept: terminal -e sh -c "command"
          return [...candidate.execFlag, "sh", "-c", shellCmd];
        },
      };
    }
  }

  return undefined;
}

/**
 * Spawn claude in a separate terminal window for interactive mode.
 * Returns immediately once the terminal is launched — we don't wait for
 * the claude session to finish since it's in its own window.
 */
function spawnInTerminal(
  terminal: TerminalEmulator,
  claudeArgs: string[],
  cwd: string,
  logger: EndpointLogger,
): void {
  const termArgs = terminal.buildArgs(claudeArgs, cwd);
  logger.info("Spawning terminal", {
    bin: terminal.bin,
    args: termArgs,
  });

  spawn(terminal.bin, termArgs, {
    cwd,
    env: process.env,
    stdio: "ignore",
    detached: true,
  }).unref();
}

export async function runClaudeCode(
  data: RunRequestOutput,
  logger: EndpointLogger,
  t: ModuleT,
): Promise<ResponseType<RunResponseOutput>> {
  const timeoutMs = data.timeoutMs ?? 600000;
  const start = Date.now();
  const isInteractive = !(data.headless ?? false);
  const cwd = data.workingDir ?? process.cwd();

  // Build claude CLI args
  const args: string[] = isInteractive
    ? [data.prompt]
    : ["-p", data.prompt, "--output-format", "text"];
  if (YOLO_MODE) {
    args.push("--dangerously-skip-permissions");
  }
  if (data.model) {
    args.push("--model", data.model);
  }
  if (data.maxBudgetUsd !== undefined && data.maxBudgetUsd !== null) {
    args.push("--max-budget-usd", String(data.maxBudgetUsd));
  }
  if (data.systemPrompt) {
    args.push("--system-prompt", data.systemPrompt);
  }
  if (data.allowedTools) {
    args.push("--allowedTools", data.allowedTools);
  }

  logger.info("Running Claude Code CLI", {
    mode: isInteractive ? "interactive" : "batch",
    prompt: data.prompt.slice(0, 200),
    model: data.model,
    timeoutMs,
  });

  // ── Interactive mode: open in a separate terminal window ──
  if (isInteractive) {
    const terminal = detectTerminal(logger);

    if (terminal) {
      try {
        spawnInTerminal(terminal, args, cwd, logger);
      } catch (err) {
        logger.error("Failed to spawn terminal", parseError(err));
        return fail({
          message: t("claudeCode.run.post.errors.internal.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      const durationMs = Date.now() - start;
      logger.info("Claude Code interactive session launched in terminal", {
        terminal: terminal.bin,
        durationMs,
      });

      return success({
        output: `Opened interactive Claude Code session in ${terminal.bin}`,
        exitCode: 0,
        durationMs,
      });
    }

    // Fallback: no terminal emulator found — use inherited stdio
    logger.warn("No terminal emulator found, falling back to inherited stdio");

    const child = spawn("claude", args, {
      cwd,
      env: process.env,
      stdio: "inherit",
    });

    const timer = setTimeout(() => {
      child.kill("SIGTERM");
    }, timeoutMs);

    try {
      await once(child, "close");
    } catch (err) {
      clearTimeout(timer);
      logger.error("Claude Code CLI failed to spawn", parseError(err));
      return fail({
        message: t("claudeCode.run.post.errors.internal.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    clearTimeout(timer);
    const durationMs = Date.now() - start;
    const exitCode = child.exitCode ?? 1;

    logger.info("Claude Code interactive session finished (inherited stdio)", {
      exitCode,
      durationMs,
    });
    return success({ output: "", exitCode, durationMs });
  }

  // ── Batch mode: pipe output back ──
  const stdoutChunks: Buffer[] = [];
  const stderrChunks: Buffer[] = [];

  const child = spawn("claude", args, {
    cwd,
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
  });

  child.stdout?.on("data", (chunk: Buffer) => {
    stdoutChunks.push(chunk);
    process.stdout.write(chunk);
  });
  child.stderr?.on("data", (chunk: Buffer) => {
    stderrChunks.push(chunk);
    process.stderr.write(chunk);
  });

  const timer = setTimeout(() => {
    child.kill("SIGTERM");
  }, timeoutMs);

  try {
    await once(child, "close");
  } catch (err) {
    clearTimeout(timer);
    logger.error("Claude Code CLI failed to spawn", parseError(err));
    return fail({
      message: t("claudeCode.run.post.errors.internal.title"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }

  clearTimeout(timer);
  const durationMs = Date.now() - start;
  const exitCode = child.exitCode ?? 1;

  const stdout = Buffer.concat(stdoutChunks).toString("utf8");
  const stderr = Buffer.concat(stderrChunks).toString("utf8");

  logger.info("Claude Code batch finished", {
    exitCode,
    durationMs,
    stdoutLength: stdout.length,
    stderrLength: stderr.length,
  });

  const output = stderr ? `${stdout}\n\n--- stderr ---\n${stderr}` : stdout;

  return success({
    output: output || "No output",
    exitCode,
    durationMs,
  });
}
