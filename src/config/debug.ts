// use 'vibe dev -v' to enable debug logging
export let enableDebugLogger = false;
// use 'vibe dev -v' to enable middleware debug logging
export let debugMiddleware = false;
// set by the mcp server to disable all console output
export let mcpSilentMode = false;
// Shows the translation keys in the UI
export const translationsKeyMode = false;
// Speeds up the typecheck by 100x but disables translation typesafety
export const translationsKeyTypesafety = true;

// Form clearing behavior in development
export const clearFormsAfterSuccessInDev = false;

/**
 * Used to enable debug mode at runtime via --verbose flag
 * Should be called at startup
 */
export function enableDebug(): void {
  enableDebugLogger = true;
  debugMiddleware = true;
}

/**
 * Used to enable MCP silent mode at runtime
 * Disables ALL console output for MCP protocol compatibility
 */
export function enableMcpSilentMode(): void {
  mcpSilentMode = true;
}
