/**
 * Claude Code Repository
 * Two modes controlled by the `headless` flag:
 * - headless:false (default): spawns `claude` with inherited stdio so the user can chat
 * - headless:true: spawns `claude -p` and pipes output back
 * Both modes require a prompt.
 */

import "server-only";

import { spawn } from "node:child_process";
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

export async function runClaudeCode(
  data: RunRequestOutput,
  logger: EndpointLogger,
  t: ModuleT,
): Promise<ResponseType<RunResponseOutput>> {
  const timeoutMs = data.timeoutMs ?? 600000;
  const start = Date.now();
  const isInteractive = !(data.headless ?? false);

  // Interactive: full claude session (user can chat back and forth)
  // Batch: -p print mode, returns when done
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

  const stdoutChunks: Buffer[] = [];
  const stderrChunks: Buffer[] = [];

  const child = spawn("claude", args, {
    cwd: data.workingDir ?? process.cwd(),
    env: process.env,
    stdio: isInteractive ? "inherit" : ["ignore", "pipe", "pipe"],
  });

  if (!isInteractive) {
    child.stdout?.on("data", (chunk: Buffer) => {
      stdoutChunks.push(chunk);
      process.stdout.write(chunk);
    });
    child.stderr?.on("data", (chunk: Buffer) => {
      stderrChunks.push(chunk);
      process.stderr.write(chunk);
    });
  }

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

  if (isInteractive) {
    logger.info("Claude Code interactive session finished", {
      exitCode,
      durationMs,
    });
    return success({ output: "", exitCode, durationMs });
  }

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
