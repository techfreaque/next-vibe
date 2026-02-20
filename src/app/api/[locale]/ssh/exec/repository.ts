/**
 * SSH Exec Repository
 * Executes shell commands via local child_process or SSH
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

import { ExecBackend, SshCommandStatus } from "../enum";
import type { SshExecRequestOutput, SshExecResponseOutput } from "./definition";

const execAsync = promisify(exec);

const LOCAL_MAX_OUTPUT_BYTES = Number(
  process.env["LOCAL_MAX_OUTPUT_BYTES"] ?? 32768,
);
const LOCAL_DEFAULT_TIMEOUT_MS = Number(
  process.env["LOCAL_DEFAULT_TIMEOUT_MS"] ?? 30000,
);

function isValidWorkingDir(dir: string): boolean {
  if (!dir.startsWith("/")) {
    return false;
  }
  if (dir.includes("..")) {
    return false;
  }
  return true;
}

function capOutput(
  str: string,
  maxBytes: number,
): { value: string; truncated: boolean } {
  const buf = Buffer.from(str, "utf8");
  if (buf.length <= maxBytes) {
    return { value: str, truncated: false };
  }
  const truncated = buf.subarray(0, maxBytes).toString("utf8");
  return {
    value: `${truncated}\n[output truncated — use ssh_files_read_GET to retrieve full output]`,
    truncated: true,
  };
}

export class SshExecRepository {
  static async exec(
    data: SshExecRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<SshExecResponseOutput>> {
    const timeoutMs = data.timeoutMs ?? LOCAL_DEFAULT_TIMEOUT_MS;
    const command = data.command;

    // Validate workingDir if provided
    if (data.workingDir && !isValidWorkingDir(data.workingDir)) {
      return fail({
        message:
          "Invalid working directory: must be absolute path without '..' segments",
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    if (data.connectionId) {
      // SSH backend — not yet implemented
      return fail({
        message:
          "SSH backend not yet implemented. Leave connectionId empty to run locally.",
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    // LOCAL backend
    const start = Date.now();
    try {
      logger.info(`Running local command: ${command.slice(0, 200)}`);

      const { stdout: rawStdout, stderr: rawStderr } = await execAsync(
        command,
        {
          cwd: data.workingDir ?? undefined,
          timeout: timeoutMs,
          maxBuffer: LOCAL_MAX_OUTPUT_BYTES * 4,
        },
      );

      const durationMs = Date.now() - start;

      const { value: stdout, truncated: stdoutTruncated } = capOutput(
        rawStdout,
        LOCAL_MAX_OUTPUT_BYTES,
      );
      const { value: stderr, truncated: stderrTruncated } = capOutput(
        rawStderr,
        LOCAL_MAX_OUTPUT_BYTES,
      );
      const truncated = stdoutTruncated || stderrTruncated;

      logger.debug(`Command completed in ${durationMs}ms, exit 0`);

      return success({
        stdout,
        stderr,
        exitCode: 0,
        status: SshCommandStatus.SUCCESS,
        durationMs,
        backend: ExecBackend.LOCAL,
        truncated,
      });
    } catch (error) {
      const durationMs = Date.now() - start;
      const err = error as NodeJS.ErrnoException & {
        stdout?: string;
        stderr?: string;
        code?: number | string;
        signal?: string;
        killed?: boolean;
      };

      if (
        err.killed ||
        err.signal === "SIGTERM" ||
        String(err.code) === "ETIMEDOUT"
      ) {
        logger.warn(`Command timed out after ${durationMs}ms`);
        return fail({
          message: `Command timed out after ${timeoutMs}ms`,
          errorType: ErrorResponseTypes.UNKNOWN_ERROR,
        });
      }

      // Non-zero exit code — still a valid result
      const rawStdout = err.stdout ?? "";
      const rawStderr = err.stderr ?? String(parseError(error));
      const { value: stdout, truncated: stdoutTruncated } = capOutput(
        rawStdout,
        LOCAL_MAX_OUTPUT_BYTES,
      );
      const { value: stderr, truncated: stderrTruncated } = capOutput(
        rawStderr,
        LOCAL_MAX_OUTPUT_BYTES,
      );

      const exitCode = typeof err.code === "number" ? err.code : 1;

      logger.debug(`Command exited with code ${exitCode} in ${durationMs}ms`);

      return success({
        stdout,
        stderr,
        exitCode,
        status: SshCommandStatus.ERROR,
        durationMs,
        backend: ExecBackend.LOCAL,
        truncated: stdoutTruncated || stderrTruncated,
      });
    }
  }
}
