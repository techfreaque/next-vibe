/**
 * PID file management for vibe start / vibe dev
 * Ensures only one instance of each type runs at a time and enables rebuild signaling via SIGUSR1
 */

import { execSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readlinkSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname } from "node:path";

import type { EndpointLogger } from "../../logger/types";

/**
 * Internal Next.js port offset above the public-facing port.
 * Defined here (not imported from websocket/server) to avoid circular deps.
 */
export const NEXT_PORT_OFFSET = 100;

/** PID file for production server (vibe start) */
export const VIBE_START_PID_FILE = ".tmp/.hermes.pid";

/** PID file for the supervisor wrapper around vibe start (owns the outer Bun process) */
export const VIBE_SUPERVISOR_PID_FILE = ".tmp/.vibe-supervisor.pid";

/** PID file for development server (vibe dev) */
export const ATLAS_PID_FILE = ".tmp/.atlas.pid";

/** PID file for local-dev server (vibe --hermes dev, port 3002) */
export const HERMES_DEV_PID_FILE = ".tmp/.hermes-dev.pid";

/** Default port for vibe --hermes dev (shares preview DB at 5433 with vibe start) */
export const LOCAL_BASE_PORT = 3002;

/** The Vite close grace includes Nitro's worker shutdown. */
export const DEV_VITE_SHUTDOWN_GRACE_MS = 7000;

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

/** Linux USER_HZ: /proc/<pid>/stat start times are in these ticks. */
const PROC_CLOCK_TICKS_PER_SECOND = 100;

/** Slack between a pid file write and the start of a process it lists. */
const PID_START_SLACK_MS = 1000;

/** One field of /proc/<pid>/status (`Tgid`, `PPid`), or undefined. */
function readProcStatusField(pid: number, field: string): number | undefined {
  try {
    const status = readFileSync(`/proc/${String(pid)}/status`, "utf-8");
    const line = status.split("\n").find((l) => l.startsWith(`${field}:`));
    const value = parseInt(line?.slice(field.length + 1).trim() ?? "", 10);
    return isNaN(value) ? undefined : value;
  } catch {
    return undefined;
  }
}

/** Wall-clock start of a process (ms since epoch) from /proc, or undefined. */
function readProcStartMs(pid: number): number | undefined {
  try {
    const stat = readFileSync(`/proc/${String(pid)}/stat`, "utf-8");
    // Fields after the parenthesised command name; starttime is field 22.
    const afterComm = stat.slice(stat.lastIndexOf(")") + 2).split(" ");
    const startTicks = parseInt(afterComm[19] ?? "", 10);
    const btimeLine = readFileSync("/proc/stat", "utf-8")
      .split("\n")
      .find((l) => l.startsWith("btime "));
    const bootSeconds = parseInt(btimeLine?.slice(6) ?? "", 10);
    if (isNaN(startTicks) || isNaN(bootSeconds)) {
      return undefined;
    }
    return (
      bootSeconds * 1000 + (startTicks / PROC_CLOCK_TICKS_PER_SECOND) * 1000
    );
  } catch {
    return undefined;
  }
}

/**
 * Whether `pid` (read from a pid file or found on a port) is a different,
 * live process that may be killed as a stale instance of ours.
 *
 * Never: this process, its parent (the supervisor), its own child, or a
 * THREAD id. kill(2) with a thread id signals the whole thread group, and in
 * a restarted container PIDs repeat: prod 2026-11-27 (f1f703a62d) read a
 * stale pid that was now a thread of the booting server itself and SIGKILLed
 * itself on every boot. On Linux the process must also run from our cwd and
 * must have started before the pid file was written (a recycled pid started
 * later). `pidFileMtimeMs` is undefined for port-discovered pids.
 */
export function isForeignStaleCandidate(
  pid: number,
  pidFileMtimeMs: number | undefined,
): boolean {
  if (!Number.isInteger(pid) || pid <= 0) {
    return false;
  }
  if (pid === process.pid || pid === process.ppid) {
    return false;
  }
  if (!isProcessRunning(pid)) {
    return false;
  }
  if (process.platform !== "linux") {
    return true;
  }
  // A thread id resolves in /proc too; only a thread-group leader is a process.
  const tgid = readProcStatusField(pid, "Tgid");
  if (tgid === undefined || tgid !== pid) {
    return false;
  }
  if (readProcStatusField(pid, "PPid") === process.pid) {
    return false;
  }
  if (!isPidFromOurCwd(pid)) {
    return false;
  }
  if (pidFileMtimeMs !== undefined) {
    const startedAt = readProcStartMs(pid);
    if (
      startedAt === undefined ||
      startedAt > pidFileMtimeMs + PID_START_SLACK_MS
    ) {
      return false;
    }
  }
  return true;
}

/** mtime of a file in ms, or undefined. */
function readMtimeMs(path: string): number | undefined {
  try {
    return statSync(path).mtimeMs;
  } catch {
    return undefined;
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
  basePort?: number,
  reclaimUntrackedPort = true,
  graceMs = 5000,
): void {
  if (!existsSync(pidFile)) {
    // No pid file, but if a same-cwd process is on our internal port it's an orphaned
    // child from a previous crash. Kill it so the port is free for the new startup.
    if (
      reclaimUntrackedPort &&
      basePort !== undefined &&
      process.platform === "linux"
    ) {
      const internalPort = basePort + NEXT_PORT_OFFSET;
      const pidOnPort = getPidOnPort(internalPort);
      if (
        pidOnPort !== undefined &&
        isForeignStaleCandidate(pidOnPort, undefined)
      ) {
        logger.debug(
          `Killing orphaned same-cwd process on internal port ${internalPort} (no pid file)`,
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
    return;
  }

  const pidFileMtimeMs = readMtimeMs(pidFile);
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

  // Only live, foreign processes of ours. A pid that is now this process, its
  // supervisor, its child or one of its threads (PIDs repeat after a
  // container restart) is a stale entry, never a target.
  const running = pids.filter((pid) =>
    isForeignStaleCandidate(pid, pidFileMtimeMs),
  );
  const skipped = pids.filter(
    (pid) => isProcessRunning(pid) && !running.includes(pid),
  );
  if (skipped.length > 0) {
    logger.debug("Ignoring stale pid file entries that are not ours", {
      pids: skipped,
      pidFile,
    });
  }
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

    const deadline = Date.now() + graceMs;
    while (Date.now() < deadline && running.some(isProcessRunning)) {
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100);
    }

    // Force-kill any survivors
    for (const pid of running) {
      if (isProcessRunning(pid)) {
        logger.warn(
          "Previous instance did not exit gracefully, force killing...",
          { pid, pidFile, graceMs },
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
    logger.debug("Stale PID file found (no previous instance running)", {
      pids,
      pidFile,
    });
  }

  // Previous app servers may have left an orphan on the old internal port.
  // Dev callers can opt out of reclaiming untracked listeners and let Vite
  // select another port. Production callers retain the legacy recovery path.
  if (oldPort !== undefined && !isNaN(oldPort)) {
    const internalPort = oldPort + NEXT_PORT_OFFSET;
    const allTrackedDead = running.every((p) => !isProcessRunning(p));
    const pidOnPort = getPidOnPort(internalPort);
    if (
      pidOnPort !== undefined &&
      isForeignStaleCandidate(pidOnPort, undefined) &&
      // On Windows, only kill if explicitly tracked - the allTrackedDead fallback
      // would target unkillable system PIDs (Docker HNS) that happen to show on
      // this port in netstat but don't actually block binding.
      (oldPidSet.has(pidOnPort) ||
        (reclaimUntrackedPort &&
          allTrackedDead &&
          process.platform !== "win32"))
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
        // Rows look like: TCP  0.0.0.0:3100  0.0.0.0:0  LISTENING  7256
        //   [0] proto  [1] local addr  [2] foreign addr  [3] state  [4] pid
        const parts = line.trim().split(/\s+/);
        if (parts.length < 5 || parts[0] !== "TCP") {
          continue;
        }
        // Endpoint match, so ":30000" and a remote peer on :3000 never hit.
        if (!(parts[1] ?? "").endsWith(`:${String(port)}`)) {
          continue;
        }
        // A listening socket is identified by its unbound FOREIGN address, not
        // by the state word: netstat is localized (German Windows prints
        // "ABHÖREN", not "LISTENING").
        if (!(parts[2] ?? "").endsWith(":0")) {
          continue;
        }
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
function isPortInUse(port: number): boolean {
  return getPidOnPort(port) !== undefined;
}

/**
 * Returns true if the given pid's working directory matches ours.
 * On Linux this reads /proc/<pid>/cwd; on other platforms always returns false.
 */
function isPidFromOurCwd(pid: number): boolean {
  if (process.platform !== "linux") {
    return false;
  }
  try {
    return readlinkSync(`/proc/${String(pid)}/cwd`) === process.cwd();
  } catch {
    return false;
  }
}

/**
 * Returns true if the process occupying `port` is recorded in our PID file
 * OR (on Linux) is running from our working directory — meaning it belongs to
 * this project instance and can safely be killed on next startup.
 */
export function isPortOwnedByUs(port: number, pidFile: string): boolean {
  const pidOnPort = getPidOnPort(port);
  if (!pidOnPort) {
    return false;
  }

  // Fast path: pid file lists it explicitly
  if (existsSync(pidFile)) {
    try {
      const ourPids = new Set(
        readFileSync(pidFile, "utf-8")
          .trim()
          .split("\n")
          .filter((l) => !l.startsWith("PORT:"))
          .map(Number)
          .filter((p) => p > 0),
      );
      if (ourPids.has(pidOnPort)) {
        return true;
      }
    } catch {
      // fall through to cwd check
    }
  }

  // Fallback: same-cwd process is ours even without a pid file (e.g. after a crash)
  return isPidFromOurCwd(pidOnPort);
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
