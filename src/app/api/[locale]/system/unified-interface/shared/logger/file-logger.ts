/**
 * File Logger for MCP Mode and Dev Server
 * Since MCP uses stdio for JSON-RPC communication, we can't use console.log
 * This logger writes to a file instead for debugging purposes.
 * Also used by vibe dev to write a persistent dev log to .tmp/vibe-dev.log
 *
 * node:fs is dynamically imported so this module is safe in client bundles
 * (the functions are only ever called server-side via endpoint.ts lazy import).
 */

import type { LoggerMetadata } from "./endpoint";

// File names - fixed
const DEBUG_FILE = "vibe-mcp.log";
const DEV_LOG_FILE = "vibe-dev.log";
const START_LOG_FILE = "vibe-start.log";

// Read VIBE_LOG_PATH at call time (not module init) so loadEnvironment() can set it first.
function getLogDir(): string | null {
  const p = process.env["VIBE_LOG_PATH"];
  if (!p || p === "false") {
    return null;
  }
  return p;
}

const _ESC = String.fromCodePoint(0x1b);
const _ansiRe = new RegExp(`${_ESC}\\[[0-9;]*m`, "g");
const stripAnsi = (s: string): string => s.replaceAll(_ansiRe, "");

// Pre-load node:fs asynchronously on module init so it's cached in the module
// registry by the time synchronous callers (e.g. process.on("exit")) need it.
// oxlint-disable-next-line @typescript-eslint/consistent-type-imports
type FsModule = typeof import("node:fs");
function loadFs(): Promise<FsModule> {
  return import("node:fs");
}
let _fsCache: FsModule | null = null;
void loadFs().then((m) => {
  _fsCache = m;
  return m;
});
const getFs = (): Promise<FsModule> =>
  _fsCache ? Promise.resolve(_fsCache) : loadFs();

async function getLogFilePath(filename: string): Promise<string | null> {
  const logDir = getLogDir();
  if (!logDir) {
    return null;
  }
  const { existsSync, mkdirSync } = await getFs();
  const projectRoot = process.env["PROJECT_ROOT"] ?? process.cwd();
  const debugDir = logDir.startsWith("/") ? logDir : `${projectRoot}/${logDir}`;
  if (!existsSync(debugDir)) {
    try {
      mkdirSync(debugDir, { recursive: true });
    } catch (error) {
      process.stderr.write(
        `Failed to create log dir at ${debugDir}: ${String(error)}\n`,
      );
    }
  }
  return `${debugDir}/${filename}`;
}

function getLogDirSync(fs: {
  existsSync: (p: string) => boolean;
  mkdirSync: (p: string, opts: { recursive: boolean }) => void;
}): string | null {
  const logDir = getLogDir();
  if (!logDir) {
    return null;
  }
  const projectRoot = process.env["PROJECT_ROOT"] ?? process.cwd();
  const debugDir = logDir.startsWith("/") ? logDir : `${projectRoot}/${logDir}`;
  if (!fs.existsSync(debugDir)) {
    fs.mkdirSync(debugDir, { recursive: true });
  }
  return debugDir;
}

/**
 * Write debug message to file.
 * Always logs when called - this function is only invoked in MCP mode.
 */
export async function fileLog(
  message: string,
  data?: Record<string, LoggerMetadata>,
): Promise<void> {
  try {
    const { appendFileSync } = await getFs();
    const path = await getLogFilePath(DEBUG_FILE);
    if (!path) {
      return;
    }
    const timestamp = new Date().toISOString();
    const logEntry = data
      ? `[${timestamp}] ${message}\n${JSON.stringify(data, null, 2)}\n\n`
      : `[${timestamp}] ${message}\n\n`;
    appendFileSync(path, logEntry, "utf-8");
  } catch (error) {
    process.stderr.write(`File log failed: ${String(error)}\n`);
  }
}

/**
 * Append a log entry to the dev server log file (.tmp/vibe-dev.log).
 * Called additively alongside console output - never suppresses terminal output.
 */
export async function devFileLog(
  message: string,
  data?: Record<string, LoggerMetadata>,
): Promise<void> {
  try {
    const path = await getLogFilePath(DEV_LOG_FILE);
    if (!path) {
      return;
    }
    const { appendFileSync } = await getFs();
    const clean = stripAnsi(message);
    const logEntry = data
      ? `${clean}\n${JSON.stringify(data, null, 2)}\n`
      : `${clean}\n`;
    appendFileSync(path, logEntry, "utf-8");
  } catch (error) {
    process.stderr.write(`Dev file log failed: ${String(error)}\n`);
  }
}

/**
 * Truncate (empty) the dev log file - called at the start of each `vibe dev` session.
 */
export async function truncateDevLog(): Promise<void> {
  try {
    const path = await getLogFilePath(DEV_LOG_FILE);
    if (!path) {
      return;
    }
    const { writeFileSync } = await getFs();
    writeFileSync(path, "", "utf-8");
  } catch (error) {
    process.stderr.write(`Failed to truncate dev log: ${String(error)}\n`);
  }
}

/**
 * Append a log entry to the production server log file (.tmp/vibe-start.log).
 * Called additively alongside console output - never suppresses terminal output.
 */
export async function startFileLog(
  message: string,
  data?: Record<string, LoggerMetadata>,
): Promise<void> {
  try {
    const path = await getLogFilePath(START_LOG_FILE);
    if (!path) {
      return;
    }
    const { appendFileSync } = await getFs();
    const clean = stripAnsi(message);
    const logEntry = data
      ? `${clean}\n${JSON.stringify(data, null, 2)}\n`
      : `${clean}\n`;
    appendFileSync(path, logEntry, "utf-8");
  } catch (error) {
    process.stderr.write(`Start file log failed: ${String(error)}\n`);
  }
}

/**
 * Truncate (empty) the start log file - called at the start of each `vibe start` session.
 */
export async function truncateStartLog(): Promise<void> {
  try {
    const path = await getLogFilePath(START_LOG_FILE);
    if (!path) {
      return;
    }
    const { writeFileSync } = await getFs();
    writeFileSync(path, "", "utf-8");
  } catch (error) {
    process.stderr.write(`Failed to truncate start log: ${String(error)}\n`);
  }
}

/**
 * Write an offline hint to the start log file - called on shutdown.
 * Uses cached node:fs to work in synchronous process.on("exit") handlers.
 */
export function writeStartLogOfflineHint(): void {
  try {
    const fs = _fsCache;
    if (!fs) {
      return;
    }
    const debugDir = getLogDirSync(fs);
    if (!debugDir) {
      return;
    }
    const hint = `--- server offline --- run \`vibe start\` to restart\n`;
    fs.appendFileSync(`${debugDir}/${START_LOG_FILE}`, hint, "utf-8");
  } catch {
    // Best effort - process is exiting anyway
  }
}

/**
 * Write an offline hint to the dev log file - called on shutdown.
 * Uses cached node:fs to work in synchronous process.on("exit") handlers.
 */
export function writeDevLogOfflineHint(): void {
  try {
    const fs = _fsCache;
    if (!fs) {
      return;
    }
    const debugDir = getLogDirSync(fs);
    if (!debugDir) {
      return;
    }
    const hint = `--- server offline --- run \`vibe dev\` to restart\n`;
    fs.appendFileSync(`${debugDir}/${DEV_LOG_FILE}`, hint, "utf-8");
  } catch {
    // Best effort - process is exiting anyway
  }
}

/**
 * Append a log entry to a per-tab client log file (.tmp/vibe-client-{tabId}.log).
 * Called from the client-log API endpoint when a browser tab reports an error/warn.
 */
export async function clientFileLog(
  tabId: string,
  message: string,
  data?: Record<string, LoggerMetadata>,
): Promise<void> {
  try {
    const path = await getLogFilePath(`vibe-client-${tabId}.log`);
    if (!path) {
      return;
    }
    const { appendFileSync } = await getFs();
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
export async function truncateClientLogs(): Promise<void> {
  try {
    const logDir = getLogDir();
    if (!logDir) {
      return;
    }
    const { readdirSync, unlinkSync } = await getFs();
    const projectRoot = process.env["PROJECT_ROOT"] ?? process.cwd();
    const debugDir = logDir.startsWith("/")
      ? logDir
      : `${projectRoot}/${logDir}`;
    let files: string[];
    try {
      files = readdirSync(debugDir);
    } catch {
      return; // dir doesn't exist yet - nothing to clean
    }
    for (const file of files) {
      if (file.startsWith("vibe-client-") && file.endsWith(".log")) {
        try {
          unlinkSync(`${debugDir}/${file}`);
        } catch {
          // best effort
        }
      }
    }
  } catch (error) {
    process.stderr.write(`Failed to truncate client logs: ${String(error)}\n`);
  }
}
