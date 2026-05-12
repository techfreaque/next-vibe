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

/** PID file for the supervisor wrapper around vibe start (owns the outer Bun process) */
export const VIBE_SUPERVISOR_PID_FILE = ".tmp/.vibe-supervisor.pid";

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
 * Also kills any residual process on the old internal port (PORT + NEXT_PORT_OFFSET)
 * that may have been orphaned (e.g. Next.js child whose parent exited before it finished).
 */
export function killPreviousInstance(
  pidFile: string,
  logger: EndpointLogger,
): void {
  if (!existsSync(pidFile)) {
    return;
  }

  const pidStr = readFileSync(pidFile, "utf-8").trim();
  const lines = pidStr.split("\n");

  // Support multi-PID files (one per line) - kill all recorded processes.
  // Skip PORT:<n> metadata lines.
  const pids = lines
    .filter((s) => !s.startsWith("PORT:"))
    .map((s) => parseInt(s.trim(), 10))
    .filter((p) => !isNaN(p) && p > 0 && p !== process.pid);

  // Read the old port so we can clean up the internal offset port too.
  const oldPortLine = lines.find((l) => l.startsWith("PORT:"));
  const oldPort = oldPortLine ? parseInt(oldPortLine.slice(5), 10) : undefined;

  if (pids.length === 0 && oldPort === undefined) {
    cleanupPidFile(pidFile);
    return;
  }

  // All PIDs recorded in the old file are ours - build a set for port ownership checks.
  const oldPidSet = new Set(pids);

  // Filter to only running processes
  const running = pids.filter(isProcessRunning);
  if (running.length > 0) {
    logger.debug("Killing previous vibe instance(s)", {
      pids: running,
      pidFile,
    });

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
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100);
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
  } else if (pids.length > 0) {
    logger.debug("Stale PID file found (no processes running), cleaning up", {
      pids,
      pidFile,
    });
  }

  // After tracked PIDs are dead, kill anything still on the old internal port
  // (PORT + NEXT_PORT_OFFSET). If all our tracked PIDs are gone, whatever remains
  // on that port must be an orphaned child (e.g. Nitro worker spawned by TanStack
  // Start, or a Next.js grandchild) — it's safe to kill it because we own that port.
  if (oldPort !== undefined && !isNaN(oldPort)) {
    const internalPort = oldPort + NEXT_PORT_OFFSET;
    const allTrackedDead = pids.every((p) => !isProcessRunning(p));
    const pidOnPort = getPidOnPort(internalPort);
    if (
      pidOnPort !== undefined &&
      pidOnPort !== process.pid &&
      // On Windows, only kill if explicitly tracked - the allTrackedDead fallback
      // would target unkillable system PIDs (Docker HNS) that happen to show on
      // this port in netstat but don't actually block binding.
      (oldPidSet.has(pidOnPort) ||
        (allTrackedDead && process.platform !== "win32"))
    ) {
      logger.debug(
        `Killing orphaned process on internal port ${internalPort}`,
        { pid: pidOnPort },
      );
      try {
        process.kill(pidOnPort, "SIGTERM");
      } catch {
        /* already dead */
      }
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 2000);
      try {
        if (isProcessRunning(pidOnPort)) {
          process.kill(pidOnPort, "SIGKILL");
        }
      } catch {
        /* already dead */
      }
    }
  }

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
 * Remove the PID file, but ONLY if the current process is the primary owner.
 * This prevents a shutting-down process from deleting a PID file that the
 * new server has already written (race condition: old shutdown + new writePidFile).
 */
export function cleanupPidFile(pidFile: string): void {
  try {
    if (!existsSync(pidFile)) {
      return;
    }
    // Only delete if our PID is the first entry (i.e. we own this file)
    const firstLine =
      readFileSync(pidFile, "utf-8").trim().split("\n")[0] ?? "";
    const ownerPid = parseInt(firstLine, 10);
    if (!isNaN(ownerPid) && ownerPid !== process.pid) {
      return; // New server has already taken ownership — leave it alone
    }
    unlinkSync(pidFile);
  } catch {
    // Ignore cleanup errors
  }
}

/**
 * Get the PID of the process listening on the given TCP port, or undefined if none.
 * Uses `fuser` on Linux/macOS and `netstat -ano` on Windows.
 */
export function getPidOnPort(port: number): number | undefined {
  try {
    if (process.platform === "win32") {
      const output = execSync("netstat -ano -p TCP", {
        encoding: "utf-8",
        stdio: "pipe",
      });
      for (const line of output.split("\n")) {
        // Match lines like: TCP  0.0.0.0:3100  0.0.0.0:0  LISTENING  7256
        if (
          !line.includes(`:${String(port)} `) &&
          !line.includes(`:${String(port)}\t`)
        ) {
          continue;
        }
        if (!line.includes("LISTEN")) {
          continue;
        }
        const parts = line.trim().split(/\s+/);
        const pid = parseInt(parts[parts.length - 1] ?? "", 10);
        if (!isNaN(pid) && pid > 0) {
          return pid;
        }
      }
      return undefined;
    }
    // Linux/macOS: fuser prints the PID(s) directly
    const output = execSync(`fuser ${String(port)}/tcp 2>/dev/null`, {
      encoding: "utf-8",
      stdio: "pipe",
    }).trim();
    const pid = parseInt(output.split(/\s+/)[0] ?? "", 10);
    return !isNaN(pid) && pid > 0 ? pid : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Returns true if any process is currently bound to the given TCP port.
 * Non-destructive - does not kill anything.
 */
export function isPortInUse(port: number): boolean {
  return getPidOnPort(port) !== undefined;
}

/**
 * Returns true if the process occupying `port` is recorded in our PID file
 * (i.e. it belongs to this project instance - we can safely kill it).
 */
export function isPortOwnedByUs(port: number, pidFile: string): boolean {
  const pidOnPort = getPidOnPort(port);
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
 * Find the lowest available port starting from `basePort` where BOTH the
 * public port and the internal port (public + NEXT_PORT_OFFSET) are usable.
 *
 * The public port is checked only on Linux/macOS — on Windows Bun binds via
 * reusePort so any port is available for the proxy regardless of who holds it.
 * The internal port is always checked because Vite uses a standard bind that
 * cannot co-exist with an existing LISTEN socket (no reusePort).
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
  while (true) {
    // On Windows, the proxy server uses reusePort so we skip the public port check.
    const publicBlocked =
      process.platform !== "win32" &&
      isPortInUse(port) &&
      !isPortOwnedByUs(port, pidFile);

    const internalPort = port + NEXT_PORT_OFFSET;
    const internalPid = getPidOnPort(internalPort);
    const internalBlocked =
      internalPid !== undefined && !isPortOwnedByUs(internalPort, pidFile);

    if (!publicBlocked && !internalBlocked) {
      break;
    }

    port++;
    // Skip the port pair reserved for the sibling command
    if (port === reservedPort || port === reservedPort + NEXT_PORT_OFFSET) {
      port++;
    }
  }
  return port;
}
