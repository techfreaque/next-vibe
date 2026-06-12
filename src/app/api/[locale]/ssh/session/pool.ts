/**
 * In-memory session pool for local shell and remote SSH sessions.
 * Used internally by cortex-exec to maintain persistent terminal sessions.
 */

import type { ChildProcess } from "node:child_process";

import type { ClientChannel, Ssh2Client } from "../client";
import type { SshSessionStatus } from "../enum";

// ─── Shared Fields ───────────────────────────────────────────────────────────

interface SessionMeta {
  sessionId: string;
  outputBuffer: () => string;
  drainOutput: () => string;
  status: SshSessionStatus;
  idleTimer: ReturnType<typeof setTimeout>;
  openedAt: Date;
  /** Tracked working directory (updated after each command) */
  cwd: string;
  /** Cortex mount slug, e.g. "local-machine" or "my-server" */
  connectionSlug: string;
  /** UUID from sshConnections or synthetic ID for remote connections */
  connectionId: string;
  /** Optional user-provided label for this terminal */
  name: string;
  /** Timestamp of last command execution */
  lastCommandAt: Date;
}

// ─── Entry Types ─────────────────────────────────────────────────────────────

export interface LocalSessionEntry extends SessionMeta {
  kind: "local";
  proc: ChildProcess;
}

export interface SshSessionEntry extends SessionMeta {
  kind: "ssh";
  client: Ssh2Client;
  channel: ClientChannel;
}

export type SessionEntry = LocalSessionEntry | SshSessionEntry;

type GlobalPool = Map<string, SessionEntry>;

interface SshGlobal {
  __ssh_session_pool__: GlobalPool;
  __ssh_session_pool_drain_registered__: boolean;
}

// Global session pool (survives module re-evaluation in dev via globalThis)
const g = globalThis as typeof globalThis & SshGlobal;
if (!g.__ssh_session_pool__) {
  g.__ssh_session_pool__ = new Map<string, SessionEntry>();
}
// Register drain-on-exit once per process (not per HMR cycle)
if (!g.__ssh_session_pool_drain_registered__) {
  g.__ssh_session_pool_drain_registered__ = true;
  process.on("exit", () => {
    // Synchronous cleanup - clear all timers so the event loop can drain
    for (const session of g.__ssh_session_pool__.values()) {
      try {
        clearTimeout(session.idleTimer);
      } catch {
        /* ignore */
      }
    }
  });
}

export const sessionPool: GlobalPool = g.__ssh_session_pool__;

/**
 * Drain and close all sessions in the pool. Called on server shutdown or
 * at startup to clean up sessions from a previous crashed run.
 */
export function drainSessionPool(): void {
  for (const [id, session] of sessionPool) {
    try {
      clearTimeout(session.idleTimer);
      if (session.kind === "ssh") {
        session.channel.close();
        session.client.end();
      } else {
        session.proc.kill("SIGTERM");
      }
    } catch {
      // Best-effort - process may already be dead
    }
    sessionPool.delete(id);
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Get all active sessions for a given connection slug */
export function getSessionsForConnection(slug: string): SessionEntry[] {
  const result: SessionEntry[] = [];
  for (const session of sessionPool.values()) {
    if (session.connectionSlug === slug) {
      result.push(session);
    }
  }
  return result;
}

/** Find the default (first) session for a connection, if any */
export function getDefaultSession(slug: string): SessionEntry | undefined {
  for (const session of sessionPool.values()) {
    if (session.connectionSlug === slug) {
      return session;
    }
  }
  return undefined;
}

/** Update the tracked CWD for a session */
export function updateSessionCwd(sessionId: string, cwd: string): void {
  const session = sessionPool.get(sessionId);
  if (session) {
    session.cwd = cwd;
  }
}

/** CWD marker used to detect working directory from command output */
export const CWD_MARKER_PREFIX = "__CWD__";
export const CWD_MARKER_SUFFIX = "__CWD__";
export const CWD_MARKER_REGEX = /__CWD__(.+?)__CWD__\n?/g;

/** Strip CWD markers from output and return the detected cwd (if any) */
export function extractCwdFromOutput(output: string): {
  cleanOutput: string;
  detectedCwd: string | null;
} {
  let detectedCwd: string | null = null;
  const cleanOutput = output.replace(CWD_MARKER_REGEX, (...args: string[]) => {
    detectedCwd = args[1] ?? null;
    return "";
  });
  return { cleanOutput, detectedCwd };
}
