/**
 * Platform Type Definitions
 * Defines the different platforms that can access the unified interface
 */

/**
 * Platform identifier
 * Used to distinguish between different clients accessing the API
 */
export enum Platform {
  CLI = "cli",
  AI = "ai",
  MCP = "mcp",
  WEB = "web",
  MOBILE = "mobile",
  EMAIL = "email",
}
