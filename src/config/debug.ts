// use 'vibe dev -v' to enable debug logging, or set NEXT_PUBLIC_VIBE_DEBUG=true
// initialised from env so the client bundle picks it up at build time
export let enableDebugLogger = process.env["NEXT_PUBLIC_VIBE_DEBUG"] === "true";
// use 'vibe dev -v' to enable middleware debug logging
export let debugMiddleware = process.env["NEXT_PUBLIC_VIBE_DEBUG"] === "true";
// set by the mcp server to disable all console output
export let mcpSilentMode = false;
// write server logs to file - read process.env at call time so loadEnvironment() can set VIBE_LOG_PATH first
export function isFileLoggingEnabled(): boolean {
  const p = process.env["VIBE_LOG_PATH"];
  return Boolean(p) && p !== "false";
}
// Shows the translation keys in the UI
export const translationsKeyMode = false;
// Speeds up the typecheck by 100x but disables translation typesafety
export const translationsKeyTypesafety = true;

// Form clearing behavior in development
export const clearFormsAfterSuccessInDev = false;

/**
 * Used to enable MCP silent mode at runtime
 * Disables ALL console output for MCP protocol compatibility
 */
export function enableMcpSilentMode(): void {
  mcpSilentMode = true;
}
