/**
 * Cortex Exec Repository
 * Executes shell commands via persistent terminal sessions.
 * Routes to local child_process, SSH PTY, or remote WS delegation.
 */

import "server-only";

import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";

import { and, eq, or } from "drizzle-orm";
import type { ToolExecutionContext } from "next-vibe/agent/chat/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";

import {
  getConnectionCredentials,
  openSshClient,
  openSshPty,
  saveFingerprint,
} from "@/ssh/client";
import { sshConnectionMounts, sshConnections } from "@/ssh/db";
import { ExecBackend, SshAuthType, SshSessionStatus } from "@/ssh/enum";
import {
  CWD_MARKER_PREFIX,
  CWD_MARKER_SUFFIX,
  extractCwdFromOutput,
  getDefaultSession,
  sessionPool,
  updateSessionCwd,
} from "@/ssh/session/pool";

import type {
  CortexExecRequestOutput,
  CortexExecResponseOutput,
} from "./definition";
import type { CortexExecT } from "./i18n";

export class CortexExecRepository {
  private static readonly MAX_OUTPUT_BYTES = Number(
    process.env["LOCAL_MAX_OUTPUT_BYTES"] ?? 32768,
  );

  private static readonly DEFAULT_TIMEOUT_MS = Number(
    process.env["LOCAL_DEFAULT_TIMEOUT_MS"] ?? 30000,
  );

  private static readonly ESCALATE_THRESHOLD_MS = 89_000;

  private static readonly IDLE_TIMEOUT_MS = Number(
    process.env["SSH_IDLE_TIMEOUT_MS"] ?? 300000,
  );

  private static readonly MAX_BUF = 65536;

  private static readonly UUID_RE =
    /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i;

  // Matches ANSI escape sequences (colors, cursor movement, etc.)
  // Built with RegExp constructor to avoid no-control-regex lint rule
  private static readonly ANSI_RE = new RegExp(
    [
      "\x1b\\[[0-9;]*[a-zA-Z]",
      "\x1b\\]0;[^\x07]*\x07",
      "\x1b\\][^\x07]*\x07",
      "\x1b\\[\\?[0-9;]*[a-zA-Z]",
    ].join("|"),
    "g",
  );

  // ─── Public API ────────────────────────────────────────────────────────────

  static async exec(
    data: CortexExecRequestOutput,
    logger: EndpointLogger,
    user: JwtPayloadType,
    t: CortexExecT,
    streamContext: ToolExecutionContext,
  ): Promise<ResponseType<CortexExecResponseOutput>> {
    const timeoutMs = data.timeoutMs ?? this.DEFAULT_TIMEOUT_MS;
    const command = data.command;

    const slugResult = this.parseConnectionSlug(data.path, t);
    if (!slugResult.success) {
      return slugResult;
    }
    const { slug, subPath } = slugResult.data;

    // Explicit workingDir wins; otherwise use the sub-path from the cortex path
    const workingDir = data.workingDir ?? subPath ?? undefined;

    if (workingDir && !this.isValidWorkingDir(workingDir)) {
      return fail({
        message: t("errors.invalidWorkingDir"),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }

    const connResult = await this.resolveConnection(slug, user.id!, t);
    if (!connResult.success) {
      return connResult;
    }
    const conn = connResult.data;

    if (
      conn.kind === "local" &&
      (user.isPublic || !user.roles.includes(UserPermissionRole.ADMIN))
    ) {
      return fail({
        message: t("post.errors.forbidden.description"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    if (
      timeoutMs > this.ESCALATE_THRESHOLD_MS &&
      streamContext.escalateToTask
    ) {
      return this.escalateToTask(data, logger, user, t, streamContext, conn);
    }

    if (conn.kind === "remote") {
      return fail({
        message: t("errors.remoteNotSupported"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    const terminalResult = await this.getOrCreateTerminal(
      conn,
      data.terminalId,
      user,
      logger,
      t,
    );
    if (!terminalResult.success) {
      return terminalResult;
    }
    const { sessionId } = terminalResult.data;

    const execResult = await this.executeInTerminal(
      sessionId,
      command,
      workingDir,
      timeoutMs,
      t,
    );
    if (!execResult.success) {
      return execResult;
    }

    const { output, exitCode, cwd, truncated } = execResult.data;
    const backend = conn.kind === "local" ? ExecBackend.LOCAL : ExecBackend.SSH;

    logger.debug(t("log.execComplete"), {
      slug: conn.slug,
      exitCode,
      cwd,
      backend,
    });

    return success({
      output,
      exitCode,
      cwd,
      terminalId: sessionId,
      backend,
      truncated,
    });
  }

  // ─── Path Parsing ──────────────────────────────────────────────────────────

  private static parseConnectionSlug(
    path: string,
    t: CortexExecT,
  ): ResponseType<{ slug: string; subPath: string | null }> {
    const match = /^\/ssh\/([^/]+)(\/.*)?$/.exec(path);
    if (!match?.[1]) {
      return fail({
        message: t("errors.invalidPath"),
        errorType: ErrorResponseTypes.BAD_REQUEST,
      });
    }
    return success({ slug: match[1], subPath: match[2] ?? null });
  }

  private static isValidWorkingDir(dir: string): boolean {
    return dir.startsWith("/") && !dir.includes("..");
  }

  private static labelToSlug(label: string): string {
    return label.toLowerCase().replace(/\s+/g, "-");
  }

  // ─── Connection Resolution ─────────────────────────────────────────────────

  private static async resolveConnection(
    slug: string,
    userId: string,
    t: CortexExecT,
  ): Promise<
    ResponseType<{
      kind: "local" | "ssh" | "remote";
      connectionId: string;
      slug: string;
    }>
  > {
    const isUuid = this.UUID_RE.test(slug);
    const slugFilter = isUuid
      ? or(eq(sshConnections.id, slug), eq(sshConnections.label, slug))
      : eq(sshConnections.label, slug);

    const rows = await db
      .select({
        id: sshConnections.id,
        label: sshConnections.label,
        authType: sshConnections.authType,
      })
      .from(sshConnections)
      .where(and(eq(sshConnections.userId, userId), slugFilter))
      .limit(2);

    const match =
      (isUuid ? rows.find((r) => r.id === slug) : undefined) ??
      rows.find((r) => r.label === slug) ??
      rows.find((r) => this.labelToSlug(r.label) === slug);

    if (!match) {
      const allConns = await db
        .select({
          id: sshConnections.id,
          label: sshConnections.label,
          authType: sshConnections.authType,
        })
        .from(sshConnections)
        .where(eq(sshConnections.userId, userId));

      const slugMatch = allConns.find(
        (r) => this.labelToSlug(r.label) === slug,
      );
      if (slugMatch) {
        return success({
          kind: slugMatch.authType === SshAuthType.LOCAL ? "local" : "ssh",
          connectionId: slugMatch.id,
          slug,
        });
      }

      const { remoteConnections } =
        await import("../../../remote-connection/db");
      const remoteRows = await db
        .select({
          id: remoteConnections.id,
          instanceId: remoteConnections.instanceId,
        })
        .from(remoteConnections)
        .where(
          and(
            eq(remoteConnections.userId, userId),
            eq(remoteConnections.isActive, true),
          ),
        );
      const remoteMatch = remoteRows.find(
        (r) => r.instanceId === slug || r.instanceId.toLowerCase() === slug,
      );
      if (remoteMatch) {
        return success({
          kind: "remote",
          connectionId: remoteMatch.id,
          slug,
        });
      }

      return fail({
        message: t("errors.noConnection"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    return success({
      kind: match.authType === SshAuthType.LOCAL ? "local" : "ssh",
      connectionId: match.id,
      slug,
    });
  }

  // ─── Terminal Session Management ───────────────────────────────────────────

  private static async getOrCreateTerminal(
    conn: {
      kind: "local" | "ssh" | "remote";
      connectionId: string;
      slug: string;
    },
    terminalId: string | undefined,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: CortexExecT,
  ): Promise<ResponseType<{ sessionId: string }>> {
    if (terminalId) {
      const existing = sessionPool.get(terminalId);
      if (!existing) {
        return fail({
          message: t("post.errors.notFound.description"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      if (existing.connectionSlug !== conn.slug) {
        return fail({
          message: t("post.errors.conflict.description"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }
      clearTimeout(existing.idleTimer);
      existing.idleTimer = setTimeout(() => {
        this.cleanupSession(terminalId);
      }, this.IDLE_TIMEOUT_MS);
      return success({ sessionId: terminalId });
    }

    const existing = getDefaultSession(conn.slug);
    if (existing) {
      clearTimeout(existing.idleTimer);
      existing.idleTimer = setTimeout(() => {
        this.cleanupSession(existing.sessionId);
      }, this.IDLE_TIMEOUT_MS);
      return success({ sessionId: existing.sessionId });
    }

    if (conn.kind === "local") {
      return this.createLocalSession(conn, user.id!, logger, t);
    }
    if (conn.kind === "ssh") {
      return this.createSshSession(conn, user, logger, t);
    }

    return fail({
      message: t("errors.remoteNotSupported"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }

  private static cleanupSession(sessionId: string): void {
    const session = sessionPool.get(sessionId);
    if (!session) {
      return;
    }
    try {
      clearTimeout(session.idleTimer);
      if (session.kind === "ssh") {
        session.channel.close();
        session.client.end();
      } else {
        session.proc.kill("SIGTERM");
      }
    } catch {
      // Best-effort cleanup
    }
    sessionPool.delete(sessionId);
  }

  private static async createLocalSession(
    conn: { connectionId: string; slug: string },
    userId: string,
    logger: EndpointLogger,
    t: CortexExecT,
  ): Promise<ResponseType<{ sessionId: string }>> {
    try {
      const sessionId = randomUUID();
      const shell = process.env["SHELL"] ?? "/bin/bash";
      const homeDir = process.env["HOME"] ?? "/";

      // Use default mount path as initial cwd if configured
      const defaultMount = await db
        .select({ path: sshConnectionMounts.path })
        .from(sshConnectionMounts)
        .where(
          and(
            eq(sshConnectionMounts.connectionId, conn.connectionId),
            eq(sshConnectionMounts.userId, userId),
            eq(sshConnectionMounts.isDefault, true),
          ),
        )
        .limit(1);
      const startCwd = defaultMount[0]?.path ?? homeDir;

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
      const appendOutput = (chunk: Buffer): void => {
        outputBuffer += chunk.toString("utf8");
        if (outputBuffer.length > this.MAX_BUF) {
          outputBuffer = outputBuffer.slice(outputBuffer.length - this.MAX_BUF);
        }
      };

      proc.stdout.on("data", appendOutput);
      proc.stderr.on("data", appendOutput);

      const now = new Date();
      const idleTimer = setTimeout(() => {
        this.cleanupSession(sessionId);
      }, this.IDLE_TIMEOUT_MS);

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
        openedAt: now,
        cwd: startCwd,
        connectionSlug: conn.slug,
        connectionId: conn.connectionId,
        name: "",
        lastCommandAt: now,
      });

      // cd to default mount cwd on startup
      if (startCwd !== homeDir) {
        proc.stdin.write(`cd "${startCwd.replace(/"/g, '\\"')}"\n`);
      }

      logger.info(t("log.openedLocal"), { sessionId, slug: conn.slug });
      return success({ sessionId });
    } catch (error) {
      logger.error(t("log.failedLocal"), parseError(error));
      return fail({
        message: t("post.errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  private static async createSshSession(
    conn: { connectionId: string; slug: string },
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: CortexExecT,
  ): Promise<ResponseType<{ sessionId: string }>> {
    const credsResult = await getConnectionCredentials(
      conn.connectionId,
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

    if (!creds.fingerprint || fingerprintChanged) {
      await saveFingerprint(conn.connectionId, fingerprint).catch(
        (saveErr: Error) => {
          logger.warn(t("log.failedFingerprint"), parseError(saveErr));
        },
      );
    }

    let channel;
    try {
      channel = await openSshPty(client, 220, 50);
    } catch (err) {
      client.end();
      logger.error(t("log.failedPty"), parseError(err));
      return fail({
        message: t("post.errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    const sessionId = randomUUID();
    let outputBuffer = "";
    const appendOutput = (chunk: Buffer): void => {
      outputBuffer += chunk.toString("utf8");
      if (outputBuffer.length > this.MAX_BUF) {
        outputBuffer = outputBuffer.slice(outputBuffer.length - this.MAX_BUF);
      }
    };

    channel.on("data", appendOutput);
    channel.stderr?.on("data", appendOutput);

    const now = new Date();
    const idleTimer = setTimeout(() => {
      this.cleanupSession(sessionId);
    }, this.IDLE_TIMEOUT_MS);

    channel.on("close", () => {
      clearTimeout(idleTimer);
      sessionPool.delete(sessionId);
    });

    // Use default mount path as initial cwd if configured
    const defaultMount = await db
      .select({ path: sshConnectionMounts.path })
      .from(sshConnectionMounts)
      .where(
        and(
          eq(sshConnectionMounts.connectionId, conn.connectionId),
          eq(sshConnectionMounts.userId, user.id!),
          eq(sshConnectionMounts.isDefault, true),
        ),
      )
      .limit(1);
    const startCwd = defaultMount[0]?.path ?? `/home/${creds.username}`;

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
      openedAt: now,
      cwd: startCwd,
      connectionSlug: conn.slug,
      connectionId: conn.connectionId,
      name: "",
      lastCommandAt: now,
    });

    // cd to default mount cwd on startup
    if (defaultMount[0]) {
      channel.write(`cd "${startCwd.replace(/"/g, '\\"')}"\n`);
    }

    logger.info(t("log.openedSsh"), {
      sessionId,
      slug: conn.slug,
      target: `${creds.username}@${creds.host}`,
    });
    return success({ sessionId });
  }

  // ─── Command Execution ────────────────────────────────────────────────────

  private static async executeInTerminal(
    sessionId: string,
    command: string,
    workingDir: string | undefined,
    timeoutMs: number,
    t: CortexExecT,
  ): Promise<
    ResponseType<{
      output: string;
      exitCode: number;
      cwd: string;
      truncated: boolean;
    }>
  > {
    const session = sessionPool.get(sessionId);
    if (!session) {
      return fail({
        message: t("post.errors.notFound.description"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    // Drain pending output
    session.drainOutput();

    // Build command with CWD tracking
    const parts: string[] = [];
    if (workingDir) {
      parts.push(`cd ${JSON.stringify(workingDir)} 2>/dev/null`);
    }
    parts.push(
      `${command}; __cortex_ec=$?; echo "${CWD_MARKER_PREFIX}$(pwd)${CWD_MARKER_SUFFIX}"; exit $__cortex_ec 2>/dev/null || true`,
    );
    const fullCommand = parts.join(" && ");

    const input = `${fullCommand}\n`;
    if (session.kind === "local") {
      session.proc.stdin?.write(input);
    } else {
      session.channel.write(input);
    }

    session.lastCommandAt = new Date();

    // Wait for CWD marker or timeout
    const start = Date.now();
    let output = "";
    let settled = false;

    await new Promise<void>((resolve) => {
      const check = (): void => {
        const elapsed = Date.now() - start;
        output += session.drainOutput();

        if (
          output.includes(CWD_MARKER_PREFIX) &&
          output.includes(CWD_MARKER_SUFFIX)
        ) {
          settled = true;
          resolve();
          return;
        }

        if (elapsed >= timeoutMs) {
          resolve();
          return;
        }

        setTimeout(check, 100);
      };
      setTimeout(check, 50);
    });

    const { cleanOutput, detectedCwd } = extractCwdFromOutput(output);
    if (detectedCwd) {
      updateSessionCwd(sessionId, detectedCwd);
    }

    // Strip terminal noise
    const cleaned = this.cleanTerminalOutput(cleanOutput, command);

    const { value: cappedOutput, truncated } = this.capOutput(
      cleaned,
      this.MAX_OUTPUT_BYTES,
    );

    const cwd = detectedCwd ?? session.cwd;
    const exitCode = settled ? 0 : timeoutMs <= Date.now() - start ? 124 : 0;

    return success({ output: cappedOutput, exitCode, cwd, truncated });
  }

  // ─── Output Cleaning ──────────────────────────────────────────────────────

  private static cleanTerminalOutput(raw: string, command: string): string {
    // Strip ANSI escape sequences and carriage returns
    let cleaned = raw.replace(this.ANSI_RE, "").replace(/\r/g, "");

    const lines = cleaned.split("\n");
    const result: string[] = [];
    let pastCommand = false;

    for (const line of lines) {
      // Shell prompt lines (e.g. "[user@host dir]$ ..." or "user@host:dir$ ...")
      if (/[\w@][\w.-]*[@:].*\$\s/.test(line)) {
        continue;
      }
      // Our injected internals: __cortex_ec, CWD marker, exit wrapper
      if (
        line.includes("__cortex_ec") ||
        line.includes(CWD_MARKER_PREFIX) ||
        line.includes("exit $__cortex_ec")
      ) {
        pastCommand = true;
        continue;
      }
      // Injected cd commands echoed by shell (session init or workingDir prepend)
      if (/^\s*cd\s+"[^"]*"\s*$/.test(line)) {
        continue;
      }
      // The user command echoed by the shell (appears before output)
      if (
        !pastCommand &&
        line.trimStart().startsWith(command.trimStart().slice(0, 40))
      ) {
        pastCommand = true;
        continue;
      }
      result.push(line);
    }

    // Use result if we identified the command echo, else fall back to all non-prompt lines
    const output = (
      pastCommand
        ? result
        : lines.filter((l) => !/[\w@][\w.-]*[@:].*\$\s/.test(l))
    ).join("\n");

    return output
      .replace(/^\$\s*$/gm, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  private static capOutput(
    str: string,
    maxBytes: number,
  ): { value: string; truncated: boolean } {
    const buf = Buffer.from(str, "utf8");
    if (buf.length <= maxBytes) {
      return { value: str, truncated: false };
    }
    const truncatedStr = buf.subarray(0, maxBytes).toString("utf8");
    return {
      value: `${truncatedStr}\n[output truncated]`,
      truncated: true,
    };
  }

  // ─── Long-Running Escalation ──────────────────────────────────────────────

  private static async escalateToTask(
    data: CortexExecRequestOutput,
    logger: EndpointLogger,
    user: JwtPayloadType,
    t: CortexExecT,
    streamContext: ToolExecutionContext,
    conn: { kind: "local" | "ssh" | "remote"; slug: string },
  ): Promise<ResponseType<CortexExecResponseOutput>> {
    const { taskId, onComplete } = await streamContext.escalateToTask!();

    logger.info(t("log.escalated"), {
      taskId,
      timeoutMs: data.timeoutMs,
      command: data.command.slice(0, 200),
    });

    void (async (): Promise<void> => {
      const noEscalateContext: ToolExecutionContext = {
        ...streamContext,
        escalateToTask: undefined,
      };
      const result = await CortexExecRepository.exec(
        data,
        logger,
        user,
        t,
        noEscalateContext,
      );
      await onComplete(
        result.success ? { success: true, data: result.data } : result,
      );
    })();

    return success({
      output: `[Task escalated - result will be injected when complete. taskId=${taskId}]`,
      exitCode: 0,
      cwd: "",
      terminalId: "",
      backend: conn.kind === "local" ? ExecBackend.LOCAL : ExecBackend.SSH,
      truncated: false,
    });
  }
}
