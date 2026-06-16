/**
 * File Logger
 * Writes server logs to .tmp/.<name>.log — one file per server mode.
 * File and timestamp format resolved from env by loadEnvironment() before any
 * server code runs. All three env vars are user-overridable via .env:
 *   VIBE_LOG_TARGET    — file | db | none (default: resolved from VIBE_SERVER_MODE)
 *   VIBE_LOG_PATH      — directory (default: .tmp)
 *   VIBE_LOG_FILE      — filename  (default: resolved from VIBE_SERVER_MODE)
 *   VIBE_LOG_TIMESTAMP — format    (elapsed | iso, default: resolved from VIBE_SERVER_MODE)
 *
 * This module is lazy-imported by logger-core so it stays out of the static
 * module graph (Turbopack NFT safety). node:fs is statically imported here
 * because once this module loads we are always in a server context.
 */

import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { isAbsolute, join } from "node:path";

import type { LoggerMetadata } from "./endpoint";

// Read at call time (not module init) so loadEnvironment() can set vars first.
function isFileTargetActive(): boolean {
  return process.env["VIBE_LOG_TARGET"] === "file";
}

function getLogDir(): string | null {
  if (!isFileTargetActive()) {
    return null;
  }
  const p = process.env["VIBE_LOG_PATH"];
  if (!p) {
    return null;
  }
  return p;
}

/**
 * Resolve VIBE_LOG_PATH to an absolute directory.
 * Uses path.isAbsolute / path.join so Windows drive-letter paths like
 * "C:\\logs" are detected as absolute and relative paths join cleanly under
 * PROJECT_ROOT (no mixed-separator strings like "C:\\proj/.tmp").
 */
function resolveLogDir(logDir: string): string {
  if (isAbsolute(logDir)) {
    return logDir;
  }
  const projectRoot = process.env["PROJECT_ROOT"] ?? process.cwd();
  return join(projectRoot, logDir);
}

const _ESC = String.fromCodePoint(0x1b);
const _ansiRe = new RegExp(`${_ESC}\\[[0-9;]*m`, "g");
const stripAnsi = (s: string): string => s.replaceAll(_ansiRe, "");

function getLogFile(): string {
  return process.env["VIBE_LOG_FILE"] ?? ".atlas.log";
}

function getLogFilePath(filename: string): string | null {
  const logDir = getLogDir();
  if (!logDir) {
    return null;
  }
  const debugDir = resolveLogDir(logDir);
  if (!existsSync(debugDir)) {
    try {
      mkdirSync(debugDir, { recursive: true });
    } catch (error) {
      process.stderr.write(
        `Failed to create log dir at ${debugDir}: ${String(error)}\n`,
      );
    }
  }
  return join(debugDir, filename);
}

function getLogDirSync(): string | null {
  if (!isFileTargetActive()) {
    return null;
  }
  const p = process.env["VIBE_LOG_PATH"];
  if (!p) {
    return null;
  }
  const debugDir = resolveLogDir(p);
  if (!existsSync(debugDir)) {
    mkdirSync(debugDir, { recursive: true });
  }
  return debugDir;
}

/**
 * Write a log entry to the active server log file (resolved from VIBE_LOG_FILE).
 * Single write function for all server modes — no routing logic here, that lives
 * in environment.ts where VIBE_LOG_FILE is set.
 * Format: ANSI-stripped plain text, optional JSON metadata on following lines.
 */
export function serverFileLog(
  message: string,
  data?: Record<string, LoggerMetadata>,
): void {
  try {
    const path = getLogFilePath(getLogFile());
    if (!path) {
      return;
    }
    const clean = stripAnsi(message);
    const entry = data
      ? `${clean}\n${JSON.stringify(data, null, 2)}\n`
      : `${clean}\n`;
    appendFileSync(path, entry, "utf-8");
  } catch (error) {
    process.stderr.write(`Server file log failed: ${String(error)}\n`);
  }
}

/**
 * Append a pre-formatted string to the server log file as-is (no timestamp added).
 * Use for subprocess output (e.g. Next.js stdout) that already has its own formatting.
 * ANSI codes are stripped; trailing whitespace is trimmed.
 */
export function appendRawToServerLog(raw: string): void {
  try {
    const path = getLogFilePath(getLogFile());
    if (!path) {
      return;
    }
    const clean = stripAnsi(raw).trimEnd();
    if (!clean) {
      return;
    }
    appendFileSync(path, `${clean}\n`, "utf-8");
  } catch (error) {
    process.stderr.write(`Server file log (raw) failed: ${String(error)}\n`);
  }
}

/**
 * Truncate (empty) the active server log file — called at the start of each server session.
 */
export function truncateServerLog(): void {
  try {
    const path = getLogFilePath(getLogFile());
    if (!path) {
      return;
    }
    writeFileSync(path, "", "utf-8");
  } catch (error) {
    process.stderr.write(`Failed to truncate server log: ${String(error)}\n`);
  }
}

/**
 * Write an offline hint to the active server log file — called on shutdown.
 */
export function writeServerLogOfflineHint(): void {
  try {
    const debugDir = getLogDirSync();
    if (!debugDir) {
      return;
    }
    appendFileSync(
      join(debugDir, getLogFile()),
      "--- server offline ---\n",
      "utf-8",
    );
  } catch {
    // Best effort - process is exiting anyway
  }
}

/**
 * Append a log entry to a per-tab client log file (.tmp/vibe-client-{tabId}.log).
 * Called from the client-log API endpoint when a browser tab reports an error/warn.
 */
export function clientFileLog(
  tabId: string,
  message: string,
  data?: Record<string, LoggerMetadata>,
): void {
  try {
    const path = getLogFilePath(`vibe-client-${tabId}.log`);
    if (!path) {
      return;
    }
    const clean = stripAnsi(message);
    const logEntry = data
      ? `${clean}\n${JSON.stringify(data, null, 2)}\n`
      : `${clean}\n`;
    appendFileSync(path, logEntry, "utf-8");
  } catch (error) {
    process.stderr.write(`Client file log failed: ${String(error)}\n`);
  }
}

/**
 * Delete all vibe-client-*.log files - called on server start to clean up stale tab logs.
 */
export function truncateClientLogs(): void {
  try {
    const logDir = getLogDir();
    if (!logDir) {
      return;
    }
    const debugDir = resolveLogDir(logDir);
    let files: string[];
    try {
      files = readdirSync(debugDir);
    } catch {
      return; // dir doesn't exist yet - nothing to clean
    }
    for (const file of files) {
      if (file.startsWith("vibe-client-") && file.endsWith(".log")) {
        try {
          unlinkSync(join(debugDir, file));
        } catch {
          // best effort
        }
      }
    }
  } catch (error) {
    process.stderr.write(`Failed to truncate client logs: ${String(error)}\n`);
  }
}
