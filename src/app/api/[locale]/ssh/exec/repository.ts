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

import type { ToolExecutionContext } from "@/app/api/[locale]/agent/chat/config";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import {
  getConnectionCredentials,
  isNodeError,
  openSshClient,
  sshExecCommand,
} from "../client";
import { ExecBackend, SshCommandStatus } from "../enum";
import type { SshExecRequestOutput, SshExecResponseOutput } from "./definition";
import type { SshExecT } from "./i18n";

export class SshExecRepository {
  private static readonly execAsync = promisify(exec);

  private static readonly LOCAL_MAX_OUTPUT_BYTES = Number(
    process.env["LOCAL_MAX_OUTPUT_BYTES"] ?? 32768,
  );

  private static readonly LOCAL_DEFAULT_TIMEOUT_MS = Number(
    process.env["LOCAL_DEFAULT_TIMEOUT_MS"] ?? 30000,
  );

  // Threshold above which we escalate to a wakeUp task instead of blocking the stream.
  // Anything >90s risks the stream dying before the command returns.
  private static readonly ESCALATE_THRESHOLD_MS = 89_000;
  private static isValidWorkingDir(dir: string): boolean {
    if (!dir.startsWith("/")) {
      return false;
    }
    if (dir.includes("..")) {
      return false;
    }
    return true;
  }

  private static capOutput(
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

  static async exec(
    data: SshExecRequestOutput,
    logger: EndpointLogger,
    user: JwtPayloadType,
    t: SshExecT,
    streamContext?: ToolExecutionContext,
  ): Promise<ResponseType<SshExecResponseOutput>> {
    const timeoutMs =
      data.timeoutMs ?? SshExecRepository.LOCAL_DEFAULT_TIMEOUT_MS;
    const command = data.command;

    // Validate workingDir if provided
    if (
      data.workingDir &&
      !SshExecRepository.isValidWorkingDir(data.workingDir)
    ) {
      return fail({
        message: t("errors.invalidWorkingDir"),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    // Escalate long-running commands to a wakeUp task so the stream doesn't time out.
    // Only applies in streaming contexts where escalateToTask is available.
    if (
      timeoutMs > SshExecRepository.ESCALATE_THRESHOLD_MS &&
      streamContext?.escalateToTask
    ) {
      const { taskId, onComplete } = await streamContext.escalateToTask();
      logger.info("[SshExec] Escalated long-running command to wakeUp task", {
        taskId,
        timeoutMs,
        command: command.slice(0, 200),
      });

      void (async (): Promise<void> => {
        const result = await SshExecRepository.exec(
          data,
          logger,
          user,
          t,
          // No streamContext — run inline without escalation loop
        );
        await onComplete({
          success: result.success,
          data: result.success
            ? {
                stdout: result.data.stdout,
                stderr: result.data.stderr,
                exitCode: result.data.exitCode,
                status: result.data.status,
                durationMs: result.data.durationMs,
                backend: result.data.backend,
                ...(result.data.truncated !== undefined
                  ? { truncated: result.data.truncated }
                  : {}),
              }
            : undefined,
          message: result.success ? undefined : result.message,
        });
      })();

      // Return immediately — AI will receive the real result via wakeUp revival.
      return success({
        stdout: `[Task escalated — result will be injected when complete. taskId=${taskId}]`,
        stderr: "",
        exitCode: 0,
        status: SshCommandStatus.SUCCESS,
        durationMs: 0,
        backend: data.connectionId ? ExecBackend.SSH : ExecBackend.LOCAL,
        truncated: false,
      });
    }

    if (data.connectionId) {
      return SshExecRepository.execSsh(
        data.connectionId,
        command,
        timeoutMs,
        user,
        logger,
        t,
      );
    }

    // LOCAL backend
    const start = Date.now();
    try {
      logger.info(`Running local command: ${command.slice(0, 200)}`);

      const { stdout: rawStdout, stderr: rawStderr } =
        await SshExecRepository.execAsync(command, {
          cwd: data.workingDir ?? undefined,
          timeout: timeoutMs,
          maxBuffer: SshExecRepository.LOCAL_MAX_OUTPUT_BYTES * 4,
        });

      const durationMs = Date.now() - start;

      const { value: stdout, truncated: stdoutTruncated } =
        SshExecRepository.capOutput(
          rawStdout,
          SshExecRepository.LOCAL_MAX_OUTPUT_BYTES,
        );
      const { value: stderr, truncated: stderrTruncated } =
        SshExecRepository.capOutput(
          rawStderr,
          SshExecRepository.LOCAL_MAX_OUTPUT_BYTES,
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
      if (!isNodeError(error)) {
        logger.error(`Unexpected error type in execLocal`, parseError(error));
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      if (
        error.killed ||
        error.signal === "SIGTERM" ||
        String(error.code) === "ETIMEDOUT"
      ) {
        logger.warn(`Command timed out after ${durationMs}ms`);
        return fail({
          message: t("errors.commandTimedOut"),
          errorType: ErrorResponseTypes.UNKNOWN_ERROR,
        });
      }

      // Non-zero exit code — still a valid result
      const rawStdout = error.stdout ?? "";
      const rawStderr = error.stderr ?? String(parseError(error));
      const { value: stdout, truncated: stdoutTruncated } =
        SshExecRepository.capOutput(
          rawStdout,
          SshExecRepository.LOCAL_MAX_OUTPUT_BYTES,
        );
      const { value: stderr, truncated: stderrTruncated } =
        SshExecRepository.capOutput(
          rawStderr,
          SshExecRepository.LOCAL_MAX_OUTPUT_BYTES,
        );

      const exitCode = typeof error.code === "number" ? error.code : 1;

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

  private static async execSsh(
    connectionId: string,
    command: string,
    timeoutMs: number,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: SshExecT,
  ): Promise<ResponseType<SshExecResponseOutput>> {
    const credsResult = await getConnectionCredentials(
      connectionId,
      user.id!,
      t,
    );
    if (!credsResult.success) {
      return fail({
        message: credsResult.message,
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    const clientResult = await openSshClient(credsResult.data, t);
    if (!clientResult.success) {
      return fail({
        message: clientResult.message,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    const { client } = clientResult.data;
    const start = Date.now();

    try {
      logger.info(
        `Running SSH command on ${credsResult.data.host}: ${command.slice(0, 200)}`,
      );
      const {
        stdout: rawStdout,
        stderr: rawStderr,
        exitCode,
      } = await sshExecCommand(client, command, timeoutMs);

      const durationMs = Date.now() - start;
      const { value: stdout, truncated: stdoutTruncated } =
        SshExecRepository.capOutput(
          rawStdout,
          SshExecRepository.LOCAL_MAX_OUTPUT_BYTES,
        );
      const { value: stderr, truncated: stderrTruncated } =
        SshExecRepository.capOutput(
          rawStderr,
          SshExecRepository.LOCAL_MAX_OUTPUT_BYTES,
        );

      logger.debug(
        `SSH command completed in ${durationMs}ms, exit ${exitCode}`,
      );

      return success({
        stdout,
        stderr,
        exitCode,
        status:
          exitCode === 0 ? SshCommandStatus.SUCCESS : SshCommandStatus.ERROR,
        durationMs,
        backend: ExecBackend.SSH,
        truncated: stdoutTruncated || stderrTruncated,
      });
    } catch (error) {
      const durationMs = Date.now() - start;
      const msg = String(parseError(error));
      if (msg.includes("timed out")) {
        logger.warn(`SSH command timed out after ${durationMs}ms`);
        return fail({
          message: t("errors.commandTimedOut"),
          errorType: ErrorResponseTypes.UNKNOWN_ERROR,
        });
      }
      logger.error("SSH exec failed", msg);
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    } finally {
      client.end();
    }
  }
}
