/**
 * Claude Code Repository
 *
 * Two modes controlled by `interactiveMode`:
 *
 * BATCH MODE (interactiveMode:false, DEFAULT)
 *   Runs `claude -p` synchronously and returns output directly.
 *   execute-tool's outer layer handles all callbackModes transparently —
 *   no special handling needed here.
 *
 * INTERACTIVE MODE (interactiveMode:true)
 *   Opens a terminal window. The session can run for hours or days.
 *
 *   When called from a streaming context (streamContext.escalateToTask present):
 *   escalateToTask() creates the tracking task, sets waitingForRemoteResult so
 *   the stream aborts via REMOTE_TOOL_WAIT (stays visible + cancellable), and
 *   handles revival when CC calls complete-task. The callbackMode is taken from
 *   streamContext.callerCallbackMode so wait/wakeUp/detach/endLoop all work.
 *
 *   When called from a goroutine (cronTaskId present, no escalateToTask):
 *   Manual task creation with revival columns copied from parent task row.
 *
 *   When called from CLI/cron (no context): spawn detached, no revival.
 *
 *   Cleanup: complete-task deletes the tracking task row after revival.
 */

import "server-only";

import { execSync, spawn } from "node:child_process";
import { once } from "node:events";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { ToolExecutionContext } from "@/app/api/[locale]/agent/chat/config";
import { db } from "@/app/api/[locale]/system/db";
import { CallbackMode } from "@/app/api/[locale]/system/unified-interface/ai/execute-tool/constants";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { cronTasks } from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import {
  CronTaskPriority,
  CronTaskStatus,
  TaskCategory,
  TaskOutputMode,
} from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import type { RunRequestOutput, RunResponseOutput } from "./definition";
import type { ClaudeCodeT } from "./i18n";

interface TerminalEmulator {
  bin: string;
  /** Build the full argv to run `claude ...args` inside this terminal */
  buildArgs: (claudeArgs: string[], cwd: string) => string[];
}

export class ClaudeCodeRepository {
  // Ain't got time for that
  private static readonly YOLO_MODE = true;

  /**
   * Check if a command exists on the system.
   */
  private static commandExists(cmd: string): boolean {
    try {
      execSync(`command -v ${cmd}`, { stdio: "ignore" });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Build a shell command string that cd's into cwd and runs claude with args.
   */
  private static buildShellCommand(claudeArgs: string[], cwd: string): string {
    const escaped = claudeArgs.map((a) => `'${a.replace(/'/g, "'\\''")}'`);
    return `cd '${cwd.replace(/'/g, "'\\''")}' && claude ${escaped.join(" ")}`;
  }

  /**
   * Detect the best available terminal emulator.
   * Checks $TERMINAL env var first, then probes common emulators.
   */
  private static detectTerminal(
    logger: EndpointLogger,
  ): TerminalEmulator | undefined {
    const isMac = process.platform === "darwin";

    // macOS: use open -a Terminal (or iTerm if available)
    if (isMac) {
      const macApp = ClaudeCodeRepository.commandExists("osascript")
        ? "osascript"
        : undefined;
      if (macApp) {
        return {
          bin: "osascript",
          buildArgs: (claudeArgs, cwd) => {
            const shellCmd = ClaudeCodeRepository.buildShellCommand(
              claudeArgs,
              cwd,
            );
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
    if (envTerminal && ClaudeCodeRepository.commandExists(envTerminal)) {
      logger.info("Using $TERMINAL", { terminal: envTerminal });
      return {
        bin: envTerminal,
        buildArgs: (claudeArgs, cwd) => [
          "-e",
          ClaudeCodeRepository.buildShellCommand(claudeArgs, cwd),
        ],
      };
    }

    // 2. Common terminal emulators with their specific exec flags
    const candidates: Array<{
      bin: string;
      execFlag: string[];
    }> = [
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
      if (ClaudeCodeRepository.commandExists(candidate.bin)) {
        logger.info("Detected terminal emulator", { terminal: candidate.bin });
        return {
          bin: candidate.bin,
          buildArgs: (claudeArgs, cwd) => {
            const shellCmd = ClaudeCodeRepository.buildShellCommand(
              claudeArgs,
              cwd,
            );
            return [...candidate.execFlag, "sh", "-c", shellCmd];
          },
        };
      }
    }

    return undefined;
  }

  /**
   * Spawn claude in a separate terminal window for interactive mode.
   * Returns immediately once the terminal is launched.
   */
  private static spawnInTerminal(
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
      env: { ...process.env, CLAUDECODE: undefined },
      stdio: "ignore",
      detached: true,
    }).unref();
  }

  /**
   * Core batch execution: spawns `claude -p` and collects output.
   */
  private static async runClaudeCodeBatch(
    args: string[],
    cwd: string,
    timeoutMs: number,
    logger: EndpointLogger,
    t: ClaudeCodeT,
  ): Promise<ResponseType<RunResponseOutput>> {
    const start = Date.now();
    const stdoutChunks: Buffer[] = [];
    const stderrChunks: Buffer[] = [];

    const child = spawn("claude", args, {
      cwd,
      env: process.env,
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

    logger.debug("Claude Code batch finished", {
      exitCode,
      durationMs,
      stdoutLength: stdout.length,
      stderrLength: stderr.length,
    });

    if (exitCode !== 0) {
      const errOutput = stderr
        ? `${stdout}\n\n--- stderr ---\n${stderr}`
        : stdout;
      logger.warn("Claude Code exited with non-zero code", {
        exitCode,
        errOutput: errOutput.slice(0, 200),
      });
      return fail({
        message: t("claudeCode.run.post.errors.internalExitCode.title"),
        messageParams: { exitCode: String(exitCode) },
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    const output = stderr ? `${stdout}\n\n--- stderr ---\n${stderr}` : stdout;

    return success({
      output: output || "",
      durationMs,
    });
  }

  static async runClaudeCode(
    data: RunRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: ClaudeCodeT,
    cronTaskId: string | undefined,
    streamContext: ToolExecutionContext | undefined,
  ): Promise<ResponseType<RunResponseOutput>> {
    const timeoutMs = 30 * 60 * 1000; // 30 minutes hard cap
    const start = Date.now();
    const isInteractive = data.interactiveMode ?? false;
    const cwd = process.cwd();

    // Build claude CLI args
    const args: string[] = isInteractive
      ? [data.prompt]
      : ["-p", data.prompt, "--output-format", "text"];
    if (ClaudeCodeRepository.YOLO_MODE) {
      args.push("--dangerously-skip-permissions");
    }
    if (data.model) {
      args.push("--model", data.model);
    }

    logger.debug("Running Claude Code CLI", {
      mode: isInteractive ? "interactive" : "batch",
      prompt: data.prompt.slice(0, 200),
      model: data.model,
      timeoutMs,
      taskId: cronTaskId,
    });

    // ── Interactive mode ────────────────────────────────────────────────────────
    if (isInteractive) {
      const title =
        data.taskTitle || data.prompt.slice(0, 80).replace(/\n/g, " ");

      // ── Path 1: streaming context with escalateToTask (the normal AI-call path) ──
      // escalateToTask creates the tracking task, aborts the stream via REMOTE_TOOL_WAIT
      // (stays visible + cancellable), and handles revival when CC calls complete-task.
      if (streamContext?.escalateToTask) {
        const callbackMode =
          streamContext.callerCallbackMode ?? CallbackMode.WAIT;
        const { taskId: trackingTaskId } = await streamContext.escalateToTask({
          callbackMode,
          displayName: title,
        });

        const { RemoteConnectionRepository: RCR } =
          await import("@/app/api/[locale]/user/remote-connection/repository");
        const selfInstanceId = RCR.deriveDefaultSelfInstanceId();
        const mcpInstanceName =
          selfInstanceId === "hermes-dev" ? "vibe-dev" : "vibe-local";

        args[0] = `${args[0]}\n\n[TASK CONTEXT] taskId=${trackingTaskId} - When the work is complete, call MCP tool "complete-task" on MCP server "${mcpInstanceName}" with taskId="${trackingTaskId}" and response={"output":"<full result text>"} - pass the complete result in the response object so the AI that launched you can see it.`;

        const terminal = ClaudeCodeRepository.detectTerminal(logger);
        if (terminal) {
          try {
            ClaudeCodeRepository.spawnInTerminal(terminal, args, cwd, logger);
          } catch (err) {
            logger.error("Failed to spawn terminal", parseError(err));
            return fail({
              message: t("claudeCode.run.post.errors.internal.title"),
              errorType: ErrorResponseTypes.INTERNAL_ERROR,
            });
          }
          logger.info("Interactive: launched in terminal via escalateToTask", {
            terminal: terminal.bin,
            trackingTaskId,
            callbackMode,
          });
        } else {
          // No terminal - spawn detached background process
          logger.warn(
            "No terminal found, spawning detached via escalateToTask",
          );
          spawn("claude", args, {
            cwd,
            env: { ...process.env, CLAUDECODE: undefined },
            stdio: "ignore",
            detached: true,
          }).unref();
          logger.info("Interactive: launched detached via escalateToTask", {
            trackingTaskId,
            callbackMode,
          });
        }

        const durationMs = Date.now() - start;
        return success({
          output: `Interactive Claude Code session launched. Task ID: ${trackingTaskId}.`,
          durationMs,
          taskId: trackingTaskId,
          hint: "Interactive session launched. Result will be delivered when Claude Code calls complete-task.",
        });
      }

      // ── Path 2: goroutine context (cronTaskId present, no escalateToTask) ──
      // Copy revival columns from parent task row so complete-task can revive correctly.
      if (cronTaskId) {
        const trackingTaskId = `cc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

        let revivalColumns: {
          wakeUpCallbackMode?: string;
          wakeUpThreadId?: string | null;
          wakeUpToolMessageId?: string | null;
          wakeUpLeafMessageId?: string | null;
          wakeUpModelId?: string | null;
          wakeUpSkillId?: string | null;
          wakeUpFavoriteId?: string | null;
        } = {};

        try {
          const parentTask = await db
            .select({
              wakeUpCallbackMode: cronTasks.wakeUpCallbackMode,
              wakeUpThreadId: cronTasks.wakeUpThreadId,
              wakeUpToolMessageId: cronTasks.wakeUpToolMessageId,
              wakeUpLeafMessageId: cronTasks.wakeUpLeafMessageId,
              wakeUpModelId: cronTasks.wakeUpModelId,
              wakeUpSkillId: cronTasks.wakeUpSkillId,
              wakeUpFavoriteId: cronTasks.wakeUpFavoriteId,
            })
            .from(cronTasks)
            .where(eq(cronTasks.id, cronTaskId))
            .limit(1)
            .then((rows) => rows[0] ?? null);

          if (parentTask) {
            revivalColumns = {
              wakeUpCallbackMode: parentTask.wakeUpCallbackMode ?? undefined,
              wakeUpThreadId: parentTask.wakeUpThreadId,
              wakeUpToolMessageId: parentTask.wakeUpToolMessageId,
              wakeUpLeafMessageId: parentTask.wakeUpLeafMessageId,
              wakeUpModelId: parentTask.wakeUpModelId,
              wakeUpSkillId: parentTask.wakeUpSkillId,
              wakeUpFavoriteId: parentTask.wakeUpFavoriteId,
            };
          }

          const { RemoteConnectionRepository } =
            await import("@/app/api/[locale]/user/remote-connection/repository");
          const instanceId =
            RemoteConnectionRepository.deriveDefaultSelfInstanceId();

          await db.insert(cronTasks).values({
            id: trackingTaskId,
            shortId: trackingTaskId,
            routeId: "claude-code",
            displayName: title,
            description: data.prompt.slice(0, 500),
            category: TaskCategory.DEVELOPMENT,
            schedule: "manual",
            enabled: false,
            priority: CronTaskPriority.LOW,
            runOnce: true,
            lastExecutionStatus: CronTaskStatus.RUNNING,
            outputMode: TaskOutputMode.STORE_ONLY,
            notificationTargets: [],
            targetInstance: instanceId,
            tags: ["claude-code", "interactive"],
            userId: user.id,
            ...revivalColumns,
          });

          logger.info("Interactive (goroutine): created tracking task", {
            trackingTaskId,
            wakeUpCallbackMode: revivalColumns.wakeUpCallbackMode,
          });
        } catch (err) {
          logger.warn(
            "Failed to create goroutine tracking task",
            parseError(err),
          );
        }

        const { RemoteConnectionRepository: RCR2 } =
          await import("@/app/api/[locale]/user/remote-connection/repository");
        const mcpInstanceNameGoroutine =
          RCR2.deriveDefaultSelfInstanceId() === "hermes-dev"
            ? "vibe-dev"
            : "vibe-local";

        args[0] = `${args[0]}\n\n[TASK CONTEXT] taskId=${trackingTaskId} - When the work is complete, call MCP tool "complete-task" on MCP server "${mcpInstanceNameGoroutine}" with taskId="${trackingTaskId}" and response={"output":"<full result text>"} - pass the complete result in the response object so the AI that launched you can see it.`;

        const terminal = ClaudeCodeRepository.detectTerminal(logger);
        if (terminal) {
          try {
            ClaudeCodeRepository.spawnInTerminal(terminal, args, cwd, logger);
          } catch (err) {
            logger.error(
              "Failed to spawn terminal (goroutine)",
              parseError(err),
            );
            return fail({
              message: t("claudeCode.run.post.errors.internal.title"),
              errorType: ErrorResponseTypes.INTERNAL_ERROR,
            });
          }
        } else {
          spawn("claude", args, {
            cwd,
            env: { ...process.env, CLAUDECODE: undefined },
            stdio: "ignore",
            detached: true,
          }).unref();
        }

        const durationMs = Date.now() - start;
        logger.info("Interactive (goroutine): session launched", {
          trackingTaskId,
          durationMs,
        });

        return success({
          output: `Interactive Claude Code session launched. Task ID: ${trackingTaskId}.`,
          durationMs,
          taskId: trackingTaskId,
          hint: "Interactive session launched. Result will be delivered when Claude Code calls complete-task.",
        });
      }

      // ── Path 3: CLI/cron - no revival context, just spawn and return ──
      logger.info("Interactive (CLI/cron): spawning detached, no revival");
      const terminal = ClaudeCodeRepository.detectTerminal(logger);
      if (terminal) {
        try {
          ClaudeCodeRepository.spawnInTerminal(terminal, args, cwd, logger);
        } catch (err) {
          logger.error("Failed to spawn terminal (CLI)", parseError(err));
          return fail({
            message: t("claudeCode.run.post.errors.internal.title"),
            errorType: ErrorResponseTypes.INTERNAL_ERROR,
          });
        }
      } else {
        spawn("claude", args, {
          cwd,
          env: process.env,
          stdio: "ignore",
          detached: true,
        }).unref();
      }

      const durationMs = Date.now() - start;
      return success({
        output: "Interactive Claude Code session launched.",
        durationMs,
      });
    }

    // ── Batch mode ──────────────────────────────────────────────────────────────
    // Run synchronously and return the result. execute-tool handles all callback
    // modes (wakeUp, detach, wait, endLoop) at the outer layer.
    return ClaudeCodeRepository.runClaudeCodeBatch(
      args,
      cwd,
      timeoutMs,
      logger,
      t,
    );
  }
}
