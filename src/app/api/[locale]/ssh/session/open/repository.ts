/**
 * SSH Session Open Repository
 * Opens a local pty session or a remote SSH PTY session.
 * If no connectionId is given, uses the user's default connection (if set);
 * admin falls back to local shell; non-admin requires a connection.
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
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import {
  getConnectionCredentials,
  getDefaultConnectionId,
  openSshClient,
  openSshPty,
  saveFingerprint,
} from "../../client";
import { SshSessionStatus } from "../../enum";
import type { SshT } from "../../i18n";
import { sessionPool } from "../pool";
import type {
  SessionOpenRequestOutput,
  SessionOpenResponseOutput,
} from "./definition";

export class SessionOpenRepository {
  static async open(
    data: SessionOpenRequestOutput,
    logger: EndpointLogger,
    user: JwtPayloadType,
    t: SshT,
  ): Promise<ResponseType<SessionOpenResponseOutput>> {
    const cols = data.cols ?? 220;
    const rows = data.rows ?? 50;

    // Resolve connectionId: explicit > default connection > local (admin only)
    let connectionId = data.connectionId ?? null;

    if (!connectionId) {
      const defaultId = await getDefaultConnectionId(user.id!);
      if (defaultId) {
        connectionId = defaultId;
      } else if (
        user.isPublic ||
        !user.roles.includes(UserPermissionRole.ADMIN)
      ) {
        return fail({
          message: t("errors.noDefaultConnection"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
      // Admin with no default → fall through to local
    }

    if (connectionId) {
      return SessionOpenRepository.openSsh(
        connectionId,
        user,
        cols,
        rows,
        logger,
        t,
      );
    }

    return SessionOpenRepository.openLocal(logger, t);
  }

  private static async openSsh(
    connectionId: string,
    user: JwtPayloadType,
    cols: number,
    rows: number,
    logger: EndpointLogger,
    t: SshT,
  ): Promise<ResponseType<SessionOpenResponseOutput>> {
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
    const creds = credsResult.data;

    const clientResult = await openSshClient(creds, t);
    if (!clientResult.success) {
      return fail({
        message: clientResult.message,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
    const { client, fingerprint, fingerprintChanged } = clientResult.data;

    // Persist new/changed fingerprint
    if (!creds.fingerprint || fingerprintChanged) {
      await saveFingerprint(connectionId, fingerprint).catch(
        (saveErr: Error) => {
          logger.warn("Failed to save fingerprint", parseError(saveErr));
        },
      );
    }

    let channel;
    try {
      channel = await openSshPty(client, cols, rows);
    } catch (err) {
      client.end();
      logger.error("Failed to open SSH PTY", parseError(err));
      return fail({
        message: t("session.open.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    const sessionId = randomUUID();
    let outputBuffer = "";
    const MAX_BUF = 65536;

    channel.on("data", (chunk: Buffer) => {
      outputBuffer += chunk.toString("utf8");
      if (outputBuffer.length > MAX_BUF) {
        outputBuffer = outputBuffer.slice(outputBuffer.length - MAX_BUF);
      }
    });
    channel.stderr?.on("data", (chunk: Buffer) => {
      outputBuffer += chunk.toString("utf8");
      if (outputBuffer.length > MAX_BUF) {
        outputBuffer = outputBuffer.slice(outputBuffer.length - MAX_BUF);
      }
    });

    const idleTimer = setTimeout(
      () => {
        channel.close();
        client.end();
        sessionPool.delete(sessionId);
      },
      Number(process.env["SSH_IDLE_TIMEOUT_MS"] ?? 300000),
    );

    channel.on("close", () => {
      clearTimeout(idleTimer);
      sessionPool.delete(sessionId);
    });

    sessionPool.set(sessionId, {
      sessionId,
      kind: "ssh",
      client,
      channel,
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

    const shell = `${creds.username}@${creds.host}`;
    logger.info(`Opened SSH PTY session ${sessionId} → ${shell}`);
    return success({ sessionId, status: SshSessionStatus.ACTIVE, shell });
  }

  private static async openLocal(
    logger: EndpointLogger,
    t: SshT,
  ): Promise<ResponseType<SessionOpenResponseOutput>> {
    try {
      const sessionId = randomUUID();
      const shell = process.env["SHELL"] ?? "/bin/bash";

      // Use `script` to allocate a real PTY so bash gets proper job control
      const proc = spawn("script", ["-q", "-c", shell, "/dev/null"], {
        env: {
          ...process.env,
          TERM: "xterm-256color",
          PS1: "$ ",
          PROMPT_COMMAND: "",
        },
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
        kind: "local",
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
        message: t("session.open.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
