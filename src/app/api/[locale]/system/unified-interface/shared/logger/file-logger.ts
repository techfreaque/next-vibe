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

const _dot = process.env["DEBUG_DOT"] ?? ".";
const DEBUG_DIR = `${_dot}tmp`;
const DEBUG_FILE = "vibe-mcp.log";
const DEV_LOG_FILE = "vibe-dev.log";

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

async function getLogFilePath(filename: string): Promise<string> {
  const { existsSync, mkdirSync } = await getFs();
  const projectRoot = process.env["PROJECT_ROOT"] ?? process.cwd();
  const debugDir = `${projectRoot}/${DEBUG_DIR}`;
  if (!existsSync(debugDir)) {
    try {
      mkdirSync(debugDir, { recursive: true });
    } catch (error) {
      process.stderr.write(
        `Failed to create debug dir at ${debugDir}: ${String(error)}\n`,
      );
    }
  }
  return `${debugDir}/${filename}`;
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
    const timestamp = new Date().toISOString();
    const logEntry = data
      ? `[${timestamp}] ${message}\n${JSON.stringify(data, null, 2)}\n\n`
      : `[${timestamp}] ${message}\n\n`;
    appendFileSync(await getLogFilePath(DEBUG_FILE), logEntry, "utf-8");
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
    const { appendFileSync } = await getFs();
    const clean = stripAnsi(message);
    const logEntry = data
      ? `${clean}\n${JSON.stringify(data, null, 2)}\n`
      : `${clean}\n`;
    appendFileSync(await getLogFilePath(DEV_LOG_FILE), logEntry, "utf-8");
  } catch (error) {
    process.stderr.write(`Dev file log failed: ${String(error)}\n`);
  }
}

/**
 * Truncate (empty) the dev log file - called at the start of each `vibe dev` session.
 */
export async function truncateDevLog(): Promise<void> {
  try {
    const { writeFileSync } = await getFs();
    writeFileSync(await getLogFilePath(DEV_LOG_FILE), "", "utf-8");
  } catch (error) {
    process.stderr.write(`Failed to truncate dev log: ${String(error)}\n`);
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
    const projectRoot = process.env["PROJECT_ROOT"] ?? process.cwd();
    const debugDir = `${projectRoot}/${DEBUG_DIR}`;
    const hint = `--- server offline --- run \`vibe dev\` to restart\n`;
    fs.appendFileSync(`${debugDir}/${DEV_LOG_FILE}`, hint, "utf-8");
  } catch {
    // Best effort - process is exiting anyway
  }
}
