/**
 * MCP Server Configuration
 */

import "server-only";

import type { CountryLanguage } from "@/i18n/core/config";
import type { MCPServerConfig } from "./types";

/**
 * MCP Server Configuration
 */
export const mcpConfig: MCPServerConfig = {
  name: "Vibe MCP Server",
  version: "1.0.0",
  locale: (process.env.VIBE_LOCALE as CountryLanguage) || "en-GLOBAL",
  debug: process.env.DEBUG === "true" || process.env.VIBE_LOG_LEVEL === "debug",
  capabilities: {
    tools: true,
    prompts: false, // Future
    resources: false, // Future
  },
  rootDir: process.env.VIBE_API_ROOT_DIR || process.cwd(),
  excludePaths: [
    "**/node_modules/**",
    "**/.next/**",
    "**/dist/**",
    "**/*.test.ts",
    "**/*.spec.ts",
  ],
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
