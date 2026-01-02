/**
 * File Logger for MCP Mode
 * Since MCP uses stdio for JSON-RPC communication, we can't use console.log
 * This logger writes to a file instead for debugging purposes
 */

import type { LoggerMetadata } from "./endpoint";

/**
 * File logger configuration
 */
const DEBUG_DIR = ".vibe-debug";
const DEBUG_FILE = "mcp-auth.log";

/**
 * Get debug file path
 * Creates debug directory if it doesn't exist
 */
function getDebugFilePath(): string {
  const { existsSync, mkdirSync, join } = require("node:fs");
  // Use VIBE_PROJECT_ROOT if available, otherwise use cwd
  const projectRoot = process.env.VIBE_PROJECT_ROOT || process.cwd();
  const debugDir = join(projectRoot, DEBUG_DIR);

  // Create debug directory if it doesn't exist
  if (!existsSync(debugDir)) {
    try {
      mkdirSync(debugDir, { recursive: true });
    } catch {
      // Ignore errors - logging is best effort
    }
  }

  return join(debugDir, DEBUG_FILE);
}

/**
 * Write debug message to file
 * This is used when MCP silent mode is enabled and console logging is disabled
 */
export function fileLog(message: string, data?: Record<string, LoggerMetadata>): void {
  // Only log if DEBUG_FILE_LOGGING is enabled
  if (process.env.DEBUG_FILE_LOGGING !== "true") {
    return;
  }
  const { appendFileSync } = require("node:fs");

  try {
    const timestamp = new Date().toISOString();
    const logEntry = data
      ? `[${timestamp}] ${message}\n${JSON.stringify(data, null, 2)}\n\n`
      : `[${timestamp}] ${message}\n\n`;

    const debugPath = getDebugFilePath();
    appendFileSync(debugPath, logEntry, "utf-8");
  } catch {
    // Ignore errors - logging is best effort
    // We can't log the error because we're in silent mode
  }
}

/**
 * Clear debug log file
 * Useful at the start of a new session
 */
export function clearDebugLog(): void {
  if (process.env.DEBUG_FILE_LOGGING !== "true") {
    return;
  }

  try {
    const debugPath = getDebugFilePath();
    const fs = require("node:fs");
    fs.writeFileSync(debugPath, "", "utf-8");
  } catch {
    // Ignore errors - logging is best effort
  }
}

/**
 * Get debug log file path for user display
 */
export function getDebugLogPath(): string {
  return getDebugFilePath();
}
