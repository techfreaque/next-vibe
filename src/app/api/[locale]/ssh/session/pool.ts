/**
 * In-memory session pool for local shell and remote SSH sessions
 */

import type { ChildProcess } from "node:child_process";

import type { ClientChannel, Ssh2Client } from "../client";
import type { SshSessionStatus } from "../enum";

export interface LocalSessionEntry {
  sessionId: string;
  kind: "local";
  proc: ChildProcess;
  outputBuffer: () => string;
  drainOutput: () => string;
  status: SshSessionStatus;
  idleTimer: ReturnType<typeof setTimeout>;
  openedAt: Date;
}

export interface SshSessionEntry {
  sessionId: string;
  kind: "ssh";
  client: Ssh2Client;
  channel: ClientChannel;
  outputBuffer: () => string;
  drainOutput: () => string;
  status: SshSessionStatus;
  idleTimer: ReturnType<typeof setTimeout>;
  openedAt: Date;
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
    // Synchronous cleanup — clear all timers so the event loop can drain
    for (const session of g.__ssh_session_pool__.values()) {
      try { clearTimeout(session.idleTimer); } catch { /* ignore */ }
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
      // Best-effort — process may already be dead
    }
    sessionPool.delete(id);
  }
}
