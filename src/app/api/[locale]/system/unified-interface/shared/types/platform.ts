/**
 * Platform identifier
 * Used to distinguish between different clients accessing the API or directly calling the route
 */
export enum Platform {
  /** Local CLI running from within a next-vibe project */
  CLI = "cli",
  /** CLI running from npm package (installed globally or as dependency) */
  CLI_PACKAGE = "cli-package",
  /** AI tool execution */
  AI = "ai",
  /** MCP (Model Context Protocol) execution */
  MCP = "mcp",
  /** Remote skill discovery - endpoints exposed in AI skill markdown files (AGENT.md, etc.) */
  REMOTE_SKILL = "remote-skill",
  /** tRPC API calls */
  TRPC = "trpc",
  /** Next.js page context */
  NEXT_PAGE = "next-page",
  /** Next.js API route context */
  NEXT_API = "next-api",
  /** Cron/pulse task execution — behaves like AI for permissions */
  CRON = "cron",
  /** Electron desktop app — wraps vibe start in a BrowserWindow */
  ELECTRON = "electron",
  /** Vibe Frame — embedded widget */
  FRAME = "frame",
}

/**
 * Check if platform is a CLI variant (local or package)
 */
export function isCliPlatform(platform: Platform): boolean {
  return platform === Platform.CLI || platform === Platform.CLI_PACKAGE;
}

/**
 * Check if platform is an agent/AI caller (MCP server, AI tool, or cron execution)
 */
export function isAgentPlatform(platform: Platform): boolean {
  return (
    platform === Platform.MCP ||
    platform === Platform.AI ||
    platform === Platform.CRON
  );
}

/**
 * Check if running from npm package (not local development)
 */
export function isPackagePlatform(platform: Platform): boolean {
  return platform === Platform.CLI_PACKAGE;
}
