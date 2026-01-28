/**
 * File Logger for MCP Mode
 * Since MCP uses stdio for JSON-RPC communication, we can't use console.log
 * This logger writes to a file instead for debugging purposes
 */

import type { LoggerMetadata } from "./endpoint";

/**
 * File logger configuration
 */
const DEBUG_DIR = ".tmp";
const DEBUG_FILE = "vibe-mcp.log";

/**
 * Get debug file path
 * Creates debug directory if it doesn't exist
 */
function getDebugFilePath(): string {
  const { existsSync, mkdirSync } = require("node:fs");
  const { join } = require("node:path");
  // Use PROJECT_ROOT if available, otherwise use cwd
  const projectRoot = process.env.PROJECT_ROOT || process.cwd();
  const debugDir = join(projectRoot, DEBUG_DIR);

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

  return join(debugDir, DEBUG_FILE);
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

    const debugPath = getDebugFilePath();
    appendFileSync(debugPath, logEntry, "utf-8");
  } catch (error) {
    // Write error to stderr for debugging
    // eslint-disable-next-line no-console
    process.stderr.write(`File log failed: ${String(error)}\n`);
  }
}
