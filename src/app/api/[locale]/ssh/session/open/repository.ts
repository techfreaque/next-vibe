/**
 * SSH Session Open Repository
 * Opens a local pty session using node-pty (fallback: child_process shell)
 */

import "server-only";

import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { SshSessionStatus } from "../../enum";
import { sessionPool } from "../pool";
import type {
  SessionOpenRequestOutput,
  SessionOpenResponseOutput,
} from "./definition";

export class SessionOpenRepository {
  static async open(
    data: SessionOpenRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<SessionOpenResponseOutput>> {
    if (data.connectionId) {
      return fail({
        message:
          "SSH PTY sessions not yet implemented. Use ssh_exec_POST for remote commands.",
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    try {
      const sessionId = randomUUID();
      const shell = process.env["SHELL"] ?? "/bin/bash";

      // Spawn a shell process
      const proc = spawn(shell, [], {
        env: { ...process.env },
        stdio: ["pipe", "pipe", "pipe"],
      });

      let outputBuffer = "";
      const MAX_BUF = 65536;

      proc.stdout.on("data", (chunk: Buffer) => {
        outputBuffer += chunk.toString("utf8");
        if (outputBuffer.length > MAX_BUF) {
          outputBuffer = outputBuffer.slice(outputBuffer.length - MAX_BUF);
        }
      });
      proc.stderr.on("data", (chunk: Buffer) => {
        outputBuffer += chunk.toString("utf8");
        if (outputBuffer.length > MAX_BUF) {
          outputBuffer = outputBuffer.slice(outputBuffer.length - MAX_BUF);
        }
      });

      const idleTimer = setTimeout(
        () => {
          proc.kill();
          sessionPool.delete(sessionId);
        },
        Number(process.env["SSH_IDLE_TIMEOUT_MS"] ?? 300000),
      );

      sessionPool.set(sessionId, {
        sessionId,
        proc,
        outputBuffer: () => outputBuffer,
        drainOutput: () => {
          const out = outputBuffer;
          outputBuffer = "";
          return out;
        },
        status: SshSessionStatus.ACTIVE,
        idleTimer,
        openedAt: new Date(),
      });

      logger.info(`Opened local shell session ${sessionId}`);
      return success({ sessionId, status: SshSessionStatus.ACTIVE, shell });
    } catch (error) {
      logger.error("Failed to open session", parseError(error));
      return fail({
        message: ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
