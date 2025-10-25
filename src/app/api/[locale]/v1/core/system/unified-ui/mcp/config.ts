/**
 * MCP Server Configuration
 *
 * @deprecated This file is deprecated. Use the unified platform configuration instead:
 * import { MCP_CONFIG, getPlatformConfig, Platform } from "../shared/config/platform-config";
 *
 * This file is kept for backward compatibility only.
 */

import "server-only";

import type { CountryLanguage } from "@/i18n/core/config";

import { MCP_CONFIG } from "../shared/config/platform-config";
import type { MCPServerConfig } from "./types";

/**
 * MCP Server Configuration
 * @deprecated Use MCP_CONFIG from unified platform instead
 */
export const mcpConfig: MCPServerConfig = {
  name: "Vibe MCP Server",
  version: "1.0.0",
  locale: (process.env.VIBE_LOCALE as CountryLanguage) || "en-GLOBAL",
  debug: process.env.DEBUG === "true" || process.env.VIBE_LOG_LEVEL === "debug",
  capabilities: (MCP_CONFIG.platformSpecific as any)?.capabilities || {
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
