/**
 * PID file management for vibe start / vibe dev
 * Ensures only one instance of each type runs at a time and enables rebuild signaling via SIGUSR1
 */

import { execSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname } from "node:path";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

/** PID file for production server (vibe start) */
export const VIBE_START_PID_FILE = ".tmp/.vibe-start.pid";

/** PID file for development server (vibe dev) */
export const VIBE_DEV_PID_FILE = ".tmp/.vibe-dev.pid";

/**
 * Check if a process with the given PID is still running
 */
function isProcessRunning(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

/**
 * Kill a previous vibe instance if still running.
 * Reads the PID file, checks if the process is alive, sends SIGTERM, waits for exit.
 */
export function killPreviousInstance(
  pidFile: string,
  logger: EndpointLogger,
): void {
  if (!existsSync(pidFile)) {
    return;
  }

  const pidStr = readFileSync(pidFile, "utf-8").trim();
  // Support multi-PID files (one per line) - kill all recorded processes
  const pids = pidStr
    .split("\n")
    .map((s) => parseInt(s.trim(), 10))
    .filter((p) => !isNaN(p) && p > 0 && p !== process.pid);

  if (pids.length === 0) {
    cleanupPidFile(pidFile);
    return;
  }

  // Filter to only running processes
  const running = pids.filter(isProcessRunning);
  if (running.length === 0) {
    logger.debug("Stale PID file found (no processes running), cleaning up", {
      pids,
      pidFile,
    });
    cleanupPidFile(pidFile);
    return;
  }

  logger.debug("Killing previous vibe instance(s)", { pids: running, pidFile });

  // Send SIGTERM to all
  for (const pid of running) {
    try {
      process.kill(pid, "SIGTERM");
    } catch {
      /* already dead */
    }
  }

  // Wait up to 5 seconds for all to exit
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline && running.some(isProcessRunning)) {
    execSync("sleep 0.1");
  }

  // Force-kill any survivors
  for (const pid of running) {
    if (isProcessRunning(pid)) {
      logger.warn("Previous instance did not exit gracefully, force killing", {
        pid,
      });
      try {
        process.kill(pid, "SIGKILL");
      } catch {
        /* already dead */
      }
    }
  }

  logger.debug("Previous vibe instance(s) stopped", { pids: running });
  cleanupPidFile(pidFile);
}

/**
 * Write PIDs to the given PID file (main process + optional child PIDs).
 * Format: one PID per line, first line is always the main process PID.
 */
export function writePidFile(
  pidFile: string,
  logger: EndpointLogger,
  extraPids: number[] = [],
): void {
  const dir = dirname(pidFile);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  const allPids = [process.pid, ...extraPids].join("\n");
  writeFileSync(pidFile, allPids, "utf-8");
  logger.debug("PID file written", {
    pid: process.pid,
    extraPids,
    path: pidFile,
  });
}

/**
 * Add a child PID to an existing PID file (e.g. when Next.js child spawns).
 */
export function addPidToFile(pidFile: string, pid: number): void {
  try {
    const existing = existsSync(pidFile)
      ? readFileSync(pidFile, "utf-8").trim()
      : String(process.pid);
    const pids = new Set(existing.split("\n").map(Number).filter(Boolean));
    pids.add(pid);
    writeFileSync(pidFile, [...pids].join("\n"), "utf-8");
  } catch {
    // Ignore - best-effort
  }
}

/**
 * Remove a child PID from an existing PID file (e.g. when Next.js child exits).
 */
export function removePidFromFile(pidFile: string, pid: number): void {
  try {
    if (!existsSync(pidFile)) {
      return;
    }
    const existing = readFileSync(pidFile, "utf-8").trim();
    const pids = existing
      .split("\n")
      .map(Number)
      .filter((p) => p > 0 && p !== pid);
    writeFileSync(pidFile, pids.join("\n"), "utf-8");
  } catch {
    // Ignore - best-effort
  }
}

/**
 * Remove the PID file
 */
export function cleanupPidFile(pidFile: string): void {
  try {
    if (existsSync(pidFile)) {
      unlinkSync(pidFile);
    }
  } catch {
    // Ignore cleanup errors
  }
}
