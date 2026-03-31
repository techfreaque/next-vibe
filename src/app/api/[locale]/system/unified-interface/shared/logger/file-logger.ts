/**
 * File Logger for MCP Mode and Dev Server
 * Since MCP uses stdio for JSON-RPC communication, we can't use console.log
 * This logger writes to a file instead for debugging purposes.
 * Also used by vibe dev to write a persistent dev log to .tmp/vibe-dev.log
 */

import type { LoggerMetadata } from "./endpoint";

/**
 * File logger configuration
 */
// Use runtime concatenation to prevent Turbopack from statically tracing these paths
// Split across a variable reference so Turbopack cannot fold this to a static path
const _dot = process.env.DEBUG_DOT ?? ".";
const DEBUG_DIR = `${_dot}tmp`;
const DEBUG_FILE = "vibe-mcp.log";
const DEV_LOG_FILE = "vibe-dev.log";

const _ESC = String.fromCodePoint(0x1b);
const _ansiRe = new RegExp(`${_ESC}\\[[0-9;]*m`, "g");
const stripAnsi = (s: string): string => s.replaceAll(_ansiRe, "");

/**
 * Get a log file path under .tmp/, creating the directory if needed
 */
function getLogFilePath(filename: string): string {
  const { existsSync, mkdirSync } = require("node:fs");
  // Use PROJECT_ROOT if available, otherwise use cwd
  const projectRoot = process.env.PROJECT_ROOT || process.cwd();
  // Use string concatenation instead of join() to prevent Turbopack from statically tracing paths
  const debugDir = `${projectRoot}/${DEBUG_DIR}`;

  // Create debug directory if it doesn't exist
  if (!existsSync(debugDir)) {
    try {
      mkdirSync(debugDir, { recursive: true });
    } catch (error) {
      // Write error to stderr so we know why it failed
      // eslint-disable-next-line no-console
      process.stderr.write(
        `Failed to create debug dir at ${debugDir}: ${String(error)}\n`,
      );
    }
  }

  return `${debugDir}/${filename}`;
}

/**
 * Write debug message to file
 * Always logs when called - this function is only invoked in MCP mode
 */
export function fileLog(
  message: string,
  data?: Record<string, LoggerMetadata>,
): void {
  const { appendFileSync } = require("node:fs");

  try {
    const timestamp = new Date().toISOString();
    const logEntry = data
      ? `[${timestamp}] ${message}\n${JSON.stringify(data, null, 2)}\n\n`
      : `[${timestamp}] ${message}\n\n`;

    const debugPath = getLogFilePath(DEBUG_FILE);
    appendFileSync(debugPath, logEntry, "utf-8");
  } catch (error) {
    // Write error to stderr for debugging
    // eslint-disable-next-line no-console
    process.stderr.write(`File log failed: ${String(error)}\n`);
  }
}

/**
 * Append a log entry to the dev server log file (.tmp/vibe-dev.log)
 * Called additively alongside console output - never suppresses terminal output
 */
export function devFileLog(
  message: string,
  data?: Record<string, LoggerMetadata>,
): void {
  const { appendFileSync } = require("node:fs");

  try {
    const clean = stripAnsi(message);
    const logEntry = data
      ? `${clean}\n${JSON.stringify(data, null, 2)}\n`
      : `${clean}\n`;

    const devPath = getLogFilePath(DEV_LOG_FILE);
    appendFileSync(devPath, logEntry, "utf-8");
  } catch (error) {
    // Best effort - never throw from logging
    process.stderr.write(`Dev file log failed: ${String(error)}\n`);
  }
}

/**
 * Truncate (empty) the dev log file - called at the start of each `vibe dev` session
 */
export function truncateDevLog(): void {
  const { writeFileSync } = require("node:fs");

  try {
    const devPath = getLogFilePath(DEV_LOG_FILE);
    writeFileSync(devPath, "", "utf-8");
  } catch (error) {
    process.stderr.write(`Failed to truncate dev log: ${String(error)}\n`);
  }
}

/**
 * Write an offline hint to the dev log file - called on shutdown (SIGINT/SIGTERM/crash)
 * so that Claude Code (and humans) can tell the server is no longer running
 */
export function writeDevLogOfflineHint(): void {
  const { appendFileSync } = require("node:fs");

  try {
    const hint = `--- server offline --- run \`vibe dev\` to restart\n`;
    const devPath = getLogFilePath(DEV_LOG_FILE);
    appendFileSync(devPath, hint, "utf-8");
  } catch {
    // Best effort - process is exiting anyway
  }
}
