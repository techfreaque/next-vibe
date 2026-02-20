/**
 * In-memory session pool for local shell sessions
 */

import type { ChildProcess } from "node:child_process";

import type { SshSessionStatus } from "../enum";

export interface LocalSessionEntry {
  sessionId: string;
  proc: ChildProcess;
  outputBuffer: () => string;
  drainOutput: () => string;
  status: SshSessionStatus;
  idleTimer: ReturnType<typeof setTimeout>;
  openedAt: Date;
}

type GlobalPool = Map<string, LocalSessionEntry>;

// Global session pool (survives module re-evaluation in dev via globalThis)
const key = "__ssh_session_pool__";
const g = globalThis as typeof globalThis & { [key: string]: GlobalPool };
if (!g[key]) {
  g[key] = new Map<string, LocalSessionEntry>();
}

export const sessionPool: GlobalPool = g[key];
