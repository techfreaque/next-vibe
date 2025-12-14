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
  /** tRPC API calls */
  TRPC = "trpc",
  /** Next.js page context */
  NEXT_PAGE = "next-page",
  /** Next.js API route context */
  NEXT_API = "next-api",
}

/**
 * Check if platform is a CLI variant (local or package)
 */
export function isCliPlatform(platform: Platform): boolean {
  return platform === Platform.CLI || platform === Platform.CLI_PACKAGE;
}

/**
 * Check if running from npm package (not local development)
 */
export function isPackagePlatform(platform: Platform): boolean {
  return platform === Platform.CLI_PACKAGE;
}
