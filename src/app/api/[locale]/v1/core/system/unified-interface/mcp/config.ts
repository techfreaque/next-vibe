/**
 * MCP Configuration
 * Configuration and utility functions for MCP server
 */

import "server-only";

/**
 * Check if MCP server is enabled
 * MCP server is enabled by default unless explicitly disabled
 */
export function isMCPServerEnabled(): boolean {
  return process.env.VIBE_MCP_DISABLED !== "true";
}

/**
 * Get MCP server configuration from environment
 */
export function getMCPServerConfig(): {
  enabled: boolean;
  debug: boolean;
  port: number | undefined;
} {
  return {
    enabled: isMCPServerEnabled(),
    debug:
      process.env.DEBUG === "true" || process.env.VIBE_LOG_LEVEL === "debug",
    port: process.env.MCP_PORT ? parseInt(process.env.MCP_PORT, 10) : undefined,
  };
}
