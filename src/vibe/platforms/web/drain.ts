import "server-only";

/**
 * Node drain control for drain-based rolling deploys.
 *
 * A deploy takes ONE node out of rotation (Caddy sends new requests to the
 * peer, DNS drops the node), then waits until the work already running on it
 * has finished before the container is recreated. The deploy side lives in
 * `scripts/ha-node-drain.sh`; this module is the app side of that contract.
 *
 * The contract is a handful of files in {@link DRAIN_DIR} (relative to the app
 * cwd, i.e. `/app/.tmp/drain` in the container). Files, not HTTP: the deploy
 * script reaches them with `docker exec`, they need no auth surface, and they
 * vanish with the container, so a recreated node always starts undrained.
 *
 *   request          created by the deploy script: drain this node. Cron
 *                    pulses stop claiming new tasks; every process below
 *                    starts reporting its in-flight work.
 *   ws-close         created by the deploy script once the work is done: the
 *                    WebSocket hub closes every client socket with 1012
 *                    "Service Restart" so browsers reconnect (to the peer).
 *   status-<role>.json
 *                    written every second while `request` exists, one per
 *                    process: `next` (the Next.js child: AI loops) and
 *                    `server` (the vibe start process: WS hub, task runner).
 *
 * Removing `request` (undrain without a recreate) stops the reporting and
 * deletes the status files.
 */

import { existsSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/** Drain control directory, relative to the process cwd. */
export const DRAIN_DIR = join(".tmp", "drain");

const REQUEST_FILE = join(DRAIN_DIR, "request");

/** Which process writes a status file. */
export type DrainRole = "next" | "server";

/**
 * In-flight work counters of one process. Keys starting with `ws` describe
 * open connections (informational); every other key is work the deploy waits
 * on until it reaches 0.
 */
export type DrainCounts = Record<string, number>;

/** Set by {@link markShuttingDown}: this process is going down (SIGTERM). */
let shuttingDown = false;

/**
 * True while the deploy script has asked this node to drain, or while this
 * process shuts down. The cron pulse checks it before claiming a task.
 */
export function isDrainRequested(): boolean {
  return shuttingDown || existsSync(REQUEST_FILE);
}

/**
 * Mark THIS process as shutting down (SIGTERM path) so its cron pulse stops
 * claiming new work. In-process on purpose: local instances (Atlas, Hermes)
 * share one cwd, and a file would drain all of them.
 */
export function markShuttingDown(): void {
  shuttingDown = true;
}

function statusFile(dir: string, role: DrainRole): string {
  return join(dir, `status-${role}.json`);
}

function writeStatus(
  dir: string,
  role: DrainRole,
  counts: DrainCounts,
  wsClosed: boolean,
): void {
  const file = statusFile(dir, role);
  const tmp = `${file}.${String(process.pid)}.tmp`;
  writeFileSync(
    tmp,
    JSON.stringify({
      role,
      pid: process.pid,
      at: new Date().toISOString(),
      counts,
      wsClosed,
    }),
  );
  // Atomic replace: the deploy script never reads a half-written file.
  renameSync(tmp, file);
}

/**
 * Report this process's in-flight work while the node is draining, and run
 * `onWsClose` once when the deploy asks for the WebSocket close. Polls every
 * `intervalMs` (an `existsSync` per tick when idle). Returns a stop function.
 */
export function startDrainWatcher(options: {
  role: DrainRole;
  counts: () => DrainCounts;
  /** Close every client WebSocket; returns how many were closed. */
  onWsClose?: () => number;
  onDrainStart?: () => void;
  intervalMs?: number;
  /** Control directory (tests); defaults to {@link DRAIN_DIR}. */
  dir?: string;
}): () => void {
  const { role, counts, onWsClose, onDrainStart } = options;
  const dir = options.dir ?? DRAIN_DIR;
  const requestFile = join(dir, "request");
  const wsCloseFile = join(dir, "ws-close");
  let draining = false;
  let wsClosed = false;

  const tick = (): void => {
    try {
      if (!existsSync(requestFile)) {
        if (draining) {
          draining = false;
          wsClosed = false;
          rmSync(statusFile(dir, role), { force: true });
        }
        return;
      }
      if (!draining) {
        draining = true;
        onDrainStart?.();
      }
      if (onWsClose && !wsClosed && existsSync(wsCloseFile)) {
        wsClosed = true;
        onWsClose();
      }
      writeStatus(dir, role, counts(), wsClosed);
    } catch {
      // A failed tick (disk full, racing rm) must never hurt the app; the
      // deploy script treats a stale status as "unknown" and keeps waiting.
    }
  };

  const timer = setInterval(tick, options.intervalMs ?? 1000);
  return (): void => {
    clearInterval(timer);
  };
}
