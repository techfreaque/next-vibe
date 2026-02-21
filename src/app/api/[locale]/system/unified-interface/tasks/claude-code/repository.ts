/**
 * Claude Code Repository
 * Spawns `claude -p` CLI with a prompt, blocks until done, returns output.
 */

import "server-only";

import { exec } from "node:child_process";
import { promisify } from "node:util";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { RunRequestOutput, RunResponseOutput } from "./definition";

const execAsync = promisify(exec);

/** Max output buffer: 10 MB */
const MAX_BUFFER = 10 * 1024 * 1024;

/** Shell-escape a single argument */
function shellEscape(arg: string): string {
  return `'${arg.replace(/'/g, "'\\''")}'`;
}

export async function runClaudeCode(
  data: RunRequestOutput,
  logger: EndpointLogger,
): Promise<ResponseType<RunResponseOutput>> {
  const timeoutMs = data.timeoutMs ?? 600000;
  const start = Date.now();

  // Build claude CLI args
  const args: string[] = [
    "claude",
    "-p",
    data.prompt,
    "--output-format",
    "text",
  ];

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

  const command = args.map(shellEscape).join(" ");

  logger.info("Running Claude Code CLI", {
    prompt: data.prompt.slice(0, 200),
    model: data.model,
    timeoutMs,
  });

  try {
    const { stdout, stderr } = await execAsync(command, {
      cwd: data.workingDir ?? process.cwd(),
      timeout: timeoutMs,
      maxBuffer: MAX_BUFFER,
    });

    const durationMs = Date.now() - start;

    logger.info("Claude Code CLI completed", {
      durationMs,
      outputLength: stdout.length,
    });

    // Combine output — claude -p writes to stdout, errors to stderr
    const output = stderr ? `${stdout}\n\n--- stderr ---\n${stderr}` : stdout;

    return success({
      output,
      exitCode: 0,
      durationMs,
    });
  } catch (error) {
    const durationMs = Date.now() - start;

    // exec errors include exit code and output
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      "stdout" in error
    ) {
      const execError = error as {
        code: number;
        stdout: string;
        stderr: string;
      };

      logger.error("Claude Code CLI exited with error", {
        exitCode: execError.code,
        durationMs,
      });

      const output = execError.stderr
        ? `${execError.stdout}\n\n--- stderr ---\n${execError.stderr}`
        : execError.stdout;

      return success({
        output: output || "No output",
        exitCode: execError.code,
        durationMs,
      });
    }

    logger.error("Claude Code CLI failed", parseError(error));

    return fail({
      message:
        "app.api.system.unifiedInterface.tasks.claudeCode.run.post.errors.internal.title",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}
