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

/**
 * Internal Next.js port offset above the public-facing port.
 * Defined here (not imported from websocket/server) to avoid circular deps.
 */
export const NEXT_PORT_OFFSET = 100;

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
  // Support multi-PID files (one per line) - kill all recorded processes.
  // Skip PORT:<n> metadata lines.
  const pids = pidStr
    .split("\n")
    .filter((s) => !s.startsWith("PORT:"))
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
      logger.warn(
        "Previous instance did not exit gracefully, force killing...",
      );
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
 * Format: one PID per line, then an optional PORT:<n> line at the end.
 * Example:
 *   12345
 *   12346
 *   PORT:3002
 */
export function writePidFile(
  pidFile: string,
  logger: EndpointLogger,
  extraPids: number[] = [],
  port?: number,
): void {
  const dir = dirname(pidFile);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  const lines: string[] = [process.pid, ...extraPids].map(String);
  if (port !== undefined) {
    lines.push(`PORT:${String(port)}`);
  }
  writeFileSync(pidFile, lines.join("\n"), "utf-8");
  logger.debug("PID file written", {
    pid: process.pid,
    extraPids,
    port,
    path: pidFile,
  });
}

/**
 * Add a child PID to an existing PID file (e.g. when Next.js child spawns).
 * Preserves PORT:<n> metadata lines.
 */
export function addPidToFile(pidFile: string, pid: number): void {
  try {
    const existing = existsSync(pidFile)
      ? readFileSync(pidFile, "utf-8").trim()
      : String(process.pid);
    const lines = existing.split("\n");
    const portLines = lines.filter((l) => l.startsWith("PORT:"));
    const pids = new Set(
      lines
        .filter((l) => !l.startsWith("PORT:"))
        .map(Number)
        .filter(Boolean),
    );
    pids.add(pid);
    writeFileSync(pidFile, [...pids, ...portLines].join("\n"), "utf-8");
  } catch {
    // Ignore - best-effort
  }
}

/**
 * Remove a child PID from an existing PID file (e.g. when Next.js child exits).
 * Preserves PORT:<n> metadata lines.
 */
export function removePidFromFile(pidFile: string, pid: number): void {
  try {
    if (!existsSync(pidFile)) {
      return;
    }
    const lines = readFileSync(pidFile, "utf-8").trim().split("\n");
    const portLines = lines.filter((l) => l.startsWith("PORT:"));
    const pids = lines
      .filter((l) => !l.startsWith("PORT:"))
      .map(Number)
      .filter((p) => p > 0 && p !== pid);
    writeFileSync(pidFile, [...pids, ...portLines].join("\n"), "utf-8");
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

/**
 * Returns true if any process is currently bound to the given TCP port.
 * Non-destructive - does not kill anything.
 */
export function isPortInUse(port: number): boolean {
  try {
    execSync(`fuser ${port}/tcp 2>/dev/null`, { encoding: "utf-8" });
    return true;
  } catch {
    return false;
  }
}

/**
 * Returns true if the process occupying `port` is recorded in our PID file
 * (i.e. it belongs to this project instance - we can safely kill it).
 */
export function isPortOwnedByUs(port: number, pidFile: string): boolean {
  let pidOnPort: number | undefined;
  try {
    const output = execSync(`fuser ${port}/tcp 2>/dev/null`, {
      encoding: "utf-8",
    }).trim();
    const parsed = parseInt(output.split(/\s+/)[0] ?? "", 10);
    if (!isNaN(parsed) && parsed > 0) {
      pidOnPort = parsed;
    }
  } catch {
    return false; // nothing on port
  }

  if (!pidOnPort) {
    return false;
  }

  if (!existsSync(pidFile)) {
    return false;
  }

  try {
    const ourPids = new Set(
      readFileSync(pidFile, "utf-8")
        .trim()
        .split("\n")
        .filter((l) => !l.startsWith("PORT:"))
        .map(Number)
        .filter((p) => p > 0),
    );
    return ourPids.has(pidOnPort);
  } catch {
    return false;
  }
}

/**
 * Read the resolved port stored in a PID file (PORT:<n> line).
 * Returns null if the file doesn't exist or contains no PORT line.
 */
export function readPidFilePort(pidFile: string): number | null {
  try {
    if (!existsSync(pidFile)) {
      return null;
    }
    const portLine = readFileSync(pidFile, "utf-8")
      .trim()
      .split("\n")
      .find((l) => l.startsWith("PORT:"));
    if (!portLine) {
      return null;
    }
    const port = parseInt(portLine.slice(5), 10);
    return isNaN(port) || port <= 0 ? null : port;
  } catch {
    return null;
  }
}

/**
 * Find the lowest available port starting from `basePort` that is either:
 * - not in use at all, or
 * - in use by our own project (so we can kill it ourselves)
 *
 * `reservedPort` is the base port reserved for the sibling command
 * (e.g. 3001 for vibe dev, 3000 for vibe start). Both that port and its
 * internal offset (reservedPort + NEXT_PORT_OFFSET) are skipped when bumping.
 */
export function findAvailablePort(
  basePort: number,
  pidFile: string,
  reservedPort: number,
): number {
  let port = basePort;
  while (isPortInUse(port) && !isPortOwnedByUs(port, pidFile)) {
    port++;
    // Skip the port pair reserved for the sibling command
    if (port === reservedPort || port === reservedPort + NEXT_PORT_OFFSET) {
      port++;
    }
  }
  return port;
}
