/**
 * MCP Server Configuration
 *
 * @deprecated This file is deprecated. Use the unified platform configuration instead:
 * import { MCP_CONFIG, getPlatformConfig, Platform } from "../shared/server-only/config";
 *
 * This file is kept for backward compatibility only.
 */

import "server-only";

import { env } from "@/config/env";

import { MCP_CONFIG } from "../shared/server-only/config";
import type { MCPServerConfig } from "./types";

/**
 * MCP Server Configuration
 * @deprecated Use MCP_CONFIG from unified platform instead
 */
export const mcpConfig: MCPServerConfig = {
  // eslint-disable-next-line i18next/no-literal-string
  name: "Vibe MCP Server",
  version: "1.0.0",
  locale: env.VIBE_LOCALE,
  debug: process.env.DEBUG === "true" || process.env.VIBE_LOG_LEVEL === "debug",
  capabilities: (MCP_CONFIG.platformSpecific?.capabilities as {
    tools: boolean;
    prompts: boolean;
    resources: boolean;
  }) || {
    tools: true,
    prompts: false,
    resources: false,
  },
  rootDir: MCP_CONFIG.rootDir,
  excludePaths: MCP_CONFIG.excludePaths,
};

/**
 * Check if MCP server is enabled
 */
export function isMCPServerEnabled(): boolean {
  return process.env.VIBE_MCP_DISABLED !== "true";
}

/**
 * Get MCP server configuration
 */
export function getMCPConfig(): MCPServerConfig {
  return mcpConfig;
}
