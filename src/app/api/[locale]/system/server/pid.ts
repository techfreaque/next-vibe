/**
 * PID file management for vibe start / vibe dev
 * Ensures only one instance of each type runs at a time and enables rebuild signaling via SIGUSR1
 */

/* eslint-disable i18next/no-literal-string */

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
  const pid = parseInt(pidStr, 10);

  if (isNaN(pid) || pid <= 0) {
    // Invalid PID file, just clean it up
    cleanupPidFile(pidFile);
    return;
  }

  // Don't kill ourselves
  if (pid === process.pid) {
    return;
  }

  if (!isProcessRunning(pid)) {
    logger.debug("Stale PID file found (process not running), cleaning up", {
      pid,
      pidFile,
    });
    cleanupPidFile(pidFile);
    return;
  }

  logger.info("Killing previous vibe instance", { pid, pidFile });

  try {
    process.kill(pid, "SIGTERM");

    // Wait up to 5 seconds for graceful shutdown
    const deadline = Date.now() + 5000;
    while (Date.now() < deadline && isProcessRunning(pid)) {
      // Busy-wait with small delay (synchronous — this runs before server starts)
      execSync("sleep 0.1");
    }

    // If still alive, force kill
    if (isProcessRunning(pid)) {
      logger.warn("Previous instance did not exit gracefully, force killing", {
        pid,
      });
      try {
        process.kill(pid, "SIGKILL");
      } catch {
        // Already dead
      }
    }

    logger.info("Previous vibe instance stopped", { pid });
  } catch {
    // Process may have died between check and kill
    logger.debug("Previous instance already gone");
  }

  cleanupPidFile(pidFile);
}

/**
 * Write current process PID to the given PID file
 */
export function writePidFile(pidFile: string, logger: EndpointLogger): void {
  const dir = dirname(pidFile);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(pidFile, process.pid.toString(), "utf-8");
  logger.debug("PID file written", { pid: process.pid, path: pidFile });
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
