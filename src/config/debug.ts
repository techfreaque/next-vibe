export let enableDebugLogger = false;
export let debugCli = false;
export let debugCron = false;
export let debugMiddleware = false;
export let debugApp = enableDebugLogger;
export let mcpSilentMode = false;
export const translationsKeyMode = false as boolean;

// Form clearing behavior in development
export const clearFormsAfterSuccessInDev = false;

/**
 * Used to enable debug mode at runtime via --verbose flag
 * Should be called at startup
 */
export function enableDebug(): void {
  enableDebugLogger = true;
  debugCli = true;
  debugCron = true;
  debugMiddleware = true;
  debugApp = true;
}

/**
 * Used to enable MCP silent mode at runtime
 * Disables ALL console output for MCP protocol compatibility
 */
export function enableMcpSilentMode(): void {
  mcpSilentMode = true;
}
