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

// Global session pool (survives module re-evaluation in dev via globalThis)
const key = "__ssh_session_pool__";
const g = globalThis as typeof globalThis & { [key: string]: GlobalPool };
if (!g[key]) {
  g[key] = new Map<string, SessionEntry>();
}

export const sessionPool: GlobalPool = g[key];
