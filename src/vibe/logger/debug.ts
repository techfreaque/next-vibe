// use 'vibe dev -v' to enable debug logging, or set NEXT_PUBLIC_VIBE_DEBUG=true
export let enableDebugLogger = process.env["NEXT_PUBLIC_VIBE_DEBUG"] === "true";
// set by the mcp server to disable all console output
export let mcpSilentMode = false;

export function isFileLoggingEnabled(): boolean {
  return process.env["VIBE_LOG_TARGET"] === "file";
}

export function enableMcpSilentMode(): void {
  mcpSilentMode = true;
}
